# usage: python3 to_json.py ml_new.py out_by_index.json  (NEW/ANS dicts keyed by item index)
import json, sys
ns = {}; exec(open(sys.argv[1]).read(), ns)
out = {}
for i, c in ns["NEW"].items(): out.setdefault(str(i), {})["code"] = c.strip("\n")
for i, a in ns.get("ANS", {}).items(): out.setdefault(str(i), {})["a"] = list(a)
json.dump(out, open(sys.argv[2], "w"), indent=1)
print(len(out), "changes")
