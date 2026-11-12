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

@app.get("/")
def home():
    return {"message": "Hello FastAPI"}

@app.get("/square/{n}")
def square(n: int):  # type hint = validation + conversion
    return {"n": n, "square": n * n}`,
    output: `GET /
→ 200 OK
{"message": "Hello FastAPI"}

GET /square/7
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
    a: "WSGI is the older Python server standard used by Flask and classic Django, and it handles one request per worker at a time in a blocking way. ASGI is the async version, so one worker can handle many requests while others are waiting on I/O, and it also supports WebSockets. FastAPI is an ASGI app, and Uvicorn is the ASGI server that actually runs it. In this example both requests are served by the same app while the first one awaits without blocking the event loop.",
    code: `import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/slow")
async def slow():
    await asyncio.sleep(0.1)  # waits without blocking other requests
    return {"done": True}

@app.get("/fast")
async def fast():
    return {"done": True}

# Run with the ASGI server:  uvicorn main:app`,
    output: `GET /slow
→ 200 OK
{"done": true}

GET /fast
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

# Run it:
#   uvicorn main:app --reload   (--reload restarts on code change)
#   fastapi dev main.py         (needs: pip install "fastapi[standard]")`,
    output: `$ uvicorn main:app --reload
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [30296] using StatReload
INFO:     Started server process [30298]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:61992 - "GET / HTTP/1.1" 200 OK

$ curl http://127.0.0.1:8000/
{"Hello":"World"}`,
  },
  {
    q: "What automatic documentation does FastAPI give you?",
    level: 'Basics',
    a: "FastAPI generates an OpenAPI schema from my routes, type hints, and Pydantic models. It serves interactive Swagger UI at /docs, where I can try requests from the browser, and ReDoc at /redoc for clean read-only docs. The raw schema is at /openapi.json, which frontend teams can use to generate clients. Tip: adding a title, summary, and tags makes the docs much easier to read.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Shop API", version="1.0")

class Item(BaseModel):
    name: str
    price: float

@app.post("/items", tags=["items"], summary="Create an item")
def create_item(item: Item):
    return item`,
    output: `GET /docs
→ 200 OK
content-type: text/html; charset=utf-8
(Swagger UI HTML page)

GET /redoc
→ 200 OK
content-type: text/html; charset=utf-8
(ReDoc HTML page)

GET /openapi.json
→ 200 OK
paths: /items
schemas: HTTPValidationError, Item, ValidationError
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do you hide an endpoint from the docs or mark it as deprecated?",
    level: 'Basics',
    a: "I pass include_in_schema=False to the decorator for internal routes like a metrics or debug endpoint; it still works, it just doesn't appear in /docs. For an old route I want clients to move away from, I set deprecated=True, and Swagger shows it crossed out. The summary comes from the decorator and the description comes from the function's docstring, so good docstrings become good API docs. Hiding a route is not security, so I still protect it with auth.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/v2/users", summary="List users")
def list_users():
    """Returns all active users, newest first."""
    return ["anu", "ravi"]

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
paths in the docs: /v2/users, /v1/users
GET /v2/users: summary='List users', deprecated=False
  description='Returns all active users, newest first.'
