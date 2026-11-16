from pathlib import Path
import pytest

Path("test_cart.py").write_text('''
import pytest

@pytest.fixture
def cart():
    items = ["apple"]          # setup: a fresh cart for every test
    yield items
    items.clear()              # teardown runs after the test

def test_add_item(cart):
    cart.append("pen")
    assert len(cart) == 2

def test_cart_is_fresh(cart):
    assert cart == ["apple"]
''')

pytest.main(["-q", "test_cart.py"])
