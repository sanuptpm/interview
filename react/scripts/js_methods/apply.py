# Writes the ITEMS from new_basics.py into src/pages/jsBasicsData.js (before the final ])
# and places each title in src/pages/topics/jsBasicsTopics.js right after its `after` title.
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, '..', '..')
sys.path.insert(0, here)
from new_basics import ITEMS

def entry(it):
    code_lines, body = [], []
    for st in it['steps']:
        if st[0] == 'stmt':
            code_lines.append(st[1]); body.append('      ' + st[1].split('   //')[0])
        else:
            code_lines.append(st[1] + (('  // ' + st[2]) if st[2] else '')); body.append(f"      out.push(snap({st[1]}))")
    exprs = sum(1 for st in it['steps'] if st[0] == 'expr')
    ret = 'out[0]' if exprs == 1 else 'out'
    result = "(() => {\n      const out = []\n      const snap = (v) => (typeof v === 'object' && v !== null ? structuredClone(v) : v)\n" + "\n".join(body) + f"\n      return {ret}\n    }})()"
    return ("  {\n    title: " + json.dumps(it['title']) + ",\n    note: " + json.dumps(it['note']) +
            ",\n    code: " + json.dumps("\n".join(code_lines)) + ",\n    result: " + result + ",\n  },\n")

p = os.path.join(root, 'src/pages/jsBasicsData.js'); s = open(p).read()
for it in ITEMS: assert json.dumps(it['title']) not in s, it['title']
i = s.rindex('\n]'); s = s[:i + 1] + ''.join(entry(it) for it in ITEMS) + s[i + 1:]
open(p, 'w').write(s)

tp = os.path.join(root, 'src/pages/topics/jsBasicsTopics.js'); t = open(tp).read()
for it in ITEMS:
    key = json.dumps(it['after']); assert key in t, it['after']
    j = t.index('\n', t.index(key))
    t = t[:j] + '\n      ' + json.dumps(it['title']) + ',' + t[j:]
open(tp, 'w').write(t)
print(len(ITEMS), 'questions added')
