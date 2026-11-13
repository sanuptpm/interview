# Runs every new snippet twice and prints its output and line count (no files changed).
# Usage: python3 scripts/gaps_py/dry.py <python|aiMl> [substring-of-title]
import os, subprocess, sys, tempfile
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, '..', '..')
sys.path.insert(0, here)
page = sys.argv[1]; flt = sys.argv[2] if len(sys.argv) > 2 else ''
ITEMS = __import__('new_python' if page == 'python' else 'new_aiml').ITEMS
py = 'python3' if page == 'python' else os.path.join(root, 'scripts/.venv/bin/python')
env = {**os.environ, 'PYTHONWARNINGS': 'ignore', 'PYTHONHASHSEED': '0'}
for it in ITEMS:
    if flt not in it['q']: continue
    with tempfile.TemporaryDirectory(dir=here) as d:
        f = os.path.join(d, 'snippet.py'); open(f, 'w').write(it['code'] + '\n')
        r = [subprocess.run([py, f], cwd=d, capture_output=True, text=True, env=env) for _ in range(2)]
    n = len(it['code'].split('\n')); sents = it['a'].count('. ') + 1
    flag = ' <-- PROBLEM' if r[0].returncode or r[0].stderr or r[0].stdout != r[1].stdout else ''
    print(f"=== [{it['level']}] {it['q']}  (lines={n}{' >10' if n > 10 else ''}, sentences~{sents}){flag}")
    print(r[0].stdout.rstrip() + (('\nSTDERR: ' + r[0].stderr) if r[0].stderr else ''))
