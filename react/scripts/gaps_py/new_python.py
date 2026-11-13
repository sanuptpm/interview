# New Python questions for the gaps found by audit.py.
# Each item: q, level, a, code, and `after` = the title it is placed after (in the data file and
# in src/pages/topics/pythonTopics.js). Outputs are filled in by running the code (sync.mjs).
ITEMS = [
 # ---- Python basics: built-in functions
 dict(after="How does type conversion work in Python?", level='Basics',
  q="What is the difference between type() and isinstance()?",
  a="type(x) returns the exact class of an object, while isinstance(x, cls) checks if x is an instance of that class or any of its subclasses. That's why I prefer isinstance() for checks: it respects inheritance, and it also accepts a tuple of types. A known surprise is that bool is a subclass of int, so isinstance(True, int) is True.",
  code=r'''class Animal: pass
class Dog(Animal): pass

d = Dog()
print(type(d) == Animal, isinstance(d, Animal))
print(type(d).__name__)
print(isinstance(3.5, (int, float)))       # tuple of types
print(isinstance(True, int), type(True) == int)'''),
 dict(after="Which built-in functions do you use most often?", level='Basics',
  q="How do any() and all() work?",
  a="any() returns True if at least one item is truthy, and all() returns True only if every item is truthy. Both stop as soon as they know the answer, so with a generator expression they don't check more items than needed. A gotcha I remember: on an empty iterable any() is False but all() is True.",
  code=r'''scores = [72, 88, 95]
print(any(s > 90 for s in scores))
print(all(s >= 70 for s in scores))

print(any([0, "", None]), all([1, "x", [0]]))
print(any([]), all([]))          # empty: False, True'''),
 dict(after="How do any() and all() work?", level='Basics',
  q="How do sum(), min() and max() work with key and default?",
  a="sum() adds numbers and takes an optional start value. min() and max() return the smallest or largest item, and with key= they compare by a function, like the length of a word or a dict field, while still returning the original item. On an empty list min() and max() raise ValueError, so I pass default= when the input can be empty.",
  code=r'''nums = [4, 9, 2]
print(sum(nums), sum(nums, 10), min(nums), max(nums))

words = ["kiwi", "banana", "fig"]
print(min(words, key=len), max(words, key=len))

people = [{"name": "Asha", "age": 30}, {"name": "Ravi", "age": 25}]
print(max(people, key=lambda p: p["age"])["name"])
print(max([], default=0))'''),
 dict(after="How do sum(), min() and max() work with key and default?", level='Basics',
  q="What do chr(), ord(), bin() and hex() do?",
  a="ord() turns a single character into its Unicode number and chr() does the reverse. bin(), oct() and hex() turn an integer into a string in base 2, 8 or 16, and int(text, base) converts it back. I use ord() and chr() in coding rounds for things like a Caesar cipher or counting letters in a 26-slot list.",
  code=r'''print(ord("A"), chr(97))
print(bin(10), oct(10), hex(255))
print(int("1010", 2), int("ff", 16))
print(format(10, "b"), f"{255:x}")       # without the 0b / 0x prefix

shifted = "".join(chr((ord(c) - 97 + 1) % 26 + 97) for c in "xyz")
print(shifted)                            # Caesar shift by 1'''),
 # ---- Operators
 dict(after="How do //, %, ** and round() work?", level='Basics',
  q="What do divmod() and pow() do?",
  a="divmod(a, b) returns the quotient and the remainder together as (a // b, a % b), which is handy for turning seconds into minutes and seconds. pow(a, b) is the same as a ** b, but pow(a, b, m) computes (a ** b) % m efficiently without building the huge number first. I use the three-argument pow() for modular arithmetic problems in coding rounds.",
  code=r'''minutes, seconds = divmod(135, 60)
print(minutes, seconds)
print(divmod(-7, 2))              # same rules as // and %

print(pow(2, 10), 2 ** 10)
print(pow(7, 222, 13))            # (7 ** 222) % 13, fast
print(pow(3, -1, 7))              # modular inverse: 3 * 5 % 7 == 1'''),
 dict(after="What do divmod() and pow() do?", level='Basics',
  q="Why is 0.1 + 0.2 not equal to 0.3, and how do you compare floats?",
  a="Floats are stored in binary, and numbers like 0.1 can't be represented exactly, so tiny rounding errors appear. That's why I never compare floats with == directly; I use math.isclose() or round to a fixed number of places. For money I use the decimal module, creating values from strings, because it does exact decimal math.",
  code=r'''import math
from decimal import Decimal

print(0.1 + 0.2, 0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
print(round(0.1 + 0.2, 2) == 0.3)
print(Decimal("0.1") + Decimal("0.2"))'''),
 # ---- Data types
 dict(after="What is the difference between mutable and immutable objects?", level='Intermediate',
  q="What does hash() do, and why must dictionary keys be hashable?",
  a="hash() returns an integer that dicts and sets use to find a slot for a key quickly, which is why lookups are O(1) on average. An object is hashable if its hash never changes during its lifetime, so immutable types like int, str and tuples of immutables work, but lists, dicts and sets don't. If I need a list as a key I convert it to a tuple, and for a set I use frozenset.",
  code=r'''print(hash(42), hash((1, 2)) == hash((1, 2)))
try:
    hash([1, 2])
except TypeError:
    print("a list is unhashable")

visits = {("Pune", "MH"): 3}           # tuple key works
print(visits[("Pune", "MH")])
print({frozenset({1, 2}): "ok"})'''),
 # ---- Strings
 dict(after="How does string slicing work, and what are common string methods?", level='Basics',
  q="What is the difference between find(), index() and rfind() in strings?",
  a="Both find() and index() return the position of the first match. The difference is what happens when nothing matches: find() returns -1, while index() raises ValueError. rfind() (and rindex()) search from the right and return the last match. I'm careful with if s.find(x): because a match at position 0 is falsy, so for a yes/no check I just use in.",
  code=r'''s = "banana"
print(s.find("an"), s.rfind("an"))
print(s.find("x"))              # -1, no error
try:
    s.index("x")
except ValueError:
    print("index: not found")
print(s.find("b"), "b" in s)    # 0 is falsy, so use in for yes/no'''),
 dict(after="What is the difference between find(), index() and rfind() in strings?", level='Basics',
  q="What is the difference between split(), rsplit(), splitlines() and partition()?",
  a="split() breaks a string into a list; with no argument it splits on any run of whitespace and drops empty parts. rsplit() does the same from the right, which only matters when I pass maxsplit, like getting a file extension. splitlines() splits on line breaks of any style. partition() splits only once and always returns a 3-tuple (before, separator, after), which is handy for 'key=value' strings.",
  code=r'''print("a  b c".split())                  # any whitespace
print("a,b,,c".split(","))               # keeps empty parts
print("a.tar.gz".split(".", 1), "a.tar.gz".rsplit(".", 1))
print("one\ntwo\r\nthree".splitlines())
print("key=value=x".partition("="))
print("novalue".partition("="))'''),
 dict(after="What is the difference between split(), rsplit(), splitlines() and partition()?", level='Basics',
  q="How does join() work, and why is it better than + in a loop?",
  a="join() is called on the separator and takes an iterable of strings, like ', '.join(items). It builds the result in one pass, while += in a loop creates a new string every time because strings are immutable, which gets slow on big inputs. All the items must be strings, so for numbers I convert them first with map(str, ...).",
  code=r'''words = ["learn", "python", "daily"]
print(" ".join(words))
print("-".join("abc"))                  # a string is iterable too

nums = [1, 2, 3]
print(", ".join(map(str, nums)))        # convert numbers first
try:
    ",".join(nums)
except TypeError:
    print("join needs strings")'''),
 dict(after="Which string methods do you use to check and clean text?", level='Basics',
  q="What is the difference between strip(), lstrip() and rstrip()?",
  a="strip() removes characters from both ends, lstrip() only from the left and rstrip() only from the right; with no argument they remove whitespace, including newlines. The argument is a set of characters, not a substring, so strip('ab') removes any mix of a and b from the ends. When I want to remove an exact prefix or suffix I use removeprefix() and removesuffix() instead.",
  code=r'''s = "  hello \n"
print(repr(s.strip()), repr(s.lstrip()), repr(s.rstrip()))

print("abcbaHIab".strip("ab"))            # a set of chars, not a word
print("report.txt".rstrip(".txt"))        # surprise: also eats the 't' of report
print("report.txt".removesuffix(".txt"))  # exact suffix'''),
 dict(after="What is the difference between strip(), lstrip() and rstrip()?", level='Basics',
  q="What is the difference between upper(), lower(), title(), capitalize() and swapcase()?",
  a="upper() and lower() change every letter, title() capitalizes the first letter of each word, capitalize() uppercases only the first character of the whole string and lowercases the rest, and swapcase() flips each letter. All of them return a new string because strings are immutable. For case-insensitive comparisons I use casefold(), a stronger lower() that also handles letters like the German ß.",
  code=r'''s = "hello wORLD"
print(s.upper(), "|", s.lower())
print(s.title(), "|", s.capitalize(), "|", s.swapcase())
print("it's".title())                         # quirk with apostrophes
print("Straße".casefold() == "STRASSE".casefold())'''),
 dict(after="What is the difference between upper(), lower(), title(), capitalize() and swapcase()?", level='Basics',
  q="How do startswith() and endswith() work?",
  a="startswith() and endswith() return True if the string begins or ends with the given text, and they are case-sensitive. They also accept a tuple, so I can check several options in one call, which is great for file extensions. They are clearer and safer than slicing like s[:5] == 'https', because I don't have to count characters.",
  code=r'''url = "https://example.com/report.PDF"
print(url.startswith("https"))
print(url.endswith(".pdf"), url.lower().endswith(".pdf"))
print(url.lower().endswith((".pdf", ".doc")))    # tuple of options
print("data.csv".startswith("csv", 5))           # start at index 5'''),
 dict(after="How do startswith() and endswith() work?", level='Basics',
  q="What do isdigit(), isalpha(), isalnum() and isspace() check?",
  a="They check every character of the string: isdigit() for digits, isalpha() for letters, isalnum() for letters or digits, and isspace() for whitespace. All of them return False for an empty string, and one extra character is enough to fail, so '-5' and 'a b' fail. I use them for quick input checks, but to accept real numbers I try int() or float() in a try block.",
  code=r'''for s in ["123", "abc", "abc123", "  ", "", "-5", "a b"]:
    print(repr(s).ljust(8), s.isdigit(), s.isalpha(), s.isalnum(), s.isspace())'''),
 dict(after="What do isdigit(), isalpha(), isalnum() and isspace() check?", level='Basics',
  q="How do center(), ljust(), rjust() and zfill() pad strings?",
  a="ljust(), rjust() and center() pad a string to a given width, with spaces by default or any single fill character. zfill() pads with zeros on the left and keeps a leading sign in front. I use them for simple text tables and IDs like 007; inside f-strings the same thing is written {x:<6}, {x:>6} and {x:^6}.",
  code=r'''print("[" + "hi".ljust(6) + "]", "[" + "hi".rjust(6) + "]")
print("[" + "hi".center(6, "*") + "]")
print("7".zfill(3), "-42".zfill(5))
print(f"[{'hi':^6}]")                  # same as center(6)'''),
 dict(after="How do center(), ljust(), rjust() and zfill() pad strings?", level='Basics',
  q="How does replace() work?",
  a="replace(old, new) returns a new string with every occurrence of old replaced; the original doesn't change because strings are immutable. I can pass a third argument to limit how many replacements happen, counting from the left. It is a plain text match, so for patterns like 'any digit' I switch to re.sub().",
  code=r'''s = "a-b-c-d"
print(s.replace("-", "+"))
print(s.replace("-", "", 2))       # only the first 2
print(s)                           # unchanged

import re
print(re.sub(r"\d", "#", "room 12, floor 3"))'''),
 dict(after="What are f-strings?", level='Basics',
  q="What is the difference between f-strings, str.format() and % formatting?",
  a="% formatting is the oldest, C-style way, str.format() came next with {} placeholders, and f-strings (Python 3.6+) put the expressions right inside the string. All three support the same kind of format specs, like one decimal place. I use f-strings by default because they are the most readable and fastest; str.format() is still useful when the template is stored separately, like a message loaded from config.",
  code=r'''name, score = "Asha", 92.456
print("%s scored %.1f" % (name, score))
print("{} scored {:.1f}".format(name, score))
print(f"{name} scored {score:.1f}")

template = "Hello, {user}!"           # template kept separately
print(template.format(user=name))
print(format(score, ".2f"))           # the built-in format()'''),
 # ---- Lists
 dict(after="How do you add, update and remove items in a list?", level='Basics',
  q="What is the difference between append(), extend() and insert()?",
  a="append() adds exactly one item to the end, so if I append a list I get a nested list. extend() takes any iterable and adds each of its items, which is the same as +=. insert(i, x) puts one item before index i, but it shifts everything after it, so it's slow on big lists. A trap I watch for is extending with a string, because it adds each character separately.",
  code=r'''nums = [1, 2]
nums.append([3, 4])      # adds ONE item: a nested list
print(nums)
nums = [1, 2]
nums.extend([3, 4])      # adds each item
nums.insert(0, 0)        # puts 0 before index 0
print(nums)
letters = ["a"]
letters.extend("bc")     # a string is iterable: one char each
print(letters)'''),
 dict(after="What is the difference between append(), extend() and insert()?", level='Basics',
  q="What is the difference between remove(), pop() and del?",
  a="remove(x) deletes the first matching value and raises ValueError if it isn't there. pop(i) deletes by index and returns the item; with no argument it takes the last one, which lets a list work as a stack. del is a statement, not a method, so it returns nothing, but it can also delete a slice or a whole variable. I use remove when I know the value, pop when I need the item back, and del for slices.",
  code=r'''nums = [10, 20, 30, 20, 40]
nums.remove(20)              # first 20, by value
print(nums)
print(nums.pop(), nums.pop(0))   # last item, then index 0: both returned
del nums[0]                  # by index, nothing returned
print(nums)
try:
    nums.remove(99)
except ValueError:
    print("remove: value not found")'''),
 dict(after="What is the difference between remove(), pop() and del?", level='Basics',
  q="What is the difference between clear() and assigning an empty list?",
  a="nums.clear() empties the same list object, so every other name that points to it sees the empty list too. nums = [] just makes the name point to a brand-new list, and other references still hold the old items. I use clear() (or del nums[:]) when the list is shared, like a cache passed into a function, and = [] when I just want a fresh list.",
  code=r'''a = [1, 2, 3]
b = a                # same list, two names
a = []               # a now points to a new list
print(a, b)

a = b
a.clear()            # empties the shared list
print(a, b)'''),
 dict(after="What other list methods do you use often?", level='Basics',
  q="How do count() and index() work on lists, tuples and strings?",
  a="count(x) returns how many times x appears, and index(x) returns the position of the first match. They work the same way on lists, tuples and strings, and in fact they are the only two methods a tuple has. index() raises ValueError when the item is missing, so I check with in first, and I can pass a start position to find later matches.",
  code=r'''nums = [3, 1, 4, 1, 5]
point = (1, 2, 2, 3)
word = "banana"
print(nums.count(1), point.count(2), word.count("an"))
print(nums.index(1), nums.index(1, 2))   # search from index 2
print(point.index(3), word.index("n"))
print(7 in nums)                          # check before index()'''),
 dict(after="How does list slicing with a step work, and how do you reverse a list?", level='Basics',
  q="What is the difference between sort() and sorted(), and reverse() and reversed()?",
  a="sort() and reverse() are list methods that change the list in place and return None. sorted() and reversed() are built-in functions that work on any iterable and leave the original alone: sorted() returns a new list and reversed() returns a lazy iterator. A classic bug is writing nums = nums.sort(), which sets nums to None.",
  code=r'''nums = [3, 1, 2]
print(sorted(nums), nums)        # new list, original unchanged
print(nums.sort(), nums)         # in place, returns None

it = reversed(nums)              # lazy iterator
print(type(it).__name__, list(it))
nums.reverse()                   # in place
print(nums)
print(sorted("cab"), sorted((3, 1, 2), reverse=True))'''),
 # ---- Sets & dicts
 dict(after="How do you add and remove items in a set, and what are set operations?", level='Basics',
  q="What is the difference between remove() and discard() in a set?",
  a="Both delete an item from a set. remove() raises KeyError if the item isn't there, while discard() quietly does nothing. I use discard() when 'already gone' is fine, and remove() when a missing item would mean a bug I want to see. There is also pop(), which removes and returns an arbitrary item.",
  code=r'''s = {1, 2, 3}
s.discard(2)
s.discard(99)          # no error
print(s)
try:
    s.remove(99)
except KeyError as e:
    print("KeyError:", e)
print(s.pop(), s)'''),
 dict(after="What is the difference between remove() and discard() in a set?", level='Basics',
  q="What do issubset(), issuperset() and isdisjoint() do?",
  a="issubset() checks if every item of one set is in another, issuperset() is the reverse check, and isdisjoint() is True when two sets share nothing. The operators <= and >= do the same as the first two, and < means a proper (strict) subset. I use them for permission checks, like whether a user has all the required roles.",
  code=r'''required = {"read", "write"}
user_roles = {"read", "write", "admin"}
print(required.issubset(user_roles), required <= user_roles)
print(user_roles.issuperset(required), user_roles > required)
print(required.isdisjoint({"guest"}))
print(required < required, required <= required)'''),
 dict(after="How do you add, update and remove items in a dictionary?", level='Basics',
  q="What is the difference between pop() and popitem() in a dictionary?",
  a="pop(key) removes that key and returns its value; with a default like pop(key, None) it won't raise KeyError when the key is missing. popitem() takes no key and removes the last inserted pair, returning it as a tuple, because dicts keep insertion order. I use popitem() for last-in-first-out processing, and it raises KeyError on an empty dict.",
  code=r'''user = {"name": "Asha", "age": 30, "city": "Pune"}
print(user.pop("age"))
print(user.pop("email", "no email"))   # default: no KeyError
print(user.popitem())                  # last inserted pair
print(user)'''),
 dict(after="How do you loop over a dictionary?", level='Basics',
  q="What do keys(), values() and items() return?",
  a="They return view objects, not lists. A view is live, so if the dictionary changes, the view shows the change without calling the method again. keys() and items() also behave like sets, so I can use & or - to compare the keys of two dicts. If I need a real list, for indexing or to change the dict while looping, I wrap it in list().",
  code=r'''prices = {"apple": 3, "milk": 2}
keys = prices.keys()
print(keys, list(prices.values()))
prices["bread"] = 4
print(keys)                            # the view updated by itself
print(list(prices.items())[0])

other = {"milk": 1, "eggs": 5}
print(prices.keys() & other.keys())    # set-like'''),
 dict(after="How do you merge dictionaries, and when do you use get, setdefault or defaultdict?", level='Intermediate',
  q="What does dict.fromkeys() do, and what is its pitfall?",
  a="dict.fromkeys(keys, value) builds a dictionary where every key gets the same starting value, which is handy for flags or counters. The pitfall is that the value is shared, not copied, so with a mutable value like [] every key points to the same list; in that case I use a dict comprehension. It's also a neat way to remove duplicates from a list while keeping the order.",
  code=r'''flags = dict.fromkeys(["a", "b"], False)
print(flags)
bad = dict.fromkeys(["a", "b"], [])
bad["a"].append(1)
print(bad)                                   # both changed!
good = {k: [] for k in ["a", "b"]}
good["a"].append(1)
print(good)
print(list(dict.fromkeys([3, 1, 3, 2, 1])))  # dedupe, keep order'''),
 # ---- Control flow
 dict(after="How do if/elif/else and loops work in Python?", level='Basics',
  q="What is the difference between pass, continue and break?",
  a="break exits the loop completely, continue skips the rest of the current iteration and moves to the next one, and pass does nothing at all. pass is just a placeholder where Python needs a statement, like an empty function or class I'll fill in later. With nested loops, break only exits the innermost loop.",
  code=r'''seen = []
for n in range(1, 10):
    if n == 1:
        pass            # placeholder: does nothing
    if n % 2 == 0:
        continue        # skip even numbers
    if n > 6:
        break           # stop the whole loop
    seen.append(n)
print(seen)'''),
 dict(after="What is the difference between pass, continue and break?", level='Basics',
  q="What is the conditional (ternary) expression in Python?",
  a="Python's ternary is written x if condition else y, and because it's an expression I can use it inside an assignment, a return, an f-string or a comprehension. It's great for simple either-or values, but I avoid nesting them because they get hard to read fast; then I use a normal if/elif. Python has no ?: operator like C or JavaScript.",
  code=r'''age = 20
status = "adult" if age >= 18 else "minor"
print(status)

for n in [3, 4]:
    print(f"{n} is {'even' if n % 2 == 0 else 'odd'}")

nums = [5, -2, 7]
print([n if n > 0 else 0 for n in nums])'''),
 dict(after="What is the else clause on for and while loops?", level='Intermediate',
  q="How does match/case (structural pattern matching) work?",
  a="match/case was added in Python 3.10. It compares a value against patterns from top to bottom and runs the first one that matches, and unlike a C switch it can also unpack structure like tuples, lists and dicts. case _ is the catch-all default, | joins options, and an if guard adds an extra condition. I use it for parsing commands or handling different message shapes; for a simple value lookup a dict is often enough.",
  code=r'''def handle(cmd):
    match cmd:
        case "quit" | "exit":
            return "bye"
        case ("move", x, y) if x >= 0:
            return f"move to {x},{y}"
        case _:
            return "unknown"
for c in ["exit", ("move", 1, 2), ("move", -1, 2), 42]:
    print(handle(c))'''),
 # ---- Functions & scope
 dict(after="What is scope in Python, the LEGB rule, and global/nonlocal?", level='Intermediate',
  q="What do dir(), vars(), globals() and locals() return?",
  a="dir(obj) lists the names of all attributes an object has, including inherited ones and dunders, so it's great for exploring in the REPL. vars(obj) returns the object's own __dict__, which for an instance is just its instance attributes. globals() returns the module's global names as a dict and locals() the current function's local names. I use them for debugging and introspection, not for normal program logic.",
  code=r'''class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
p = Point(1, 2)
print(vars(p))
print([n for n in dir(p) if not n.startswith("_")])
def f(a):
    b = a * 2
    return locals()
print(f(5), "Point" in globals())'''),
 dict(after="What do dir(), vars(), globals() and locals() return?", level='Intermediate',
  q="What is the difference between eval() and exec(), and why are they risky?",
  a="eval() evaluates a single expression and returns its value, while exec() runs any block of statements and always returns None. Both run arbitrary code, so passing user input to them can let an attacker delete files or read secrets. When I only need to turn text into a Python value, like '[1, 2]', I use ast.literal_eval(), which accepts only literals.",
  code=r'''print(eval("2 + 3 * 4"))
scope = {}
exec("x = 5\ny = x * 2", scope)
print(scope["y"])
import ast
print(ast.literal_eval("[1, 2, {'a': 3}]"))
try:
    ast.literal_eval("__import__('os').getcwd()")
except ValueError:
    print("literal_eval rejected code")'''),
 # ---- Errors
 dict(after="How do you raise exceptions, and what does 'raise from' do?", level='Intermediate',
  q="What does the assert statement do, and when should you not use it?",
  a="assert condition, message raises AssertionError when the condition is False, so it's a quick sanity check for things that should never happen. Python removes all asserts when it runs with the -O flag, so I never use them to validate user input or for security checks; for that I raise a real exception like ValueError. I mostly use assert in tests and to document assumptions in my own code.",
  code=r'''def average(nums):
    assert len(nums) > 0, "nums must not be empty"
    return sum(nums) / len(nums)

print(average([2, 4]))
try:
    average([])
except AssertionError as e:
    print("AssertionError:", e)'''),
 # ---- Modules & stdlib
 dict(after='What are modules and what does if __name__ == "__main__" mean?', level='Intermediate',
  q="What is the difference between a module and a package?",
  a="A module is a single .py file, and a package is a folder of modules that I import with dot notation, like shop.prices. A regular package has an __init__.py file, which runs on import and can expose a clean public API. Python finds both through sys.path, so when an import fails I first check that the folder's parent is on it.",
  code=r'''import sys, tempfile, pathlib
root = pathlib.Path(tempfile.mkdtemp())
(root / "shop").mkdir()
(root / "shop" / "__init__.py").write_text("from .prices import total\n")
(root / "shop" / "prices.py").write_text("def total(xs): return sum(xs)\n")
sys.path.insert(0, str(root))
import shop
from shop import prices
print(shop.total([1, 2, 3]), prices.__name__)
print(hasattr(shop, "__path__"), hasattr(prices, "__path__"))   # only packages have __path__'''),
 dict(after="What is the difference between a module and a package?", level='Intermediate',
  q="What is the difference between the os and sys modules?",
  a="os talks to the operating system: environment variables, files and folders, plus path helpers in os.path. sys talks to the Python interpreter itself: command-line arguments in sys.argv, the import path sys.path, the version, and sys.exit() to stop the program. A practical tip: I read settings with os.environ.get('KEY', default) so a missing variable doesn't crash the app.",
  code=r'''import os, sys
os.environ["APP_MODE"] = "dev"
print(os.environ.get("APP_MODE"), os.environ.get("MISSING_KEY", "default"))
print(os.path.join("data", "2024", "sales.csv"))
print(os.path.splitext("report.pdf"), os.path.basename("/tmp/a.txt"))
print(sys.version_info >= (3, 8), type(sys.argv).__name__)
try:
    sys.exit(2)
except SystemExit as e:
    print("exit code:", e.code)'''),
 dict(after="How do you work with dates and times using datetime?", level='Basics',
  q="Which functions from the math module do you use most?",
  a="I mostly use math.floor() and math.ceil() to round down or up to an int, math.sqrt() and math.isqrt() for square roots, math.gcd() and math.factorial() in coding problems, and constants like math.pi and math.inf. math.inf is a handy starting value when I search for a minimum. Note that floor() rounds toward minus infinity, so math.floor(-2.5) is -3, while int() just cuts off the decimals and gives -2.",
  code=r'''import math
print(math.floor(2.7), math.ceil(2.1), math.floor(-2.5), int(-2.5))
print(math.sqrt(16), math.isqrt(17))
print(math.gcd(12, 18), math.factorial(5))
print(round(math.pi, 4), math.inf > 10 ** 100)
print(math.prod([2, 3, 4]), math.dist((0, 0), (3, 4)))'''),
 dict(after="Which functions from the math module do you use most?", level='Intermediate',
  q="How do you use the random module, and why set a seed?",
  a="random gives pseudo-random numbers: randint(a, b) includes both ends, choice() picks one item, sample() picks several without repeats, and shuffle() reorders a list in place. random.seed(n) makes the sequence repeatable, which I use in tests and experiments so results can be reproduced. For passwords or tokens I use the secrets module instead, because random is not cryptographically secure.",
  code=r'''import random
random.seed(42)
print(random.randint(1, 6), random.choice(["red", "green", "blue"]))
print(random.sample(range(10), 3))
deck = [1, 2, 3, 4, 5]
random.shuffle(deck)
print(deck)
random.seed(42)
print(random.randint(1, 6))      # same seed, same first number'''),
 # ---- OOP
 dict(after="What is the difference between class attributes and instance attributes?", level='Intermediate',
  q="What do getattr(), setattr() and hasattr() do?",
  a="They let me work with attributes when the name is a string known only at runtime. getattr(obj, name, default) reads an attribute and returns the default instead of raising AttributeError, setattr(obj, name, value) sets one, and hasattr() checks if it exists. I use them for things like loading config values onto an object or calling a method chosen by name, but in normal code I just use dot access.",
  code=r'''class User:
    def __init__(self):
        self.name = "Asha"

u = User()
print(getattr(u, "name"), getattr(u, "email", "n/a"))
setattr(u, "email", "asha@example.com")
print(hasattr(u, "email"), u.email)
print(getattr("hello", "upper")())     # call a method by name'''),
 # ---- Decorators, generators & iterators
 dict(after="What is a decorator, and how do you write one with arguments?", level='Advanced',
  q="Why use functools.wraps when writing a decorator?",
  a="A decorator replaces my function with its inner wrapper, so without help the result has the wrapper's __name__ and docstring, which confuses debugging, logging and documentation tools. @functools.wraps(func) on the wrapper copies the name, docstring and other metadata from the original function, and keeps the original in __wrapped__. I put it on every decorator I write; it costs one line.",
  code=r'''from functools import wraps
def logged(func):
    @wraps(func)               # without it: name 'wrapper', doc None
    def wrapper(*args): return func(*args)
    return wrapper
@logged
def add(a, b):
    """Add two numbers."""
    return a + b
print(add.__name__, "|", add.__doc__, "|", add.__wrapped__(2, 3))'''),
 dict(after="What is an iterator, and how is it different from an iterable?", level='Intermediate',
  q="How do iter() and next() work?",
  a="iter(obj) gets an iterator from any iterable, and next(it) returns its next item, raising StopIteration when it runs out; that's exactly what a for loop does behind the scenes. I often pass a default, like next(it, None), to avoid the exception. next() on a generator expression is also a neat way to find the first match without building a list.",
  code=r'''it = iter([10, 20])
print(next(it), next(it))
print(next(it, "done"))                   # default instead of StopIteration

nums = [3, 8, 5, 12]
print(next(n for n in nums if n > 6))     # first match
print(next((n for n in nums if n > 99), None))'''),
]
