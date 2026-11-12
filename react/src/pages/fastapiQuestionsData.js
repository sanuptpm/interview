// FastAPI interview questions, basics to advanced.
// Every output below was produced by running the example code with
// FastAPI's TestClient (or a real terminal command), not written by hand.

export const questions = [
  {
    q: "What is FastAPI and why would you use it over Flask or Django?",
    level: 'Basics',
    a: "FastAPI is a modern Python web framework for building APIs, built on Starlette and Pydantic. I like it because it uses normal Python type hints to validate requests, convert data, and generate API docs automatically, so I write less code and get fewer bugs. Compared to Flask it has built-in validation and async support, and compared to Django it is lighter and focused only on APIs. For a full website with admin and templates I might still pick Django, but for a JSON API I pick FastAPI.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/square/{n}")
def square(n: int):  # type hint = validation + conversion
    return {"n": n, "square": n * n}`,
    output: `GET /square/7
→ 200 OK
{"n": 7, "square": 49}

GET /square/seven
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "path",
        "n"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "seven"
    }
  ]
}`,
  },
  {
    q: "What is ASGI vs WSGI, and what is Uvicorn?",
    level: 'Basics',
    a: "WSGI is the older Python server standard used by Flask and classic Django, and it handles one request per worker at a time in a blocking way. ASGI is the async version, so one worker can handle many requests while others are waiting on I/O, and it also supports WebSockets. FastAPI is an ASGI app, and Uvicorn is the ASGI server that actually runs it. In this example the route awaits without blocking the event loop, so the same worker can serve other requests meanwhile.",
    code: `import asyncio
from fastapi import FastAPI

app = FastAPI()  # run it with the ASGI server: uvicorn main:app

@app.get("/slow")
async def slow():
    await asyncio.sleep(0.1)  # other requests run while this waits
    return {"done": True}`,
    output: `GET /slow
→ 200 OK
{"done": true}`,
  },
  {
    q: "How do you create a minimal FastAPI app and run it?",
    level: 'Basics',
    a: "I create a FastAPI() instance, add a route with a decorator like @app.get, and return a dict, which FastAPI turns into JSON. Then I run it with Uvicorn using uvicorn main:app --reload, where main is the file name and app is the variable. In newer versions I can also use fastapi dev main.py during development. I only use --reload in development, never in production.",
    code: `# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Run it:  uvicorn main:app --reload`,
    output: `$ uvicorn main:app --reload
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [80750] using StatReload
INFO:     Started server process [80752]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:59088 - "GET / HTTP/1.1" 200 OK

$ curl http://127.0.0.1:8000/
{"Hello":"World"}`,
  },
  {
    q: "How would you structure a small FastAPI project?",
    level: 'Basics',
    a: "I keep main.py tiny: it only creates the app and includes the routers. Each feature gets its own router file, the Pydantic schemas live in schemas.py, database code in db.py, and settings in config.py, with tests in a separate tests folder. That way a new teammate can find things quickly, and when the project grows I can split each feature into its own package without rewriting everything.",
    code: `shop-api/
├── app/
│   ├── main.py        # creates the app, includes the routers
│   ├── config.py      # settings
│   ├── db.py          # database session
│   ├── schemas.py     # Pydantic models
│   └── routers/
│       └── users.py   # the /users routes (an APIRouter)
├── tests/
└── .env               # secrets, never committed`,
    output: `What goes where (a layout, not a program run):
main.py     wiring only: create app, include routers
routers/    one file per feature, only HTTP concerns
schemas.py  what the API accepts and returns
config.py   settings read from env vars / .env
tests/      pytest + TestClient, mirrors the routers`,
  },
  {
    q: "What happens to a request inside FastAPI, from arrival to response?",
    level: 'Basics',
    a: "The request first passes through the middleware, then FastAPI matches the route, runs the dependencies and validates the path, query and body against my type hints. If validation fails it returns 422 without calling my function at all, as the second request shows. Otherwise my function runs, its return value is filtered by the response_model and turned into JSON, and the response goes back out through the middleware. Knowing this order helps me decide where code belongs: cross-cutting things in middleware, per-route checks in dependencies.",
    code: `from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def log_steps(request: Request, call_next):
    print("1. middleware: request in")
    return await call_next(request)

@app.get("/items/{item_id}")
def read_item(item_id: int):
    print("2. route function runs")
    return {"item_id": item_id}  # turned into JSON`,
    output: `GET /items/5
→ 200 OK
{"item_id": 5}

GET /items/abc
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "path",
        "item_id"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "abc"
    }
  ]
}

Server console:
1. middleware: request in
2. route function runs
1. middleware: request in`,
  },
  {
    q: "What automatic documentation does FastAPI give you?",
    level: 'Basics',
    a: "FastAPI generates an OpenAPI schema from my routes, type hints, and Pydantic models. It serves interactive Swagger UI at /docs, where I can try requests from the browser, and ReDoc at /redoc for clean read-only docs. The raw schema is at /openapi.json, which frontend teams can use to generate clients. Tip: adding a title, summary, and tags makes the docs much easier to read.",
    code: `from fastapi import FastAPI

app = FastAPI(title="Shop API")

@app.get("/items/{item_id}", tags=["items"])
def read_item(item_id: int):
    return {"item_id": item_id}`,
    output: `GET /docs
→ 200 OK
content-type: text/html; charset=utf-8
(Swagger UI HTML page)

GET /openapi.json
→ 200 OK
title: Shop API
paths: /items/{item_id}
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do you hide an endpoint from the docs or mark it as deprecated?",
    level: 'Basics',
    a: "I pass include_in_schema=False to the decorator for internal routes like a metrics or debug endpoint; it still works, it just doesn't appear in /docs. For an old route I want clients to move away from, I set deprecated=True, and Swagger shows it crossed out. Hiding a route is not security, so I still protect it with auth.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/v1/users", deprecated=True)
def list_users_old():
    return ["anu", "ravi"]

@app.get("/internal/metrics", include_in_schema=False)
def metrics():
    return {"requests": 1024}`,
    output: `GET /internal/metrics
→ 200 OK
{"requests": 1024}
(still works, just hidden from /docs)

GET /openapi.json
→ 200 OK
paths in the docs: /v1/users
GET /v1/users: summary='List Users Old', deprecated=True
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do path parameters work, and what happens with the wrong type?",
    level: 'Basics',
    a: "A path parameter is part of the URL, written in curly braces like /items/{item_id}. I add a type hint such as int, and FastAPI converts the string from the URL to that type. If the value can't be converted, FastAPI returns a 422 error automatically, so I don't write that check myself. Tip: put fixed routes like /users/me before /users/{user_id}, because routes are matched in order.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}`,
    output: `GET /items/5
→ 200 OK
{"item_id": 5}

GET /items/abc
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "path",
        "item_id"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "abc"
    }
  ]
}`,
  },
  {
    q: "How do you restrict a path parameter to fixed values with an Enum?",
    level: 'Basics',
    a: "I create a class that inherits from both str and Enum, and use it as the type hint of the path parameter. FastAPI then only accepts those values, returns a 422 listing the allowed options for anything else, and shows a dropdown in the docs. Inside the function I can compare against the enum members, so I don't have magic strings all over the code.",
    code: `from enum import Enum
from fastapi import FastAPI

app = FastAPI()

class Category(str, Enum):
    books = "books"
    toys = "toys"

@app.get("/products/{category}")
def by_category(category: Category):
    return {"category": category}`,
    output: `GET /products/books
→ 200 OK
{"category": "books"}

GET /products/cars
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "enum",
      "loc": [
        "path",
        "category"
      ],
      "msg": "Input should be 'books' or 'toys'",
      "input": "cars",
      "ctx": {
        "expected": "'books' or 'toys'"
      }
    }
  ]
}`,
  },
  {
    q: "Why does route order matter, for example /users/me vs /users/{user_id}?",
    level: 'Basics',
    a: "FastAPI checks routes in the order I declare them and uses the first one that matches. If /users/{user_id} comes first, a request to /users/me matches it, tries to convert \"me\" to an int and returns a 422. So I always declare fixed paths like /users/me before the path with a parameter. In this example the routes are in the wrong order on purpose, so /users/me never reaches its own function.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")  # declared first: catches "me" too
def get_user(user_id: int):
    return {"user_id": user_id}

@app.get("/users/me")  # never reached: move it above
def me():
    return {"user": "current user"}`,
    output: `GET /users/7
→ 200 OK
{"user_id": 7}

