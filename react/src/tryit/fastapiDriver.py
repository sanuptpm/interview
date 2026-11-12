# Runs a FastAPI app inside Pyodide (Python in the browser) without a server.
# Requests go straight into the ASGI app through httpx.ASGITransport, the same way
# FastAPI's TestClient works, but without threads (the browser has none).

import ast
import asyncio
import contextlib
import http
import io
import json
import linecache
import os
import re
import shutil
import sys
import traceback
import types
from urllib.parse import unquote, unquote_plus, urlsplit

import anyio.to_thread
import httpx


# FastAPI runs normal `def` endpoints and dependencies in a thread pool.
# Pyodide can't start threads, so run them directly instead.
async def _run_sync(func, *args, **kwargs):
    return func(*args)


async def _to_thread(func, /, *args, **kwargs):
    return func(*args, **kwargs)


anyio.to_thread.run_sync = _run_sync
asyncio.to_thread = _to_thread

# `uvicorn.run(app)` at the end of an example must not start a server.
_uvicorn = types.ModuleType("uvicorn")
_uvicorn.run = lambda *args, **kwargs: print("(uvicorn.run skipped: the app runs in your browser)")
sys.modules["uvicorn"] = _uvicorn

_WORK_DIR = "/home/pyodide/fastapi_run"
_APP_FILE = "main.py"
_REQUESTS_FILE = "requests.py"

# Response headers that are noise in the output (same idea as the recorded outputs).
_HIDDEN_RESPONSE = {"content-length", "date", "server", "last-modified", "accept-ranges", "vary"}
# Request headers that httpx adds by itself.
_HIDDEN_REQUEST = {"host", "accept", "accept-encoding", "connection", "content-length", "content-type"}


def _pretty_json(data):
    text = json.dumps(data, ensure_ascii=False)
    if len(text) <= 60:
        return text
    return json.dumps(data, indent=2, ensure_ascii=False)


def _status(code):
    try:
        return f"{code} {http.HTTPStatus(code).phrase}"
    except ValueError:
        return str(code)


def _request_body(request):
    try:
        content = request.content
    except Exception:
        try:
            content = b"".join(request.stream)
        except Exception:
            return None
    if not content:
        return None
    kind = request.headers.get("content-type", "")
    if "json" in kind:
        try:
            return json.dumps(json.loads(content), ensure_ascii=False)
        except ValueError:
            pass
    if "x-www-form-urlencoded" in kind:
        return "(form) " + unquote_plus(content.decode(errors="replace"))
    if "multipart/form-data" in kind:
        text = content.decode("latin-1")
        files = re.findall(r'name="([^"]+)"; filename="([^"]*)"\r\nContent-Type: ([^\r]+)', text)
        fields = re.findall(r'name="([^"]+)"\r\n\r\n([^\r]*)', text)
        parts = [f"{name}={filename}, {kind}" for name, filename, kind in files]
        parts += [f"{name}={value}" for name, value in fields]
        return "(multipart) " + "; ".join(parts)
    text = content.decode(errors="replace")
    return text if len(text) <= 300 else text[:300] + "..."


def _response_body(response):
    if not response.content:
        return None
    kind = response.headers.get("content-type", "")
    if "json" in kind:
        try:
            return _pretty_json(response.json())
        except ValueError:
            pass
    text = response.text.rstrip("\n")
    if len(text) > 600:
        text = text[:600] + f"\n... ({len(response.text) - 600} more characters)"
    return text


class _Session:
    def __init__(self):
        self.blocks = []

    def show(self, response):
        """Print a response like: GET /items/1 → 200 OK + JSON body."""
        if not isinstance(response, httpx.Response):
            raise TypeError("show() expects a response, e.g. r = await client.get('/'); show(r)")
        request = response.request
        lines = [f"{request.method} {unquote(request.url.raw_path.decode())}"]
        for raw_name, raw_value in request.headers.raw:  # keeps the header's own casing
            name, value = raw_name.decode("latin-1"), raw_value.decode("latin-1")
            lower = name.lower()
            if lower in _HIDDEN_REQUEST or (lower == "user-agent" and value == "testclient"):
                continue
            lines.append(f"{name}: {value}")
        body = _request_body(request)
        if body:
            lines.append(body)

        lines.append("→ " + _status(response.status_code))
        headers = response.headers
        for name, value in headers.multi_items():
            if name in _HIDDEN_RESPONSE:
                continue
            if name == "content-type" and "json" in value:
                continue
            if name == "etag" and "last-modified" in headers:
                continue
            lines.append(f"{name}: {value}")
        body = _response_body(response)
        if body:
            lines.append(body)
        self.blocks.append(lines)


