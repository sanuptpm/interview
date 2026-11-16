from pathlib import Path
import coverage

Path("grade.py").write_text('''
def grade(score):
    if score >= 50:
        return "pass"
    return "fail"
''')

cov = coverage.Coverage(data_file=None)
cov.start()
from grade import grade
assert grade(80) == "pass"           # we only test the "pass" branch
cov.stop()
cov.report(show_missing=True)        # like: pytest --cov=grade --cov-report=term-missing