GET /users/me
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "path",
        "user_id"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "me"
    }
  ]
}`,
  },
  {
    q: "How does FastAPI handle trailing slashes?",
    level: 'Basics',
    a: "If I declare /items/ and a client calls /items, FastAPI answers with a 307 redirect to the other form, and the same happens the other way round. Browsers and TestClient follow it, but it costs an extra round trip, and some clients drop the Authorization header or fail CORS preflight on a redirect. So I pick one style for the whole API, usually without the slash, and tell frontend developers to match it exactly. I can turn the redirect off with FastAPI(redirect_slashes=False), and then the wrong form is simply a 404.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")  # declared WITH a trailing slash
def list_items():
    return ["pen", "cup"]

@app.get("/users")  # declared WITHOUT a trailing slash
def list_users():
    return ["anu"]`,
    output: `GET /items/
→ 200 OK
["pen", "cup"]

GET /items
→ 307 Temporary Redirect
location: http://testserver/items/

GET /users/
→ 307 Temporary Redirect
location: http://testserver/users`,
  },
  {
    q: "How do query parameters work? How do you make them optional?",
    level: 'Basics',
    a: "Any function parameter that is not in the path and is a simple type becomes a query parameter, like ?q=pen&limit=10. If I give it a default value it's optional, and if I use str | None = None it can be left out completely. Without a default it becomes required. FastAPI also converts types, so limit=2 arrives as an int.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
def list_items(limit: int = 10, q: str | None = None):
    return {"limit": limit, "q": q}`,
    output: `GET /items
→ 200 OK
{"limit": 10, "q": null}

GET /items?q=pen&limit=2
→ 200 OK
{"limit": 2, "q": "pen"}`,
  },
  {
    q: "How do you accept a list of values in a query parameter?",
    level: 'Basics',
    a: "I declare the parameter as list[str] and wrap it with Query(), because without Query() FastAPI would think a list means a JSON body. Then the client repeats the key, like ?tag=red&tag=blue, and I get a normal Python list. I give it a default of None or an empty list so it stays optional.",
    code: `from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/products")
def filter_products(tag: Annotated[list[str] | None, Query()] = None):
    return {"tags": tag}`,
    output: `GET /products?tag=red&tag=blue
→ 200 OK
{"tags": ["red", "blue"]}

GET /products
→ 200 OK
{"tags": null}`,
  },
  {
    q: "How are boolean query parameters converted?",
    level: 'Basics',
    a: "When I type a query parameter as bool, FastAPI accepts more than just true and false: 1, yes, on and true (any case) become True, and 0, no, off and false become False. Anything else, like maybe, gets a 422. I give it a default, like False, so the parameter is optional and the frontend can just leave it out.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/products")
def products(in_stock: bool = False):
    return {"in_stock": in_stock}`,
    output: `GET /products?in_stock=true
→ 200 OK
{"in_stock": true}

GET /products?in_stock=Yes
→ 200 OK
{"in_stock": true}

GET /products?in_stock=0
→ 200 OK
{"in_stock": false}

GET /products?in_stock=off
→ 200 OK
{"in_stock": false}

GET /products
→ 200 OK
{"in_stock": false}

GET /products?in_stock=maybe
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "bool_parsing",
      "loc": [
        "query",
        "in_stock"
      ],
      "msg": "Input should be a valid boolean, unable to interpret input",
      "input": "maybe"
    }
  ]
}`,
  },
  {
    q: "How do you accept a JSON request body?",
    level: 'Basics',
    a: "I define a Pydantic model that describes the JSON shape and use it as the type of a function parameter. FastAPI reads the body, validates every field, converts the types, and gives me a real Python object. If a required field is missing or has the wrong type, the client gets a 422 with details. Fields with defaults or None are optional.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

app = FastAPI()

@app.post("/items")
def create_item(item: Item):
    return {"saved": item.name, "price": item.price}`,
    output: `POST /items
{"name": "Pen", "price": 10}
→ 200 OK
{"saved": "Pen", "price": 10.0}

POST /items
{"name": "Pen"}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "price"
      ],
      "msg": "Field required",
      "input": {
        "name": "Pen"
      }
    }
  ]
}`,
  },
  {
    q: "How do you handle nested JSON with Pydantic models and lists?",
    level: 'Basics',
    a: "I build small models and use them as field types, like list[Item] for an array of objects, and the same works for a model inside another model, like an Address inside an Order. FastAPI validates the whole tree, and if something deep inside is wrong, the error loc tells me the exact path, like body > 1 > qty. I get real objects back, so I can write item.qty with autocomplete instead of digging through dicts.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    qty: int

@app.post("/orders")
def create_order(items: list[Item]):  # a JSON array of objects
    return {"total_qty": sum(item.qty for item in items)}`,
    output: `POST /orders
[{"name": "Pen", "qty": 3}, {"name": "Book", "qty": 1}]
→ 200 OK
{"total_qty": 4}

POST /orders
[{"name": "Pen", "qty": 3}, {"name": "Book", "qty": "two"}]
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "body",
        1,
        "qty"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "two"
    }
  ]
}`,
  },
  {
    q: "How do Optional fields and default values work in a Pydantic model?",
    level: 'Basics',
    a: "A field with no default is required, and a field with a default is optional. The type str | None only means the value is allowed to be null; it is still required unless I also write = None. For lists or dicts I use Field(default_factory=list) so every object gets its own fresh list. This difference between \"can be null\" and \"can be missing\" is a common interview trap.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Profile(BaseModel):
    bio: str | None = None   # optional, may be null
    nickname: str | None     # required, but null is allowed

@app.post("/profiles")
def create_profile(profile: Profile):
    return profile`,
    output: `POST /profiles
{"nickname": null}
→ 200 OK
{"bio": null, "nickname": null}

POST /profiles
{}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "nickname"
      ],
      "msg": "Field required",
      "input": {}
    }
  ]
}`,
  },
  {
    q: "What is response_model and why use it?",
    level: 'Basics',
    a: "response_model tells FastAPI what shape the response should have. FastAPI filters the returned data through that model, so extra fields like a password are removed automatically, and it also shows the correct schema in the docs. I usually have separate input and output models, like UserIn and UserOut. This is a simple way to avoid leaking sensitive data.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

class UserOut(BaseModel):
    username: str

app = FastAPI()

@app.get("/users/{name}", response_model=UserOut)
def get_user(name: str):
    return {"username": name, "password": "secret"}  # password is filtered out`,
    output: `GET /users/anu
→ 200 OK
{"username": "anu"}`,
  },
  {
    q: "How do you return a list of models and hide empty fields?",
    level: 'Basics',
    a: "I can use a return type like -> list[ItemOut] (or response_model=list[ItemOut]), and FastAPI validates and filters every item in the list. Fields that are not in ItemOut, like an internal cost, are dropped. With response_model_exclude_none=True, fields whose value is None are left out, which keeps mobile payloads small. I prefer the return type style because my editor also understands it.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ItemOut(BaseModel):
    name: str
    discount: int | None = None

@app.get("/items", response_model_exclude_none=True)
def list_items() -> list[ItemOut]:
    return [{"name": "Pen", "cost": 4}, {"name": "Bag", "discount": 10}]`,
    output: `GET /items
→ 200 OK
[{"name": "Pen"}, {"name": "Bag", "discount": 10}]`,
  },
  {
    q: "How does FastAPI turn return values into JSON, and what is jsonable_encoder?",
    level: 'Basics',
    a: "When I return a dict or a Pydantic model, FastAPI runs it through jsonable_encoder, which converts types JSON doesn't know, like datetime, UUID and Decimal, into strings or numbers, and then wraps it in a JSONResponse. I call jsonable_encoder myself when I build a JSONResponse by hand or store data in a JSON column or cache, because json.dumps would fail on a datetime.",
    code: `from datetime import datetime
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder

app = FastAPI()
order = {"id": 1, "placed_at": datetime(2026, 1, 15, 10, 30)}

@app.get("/order")
def get_order():
    print(jsonable_encoder(order))  # what I'd store in a cache
    return order  # FastAPI encodes it for me`,
    output: `GET /order
→ 200 OK
{"id": 1, "placed_at": "2026-01-15T10:30:00"}

Server console:
{'id': 1, 'placed_at': '2026-01-15T10:30:00'}`,
  },
  {
    q: "How do you use field aliases and response_model_exclude?",
    level: 'Basics',
    a: "An alias lets the JSON use a different name than my Python attribute, for example userName from a JavaScript frontend while I keep user_name in Python. By default FastAPI also uses the alias in the response. response_model_exclude and response_model_include let one model return fewer fields for a specific route. They work, but for anything important I prefer a separate output model because it is clearer in the docs.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class User(BaseModel):
    user_name: str = Field(alias="userName")
    email: str

@app.post("/users", response_model=User, response_model_exclude={"email"})
def create_user(user: User):
    return user`,
    output: `POST /users
{"userName": "anu", "email": "anu@example.com"}
→ 200 OK
{"userName": "anu"}`,
  },
  {
    q: "How do you set HTTP status codes?",
    level: 'Basics',
    a: "I set the default success code in the decorator with status_code, for example 201 for create and 204 for delete. I use the status module constants so the code is readable. For errors I raise HTTPException with the right code. A 204 response should have no body, so I return nothing.",
    code: `from fastapi import FastAPI, status

app = FastAPI()

@app.post("/notes", status_code=status.HTTP_201_CREATED)
def create_note(text: str):
    return {"text": text}

@app.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int):
    pass  # 204 = no body`,
    output: `POST /notes?text=buy milk
→ 201 Created
{"text": "buy milk"}

DELETE /notes/1
→ 204 No Content`,
  },
  {
    q: "How do you set custom response headers or change the status code at runtime?",
    level: 'Basics',
    a: "I add a parameter of type Response to my route, and FastAPI gives me the response object it will send. I can set headers like Cache-Control or a custom X- header on it, and still return a normal dict. I can also change response.status_code based on logic, for example 201 when an upsert creates something new and 200 when it only updates.",
    code: `from fastapi import FastAPI, Response

app = FastAPI()
settings = {}

@app.put("/settings/{key}")
def upsert_setting(key: str, value: str, response: Response):
    response.headers["Cache-Control"] = "no-store"
    if key not in settings:
        response.status_code = 201  # created
    settings[key] = value
    return {key: value}`,
    output: `PUT /settings/theme?value=dark
→ 201 Created
cache-control: no-store
{"theme": "dark"}

PUT /settings/theme?value=light
→ 200 OK
{"theme": "light"}`,
  },
  {
    q: "How would you build basic CRUD routes?",
    level: 'Basics',
    a: "I map each action to an HTTP method: GET to read, POST to create, PUT to update, and DELETE to remove. Here I show GET and POST with an in-memory dict just to show the idea; PUT and DELETE follow the same pattern, and in a real app this would be a database. In a real app I'd also return 404 when an item doesn't exist (see the HTTPException question). This keeps the API predictable and RESTful.",
    code: `from fastapi import FastAPI

app = FastAPI()
todos = {}  # in-memory "database"

@app.get("/todos")
def list_todos():
    return todos

@app.post("/todos", status_code=201)
def create_todo(title: str):
    todos[len(todos) + 1] = title
    return todos`,
    output: `POST /todos?title=Learn FastAPI
→ 201 Created
{"1": "Learn FastAPI"}

GET /todos
→ 200 OK
{"1": "Learn FastAPI"}`,
  },
  {
    q: "What is the difference between PUT and PATCH, and how do you do a partial update?",
    level: 'Basics',
    a: "PUT replaces the whole resource, so fields I don't send go back to their defaults. PATCH changes only the fields I send. For PATCH I use a model where every field is optional, and model_dump(exclude_unset=True) gives me only the fields the client actually sent, which I then merge into the stored item. In a real app I'd also return 404 from PATCH when the id doesn't exist.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ItemUpdate(BaseModel):  # every field optional
    name: str | None = None
    price: float | None = None

@app.patch("/items/{item_id}")
def update_item(item_id: int, changes: ItemUpdate):
    return changes.model_dump(exclude_unset=True)  # only what was sent`,
    output: `PATCH /items/1
{"price": 12.5}
→ 200 OK
{"price": 12.5}

PATCH /items/1
{"name": "Pen Pro"}
→ 200 OK
{"name": "Pen Pro"}`,
  },
  {
    q: "How does FastAPI decide if a parameter is path, query, or body?",
    level: 'Basics',
    a: "If the name is in the URL path, it's a path parameter. If it's a simple type like int or str and not in the path, it's a query parameter. If it's a Pydantic model, it's read from the JSON body. I can use them all together in one endpoint, and I can be explicit with Path(), Query(), and Body() when I need extra rules.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str

app = FastAPI()

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item, notify: bool = False):
    #           path ^        body ^      query ^
    return {"item_id": item_id, "item": item, "notify": notify}`,
    output: `PUT /items/3?notify=true
{"name": "Pen"}
→ 200 OK
{"item_id": 3, "item": {"name": "Pen"}, "notify": true}`,
  },
  {
    q: "How do you add validation rules with Pydantic Field?",
    level: 'Intermediate',
    a: "I use Field() inside the model to add rules like min_length, max_length, gt (greater than), and ge (greater or equal). For query and path parameters I use Query() and Path() with the same kind of rules. FastAPI checks all of them before my code runs and returns every error at once. These rules also show up in the docs.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(min_length=2)
    price: float = Field(gt=0)

app = FastAPI()

@app.post("/products")
def create_product(product: Product):
    return product`,
    output: `POST /products
{"name": "Pen", "price": 10}
→ 200 OK
{"name": "Pen", "price": 10.0}

POST /products
{"name": "P", "price": -5}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": [
        "body",
        "name"
      ],
      "msg": "String should have at least 2 characters",
      "input": "P",
      "ctx": {
        "min_length": 2
      }
    },
    {
      "type": "greater_than",
      "loc": [
        "body",
        "price"
      ],
      "msg": "Input should be greater than 0",
      "input": -5,
      "ctx": {
        "gt": 0.0
      }
    }
  ]
}`,
  },
  {
    q: "What is the Annotated style for parameters, and why is it recommended?",
    level: 'Intermediate',
    a: "With Annotated I write the type first and put the FastAPI info as metadata, like Annotated[int, Query(gt=0)]. It is the style the FastAPI docs recommend now, because the default value stays a normal Python default and the function still works if I call it outside FastAPI. I can also save a common rule as a type alias, like Limit, and reuse it in many routes. Here I validate a range with gt/le.",
    code: `from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()
Limit = Annotated[int, Query(gt=0, le=50)]  # reusable rule

@app.get("/items")
def read_items(limit: Limit = 10):
    return {"limit": limit}`,
    output: `GET /items?limit=5
→ 200 OK
{"limit": 5}

GET /items?limit=100
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": [
        "query",
        "limit"
      ],
      "msg": "Input should be less than or equal to 50",
      "input": "100",
      "ctx": {
        "le": 50
      }
    }
  ]
}`,
  },
  {
    q: "How do you add filtering, sorting and limit/offset pagination to a list endpoint?",
    level: 'Intermediate',
    a: "I take optional filter parameters, a sort parameter restricted with Literal so only known fields are allowed, and limit and offset (in a real app with bounds via Query). I filter first, then sort, then count the total, and only then slice, so the total is the number of matches and not the page size. With a real database each step becomes WHERE, ORDER BY, a COUNT query and LIMIT/OFFSET, and I never put the raw sort value into SQL without whitelisting it.",
    code: `from typing import Literal
from fastapi import FastAPI

app = FastAPI()
PRODUCTS = [{"name": "Pen", "price": 10}, {"name": "Mug", "price": 150},
            {"name": "Bowl", "price": 90}]

@app.get("/products")
def list_products(max_price: int = 1000, sort: Literal["name", "price"] = "name",
                  limit: int = 2, offset: int = 0):
    rows = sorted((p for p in PRODUCTS if p["price"] <= max_price), key=lambda p: p[sort])
    return {"total": len(rows), "items": rows[offset:offset + limit]}`,
    output: `GET /products?max_price=100&sort=price
→ 200 OK
{
  "total": 2,
  "items": [
    {
      "name": "Pen",
      "price": 10
    },
    {
      "name": "Bowl",
      "price": 90
    }
  ]
}

GET /products?sort=color
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "literal_error",
      "loc": [
        "query",
        "sort"
      ],
      "msg": "Input should be 'name' or 'price'",
      "input": "color",
      "ctx": {
        "expected": "'name' or 'price'"
      }
    }
  ]
}`,
  },
  {
    q: "How do you validate emails and write custom validators?",
    level: 'Intermediate',
    a: "For emails I use EmailStr from Pydantic, which needs the email-validator package (pip install \"pydantic[email]\"). For my own rules I write a function with @field_validator, raise ValueError if the value is bad, and return the value if it's good. FastAPI turns that ValueError into a normal 422 error. Here my validator only allows company emails.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, field_validator

class SignUp(BaseModel):
    email: EmailStr
    @field_validator("email")
    def company_only(cls, v):
        if not v.endswith("@example.com"):
            raise ValueError("use your company email")
        return v

app = FastAPI()

@app.post("/signup")
def signup(data: SignUp):
    return data`,
    output: `POST /signup
{"email": "anu@example.com"}
→ 200 OK
{"email": "anu@example.com"}

POST /signup
{"email": "anu@gmail.com"}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "value_error",
      "loc": [
        "body",
        "email"
      ],
      "msg": "Value error, use your company email",
      "input": "anu@gmail.com",
      "ctx": {
        "error": {}
      }
    }
  ]
}`,
  },
  {
    q: "How do you validate fields together and add computed fields?",
    level: 'Intermediate',
    a: "When a rule depends on more than one field, like check_out must be after check_in, I use @model_validator(mode=\"after\"), which runs once all fields are valid. If I raise ValueError, FastAPI turns it into a 422. For values derived from other fields, like the number of nights, I use @computed_field, so they appear in the response and the docs without being sent by the client.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, computed_field, model_validator

app = FastAPI()

class Stay(BaseModel):
    check_in: int   # day numbers keep the example short
    check_out: int

    @model_validator(mode="after")
    def check_dates(self):
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        return self

    @computed_field
    def nights(self) -> int:
        return self.check_out - self.check_in

@app.post("/stays")
def create_stay(stay: Stay):
    return stay`,
    output: `POST /stays
{"check_in": 1, "check_out": 4}
→ 200 OK
{"check_in": 1, "check_out": 4, "nights": 3}

POST /stays
{"check_in": 4, "check_out": 1}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "value_error",
      "loc": [
        "body"
      ],
      "msg": "Value error, check_out must be after check_in",
      "input": {
        "check_in": 4,
        "check_out": 1
      },
      "ctx": {
        "error": {}
      }
    }
  ]
}`,
  },
  {
    q: "How do you configure model behavior with model_config?",
    level: 'Intermediate',
    a: "In Pydantic v2 I set model_config = ConfigDict(...) on the model. extra=\"forbid\" rejects unknown fields, which protects me from a client sneaking in something like role=admin. str_strip_whitespace cleans up text input before validation, so I don't repeat that in every route. Other useful options are str_to_lower, frozen=True for read-only objects and from_attributes=True for ORM objects.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

app = FastAPI()

class SignUp(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    username: str

@app.post("/signup")
def signup(data: SignUp):
    return data`,
    output: `POST /signup
{"username": "  anu  "}
→ 200 OK
{"username": "anu"}

POST /signup
{"username": "anu", "role": "admin"}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "extra_forbidden",
      "loc": [
        "body",
        "role"
      ],
      "msg": "Extra inputs are not permitted",
      "input": "admin"
    }
  ]
}`,
  },
  {
    q: "What is a 422 error and can you customize it?",
    level: 'Intermediate',
    a: "422 Unprocessable Content (older name: Unprocessable Entity) is what FastAPI returns when the request data doesn't match my types or rules. The body has a detail list, and each error has type, loc (where the problem is), msg, and input. If the frontend wants a simpler format, I add an exception handler for RequestValidationError and return my own shape. I keep the status as 422 so clients still know it's a validation problem.",
    code: `from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc):
    return JSONResponse({"ok": False, "error": exc.errors()[0]["msg"]}, 422)

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}`,
    output: `GET /items/abc