class _WebSocket:
    """A tiny WebSocket client that talks to the ASGI app directly."""

    def __init__(self, app, session, path, headers=None):
        parts = urlsplit(path)
        self.session = session
        self.lines = [f"WS connect {path}"]
        session.blocks.append(self.lines)
        self.to_app = asyncio.Queue()
        self.from_app = asyncio.Queue()
        raw_headers = [(b"host", b"testserver"), (b"user-agent", b"testclient")]
        raw_headers += [(k.lower().encode(), str(v).encode()) for k, v in (headers or {}).items()]
        scope = {
            "type": "websocket",
            "asgi": {"version": "3.0"},
            "http_version": "1.1",
            "scheme": "ws",
            "server": ("testserver", 80),
            "client": ("testclient", 50000),
            "root_path": "",
            "path": unquote(parts.path or "/"),
            "raw_path": (parts.path or "/").encode(),
            "query_string": parts.query.encode(),
            "headers": raw_headers,
            "subprotocols": [],
            "state": {},
        }
        self.task = asyncio.ensure_future(app(scope, self.to_app.get, self.from_app.put))
        self.closed = False

    async def _next(self, timeout=5):
        getter = asyncio.ensure_future(self.from_app.get())
        done, _ = await asyncio.wait({getter, self.task}, timeout=timeout, return_when=asyncio.FIRST_COMPLETED)
        if getter in done:
            return getter.result()
        getter.cancel()
        if self.task.done():
            self.task.result()  # raises the app's error, if any
            raise RuntimeError("The WebSocket endpoint finished without sending anything")
        raise TimeoutError(f"No message from the server within {timeout}s")

    async def _connect(self):
        await self.to_app.put({"type": "websocket.connect"})
        message = await self._next()
        if message["type"] == "websocket.close":
            self.closed = True
            raise RuntimeError(f"The server rejected the WebSocket (code {message.get('code', 1000)})")
        return self

    async def send(self, text):
        self.lines.append(f"→ {text}")
        await self.to_app.put({"type": "websocket.receive", "text": str(text)})

    async def send_json(self, data):
        self.lines.append(f"→ {json.dumps(data, ensure_ascii=False)}")
        await self.to_app.put({"type": "websocket.receive", "text": json.dumps(data)})

    async def receive(self):
        message = await self._next()
        if message["type"] == "websocket.close":
            self.closed = True
            self.lines.append(f"(server closed the connection, code {message.get('code', 1000)})")
            return None
        data = message.get("text")
        if data is None:
            data = message.get("bytes")
        self.lines.append(f"← {data}")
        return data

    async def receive_json(self):
        data = await self.receive()
        return None if data is None else json.loads(data)

    async def close(self, code=1000):
        if not self.closed:
            self.closed = True
            await self.to_app.put({"type": "websocket.disconnect", "code": code})
        with contextlib.suppress(asyncio.TimeoutError):
            await asyncio.wait_for(asyncio.shield(self.task), 2)
        if self.task.done() and not self.task.cancelled():
            self.task.result()


def _find_app(namespace):
    from starlette.applications import Starlette

    app = namespace.get("app")
    if isinstance(app, Starlette):
        return app
    for value in namespace.values():
        if isinstance(value, Starlette):
            return value
    raise RuntimeError("No FastAPI app found. Create one with: app = FastAPI()")


def _user_traceback(error):
    """The traceback, but only the lines from the user's own code."""
    exc = traceback.TracebackException.from_exception(error)
    own = [frame for frame in exc.stack if frame.filename in (_APP_FILE, _REQUESTS_FILE)]
    lines = ["Traceback (most recent call last):\n"] if own else []
    if own:
        lines += traceback.StackSummary.from_list(own).format()
    lines += list(exc.format_exception_only())
    return "".join(lines).rstrip()


def _compile(source, filename, flags=0):
    # Register the source so tracebacks can show the failing line.
    linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)
    return compile(source, filename, "exec", flags=flags)


def _fresh_dir():
    os.chdir("/home/pyodide")
    shutil.rmtree(_WORK_DIR, ignore_errors=True)
    os.makedirs(_WORK_DIR, exist_ok=True)
    os.chdir(_WORK_DIR)


async def run_fastapi(app_code, requests_code):
    """Returns {"output": str, "console": str, "error": str | None}."""
    session = _Session()
    console = io.StringIO()
    error = None

    saved_env = dict(os.environ)  # requests may set env vars; undo that after the run
    _fresh_dir()
    for name in [name for name in sys.modules if name == "main" or name.startswith("main.")]:
        del sys.modules[name]
    module = types.ModuleType("main")
    module.__file__ = os.path.join(_WORK_DIR, _APP_FILE)
    sys.modules["main"] = module  # so Pydantic can resolve the models' module

    try:
        with contextlib.redirect_stdout(console), contextlib.redirect_stderr(console):
            exec(_compile(app_code, _APP_FILE), module.__dict__)
            app = _find_app(module.__dict__)

            transport = httpx.ASGITransport(app=app, client=("testclient", 50000))
            async with httpx.AsyncClient(
                transport=transport,
                base_url="http://testserver",
                headers={"user-agent": "testclient"},
            ) as client:

                async def websocket_connect(path, headers=None):
                    return await _WebSocket(app, session, path, headers)._connect()

                # The requests can also see the app's own variables (e.g. a log list).
                scope = dict(module.__dict__)
                scope.update({
                    "client": client,
                    "show": session.show,
                    "app": app,
                    "websocket_connect": websocket_connect,
                    "asyncio": asyncio,
                    "json": json,
                })
                compiled = _compile(requests_code, _REQUESTS_FILE, ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
                # Run startup/shutdown (lifespan, @app.on_event) around the requests.
                async with app.router.lifespan_context(app):
                    result = eval(compiled, scope)
                    if asyncio.iscoroutine(result):
                        await result
    except BaseException as exc:  # noqa: BLE001 - show every error to the user
        if isinstance(exc, (KeyboardInterrupt,)):
            raise
        error = _user_traceback(exc)
    finally:
        sys.modules.pop("main", None)
        os.environ.clear()
        os.environ.update(saved_env)
        os.chdir("/home/pyodide")

    output = "\n\n".join("\n".join(lines) for lines in session.blocks)
    return json.dumps({"output": output, "console": console.getvalue().rstrip(), "error": error})
