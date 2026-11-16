def is_even(n):
    return n % 2 == 0

# Unit tests: check one small function on its own
assert is_even(4) is True
assert is_even(7) is False
assert is_even(0) is True
print("all unit tests passed")

try:
    assert is_even(3), "3 should be even"   # a failing test
except AssertionError as err:
    print("failed:", err)
