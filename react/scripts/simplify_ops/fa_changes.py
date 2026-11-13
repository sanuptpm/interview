"""Second simplification pass for FastAPI examples still over 12 lines."""
import json, os, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
OLD = {x["q"]: x for x in json.load(open(os.path.join(HERE, "fa.json")))}


def C(s):
    return textwrap.dedent(s).strip("\n")


def join_app(q):
    """Drop the blank line between the imports and the first statement (app = FastAPI() etc.)."""
    lines = OLD[q]["code"].split("\n")
    i = next(i for i, l in enumerate(lines) if l == "")
    assert lines[i - 1].startswith(("from ", "import ")), q
    return "\n".join(lines[:i] + lines[i + 1:])


CHANGES = {}
for q in [
    "What happens to a request inside FastAPI, from arrival to response?",
    "How would you build basic CRUD routes?",
    "What is a 422 error and can you customize it?",
    "How do you document error responses with the responses parameter?",
    "What is a yield dependency and how do you use it for a DB session?",
    "What is middleware and how do you write one?",
    "How does a refresh token flow work?",
    "How do you add health check endpoints?",
    "What are sub-dependencies, and is a dependency called twice in one request?",
    "How do you implement authentication with OAuth2 and JWT?",
    "How do you validate emails and write custom validators?",
]:
    CHANGES[q] = {"code": join_app(q)}

CHANGES["What are lifespan events (startup and shutdown)?"] = {"code": C('''
    from contextlib import asynccontextmanager
    from fastapi import FastAPI

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        print("startup: load model, open DB pool")
        yield
        print("shutdown: close connections")

    app = FastAPI(lifespan=lifespan)
    @app.get("/")
    def home():
        return {"status": "ready"}
''')}

CSV_Q = "How do you stream a large CSV export?"
CHANGES[CSV_Q] = {
    "drop_show": ["content-disposition"],
    "code": C('''
        from fastapi import FastAPI
        from fastapi.responses import StreamingResponse
        app = FastAPI()

        def csv_rows():  # real app: read rows from the DB in batches
            yield "id,product\\n"
            for i in range(1, 4):
                yield f"{i},item-{i}\\n"

        @app.get("/export.csv")
        def export():
            return StreamingResponse(csv_rows(), media_type="text/csv")
    '''),
    "a": OLD[CSV_Q]["a"].replace(
        "I set media_type to text/csv, plus a Content-Disposition header so the browser saves it as a file.",
        "I set media_type to text/csv, and in a real app I add a Content-Disposition header so the browser saves it as a file."),
}

STRUCT_Q = "How would you structure a large FastAPI app with routers, services and repositories?"
CHANGES[STRUCT_Q] = {
    "code": C('''
        from fastapi import APIRouter, FastAPI

        def find_user(user_id):  # repository: the only code that talks to the DB
            return {"id": user_id, "email": "ANU@X.COM"}

        def get_user(user_id):  # service: business rules
            user = find_user(user_id)
            return user | {"email": user["email"].lower()}

        router = APIRouter(prefix="/users")  # router: HTTP only

        @router.get("/{user_id}")
        def read_user(user_id: int):
            return get_user(user_id)

        app = FastAPI()
        app.include_router(router)
    '''),
    "a": OLD[STRUCT_Q]["a"].replace(
        "Dependencies wire them together, so in tests I can override the service or the repository with a fake. Here it's one file to keep it runnable, but in a real project each class lives in its own module inside a feature package like app/users/.",
        "Here they are plain functions in one file to keep it short, but in a real project each layer lives in its own module inside a feature package like app/users/, and I wire them with Depends so in tests I can override the service or the repository with a fake."),
}

SCOPES_Q = "How do OAuth2 scopes work in FastAPI?"
CHANGES[SCOPES_Q] = {
    "code": C('''
        from fastapi import FastAPI, HTTPException, Security
        from fastapi.security import OAuth2PasswordBearer, SecurityScopes
        app = FastAPI()
        oauth2 = OAuth2PasswordBearer(tokenUrl="token")
        TOKENS = {"reader-token": ["items:read"], "admin-token": ["items:read", "items:write"]}

        def check_scopes(needed: SecurityScopes, token: str = Security(oauth2)):
            for scope in needed.scopes:
                if scope not in TOKENS.get(token, []):
                    raise HTTPException(403, f"Missing scope: {scope}")

        @app.post("/items", dependencies=[Security(check_scopes, scopes=["items:write"])])
        def create_item():
            return {"created": True}
    '''),
    "a": OLD[SCOPES_Q]["a"].replace("I declare them on OAuth2PasswordBearer, ask for them", "I ask for them"),
}

CHANGES["How do you add a request ID to every request?"] = {"code": C('''
    import uuid
    from fastapi import FastAPI
    app = FastAPI()

    @app.middleware("http")
    async def add_request_id(request, call_next):
        rid = request.headers.get("X-Request-ID") or uuid.uuid4().hex
        response = await call_next(request)
        response.headers["X-Request-ID"] = rid
        return response

    @app.get("/orders")
    def orders():
        return []
''')}

CHANGES["How do you add observability: logging, metrics and tracing?"] = {"code": C('''
    import json
    from fastapi import FastAPI
    app = FastAPI()

    @app.middleware("http")
    async def log_json(request, call_next):
        response = await call_next(request)
        route = request.scope["route"].path  # template, not the real URL
        print(json.dumps({"route": route, "status": response.status_code}))
        return response

    @app.get("/items/{item_id}")
    def get_item(item_id: int):
        return {"id": item_id}
''')}

STATIC_Q = "How do you serve static files, send a file download, or mount a sub-application?"
CHANGES[STATIC_Q] = {"code": C('''
    from pathlib import Path
    from fastapi import FastAPI
    from fastapi.responses import FileResponse
    from fastapi.staticfiles import StaticFiles

    Path("static").mkdir(exist_ok=True)
    Path("static/hello.txt").write_text("Hello from a static file")  # demo file
    app = FastAPI()
    app.mount("/static", StaticFiles(directory="static"), name="static")

    @app.get("/download")
    def download():
        return FileResponse("static/hello.txt", filename="report.txt")
''')}

CHANGES["How do you use async SQLAlchemy with FastAPI?"] = {"not_run": True, "code": C('''
    from fastapi import Depends, FastAPI
    from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
    engine = create_async_engine("postgresql+asyncpg://app:secret@db/shop")
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    app = FastAPI()

    async def get_session():
        async with SessionLocal() as session:
            yield session

    @app.get("/users/{user_id}")
    async def get_user(user_id: int, session=Depends(get_session)):
        return await session.get(User, user_id)  # User = your ORM model
''')}

CF_Q = "How do you validate fields together and add computed fields?"
CHANGES[CF_Q] = {"code": C('''
    from fastapi import FastAPI
    from pydantic import BaseModel, computed_field, model_validator

    class Stay(BaseModel):
        check_in: int
        check_out: int

        @model_validator(mode="after")
        def check_dates(self):
            if self.check_out <= self.check_in:
                raise ValueError("check_out must be after check_in")
            return self

        @computed_field
        def nights(self) -> int:
            return self.check_out - self.check_in

    app = FastAPI()
    @app.post("/stays")
    def create_stay(stay: Stay):
        return stay
''')}
