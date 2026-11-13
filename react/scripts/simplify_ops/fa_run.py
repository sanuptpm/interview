"""Re-run FastAPI examples with TestClient and rebuild their output in the original format.

Requests are read back from the item's current output (same blocks the Try-it editor parses).
Usage: python fa_run.py check          -> replay every item, report which reproduce exactly
       python fa_run.py apply          -> apply fa_changes.py, write fa_new.json
"""
import contextlib, http, io, json, os, re, sys, tempfile, warnings
warnings.filterwarnings("ignore")
from fastapi.testclient import TestClient

HERE = os.path.dirname(os.path.abspath(__file__))
REQ = re.compile(r"^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) (/\S*(?: \S+)*)$")
HDR = re.compile(r"^([A-Z][A-Za-z0-9-]*): (.*)$")
RHDR = re.compile(r"^([a-z][a-z0-9-]*): (.*)$")


def fmt_json(data):
    s = json.dumps(data, ensure_ascii=False)
    return s if len(s) <= 60 else json.dumps(data, indent=2, ensure_ascii=False)


def parse(output):
    """-> list of ('req', dict) / ('raw', text) blocks; Server console dropped."""
    blocks = []
    for b in output.split("\n\n"):
        lines = b.split("\n")
        if lines[0] == "Server console:":
            continue
        m = REQ.match(lines[0])
        if not m or "/openapi.json" in lines[0]:
            blocks.append(("raw", b)); continue
        r = dict(method=m.group(1), url=m.group(2), headers={}, body=None, show=[])
        i = 1
        while not lines[i].startswith("→"):
            h = HDR.match(lines[i])
            if h: r["headers"][h.group(1)] = h.group(2)
            else: r["body"] = lines[i]
            i += 1
        i += 1
        while i < len(lines) and RHDR.match(lines[i]):
            r["show"].append(RHDR.match(lines[i]).group(1)); i += 1
        r["has_body"] = i < len(lines)
        blocks.append(("req", r))
    return blocks


def run(code, blocks, setup=None):
    ns = {"__name__": "example"}
    buf = io.StringIO()
    cwd = os.getcwd()
    d = tempfile.mkdtemp(dir=os.path.join(HERE, "tmp"))
    os.chdir(d)
    out = []
    try:
        if setup: exec(setup, {})
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<example>", "exec"), ns)
            with TestClient(ns["app"]) as c:
                for kind, b in blocks:
                    if kind == "raw":
                        out.append(b); continue
                    kw = {"headers": b["headers"]} if b["headers"] else {}
                    lines = [f"{b['method']} {b['url']}"] + [f"{k}: {v}" for k, v in b["headers"].items()]
                    if b["body"] is not None:
                        lines.append(b["body"])
                        if b["body"].startswith("(form) "):
                            kw["data"] = dict(p.split("=", 1) for p in b["body"][7:].split("&"))
                        else:
                            kw["json"] = json.loads(b["body"])
                    resp = c.request(b["method"], b["url"], follow_redirects=False, **kw)
                    lines.append(f"→ {resp.status_code} {http.HTTPStatus(resp.status_code).phrase}")
                    for h in b["show"]:
                        lines.append(f"{h}: {resp.headers[h]}" if h in resp.headers else f"(no {h} header in the response)")
                    if b["has_body"] and resp.content:
                        if "application/json" in resp.headers.get("content-type", ""):
                            lines.append(fmt_json(resp.json()))
                        else:
                            lines.append(resp.text.rstrip("\n"))
                    out.append("\n".join(lines))
    finally:
        os.chdir(cwd)
    text = "\n\n".join(out)
    printed = buf.getvalue().rstrip()
    if printed:
        text += ("\n\n" if text else "") + "Server console:\n" + printed
    return text.strip()


def main():
    os.makedirs(os.path.join(HERE, "tmp"), exist_ok=True)
    items = json.load(open(os.path.join(HERE, "fa.json")))
    if sys.argv[1] == "check":
        ok = 0
        for x in items:
            try:
                got = run(x["code"], parse(x["output"]))
            except Exception as e:
                got = f"ERROR {e!r}"
            if got == x["output"]: ok += 1
            else: print("DIFF:", x["q"])
        print(ok, "/", len(items), "reproduce exactly")
        return
    sys.path.insert(0, HERE)
    from fa_changes import CHANGES
    by_q = {x["q"]: x for x in items}
    new = {}
    for q, ch in CHANGES.items():
        x = by_q[q]
        if ch.get("not_run"):
            out = x["output"]
        else:
            blocks = parse(x["output"])
            for kind, b in blocks:  # headers the new code no longer sends
                if kind == "req": b["show"] = [h for h in b["show"] if h not in ch.get("drop_show", [])]
            out = run(ch["code"], blocks, ch.get("setup"))
        if out != x["output"]:
            print(f"--- output changed: {q}\n{out}\n")
        new[q] = {"code": ch["code"], "output": out, "a": ch.get("a", x["a"])}
        print(f"{len(x['code'].splitlines()):3} -> {len(ch['code'].splitlines()):3}  {q}")
    json.dump(new, open(os.path.join(HERE, "fa_new.json"), "w"), indent=1, ensure_ascii=False)


main()
