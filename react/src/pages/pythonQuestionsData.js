// Python interview questions, basics to advanced.
// Each item: { q, level, a, code, output }. Every output is the real stdout
// from running the code with python3.

export const questions = [
  {
    q: "What is Python?",
    level: 'Basics',
    a: "Python is a high-level, general-purpose language that is interpreted, so I can run code line by line without a separate compile step. It is dynamically typed, which means I don't declare variable types; the type is decided at runtime and a variable can point to a different type later. I like it for its clean, readable syntax and huge standard library.",
    code: `x = 10
print(type(x))

x = "now a string"   # same name, new type
print(type(x))

import sys
print(sys.version_info.major)`,
    output: `<class 'int'>
<class 'str'>
3`,
  },
  {
    q: "What are the built-in data types in Python?",
    level: 'Basics',
    a: "The main ones I use are int, float, complex, str and bool for single values, and list, tuple, set, frozenset and dict for collections. There is also NoneType for None and bytes for binary data. I can always check a value's type with type() or isinstance().",
    code: `values = [42, 3.14, 2 + 3j, "hi", True, None,
          [1, 2], (1, 2), {1, 2}, {"a": 1}, b"ab"]
for v in values:
    print(type(v).__name__, "->", v)`,
    output: `int -> 42
float -> 3.14
complex -> (2+3j)
str -> hi
bool -> True
NoneType -> None
list -> [1, 2]
tuple -> (1, 2)
set -> {1, 2}
dict -> {'a': 1}
bytes -> b'ab'`,
  },
  {
    q: "What is the difference between mutable and immutable objects?",
    level: 'Basics',
    a: "A mutable object can be changed in place after I create it, like a list, dict or set. An immutable object cannot be changed; any 'change' creates a new object, like int, str and tuple. This matters because only immutable (hashable) objects can be dict keys or set items.",
    code: `nums = [1, 2, 3]
nums.append(4)            # list changed in place
print(nums)

name = "sam"
print(name.upper(), name) # new string, original untouched

point = (1, 2)
try:
    point[0] = 5
except TypeError as e:
    print("Error:", e)`,
    output: `[1, 2, 3, 4]
SAM sam
Error: 'tuple' object does not support item assignment`,
  },
  {
    q: "What is the difference between list, tuple, set and dict?",
    level: 'Basics',
    a: "A list is ordered and mutable, so I use it for a collection I will change. A tuple is ordered but immutable, good for fixed data like coordinates. A set is unordered with unique items and very fast membership checks, and a dict stores key-value pairs for fast lookup by key.",
    code: `my_list = [1, 2, 2, 3]
my_tuple = (1, 2, 2, 3)
my_set = {1, 2, 2, 3}
my_dict = {"a": 1, "b": 2}

print(my_list)
print(my_tuple)
print(my_set)          # duplicates removed
print(my_dict["b"])
print(3 in my_set)     # fast lookup`,
    output: `[1, 2, 2, 3]
(1, 2, 2, 3)
{1, 2, 3}
2
True`,
  },
  {
    q: "How do you add, update and remove items in a list?",
    level: 'Basics',
    a: "A list is mutable, so I can change it in place. To add, I use append for one item at the end, insert to put an item at a position, and extend to add many items. To update, I assign by index, like nums[0] = 10. To remove, I use remove to delete by value, pop to delete by index and get the item back, del for an index or a slice, and clear to empty it.",
    code: `nums = [10, 20, 30]
nums.append(40)          # add at the end
nums.insert(0, 5)        # add at index 0
nums.extend([50, 60])    # add many
nums[1] = 15             # update by index
print(nums)
nums.remove(30)          # remove by value
print(nums.pop())        # remove the last item and return it
del nums[0]              # remove by index
print(nums)
nums.clear()             # empty the list
print(nums)`,
    output: `[5, 15, 20, 30, 40, 50, 60]
60
[15, 20, 40, 50]
[]`,
  },
  {
    q: "What other list methods do you use often?",
    level: 'Basics',
    a: "Besides adding and removing, I often use sort to sort in place, reverse to flip the order, index to find a position, and count to count a value. sort and reverse change the original list and return None, so if I want a new list I use sorted() or reversed() instead. len() gives the size, and the in keyword checks membership.",
    code: `nums = [3, 1, 4, 1, 5]
print(len(nums), 4 in nums)
print(nums.index(4), nums.count(1))

print(sorted(nums), nums)   # new list, original unchanged
print(nums.sort())          # sorts in place, returns None
print(nums)

nums.reverse()
print(nums)`,
    output: `5 True
2 2
[1, 1, 3, 4, 5] [3, 1, 4, 1, 5]
None
[1, 1, 3, 4, 5]
[5, 4, 3, 1, 1]`,
  },
  {
    q: "How do you change a tuple if it is immutable?",
    level: 'Basics',
    a: "I can't add, update or remove items in a tuple; trying to assign throws a TypeError. If I really need a changed version, I convert it to a list, change the list, and convert it back, or I build a new tuple with concatenation. Tuples still support reading, slicing, count, index and unpacking.",
    code: `point = (10, 20, 30)
print(point[0], point[1:], point.count(20))

temp = list(point)        # convert to a list
temp[0] = 99
point = tuple(temp)       # and back to a tuple
print(point)

point = point + (40,)     # or build a new tuple
print(point)`,
    output: `10 (20, 30) 1
(99, 20, 30)
(99, 20, 30, 40)`,
  },
  {
    q: "How do you add and remove items in a set, and what are set operations?",
    level: 'Basics',
    a: "A set is mutable and keeps only unique values. I use add for one item and update for many. To remove, remove raises an error if the item is missing, while discard doesn't, so I usually prefer discard. Sets also support math-style operations: union with |, intersection with &, difference with -, and symmetric difference with ^.",
    code: `s = {1, 2, 3}
s.add(2)                 # duplicate: ignored
s.update([4, 5])         # many items
s.discard(100)           # no error if missing
s.remove(5)              # KeyError if missing
print(s)

a, b = {1, 2, 3}, {3, 4}
print(a | b, a & b)      # union, intersection
print(a - b, a ^ b)      # difference, symmetric difference`,
    output: `{1, 2, 3, 4}
{1, 2, 3, 4} {3}
{1, 2} {1, 2, 4}`,
  },
  {
    q: "How do you add, update and remove items in a dictionary?",
    level: 'Basics',
    a: "I add or update a key with dict[key] = value; if the key exists it's updated, otherwise it's added. update() merges in several keys at once. To remove, I use pop to delete a key and get its value, del for a key, and popitem to remove the last inserted pair. For safe reading I use get with a default, because dict[key] raises a KeyError if the key is missing.",
    code: `user = {"name": "Anu", "age": 22}
user["city"] = "Kochi"         # new key: added
user["age"] = 23               # existing key: updated
user.update({"role": "dev"})   # many keys at once
print(user)

print(user.get("email", "not set"))   # safe read
print(user.pop("age"))         # remove and return the value
del user["role"]
print(user.popitem())          # remove the last added pair
print(user)`,
    output: `{'name': 'Anu', 'age': 23, 'city': 'Kochi', 'role': 'dev'}
not set
23
('city', 'Kochi')
{'name': 'Anu'}`,
  },
  {
    q: "How do you loop over a dictionary?",
    level: 'Basics',
    a: "Looping over a dict directly gives me the keys. I use .values() for just the values and .items() to get key and value together, which is the one I use most. Since Python 3.7, dicts keep insertion order, so the loop order is predictable.",
    code: `prices = {"apple": 50, "banana": 20}

for key in prices:
    print(key)

for value in prices.values():
    print(value)

for fruit, price in prices.items():
    print(fruit, "costs", price)`,
    output: `apple
banana
50
20
apple costs 50
banana costs 20`,
  },
  {
    q: "Strings are immutable, so how do you change one?",
    level: 'Basics',
    a: "Every string method returns a new string; the original never changes. So to 'change' a string, I create a new one with replace, slicing, or concatenation and assign it back to the variable. If I'm building a big string in a loop, I collect the parts in a list and use join at the end, because that's faster than adding strings with + each time.",
    code: `name = "python"
name = "P" + name[1:]     # name[0] = "P" would raise TypeError
print(name)

text = "I like Java".replace("Java", "Python")
print(text)

parts = []
for i in range(3):
    parts.append("item" + str(i))
print(", ".join(parts))   # faster than + in a loop`,
    output: `Python
I like Python
item0, item1, item2`,
  },
  {
    q: "How does string slicing work, and what are common string methods?",
    level: 'Basics',
    a: "Slicing uses s[start:stop:step], where start is included and stop is excluded, and any part can be left out. s[::-1] is a quick way to reverse a string. Common methods I use are upper, lower, strip, split, join, replace, find and startswith.",
    code: `s = "  Hello, Python  "
t = s.strip()
print(t[0:5])
print(t[-6:])
print(t[::-1])
print(t.lower(), "|", t.upper())
print(t.replace("Python", "World"))
print(t.split(", "))
print("-".join(["a", "b", "c"]))
print(t.find("Py"), t.startswith("Hell"))`,
    output: `Hello
Python
nohtyP ,olleH
hello, python | HELLO, PYTHON
Hello, World
['Hello', 'Python']
a-b-c
7 True`,
  },
  {
    q: "What are f-strings?",
    level: 'Basics',
    a: "f-strings are string literals with an f prefix where I can put expressions inside curly braces, and Python fills in the values. They are the most readable and fastest way to format strings. I can also add format specs, like :.2f for two decimals, and use {var=} for quick debugging.",
    code: `name = "Asha"
price = 49.5
qty = 3
print(f"Hello {name}!")
print(f"Total: {price * qty:.2f}")
print(f"{name:>8}|")      # right-align in 8 chars
print(f"{qty=}")          # debug style`,
    output: `Hello Asha!
Total: 148.50
    Asha|
qty=3`,
  },
  {
    q: "How does indexing and negative indexing work in a list?",
    level: 'Basics',
    a: "Indexing starts at 0, so the first item is at index 0. Negative indexes count from the end, so -1 is the last item and -2 is the second last. If I use an index that does not exist I get an IndexError, so I check len() when I am not sure.",
    code: `fruits = ["apple", "banana", "mango", "grape"]
print(fruits[0])
print(fruits[-1])
print(fruits[-2])
print(fruits[1:3])
try:
    print(fruits[10])
except IndexError as e:
    print("Error:", e)`,
    output: `apple
grape
mango
['banana', 'mango']
Error: list index out of range`,
  },
  {
    q: "How do if/elif/else and loops work in Python?",
    level: 'Basics',
    a: "I use if/elif/else to choose a branch based on conditions; Python uses indentation instead of braces. A for loop iterates over any iterable, and a while loop runs while a condition is true. Inside loops I use break to stop early and continue to skip to the next item.",
    code: `marks = 72
if marks >= 90:
    print("A")
elif marks >= 70:
    print("B")
else:
    print("C")

for n in range(1, 5):
    if n == 2:
        continue          # skip 2
    print(n)`,
    output: `B
1
3
4`,
  },
  {
    q: "How does range() work?",
    level: 'Basics',
    a: "range(start, stop, step) produces a sequence of numbers from start up to, but not including, stop. It is lazy, so it does not build a full list in memory, which makes it great for big loops. I wrap it in list() only when I want to see all the values.",
    code: `print(list(range(5)))
print(list(range(2, 8)))
print(list(range(0, 10, 3)))
print(list(range(5, 0, -1)))
r = range(1_000_000)
print(len(r), r[-1])`,
    output: `[0, 1, 2, 3, 4]
[2, 3, 4, 5, 6, 7]
[0, 3, 6, 9]
[5, 4, 3, 2, 1]
1000000 999999`,
  },
  {
    q: "How do functions and default arguments work?",
    level: 'Basics',
    a: "I define a function with def, and it returns a value with return, or None if there is no return. Default arguments let a caller skip a parameter, and keyword arguments let them pass values by name in any order. Parameters with defaults must come after the ones without.",
    code: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ravi"))
print(greet("Ravi", "Hi"))
print(greet(greeting="Welcome", name="Meera"))

def nothing():
    pass
print(nothing())`,
    output: `Hello, Ravi!
Hi, Ravi!
Welcome, Meera!
None`,
  },
  {
    q: "What are *args and **kwargs?",
    level: 'Basics',
    a: "*args collects extra positional arguments into a tuple, and **kwargs collects extra keyword arguments into a dict. I use them when I don't know in advance how many arguments a function will get, or when I want to pass arguments through to another function, like in decorators.",
    code: `def show(*args, **kwargs):
    print("args:", args)
    print("kwargs:", kwargs)

show(1, 2, 3, name="Anu", age=22)

def total(*nums):
    return sum(nums)

print(total(5, 10, 15))`,
    output: `args: (1, 2, 3)
kwargs: {'name': 'Anu', 'age': 22}
30`,
  },
  {
    q: "What is the difference between 'is' and '=='?",
    level: 'Basics',
    a: "== checks if two values are equal, while 'is' checks if two names point to the exact same object in memory. Two separate lists can be equal but not the same object. I use 'is' mainly for comparing with None, like 'if x is None'.",
    code: `a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # same values
print(a is b)   # different objects
print(a is c)   # same object

x = None
print(x is None)`,
    output: `True
False
True
True`,
  },
  {
    q: "What is None in Python?",
    level: 'Basics',
    a: "None is a special constant that means 'no value' and it is the only object of type NoneType. Functions return None by default when they have no return statement. I check for it with 'is None' rather than '==', and I often use it as a safe default argument.",
    code: `def find_user(user_id):
    users = {1: "Anu"}
    return users.get(user_id)   # None if missing

user = find_user(5)
print(user, type(user).__name__)
if user is None:
    print("User not found")`,
    output: `None NoneType
User not found`,
  },
  {
    q: "What are truthy and falsy values?",
    level: 'Basics',
    a: "In a condition, Python treats some values as False: False, None, 0, 0.0, empty string, and empty list, tuple, dict and set. Everything else is truthy. That's why I can write 'if items:' to check whether a list is non-empty instead of comparing its length.",
    code: `values = [0, 1, "", "hi", [], [0], {}, None, 0.0, True]
for v in values:
    print(repr(v), "->", bool(v))

items = []
if not items:
    print("List is empty")`,
    output: `0 -> False
1 -> True
'' -> False
'hi' -> True
[] -> False
[0] -> True
{} -> False
None -> False
0.0 -> False
True -> True
List is empty`,
  },
  {
    q: "How does type conversion work in Python?",
    level: 'Basics',
    a: "I convert types explicitly with functions like int(), float(), str(), list(), tuple() and set(). Python also does some implicit conversion, like int plus float giving a float. If a conversion is not valid, like int('abc'), I get a ValueError, so I wrap user input conversions in try/except.",
    code: `print(int("42") + 1)
print(float("3.5"))
print(str(100) + "%")
print(list("abc"))
print(int(3.99))        # truncates
print(5 + 2.0)          # implicit -> float
try:
    int("abc")
except ValueError as e:
    print("Error:", e)`,
    output: `43
3.5
100%
['a', 'b', 'c']
3
7.0
Error: invalid literal for int() with base 10: 'abc'`,
  },
  {
    q: "How do print() and input() work?",
    level: 'Basics',
    a: "print() writes values to the screen; I can change the separator with sep and the line ending with end. input() reads a line from the user and always returns a string, so I convert it with int() or float() when I need a number. In this example I simulate input with a variable so it runs without typing.",
    code: `print("a", "b", "c")
print("a", "b", "c", sep="-")
print("no newline", end=" | ")
print("next")

# age = input("Enter age: ")   # always returns a str
age = "25"                      # simulated input
print(int(age) + 1)`,
    output: `a b c
a-b-c
no newline | next
26`,
  },
  {
    q: "Which string methods do you use to check and clean text?",
    level: 'Basics',
    a: "For validation I use the is-methods like isdigit, isalpha, isalnum and isspace, which return True or False for the whole string. For cleaning I use strip, lstrip and rstrip, plus title, capitalize, and split with a maxsplit when I only want the first piece. A practical tip: isdigit returns False for '-5' or '3.5', so for numbers I usually just try int() or float() inside a try block.",
    code: `print("12345".isdigit(), "-5".isdigit())
print("hello".isalpha(), "hello1".isalnum(), "  ".isspace())

raw = "  ***Python***  "
print(raw.strip())
print(raw.strip().strip("*"))
print("xxhixx".lstrip("x"), "xxhixx".rstrip("x"))

print("hello world".title(), "hello WORLD".capitalize())
print("a,b,c".split(",", 1))`,
    output: `True False
True True True
***Python***
Python
hixx xxhi
Hello World Hello world
['a', 'b,c']`,
  },
  {
    q: "How does list slicing with a step work, and how do you reverse a list?",
    level: 'Basics',
    a: "A slice is list[start:stop:step], and the step lets me skip items, like [::2] for every second item. A negative step walks backwards, so [::-1] gives a reversed copy. I use reversed() when I just want to loop backwards without making a copy, and list.reverse() when I want to change the list in place.",
    code: `nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(nums[::2])        # every 2nd item
print(nums[::-1])       # reversed copy
print(nums[7:2:-2])     # backwards with a step

for n in reversed([1, 2, 3]):   # loop backwards, no copy
    print(n)

letters = ["a", "b", "c"]
letters.reverse()       # in place
print(letters)`,
    output: `[0, 2, 4, 6, 8]
[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
[7, 5, 3]
3
2
1
['c', 'b', 'a']`,
  },
  {
    q: "How do you create and work with nested (2D) lists?",
    level: 'Basics',
    a: "A 2D list is a list of lists, and I access items with two indexes like grid[row][col]. I always build it with a list comprehension, because [[0] * 3] * 3 makes three references to the same inner list, so changing one row changes all of them. To loop over it I use nested for loops or a nested comprehension.",
    code: `wrong = [[0] * 3] * 3
wrong[0][0] = 1
print(wrong)                 # every row changed!

grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)                  # only the first row

matrix = [[1, 2, 3], [4, 5, 6]]
print(matrix[1][2])
print([x for row in matrix for x in row])`,
    output: `[[1, 0, 0], [1, 0, 0], [1, 0, 0]]
[[1, 0, 0], [0, 0, 0], [0, 0, 0]]
6
[1, 2, 3, 4, 5, 6]`,
  },
  {
    q: "How do you swap variables and unpack tuples?",
    level: 'Basics',
    a: "In Python I can swap two variables in one line with a, b = b, a, without a temp variable, because the right side is packed into a tuple first and then unpacked. Unpacking works anywhere I have a sequence of the right length, including in for loops and nested structures. Functions can return several values as a tuple, and I unpack them directly on the left side.",
    code: `a, b = 1, 2
a, b = b, a
print(a, b)

def min_max(nums):
    return min(nums), max(nums)    # returns a tuple

low, high = min_max([4, 9, 1, 7])
print(low, high)`,
    output: `2 1
1 9`,
  },
  {
    q: "How do //, %, ** and round() work?",
    level: 'Basics',
    a: "// is floor division, which rounds down towards negative infinity, so -7 // 2 is -4, not -3. % gives the remainder and its sign follows the divisor, and divmod() returns both at once. ** is power, and round() uses banker's rounding, so round(2.5) is 2; for money I use the decimal module instead of floats.",
    code: `print(7 / 2, 7 // 2, 7 % 2)
print(-7 // 2, -7 % 2)
print(divmod(17, 5))
print(2 ** 10, 9 ** 0.5, pow(2, 10, 1000))

print(round(2.5), round(3.5), round(3.14159, 2))
print(0.1 + 0.2 == 0.3)

from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))`,
    output: `3.5 3 1
-4 1
(3, 2)
1024 3.0 24
2 4 3.14
False
0.3`,
  },
  {
    q: "What is the else clause on for and while loops?",
    level: 'Basics',
    a: "A loop's else block runs only if the loop finished normally without hitting break. That makes it perfect for search loops: break when I find the item, and put the 'not found' code in else. Many people think else runs when the loop is empty or fails, so I mention it is really a 'no break' clause.",
    code: `def find(items, target):
    for item in items:
        if item == target:
            print("found", target)
            break
    else:
        print(target, "not found")   # runs only if there was no break

find([3, 8, 5], 8)
find([3, 8, 5], 9)`,
    output: `found 8
9 not found`,
  },
  {
    q: "Which built-in functions do you use most often?",
    level: 'Basics',
    a: "I use any() and all() to check conditions over a collection, sum(), min() and max() for quick stats, and abs() for distances. min and max accept a key function, so I can find the longest word or the cheapest product in one line. isinstance() is my preferred type check because it also accepts subclasses, unlike comparing type() directly.",
    code: `nums = [4, -9, 2, 7]
print(any(n < 0 for n in nums), all(n > 0 for n in nums))
print(sum(nums), min(nums), max(nums), abs(-9))

words = ["kiwi", "banana", "fig"]
print(max(words, key=len))

print(isinstance(True, int), type(True) == int)`,
    output: `True False
4 -9 7 9
banana
True False`,
  },
  {
    q: "How do you merge dictionaries, and when do you use get, setdefault or defaultdict?",
    level: 'Basics',
    a: "Since Python 3.9 I merge dicts with the | operator, and |= updates in place; before that I used {**a, **b}. In every case the right-hand dict wins on duplicate keys. For missing keys, get returns a default without changing the dict, setdefault inserts the default and returns it, and defaultdict creates the default automatically, which is the cleanest choice for grouping.",
    code: `from collections import defaultdict
a, b = {"x": 1, "y": 2}, {"y": 9}
print(a | b)                  # right side wins

d = {}
print(d.get("k", 0), d)       # default, dict unchanged
d.setdefault("k", []).append(1)
print(d)                      # key was inserted

groups = defaultdict(list)
groups["k"].append(1)         # default created automatically
print(dict(groups))`,
    output: `{'x': 1, 'y': 9}
0 {}
{'k': [1]}
{'k': [1]}`,
  },
  {
    q: "What is the difference between set and frozenset?",
    level: 'Basics',
    a: "A set is mutable, so I can add and remove items, but that also means it isn't hashable and can't be a dict key or live inside another set. A frozenset is the immutable version: same operations like union and intersection, but no add or remove. I use frozenset when I need a set of sets or a set as a dictionary key.",
    code: `s = {1, 2}
s.add(3)                        # a set can change
print(s)

fs = frozenset([1, 2, 3])
print(fs | {4}, 2 in fs)        # same operations, but no add()

costs = {frozenset({"A", "B"}): 5}   # hashable, so it can be a key
print(costs[frozenset({"B", "A"})])`,
    output: `{1, 2, 3}
frozenset({1, 2, 3, 4}) True
5`,
  },
  {
    q: "What are the rules for naming variables in Python?",
    level: 'Basics',
    a: "A name can contain letters, digits and underscores, but it cannot start with a digit and cannot be a keyword like class or for. Names are case-sensitive, so total and Total are different variables. I follow PEP 8: snake_case for variables and functions, PascalCase for classes and UPPER_CASE for constants, and I never shadow built-ins like list or str.",
    code: `import keyword

for name in ["user_name", "_temp", "2nd_place", "class", "my-var"]:
    ok = name.isidentifier() and not keyword.iskeyword(name)
    print(name, ok)

total, Total = 1, 2          # case-sensitive: two names
print(total, Total)`,
    output: `user_name True
_temp True
2nd_place False
class False
my-var False
1 2`,
  },
  {
    q: "What is the difference between comments and docstrings?",
    level: 'Basics',
    a: "A comment starts with # and is ignored by Python, so I use it to explain why a tricky line exists. A docstring is a string literal right after a def, class or module line, and Python keeps it in __doc__, so help() and IDEs can show it. I write docstrings for every public function: one summary line, then the arguments and return value.",
    code: `def area(width, height):
    """Return the area of a rectangle."""
    # a comment: ignored by Python
    return width * height

print(area(3, 4))
print(area.__doc__)`,
    output: `12
Return the area of a rectangle.`,
  },
  {
    q: "What is operator precedence in Python?",
    level: 'Basics',
    a: "Precedence decides which operator runs first: ** binds tightest, then unary minus, then * / // %, then + -, then comparisons, then not, and, or. ** is also right-associative, so 2 ** 3 ** 2 is 2 ** 9. Comparisons can be chained like 1 < x < 10. When an expression is not obvious, I add parentheses so the next reader doesn't have to remember the table.",
    code: `print(2 + 3 * 4)          # * before +
print((2 + 3) * 4)
print(2 ** 3 ** 2)        # right to left: 2 ** 9
print(-2 ** 2)            # ** before unary minus
print(10 - 4 - 3)         # left to right
x = 5
print(1 < x < 10)         # chained comparison
print(not True or True)   # (not True) or True
print(True or False and False)  # and before or`,
    output: `14
20
512
-4
3
True
True
True`,
  },
  {
    q: "How does the 'in' operator work for different types?",
    level: 'Basics',
    a: "The in and not in operators test membership. For lists and tuples Python scans item by item, which is O(n), but for sets and dicts it uses hashing, so it's O(1) on average. On a string, in checks for a substring, and on a dict it checks keys, not values. If I check membership many times, I turn the list into a set first.",
    code: `nums = [3, 7, 9]
print(7 in nums, 4 not in nums)
print("py" in "python")        # substring check

ages = {"anu": 30}
print("anu" in ages)           # checks keys
print(30 in ages)              # not values
print(30 in ages.values())`,
    output: `True True
True
True
False
True`,
  },
  {
    q: "How do and, or and not work, and what is short-circuiting?",
    level: 'Basics',
    a: "and returns the first falsy value or the last value, and or returns the first truthy value or the last value, so they don't always return True or False. They short-circuit: Python stops as soon as the answer is known, so the right side may never run. I use this for safe checks like `user and user.is_admin` and defaults like `name or 'Guest'`.",
    code: `print(0 and 5)          # first falsy value
print(3 and 5)          # last value
print("" or "Guest")    # first truthy value
print(not [])           # empty list is falsy

user = None
print(user and user.name)   # stops early: no AttributeError`,
    output: `0
5
Guest
True
None`,
  },
  {
    q: "How do you work with file paths using pathlib?",
    level: 'Basics',
    a: "pathlib gives me Path objects, so I join paths with the / operator instead of string concatenation, and it works on every OS. A Path knows its name, suffix, stem and parent, and has handy methods like exists(), mkdir(), write_text(), read_text() and glob(). I prefer it over os.path in new code because it reads more clearly.",
    code: `import tempfile
from pathlib import Path

base = Path(tempfile.mkdtemp())
f = base / "data" / "jan.csv"        # join with /
f.parent.mkdir()
f.write_text("a,b\\n1,2\\n")

print(f.name, f.stem, f.suffix, f.parent.name)
print(f.read_text().splitlines())
print([p.name for p in f.parent.glob("*.csv")], f.exists())`,
    output: `jan.csv jan .csv data
['a,b', '1,2']
['jan.csv'] True`,
  },
  {
    q: "What are list, dict and set comprehensions?",
    level: 'Intermediate',
    a: "A comprehension is a short, readable way to build a collection from another iterable in one line, with an optional if filter. I use square brackets for a list, curly braces with key: value for a dict, and curly braces for a set. They are usually faster than a manual loop with append, but I keep them simple for readability.",
    code: `nums = [1, 2, 3, 4, 5, 6]
squares = [n * n for n in nums]
evens = [n for n in nums if n % 2 == 0]
square_map = {n: n * n for n in nums[:3]}
remainders = {n % 3 for n in nums}

print(squares)
print(evens)
print(square_map)
print(remainders)`,
    output: `[1, 4, 9, 16, 25, 36]
[2, 4, 6]
{1: 1, 2: 4, 3: 9}
{0, 1, 2}`,
  },
  {
    q: "What is a lambda function?",
    level: 'Intermediate',
    a: "A lambda is a small anonymous function written in one line, with only a single expression whose value is returned. I mostly use it as a quick key or callback, like in sorted(), map() or filter(). For anything more complex I write a normal def function because it is easier to read and test.",
    code: `add = lambda a, b: a + b
print(add(2, 3))

people = [("Anu", 22), ("Ravi", 30), ("Meera", 27)]
people.sort(key=lambda p: p[1])
print(people)`,
    output: `5
[('Anu', 22), ('Meera', 27), ('Ravi', 30)]`,
  },
  {
    q: "What are map(), filter() and reduce()?",
    level: 'Intermediate',
    a: "map() applies a function to every item, filter() keeps only items where the function returns True, and reduce() from functools combines all items into one value. map and filter return lazy iterators, so I wrap them in list() to see the result. In practice I often prefer comprehensions because they read more clearly.",
    code: `from functools import reduce

nums = [1, 2, 3, 4, 5]
doubled = list(map(lambda n: n * 2, nums))
odds = list(filter(lambda n: n % 2, nums))
product = reduce(lambda a, b: a * b, nums)

print(doubled)
print(odds)
print(product)`,
    output: `[2, 4, 6, 8, 10]
[1, 3, 5]
120`,
  },
  {
    q: "What do zip() and enumerate() do?",
    level: 'Intermediate',
    a: "enumerate() gives me the index and the item together while looping, so I don't need range(len(...)). zip() pairs up items from several iterables and stops at the shortest one. I can also use dict(zip(keys, values)) to quickly build a dictionary.",
    code: `fruits = ["apple", "banana", "mango"]
for i, fruit in enumerate(fruits, start=1):
    print(i, fruit)

names = ["Anu", "Ravi", "Meera"]
ages = [22, 30, 27]
for name, age in zip(names, ages):
    print(name, age)

print(dict(zip(names, ages)))`,
    output: `1 apple
2 banana
3 mango
Anu 22
Ravi 30
Meera 27
{'Anu': 22, 'Ravi': 30, 'Meera': 27}`,
  },
  {
    q: "How do you sort with sorted() and a key?",
    level: 'Intermediate',
    a: "sorted() returns a new sorted list and leaves the original alone, while list.sort() sorts in place and returns None. The key argument takes a function that decides what to sort by, and reverse=True sorts in descending order. Python's sort is stable, so items with equal keys keep their original order.",
    code: `words = ["banana", "Apple", "kiwi", "cherry"]
print(sorted(words))
print(sorted(words, key=str.lower))
print(sorted(words, key=len))
print(sorted(words, key=len, reverse=True))

people = [{"name": "Ravi", "age": 30}, {"name": "Anu", "age": 22}]
print(sorted(people, key=lambda p: p["age"]))`,
    output: `['Apple', 'banana', 'cherry', 'kiwi']
['Apple', 'banana', 'cherry', 'kiwi']
['kiwi', 'Apple', 'banana', 'cherry']
['banana', 'cherry', 'Apple', 'kiwi']
[{'name': 'Anu', 'age': 22}, {'name': 'Ravi', 'age': 30}]`,
  },
  {
    q: "What is the difference between a shallow copy and a deep copy?",
    level: 'Intermediate',
    a: "A shallow copy creates a new outer object but still shares the inner objects, so changing a nested list affects both. A deep copy recursively copies everything, so the copy is fully independent. I use copy.deepcopy() when I have nested mutable data I need to modify safely.",
    code: `import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0].append(99)

print("original:", original)
print("shallow: ", shallow)
print("deep:    ", deep)`,
    output: `original: [[1, 2, 99], [3, 4]]
shallow:  [[1, 2, 99], [3, 4]]
deep:     [[1, 2], [3, 4]]`,
  },
  {
    q: "What is the mutable default argument pitfall?",
    level: 'Intermediate',
    a: "Default values are created only once, when the function is defined, not each time it is called. So if I use a list as a default and modify it, the changes stay between calls. The fix is to use None as the default and create a new list inside the function.",
    code: `def add_bad(item, items=[]):
    items.append(item)
    return items
print(add_bad(1))
print(add_bad(2))       # [1, 2]: the same list is reused

def add_good(item, items=None):
    if items is None:
        items = []      # a new list on every call
    items.append(item)
    return items
print(add_good(1), add_good(2))`,
    output: `[1]
[1, 2]
[1] [2]`,
  },
  {
    q: "What is scope in Python, the LEGB rule, and global/nonlocal?",
    level: 'Intermediate',
    a: "Python looks up a name in this order: Local, Enclosing function, Global, then Built-in, which is the LEGB rule. If I want to assign to a module-level variable inside a function I use global, and to assign to a variable of an outer function I use nonlocal. I try to avoid global in real code because it makes things harder to follow.",
    code: `count = 0
def outer():
    total = 0
    def inner():
        nonlocal total      # the enclosing function's variable
        global count        # the module-level variable
        total += 1
        count += 1
    inner()
    return total

print(outer(), count)`,
    output: `1 1`,
  },
  {
    q: "How does exception handling work (try/except/else/finally) and how do you create a custom exception?",
    level: 'Intermediate',
    a: "I put risky code in try and handle specific errors in except. The else block runs only if no exception happened, and finally always runs, which is good for cleanup. For my own errors I create a class that inherits from Exception, and I catch specific exceptions rather than a bare except.",
    code: `class InsufficientFunds(Exception):
    pass

try:
    raise InsufficientFunds("balance too low")
except InsufficientFunds as e:
    print("Error:", e)
else:
    print("runs only if there was no error")
finally:
    print("always runs")`,
    output: `Error: balance too low
always runs`,
  },
  {
    q: "What is the with statement and a context manager?",
    level: 'Intermediate',
    a: "The with statement makes sure setup and cleanup happen automatically, like closing a file even if an error occurs. Any object with __enter__ and __exit__ methods is a context manager. I can also write one easily with the @contextmanager decorator from contextlib.",
    code: `class Timer:
    def __enter__(self):
        print("enter")
    def __exit__(self, *args):
        print("exit")            # runs even if the block fails

with Timer():
    print("inside block")`,
    output: `enter
inside block
exit`,
  },
  {
    q: "How do you read and write files in Python?",
    level: 'Intermediate',
    a: "I use open() with a mode like 'r' to read, 'w' to write and 'a' to append, always inside a with block so the file closes automatically. I can read the whole file with read() or loop over it line by line, which is memory-friendly for big files. Here I use a temporary file so the example runs anywhere.",
    code: `import os, tempfile

path = os.path.join(tempfile.mkdtemp(), "notes.txt")
with open(path, "w") as f:
    f.write("line one\\n")
with open(path, "a") as f:
    f.write("line two\\n")

with open(path) as f:
    for line in f:
        print(line.strip())`,
    output: `line one
line two`,
  },
  {
    q: "What are modules and what does if __name__ == \"__main__\" mean?",
    level: 'Intermediate',
    a: "A module is just a .py file I can import, and a package is a folder of modules. When a file runs directly, Python sets __name__ to \"__main__\", but when it is imported, __name__ is the module name. So I put script-only code under that if check, so it does not run when someone imports my file.",
    code: `import math
from math import sqrt

print(math.pi, sqrt(16))
print(math.__name__)     # imported: the module name
print(__name__)          # run directly: "__main__"

if __name__ == "__main__":
    print("Running as a script")`,
    output: `3.141592653589793 4.0
math
__main__
Running as a script`,
  },
  {
    q: "What are Counter, defaultdict, namedtuple and deque from collections?",
    level: 'Intermediate',
    a: "Counter counts items for me and has most_common(). defaultdict gives a default value for missing keys, so I don't need to check before adding. namedtuple makes a lightweight tuple with named fields, and deque is a double-ended queue with fast appends and pops from both ends.",
    code: `from collections import Counter, defaultdict, namedtuple, deque

print(Counter("banana").most_common(2))
groups = defaultdict(list)
groups["a"].append("apple")       # no KeyError
print(dict(groups))
Point = namedtuple("Point", ["x", "y"])
print(Point(3, 4).x)
q = deque([1, 2, 3])
q.appendleft(0)                   # fast at both ends
print(q)`,
    output: `[('a', 3), ('n', 2)]
{'a': ['apple']}
3
deque([0, 1, 2, 3])`,
  },
  {
    q: "What are the most useful functions in itertools?",
    level: 'Intermediate',
    a: "itertools gives me fast, lazy building blocks for loops. I use chain to join iterables, combinations and permutations for problems like 'all pairs', and islice to take the first n items from any iterator. groupby groups consecutive items with the same key, so I always sort by that key first, otherwise the same key can appear in several groups.",
    code: `from itertools import chain, combinations, permutations, groupby, islice, count

print(list(chain([1, 2], [3, 4])))
print(list(combinations("ABC", 2)))
print(len(list(permutations("ABC"))))
print(list(islice(count(10), 3)))

words = sorted(["apple", "bat", "avocado", "ball"])   # sort first!
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, list(group))`,
    output: `[1, 2, 3, 4]
[('A', 'B'), ('A', 'C'), ('B', 'C')]
6
[10, 11, 12]
a ['apple', 'avocado']
b ['ball', 'bat']`,
  },
  {
    q: "What do functools.lru_cache and partial do?",
    level: 'Intermediate',
    a: "lru_cache memoizes a function, so repeated calls with the same arguments return the cached result instead of recomputing; it's a one-line speedup for recursive or expensive pure functions. The arguments must be hashable, so lists won't work. partial creates a new function with some arguments already filled in, which is handy for callbacks or for making a specialised version of a general function.",
    code: `from functools import lru_cache, partial

@lru_cache
def square(n):
    print("computing", n)
    return n * n

print(square(4))
print(square(4))          # from the cache: no "computing"

cube = partial(pow, exp=3)
print(cube(2))`,
    output: `computing 4
16
16
8`,
  },
  {
    q: "How do you work with JSON in Python?",
    level: 'Intermediate',
    a: "I use the json module: dumps turns Python objects into a JSON string and loads parses a JSON string back into Python objects, while dump and load do the same with files. Dicts become objects, lists become arrays, and None becomes null. For readable output I pass indent and sort_keys, and note that tuples come back as lists and dict keys always become strings.",
    code: `import json

data = {"name": "Anu", "skills": ["python"], "boss": None}
print(json.dumps(data))                  # None -> null

parsed = json.loads('{"id": 7, "ok": false}')
print(parsed)

print(json.dumps({"b": 1, "a": 2}, indent=2, sort_keys=True))
print(json.loads(json.dumps({1: (1, 2)})))   # key -> str, tuple -> list`,
    output: `{"name": "Anu", "skills": ["python"], "boss": null}
{'id': 7, 'ok': False}
{
  "a": 2,
  "b": 1
}
{'1': [1, 2]}`,
  },
  {
    q: "How do you work with dates and times using datetime?",
    level: 'Intermediate',
    a: "I use the datetime module: date for calendar dates, datetime for date plus time, and timedelta for differences and adding days. strftime formats a date into a string and strptime parses a string into a datetime. In real apps I store timezone-aware UTC datetimes and only convert to local time for display.",
    code: `from datetime import date, datetime, timedelta

d = date(2024, 2, 28)
print(d + timedelta(days=1))          # leap year
print(d.strftime("%d/%m/%Y"))

diff = datetime(2024, 1, 3, 18) - datetime(2024, 1, 1, 9)
print(diff, diff.days)

parsed = datetime.strptime("2024-12-25 08:15", "%Y-%m-%d %H:%M")
print(parsed.year, parsed.hour)`,
    output: `2024-02-29
28/02/2024
2 days, 9:00:00 2
2024 8`,
  },
  {
    q: "How do you use regular expressions with the re module?",
    level: 'Intermediate',
    a: "I use re.search to find the first match anywhere, re.match to match only at the start, re.findall to get all matches as a list, and re.sub to replace. I always write patterns as raw strings like r'\\d+' so backslashes aren't treated as escapes. Groups with parentheses let me pull out parts of a match, and for simple fixed text I just use string methods instead.",
    code: `import re

text = "Order 66 shipped on 2024-03-15"
print(re.findall(r"\\d+", text))
print(re.search(r"order (\\d+)", text, re.IGNORECASE).group(1))
print(re.match(r"\\d+", text))          # None: not at the start
print(re.sub(r"\\s+", " ", "too    many   spaces"))`,
    output: `['66', '2024', '03', '15']
66
None
too many spaces`,
  },
  {
    q: "Why is a generator expression more memory-efficient than a list comprehension?",
    level: 'Intermediate',
    a: "A list comprehension builds every item in memory straight away, while a generator expression produces items one at a time only when asked. So for a million numbers, the list holds a million objects but the generator stays a tiny fixed size. I use a generator when I only need to loop once, like inside sum(), and a list when I need indexing, len() or to loop several times.",
    code: `import sys

squares_list = [n * n for n in range(1_000_000)]
squares_gen = (n * n for n in range(1_000_000))
print(sys.getsizeof(squares_list) > 1_000_000)   # megabytes
print(sys.getsizeof(squares_gen) < 1_000)        # tiny
print(sum(squares_gen) == sum(squares_list))

gen = (n * 2 for n in range(3))
print(list(gen))
print(list(gen))      # already used up!`,
    output: `True
True
True
[0, 2, 4]
[]`,
  },
  {
    q: "How do you raise exceptions, and what does 'raise from' do?",
    level: 'Intermediate',
    a: "I raise exceptions with raise and a specific type like ValueError, and inside an except block a bare raise re-raises the same error. raise NewError(...) from e chains the original exception, so the traceback shows the real cause, which helps a lot with debugging. All normal exceptions inherit from Exception, so catching a parent class like LookupError also catches KeyError and IndexError.",
    code: `def load_port(config):
    try:
        return int(config["port"])
    except ValueError as e:
        raise RuntimeError("invalid port setting") from e

try:
    load_port({"port": "abc"})
except RuntimeError as e:
    print("Error:", e)
    print("Cause:", repr(e.__cause__))`,
    output: `Error: invalid port setting
Cause: ValueError("invalid literal for int() with base 10: 'abc'")`,
  },
  {
    q: "Why use the logging module instead of print?",
    level: 'Intermediate',
    a: "logging gives me levels like DEBUG, INFO, WARNING, ERROR and CRITICAL, so I can turn detail up or down without deleting lines of code. I can send logs to files or other handlers and add timestamps and module names through a format string. In each module I create a logger with logging.getLogger(__name__) and configure logging once at the app's entry point.",
    code: `import logging, sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(levelname)s:%(name)s:%(message)s")
log = logging.getLogger("payments")

log.debug("hidden: below INFO")
log.info("payment started")
log.warning("retrying, attempt %d", 2)
log.error("payment failed")`,
    output: `INFO:payments:payment started
WARNING:payments:retrying, attempt 2
ERROR:payments:payment failed`,
  },
  {
    q: "What is recursion, and what is the recursion limit?",
    level: 'Intermediate',
    a: "Recursion is when a function calls itself, and every recursive function needs a base case that stops it, or it keeps going forever. Python limits recursion depth, by default around 1000 calls, and raises RecursionError beyond that because it has no tail-call optimization. For deep problems I convert the recursion to a loop or use an explicit stack rather than raising the limit.",
    code: `def countdown(n):
    if n == 0:              # base case
        return ["go"]
    return [n] + countdown(n - 1)

print(countdown(3))
try:
    countdown(-1)           # never reaches the base case
except RecursionError as e:
    print("Error:", e)`,
    output: `[3, 2, 1, 'go']
Error: maximum recursion depth exceeded`,
  },
  {
    q: "What are keyword-only and positional-only parameters?",
    level: 'Intermediate',
    a: "Parameters after a bare * must be passed by keyword, which I use for flags so calls like connect(host, timeout=5) stay readable. Parameters before a / must be passed by position, so I can rename them later without breaking callers. Many built-ins use this, like len(obj, /).",
    code: `def connect(host, /, port=80, *, timeout=10):
    return f"{host}:{port} timeout={timeout}"

print(connect("db", 5432, timeout=3))
print(connect("db", port=8080))

try:
    connect("db", 80, 5)          # timeout must be a keyword
except TypeError as e:
    print("TypeError:", e)`,
    output: `db:5432 timeout=3
db:8080 timeout=10
TypeError: connect() takes from 1 to 2 positional arguments but 3 were given`,
  },
  {
    q: "How do you use heapq for a priority queue?",
    level: 'Intermediate',
    a: "heapq turns a plain list into a min-heap, so heappush and heappop are O(log n) and the smallest item is always at index 0. For a priority queue I push (priority, item) tuples, and for a max-heap I push negative priorities. For top-k problems, nlargest and nsmallest are simpler and faster than sorting everything.",
    code: `import heapq

tasks = []
heapq.heappush(tasks, (3, "write docs"))
heapq.heappush(tasks, (1, "fix bug"))
heapq.heappush(tasks, (2, "review"))
print(heapq.heappop(tasks))       # smallest priority first

scores = [40, 95, 12, 77, 88]
print(heapq.nlargest(2, scores))`,
    output: `(1, 'fix bug')
[95, 88]`,
  },
  {
    q: "What are OrderedDict and ChainMap from collections?",
    level: 'Intermediate',
    a: "Normal dicts keep insertion order since Python 3.7, so I use OrderedDict mainly for move_to_end() and popitem(last=False), which are perfect for an LRU cache. ChainMap groups several dicts into one view and looks keys up in order, which is great for layered settings like command-line over environment over defaults. Writes go to the first dict only.",
    code: `from collections import OrderedDict, ChainMap

od = OrderedDict(a=1, b=2, c=3)
od.move_to_end("a")              # a becomes the newest
print(od.popitem(last=False))    # remove the oldest: b

defaults = {"theme": "light", "lang": "en"}
cli = {"lang": "ml"}
config = ChainMap(cli, defaults)   # looks in cli first
print(config["theme"], config["lang"])`,
    output: `('b', 2)
light ml`,
  },
  {
    q: "How does the format specification mini-language work?",
    level: 'Intermediate',
    a: "After the colon in an f-string or format() I can control width, alignment, padding, sign, thousands separator, precision and type. I use it all the time for reports: :,.2f for money, :.1% for percentages, :>8 for aligned columns and :08b for binary. It's the same syntax in f-strings and str.format, so I only learn it once.",
    code: `price = 1234567.891
print(f"{price:,.2f}")        # thousands separator, 2 decimals
print(f"{0.256:.1%}")         # percentage
print(f"[{'left':<8}]")
print(f"[{'right':>8}]")
print(f"[{'mid':*^9}]")       # fill char + center
print(f"{42:05d} {42:+d}")    # zero padding, sign
print(f"{10:b} {10:08b} {255:x} {255:#X}")
print(f"{1234.5:e}")`,
    output: `1,234,567.89
25.6%
[left    ]
[   right]
[***mid***]
00042 +42
1010 00001010 ff 0XFF
1.234500e+03`,
  },
  {
    q: "How do you build a data pipeline with generators?",
    level: 'Intermediate',
    a: "I chain small generator functions, where each one takes an iterable and yields transformed items. Because everything is lazy, only one item flows through the pipeline at a time, so it works on huge files with little memory. Each stage is easy to test on its own, which keeps the code clean.",
    code: `lines = ["INFO start", "ERROR disk full", "ERROR timeout"]

def parse(rows):                    # stage 1: split each line
    for row in rows:
        yield row.split(" ", 1)

errors = (msg for level, msg in parse(lines) if level == "ERROR")  # stage 2
for msg in errors:                  # lazy: one line at a time
    print("alert:", msg)`,
    output: `alert: disk full
alert: timeout`,
  },
  {
    q: "What is an Enum and when do you use it?",
    level: 'Intermediate',
    a: "An Enum gives names to a fixed set of related constants, like order statuses, so I avoid magic strings and typos. Each member has a name and a value, I can loop over all members, and comparisons are by identity. I use auto() when the values don't matter, and StrEnum or IntEnum when they must behave like strings or ints.",
    code: `from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    SHIPPED = auto()

s = Status.SHIPPED
print(s, s.name, s.value)
print(Status["PENDING"], Status(2))
print([m.name for m in Status])
print(s is Status.SHIPPED)`,
    output: `Status.SHIPPED SHIPPED 2
Status.PENDING Status.SHIPPED
['PENDING', 'SHIPPED']
True`,
  },
  {
    q: "How do you use Optional, Union, TypedDict and Protocol from typing?",
    level: 'Intermediate',
    a: "Optional[X] means X or None, and Union[A, B] means either type; in modern code I write X | None and A | B. TypedDict describes the keys and value types of a plain dict, which is great for JSON data. Protocol enables duck typing for type checkers: any class with the right methods matches, without inheriting from anything.",
    code: `from typing import Optional, TypedDict, Protocol

class User(TypedDict):          # a dict with known keys
    name: str

class Speaker(Protocol):        # anything with speak() matches
    def speak(self) -> str: ...

class Dog:                      # no inheritance needed
    def speak(self) -> str: return "Woof"

pet: Speaker = Dog()
owner: Optional[User] = None    # a User or None
print(pet.speak(), owner)`,
    output: `Woof None`,
  },
  {
    q: "How do classes and __init__ work, and what is self?",
    level: 'Advanced',
    a: "A class is a blueprint for creating objects, and __init__ is the method that runs when I create a new object, to set its starting attributes. self refers to the current object, so self.name stores the name on that specific instance. Python passes self automatically when I call a method on an object.",
    code: `class Dog:
    species = "Canine"          # shared by all dogs

    def __init__(self, name):
        self.name = name        # stored on this object

    def bark(self):
        return f"{self.name} says woof"

d = Dog("Rex")
print(d.bark(), d.species)`,
    output: `Rex says woof Canine`,
  },
  {
    q: "How do inheritance and super() work?",
    level: 'Advanced',
    a: "Inheritance lets a child class reuse and extend a parent class. I can override a method in the child, and use super() to call the parent's version, most often in __init__ so the parent sets up its own attributes. Python also supports multiple inheritance and follows the MRO to decide which method to use.",
    code: `class Animal:
    def __init__(self, name):
        self.name = name

class Cat(Animal):
    def __init__(self, name, indoor):
        super().__init__(name)      # the parent sets self.name
        self.indoor = indoor

c = Cat("Kitty", True)
print(c.name, c.indoor, isinstance(c, Animal))
print([cls.__name__ for cls in Cat.__mro__])`,
    output: `Kitty True True
['Cat', 'Animal', 'object']`,
  },
  {
    q: "What is the difference between instance, class and static methods?",
    level: 'Advanced',
    a: "An instance method takes self and works with one object's data. A class method takes cls and works with the class itself, and I often use it as an alternative constructor. A static method takes neither; it is just a helper function that logically belongs in the class.",
    code: `class Employee:
    def __init__(self, name):       # instance method: gets self
        self.name = name
    @classmethod
    def from_csv(cls, text):        # class method: gets cls
        return cls(text.split(",")[0])
    @staticmethod
    def is_workday(day):            # static method: gets neither
        return day not in ("Sat", "Sun")

e = Employee.from_csv("Anu,5000")
print(e.name, Employee.is_workday("Sun"))`,
    output: `Anu False`,
  },
  {
    q: "What are dunder methods like __str__, __repr__, __len__ and __eq__?",
    level: 'Advanced',
    a: "Dunder (double underscore) methods let my class work with Python's built-in operations. __str__ gives a friendly string for print(), __repr__ gives a developer-friendly string, __len__ makes len() work, and __eq__ defines what == means. A good tip is to always define __repr__, because it helps a lot in debugging.",
    code: `class Cart:
    def __init__(self, items):
        self.items = items
    def __str__(self):
        return f"Cart with {len(self)} items"
    def __repr__(self):
        return f"Cart({self.items!r})"
    def __len__(self):
        return len(self.items)

cart = Cart(["pen", "book"])
print(cart, repr(cart), len(cart))`,
    output: `Cart with 2 items Cart(['pen', 'book']) 2`,
  },
  {
    q: "What does @property do?",
    level: 'Advanced',
    a: "@property lets me access a method like an attribute, so I can add validation or computed values without changing how callers use the class. I pair it with a .setter to control what values are allowed. It's the Pythonic way to do getters and setters.",
    code: `class Circle:
    @property
    def radius(self):              # read like an attribute
        return self._radius

    @radius.setter
    def radius(self, value):       # runs on assignment
        self._radius = max(value, 0)

c = Circle()
c.radius = -5
print(c.radius)`,
    output: `0`,
  },
  {
    q: "What is a decorator, and how do you write one with arguments?",
    level: 'Advanced',
    a: "A decorator is a function that takes another function and returns a new function that adds behavior before or after it, like logging or timing. I apply it with the @ syntax. For a decorator with arguments I add one more outer function that takes the arguments. In real code I also put functools.wraps on the wrapper to keep the original function's name.",
    code: `def repeat(times):                 # outer: takes the arguments
    def decorator(func):           # middle: takes the function
        def wrapper(*args):        # inner: runs instead of func
            for _ in range(times):
                func(*args)
        return wrapper
    return decorator

@repeat(2)
def hello(name):
    print("hello", name)
hello("Anu")`,
    output: `hello Anu
hello Anu`,
  },
  {
    q: "What is a generator, and what is the difference between yield and return?",
    level: 'Advanced',
    a: "A generator is a function that uses yield to produce values one at a time, pausing between them. return ends the function and gives back a single value, while yield hands out a value and remembers where it stopped, so the next call continues from there. Generators are memory-efficient because they don't build the whole list.",
    code: `def count_up(n):
    i = 1
    while i <= n:
        yield i            # pause here and hand out i
        i += 1

gen = count_up(3)
print(next(gen))
print(next(gen))
print(list(gen))           # the remaining values`,
    output: `1
2
[3]`,
  },
  {
    q: "What is an iterator, and how is it different from an iterable?",
    level: 'Advanced',
    a: "An iterable is anything I can loop over, like a list, and it gives an iterator through iter(). An iterator is an object with __next__ that returns one item at a time and raises StopIteration when it's done. A for loop does this for me behind the scenes; I can also build my own iterator by defining __iter__ and __next__.",
    code: `nums = [10, 20]          # iterable
it = iter(nums)          # iterator
print(next(it))
print(next(it))
try:
    next(it)
except StopIteration:
    print("StopIteration: no more items")

for n in nums:           # for calls iter() and next() for me
    print(n)`,
    output: `10
20
StopIteration: no more items
10
20`,
  },
  {
    q: "What is a closure?",
    level: 'Advanced',
    a: "A closure is an inner function that remembers variables from the outer function even after the outer function has finished. I use closures to create configured functions, like a multiplier factory, or to keep private state without a class. Decorators are built on this same idea.",
    code: `def make_multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))
print(triple(5))
print(double.__closure__[0].cell_contents)`,
    output: `10
15
2`,
  },
  {
    q: "What is the GIL, and when do you use threading vs multiprocessing vs asyncio?",
    level: 'Advanced',
    a: "The GIL (Global Interpreter Lock) in CPython lets only one thread run Python bytecode at a time, so threads don't speed up CPU-heavy work. I use threading or asyncio for I/O-bound work like network calls, and multiprocessing for CPU-bound work since each process has its own interpreter and GIL. Newer Python versions also have an optional free-threaded build without the GIL.",
    code: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def square(n):
    return n * n

if __name__ == "__main__":
    with ThreadPoolExecutor(2) as ex:      # I/O-bound work
        print(list(ex.map(square, [1, 2, 3])))
    with ProcessPoolExecutor(2) as ex:     # CPU-bound work
        print(list(ex.map(square, [1, 2, 3])))`,
    output: `[1, 4, 9]
[1, 4, 9]`,
  },
  {
    q: "How do async and await work with asyncio?",
    level: 'Advanced',
    a: "async def creates a coroutine, and await pauses it until another coroutine finishes, letting the event loop run other tasks meanwhile. asyncio.gather() runs several coroutines concurrently, which is great for many I/O waits like API calls. I start everything with asyncio.run(main()).",
    code: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)      # pretend I/O wait
    return name + " done"

async def main():
    print(await asyncio.gather(fetch("users", 0.2), fetch("orders", 0.1)))

asyncio.run(main())`,
    output: `['users done', 'orders done']`,
  },
  {
    q: "What are type hints?",
    level: 'Advanced',
    a: "Type hints let me note the expected types of variables, parameters and return values, like name: str or -> int. Python does not enforce them at runtime, but tools like mypy and IDEs use them to catch bugs early and give better autocomplete. They also make code much easier to read in a team.",
    code: `def greet(name: str, times: int = 1) -> str:
    return " ".join([f"Hi {name}"] * times)

def average(nums: list[float]) -> float | None:
    return sum(nums) / len(nums) if nums else None

print(greet("Anu", 2))
print(average([2.0, 4.0]))
print(average([]))
print(greet.__annotations__)`,
    output: `Hi Anu Hi Anu
3.0
None
{'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}`,
  },
  {
    q: "What is a dataclass?",
    level: 'Advanced',
    a: "A dataclass, using the @dataclass decorator, automatically creates __init__, __repr__ and __eq__ from the fields I declare. It saves a lot of boilerplate for classes that mainly hold data. I can set defaults, use field(default_factory=list) for mutable defaults, and frozen=True to make it immutable.",
    code: `from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    tags: list = field(default_factory=list)

p = Product("Pen", 10.0)
print(p)                               # auto __repr__
print(p == Product("Pen", 10.0))       # auto __eq__`,
    output: `Product(name='Pen', price=10.0, tags=[])
True`,
  },
  {
    q: "How does * and ** unpacking work?",
    level: 'Advanced',
    a: "The * operator unpacks an iterable into separate items, and ** unpacks a dict into keyword arguments or into another dict. I use it to pass a list as function arguments, merge lists or dicts, and grab 'the rest' of items in an assignment like first, *rest = items.",
    code: `def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add(*nums))
print(add(**{"a": 1, "b": 2, "c": 3}))

first, *rest = [10, 20, 30, 40]
print(first, rest)
print([*nums, 4], {**{"x": 1}, "y": 2})`,
    output: `6
6
10 [20, 30, 40]
[1, 2, 3, 4] {'x': 1, 'y': 2}`,
  },
  {
    q: "What is the walrus operator (:=)?",
    level: 'Advanced',
    a: "The walrus operator := assigns a value to a variable as part of an expression, added in Python 3.8. It helps me avoid computing something twice, for example checking a value in a condition and using it right after. I use it sparingly, only where it makes the code clearer.",
    code: `data = [1, 2, 3, 4, 5, 6]
if (n := len(data)) > 5:
    print(f"List is long ({n} items)")

values = [5, 12, 7, 20]
big = [y for x in values if (y := x * 2) > 15]
print(big)`,
    output: `List is long (6 items)
[24, 40]`,
  },
  {
    q: "What is the difference between class attributes and instance attributes?",
    level: 'Advanced',
    a: "A class attribute is defined on the class and shared by all instances, while an instance attribute is set on self, usually in __init__, and belongs to one object. If I assign to the same name on an instance, it creates an instance attribute that hides the class one. The classic bug is a mutable class attribute like a list, which every instance ends up sharing, so I create lists in __init__.",
    code: `class Dog:
    species = "canine"       # class attribute: shared
    tricks = []              # shared list: a classic bug
    def __init__(self, name):
        self.name = name     # instance attribute

a, b = Dog("Rex"), Dog("Max")
a.species = "wolf"           # hides the class one, only on a
print(a.species, b.species)

a.tricks.append("sit")
print(b.tricks)              # Max learned it too!`,
    output: `wolf canine
['sit']`,
  },
  {
    q: "How does multiple inheritance work, and what is the MRO?",
    level: 'Advanced',
    a: "A class can inherit from several parents, and Python decides where to look up a method using the Method Resolution Order, which I can inspect with ClassName.__mro__ or mro(). It uses C3 linearization, so in a diamond shape each class appears only once and children come before their parents. super() follows the MRO, not just the direct parent, which is why cooperative classes should all call super().",
    code: `class A:
    def hi(self): return "A"
class B(A):
    def hi(self): return "B -> " + super().hi()
class C(A):
    def hi(self): return "C -> " + super().hi()
class D(B, C):
    pass

print(D().hi())
print([k.__name__ for k in D.__mro__])`,
    output: `B -> C -> A
['D', 'B', 'C', 'A', 'object']`,
  },
  {
    q: "What are abstract base classes (abc)?",
    level: 'Advanced',
    a: "An abstract base class defines an interface: methods marked with @abstractmethod must be implemented by subclasses. I can't create an instance of the abstract class itself, or of a subclass that forgot a method, which catches mistakes early. I use them when I have several implementations of the same idea, like different payment providers or storage backends.",
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self): ...

class Square(Shape):
    def area(self): return 9

print(Square().area())
try:
    Shape()                 # area() is abstract
except TypeError as e:
    print("Error:", e)`,
    output: `9
Error: Can't instantiate abstract class Shape without an implementation for abstract method 'area'`,
  },
  {
    q: "How does operator overloading work in Python?",
    level: 'Advanced',
    a: "I overload operators by defining dunder methods: __add__ for +, __sub__ for -, __mul__ for *, __eq__ for == and __lt__ for <. Python calls these methods when it sees the operator, so my objects behave like built-in types. If my method can't handle the other type, I return NotImplemented so Python can try the other side or raise a clean TypeError.",
    code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v = Vector(1, 2) + Vector(3, 4)
print(v, v == Vector(4, 6))`,
    output: `Vector(4, 6) True`,
  },
  {
    q: "What is __slots__ and when would you use it?",
    level: 'Advanced',
    a: "Normally each object stores its attributes in a per-instance __dict__, which is flexible but uses extra memory. Declaring __slots__ lists the allowed attribute names, so Python uses a fixed, compact layout and has no __dict__. I use it when I create millions of small objects; the trade-off is that I can't add new attributes on the fly.",
    code: `class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
print(p.x, hasattr(p, "__dict__"))
try:
    p.z = 3
except AttributeError as e:
    print("Error:", e)`,
    output: `1 False
Error: 'Point' object has no attribute 'z' and no __dict__ for setting new attributes`,
  },
  {
    q: "What does writing 'Pythonic' code mean, and what is PEP 8?",
    level: 'Advanced',
    a: "PEP 8 is the official style guide: 4-space indentation, snake_case for functions and variables, CapWords for classes, and lines kept reasonably short. Pythonic code uses the language's idioms instead of patterns from other languages, like looping directly over items, using enumerate and zip, comprehensions, and with for resources. In practice I let tools like black or ruff format and lint the code so the team doesn't argue about style.",
    code: `names = ["anu", "ravi", "meera"]

for i in range(len(names)):        # not Pythonic
    print(i, names[i])

for i, name in enumerate(names):   # Pythonic
    print(i, name)

if names:                          # instead of len(names) > 0
    print(sum(len(n) for n in names))`,
    output: `0 anu
1 ravi
2 meera
0 anu
1 ravi
2 meera
12`,
  },
  {
    q: "What is a metaclass?",
    level: 'Advanced',
    a: "A metaclass is the class of a class: just as an object is created by its class, a class is created by its metaclass, which is type by default. By overriding __new__ or __init__ in a metaclass I can check or change every class when it is defined, for example to auto-register plugins. In practice I reach for __init_subclass__ or a decorator first, because metaclasses are harder to read.",
    code: `class Meta(type):
    def __new__(mcls, name, bases, ns):
        print("creating class", name)    # runs when a class is defined
        return super().__new__(mcls, name, bases, ns)

class Plugin(metaclass=Meta):
    pass

print(type(42), type(int), type(Plugin))
Point = type("Point", (), {"x": 1})      # type() creates classes too
print(Point().x)`,
    output: `creating class Plugin
<class 'int'> <class 'type'> <class '__main__.Meta'>
1`,
  },
  {
    q: "What are descriptors in Python?",
    level: 'Advanced',
    a: "A descriptor is an object with __get__, __set__ or __delete__ that controls attribute access when it lives on a class. It is the machinery behind @property, methods, classmethod and staticmethod. I write one when I need the same check on many attributes, like 'never negative', using __set_name__ so it knows the attribute name.",
    code: `class NonNegative:
    def __set_name__(self, owner, name):
        self.name = "_" + name
    def __get__(self, obj, objtype=None):
        return getattr(obj, self.name)
    def __set__(self, obj, value):
        setattr(obj, self.name, max(value, 0))   # never below 0

class Product:
    price = NonNegative()
p = Product()
p.price = -5                # goes through __set__
print(p.price)`,
    output: `0`,
  },
  {
    q: "What is the difference between __getattr__ and __getattribute__?",
    level: 'Advanced',
    a: "__getattribute__ runs on every attribute access, so overriding it is powerful but easy to get wrong and slow. __getattr__ runs only when normal lookup fails, which makes it the safe choice for fallbacks, proxies and dynamic attributes. Inside __getattribute__ I must call super().__getattribute__ to avoid infinite recursion.",
    code: `class Demo:
    x = 1
    def __getattribute__(self, name):     # runs on EVERY access
        print("getattribute:", name)
        return super().__getattribute__(name)
    def __getattr__(self, name):          # runs only if lookup failed
        return "default for " + name

d = Demo()
print(d.x)
print(d.missing)`,
    output: `getattribute: x
1
getattribute: missing
default for missing`,
  },
  {
    q: "What does __call__ do?",
    level: 'Advanced',
    a: "Defining __call__ makes instances callable like functions, so obj(args) runs obj.__call__(args). I use it when a function needs to remember state or configuration, like a counter, a rate limiter or a class-based decorator. callable() tells me whether something can be called.",
    code: `class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0
    def __call__(self, x):
        self.calls += 1
        return x * self.factor

double = Multiplier(2)
print(double(5), double(21))
print("calls:", double.calls)
print(callable(double), callable(42))`,
    output: `10 42
calls: 2
True False`,
  },
  {
    q: "How do you limit concurrency and add timeouts in asyncio?",
    level: 'Advanced',
    a: "I use asyncio.Semaphore so only N coroutines run a section at once, which protects APIs from too many parallel calls. asyncio.wait_for (or asyncio.timeout in 3.11+) cancels a coroutine that takes too long and raises TimeoutError. With gather(return_exceptions=True), one failure doesn't cancel the whole batch, and results keep the input order.",
    code: `import asyncio
sem = asyncio.Semaphore(2)             # at most 2 jobs at once

async def job(i):
    async with sem:
        await asyncio.sleep(0.01)
        return i

async def main():
    slow = asyncio.wait_for(asyncio.sleep(1), timeout=0.05)
    print(await asyncio.gather(job(1), job(2), job(3), slow, return_exceptions=True))

asyncio.run(main())`,
    output: `[1, 2, 3, TimeoutError()]`,
  },
  {
    q: "How does Python manage memory: reference counting, garbage collection and weakref?",
    level: 'Advanced',
    a: "CPython frees most objects through reference counting: when nothing refers to an object any more, it is freed straight away. Reference cycles, like two objects pointing at each other, are cleaned up by the gc module's cycle collector. A weakref points to an object without keeping it alive, which I use for caches so they don't leak memory.",
    code: `import gc, weakref

class Node:
    pass

a, b = Node(), Node()
a.other, b.other = b, a          # a reference cycle
watch = weakref.ref(a)           # weak: doesn't keep a alive
del a, b                         # refcounts never reach 0
gc.collect()                     # the cycle collector frees them
print("freed:", watch() is None)`,
    output: `freed: True`,
  },
  {
    q: "How do you write unit tests with unittest and mock dependencies?",
    level: 'Advanced',
    a: "I subclass unittest.TestCase and write test_ methods using assertions like assertEqual and assertRaises, and setUp prepares shared data. For things like APIs or databases I use unittest.mock: patch replaces the real call with a Mock, so tests are fast and deterministic, and I can assert how it was called. In real projects I run them with python -m unittest or pytest; here I run them from code.",
    code: `from unittest import TestCase, mock

def get_price(api, item):
    return api.fetch(item)["price"] * 2

class PriceTests(TestCase):
    def test_price(self):
        api = mock.Mock()
        api.fetch.return_value = {"price": 50}     # fake API reply
        self.assertEqual(get_price(api, "pen"), 100)
        api.fetch.assert_called_once_with("pen")

result = PriceTests("test_price").run()
print("ran:", result.testsRun, "ok:", result.wasSuccessful())`,
    output: `ran: 1 ok: True`,
  },
  {
    q: "Coding: Reverse a string",
    level: 'Coding round',
    a: "The simplest way I reverse a string is slicing with s[::-1]. I can also use ''.join(reversed(s)), or a loop if the interviewer wants it without built-ins. All of these are O(n).",
    code: `s = "python"
print(s[::-1])
print("".join(reversed(s)))

result = ""
for ch in s:
    result = ch + result
print(result)`,
    output: `nohtyp
nohtyp
nohtyp`,
  },
  {
    q: "Coding: Check if a string is a palindrome",
    level: 'Coding round',
    a: "A palindrome reads the same forwards and backwards. I first clean the string by lowercasing it and keeping only letters and numbers, then compare it with its reverse. For a no-extra-memory version I can use two pointers from both ends.",
    code: `def is_palindrome(s):
    clean = "".join(ch.lower() for ch in s if ch.isalnum())
    return clean == clean[::-1]

print(is_palindrome("madam"))
print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("hello"))`,
    output: `True
