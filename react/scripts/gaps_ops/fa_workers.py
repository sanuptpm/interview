"""Adds the multi-worker question to fa_gaps.json. Its output is a real uvicorn --workers 2 run
(captured on this machine: startup log + two curl calls answered by different worker PIDs)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, "fa_gaps.json")
items = [x for x in json.load(open(p)) if not x["q"].startswith("How do you run FastAPI with multiple workers")]
items.append(dict(
    q="How do you run FastAPI with multiple workers, and Uvicorn vs Gunicorn?",
    level="Advanced",
    after="How do you make a FastAPI app faster?",
    a="One Python process mostly uses one CPU core, so in production I run several worker processes, each a full copy of the app. uvicorn --workers N starts N workers by itself; the classic setup is Gunicorn as the process manager with Uvicorn workers (-k uvicorn.workers.UvicornWorker), which also restarts crashed workers. Each worker has its own memory, so things like an in-memory cache or rate-limit counter are not shared, and I keep them in Redis. On Kubernetes I usually run one worker per pod and scale with more replicas instead.",
    code='''# main.py
import os
from fastapi import FastAPI

app = FastAPI()

@app.get("/pid")
def pid():
    return {"pid": os.getpid()}  # which worker answered

# uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
# gunicorn main:app -k uvicorn.workers.UvicornWorker -w 2 -b 0.0.0.0:8000''',
    output='''$ uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started parent process [24803]
INFO:     Started server process [24811]
INFO:     Started server process [24810]
INFO:     Waiting for application startup.
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Application startup complete.

$ curl http://127.0.0.1:8000/pid
{"pid":24810}
$ curl http://127.0.0.1:8000/pid
{"pid":24811}''',
))
json.dump(items, open(p, "w"), indent=1, ensure_ascii=False)
print(len(items), "items")
