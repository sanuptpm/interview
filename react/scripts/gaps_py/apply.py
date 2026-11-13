# Inserts the ITEMS of new_python.py / new_aiml.py into the page data file (right after / before the
# question named in `after` / `before`, so the order inside a level+topic is right) and puts each title
# in the topics file next to the same question. `topic` = start a new sub-topic (placed after the
# sub-topic that holds `after`). Outputs are left empty: run sync.mjs <page> --write afterwards.
# Usage: python3 scripts/gaps_py/apply.py <python|aiMl>
import json, os, re, sys
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, '..', '..')
sys.path.insert(0, here)
page = sys.argv[1]
ITEMS = __import__('new_python' if page == 'python' else 'new_aiml').ITEMS
js = lambda s: json.dumps(s, ensure_ascii=False)
tpl = lambda s: '`' + s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'
code_str = tpl if page == 'python' else js

dp = os.path.join(root, 'src/pages', 'pythonQuestionsData.js' if page == 'python' else 'aiMlQuestionsData.js')
tp = os.path.join(root, 'src/pages/topics', page + 'Topics.js')
d, t = open(dp).read(), open(tp).read()

for it in ITEMS:
    assert f"    q: {js(it['q'])},\n" not in d, 'already there: ' + it['q']
    entry = (f"  {{\n    q: {js(it['q'])},\n    level: '{it['level']}',\n    a: {js(it['a'])},\n"
             f"    code: {code_str(it['code'])},\n    output: {code_str('')},\n  }},\n")
    ref = it.get('after') or it['before']
    start = d.index(f"  {{\n    q: {js(ref)},\n")
    pos = d.index('\n  },\n', start) + len('\n  },\n') if 'after' in it else start
    d = d[:pos] + entry + d[pos:]

    line = '      ' + js(ref) + ',\n'
    assert t.count(line) == 1, 'topic line not found once: ' + ref
    if it.get('topic'):                       # new sub-topic after the one holding `after`
        end = t.index('\n  },\n', t.index(line)) + len('\n  },\n')
        block = f"  {{\n    topic: {js(it['topic'])},\n    questions: [\n      {js(it['q'])},\n    ],\n  }},\n"
        t = t[:end] + block + t[end:]
    else:
        p = t.index(line) + (len(line) if 'after' in it else 0)
        t = t[:p] + '      ' + js(it['q']) + ',\n' + t[p:]

open(dp, 'w').write(d); open(tp, 'w').write(t)
print(page, len(ITEMS), 'questions added')