GET /v1/users: summary='List Users Old', deprecated=True
(summary of the generated OpenAPI schema)`,
  },
  {
    q: "How do path parameters work, and what happens with the wrong type?",
    level: 'Basics',
    a: "A path parameter is part of the URL, written in curly braces like /items/{item_id}. I add a type hint such as int, and FastAPI converts the string from the URL to that type. If the value can't be converted, FastAPI returns a 422 error automatically, so I don't write that check myself. Tip: put fixed routes like /users/me before /users/{user_id}, because routes are matched in order.",
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/users/me")
def read_me():
    return {"user": "current user"}

@app.get("/users/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id}`,
    output: `GET /users/5
→ 200 OK
{"user_id": 5}

GET /users/me
→ 200 OK
{"user": "current user"}

GET /users/abc
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
      "input": "abc"
    }
  ]
}`,
  },
  {
    q: "How do you restrict a path parameter to fixed values with an Enum?",
    level: 'Basics',
    a: "I create a class that inherits from both str and Enum, and use it as the type hint of the path parameter. FastAPI then only accepts those values, returns a 422 listing the allowed options for anything else, and shows a dropdown in the docs. Inside the function I compare against the enum members, so I don't have magic strings all over the code.",
    code: `from enum import Enum
from fastapi import FastAPI

app = FastAPI()

class Category(str, Enum):
    books = "books"
    toys = "toys"

@app.get("/products/{category}")
def by_category(category: Category):
    if category is Category.books:
        return {"category": category, "offer": "Free delivery on books"}
    return {"category": category.value}`,
    output: `GET /products/books
→ 200 OK
{"category": "books", "offer": "Free delivery on books"}

GET /products/toys
→ 200 OK
{"category": "toys"}

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
    q: "How do query parameters work? How do you make them optional?",
    level: 'Basics',
    a: "Any function parameter that is not in the path and is a simple type becomes a query parameter, like ?skip=0&limit=10. If I give it a default value it's optional, and if I use str | None = None it can be left out completely. Without a default it becomes required. FastAPI also converts types, so limit=2 arrives as an int.",
    code: `from fastapi import FastAPI

app = FastAPI()
items = ["pen", "book", "bag", "pencil"]

@app.get("/items")
def list_items(skip: int = 0, limit: int = 10, q: str | None = None):
    result = items
    if q:
        result = [i for i in result if q in i]
    return result[skip: skip + limit]`,
    output: `GET /items
→ 200 OK
["pen", "book", "bag", "pencil"]

GET /items?q=pen
→ 200 OK
["pen", "pencil"]

GET /items?skip=1&limit=2
→ 200 OK
["book", "bag"]`,
  },
  {
    q: "How do you accept a list of values in a query parameter?",
    level: 'Basics',
    a: "I declare the parameter as list[str] and wrap it with Query(), because without Query() FastAPI would think a list means a JSON body. Then the client repeats the key, like ?tag=red&tag=blue, and I get a normal Python list. I give it a default of None or an empty list so it stays optional.",
    code: `from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()
products = [
    {"name": "Pen", "tag": "red"},
    {"name": "Cup", "tag": "blue"},
    {"name": "Bag", "tag": "green"},
]

@app.get("/products")
def filter_products(tag: Annotated[list[str] | None, Query()] = None):
    if not tag:
        return products
    return [p for p in products if p["tag"] in tag]`,
    output: `GET /products?tag=red&tag=blue
→ 200 OK
[
  {
    "name": "Pen",
    "tag": "red"
  },
  {
    "name": "Cup",
    "tag": "blue"
  }
]

GET /products?tag=green
→ 200 OK
[{"name": "Bag", "tag": "green"}]`,
  },
  {
    q: "How do you accept a JSON request body?",
    level: 'Basics',
    a: "I define a Pydantic model that describes the JSON shape and use it as the type of a function parameter. FastAPI reads the body, validates every field, converts the types, and gives me a real Python object. If a required field is missing or has the wrong type, the client gets a 422 with details. Fields with defaults or None are optional.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True
    description: str | None = None

@app.post("/items")
def create_item(item: Item):
    return {"saved": item.name, "price_with_tax": round(item.price * 1.1, 2)}`,
    output: `POST /items
{"name": "Pen", "price": 10}
→ 200 OK
{"saved": "Pen", "price_with_tax": 11.0}

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
    a: "I build small models and use them as field types inside other models, like an Address inside an Order, and list[OrderItem] for an array of objects. FastAPI validates the whole tree, and if something deep inside is wrong, the error loc tells me the exact path, like body > items > 1 > qty. I get real objects back, so I can write order.address.city with autocomplete instead of digging through dicts.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Address(BaseModel):
    city: str
    pin: str

class OrderItem(BaseModel):
    name: str
    qty: int = 1

class Order(BaseModel):
    customer: str
    address: Address          # nested model
    items: list[OrderItem]    # list of models
    tags: set[str] = set()    # duplicates removed

@app.post("/orders")
def create_order(order: Order):
    total_qty = sum(item.qty for item in order.items)
    return {"city": order.address.city, "total_qty": total_qty,
            "tags": sorted(order.tags)}`,
    output: `POST /orders
{"customer": "Anu", "address": {"city": "Kochi", "pin": "682001"}, "items": [{"name": "Pen", "qty": 3}, {"name": "Book"}], "tags": ["gift", "gift", "urgent"]}
→ 200 OK
{
  "city": "Kochi",
  "total_qty": 4,
  "tags": [
    "gift",
    "urgent"
  ]
}

POST /orders
{"customer": "Anu", "address": {"city": "Kochi", "pin": "682001"}, "items": [{"name": "Pen"}, {"name": "Book", "qty": "two"}]}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "body",
        "items",
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
from pydantic import BaseModel, Field

app = FastAPI()

class Profile(BaseModel):
    name: str                        # required
    bio: str | None = None           # optional, may be null
    country: str = "India"           # optional with a default
    skills: list[str] = Field(default_factory=list)
    nickname: str | None             # required, but null is allowed

@app.post("/profiles")
def create_profile(profile: Profile):
    return profile`,
    output: `POST /profiles
{"name": "Anu", "nickname": null}
→ 200 OK
{
  "name": "Anu",
  "bio": null,
  "country": "India",
  "skills": [],
  "nickname": null
}

POST /profiles
{"name": "Anu"}
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
      "input": {
        "name": "Anu"
      }
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

app = FastAPI()

class UserIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str

@app.post("/users", response_model=UserOut)
def create_user(user: UserIn):
    return user  # password is filtered out by UserOut`,
    output: `POST /users
{"username": "anu", "password": "secret123"}
→ 200 OK
{"username": "anu"}`,
  },
  {
    q: "How do you return a list of models and hide empty fields?",
    level: 'Basics',
    a: "I can use a return type like -> list[ItemOut] (or response_model=list[ItemOut]), and FastAPI validates and filters every item in the list. Fields that are not in ItemOut, like an internal cost price, are dropped. With response_model_exclude_none=True, fields whose value is None are left out, which keeps mobile payloads small. I prefer the return type style because my editor also understands it.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ItemOut(BaseModel):
    id: int
    name: str
    discount: float | None = None

ITEMS = [
    {"id": 1, "name": "Pen", "discount": None, "cost_price": 4},
    {"id": 2, "name": "Bag", "discount": 10.0, "cost_price": 300},
]

@app.get("/items")
def list_items() -> list[ItemOut]:
    return ITEMS  # cost_price is filtered out

@app.get("/items/compact", response_model=list[ItemOut],
         response_model_exclude_none=True)
def list_items_compact():
    return ITEMS`,
    output: `GET /items
→ 200 OK
[
  {
    "id": 1,
    "name": "Pen",
    "discount": null
  },
  {
    "id": 2,
    "name": "Bag",
    "discount": 10.0
  }
]

GET /items/compact
→ 200 OK
[
  {
    "id": 1,
    "name": "Pen"
  },
  {
    "id": 2,
    "name": "Bag",
    "discount": 10.0
  }
]`,
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
    is_admin: bool = False

users: list[User] = []

@app.post("/users", response_model=User)
def create_user(user: User):
    users.append(user)
    print("python attribute:", user.user_name)
    return user

@app.get("/users/{idx}/public", response_model=User,
         response_model_exclude={"email", "is_admin"})
def public_user(idx: int):
    return users[idx]`,
    output: `POST /users
{"userName": "anu", "email": "anu@example.com"}
→ 200 OK
{
  "userName": "anu",
  "email": "anu@example.com",
  "is_admin": false
}

GET /users/0/public
→ 200 OK
{"userName": "anu"}

Server console:
python attribute: anu`,
  },
  {
    q: "How do you set HTTP status codes?",
    level: 'Basics',
    a: "I set the default success code in the decorator with status_code, for example 201 for create and 204 for delete. I use the status module constants so the code is readable. For errors I raise HTTPException with the right code. A 204 response should have no body, so I return nothing.",
    code: `from fastapi import FastAPI, status

app = FastAPI()
notes = {}

@app.post("/notes", status_code=status.HTTP_201_CREATED)
def create_note(text: str):
    note_id = len(notes) + 1
    notes[note_id] = text
    return {"id": note_id, "text": text}

@app.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int):
    notes.pop(note_id, None)`,
    output: `POST /notes?text=buy milk
→ 201 Created
{"id": 1, "text": "buy milk"}

DELETE /notes/1
→ 204 No Content`,
  },
  {
    q: "How do you set custom response headers or change the status code at runtime?",
    level: 'Basics',
    a: "I add a parameter of type Response to my route, and FastAPI gives me the response object it will send. I can set headers like Cache-Control or a custom X- header on it, and still return a normal dict. I can also change response.status_code based on logic, for example 201 when an upsert creates something new and 200 when it only updates.",
    code: `from fastapi import FastAPI, Response

app = FastAPI()
settings: dict[str, str] = {}

@app.get("/report")
def report(response: Response):
    response.headers["X-Report-Version"] = "2"
    response.headers["Cache-Control"] = "max-age=60"
    return {"rows": 3}

@app.put("/settings/{key}")
def upsert_setting(key: str, value: str, response: Response):
    if key not in settings:
        response.status_code = 201  # created
    settings[key] = value
    return {key: value}`,
    output: `GET /report
→ 200 OK
x-report-version: 2
cache-control: max-age=60
{"rows": 3}

PUT /settings/theme?value=dark
→ 201 Created
{"theme": "dark"}

PUT /settings/theme?value=light
→ 200 OK
{"theme": "light"}`,
  },
  {
    q: "How would you build basic CRUD routes?",
    level: 'Basics',
    a: "I map each action to an HTTP method: GET to read, POST to create, PUT to update, and DELETE to remove. In this example I keep data in an in-memory dict just to show the idea; in a real app this would be a database. In a real app I'd also return 404 when an item doesn't exist (see the HTTPException question), and DELETE works like in the status codes example. This keeps the API predictable and RESTful.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
todos = {}  # id -> Todo (in-memory "database")

class Todo(BaseModel):
    title: str
    done: bool = False

@app.get("/todos")
def list_todos():
    return todos

@app.post("/todos", status_code=201)
def create_todo(todo: Todo):
    todo_id = len(todos) + 1
    todos[todo_id] = todo
    return {"id": todo_id, **todo.model_dump()}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: Todo):
    todos[todo_id] = todo  # real app: raise 404 if todo_id is missing
    return todo`,
    output: `POST /todos
{"title": "Learn FastAPI"}
→ 201 Created
{"id": 1, "title": "Learn FastAPI", "done": false}

