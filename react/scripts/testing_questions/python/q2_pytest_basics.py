from pathlib import Path
import pytest

Path("test_math.py").write_text('''
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, 1) == 0
''')

pytest.main(["-v", "--no-header", "test_math.py"])   # same as: pytest -v test_math.py
