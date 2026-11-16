from pathlib import Path
import pytest

Path("test_even.py").write_text('''
import pytest

def is_even(n):
    return n % 2 == 0

@pytest.mark.parametrize("n, expected", [(2, True), (7, False), (0, True)])
def test_is_even(n, expected):
    assert is_even(n) == expected
''')

pytest.main(["-v", "--no-header", "test_even.py"])