PUT /todos/1
{"title": "Learn FastAPI", "done": true}
→ 200 OK
{"title": "Learn FastAPI", "done": true}

GET /todos
→ 200 OK
{"1": {"title": "Learn FastAPI", "done": true}}`,
  },
  {
    q: "What is the difference between PUT and PATCH, and how do you do a partial update?",
    level: 'Basics',
    a: "PUT replaces the whole resource, so fields I don't send go back to their defaults. PATCH changes only the fields I send. For PATCH I use a model where every field is optional, and model_dump(exclude_unset=True) gives me only the fields the client actually sent, which I merge with model_copy(update=...). In a real app I'd also return 404 from PATCH when the id doesn't exist.",
    code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
items = {}  # id -> Item

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

class ItemUpdate(BaseModel):  # every field optional
    price: float | None = None
    in_stock: bool | None = None

@app.put("/items/{item_id}")  # replace everything
def replace_item(item_id: int, item: Item):
    items[item_id] = item
    return item

@app.patch("/items/{item_id}")  # change only what was sent
def update_item(item_id: int, changes: ItemUpdate):
    data = changes.model_dump(exclude_unset=True)
    items[item_id] = items[item_id].model_copy(update=data)
    return items[item_id]`,
    output: `PUT /items/1
{"name": "Pen", "price": 10}
→ 200 OK
{"name": "Pen", "price": 10.0, "in_stock": true}

PATCH /items/1
{"in_stock": false}
→ 200 OK
{"name": "Pen", "price": 10.0, "in_stock": false}

PATCH /items/1
{"price": 12.5}
→ 200 OK
{"name": "Pen", "price": 12.5, "in_stock": false}

PUT /items/1
{"name": "Pen Pro", "price": 15}
→ 200 OK
{"name": "Pen Pro", "price": 15.0, "in_stock": true}`,
  },
  {
    q: "How does FastAPI decide if a parameter is path, query, or body?",
    level: 'Basics',
    a: "If the name is in the URL path, it's a path parameter. If it's a simple type like int or str and not in the path, it's a query parameter. If it's a Pydantic model, it's read from the JSON body. I can use them all together in one endpoint, and I can be explicit with Path(), Query(), and Body() when I need extra rules.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item, notify: bool = False):
    #           path ^       body ^       query ^
    return {"item_id": item_id, "item": item, "notify": notify}`,
    output: `PUT /items/3?notify=true
{"name": "Pen", "price": 12.5}
→ 200 OK
{
  "item_id": 3,
  "item": {
    "name": "Pen",
    "price": 12.5
  },
  "notify": true
}`,
  },
  {
    q: "How do you add validation rules with Pydantic Field?",
    level: 'Intermediate',
    a: "I use Field() inside the model to add rules like min_length, max_length, gt (greater than), and ge (greater or equal). For query and path parameters I use Query() and Path() with the same kind of rules. FastAPI checks all of them before my code runs and returns every error at once. These rules also show up in the docs.",
    code: `from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()

class Product(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    price: float = Field(gt=0)
    quantity: int = Field(default=1, ge=1, le=100)

@app.post("/products")
def create_product(product: Product):
    return product

@app.get("/search")
def search(q: str = Query(min_length=3)):
    return {"q": q}`,
    output: `POST /products
{"name": "Pen", "price": 10, "quantity": 5}
→ 200 OK
{"name": "Pen", "price": 10.0, "quantity": 5}

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
}

GET /search?q=ab
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": [
        "query",
        "q"
      ],
      "msg": "String should have at least 3 characters",
      "input": "ab",
      "ctx": {
        "min_length": 3
      }
    }
  ]
}`,
  },
  {
    q: "What is the Annotated style for parameters, and why is it recommended?",
    level: 'Intermediate',
    a: "With Annotated I write the type first and put the FastAPI info as metadata, like Annotated[int, Query(gt=0)]. It is the style the FastAPI docs recommend now, because the default value stays a normal Python default and the function still works if I call it outside FastAPI. I can also save a common rule as a type alias, like ItemId, and reuse it in many routes. Here I validate a range with ge/le and a format with pattern.",
    code: `from typing import Annotated
from fastapi import FastAPI, Path, Query

app = FastAPI()

ItemId = Annotated[int, Path(ge=1, le=1000)]  # reusable rule

@app.get("/items/{item_id}")
def read_item(
    item_id: ItemId,
    q: Annotated[str | None, Query(max_length=20, pattern="^[a-z]+$")] = None,
    limit: Annotated[int, Query(gt=0, le=50)] = 10,
):
    return {"item_id": item_id, "q": q, "limit": limit}`,
    output: `GET /items/5?q=pen&limit=3
→ 200 OK
{"item_id": 5, "q": "pen", "limit": 3}

GET /items/0
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "greater_than_equal",
      "loc": [
        "path",
        "item_id"
      ],
      "msg": "Input should be greater than or equal to 1",
      "input": "0",
      "ctx": {
        "ge": 1
      }
    }
  ]
}

GET /items/5?q=Pen1&limit=100
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "string_pattern_mismatch",
      "loc": [
        "query",
        "q"
      ],
      "msg": "String should match pattern '^[a-z]+$'",
      "input": "Pen1",
      "ctx": {
        "pattern": "^[a-z]+$"
      }
    },
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
    q: "How do you validate emails and write custom validators?",
    level: 'Intermediate',
    a: "For emails I use EmailStr from Pydantic, which needs the email-validator package (pip install \"pydantic[email]\"). For my own rules I write a function with @field_validator, raise ValueError if the value is bad, and return the cleaned value if it's good. FastAPI turns that ValueError into a normal 422 error. Here I also use the validator to clean the username to lowercase.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, field_validator

app = FastAPI()

class SignUp(BaseModel):
    username: str
    email: EmailStr

    @field_validator("username")
    @classmethod
    def check_username(cls, value: str) -> str:
        if not value.isalnum():
            raise ValueError("username must be letters and numbers only")
        return value.lower()

@app.post("/signup")
def signup(data: SignUp):
    return data`,
    output: `POST /signup
{"username": "Anu123", "email": "anu@example.com"}
→ 200 OK
{"username": "anu123", "email": "anu@example.com"}

POST /signup
{"username": "anu!", "email": "not-an-email"}
→ 422 Unprocessable Content
{
  "detail": [
    {
      "type": "value_error",
      "loc": [
        "body",
        "username"
      ],
      "msg": "Value error, username must be letters and numbers only",
      "input": "anu!",
      "ctx": {
        "error": {}
      }
    },
    {
      "type": "value_error",
      "loc": [
        "body",
        "email"
      ],
      "msg": "value is not a valid email address: An email address must have an @-sign.",
      "input": "not-an-email",
      "ctx": {
        "reason": "An email address must have an @-sign."
      }
    }
  ]
}`,
  },
  {
    q: "How do you validate fields together and add computed fields?",
    level: 'Intermediate',
    a: "When a rule depends on more than one field, like check_out must be after check_in, I use @model_validator(mode=\"after\"), which runs once all fields are valid. If I raise ValueError, FastAPI turns it into a 422. For values derived from other fields, like number of nights or the total price, I use @computed_field, so they appear in the response and the docs without being sent by the client.",
    code: `from datetime import date
from fastapi import FastAPI
from pydantic import BaseModel, computed_field, model_validator

app = FastAPI()

class Booking(BaseModel):
    check_in: date
    check_out: date
    price_per_night: int

    @model_validator(mode="after")
    def check_dates(self):
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        return self

    @computed_field
    @property
    def total(self) -> int:
        return (self.check_out - self.check_in).days * self.price_per_night

