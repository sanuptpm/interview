from pathlib import Path
import pytest

Path("test_styles.py").write_text('''
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):    # unittest style
    def test_add(self):
        self.assertEqual(add(2, 3), 5)

def test_add_plain():                # pytest style
    assert add(2, 3) == 5
''')

pytest.main(["-v", "--no-header", "test_styles.py"])