True
False`,
  },
  {
    q: "Coding: Check if two strings are anagrams",
    level: 'Coding round',
    a: "Two strings are anagrams if they have the same characters with the same counts. I can compare sorted(a) == sorted(b), which is O(n log n), or compare Counter(a) == Counter(b), which is O(n). I usually lowercase and remove spaces first.",
    code: `from collections import Counter

def is_anagram(a, b):
    a = a.replace(" ", "").lower()
    b = b.replace(" ", "").lower()
    return Counter(a) == Counter(b)

print(is_anagram("listen", "silent"))
print(is_anagram("Dormitory", "dirty room"))`,
    output: `True
True`,
  },
  {
    q: "Coding: Count each character in a string",
    level: 'Coding round',
    a: "I loop through the string and keep counts in a dict using get(ch, 0) + 1. In real code I'd just use collections.Counter, which does the same thing in one line and also gives most_common().",
    code: `from collections import Counter

s = "hello world"
counts = {}
for ch in s:
    if ch != " ":
        counts[ch] = counts.get(ch, 0) + 1
print(counts)

print(Counter(s.replace(" ", "")).most_common(2))`,
    output: `{'h': 1, 'e': 1, 'l': 3, 'o': 2, 'w': 1, 'r': 1, 'd': 1}
[('l', 3), ('o', 2)]`,
  },
  {
    q: "Coding: FizzBuzz",
    level: 'Coding round',
    a: "I loop from 1 to n and print 'FizzBuzz' if the number is divisible by both 3 and 5, 'Fizz' for 3, 'Buzz' for 5, and the number otherwise. The key tip is to check the 15 case first, or build the string up so both words join naturally.",
    code: `for i in range(1, 16):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
    output: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz`,
  },
  {
    q: "Coding: Fibonacci series",
    level: 'Coding round',
    a: "Each Fibonacci number is the sum of the previous two. I prefer the iterative version with two variables because it is O(n) and uses constant memory. The plain recursive version is very slow, so if I use recursion I add caching with functools.lru_cache.",
    code: `def fib_list(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print(fib_list(10))`,
    output: `[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  },
  {
    q: "Coding: Find duplicates in a list",
    level: 'Coding round',
    a: "I keep a set of items I have already seen, and when I see an item again I add it to a duplicates set. This is O(n) because set lookups are O(1). Another quick option is Counter, picking items whose count is more than 1.",
    code: `from collections import Counter

nums = [4, 2, 7, 2, 4, 9, 4]
seen, dups = set(), set()
for n in nums:
    if n in seen:
        dups.add(n)
    seen.add(n)
print(sorted(dups))

print([n for n, c in Counter(nums).items() if c > 1])`,
    output: `[2, 4]
[4, 2]`,
  },
  {
    q: "Coding: Two Sum",
    level: 'Coding round',
    a: "Given a list and a target, I need the indexes of two numbers that add up to the target. I use a dict to store each number's index as I go, and for each number I check if target minus that number is already in the dict. That gives an O(n) solution instead of the O(n^2) nested loop.",
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))`,
    output: `[0, 1]