@app.post("/bookings")
def create_booking(booking: Booking):
    return booking`,
    output: `POST /bookings
{"check_in": "2025-05-01", "check_out": "2025-05-04", "price_per_night": 2000}
→ 200 OK
{
  "check_in": "2025-05-01",
  "check_out": "2025-05-04",
  "price_per_night": 2000,
  "total": 6000
}

POST /bookings
{"check_in": "2025-05-04", "check_out": "2025-05-01", "price_per_night": 2000}
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
        "check_in": "2025-05-04",
        "check_out": "2025-05-01",
        "price_per_night": 2000
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
    a: "In Pydantic v2 I set model_config = ConfigDict(...) on the model. extra=\"forbid\" rejects unknown fields, which protects me from a client sneaking in something like role=admin. str_strip_whitespace and str_to_lower clean up text input before validation, so I don't repeat that in every route. Other useful options are frozen=True for read-only objects and from_attributes=True for ORM objects.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

app = FastAPI()

class SignUp(BaseModel):
    model_config = ConfigDict(
        extra="forbid",            # unknown fields -> 422
        str_strip_whitespace=True,
        str_to_lower=True,
    )
    username: str
    email: str

@app.post("/signup")
def signup(data: SignUp):
    return data`,
    output: `POST /signup
{"username": "  Anu  ", "email": " ANU@Example.COM "}
→ 200 OK
{"username": "anu", "email": "anu@example.com"}

