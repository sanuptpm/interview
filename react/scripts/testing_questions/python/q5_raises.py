import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("cannot divide by zero")
    return a / b

with pytest.raises(ValueError, match="by zero") as err:
    divide(10, 0)
print("raised:", err.value)

try:
    with pytest.raises(ValueError):
        divide(10, 2)                 # no error, so the check fails
except pytest.fail.Exception as e:
    print("test failed:", type(e).__name__)