[1, 2]`,
  },
  {
    q: "Coding: Flatten a nested list",
    level: 'Coding round',
    a: "For one level of nesting, a nested list comprehension is enough. For any depth, I use recursion: if an item is a list I flatten it again, otherwise I add it to the result. A generator with yield from also works nicely for this.",
    code: `nested = [[1, 2], [3, 4], [5]]
print([x for sub in nested for x in sub])

def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

deep = [1, [2, [3, [4, 5]], 6], 7]
print(list(flatten(deep)))`,
    output: `[1, 2, 3, 4, 5]
[1, 2, 3, 4, 5, 6, 7]`,
  },
  {
    q: "Coding: Remove duplicates while keeping order",
    level: 'Coding round',
    a: "Using set() removes duplicates but loses the original order. To keep order I loop and add items to a result list only if they are not in a 'seen' set. A neat one-liner is list(dict.fromkeys(items)), since dicts keep insertion order.",
    code: `items = [3, 1, 3, 2, 1, 5]

seen = set()
result = []
for x in items:
    if x not in seen:
        seen.add(x)
        result.append(x)
print(result)

print(list(dict.fromkeys(items)))`,
    output: `[3, 1, 2, 5]
[3, 1, 2, 5]`,
  },
  {
    q: "Coding: Find the second largest number",
    level: 'Coding round',
    a: "I track the largest and second largest in a single pass, which is O(n). I make sure to skip duplicates of the largest value, so [5, 5, 3] gives 3. A simpler way is sorted(set(nums))[-2], but it is O(n log n).",
    code: `def second_largest(nums):
    first = second = None
    for n in nums:
        if first is None or n > first:
            first, second = n, first
        elif n != first and (second is None or n > second):
            second = n
    return second