POST /signup
{"username": "anu", "email": "anu@example.com", "role": "admin"}
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
    code: `from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    errors = {".".join(map(str, e["loc"])): e["msg"] for e in exc.errors()}
    return JSONResponse(status_code=422, content={"ok": False, "errors": errors})

@app.get("/items/{item_id}")
def read_item(item_id: int, limit: int = 10):
    return {"item_id": item_id, "limit": limit}`,
    output: `GET /items/abc?limit=xyz
→ 422 Unprocessable Content
{
  "ok": false,
  "errors": {
    "path.item_id": "Input should be a valid integer, unable to parse string as an integer",
    "query.limit": "Input should be a valid integer, unable to parse string as an integer"
  }
}`,
  },
  {
    q: "How do you return errors with HTTPException?",
    level: 'Intermediate',
    a: "I raise HTTPException with a status code and a detail message, and FastAPI stops the request and sends that as JSON. I use it for things like 404 not found, 401 not logged in, or 403 not allowed. I can also add custom headers. I raise it instead of returning it, so it works even from inside helper functions and dependencies.",
    code: `from fastapi import FastAPI, HTTPException

app = FastAPI()
users = {1: "Anu", 2: "Ravi"}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    if user_id not in users:
        raise HTTPException(
            status_code=404,
            detail=f"User {user_id} not found",
            headers={"X-Error": "user-missing"},
        )
    return {"id": user_id, "name": users[user_id]}`,
    output: `GET /users/1
→ 200 OK
{"id": 1, "name": "Anu"}

GET /users/99
→ 404 Not Found
x-error: user-missing
{"detail": "User 99 not found"}`,
  },
  {
    q: "How do you create a custom exception handler?",
    level: 'Intermediate',
    a: "I define my own exception class for a business error and register a handler with @app.exception_handler. The handler receives the request and the exception and returns a response in the format I want. This keeps my route code clean because I just raise the error and one place decides how it looks. It's useful for domain errors like 'out of stock'.",
    code: `from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

class OutOfStockError(Exception):
    def __init__(self, product: str):
        self.product = product

@app.exception_handler(OutOfStockError)
async def out_of_stock_handler(request: Request, exc: OutOfStockError):
    return JSONResponse(
        status_code=409,
        content={"error": "out_of_stock", "message": f"{exc.product} is sold out"},
    )

stock = {"pen": 3, "book": 0}

@app.post("/buy/{product}")
def buy(product: str):
    if stock.get(product, 0) == 0:
        raise OutOfStockError(product)
    stock[product] -= 1
    return {"bought": product, "left": stock[product]}`,
    output: `POST /buy/pen
→ 200 OK
{"bought": "pen", "left": 2}

POST /buy/book
→ 409 Conflict
{"error": "out_of_stock", "message": "book is sold out"}`,
  },
  {
    q: "How do you organize a bigger project with APIRouter?",
    level: 'Intermediate',
    a: "I split routes by feature into separate files, each with its own APIRouter, and then include them in main.py with include_router. I set a prefix and tags on each router so I don't repeat /users everywhere and the docs are grouped. A typical structure is app/main.py, app/routers/, app/models/, app/schemas/, and app/core/config.py. Here it's in one file just so it can run.",
    code: `# app/
#   main.py          -> creates app, includes routers
#   routers/users.py -> users router
#   routers/items.py -> items router
from fastapi import APIRouter, FastAPI

users = APIRouter(prefix="/users", tags=["users"])

@users.get("/")
def list_users():
    return ["anu", "ravi"]

items = APIRouter(prefix="/items", tags=["items"])

@items.get("/{item_id}")
def get_item(item_id: int):
    return {"item_id": item_id}

app = FastAPI()
app.include_router(users)
app.include_router(items, prefix="/api")`,
    output: `GET /users/
→ 200 OK
["anu", "ravi"]

GET /api/items/7
→ 200 OK
{"item_id": 7}`,
  },
  {
    q: "How do you serve static files, send a file download, or mount a sub-application?",
    level: 'Intermediate',
    a: "app.mount() attaches a whole separate ASGI app under a path. I use it with StaticFiles to serve a folder of images or CSS, and I can also mount another FastAPI app, which gets its own docs at /admin/docs. To send one file as a download I return FileResponse with a filename, which sets the Content-Disposition header. In production I usually let Nginx or a CDN serve static files because it's faster.",
    code: `import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

os.makedirs("static", exist_ok=True)  # demo setup
with open("static/hello.txt", "w") as f:
    f.write("Hello from a static file")

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

admin_app = FastAPI(title="Admin")  # its own docs at /admin/docs

@admin_app.get("/stats")
def stats():
    return {"users": 42}

app.mount("/admin", admin_app)

@app.get("/download")
def download():
    return FileResponse("static/hello.txt", filename="report.txt")`,
    output: `GET /static/hello.txt
→ 200 OK
content-type: text/plain; charset=utf-8
Hello from a static file

GET /admin/stats
→ 200 OK
{"users": 42}

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

def pagination(page: int = 1, size: int = 2):
    return {"offset": (page - 1) * size, "size": size}

products = ["pen", "book", "bag", "cup", "lamp"]

@app.get("/products")
def list_products(p: dict = Depends(pagination)):
    return products[p["offset"]: p["offset"] + p["size"]]

@app.get("/debug/paging")
def show_paging(p: dict = Depends(pagination)):
    return p`,
    output: `GET /products
→ 200 OK
["pen", "book"]

GET /products?page=2
→ 200 OK
["bag", "cup"]

GET /debug/paging?page=3&size=10
→ 200 OK
{"offset": 20, "size": 10}`,
  },
  {
    q: "How do you apply one dependency to many routes, like an API key check?",
    level: 'Intermediate',
    a: "I can add dependencies=[Depends(...)] on a router or on the whole app, so every route under it runs that check. This is good for things like API key or auth checks where the route doesn't need the return value. The dependency raises HTTPException if the check fails. Here the /public route is outside the protected router.",
    code: `from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException

def verify_api_key(x_api_key: str | None = Header(default=None)):
    if x_api_key != "secret-key":
        raise HTTPException(status_code=401, detail="Invalid API key")

admin = APIRouter(prefix="/admin", dependencies=[Depends(verify_api_key)])

@admin.get("/stats")
def stats():
    return {"users": 42}

app = FastAPI()
app.include_router(admin)

@app.get("/public")
def public():
    return {"open": True}`,
    output: `GET /public
→ 200 OK
{"open": true}

GET /admin/stats
→ 401 Unauthorized
{"detail": "Invalid API key"}

GET /admin/stats
X-API-Key: secret-key
→ 200 OK
{"users": 42}`,
  },
  {
    q: "What is a yield dependency and how do you use it for a DB session?",
    level: 'Intermediate',
    a: "A dependency with yield runs the code before yield when the request starts, gives the value to the route, and runs the code after yield when the request is done. That's perfect for a database session because I can open it, hand it to the route, and always close it in a finally block, even if there's an error. In a real app the FakeSession would be SQLAlchemy's SessionLocal().",
    code: `from fastapi import Depends, FastAPI

app = FastAPI()

class FakeSession:
    def query_users(self):
        return ["anu", "ravi"]

    def close(self):
        print("session closed")

def get_db():
    db = FakeSession()
    print("session opened")
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def list_users(db: FakeSession = Depends(get_db)):
    print("handling request")
    return db.query_users()`,
    output: `GET /users
→ 200 OK
["anu", "ravi"]

Server console:
session opened
handling request
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
        self.q = q
        self.sort = sort

class Paginator:
    def __init__(self, max_size: int):
        self.max_size = max_size

    def __call__(self, page: int = 1, size: int = 10):
        return {"page": page, "size": min(size, self.max_size)}

@app.get("/products")
def products(f: Annotated[Filters, Depends()],
             paging: Annotated[dict, Depends(Paginator(max_size=20))]):
    return {"q": f.q, "sort": f.sort, **paging}`,
    output: `GET /products
→ 200 OK
{"q": null, "sort": "name", "page": 1, "size": 10}

GET /products?q=pen&sort=price&page=2&size=500
→ 200 OK
{"q": "pen", "sort": "price", "page": 2, "size": 20}`,
  },
  {
    q: "What are sub-dependencies, and is a dependency called twice in one request?",
    level: 'Intermediate',
    a: "A dependency can itself depend on other dependencies, so I build a chain like get_token, then get_current_user, then the route. FastAPI resolves the whole tree for me. If the same dependency appears more than once in one request, FastAPI calls it only once and reuses the result, which you can see in the console here (the second request stops at get_token with a 401). If I really need a fresh call each time, I use Depends(func, use_cache=False).",
    code: `from typing import Annotated
from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()
TOKENS = {"abc123": "anu"}

def get_token(authorization: Annotated[str | None, Header()] = None):
    print("get_token called")
    if not authorization:
        raise HTTPException(401, "Missing token")
    return authorization.removeprefix("Bearer ")

def get_current_user(token: Annotated[str, Depends(get_token)]):
    print("get_current_user called")
    if token not in TOKENS:
        raise HTTPException(401, "Invalid token")
    return {"name": TOKENS[token]}

@app.get("/me")
def me(user: Annotated[dict, Depends(get_current_user)],
       token: Annotated[str, Depends(get_token)]):  # reused, not re-run
    return {"user": user, "token": token}`,
    output: `GET /me
Authorization: Bearer abc123
→ 200 OK
{"user": {"name": "anu"}, "token": "abc123"}

GET /me
→ 401 Unauthorized
{"detail": "Missing token"}

Server console:
get_token called
get_current_user called
get_token called`,
  },
  {
    q: "How do you implement role-based authorization?",
    level: 'Intermediate',
    a: "First I have a dependency that finds the current user, which returns 401 if they are not logged in. Then I write a small factory, require_role(\"admin\"), that returns a dependency checking the user's role and raising 403 Forbidden if it doesn't match. 401 means \"I don't know who you are\" and 403 means \"I know you, but you're not allowed\". Each route just declares the roles it needs, so the rule is visible right on the endpoint.",
    code: `from typing import Annotated
from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()
USERS = {"t-anu": {"name": "anu", "role": "admin"},
         "t-ravi": {"name": "ravi", "role": "viewer"}}

def current_user(x_token: Annotated[str | None, Header()] = None):
    if x_token not in USERS:
        raise HTTPException(401, "Not logged in")
    return USERS[x_token]

def require_role(*roles: str):
    def checker(user: Annotated[dict, Depends(current_user)]):
        if user["role"] not in roles:
            raise HTTPException(403, "Not enough permissions")
        return user
    return checker

@app.delete("/products/{pid}")
def delete_product(pid: int,
                   user: Annotated[dict, Depends(require_role("admin"))]):
    return {"deleted": pid, "by": user["name"]}`,
    output: `DELETE /products/7
→ 401 Unauthorized
{"detail": "Not logged in"}

DELETE /products/7
X-Token: t-ravi
→ 403 Forbidden
{"detail": "Not enough permissions"}

DELETE /products/7
X-Token: t-anu
→ 200 OK
{"deleted": 7, "by": "anu"}`,
  },
  {
    q: "How do you read headers and cookies, and set a cookie?",
    level: 'Intermediate',
    a: "I use Header() and Cookie() as default values for parameters. For headers, FastAPI converts underscores to dashes, so user_agent reads the User-Agent header. To set a cookie I add a Response parameter and call response.set_cookie. For login cookies I'd set httponly=True so JavaScript can't read them.",
    code: `from fastapi import Cookie, FastAPI, Header, Response

app = FastAPI()

@app.get("/whoami")
def whoami(
    user_agent: str | None = Header(default=None),
    session_id: str | None = Cookie(default=None),
):
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
    return {
        "method": request.method,
        "path": request.url.path,
        "query": dict(request.query_params),
        "client_ip": request.client.host,
        "content_type": request.headers["content-type"],
        "body": body,
    }`,
    output: `POST /webhook?source=stripe
{"event": "paid"}
→ 200 OK
{
  "method": "POST",
  "path": "/webhook",
  "query": {
    "source": "stripe"
  },
  "client_ip": "testclient",
  "content_type": "application/json",
  "body": {
    "event": "paid"
  }
}
(client_ip is "testclient" because the request came from TestClient)`,
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
    a: "I use UploadFile with File(), which needs python-multipart. UploadFile gives me the filename, content type, and an async read() method, and it spools large files to disk instead of keeping everything in memory. I always check the content type and size before saving. For multiple files I use list[UploadFile].",
    code: `from fastapi import FastAPI, File, HTTPException, UploadFile

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile = File()):
    if file.content_type != "text/plain":
        raise HTTPException(400, "Only .txt files allowed")
    content = await file.read()
    return {
        "filename": file.filename,
        "size": len(content),
        "first_line": content.decode().splitlines()[0],
    }`,
    output: `POST /upload
(multipart) file=notes.txt, text/plain
→ 200 OK
{
  "filename": "notes.txt",
  "size": 23,
  "first_line": "hello world"
}

POST /upload
(multipart) file=photo.png, image/png
→ 400 Bad Request
{"detail": "Only .txt files allowed"}`,
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
    a: "Middleware is code that runs for every request before it reaches the route and for every response before it goes back. I use it for things like logging, timing, adding headers, or request IDs. I write it with @app.middleware(\"http\") and call call_next(request) to continue. A common example is adding an X-Process-Time header; here I add a fixed header and print the path so the output stays the same every run.",
    code: `from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_headers(request: Request, call_next):
    print(f"-> {request.method} {request.url.path}")
    response = await call_next(request)
    response.headers["X-App-Version"] = "1.0"
    print(f"<- {response.status_code}")
    return response

@app.get("/ping")
def ping():
    return {"pong": True}`,
    output: `GET /ping
→ 200 OK
x-app-version: 1.0
{"pong": true}

Server console:
-> GET /ping
<- 200`,
  },
  {
    q: "What is CORS and how do you enable it?",
    level: 'Intermediate',
    a: "CORS is a browser security rule that blocks a frontend on one origin, like localhost:5173, from calling an API on another origin unless the API allows it. In FastAPI I add CORSMiddleware with the allowed origins, methods, and headers. In production I list the exact frontend domains instead of using \"*\". You only see CORS problems in the browser, not in tools like curl or Postman.",
    code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    q: "How do you manage settings and environment variables?",
    level: 'Intermediate',
    a: "I use pydantic-settings and create a Settings class that inherits from BaseSettings. It reads values from environment variables or a .env file and validates their types, so a wrong value fails at startup. I usually wrap it in a function with lru_cache so it's created once, and inject it with Depends. Secrets never go in the code, only in env vars.",
    code: `from functools import lru_cache
from fastapi import Depends, FastAPI
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "My API"
    debug: bool = False
    max_items: int = 50
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings():
    return Settings()

app = FastAPI()

@app.get("/info")
def info(settings: Settings = Depends(get_settings)):
    return settings.model_dump()

# Shell: export APP_NAME="Shop API" DEBUG=true`,
    output: `GET /info
→ 200 OK
{"app_name": "Shop API", "debug": true, "max_items": 50}`,
  },
  {
    q: "When should you use async def vs def for endpoints?",
    level: 'Intermediate',
    a: "I use async def when the code inside awaits async libraries, like httpx.AsyncClient, an async DB driver, or asyncio.sleep. I use a normal def when I call blocking libraries, like requests or a sync DB driver, because FastAPI runs def routes in a thread pool so they don't block the event loop. The big mistake is calling blocking code like time.sleep inside async def, which freezes the whole server. Both styles give the same response to the client.",
    code: `import asyncio
import time
from fastapi import FastAPI

app = FastAPI()

@app.get("/async")
async def async_route():
    await asyncio.sleep(0.05)  # non-blocking wait
    return {"type": "async def"}

@app.get("/sync")
def sync_route():
    time.sleep(0.05)  # blocking, but runs in a thread pool
    return {"type": "def"}

# BAD: time.sleep() inside async def blocks every request`,
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
    code: `import asyncio
import time
from fastapi import FastAPI

app = FastAPI()

def slow_report():  # blocking, e.g. a sync library call
    time.sleep(0.5)
    return {"ok": True}

@app.get("/bad")
async def bad():
    return slow_report()  # blocks the event loop!

@app.get("/good")
async def good():
    return await asyncio.to_thread(slow_report)  # runs in a thread`,
    output: `Sending 3 requests at the same time:
GET /bad x3 → all 200 OK, total time ≈ 1.5s
GET /good x3 → all 200 OK, total time ≈ 0.5s
(/bad runs them one after another; /good runs them in parallel)`,
  },
  {
    q: "How do you implement authentication with OAuth2 and JWT?",
    level: 'Advanced',
    a: "The client posts username and password to a /token endpoint as a form, and if they're correct I return a signed JWT access token. For protected routes I use OAuth2PasswordBearer, which reads the Authorization: Bearer header, and a get_current_user dependency that decodes and verifies the token. Here I use the PyJWT library; in a real app I'd also hash passwords with bcrypt or argon2, add an \"exp\" expiry, and keep the secret in env vars. I left out expiry here only so the token in the output stays the same.",
    code: `import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

SECRET = "change-me"
app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
fake_users = {"anu": "pass123"}  # real apps store hashed passwords

@app.post("/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    if fake_users.get(form.username) != form.password:
        raise HTTPException(401, "Wrong username or password")
    token = jwt.encode({"sub": form.username}, SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])["sub"]
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token")

@app.get("/users/me")
def me(user: str = Depends(get_current_user)):
    return {"username": user}`,
    output: `POST /token
(form) username=anu&password=pass123
→ 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUifQ.jKTdaKoQbZ533GqxB2-bu-1VW7rZjeC_g9020-KVm4Y",
  "token_type": "bearer"
}

GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnUifQ.jKTdaKoQbZ533GqxB2-bu-1VW7rZjeC_g9020-KVm4Y
→ 200 OK
{"username": "anu"}

GET /users/me
→ 401 Unauthorized
{"detail": "Not authenticated"}

GET /users/me
Authorization: Bearer bad.token.here
→ 401 Unauthorized
{"detail": "Invalid token"}`,
  },
  {
    q: "How do you store passwords safely?",
    level: 'Advanced',
    a: "I never store the plain password; I store a slow, salted hash and compare hashes at login. A random salt per user means two users with the same password get different hashes, and a slow algorithm makes brute force expensive. This example uses Python's built-in hashlib.pbkdf2_hmac to show the idea, but in production I use a tested library like passlib or pwdlib with bcrypt or argon2. I also use hmac.compare_digest so the comparison takes constant time.",
    code: `import hashlib, hmac, os
from fastapi import Body, FastAPI, HTTPException

app = FastAPI()
db: dict[str, str] = {}  # username -> "salt$hash"

def hash_pw(pw: str, salt: bytes) -> str:
    digest = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, 100_000)
    return salt.hex() + "$" + digest.hex()

@app.post("/register", status_code=201)
def register(username: str = Body(), password: str = Body()):
    db[username] = hash_pw(password, os.urandom(16))
    return {"username": username, "hash_length": len(db[username])}

@app.post("/login")
def login(username: str = Body(), password: str = Body()):
    stored = db.get(username, "00$")
    new = hash_pw(password, bytes.fromhex(stored.split("$")[0]))
    if not hmac.compare_digest(new, stored):  # constant-time compare
        raise HTTPException(401, "Wrong username or password")
    return {"message": f"Welcome {username}"}`,
    output: `POST /register
{"username": "anu", "password": "s3cret!"}
→ 201 Created
{"username": "anu", "hash_length": 97}

POST /login
{"username": "anu", "password": "wrong"}
→ 401 Unauthorized
{"detail": "Wrong username or password"}

POST /login
{"username": "anu", "password": "s3cret!"}
→ 200 OK
{"message": "Welcome anu"}`,
  },
  {
    q: "How do you connect FastAPI to a database?",
    level: 'Advanced',
    a: "I usually use SQLAlchemy or SQLModel, which is built on SQLAlchemy and Pydantic so one class can be both the table and the schema. I create an engine once, create a session per request with a yield dependency, and use it inside the routes. In production I'd use PostgreSQL and Alembic for migrations. This example uses a SQLite file so it runs anywhere; check_same_thread=False is needed only for SQLite because FastAPI may use different threads.",
    code: `from fastapi import Depends, FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select

class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str

engine = create_engine("sqlite:///heroes.db", connect_args={"check_same_thread": False})
SQLModel.metadata.create_all(engine)
app = FastAPI()

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/heroes")
def create_hero(hero: Hero, session: Session = Depends(get_session)):
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero

@app.get("/heroes")
def list_heroes(session: Session = Depends(get_session)):
    return session.exec(select(Hero)).all()`,
    output: `POST /heroes
{"name": "Spider-Man"}
→ 200 OK
{"id": 1, "name": "Spider-Man"}

POST /heroes
{"name": "Iron Man"}
→ 200 OK
{"id": 2, "name": "Iron Man"}

GET /heroes
→ 200 OK
[
  {
    "id": 1,
    "name": "Spider-Man"
  },
  {
    "id": 2,
    "name": "Iron Man"
  }
]`,
  },
  {
    q: "What are lifespan events (startup and shutdown)?",
    level: 'Advanced',
    a: "Lifespan is an async context manager I pass to FastAPI(lifespan=...). Code before yield runs once at startup, like loading an ML model, creating a DB pool, or an HTTP client, and code after yield runs at shutdown to clean up. It replaces the older @app.on_event(\"startup\") style. I store shared objects on app.state so routes can use them.",
    code: `from contextlib import asynccontextmanager
from fastapi import FastAPI, Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("startup: loading model")
    app.state.model = {"name": "sentiment-v1"}
    yield
    print("shutdown: cleaning up")
    app.state.model = None

app = FastAPI(lifespan=lifespan)

@app.get("/model")
def model_info(request: Request):
    return request.app.state.model`,
    output: `GET /model
→ 200 OK
{"name": "sentiment-v1"}

Server console:
startup: loading model
shutdown: cleaning up`,
  },
  {
    q: "How do you test a FastAPI app?",
    level: 'Advanced',
    a: "I use TestClient, which calls the app directly without starting a server, together with pytest. I check the status code and the JSON body for both success and error cases. For dependencies like the database or current user, I use app.dependency_overrides to swap in a fake. For async tests with an async DB, I use httpx.AsyncClient with pytest-anyio or pytest-asyncio.",
    code: `# test_main.py   (app code is in main.py)
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_item():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json() == {"id": 1, "name": "pen"}

def test_item_not_found():
    response = client.get("/items/99")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}

def test_bad_id():
    assert client.get("/items/abc").status_code == 422`,
    output: `$ pytest -q
...                                                                      [100%]
3 passed in 0.20s`,
  },
  {
    q: "How do you mock dependencies in tests with dependency_overrides?",
    level: 'Advanced',
    a: "app.dependency_overrides is a dict where the key is the real dependency function and the value is a fake one. FastAPI then calls my fake instead, everywhere that dependency is used, so I can test routes without a real login or database. I always clear the overrides after each test, here with an autouse fixture, so one test doesn't affect another. The same trick works for swapping a real database for a test SQLite database.",
    code: `# test_main.py   (main.py has get_current_user, get_db and /orders)
import pytest
from fastapi.testclient import TestClient
from main import app, get_current_user, get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_overrides():
    yield
    app.dependency_overrides.clear()  # don't leak into other tests

def test_orders_with_fake_user_and_db():
    app.dependency_overrides[get_current_user] = lambda: {"name": "anu"}
    app.dependency_overrides[get_db] = lambda: {"anu": ["order-1"]}
    response = client.get("/orders")
    assert response.status_code == 200
    assert response.json() == {"user": "anu", "orders": ["order-1"]}

def test_orders_without_login():
    app.dependency_overrides[get_db] = lambda: {}
    assert client.get("/orders").status_code == 401`,
    output: `$ pytest -q
..                                                                       [100%]
2 passed in 0.18s`,
  },
  {
    q: "How do WebSockets work in FastAPI?",
    level: 'Advanced',
    a: "A WebSocket keeps one connection open so the server and client can both send messages any time, which is good for chat, live notifications, or dashboards. I use @app.websocket, accept the connection, and then loop receiving and sending. I catch WebSocketDisconnect to clean up when the client leaves. For many users across several servers I'd use something like Redis pub/sub to broadcast.",
    code: `from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Welcome!")
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_text(f"You said: {message}")
    except WebSocketDisconnect:
        print("client left")`,
    output: `WS connect /ws/chat
← Welcome!
→ hi
← You said: hi
→ how are you?
← You said: how are you?

Server console:
client left`,
  },
  {
    q: "What response types can you return besides JSON?",
    level: 'Advanced',
    a: "By default FastAPI returns JSON, but I can return response classes directly. JSONResponse lets me set a custom status or headers, StreamingResponse sends data in chunks, which is good for big files or AI token streaming, and RedirectResponse sends the client to another URL. There are also HTMLResponse, PlainTextResponse, and FileResponse.",
    code: `from fastapi import FastAPI
from fastapi.responses import JSONResponse, RedirectResponse, StreamingResponse

app = FastAPI()

@app.get("/custom")
def custom():
    return JSONResponse({"msg": "accepted"}, status_code=202,
                        headers={"X-Custom": "yes"})

@app.get("/stream")
def stream():
    def numbers():
        for i in range(1, 4):
            yield f"line {i}\\n"
    return StreamingResponse(numbers(), media_type="text/plain")

@app.get("/old-page")
def old_page():
    return RedirectResponse("/custom")`,
    output: `GET /custom
→ 202 Accepted
x-custom: yes
{"msg": "accepted"}

GET /stream
→ 200 OK
line 1
line 2
line 3

GET /old-page
→ 307 Temporary Redirect
location: /custom`,
  },
  {
    q: "How do you implement pagination?",
    level: 'Advanced',
    a: "I accept page and size (or limit and offset) as query parameters with limits, like size between 1 and 100, so nobody can ask for a million rows. I return the items plus metadata like total and page so the frontend can build page buttons. With a database I use OFFSET and LIMIT, or cursor-based pagination for very large tables because it stays fast.",
    code: `from fastapi import FastAPI, Query

app = FastAPI()
ALL_ITEMS = [f"item-{i}" for i in range(1, 24)]  # 23 items

@app.get("/items")
def list_items(page: int = Query(1, ge=1), size: int = Query(10, ge=1, le=100)):
    start = (page - 1) * size
    return {
        "page": page,
        "size": size,
        "total": len(ALL_ITEMS),
        "pages": -(-len(ALL_ITEMS) // size),  # ceiling division
        "items": ALL_ITEMS[start: start + size],
    }`,
    output: `GET /items?page=3&size=10
→ 200 OK
{
  "page": 3,
  "size": 10,
  "total": 23,
  "pages": 3,
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
    a: "The simplest way is URL versioning, where I put each version in its own router with a prefix like /v1 and /v2. Old clients keep using v1 while new clients move to v2, and I only remove v1 after announcing a deprecation date. Other options are a header or a query parameter, but URL versioning is the easiest to see and test.",
    code: `from fastapi import APIRouter, FastAPI

v1 = APIRouter(prefix="/v1", tags=["v1"])
v2 = APIRouter(prefix="/v2", tags=["v2"])

@v1.get("/users/{user_id}")
def get_user_v1(user_id: int):
    return {"id": user_id, "name": "Anu Thomas"}

@v2.get("/users/{user_id}")
def get_user_v2(user_id: int):
    return {"id": user_id, "first_name": "Anu", "last_name": "Thomas"}

app = FastAPI()
app.include_router(v1)
app.include_router(v2)`,
    output: `GET /v1/users/1
→ 200 OK
{"id": 1, "name": "Anu Thomas"}

GET /v2/users/1
→ 200 OK
{"id": 1, "first_name": "Anu", "last_name": "Thomas"}`,
  },
  {
    q: "How would you add rate limiting?",
    level: 'Advanced',
    a: "Rate limiting stops one client from sending too many requests, and the server answers 429 Too Many Requests when the limit is hit. The idea is to count requests per client (IP, API key, or user) in a time window. This simple version keeps counts in memory and works only for one process; in production I'd store the counts in Redis or use a library like slowapi, or do it at the gateway like Nginx or a cloud API gateway.",
    code: `import time
from fastapi import Depends, FastAPI, HTTPException, Request

app = FastAPI()
LIMIT, WINDOW = 2, 60  # 2 requests per 60 seconds
hits: dict[str, list[float]] = {}

def rate_limit(request: Request):
    key = request.client.host
    now = time.time()
    recent = [t for t in hits.get(key, []) if now - t < WINDOW]
    if len(recent) >= LIMIT:
        raise HTTPException(429, "Too many requests", headers={"Retry-After": "60"})
    hits[key] = recent + [now]

@app.get("/search", dependencies=[Depends(rate_limit)])
def search(q: str):
    return {"results": [q]}`,
    output: `GET /search?q=a
→ 200 OK
{"results": ["a"]}

GET /search?q=b
→ 200 OK
{"results": ["b"]}

GET /search?q=c
→ 429 Too Many Requests
retry-after: 60
{"detail": "Too many requests"}`,
  },
  {
    q: "How do you add health check endpoints?",
    level: 'Advanced',
    a: "I usually add two: a liveness check that only says the process is running, and a readiness check that also verifies dependencies like the database or Redis. Kubernetes or a load balancer calls them, restarting the pod if liveness fails and stopping traffic if readiness fails. Readiness returns 503 when something is down, so tools can react to the status code without parsing the body. I keep them fast and hide them from the public docs.",
    code: `from fastapi import FastAPI, Response

app = FastAPI()

def database_ok() -> bool:
    return True  # real app: run "SELECT 1"

def cache_ok() -> bool:
    return False  # pretend Redis is down

@app.get("/health/live", include_in_schema=False)
def live():
    return {"status": "ok"}

@app.get("/health/ready", include_in_schema=False)
def ready(response: Response):
    checks = {"database": database_ok(), "cache": cache_ok()}
    if not all(checks.values()):
        response.status_code = 503
    return {"status": "ok" if all(checks.values()) else "degraded",
            "checks": checks}`,
    output: `GET /health/live
→ 200 OK
{"status": "ok"}

GET /health/ready
→ 503 Service Unavailable
{
  "status": "degraded",
  "checks": {
    "database": true,
    "cache": false
  }
}`,
  },
  {
    q: "What is an ETag and how do you use it for caching?",
    level: 'Advanced',
    a: "An ETag is a short fingerprint of a response, usually a hash of the data. The client sends it back in the If-None-Match header next time, and if the data hasn't changed I return 304 Not Modified with no body, which saves bandwidth. The browser or app then uses its cached copy. ETags can also prevent lost updates, by having clients send If-Match on PUT and returning 412 if the data changed meanwhile.",
    code: `import hashlib, json
from fastapi import FastAPI, Request, Response

app = FastAPI()
PRODUCTS = {1: {"id": 1, "name": "Pen", "price": 10}}

def make_etag(data: dict) -> str:
    raw = json.dumps(data, sort_keys=True).encode()
    return '"' + hashlib.md5(raw).hexdigest()[:12] + '"'

@app.get("/products/{pid}")
def get_product(pid: int, request: Request, response: Response):
    product = PRODUCTS[pid]
    etag = make_etag(product)
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers={"ETag": etag})
    response.headers["ETag"] = etag
    return product`,
    output: `GET /products/1
