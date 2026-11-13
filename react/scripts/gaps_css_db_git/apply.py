# Inserts the new CSS / Database / Git questions next to related ones, and their titles into
# the topics files. Idempotent: questions already present are skipped.
# Usage: python3 scripts/gaps_css_db_git/apply.py  (after git_run.py and sql_run.mjs)
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from new_css import CSS  # noqa: E402
from new_db_git import DB, GIT  # noqa: E402
src = os.path.join(here, '..', '..', 'src', 'pages')

def sq(s):  # single-quoted JS string when possible
    return "'" + s + "'" if "'" not in s and '\\' not in s else json.dumps(s, ensure_ascii=False)
def tpl(s):
    return '`' + s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'
def find_q(text, title):
    for form in (sq(title), json.dumps(title, ensure_ascii=False), "'" + title.replace("'", "\\'") + "'"):
        i = text.find('    q: ' + form + ',\n')
        if i >= 0: return i
    return -1

def insert_entries(path, items, render, start_marker):
    text = open(path).read()
    added = []
    for it in items:
        if find_q(text, it['q']) >= 0: continue
        i = find_q(text, it['after'])
        assert i >= 0, 'anchor not found: ' + it['after']
        end = text.index('\n  },\n', i) + len('\n  },\n')
        text = text[:end] + render(it) + text[end:]
        added.append(it['q'])
    open(path, 'w').write(text)
    return added

def css_entry(it):
    for k in ('html', 'css'): assert '`' not in it[k] and '${' not in it[k], it['q']
    return (f"  {{\n    q: {sq(it['q'])},\n    level: '{it['level']}',\n    a: {json.dumps(it['a'], ensure_ascii=False)},\n"
            f"    html: {tpl(it['html'])},\n    css: {tpl(it['css'])},\n  }},\n")

def code_entry(runs):
    def r(it):
        run = runs[it['q']]
        return (f"  {{\n    q: {json.dumps(it['q'], ensure_ascii=False)},\n    level: '{it['level']}',\n"
                f"    a: {json.dumps(it['a'], ensure_ascii=False)},\n    code: {tpl(run['code'])},\n    output: {tpl(run['output'])},\n  }},\n")
    return r

def topic_line(text, title):
    for form in (json.dumps(title, ensure_ascii=False), "'" + title.replace("'", "\\'") + "'"):
        i = text.find('      ' + form + ',\n')
        if i >= 0: return i, form
    return -1, None

def insert_topics(path, items):
    text = open(path).read()
    double = '      "' in text
    for it in items:
        q = it['q']
        form = json.dumps(q, ensure_ascii=False) if double else "'" + q.replace("'", "\\'") + "'"
        if '      ' + form + ',\n' in text: continue
        line = '      ' + form + ',\n'
        if it.get('new_topic'):
            i, _ = topic_line(text, it['topic_after'])
            end = text.index('    ],\n  },\n', i) + len('    ],\n  },\n')
            name = json.dumps(it['new_topic']) if double else "'" + it['new_topic'] + "'"
            text = text[:end] + f"  {{\n    topic: {name},\n    questions: [\n{line}    ],\n  }},\n" + text[end:]
        elif it.get('topic_before'):
            i, _ = topic_line(text, it['topic_before'])
            assert i >= 0, it['topic_before']
            text = text[:i] + line + text[i:]
        else:
            i, f = topic_line(text, it['topic_after'])
            assert i >= 0, it['topic_after']
            j = i + len('      ' + f + ',\n')
            text = text[:j] + line + text[j:]
    open(path, 'w').write(text)

sql = json.load(open(os.path.join(here, 'sql_out.json')))
git = json.load(open(os.path.join(here, 'git_out.json')))
print('css', insert_entries(os.path.join(src, 'CssQuestions.jsx'), CSS, css_entry, None))
print('db', insert_entries(os.path.join(src, 'databaseQuestionsData.js'), DB, code_entry(sql), None))
print('git', insert_entries(os.path.join(src, 'gitQuestionsData.js'), GIT, code_entry(git), None))
insert_topics(os.path.join(src, 'topics', 'cssTopics.js'), CSS)
insert_topics(os.path.join(src, 'topics', 'databaseTopics.js'), DB)
insert_topics(os.path.join(src, 'topics', 'gitTopics.js'), GIT)
