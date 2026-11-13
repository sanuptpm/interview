"""Replays every new FastAPI question from the data file with TestClient and checks the stored output
reproduces exactly (raw blocks such as the uvicorn transcript and OpenAPI summary pass through)."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, "..", "simplify_ops", "fa_run.py")).read().rsplit("\nmain()", 1)[0]
_fa = {"__file__": os.path.join(HERE, "fa_run.py"), "__name__": "fa_run"}  # temp dirs go to gaps_ops/tmp
exec(compile(_src, "fa_run.py", "exec"), _fa)
new = {x["q"] for x in json.load(open(os.path.join(HERE, "fa_gaps.json")))}
data = os.path.abspath(os.path.join(HERE, "..", "..", "src", "pages", "fastapiQuestionsData.js"))
js = f"import('{data}').then(m => console.log(JSON.stringify(m.questions)))"
qs = [x for x in json.loads(subprocess.run(["node", "--input-type=module", "-e", js], capture_output=True, text=True, check=True).stdout) if x["q"] in new]
os.makedirs(os.path.join(HERE, "tmp"), exist_ok=True)
ok = 0
for x in qs:
    if x["output"].startswith("$ "): ok += 1; continue  # real uvicorn transcript, not a TestClient run
    got = _fa["run"](x["code"], _fa["parse"](x["output"]))
    if got == x["output"]: ok += 1
    else: print("DIFF:", x["q"])
print(ok, "/", len(qs), "new FastAPI outputs reproduce")