→ 200 OK
etag: "db625bbc8b40"
{"id": 1, "name": "Pen", "price": 10}

GET /products/1
If-None-Match: "db625bbc8b40"
→ 304 Not Modified
etag: "db625bbc8b40"
(empty body: the client uses its cached copy)`,
  },
  {
    q: "How do you make a POST request idempotent?",
    level: 'Advanced',
    a: "GET, PUT and DELETE are naturally idempotent, but POST is not, so if a client retries a payment after a timeout it could be charged twice. I ask the client to send a unique Idempotency-Key header per operation and store the result under that key. If the same key comes again, I return the saved result instead of doing the work again, which you can see in the console here. In production I keep the keys in Redis or the database with an expiry.",
    code: `from typing import Annotated
from fastapi import FastAPI, Header, Response
from pydantic import BaseModel

app = FastAPI()
processed: dict[str, dict] = {}  # real app: Redis/DB with expiry

class Payment(BaseModel):
    amount: int

@app.post("/payments", status_code=201)
def pay(payment: Payment, response: Response,
        idempotency_key: Annotated[str, Header()]):
    if idempotency_key in processed:
        response.status_code = 200
        return processed[idempotency_key]  # replay, no new charge
    print(f"charging {payment.amount}")
    result = {"payment_id": len(processed) + 1, "status": "charged"}
    processed[idempotency_key] = result
    return result`,
    output: `POST /payments