→ 422 Unprocessable Content
{
  "ok": false,
  "error": "Input should be a valid integer, unable to parse string as an integer"
}`,
  },
  {
    q: "How do you return errors with HTTPException?",
    level: 'Intermediate',
    a: "I raise HTTPException with a status code and a detail message, and FastAPI stops the request and sends that as JSON. I use it for things like 404 not found, 401 not logged in, or 403 not allowed. I can also add custom headers. I raise it instead of returning it, so it works even from inside helper functions and dependencies.",
    code: `from fastapi import FastAPI, HTTPException

app = FastAPI()
users = {1: "Anu"}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user_id, "name": users[user_id]}`,
    output: `GET /users/1
→ 200 OK
{"id": 1, "name": "Anu"}

GET /users/99
→ 404 Not Found
{"detail": "User not found"}`,
  },
  {
    q: "How do you create a custom exception handler?",
    level: 'Intermediate',
    a: "I register a handler with @app.exception_handler for an exception type, usually my own class for a business error like OutOfStockError (here a plain ValueError to keep it short). The handler receives the request and the exception and returns a response in the format I want. This keeps my route code clean because I just raise the error and one place decides how it looks.",
    code: `from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse({"error": str(exc)}, status_code=409)

@app.post("/buy/{product}")
def buy(product: str):
    raise ValueError(f"{product} is sold out")`,
    output: `POST /buy/book
