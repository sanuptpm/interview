# Writes scripts/topics/titles_<page>.json = [{title, level}] for every question page.
# Run from anywhere: python3 scripts/topics/dump.py
import re, json, ast, subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.join(here, '..', '..', 'src', 'pages') + '/'
def from_source(path, start=None, end=None, key='q'):
    s = open(path).read()
    if start: s = s[s.index(start):s.index(end, s.index(start))]
    return [{'title': ast.literal_eval(m.group(1)), 'level': m.group(2) or 'Basics'}
            for m in re.finditer(r"(?m)^  \{\n    " + key + r": (.+),\n(?:    level: '([^']+)',\n)?", s)]
pages = {
  'css': from_source(root + 'CssQuestions.jsx', 'const questions = [', '\n]\n\nfunction Preview'),
  'javascript': from_source(root + 'JavaScript.jsx', 'const questions = [', '\nfunction Card('),
  'react': from_source(root + 'reactQuestionsData.jsx'),
}
for page, f in [('jsBasics', 'jsBasicsData.js'), ('typescript', 'typescriptQuestionsData.js'), ('python', 'pythonQuestionsData.js'), ('aiMl', 'aiMlQuestionsData.js'), ('fastapi', 'fastapiQuestionsData.js'), ('database', 'databaseQuestionsData.js'), ('git', 'gitQuestionsData.js'), ('docker', 'dockerQuestionsData.js'), ('aws', 'awsQuestionsData.js')]:
    exp = 'basics' if page == 'jsBasics' else 'questions'
    js = f"import('{os.path.abspath(root + f)}').then(m => console.log(JSON.stringify(m.{exp}.map(x => ({{title: x.q ?? x.title, level: x.level || 'Basics'}})))))"
    pages[page] = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, check=True).stdout)
for page, items in pages.items():
    json.dump(items, open(os.path.join(here, f'titles_{page}.json'), 'w'), indent=1)
    print(page, len(items))