print(second_largest([10, 5, 20, 8]))
print(second_largest([5, 5, 3]))`,
    output: `10
3`,
  },
  {
    q: "Coding: Word frequency in a sentence",
    level: 'Coding round',
    a: "I lowercase the text, strip punctuation, split it into words, and count them with a dict or Counter. Then most_common(n) gives the top words. Cleaning the text first is important so 'The' and 'the.' count as the same word.",
    code: `import string
from collections import Counter

text = "The cat and the hat. The cat sat!"
clean = text.lower().translate(str.maketrans("", "", string.punctuation))
words = clean.split()

freq = Counter(words)
print(dict(freq))
print(freq.most_common(2))`,
    output: `{'the': 3, 'cat': 2, 'and': 1, 'hat': 1, 'sat': 1}
[('the', 3), ('cat', 2)]`,
  },
  {
    q: "Coding: Merge two sorted lists",
    level: 'Coding round',
    a: "I use two pointers, one for each list, and always take the smaller current item, which gives an O(n + m) merge. When one list runs out, I add whatever is left in the other. In real code, sorted(a + b) or heapq.merge also work, but interviewers usually want the two-pointer version.",
    code: `def merge_sorted(a, b):
    i = j = 0
    result = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    return result + a[i:] + b[j:]     # add whatever is left