→ 409 Conflict
{"error": "book is sold out"}`,
  },
  {
    q: "How do you document error responses with the responses parameter?",
    level: 'Intermediate',
    a: "By default the docs only show the success response and the 422 validation error, even if my route can raise a 404. I add responses={404: {\"model\": ErrorMessage, \"description\": ...}} to the decorator, and Swagger UI then shows the 404 and its JSON shape too. It doesn't change what the route returns; it's documentation for frontend teams and generated clients, so I keep the model matching what HTTPException really sends, which is {\"detail\": ...}.",
    code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ErrorMessage(BaseModel):
    detail: str

@app.get("/items/{item_id}", responses={404: {"model": ErrorMessage, "description": "Not found"}})
def get_item(item_id: int):
    if item_id != 1:
        raise HTTPException(404, "Item not found")
    return {"id": 1, "name": "Pen"}`,
    output: `GET /items/9
→ 404 Not Found
{"detail": "Item not found"}

GET /openapi.json
→ 200 OK
responses documented for GET /items/{item_id}:
  200  Successful Response  (-)
  404  Not found  (ErrorMessage)
  422  Validation Error  (HTTPValidationError)
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do you customize the 404 response for unknown URLs?",
    level: 'Intermediate',
    a: "A 404 for a URL with no route is raised by Starlette, not by my code, so a handler for FastAPI's HTTPException alone may not catch every case. I register a handler for starlette.exceptions.HTTPException, which covers both my own raise HTTPException and the router's 404. Then every error in the API has the same JSON shape, which makes the frontend's error handling much simpler.",
    code: `from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException):
    body = {"error": exc.detail, "path": request.url.path}
    return JSONResponse(body, status_code=exc.status_code)`,
    output: `GET /no-such-page
→ 404 Not Found
{"error": "Not Found", "path": "/no-such-page"}`,
  },
  {
    q: "How do you organize a bigger project with APIRouter?",
    level: 'Intermediate',
    a: "I split routes by feature into separate files, each with its own APIRouter, and then include them in main.py with include_router. I set a prefix and tags on each router so I don't repeat /users everywhere and the docs are grouped. A typical structure is app/main.py, app/routers/, app/models/, app/schemas/, and app/core/config.py. Here it's in one file just so it can run.",
    code: `from fastapi import APIRouter, FastAPI

router = APIRouter(prefix="/users", tags=["users"])  # routers/users.py

@router.get("/")
def list_users():
    return ["anu", "ravi"]

app = FastAPI()  # main.py
app.include_router(router)`,
    output: `GET /users/
→ 200 OK
["anu", "ravi"]`,
  },
  {
    q: "How do you add OpenAPI tags and metadata to the docs?",
    level: 'Intermediate',
    a: "I pass title and version (and optionally description and contact) to FastAPI(), and a list of openapi_tags with a description for each tag. Then I put tags=[...] on each route or on the whole APIRouter, and Swagger UI groups the endpoints under those headings in that order. A short summary on each route also helps, because it becomes the line people see in the docs and the operation name in generated clients.",
    code: `from fastapi import FastAPI

app = FastAPI(
    title="Shop API",
    version="2.1.0",
    openapi_tags=[{"name": "users", "description": "Sign up and profiles"}],
)

@app.get("/users", tags=["users"], summary="List users")
def list_users():
    return []`,
    output: `GET /openapi.json
→ 200 OK
info: Shop API 2.1.0
tags:
  users: Sign up and profiles
GET /users -> tags ['users'], summary 'List users'
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do you serve static files, send a file download, or mount a sub-application?",
    level: 'Intermediate',
    a: "app.mount() attaches a whole separate ASGI app under a path. I use it with StaticFiles to serve a folder of images or CSS, and I can also mount another FastAPI app the same way, which then gets its own docs. To send one file as a download I return FileResponse with a filename, which sets the Content-Disposition header. In production I usually let Nginx or a CDN serve static files because it's faster.",
    code: `from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

Path("static").mkdir()  # demo: a folder with one file
Path("static/hello.txt").write_text("Hello from a static file")

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/download")
def download():
    return FileResponse("static/hello.txt", filename="report.txt")`,
    output: `GET /static/hello.txt
→ 200 OK
content-type: text/plain; charset=utf-8
Hello from a static file

GET /download
→ 200 OK
content-disposition: attachment; filename="report.txt"
Hello from a static file`,
  },
  {
    q: "What is dependency injection with Depends?",
    level: 'Intermediate',
    a: "Depends lets me declare that a route needs something, and FastAPI calls that function and passes the result in. I use it to share logic like pagination, getting the current user, or a DB session, instead of copying code into every route. Dependencies can have their own parameters, which FastAPI reads from the request. It also makes testing easy because I can override dependencies.",
    code: `from fastapi import Depends, FastAPI

app = FastAPI()

def pagination(page: int = 1, size: int = 10):
    return {"offset": (page - 1) * size, "size": size}

@app.get("/products")
def list_products(p: dict = Depends(pagination)):
    return p`,
    output: `GET /products?page=3
→ 200 OK
{"offset": 20, "size": 10}`,
  },
  {
    q: "How do you apply one dependency to many routes, like an API key check?",
    level: 'Intermediate',
    a: "I can add dependencies=[Depends(...)] on a router or on the whole app, so every route under it runs that check. This is good for things like API key or auth checks where the route doesn't need the return value. The dependency raises HTTPException if the check fails. Here it's on the whole app, so every route is protected.",
    code: `from fastapi import Depends, FastAPI, Header, HTTPException

def verify_api_key(x_api_key: str | None = Header(default=None)):
    if x_api_key != "secret-key":
        raise HTTPException(status_code=401, detail="Invalid API key")

app = FastAPI(dependencies=[Depends(verify_api_key)])

@app.get("/stats")
def stats():
    return {"users": 42}`,
    output: `GET /stats
→ 401 Unauthorized
{"detail": "Invalid API key"}

GET /stats
X-API-Key: secret-key
→ 200 OK
{"users": 42}`,
  },
  {
    q: "What is a yield dependency and how do you use it for a DB session?",
    level: 'Intermediate',
    a: "A dependency with yield runs the code before yield when the request starts, gives the value to the route, and runs the code after yield when the request is done. That's perfect for a database session because I can open it, hand it to the route, and always close it in a finally block, even if there's an error. In a real app the yielded value would be SQLAlchemy's SessionLocal().",
    code: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_db():
    try:
        yield "db-session"  # real app: SessionLocal()
    finally:
        print("session closed")

@app.get("/users")
def list_users(db: str = Depends(get_db)):
    return {"using": db}`,
    output: `GET /users
→ 200 OK
{"using": "db-session"}

Server console:
session closed`,
  },
  {
    q: "How do you use a class as a dependency?",
    level: 'Intermediate',
    a: "FastAPI can call anything callable, so a class works as a dependency: its __init__ parameters become query parameters, and I get a typed object instead of a dict. With Annotated[Filters, Depends()] I don't even repeat the class name. I can also make a configurable dependency by creating an instance with settings and giving the class a __call__ method, like a paginator with a different max size per route.",
    code: `from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()

class Filters:
    def __init__(self, q: str | None = None, sort: str = "name"):
        self.q, self.sort = q, sort

@app.get("/products")
def products(f: Annotated[Filters, Depends()]):
    return {"q": f.q, "sort": f.sort}`,
    output: `GET /products
→ 200 OK
{"q": null, "sort": "name"}

GET /products?q=pen&sort=price
→ 200 OK
{"q": "pen", "sort": "price"}`,
  },
  {
    q: "What are sub-dependencies, and is a dependency called twice in one request?",
    level: 'Intermediate',
    a: "A dependency can itself depend on other dependencies, so I build a chain like get_token, then get_user, then the route. FastAPI resolves the whole tree for me. If the same dependency appears more than once in one request, FastAPI calls it only once and reuses the result, which you can see in the console here. If I really need a fresh call each time, I use Depends(func, use_cache=False).",
    code: `from fastapi import Depends, FastAPI

app = FastAPI()

def get_token():
    print("get_token called")
    return "abc123"

def get_user(token: str = Depends(get_token)):
    return {"name": "anu"}

@app.get("/me")
def me(user: dict = Depends(get_user), token: str = Depends(get_token)):
    return {"user": user, "token": token}`,
    output: `GET /me
→ 200 OK
{"user": {"name": "anu"}, "token": "abc123"}

Server console:
get_token called`,
  },
  {
    q: "How do you implement role-based authorization?",
    level: 'Intermediate',
    a: "I write a dependency that looks up the current user's role and raises 403 Forbidden if it isn't allowed, and attach it to the route with dependencies=[Depends(...)]. 401 means \"I don't know who you are\" and 403 means \"I know you, but you're not allowed\", so a missing login should get a 401 from the auth dependency. In a bigger app I make a small factory, require_role(\"admin\"), so each route declares the roles it needs right on the endpoint.",
    code: `from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()
ROLES = {"t-anu": "admin", "t-ravi": "viewer"}

def require_admin(x_token: str = Header()):
    if ROLES.get(x_token) != "admin":
        raise HTTPException(403, "Not enough permissions")

@app.delete("/products/{pid}", dependencies=[Depends(require_admin)])
def delete_product(pid: int):
    return {"deleted": pid}`,
    output: `DELETE /products/7
X-Token: t-ravi
→ 403 Forbidden
{"detail": "Not enough permissions"}

DELETE /products/7
X-Token: t-anu
→ 200 OK
{"deleted": 7}`,
  },
  {
    q: "How do you read headers and cookies, and set a cookie?",
    level: 'Intermediate',
    a: "I use Header() and Cookie() as default values for parameters. For headers, FastAPI converts underscores to dashes, so user_agent reads the User-Agent header. To set a cookie I add a Response parameter and call response.set_cookie. For login cookies I'd set httponly=True so JavaScript can't read them.",
    code: `from fastapi import Cookie, FastAPI, Header, Response

app = FastAPI()

@app.get("/whoami")
def whoami(user_agent: str = Header(None), session_id: str = Cookie(None)):
    return {"user_agent": user_agent, "session_id": session_id}

@app.post("/login")
def login(response: Response):
    response.set_cookie("session_id", "abc123", httponly=True)
    return {"logged_in": True}`,
    output: `GET /whoami
User-Agent: my-app/1.0
Cookie: session_id=xyz789
→ 200 OK
{"user_agent": "my-app/1.0", "session_id": "xyz789"}

POST /login
→ 200 OK
set-cookie: session_id=abc123; HttpOnly; Path=/; SameSite=lax
{"logged_in": true}`,
  },
  {
    q: "When do you use the Request object directly?",
    level: 'Intermediate',
    a: "Normally I declare exactly what I need as parameters, because then it is validated and documented. But when I need low-level details, I add request: Request and read things like the method, URL, client IP, raw headers, or the raw body with await request.json(). I use it for things like logging, webhooks where I must verify a signature on the raw body, or reading app.state. Note that data read this way is not validated or shown in the docs.",
    code: `from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/webhook")
async def webhook(request: Request):
    body = await request.json()
    return {"method": request.method, "path": request.url.path, "body": body}`,
    output: `POST /webhook
{"event": "paid"}
→ 200 OK
{
  "method": "POST",
  "path": "/webhook",
  "body": {
    "event": "paid"
  }
}`,
  },
  {
    q: "How do you handle form data?",
    level: 'Intermediate',
    a: "For HTML form posts I use Form() instead of a Pydantic body, because the data comes as form-encoded, not JSON. This needs the python-multipart package installed. Missing form fields give a normal 422 error. OAuth2 login forms also use this format.",
    code: `from fastapi import FastAPI, Form

app = FastAPI()

@app.post("/login")
def login(username: str = Form(), password: str = Form()):
    if password != "pass123":
        return {"ok": False}
    return {"ok": True, "user": username}`,
    output: `POST /login
(form) username=anu&password=pass123
→ 200 OK
{"ok": true, "user": "anu"}

POST /login
(form) username=anu
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "password"
      ],
      "msg": "Field required",
      "input": null
    }
  ]
}`,
  },
  {
    q: "How do you upload files?",
    level: 'Intermediate',
    a: "I use UploadFile, which needs python-multipart. UploadFile gives me the filename, content type, and an async read() method, and it spools large files to disk instead of keeping everything in memory. I always check the content type and size before saving. For multiple files I use list[UploadFile].",
    code: `from fastapi import FastAPI, UploadFile

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile):
    content = await file.read()
    return {"filename": file.filename, "size": len(content)}`,
    output: `POST /upload
