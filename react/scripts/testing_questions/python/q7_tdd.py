# 1. Red: write the test first, before fizz() exists
def test_fizz():
    assert fizz(3) == "Fizz"
    assert fizz(4) == "4"

try:
    test_fizz()
except NameError as err:
    print("red:", err)

# 2. Green: write just enough code to pass
def fizz(n):
    return "Fizz" if n % 3 == 0 else str(n)

test_fizz()
print("green: test passes")
# 3. Refactor: clean up the code, re-run the tests