print(merge_sorted([1, 4, 7], [2, 3, 8, 10]))`,
    output: `[1, 2, 3, 4, 7, 8, 10]`,
  },
  {
    q: "Coding: Binary search",
    level: 'Coding round',
    a: "Binary search works on a sorted list: I check the middle item and throw away the half where the target can't be, so it runs in O(log n). I keep low and high pointers and loop while low <= high. In production I'd use the bisect module, but writing it by hand shows I understand the boundaries.",
    code: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

nums = [2, 5, 8, 12, 16, 23, 38]
print(binary_search(nums, 23), binary_search(nums, 7))`,
    output: `5 -1`,
  },
  {
    q: "Coding: Bubble sort",
    level: 'Coding round',
    a: "Bubble sort repeatedly swaps neighbouring items that are in the wrong order, so the largest value 'bubbles' to the end on each pass. It's O(n^2), so I'd never use it in real code, but I add a swapped flag to stop early when the list is already sorted. In practice I just use sorted(), which is Timsort and O(n log n).",
    code: `def bubble_sort(nums):
    nums = nums[:]                 # don't modify the input
    n = len(nums)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:
            break                  # already sorted
    return nums

print(bubble_sort([5, 1, 4, 2, 8]))`,
    output: `[1, 2, 4, 5, 8]`,
  },
  {
    q: "Coding: Find the missing number from 1 to n",
    level: 'Coding round',
    a: "If a list holds the numbers 1 to n with one missing, the expected sum is n * (n + 1) // 2, and the missing number is that minus the actual sum. That's O(n) time and O(1) space. Another approach is set difference, which also works when several numbers are missing.",
    code: `def missing_number(nums):
    n = len(nums) + 1
    return n * (n + 1) // 2 - sum(nums)

print(missing_number([1, 2, 4, 5, 6]))
print(missing_number([2, 3, 1, 5]))`,
    output: `3
4`,
  },
  {
    q: "Coding: Maximum subarray sum (Kadane's algorithm)",
    level: 'Coding round',
    a: "Kadane's algorithm walks through the list once and keeps the best sum of a subarray ending at the current position. At each number I decide whether to extend the current run or start fresh from this number, then update the overall best. It's O(n), and starting with the first element handles lists that are all negative.",
    code: `def max_subarray(nums):
    current = best = nums[0]
    for n in nums[1:]:
        current = max(n, current + n)
        best = max(best, current)
    return best

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
print(max_subarray([5, 4, -1, 7, 8]))
print(max_subarray([-3, -1, -2]))`,
    output: `6
23
-1`,
  },
  {
    q: "Coding: Valid parentheses",
    level: 'Coding round',
    a: "I use a stack: push every opening bracket, and for each closing bracket check that the top of the stack is the matching opener. A dict maps each closer to its opener to keep the code short. At the end the stack must be empty, otherwise some brackets were never closed.",
    code: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

for s in ["()[]{}", "{[()]}", "(]", "(()", "a(b)c"]:
    print(s, is_valid(s))`,
    output: `()[]{} True
{[()]} True
(] False
(() False
a(b)c True`,
  },
  {
    q: "Coding: Transpose a matrix",
    level: 'Coding round',
    a: "Transposing swaps rows and columns, so item [i][j] moves to [j][i]. The neat Pythonic way is list(zip(*matrix)), which unpacks the rows into zip so it groups the first items, then the second items, and so on. I convert each tuple back to a list, and I can show the nested comprehension version too.",
    code: `matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

transposed = [list(row) for row in zip(*matrix)]
print(transposed)

rows, cols = len(matrix), len(matrix[0])
manual = [[matrix[r][c] for r in range(rows)] for c in range(cols)]
print(manual)
print(manual == transposed)`,
    output: `[[1, 4], [2, 5], [3, 6]]
[[1, 4], [2, 5], [3, 6]]
True`,
  },
  {
    q: "Coding: Check if a number is prime",
    level: 'Coding round',
    a: "A prime is greater than 1 and divisible only by 1 and itself. I only need to test divisors up to the square root of n, because any larger factor pairs with a smaller one, which makes it O(sqrt n). I can also skip even numbers after 2 to halve the work.",
    code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print([n for n in range(30) if is_prime(n)])
print(is_prime(97), is_prime(91))`,
    output: `[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
True False`,
  },
  {
    q: "Coding: Reverse the words in a sentence",
    level: 'Coding round',
    a: "I split the sentence into words, reverse the list, and join it back with spaces. split() with no arguments also handles multiple spaces and leading or trailing spaces. If they ask to reverse each word instead, I reverse every word with slicing and keep the word order.",
    code: `def reverse_words(sentence):
    return " ".join(sentence.split()[::-1])

def reverse_each_word(sentence):
    return " ".join(word[::-1] for word in sentence.split())

s = "  Python   is really fun "
print(reverse_words(s))
print(reverse_each_word("Python is fun"))`,
    output: `fun really is Python
nohtyP si nuf`,
  },
  {
    q: "Coding: Count the vowels in a string",
    level: 'Coding round',
    a: "I lowercase the string and count characters that are in a set of vowels, using sum() with a generator expression. A set makes each membership check O(1). If they want the count per vowel, I use a Counter on the filtered characters.",
    code: `from collections import Counter

def count_vowels(text):
    vowels = set("aeiou")
    return sum(1 for ch in text.lower() if ch in vowels)

text = "Interview Preparation"
print(count_vowels(text))
per_vowel = Counter(ch for ch in text.lower() if ch in "aeiou")
print(sorted(per_vowel.items()))`,
    output: `9
[('a', 2), ('e', 3), ('i', 3), ('o', 1)]`,
  },
  {
    q: "Coding: Factorial (iterative and recursive)",
    level: 'Coding round',
    a: "Factorial of n is the product of all numbers from 1 to n, and 0! is 1. I prefer the iterative loop because it has no recursion depth limit, but I show the recursive one with a clear base case too. In real code math.factorial is the fastest and handles validation.",
    code: `def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def factorial_rec(n):
    return 1 if n <= 1 else n * factorial_rec(n - 1)

print(factorial_iter(5), factorial_rec(5), factorial_iter(0))`,
    output: `120 120 1`,
  },
  {
    q: "Coding: Find the longest word in a sentence",
    level: 'Coding round',
    a: "I split the sentence into words, strip punctuation, and use max() with key=len. max returns the first word with the longest length, so ties keep the earliest word. If they want all the longest words, I find the max length first and then filter.",
    code: `import string

def longest_word(sentence):
    words = [w.strip(string.punctuation) for w in sentence.split()]
    return max(words, key=len)

s = "I love solving coding problems, honestly!"
print(longest_word(s))

words = "cat house mouse dog".split()
top = max(len(w) for w in words)
print([w for w in words if len(w) == top])`,
    output: `problems
['house', 'mouse']`,
  },
  {
    q: "Coding: Rotate a list by k positions",
    level: 'Coding round',
    a: "I first take k modulo the length so large k values and empty lists are handled. Then rotating right is just slicing: the last k items followed by the rest. If they ask for in place with O(1) extra space, I use the three-reversal trick, and collections.deque.rotate is the quick built-in option.",
    code: `from collections import deque

def rotate_right(nums, k):
    if not nums:
        return nums
    k %= len(nums)
    return nums[-k:] + nums[:-k]

print(rotate_right([1, 2, 3, 4, 5], 2))
print(rotate_right([1, 2, 3], 7))

d = deque([1, 2, 3, 4, 5])
d.rotate(2)
print(list(d))`,
    output: `[4, 5, 1, 2, 3]
[3, 1, 2]
[4, 5, 1, 2, 3]`,
  },
  {
    q: "Coding: Print a matrix in spiral order",
    level: 'Coding round',
    a: "I keep four boundaries, top, bottom, left and right, and walk right, down, left and up, shrinking a boundary after each side. I check the boundaries again before the last two walks so single rows or columns aren't added twice. It visits every cell once, so it's O(rows * cols).",
    code: `def spiral(m):
    res = []
    if not m:
        return res
    top, bottom, left, right = 0, len(m) - 1, 0, len(m[0]) - 1
    while top <= bottom and left <= right:
        res += [m[top][c] for c in range(left, right + 1)]; top += 1
        res += [m[r][right] for r in range(top, bottom + 1)]; right -= 1
        if top <= bottom:
            res += [m[bottom][c] for c in range(right, left - 1, -1)]; bottom -= 1
        if left <= right:
            res += [m[r][left] for r in range(bottom, top - 1, -1)]; left += 1
    return res

print(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`,
    output: `[1, 2, 3, 6, 9, 8, 7, 4, 5]`,
  },
  {
    q: "Coding: Merge overlapping intervals",
    level: 'Coding round',
    a: "I sort the intervals by start, then walk through them: if the current interval starts before the last merged one ends, I extend that end; otherwise I start a new interval. Sorting makes it O(n log n). I always ask whether touching intervals like [1, 4] and [4, 5] count as overlapping.",
    code: `def merge(intervals):
    merged = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))
print(merge([[1, 4], [4, 5]]))`,
    output: `[[1, 6], [8, 10], [15, 18]]
[[1, 5]]`,
  },
  {
    q: "Coding: Longest common prefix",
    level: 'Coding round',
    a: "I compare characters column by column across all words and stop at the first mismatch or the end of the shortest word. A neat trick is that only the min and max strings in sorted order matter, because they differ the most. zip(*words) also works well, since it stops at the shortest word.",
    code: `def lcp(words):
    if not words:
        return ""
    lo, hi = min(words), max(words)
    i = 0
    while i < len(lo) and lo[i] == hi[i]:
        i += 1
    return lo[:i]

print(lcp(["flower", "flow", "flight"]))
print(repr(lcp(["dog", "racecar", "car"])))`,
    output: `fl
''`,
  },
  {
    q: "Coding: Group anagrams",
    level: 'Coding round',
    a: "Anagrams have the same letters, so the sorted word works as a key in a defaultdict(list). Each word goes into the bucket for its key, which is O(n * k log k) for n words of length k. For long words I can use a 26-letter count tuple as the key instead of sorting.",
    code: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())

words = ["eat", "tea", "tan", "ate", "nat", "bat"]
for group in group_anagrams(words):
    print(group)`,
    output: `['eat', 'tea', 'ate']
['tan', 'nat']
['bat']`,
  },
  {
    q: "Coding: Implement an LRU cache",
    level: 'Coding round',
    a: "An LRU cache evicts the least recently used item when it is full. I use an OrderedDict: on get I move the key to the end, on put I insert or update it and move it to the end, and if size passes capacity I popitem(last=False) to drop the oldest. Both operations are O(1). In everyday code, functools.lru_cache does this for function results.",
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = OrderedDict()
    def get(self, key):
        if key in self.data:
            self.data.move_to_end(key)    # now the most recent
        return self.data.get(key, -1)
    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)   # drop the oldest

cache = LRUCache(2)
cache.put("a", 1)
cache.put("b", 2)
cache.get("a")
cache.put("c", 3)             # evicts b
print(list(cache.data))`,
    output: `['a', 'c']`,
  },
]