(multipart) file=notes.txt, text/plain
→ 200 OK
{"filename": "notes.txt", "size": 23}`,
  },
  {
    q: "What are background tasks?",
    level: 'Intermediate',
    a: "BackgroundTasks lets me run a function after the response is sent, so the user doesn't wait for it. I use it for small jobs like sending a welcome email or writing a log. For heavy or important jobs that need retries, I'd use a real queue like Celery, RQ, or ARQ instead. The task runs in the same process, so if the server dies the task is lost.",
    code: `from fastapi import BackgroundTasks, FastAPI

app = FastAPI()
email_log = []

def send_welcome_email(email: str):
    email_log.append(f"welcome email sent to {email}")

@app.post("/register")
def register(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_welcome_email, email)
    return {"message": "registered, email will be sent"}`,
    output: `POST /register?email=anu@example.com
→ 200 OK
{"message": "registered, email will be sent"}

Log after the response was sent:
welcome email sent to anu@example.com`,
  },
  {
    q: "What is middleware and how do you write one?",
    level: 'Intermediate',
    a: "Middleware is code that runs for every request before it reaches the route and for every response before it goes back. I use it for things like logging, timing, adding headers, or request IDs. I write it with @app.middleware(\"http\") and call call_next(request) to continue. A common example is adding an X-Process-Time header; here I add a fixed header so the output stays the same every run.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)  # run the route
    response.headers["X-App-Version"] = "1.0"
    return response

@app.get("/ping")
def ping():
    return {"pong": True}`,
    output: `GET /ping
→ 200 OK
x-app-version: 1.0
{"pong": true}`,
  },
  {
    q: "How do you add a request ID to every request?",
    level: 'Intermediate',
    a: "I write a middleware that takes the X-Request-ID header if the caller (like a load balancer) sent one, or makes a new ID with uuid4, and adds it to the response headers. I put it in every log line, so when a user reports an error I can find all the logs for that one request across services. I can also store it on request.state so route code can read it.",
    code: `import uuid
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    rid = request.headers.get("X-Request-ID") or uuid.uuid4().hex
    response = await call_next(request)
    response.headers["X-Request-ID"] = rid
    return response

@app.get("/orders")
def orders():
    return []`,
    output: `GET /orders
X-Request-ID: abc-123
→ 200 OK
x-request-id: abc-123
[]`,
  },
  {
    q: "How do you compress responses with GZip?",
    level: 'Intermediate',
    a: "I add GZipMiddleware with a minimum_size, so only responses bigger than that are compressed when the client sends Accept-Encoding: gzip. Small responses aren't worth the CPU, so anything under minimum_size is sent uncompressed. Big JSON lists often shrink by 70 to 90 percent, but if Nginx or a CDN already compresses, I do it there instead of twice.",
    code: `from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=500)  # bytes

@app.get("/report")
def report():
    return {"rows": [f"row {i}" for i in range(100)]}  # ~1 KB`,
    output: `GET /report
Accept-Encoding: gzip
→ 200 OK
content-encoding: gzip
(body was sent gzip-compressed; the client unzips it automatically)`,
  },
  {
    q: "What is CORS and how do you enable it?",
    level: 'Intermediate',
    a: "CORS is a browser security rule that blocks a frontend on one origin, like localhost:5173, from calling an API on another origin unless the API allows it. In FastAPI I add CORSMiddleware with the allowed origins, and if needed the allowed methods and headers. In production I list the exact frontend domains instead of using \"*\". You only see CORS problems in the browser, not in tools like curl or Postman.",
    code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])

@app.get("/data")
def data():
    return {"value": 1}`,
    output: `GET /data
Origin: http://localhost:5173
→ 200 OK
access-control-allow-origin: http://localhost:5173
{"value": 1}

GET /data
Origin: http://evil.com
→ 200 OK
(no access-control-allow-origin header in the response)
{"value": 1}`,
  },
  {
    q: "What do TrustedHostMiddleware and HTTPSRedirectMiddleware do?",
    level: 'Intermediate',
    a: "TrustedHostMiddleware rejects requests whose Host header isn't in my allowed list with a 400, which blocks host header attacks like poisoned password-reset links. HTTPSRedirectMiddleware sends any plain http request to the https URL with a redirect. Behind a load balancer that ends TLS, I usually let the proxy do the redirect, or run Uvicorn with --proxy-headers so the app knows the original request was https.",
    code: `from fastapi import FastAPI
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware,
                   allowed_hosts=["api.example.com", "*.example.com"])

@app.get("/health")
def health():
    return {"status": "ok"}`,
    output: `GET /health
Host: evil.com
→ 400 Bad Request
Invalid host header

GET /health
Host: api.example.com
→ 307 Temporary Redirect
location: https://api.example.com/health`,
  },
  {
    q: "How do you manage settings and environment variables?",
    level: 'Intermediate',
    a: "I use pydantic-settings and create a Settings class that inherits from BaseSettings. It reads values from environment variables or a .env file and validates their types, so a wrong value fails at startup. In bigger apps I wrap it in a function with lru_cache so it's created once, and inject it with Depends. Secrets never go in the code, only in env vars.",
    code: `from fastapi import FastAPI
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = False

settings = Settings()  # reads env vars, e.g. export DEBUG=true
app = FastAPI()

@app.get("/info")
def info():
    return settings`,
    output: `GET /info
→ 200 OK
{"debug": true}`,
  },
  {
    q: "When should you use async def vs def for endpoints?",
    level: 'Intermediate',
    a: "I use async def when the code inside awaits async libraries, like httpx.AsyncClient, an async DB driver, or asyncio.sleep. I use a normal def when I call blocking libraries, like requests or a sync DB driver, because FastAPI runs def routes in a thread pool so they don't block the event loop. The big mistake is calling blocking code like time.sleep inside async def, which freezes the whole server. Both styles give the same response to the client.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/async")
async def async_route():  # for code that awaits (httpx, asyncpg)
    return {"type": "async def"}

