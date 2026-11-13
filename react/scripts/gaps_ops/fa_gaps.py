"""New FastAPI gap questions. Outputs are produced by running each example with TestClient
(via scripts/simplify_ops/fa_run.py). Writes fa_gaps.json = [{q, level, a, code, output, after, topic_after}].
Usage: scripts/.venv/bin/python scripts/gaps_ops/fa_gaps.py
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
# fa_run.py calls main() at import time, so load its helpers without that last line
_src = open(os.path.join(HERE, "..", "simplify_ops", "fa_run.py")).read().rsplit("\nmain()", 1)[0]
_fa = {"__file__": os.path.join(HERE, "fa_run.py"), "__name__": "fa_run"}  # temp dirs go to gaps_ops/tmp
exec(compile(_src, "fa_run.py", "exec"), _fa)
parse, run = _fa["parse"], _fa["run"]
from fastapi.testclient import TestClient  # noqa: E402

ITEMS = [
    dict(
        q="How do you validate path and query parameters with Path() and Query()?",
        level="Intermediate",
        after="What is the Annotated style for parameters, and why is it recommended?",
        a="Path() and Query() work like Pydantic's Field(), but for the URL: I add rules like ge, le, min_length, max_length or pattern, and FastAPI returns a 422 before my code runs if a rule fails. Path() is for values inside the URL path, which are always required, while Query() is for ?key=value parameters, which can have a default. I write them inside Annotated so the default stays a normal Python default. The limits also show up in /docs, so clients can see them.",
        code='''from typing import Annotated
from fastapi import FastAPI, Path, Query

app = FastAPI()

@app.get("/users/{user_id}/posts")
def posts(user_id: Annotated[int, Path(ge=1)],
          q: Annotated[str | None, Query(max_length=10)] = None):
    return {"user_id": user_id, "q": q}''',
        template="GET /users/5/posts?q=fastapi\n→\n{}\n\nGET /users/0/posts\n→\n{}",
    ),
    dict(
        q="What does Body() do, and what does embed=True mean?",
        level="Intermediate",
        after="How do you handle nested JSON with Pydantic models and lists?",
        a="Body() tells FastAPI to read a parameter from the JSON body, which I need for a single value like priority: int, because a plain int would be a query parameter. With embed=True a single model is expected under its own key, like {\"item\": {...}}, instead of being the whole body. When an endpoint has two or more body parameters FastAPI embeds them automatically, each under its parameter name. I use embed when I want the body shape to stay stable if I add more fields later.",
        code='''from typing import Annotated
from fastapi import Body, FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str

app = FastAPI()

@app.post("/items")
def create(item: Annotated[Item, Body(embed=True)]):
    return item''',
        template='POST /items\n{"item": {"name": "Pen"}}\n→\n{}\n\nPOST /items\n{"name": "Pen"}\n→\n{}',
    ),
    dict(
        q="What do model_dump() and model_dump_json() do?",
        level="Intermediate",
        after="How do Optional fields and default values work in a Pydantic model?",
        a="model_dump() turns a Pydantic model into a plain Python dict, and model_dump_json() turns it straight into a JSON string; in Pydantic v1 these were .dict() and .json(). Both take options like exclude_unset=True, exclude={...} and by_alias=True. I use model_dump(exclude_unset=True) a lot for PATCH updates, so only the fields the client actually sent are changed. To go the other way, from a dict to a model, I use Model.model_validate(data).",
        code='''from fastapi import FastAPI
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int | None = None

app = FastAPI()

@app.post("/users")
def create(user: User):
    return {"dict": user.model_dump(exclude_unset=True), "json": user.model_dump_json()}''',
        template='POST /users\n{"name": "Anu"}\n→\n{}',
    ),
    dict(
        q="How do you add a summary and description to an endpoint in the docs?",
        level="Basics",
        after="What automatic documentation does FastAPI give you?",
        a="I pass summary=\"...\" to the route decorator for the one-line title, and the function's docstring becomes the longer description, with Markdown support. response_description sets the text for the success response. If I skip summary, FastAPI builds one from the function name, like 'Get User', so good function names matter too. Clear summaries make /docs much easier for frontend developers to use.",
        code='''from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}", summary="Get one user",
         response_description="The user's public profile")
def get_user(user_id: int):
    """Returns a user by id. **Markdown** works here."""
    return {"id": user_id, "name": "Anu"}''',
        template="GET /users/1\n→\n{}",
        openapi=True,
    ),
    dict(
        q="What is the difference between OAuth2PasswordBearer and HTTPBearer?",
        level="Advanced",
        after="How do you implement authentication with OAuth2 and JWT?",
        a="Both read the token from the Authorization: Bearer header. OAuth2PasswordBearer is for the OAuth2 password flow: it takes a tokenUrl, so the Authorize button in /docs shows a username and password form, and it gives me just the token string. HTTPBearer is a plain bearer scheme with no login flow: /docs just asks for a token, and I get an object with scheme and credentials. I use HTTPBearer when tokens come from somewhere else, like Auth0 or Cognito, and OAuth2PasswordBearer when my own API has the /token login endpoint.",
        code='''from typing import Annotated
from fastapi import Depends, FastAPI
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
bearer = HTTPBearer()

@app.get("/me")
def me(creds: Annotated[HTTPAuthorizationCredentials, Depends(bearer)]):
    return {"scheme": creds.scheme, "token": creds.credentials}''',
        template="GET /me\nAuthorization: Bearer abc123\n→\n{}\n\nGET /me\n→\n{}",
    ),
    dict(
        q="What is SQLModel and how is it different from using SQLAlchemy with Pydantic?",
        level="Advanced",
        after="How do you connect FastAPI to a database?",
        a="SQLModel, by the FastAPI author, combines SQLAlchemy and Pydantic: one class is both the database table and the Pydantic model, so I don't write a separate ORM model and schema. With plain SQLAlchemy I write the table model and the Pydantic schemas separately and convert between them. SQLModel is great for small and medium apps, but for complex queries I still use SQLAlchemy features underneath. Even with SQLModel I keep separate create and read models, so clients can't send fields like id.",
        code='''from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine

class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str

engine = create_engine("sqlite:///heroes.db")
SQLModel.metadata.create_all(engine)
app = FastAPI()

@app.post("/heroes")
def add_hero(hero: Hero):
    with Session(engine) as session:
        session.add(hero); session.commit(); session.refresh(hero)
        return hero''',
        template='POST /heroes\n{"name": "Spider-Man"}\n→\n{}\n\nPOST /heroes\n{"name": "Iron Man"}\n→\n{}',
    ),
    dict(
        q="How do you cache expensive results on the server, for example with Redis?",
        level="Advanced",
        after="What is an ETag and how do you use it for caching?",
        a="For data that is slow to compute but changes rarely, I store the result in a cache and serve it from there until a TTL expires. In production I use Redis with SET key value EX 60, so all workers and pods share the cache; a Python dict or lru_cache only lives inside one process. The hard part is invalidation, so I either keep TTLs short or delete the key when the data changes. I also add a header like X-Cache: HIT or MISS, which makes debugging much easier.",
        code='''from fastapi import FastAPI, Response

app = FastAPI()
cache = {}  # real app: Redis with a TTL, e.g. SET rates <json> EX 60

@app.get("/rates")
def rates(response: Response):
    response.headers["X-Cache"] = "HIT" if "rates" in cache else "MISS"
    if "rates" not in cache:
        cache["rates"] = {"usd_inr": 83.2}  # pretend: slow API call
    return cache["rates"]''',
        template="GET /rates\n→\nx-cache: ?\n{}\n\nGET /rates\n→\nx-cache: ?\n{}",
    ),
]


def openapi_summary(code):
    ns = {"__name__": "example"}
    exec(compile(code, "<example>", "exec"), ns)
    spec = TestClient(ns["app"]).get("/openapi.json").json()
    lines = ["GET /openapi.json", "→ 200 OK"]
    for path, ops in spec["paths"].items():
        for method, op in ops.items():
            lines.append(f"{method.upper()} {path}:")
            lines.append(f"  summary: {op.get('summary')}")
            lines.append(f"  description: {op.get('description')}")
            lines.append(f"  200 response: {op['responses']['200']['description']}")
    lines.append("(summary of the generated OpenAPI schema)")
    return "\n".join(lines)


def main():
    os.makedirs(os.path.join(HERE, "tmp"), exist_ok=True)
    out = []
    for it in ITEMS:
        text = run(it["code"], parse(it["template"]))
        if it.get("openapi"):
            text += "\n\n" + openapi_summary(it["code"])
        print("=" * 70, "\n", it["q"], "\n", text)
        out.append({k: it[k] for k in ("q", "level", "a", "code", "after")} | {"output": text})
    json.dump(out, open(os.path.join(HERE, "fa_gaps.json"), "w"), indent=1, ensure_ascii=False)


main()
