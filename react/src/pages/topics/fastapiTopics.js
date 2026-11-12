// Sub-topic order for the fastapi page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'FastAPI basics',
    questions: [
      'What is FastAPI and why would you use it over Flask or Django?',
      'What is ASGI vs WSGI, and what is Uvicorn?',
      'How do you create a minimal FastAPI app and run it?',
      'What happens to a request inside FastAPI, from arrival to response?',
      'What automatic documentation does FastAPI give you?',
      'How do you hide an endpoint from the docs or mark it as deprecated?',
    ],
  },
  {
    topic: 'Routes & parameters',
    questions: [
      'How do path parameters work, and what happens with the wrong type?',
      'How do you restrict a path parameter to fixed values with an Enum?',
      'Why does route order matter, for example /users/me vs /users/{user_id}?',
      'How does FastAPI handle trailing slashes?',
      'How do query parameters work? How do you make them optional?',
      'How do you accept a list of values in a query parameter?',
      'How are boolean query parameters converted?',
      'How does FastAPI decide if a parameter is path, query, or body?',
      'What is the Annotated style for parameters, and why is it recommended?',
    ],
  },
  {
    topic: 'Request bodies & Pydantic',
    questions: [
      'How do you accept a JSON request body?',
      'How do you handle nested JSON with Pydantic models and lists?',
      'How do Optional fields and default values work in a Pydantic model?',
      'How do you add validation rules with Pydantic Field?',
      'How do you validate emails and write custom validators?',
      'How do you validate fields together and add computed fields?',
      'How do you configure model behavior with model_config?',
    ],
  },
  {
    topic: 'Responses & status codes',
    questions: [
      'What is response_model and why use it?',
      'How do you return a list of models and hide empty fields?',
      'How does FastAPI turn return values into JSON, and what is jsonable_encoder?',
      'How do you use field aliases and response_model_exclude?',
      'How do you set HTTP status codes?',
      'How do you set custom response headers or change the status code at runtime?',
      'What response types can you return besides JSON?',
    ],
  },
  {
    topic: 'Errors & error handling',
    questions: [
      'What is a 422 error and can you customize it?',
      'How do you return errors with HTTPException?',
      'How do you create a custom exception handler?',
      'How do you document error responses with the responses parameter?',
      'How do you customize the 404 response for unknown URLs?',
    ],
  },
  {
    topic: 'CRUD & pagination',
    questions: [
      'How would you build basic CRUD routes?',
      'What is the difference between PUT and PATCH, and how do you do a partial update?',
      'How do you add filtering, sorting and limit/offset pagination to a list endpoint?',
      'How do you implement pagination?',
    ],
  },
  {
    topic: 'Headers, cookies, forms & files',
    questions: [
      'How do you read headers and cookies, and set a cookie?',
      'When do you use the Request object directly?',
      'How do you handle form data?',
      'How do you upload files?',
      'How do you serve static files, send a file download, or mount a sub-application?',
    ],
  },
  {
    topic: 'Dependencies',
    questions: [
      'What is dependency injection with Depends?',
      'How do you apply one dependency to many routes, like an API key check?',
      'What is a yield dependency and how do you use it for a DB session?',
      'How do you use a class as a dependency?',
      'What are sub-dependencies, and is a dependency called twice in one request?',
    ],
  },
  {
    topic: 'Auth & security',
    questions: [
      'How do you implement role-based authorization?',
      'When would you use API keys instead of JWT tokens?',
      'How do you store passwords safely?',
      'How do you implement authentication with OAuth2 and JWT?',
      'How does a refresh token flow work?',
      'How do OAuth2 scopes work in FastAPI?',
    ],
  },
  {
    topic: 'Middleware & CORS',
    questions: [
      'What is middleware and how do you write one?',
      'How do you add a request ID to every request?',
      'How do you compress responses with GZip?',
      'What is CORS and how do you enable it?',
      'What do TrustedHostMiddleware and HTTPSRedirectMiddleware do?',
    ],
  },
  {
    topic: 'Async & background work',
    questions: [
      'When should you use async def vs def for endpoints?',
      'What happens if you call blocking code inside async def, and how do you fix it?',
      'What are background tasks?',
      'When would you use Celery or ARQ instead of BackgroundTasks?',
      'How do WebSockets work in FastAPI?',
      'How do you stream a large CSV export?',
      'How do you send Server-Sent Events (SSE)?',
    ],
  },
  {
    topic: 'Database',
    questions: [
      'How do you connect FastAPI to a database?',
      'How do you use async SQLAlchemy with FastAPI?',
      'How do you manage database schema changes with Alembic?',
    ],
  },
  {
    topic: 'Testing',
    questions: [
      'How do you test async endpoints?',
      'How do you test a FastAPI app?',
      'How do you mock dependencies in tests with dependency_overrides?',
    ],
  },
  {
    topic: 'Project structure & config',
    questions: [
      'How would you structure a small FastAPI project?',
      'How do you organize a bigger project with APIRouter?',
      'How do you add OpenAPI tags and metadata to the docs?',
      'How do you manage settings and environment variables?',
      'What are lifespan events (startup and shutdown)?',
      'How do you version an API?',
      'How would you structure a large FastAPI app with routers, services and repositories?',
    ],
  },
  {
    topic: 'Production & performance',
    questions: [
      'How do you add health check endpoints?',
      'How would you add rate limiting?',
      'How do you add observability: logging, metrics and tracing?',
      'What is an ETag and how do you use it for caching?',
      'How do you make a POST request idempotent?',
      'How do you make a FastAPI app faster?',
      'How do you deploy a FastAPI app?',
    ],
  },
]