@app.get("/sync")
def sync_route():  # for blocking code: runs in a thread pool
    return {"type": "def"}`,
    output: `GET /async
→ 200 OK
{"type": "async def"}

GET /sync
→ 200 OK
{"type": "def"}`,
  },
  {
    q: "What happens if you call blocking code inside async def, and how do you fix it?",
    level: 'Intermediate',
    a: "An async def route runs directly on the event loop, so a blocking call like time.sleep, requests.get, or a heavy loop freezes every other request on that worker. Here three requests to /bad take three times as long because they run one after another. The fix is to use an async library, make the route a plain def, or push the blocking call to a thread with asyncio.to_thread or run_in_threadpool. For heavy CPU work I use a background worker or process pool instead.",
    code: `import asyncio, time
from fastapi import FastAPI

app = FastAPI()

@app.get("/bad")
async def bad():
    time.sleep(0.5)  # blocks the event loop!

@app.get("/good")
async def good():
    await asyncio.to_thread(time.sleep, 0.5)  # runs in a thread`,
    output: `Sending 3 requests at the same time:
GET /bad x3 → all 200 OK, total time ≈ 1.5s
GET /good x3 → all 200 OK, total time ≈ 0.5s
(/bad runs them one after another; /good runs them in parallel)`,
  },
  {
    q: "How do you test async endpoints?",
    level: 'Intermediate',
    a: "TestClient works fine for async endpoints too, but when the test itself needs to await things, like an async database fixture, I write an async test. I mark it with @pytest.mark.anyio (the plugin comes with AnyIO, which FastAPI already installs) and use httpx.AsyncClient with ASGITransport, which calls the app directly without a server. One gotcha: ASGITransport doesn't run lifespan events, so if the app needs them I use a lifespan manager or plain TestClient.",
    code: `# test_main.py
import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.anyio
async def test_price():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        r = await client.get("/price/abc")
    assert r.json() == {"symbol": "ABC", "price": 101.5}`,
    output: `$ pytest -q
.                                                                        [100%]
1 passed in 0.19s`,
  },
  {
    q: "How do you implement authentication with OAuth2 and JWT?",
    level: 'Advanced',
    a: "The client first posts username and password to a /token endpoint as a form (OAuth2PasswordRequestForm), and if they're correct I return a signed JWT access token. For protected routes I use OAuth2PasswordBearer, which reads the Authorization: Bearer header, and then decode and verify the token, usually in a get_current_user dependency. Here I use the PyJWT library and show only the protected route; in a real app I'd also hash passwords with bcrypt or argon2, add an \"exp\" expiry, and keep the secret in env vars.",
    code: `import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
oauth2 = OAuth2PasswordBearer(tokenUrl="token")  # reads the Bearer header

@app.get("/users/me")
def me(token: str = Depends(oauth2)):
    try:
        user = jwt.decode(token, "change-me", algorithms=["HS256"])["sub"]
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token")
    return {"username": user}`,
    output: `GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUifQ.jKTdaKoQbZ533GqxB2-bu-1VW7rZjeC_g9020-KVm4Y
→ 200 OK
{"username": "anu"}

GET /users/me
Authorization: Bearer bad.token.here
→ 401 Unauthorized
{"detail": "Invalid token"}`,
  },
  {
    q: "How does a refresh token flow work?",
    level: 'Advanced',
    a: "At login I return a short-lived access token, around 15 minutes, and a long-lived refresh token, days or weeks. The client sends the access token on every request, and when it expires it calls /refresh with the refresh token to get a new access token without asking for the password again. I put a type claim in each token so a stolen access token can't be used as a refresh token, and in a real app I store refresh tokens server-side so I can revoke them and rotate them on every use. Expiry is left out here only to keep the tokens in the output stable.",
    code: `import jwt
from fastapi import Body, FastAPI, HTTPException

SECRET = "change-me"
app = FastAPI()

@app.post("/refresh")
def refresh(refresh_token: str = Body(embed=True)):
    data = jwt.decode(refresh_token, SECRET, algorithms=["HS256"])
    if data["type"] != "refresh":
        raise HTTPException(401, "Not a refresh token")
    new = jwt.encode({"sub": data["sub"], "type": "access"}, SECRET, algorithm="HS256")
    return {"access_token": new}`,
    output: `POST /refresh
{"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUiLCJ0eXBlIjoicmVmcmVzaCJ9.PHimzVZuqsgnK2G32s5Tbi_G28J_s46XqGcgET5yvdk"}
→ 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUiLCJ0eXBlIjoiYWNjZXNzIn0.pVHCZbqkskEtWz3-OTLmeXyJnXEDL3mqYay9Eeca4Wg"
}

POST /refresh
{"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUiLCJ0eXBlIjoiYWNjZXNzIn0.pVHCZbqkskEtWz3-OTLmeXyJnXEDL3mqYay9Eeca4Wg"}
→ 401 Unauthorized
{"detail": "Not a refresh token"}`,
  },
  {
    q: "How do OAuth2 scopes work in FastAPI?",
    level: 'Advanced',
    a: "Scopes are named permissions inside the token, like items:read or items:write. I declare them on OAuth2PasswordBearer, ask for them per route with Security(dependency, scopes=[...]), and the dependency gets a SecurityScopes object listing what this route needs. If the token lacks a scope I return 403, not 401, because the user is known but not allowed. In a real app the scopes come from the JWT's scope claim; here a small dict stands in for decoding.",
    code: `from typing import Annotated
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes

app = FastAPI()
oauth2 = OAuth2PasswordBearer(tokenUrl="token", scopes={"items:write": "Create items"})
TOKENS = {"reader-token": ["items:read"], "admin-token": ["items:read", "items:write"]}

def check_scopes(needed: SecurityScopes, token: Annotated[str, Security(oauth2)]):
    for scope in needed.scopes:
        if scope not in TOKENS.get(token, []):
            raise HTTPException(403, f"Missing scope: {scope}")

@app.post("/items", dependencies=[Security(check_scopes, scopes=["items:write"])])
def create_item():
    return {"created": True}`,
    output: `POST /items
Authorization: Bearer reader-token
→ 403 Forbidden
{"detail": "Missing scope: items:write"}

POST /items
Authorization: Bearer admin-token
→ 200 OK
{"created": true}`,
  },
  {
    q: "When would you use API keys instead of JWT tokens?",
    level: 'Advanced',
    a: "I use API keys for machine-to-machine access, like a partner's server calling my API: they're simple, long-lived and easy to revoke, and I store only their hash in the database. I use JWT access tokens for users who log in, because they're short-lived and carry claims like the user id and roles, so I don't hit the database on every request. FastAPI has APIKeyHeader and OAuth2PasswordBearer for each, and both show up as Authorize options in the docs. Either way they must only travel over HTTPS.",
    code: `from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import APIKeyHeader

app = FastAPI()
API_KEYS = {"sk_partner_123": "partner-1"}  # real app: hashed, in the DB

@app.get("/partner/orders")
def partner_orders(key: Annotated[str, Depends(APIKeyHeader(name="X-API-Key"))]):
    if key not in API_KEYS:
        raise HTTPException(401, "Invalid API key")
    return {"client": API_KEYS[key], "orders": 12}`,
    output: `GET /partner/orders
X-API-Key: sk_partner_123
→ 200 OK
{"client": "partner-1", "orders": 12}

GET /partner/orders
X-API-Key: wrong
→ 401 Unauthorized
{"detail": "Invalid API key"}`,
  },
  {
    q: "How do you store passwords safely?",
    level: 'Advanced',
    a: "I never store the plain password; I store a slow, salted hash and compare hashes at login. A random salt per user means two users with the same password get different hashes, and a slow algorithm makes brute force expensive. This example uses Python's built-in hashlib.pbkdf2_hmac to show the idea, but in production I use a tested library like passlib or pwdlib with bcrypt or argon2. I also use hmac.compare_digest so the comparison takes constant time.",
    code: `import hashlib, hmac, os

def hash_pw(password: str, salt: bytes) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000).hex()

salt = os.urandom(16)              # random salt per user
stored = hash_pw("s3cret!", salt)  # save salt + hash, never the password

print("wrong:", hmac.compare_digest(hash_pw("wrong", salt), stored))
print("right:", hmac.compare_digest(hash_pw("s3cret!", salt), stored))`,
    output: `wrong: False
right: True`,
  },
  {
    q: "How do you connect FastAPI to a database?",
    level: 'Advanced',
    a: "I open the connection (or SQLAlchemy engine) once when the app starts and use it inside the routes. In real projects I usually use SQLAlchemy or SQLModel with a session per request from a yield dependency, PostgreSQL, and Alembic for migrations. This example uses Python's built-in sqlite3 so it runs anywhere; check_same_thread=False is needed only for SQLite because FastAPI may use different threads. I always pass values as ? parameters, never with string formatting, to avoid SQL injection.",
    code: `import sqlite3
from fastapi import FastAPI

app = FastAPI()
db = sqlite3.connect("shop.db", check_same_thread=False)
db.execute("CREATE TABLE IF NOT EXISTS heroes (name TEXT)")

@app.post("/heroes")
def add_hero(name: str):
    db.execute("INSERT INTO heroes VALUES (?)", (name,))
    return db.execute("SELECT name FROM heroes").fetchall()`,
    output: `POST /heroes?name=Spider-Man
→ 200 OK
[["Spider-Man"]]

POST /heroes?name=Iron Man
→ 200 OK
[["Spider-Man"], ["Iron Man"]]`,
  },
  {
    q: "How do you use async SQLAlchemy with FastAPI?",
    level: 'Advanced',
    a: "I create an engine with create_async_engine and an async driver, like asyncpg for PostgreSQL, and an async_sessionmaker. A yield dependency gives each request its own AsyncSession, and in async def routes I await session.execute or session.get and session.commit. Two gotchas: lazy-loading a relationship after the query raises an error in async mode, so I load relationships eagerly with selectinload, and I set expire_on_commit=False so objects are still usable after commit.",
    code: `from fastapi import Depends, FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

engine = create_async_engine("postgresql+asyncpg://app:secret@db/shop")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
app = FastAPI()

async def get_session():
    async with SessionLocal() as session:
        yield session

@app.get("/users/{user_id}")
async def get_user(user_id: int, session: AsyncSession = Depends(get_session)):
    return await session.get(User, user_id)  # User = your ORM model`,
    output: `Not run here (needs PostgreSQL). What it does:
- one async engine + connection pool for the whole app
- one AsyncSession per request, closed after the response
- await session.get(...) frees the event loop while the DB works
- relationships: use selectinload(...), lazy loading raises in async`,
  },
  {
    q: "How do you manage database schema changes with Alembic?",
    level: 'Advanced',
    a: "Alembic is the migration tool for SQLAlchemy: each schema change is a versioned Python script with an upgrade and a downgrade, committed to git with the code. I change my models, run alembic revision --autogenerate, and always review the generated script, because autogenerate can miss renames and treat them as drop plus add. Then alembic upgrade head runs in the deploy pipeline before the new app version starts, and for zero downtime I make changes backward compatible, like adding a nullable column first and backfilling later.",
    code: `# after changing a model (e.g. add User.phone)
alembic revision --autogenerate -m "add phone to users"
alembic upgrade head      # apply all new migrations
alembic downgrade -1      # roll back the last one

# migrations/versions/3f2a_add_phone_to_users.py (generated: review it!)
def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))

def downgrade():
    op.drop_column("users", "phone")`,
    output: `Workflow (illustrative, not a recorded run):
1. change the SQLAlchemy model
2. autogenerate a migration script and review it
3. commit it with the code change
4. CI/CD runs \`alembic upgrade head\` before the new version starts
5. the alembic_version table records which revision the DB is on`,
  },
  {
    q: "What are lifespan events (startup and shutdown)?",
    level: 'Advanced',
    a: "Lifespan is an async context manager I pass to FastAPI(lifespan=...). Code before yield runs once at startup, like loading an ML model, creating a DB pool, or an HTTP client, and code after yield runs at shutdown to clean up. It replaces the older @app.on_event(\"startup\") style. I store shared objects on app.state so routes can use them.",
    code: `from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("startup: load model, open DB pool")
    yield
    print("shutdown: close connections")

app = FastAPI(lifespan=lifespan)

@app.get("/")
def home():
    return {"status": "ready"}`,
    output: `GET /
→ 200 OK
{"status": "ready"}

Server console:
startup: load model, open DB pool
shutdown: close connections`,
  },
  {
    q: "How do you test a FastAPI app?",
    level: 'Advanced',
    a: "I use TestClient, which calls the app directly without starting a server, together with pytest. I check the status code and the JSON body for both success and error cases. For dependencies like the database or current user, I use app.dependency_overrides to swap in a fake. For async tests with an async DB, I use httpx.AsyncClient with pytest-anyio or pytest-asyncio.",
    code: `from fastapi.testclient import TestClient
from main import app  # the app under test

client = TestClient(app)

def test_read_item():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json() == {"id": 1, "name": "pen"}

def test_item_not_found():
    assert client.get("/items/99").status_code == 404`,
    output: `$ pytest -q
..                                                                       [100%]
2 passed in 0.18s`,
  },
  {
    q: "How do you mock dependencies in tests with dependency_overrides?",
    level: 'Advanced',
    a: "app.dependency_overrides is a dict where the key is the real dependency function and the value is a fake one. FastAPI then calls my fake instead, everywhere that dependency is used, so I can test routes without a real login or database. I always clear the overrides after each test (here at the end of the test, or in a fixture), so one test doesn't affect another. The same trick works for swapping a real database for a test SQLite database.",
    code: `# test_main.py   (main.py has get_current_user and /me)
from fastapi.testclient import TestClient
from main import app, get_current_user

client = TestClient(app)

def test_me_with_fake_user():
    app.dependency_overrides[get_current_user] = lambda: {"name": "anu"}
    assert client.get("/me").json() == {"name": "anu"}
    app.dependency_overrides.clear()  # don't leak into other tests`,
    output: `$ pytest -q
.                                                                        [100%]
1 passed in 0.17s`,
  },
  {
    q: "How do WebSockets work in FastAPI?",
    level: 'Advanced',
    a: "A WebSocket keeps one connection open so the server and client can both send messages any time, which is good for chat, live notifications, or dashboards. I use @app.websocket, accept the connection, and then loop over incoming messages with async for, which ends cleanly when the client leaves (with a while True loop I'd catch WebSocketDisconnect instead). For many users across several servers I'd use something like Redis pub/sub to broadcast.",
    code: `from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    async for message in websocket.iter_text():  # ends when the client leaves
        await websocket.send_text(f"You said: {message}")`,
    output: `WS connect /ws/chat
→ hi
← You said: hi`,
  },
  {
    q: "What response types can you return besides JSON?",
    level: 'Advanced',
    a: "By default FastAPI returns JSON, but I can return other response classes. HTMLResponse and PlainTextResponse send HTML or text, RedirectResponse sends the client to another URL, JSONResponse lets me set a custom status or headers, StreamingResponse sends data in chunks, which is good for big files or AI token streaming, and FileResponse sends a file.",
    code: `from fastapi import FastAPI
from fastapi.responses import HTMLResponse, RedirectResponse

app = FastAPI()

@app.get("/page", response_class=HTMLResponse)
def page():
    return "<h1>Hello</h1>"

@app.get("/old-page")
def old_page():
    return RedirectResponse("/page")`,
    output: `GET /page
→ 200 OK
content-type: text/html; charset=utf-8
<h1>Hello</h1>

GET /old-page
→ 307 Temporary Redirect
location: /page`,
  },
  {
    q: "How do you stream a large CSV export?",
    level: 'Advanced',
    a: "Instead of building the whole file in memory, I return a StreamingResponse with a generator that yields a few rows at a time, so memory stays flat even for millions of rows and the download starts immediately. I set media_type to text/csv, plus a Content-Disposition header so the browser saves it as a file. With a database I iterate a server-side cursor in batches; for very slow exports I'd generate the file in a background job and send a download link instead.",
    code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

def csv_rows():  # real app: read from a DB cursor in batches
    yield "id,product\\n"
    for i in range(1, 4):
        yield f"{i},item-{i}\\n"

@app.get("/export.csv")
def export():
    disposition = {"Content-Disposition": "attachment; filename=orders.csv"}
    return StreamingResponse(csv_rows(), media_type="text/csv", headers=disposition)`,
    output: `GET /export.csv
→ 200 OK
content-type: text/csv; charset=utf-8
content-disposition: attachment; filename=orders.csv
id,product
1,item-1
2,item-2
3,item-3`,
  },
  {
    q: "How do you send Server-Sent Events (SSE)?",
    level: 'Advanced',
    a: "SSE is a one-way stream from server to browser over a normal HTTP response with the text/event-stream type, and the browser reads it with new EventSource(url), which also reconnects automatically. It's simpler than WebSockets when only the server pushes, like order status updates or AI tokens. In recent FastAPI I set response_class=EventSourceResponse and yield ServerSentEvent objects, and FastAPI writes the event: and data: lines for me.",
    code: `from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent

app = FastAPI()

@app.get("/orders/{order_id}/events", response_class=EventSourceResponse)
async def order_events(order_id: int):
    for status in ["placed", "packed", "shipped"]:
        yield ServerSentEvent(event="status", data={"status": status})`,
    output: `GET /orders/7/events
→ 200 OK
content-type: text/event-stream; charset=utf-8
event: status
data: {"status": "placed"}

event: status
data: {"status": "packed"}

event: status
data: {"status": "shipped"}`,
  },
  {
    q: "How do you implement pagination?",
    level: 'Advanced',
    a: "I accept page and size (or limit and offset) as query parameters with limits, like size between 1 and 100, so nobody can ask for a million rows. I return the items plus metadata like total and page so the frontend can build page buttons. With a database I use OFFSET and LIMIT, or cursor-based pagination for very large tables because it stays fast.",
    code: `from fastapi import FastAPI, Query

app = FastAPI()
ITEMS = [f"item-{i}" for i in range(1, 24)]  # 23 items

@app.get("/items")
def list_items(page: int = Query(1, ge=1), size: int = Query(10, ge=1, le=100)):
    start = (page - 1) * size
    return {"page": page, "total": len(ITEMS),
            "items": ITEMS[start:start + size]}`,
    output: `GET /items?page=3&size=10
→ 200 OK
{
  "page": 3,
  "total": 23,
  "items": [
    "item-21",
    "item-22",
    "item-23"
  ]
}

GET /items?size=500
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": [
        "query",
        "size"
      ],
      "msg": "Input should be less than or equal to 100",
      "input": "500",
      "ctx": {
        "le": 100
      }
    }
  ]
}`,
  },
  {
    q: "How do you version an API?",
    level: 'Advanced',
    a: "The simplest way is URL versioning, where the version is part of the path, like /v1 and /v2; in a bigger app I put each version in its own APIRouter with that prefix. Old clients keep using v1 while new clients move to v2, and I only remove v1 after announcing a deprecation date. Other options are a header or a query parameter, but URL versioning is the easiest to see and test.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/v1/users/{user_id}")
def get_user_v1(user_id: int):
    return {"id": user_id, "name": "Anu Thomas"}

@app.get("/v2/users/{user_id}")
def get_user_v2(user_id: int):
    return {"id": user_id, "first_name": "Anu", "last_name": "Thomas"}`,
    output: `GET /v1/users/1
→ 200 OK
{"id": 1, "name": "Anu Thomas"}

GET /v2/users/1
→ 200 OK
{"id": 1, "first_name": "Anu", "last_name": "Thomas"}`,
  },
  {
    q: "How would you structure a large FastAPI app with routers, services and repositories?",
    level: 'Advanced',
    a: "I split it into layers: routers handle only HTTP (parsing input, status codes), services hold the business rules, and repositories are the only code that talks to the database. Dependencies wire them together, so in tests I can override the service or the repository with a fake. Here it's one file to keep it runnable, but in a real project each class lives in its own module inside a feature package like app/users/.",
    code: `from fastapi import APIRouter, Depends, FastAPI

class UserRepo:  # repository: the only code that talks to the DB
    def get(self, user_id: int):
        return {"id": user_id, "email": "ANU@X.COM"}

class UserService:  # service: business rules
    def __init__(self, repo: UserRepo = Depends()):
        self.repo = repo

    def get_user(self, user_id: int):
        user = self.repo.get(user_id)
        return user | {"email": user["email"].lower()}

router = APIRouter(prefix="/users")  # router: HTTP only

@router.get("/{user_id}")
def get_user(user_id: int, service: UserService = Depends()):
    return service.get_user(user_id)

app = FastAPI()
app.include_router(router)`,
    output: `GET /users/1
→ 200 OK
{"id": 1, "email": "anu@x.com"}`,
  },
  {
    q: "How would you add rate limiting?",
    level: 'Advanced',
    a: "Rate limiting stops one client from sending too many requests, and the server answers 429 Too Many Requests when the limit is hit. The idea is to count requests per client (IP, API key, or user) in a time window. This simple version keeps counts in memory without a time window and works only for one process; in production I'd store the counts in Redis with an expiry or use a library like slowapi, or do it at the gateway like Nginx or a cloud API gateway.",
    code: `from fastapi import FastAPI, HTTPException, Request

app = FastAPI()
hits = {}  # client IP -> count (real app: Redis with expiry)

@app.get("/search")
def search(q: str, request: Request):
    ip = request.client.host
    hits[ip] = hits.get(ip, 0) + 1
    if hits[ip] > 2:  # limit: 2 requests
        raise HTTPException(429, "Too many requests")
    return {"results": [q]}`,
    output: `GET /search?q=a
→ 200 OK
{"results": ["a"]}

GET /search?q=b
→ 200 OK
{"results": ["b"]}

GET /search?q=c
→ 429 Too Many Requests
{"detail": "Too many requests"}`,
  },
  {
    q: "How do you add health check endpoints?",
    level: 'Advanced',
    a: "I usually add two: a liveness check that only says the process is running, and a readiness check that also verifies dependencies like the database or Redis. Kubernetes or a load balancer calls them, restarting the pod if liveness fails and stopping traffic if readiness fails. Readiness returns 503 when something is down, so tools can react to the status code without parsing the body. I keep them fast and hide them from the public docs.",
    code: `from fastapi import FastAPI, Response

app = FastAPI()
DB_UP = False  # real app: run "SELECT 1"

@app.get("/health/live")
def live():
    return {"status": "ok"}

@app.get("/health/ready")
def ready(response: Response):
    response.status_code = 200 if DB_UP else 503
    return {"database": DB_UP}`,
    output: `GET /health/live
→ 200 OK
{"status": "ok"}

GET /health/ready
→ 503 Service Unavailable
{"database": false}`,
  },
  {
    q: "How do you add observability: logging, metrics and tracing?",
    level: 'Advanced',
    a: "Logs tell me what happened, metrics tell me how much and how fast, and traces show one request's path across services. I log in JSON with a request ID (here a middleware writes one JSON line per request), expose a /metrics endpoint that Prometheus scrapes (usually via prometheus-fastapi-instrumentator), and add OpenTelemetry to trace calls to the database and other APIs. One tip: label logs and metrics with the route template like /items/{item_id}, not the real URL, otherwise every ID creates a new time series.",
    code: `import json
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def log_json(request: Request, call_next):
    response = await call_next(request)
    route = request.scope["route"].path  # template, not the real URL
    print(json.dumps({"route": route, "status": response.status_code}))
    return response

@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"id": item_id}`,
    output: `GET /items/1
→ 200 OK
{"id": 1}

GET /items/2
→ 200 OK
{"id": 2}

Server console:
{"route": "/items/{item_id}", "status": 200}
{"route": "/items/{item_id}", "status": 200}`,
  },
  {
    q: "What is an ETag and how do you use it for caching?",
    level: 'Advanced',
    a: "An ETag is a short fingerprint of a response, usually a hash of the data. The client sends it back in the If-None-Match header next time, and if the data hasn't changed I return 304 Not Modified with no body, which saves bandwidth. The browser or app then uses its cached copy. ETags can also prevent lost updates, by having clients send If-Match on PUT and returning 412 if the data changed meanwhile.",
    code: `from fastapi import FastAPI, Request, Response

app = FastAPI()
ETAG = '"v1"'  # real app: a hash of the data

@app.get("/product")
def get_product(request: Request, response: Response):
    if request.headers.get("if-none-match") == ETAG:
        return Response(status_code=304)
    response.headers["ETag"] = ETAG
    return {"id": 1, "name": "Pen"}`,
    output: `GET /product
→ 200 OK
etag: "v1"
{"id": 1, "name": "Pen"}

GET /product
If-None-Match: "v1"
→ 304 Not Modified
(empty body: the client uses its cached copy)`,
  },
  {
    q: "How do you make a POST request idempotent?",
    level: 'Advanced',
    a: "GET, PUT and DELETE are naturally idempotent, but POST is not, so if a client retries a payment after a timeout it could be charged twice. I ask the client to send a unique Idempotency-Key header per operation and store the result under that key. If the same key comes again, I return the saved result instead of doing the work again, which you can see in the console here. In production I keep the keys in Redis or the database with an expiry.",
    code: `from fastapi import Body, FastAPI, Header

app = FastAPI()
processed = {}  # real app: Redis/DB with expiry

@app.post("/payments")
def pay(amount: int = Body(embed=True), idempotency_key: str = Header()):
    if idempotency_key not in processed:
        print(f"charging {amount}")
        processed[idempotency_key] = {"payment_id": len(processed) + 1}
    return processed[idempotency_key]`,
    output: `POST /payments
Idempotency-Key: k-1
{"amount": 500}
→ 200 OK
{"payment_id": 1}

POST /payments
Idempotency-Key: k-1
{"amount": 500}
→ 200 OK
{"payment_id": 1}

Server console:
charging 500`,
  },
  {
    q: "When would you use Celery or ARQ instead of BackgroundTasks?",
    level: 'Advanced',
    a: "BackgroundTasks runs in the same process right after the response, so it's fine for quick things like a log line, but the job is lost if the server restarts and there are no retries. For heavy or important work, like generating reports, sending bulk emails or calling slow third-party APIs, I push a job to a queue (Redis or RabbitMQ) and separate worker processes run it with retries, scheduling and monitoring. Celery is the mature choice for sync code, and ARQ is a lighter asyncio-native option. The endpoint just returns 202 Accepted with a job ID that the client can poll.",
    code: `from celery import Celery  # tasks.py: runs in a separate worker process
celery = Celery("shop", broker="redis://redis:6379/0")

@celery.task(max_retries=3)
def build_report(user_id: int):
    ...  # slow work

# main.py (FastAPI)
@app.post("/reports", status_code=202)
def create_report(user_id: int):
    job = build_report.delay(user_id)  # only enqueues, returns at once
    return {"job_id": job.id, "status": "queued"}`,
    output: `How it flows (illustrative, needs Redis and a worker):
POST /reports  -> 202 {"job_id": "<id>", "status": "queued"}
worker         -> picks the job from Redis and runs build_report
client         -> polls the job ID until it is SUCCESS
if the worker crashes, the job stays in the queue and is retried`,
  },
  {
    q: "How do you deploy a FastAPI app?",
    level: 'Advanced',
    a: "I package it in a Docker image and run it with Uvicorn, or with Gunicorn managing several Uvicorn workers to use all CPU cores. A common rule is about (2 x CPU cores) + 1 workers, but on Kubernetes I often run one worker per container and scale with more pods. I put it behind a reverse proxy or load balancer like Nginx for HTTPS, and I turn off --reload in production.",
    code: `# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# docker build -t shop-api . && docker run -p 8000:8000 shop-api`,
    output: `What happens:
1. docker build creates an image with Python, your deps and code.
2. docker run starts the container and maps port 8000.
3. Uvicorn starts 4 worker processes that share the port.

The API is then reachable at http://<server>:8000
and docs at http://<server>:8000/docs`,
  },
  {
    q: "How do you make a FastAPI app faster?",
    level: 'Advanced',
    a: "First I make sure I never block the event loop: async libraries inside async def, and plain def for blocking code. I reuse expensive objects like DB connection pools and HTTP clients by creating them once in lifespan, and I use caching (for example Redis) for data that doesn't change often, like in this example. I also add database indexes, avoid N+1 queries, paginate large lists, move slow jobs to a background worker, and run multiple workers. And I always measure with profiling before optimizing.",
    code: `from fastapi import FastAPI

app = FastAPI()
cache = {}  # real app: Redis

@app.get("/weather/{city}")
async def weather(city: str):
    if city in cache:
        return {"source": "cache", **cache[city]}
    cache[city] = {"city": city, "temp": 31}  # real app: slow API call
    return {"source": "api", **cache[city]}`,
    output: `GET /weather/kochi
→ 200 OK
{"source": "api", "city": "kochi", "temp": 31}

GET /weather/kochi
→ 200 OK
{"source": "cache", "city": "kochi", "temp": 31}`,
  },
]