Idempotency-Key: k-1
{"amount": 500}
→ 201 Created
{"payment_id": 1, "status": "charged"}

POST /payments
Idempotency-Key: k-1
{"amount": 500}
→ 200 OK
{"payment_id": 1, "status": "charged"}

POST /payments
Idempotency-Key: k-2
{"amount": 300}
→ 201 Created
{"payment_id": 2, "status": "charged"}

Server console:
charging 500
charging 300`,
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

# Or with Gunicorn managing Uvicorn workers:
# gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000

# Build and run:
# docker build -t shop-api .
# docker run -p 8000:8000 --env-file .env shop-api`,
    output: `What happens:
1. docker build creates an image with Python, your deps and code.
2. docker run starts the container and maps port 8000.
3. One master process starts 4 Uvicorn worker processes.
4. Each worker runs its own event loop and handles requests.
5. If a worker crashes, the master starts a new one.

The API is then reachable at http://<server>:8000
and docs at http://<server>:8000/docs`,
  },
  {
    q: "How do you make a FastAPI app faster?",
    level: 'Advanced',
    a: "First I make sure I never block the event loop: async libraries inside async def, and plain def for blocking code. I reuse expensive objects like DB connection pools and HTTP clients by creating them once in lifespan, and I use caching (for example Redis) for data that doesn't change often. I also add database indexes, avoid N+1 queries, paginate large lists, move slow jobs to a background worker, and run multiple workers. And I always measure with profiling before optimizing.",
    code: `from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI, Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=5)  # one shared client
    yield
    await app.state.http.aclose()

app = FastAPI(lifespan=lifespan)
cache: dict[str, dict] = {}

@app.get("/weather/{city}")
async def weather(city: str, request: Request):
    if city in cache:  # serve from cache
        return {"source": "cache", **cache[city]}
    # real app: r = await request.app.state.http.get(WEATHER_URL, params=...)
    data = {"city": city, "temp": 31}
    cache[city] = data
    return {"source": "api", **data}`,
    output: `GET /weather/kochi
→ 200 OK
{"source": "api", "city": "kochi", "temp": 31}

GET /weather/kochi
→ 200 OK
{"source": "cache", "city": "kochi", "temp": 31}`,
  },
]
