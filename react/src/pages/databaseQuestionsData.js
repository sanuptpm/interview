// Database / SQL interview questions, basics to advanced.
// Each item: { q, a, code, output }. SQL outputs are the real results of
// running the code in a fresh in-memory SQLite database (sqlite3 CLI,
// .mode box); Python outputs are real python3 runs. Questions about
// PostgreSQL/MySQL/MongoDB/Redis-only features use illustrative output.

export const questions = [
  {
    q: "What is a database, a DBMS and an RDBMS?",
    level: 'Basics',
    a: "A database is an organized collection of data that I can store, query and update. A DBMS is the software that manages it, handling storage, security, concurrency and backups. An RDBMS is a DBMS that stores data in related tables with rows and columns and uses SQL, like PostgreSQL, MySQL or SQLite.",
    code: `-- An RDBMS keeps data in tables that relate to each other
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author_id INTEGER REFERENCES authors(id)
);
INSERT INTO authors VALUES (1, 'Orwell');
INSERT INTO books VALUES (1, '1984', 1), (2, 'Animal Farm', 1);

SELECT b.title, a.name AS author
FROM books b JOIN authors a ON a.id = b.author_id;`,
    output: `╭─────────────┬────────╮
│    title    │ author │
╞═════════════╪════════╡
│ 1984        │ Orwell │
│ Animal Farm │ Orwell │
╰─────────────┴────────╯`,
  },
  {
    q: "What is the difference between SQL and NoSQL databases?",
    level: 'Basics',
    a: "SQL databases are relational: they use a fixed schema, tables and joins, and give strong ACID guarantees, so I pick them for things like orders and payments. NoSQL databases (document, key-value, column, graph) have flexible schemas and are built to scale horizontally, which suits big, fast-changing or unstructured data. In practice I default to PostgreSQL and add NoSQL like Redis or MongoDB when a specific need shows up.",
    code: `-- SQL: fixed schema, every row has the same columns
CREATE TABLE users (id INT, name TEXT, email TEXT);
INSERT INTO users VALUES (1, 'Asha', 'asha@x.com');

-- NoSQL (MongoDB document): each document can differ
{ "_id": 1, "name": "Asha", "email": "asha@x.com" }
{ "_id": 2, "name": "Ravi", "phones": ["98..", "99.."],
  "address": { "city": "Kochi" } }`,
    output: `SQL                         NoSQL
--------------------------  ----------------------------
Tables, rows, columns       Documents, key-value, graph..
Fixed schema                Flexible schema
Joins across tables         Data often embedded/nested
Scales vertically (mostly)  Scales horizontally (sharding)
Strong ACID transactions    Often eventual consistency
PostgreSQL, MySQL, SQLite   MongoDB, Redis, Cassandra`,
  },
  {
    q: "What are tables, rows and columns?",
    level: 'Basics',
    a: "A table holds data about one kind of thing, like employees. Each column is an attribute with a data type, such as name or salary, and each row is one record, like one employee. I think of it like a spreadsheet, but with types and rules enforced by the database.",
    code: `CREATE TABLE employees (     -- table
  id     INTEGER,            -- column
  name   TEXT,               -- column
  salary INTEGER             -- column
);
INSERT INTO employees VALUES (1, 'Asha', 50000);  -- row
INSERT INTO employees VALUES (2, 'Ravi', 60000);  -- row

SELECT * FROM employees;`,
    output: `╭────┬──────┬────────╮
│ id │ name │ salary │
╞════╪══════╪════════╡
│  1 │ Asha │  50000 │
│  2 │ Ravi │  60000 │
╰────┴──────┴────────╯`,
  },
  {
    q: "What is a primary key?",
    level: 'Basics',
    a: "A primary key uniquely identifies each row in a table, so it must be unique and cannot be NULL. A table has only one primary key, though it can be made of several columns (a composite key). I usually use a surrogate integer or UUID id rather than something that can change, like an email.",
    code: `CREATE TABLE users (
  id    INTEGER PRIMARY KEY,
  email TEXT
);
INSERT INTO users VALUES (1, 'a@x.com');
INSERT INTO users VALUES (2, 'b@x.com');
INSERT INTO users VALUES (1, 'c@x.com');  -- duplicate id

SELECT * FROM users;`,
    output: `Error near line 7: UNIQUE constraint failed: users.id
╭────┬─────────╮
│ id │  email  │
╞════╪═════════╡
│  1 │ a@x.com │
│  2 │ b@x.com │
╰────┴─────────╯`,
  },
  {
    q: "What is a foreign key?",
    level: 'Basics',
    a: "A foreign key is a column that points to the primary key of another table, which is how I link related data, like an order to its customer. The database then refuses rows that point to something that doesn't exist, which protects referential integrity. Note that in SQLite I have to turn it on with PRAGMA foreign_keys = ON; PostgreSQL and MySQL (InnoDB) enforce it by default.",
    code: `PRAGMA foreign_keys = ON;
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  amount      INTEGER
);
INSERT INTO customers VALUES (1, 'Asha');
INSERT INTO orders VALUES (101, 1, 500);   -- ok
INSERT INTO orders VALUES (102, 99, 300);  -- customer 99 missing

SELECT * FROM orders;`,
    output: `Error near line 10: FOREIGN KEY constraint failed
╭─────┬─────────────┬────────╮
│ id  │ customer_id │ amount │
╞═════╪═════════════╪════════╡
│ 101 │           1 │    500 │
╰─────┴─────────────┴────────╯`,
  },
  {
    q: "What do UNIQUE, NOT NULL, CHECK and DEFAULT constraints do?",
    level: 'Basics',
    a: "UNIQUE stops duplicate values in a column, NOT NULL makes a value required, CHECK enforces a rule like price > 0, and DEFAULT fills in a value when I don't provide one. I like putting these rules in the database itself, because then bad data is blocked even if some app code forgets to validate.",
    code: `CREATE TABLE products (
  id     INTEGER PRIMARY KEY,
  sku    TEXT UNIQUE,
  name   TEXT NOT NULL,
  price  REAL CHECK (price > 0),
  status TEXT DEFAULT 'active'
);
INSERT INTO products (sku, name, price) VALUES ('P1', 'Pen', 10);
INSERT INTO products (sku, name, price) VALUES ('P1', 'Ink', 5);
INSERT INTO products (sku, name, price) VALUES ('P2', NULL, 5);
INSERT INTO products (sku, name, price) VALUES ('P3', 'Cup', -2);

SELECT * FROM products;`,
    output: `Error near line 9: UNIQUE constraint failed: products.sku
Error near line 10: NOT NULL constraint failed: products.name
Error near line 11: CHECK constraint failed: price > 0
╭────┬─────┬──────┬───────┬────────╮
│ id │ sku │ name │ price │ status │
╞════╪═════╪══════╪═══════╪════════╡
│  1 │ P1  │ Pen  │  10.0 │ active │
╰────┴─────┴──────┴───────┴────────╯`,
  },
  {
    q: "What are common SQL data types?",
    level: 'Basics',
    a: "The common ones are INTEGER/BIGINT for whole numbers, DECIMAL/NUMERIC for exact money values, REAL/FLOAT for approximate numbers, VARCHAR/TEXT for strings, BOOLEAN, DATE/TIMESTAMP for time, and JSON in PostgreSQL and MySQL. SQLite is flexible and stores values in just five storage classes, which typeof() shows. A tip: I never store money as FLOAT; I use DECIMAL or integer cents.",
    code: `CREATE TABLE demo (
  qty   INTEGER,
  price REAL,
  name  TEXT,
  data  BLOB,
  note  TEXT
);
INSERT INTO demo VALUES (3, 9.99, 'Pen', x'CAFE', NULL);

SELECT typeof(qty), typeof(price), typeof(name),
       typeof(data), typeof(note)
FROM demo;`,
    output: `╭─────────────┬───────────────┬──────────────┬──────────────┬──────────────╮
│ typeof(qty) │ typeof(price) │ typeof(name) │ typeof(data) │ typeof(note) │
╞═════════════╪═══════════════╪══════════════╪══════════════╪══════════════╡
│ integer     │ real          │ text         │ blob         │ null         │
╰─────────────┴───────────────┴──────────────┴──────────────┴──────────────╯`,
  },
  {
    q: "How do you do CRUD operations in SQL?",
    level: 'Basics',
    a: "CRUD maps to four statements: INSERT to create, SELECT to read, UPDATE to change and DELETE to remove rows. The key tip is to always write a WHERE clause on UPDATE and DELETE, because without it every row in the table is changed or deleted. I often run the same WHERE as a SELECT first to check what I'm about to touch.",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, city TEXT);

INSERT INTO users (name, city) VALUES ('Asha', 'Kochi'),
                                      ('Ravi', 'Pune'),
                                      ('Meera', 'Delhi');
UPDATE users SET city = 'Mumbai' WHERE name = 'Ravi';
DELETE FROM users WHERE name = 'Meera';

SELECT * FROM users;`,
    output: `╭────┬──────┬────────╮
│ id │ name │  city  │
╞════╪══════╪════════╡
│  1 │ Asha │ Kochi  │
│  2 │ Ravi │ Mumbai │
╰────┴──────┴────────╯`,
  },
  {
    q: "How do WHERE, ORDER BY and LIMIT work in a SELECT?",
    level: 'Basics',
    a: "WHERE filters which rows come back, ORDER BY sorts them (ASC by default, DESC for reverse) and LIMIT caps how many I get, with OFFSET to skip rows for paging. Without ORDER BY the row order is not guaranteed, so I always add it when using LIMIT. For deep pages I prefer keyset paging (WHERE id > last_id) over big OFFSETs, which get slow.",
    code: `CREATE TABLE employees (name TEXT, dept TEXT, salary INT);
INSERT INTO employees VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'HR', 40000),
  ('Meera', 'IT', 90000), ('John', 'IT', 50000),
  ('Sara', 'Sales', 60000);

SELECT name, salary
FROM employees
WHERE dept = 'IT'
ORDER BY salary DESC
LIMIT 2;`,
    output: `╭───────┬────────╮
│ name  │ salary │
╞═══════╪════════╡
│ Meera │  90000 │
│ Asha  │  70000 │
╰───────┴────────╯`,
  },
  {
    q: "What does DISTINCT do?",
    level: 'Basics',
    a: "DISTINCT removes duplicate rows from the result, so I get each unique value or combination of values once. It applies to the whole selected row, not just the first column. I can also use COUNT(DISTINCT col) to count unique values.",
    code: `CREATE TABLE orders (customer TEXT, city TEXT);
INSERT INTO orders VALUES ('Asha', 'Kochi'), ('Ravi', 'Pune'),
  ('Asha', 'Kochi'), ('Meera', 'Kochi');

SELECT DISTINCT city FROM orders;

SELECT COUNT(*) AS total_orders,
       COUNT(DISTINCT customer) AS unique_customers
FROM orders;`,
    output: `╭───────╮
│ city  │
╞═══════╡
│ Kochi │
│ Pune  │
╰───────╯

╭──────────────┬──────────────────╮
│ total_orders │ unique_customers │
╞══════════════╪══════════════════╡
│            4 │                3 │
╰──────────────┴──────────────────╯`,
  },
  {
    q: "How do LIKE, IN and BETWEEN work?",
    level: 'Basics',
    a: "LIKE matches text patterns, where % means any number of characters and _ means exactly one. IN checks a value against a list, which is cleaner than many ORs, and BETWEEN checks a range and includes both ends. One tip: LIKE '%abc' with a leading wildcard can't use a normal index, so it can be slow on big tables.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Arun', 'HR', 40000),
  ('Meera', 'Sales', 55000), ('Ravi', 'IT', 50000);

SELECT name FROM emp WHERE name LIKE 'A%';

SELECT name, dept FROM emp WHERE dept IN ('HR', 'Sales');

SELECT name, salary FROM emp WHERE salary BETWEEN 50000 AND 70000;`,
    output: `╭──────╮
│ name │
╞══════╡
│ Asha │
│ Arun │
╰──────╯

╭───────┬───────╮
│ name  │ dept  │
╞═══════╪═══════╡
│ Arun  │ HR    │
│ Meera │ Sales │
╰───────┴───────╯

╭───────┬────────╮
│ name  │ salary │
╞═══════╪════════╡
│ Asha  │  70000 │
│ Meera │  55000 │
│ Ravi  │  50000 │
╰───────┴────────╯`,
  },
  {
    q: "How do you handle NULL values in SQL?",
    level: 'Basics',
    a: "NULL means 'unknown or missing', so it isn't equal to anything, not even another NULL; that's why = NULL never matches and I must use IS NULL or IS NOT NULL. COALESCE returns the first non-NULL value, which I use to show defaults. Also, aggregates like AVG skip NULLs, and any arithmetic with NULL gives NULL.",
    code: `CREATE TABLE emp (name TEXT, bonus INT);
INSERT INTO emp VALUES ('Asha', 500), ('Ravi', NULL), ('Meera', 300);

SELECT name FROM emp WHERE bonus = NULL;    -- returns nothing!
SELECT name FROM emp WHERE bonus IS NULL;

SELECT name, COALESCE(bonus, 0) AS bonus,
       bonus + 100 AS plus_100
FROM emp;`,
    output: `╭──────╮
│ name │
╞══════╡
│ Ravi │
╰──────╯

╭───────┬───────┬──────────╮
│ name  │ bonus │ plus_100 │
╞═══════╪═══════╪══════════╡
│ Asha  │   500 │      600 │
│ Ravi  │     0 │          │
│ Meera │   300 │      400 │
╰───────┴───────┴──────────╯`,
  },
  {
    q: "What are aliases in SQL?",
    level: 'Basics',
    a: "An alias is a temporary name I give to a column or table with AS. Column aliases make results readable, like total_salary instead of SUM(salary), and table aliases keep joins short. In most databases I can't use a column alias in WHERE because WHERE runs before SELECT, but I can use it in ORDER BY.",
    code: `CREATE TABLE employees (name TEXT, salary INT);
INSERT INTO employees VALUES ('Asha', 50000), ('Ravi', 60000);

SELECT e.name AS employee,
       e.salary * 12 AS yearly_salary
FROM employees AS e
ORDER BY yearly_salary DESC;`,
    output: `╭──────────┬───────────────╮
│ employee │ yearly_salary │
╞══════════╪═══════════════╡
│ Ravi     │        720000 │
│ Asha     │        600000 │
╰──────────┴───────────────╯`,
  },
  {
    q: "What is the difference between DDL, DML, DCL and TCL?",
    level: 'Basics',
    a: "DDL (Data Definition Language) defines structure: CREATE, ALTER, DROP, TRUNCATE. DML (Data Manipulation Language) works with the data: SELECT, INSERT, UPDATE, DELETE. DCL (Data Control Language) handles permissions with GRANT and REVOKE, and TCL (Transaction Control Language) manages transactions with COMMIT, ROLLBACK and SAVEPOINT.",
    code: `-- DDL: structure
CREATE TABLE t (id INT);
ALTER TABLE t ADD COLUMN name TEXT;
DROP TABLE t;

-- DML: data
INSERT INTO t VALUES (1, 'a');
UPDATE t SET name = 'b' WHERE id = 1;
SELECT * FROM t;
DELETE FROM t WHERE id = 1;

-- DCL: permissions (PostgreSQL / MySQL)
GRANT SELECT ON t TO report_user;
REVOKE SELECT ON t FROM report_user;

-- TCL: transactions
BEGIN; ... SAVEPOINT s1; ... ROLLBACK TO s1; COMMIT;`,
    output: `Type  Purpose            Commands
----  -----------------  -------------------------------
DDL   Define structure   CREATE, ALTER, DROP, TRUNCATE
DML   Work with data     SELECT, INSERT, UPDATE, DELETE
DCL   Control access     GRANT, REVOKE
TCL   Transactions       BEGIN, COMMIT, ROLLBACK,
                         SAVEPOINT`,
  },
  {
    q: "What is the difference between DELETE, TRUNCATE and DROP?",
    level: 'Basics',
    a: "DELETE removes rows, can have a WHERE, fires triggers and can be rolled back. TRUNCATE (PostgreSQL/MySQL) removes all rows very fast without scanning them, but keeps the table; SQLite doesn't have TRUNCATE and instead optimizes DELETE without WHERE. DROP removes the whole table, structure and data, so I double-check before running it.",
    code: `CREATE TABLE logs (id INT, msg TEXT);
INSERT INTO logs VALUES (1, 'a'), (2, 'b'), (3, 'c');

DELETE FROM logs WHERE id = 1;          -- remove some rows
SELECT COUNT(*) AS after_delete FROM logs;

DELETE FROM logs;                       -- SQLite's "TRUNCATE"
SELECT COUNT(*) AS after_delete_all FROM logs;

DROP TABLE logs;                        -- table is gone
SELECT * FROM logs;`,
    output: `╭──────────────╮
│ after_delete │
╞══════════════╡
│            2 │
╰──────────────╯

╭──────────────────╮
│ after_delete_all │
╞══════════════════╡
│                0 │
╰──────────────────╯

Parse error near line 11: no such table: logs`,
  },
  {
    q: "What are aggregate functions?",
    level: 'Intermediate',
    a: "Aggregate functions take many rows and return one value: COUNT, SUM, AVG, MIN and MAX are the common ones. COUNT(*) counts all rows while COUNT(col) skips NULLs, which is a common interview trap. I usually combine them with GROUP BY to get one result per group.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

SELECT COUNT(*)    AS employees,
       SUM(salary) AS total,
       AVG(salary) AS average,
       MIN(salary) AS lowest,
       MAX(salary) AS highest
FROM emp;`,
    output: `╭───────────┬────────┬─────────┬────────┬─────────╮
│ employees │ total  │ average │ lowest │ highest │
╞═══════════╪════════╪═════════╪════════╪═════════╡
│         5 │ 265000 │ 53000.0 │  40000 │   70000 │
╰───────────┴────────┴─────────┴────────┴─────────╯`,
  },
  {
    q: "How does GROUP BY work?",
    level: 'Intermediate',
    a: "GROUP BY collapses rows with the same value into one group, and then aggregates run per group. Every column in the SELECT must either be in the GROUP BY or inside an aggregate. I use it for reports like 'headcount and average salary per department'.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

SELECT dept,
       COUNT(*)    AS headcount,
       AVG(salary) AS avg_salary
FROM emp
GROUP BY dept
ORDER BY dept;`,
    output: `╭───────┬───────────┬────────────╮
│ dept  │ headcount │ avg_salary │
╞═══════╪═══════════╪════════════╡
│ HR    │         2 │    42500.0 │
│ IT    │         2 │    60000.0 │
│ Sales │         1 │    60000.0 │
╰───────┴───────────┴────────────╯`,
  },
  {
    q: "What is the difference between WHERE and HAVING?",
    level: 'Intermediate',
    a: "WHERE filters individual rows before grouping, and HAVING filters groups after the aggregation. So I can't use SUM or COUNT in WHERE, but I can in HAVING. For performance I filter as much as possible in WHERE first, so fewer rows get grouped.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

SELECT dept, SUM(salary) AS total
FROM emp
WHERE salary > 42000        -- row filter (before grouping)
GROUP BY dept
HAVING SUM(salary) > 50000  -- group filter (after grouping)
ORDER BY dept;`,
    output: `╭───────┬────────╮
│ dept  │ total  │
╞═══════╪════════╡
│ IT    │ 120000 │
│ Sales │  60000 │
╰───────┴────────╯`,
  },
  {
    q: "What is an INNER JOIN?",
    level: 'Intermediate',
    a: "An INNER JOIN returns only the rows that have a match in both tables based on the join condition. Rows without a match on either side are dropped, so here Meera (no department) and Sales (no employees) don't appear. It's the most common join and plain JOIN means INNER JOIN.",
    code: `CREATE TABLE emp (id INT, name TEXT, dept_id INT);
CREATE TABLE dept (id INT, dept_name TEXT);
INSERT INTO emp VALUES (1, 'Asha', 10), (2, 'Ravi', 20),
                       (3, 'Meera', NULL);
INSERT INTO dept VALUES (10, 'IT'), (20, 'HR'), (30, 'Sales');

SELECT e.name, d.dept_name
FROM emp e
INNER JOIN dept d ON e.dept_id = d.id;`,
    output: `╭──────┬───────────╮
│ name │ dept_name │
╞══════╪═══════════╡
│ Asha │ IT        │
│ Ravi │ HR        │
╰──────┴───────────╯`,
  },
  {
    q: "What is a LEFT JOIN?",
    level: 'Intermediate',
    a: "A LEFT JOIN returns every row from the left table and the matching rows from the right table, filling NULL when there is no match. I use it when I must keep all the main records, like all employees even without a department. Adding WHERE right.id IS NULL turns it into a 'find rows with no match' query.",
    code: `CREATE TABLE emp (id INT, name TEXT, dept_id INT);
CREATE TABLE dept (id INT, dept_name TEXT);
INSERT INTO emp VALUES (1, 'Asha', 10), (2, 'Ravi', 20),
                       (3, 'Meera', NULL);
INSERT INTO dept VALUES (10, 'IT'), (20, 'HR'), (30, 'Sales');

SELECT e.name, d.dept_name
FROM emp e
LEFT JOIN dept d ON e.dept_id = d.id;`,
    output: `╭───────┬───────────╮
│ name  │ dept_name │
╞═══════╪═══════════╡
│ Asha  │ IT        │
│ Ravi  │ HR        │
│ Meera │           │
╰───────┴───────────╯`,
  },
  {
    q: "What is a RIGHT JOIN?",
    level: 'Intermediate',
    a: "A RIGHT JOIN is the mirror of a LEFT JOIN: it keeps every row from the right table and fills NULLs on the left when there's no match. In practice I usually just swap the table order and write a LEFT JOIN because it reads more naturally. SQLite supports RIGHT and FULL joins only since version 3.39.",
    code: `CREATE TABLE emp (id INT, name TEXT, dept_id INT);
CREATE TABLE dept (id INT, dept_name TEXT);
INSERT INTO emp VALUES (1, 'Asha', 10), (2, 'Ravi', 20),
                       (3, 'Meera', NULL);
INSERT INTO dept VALUES (10, 'IT'), (20, 'HR'), (30, 'Sales');

SELECT e.name, d.dept_name
FROM emp e
RIGHT JOIN dept d ON e.dept_id = d.id;`,
    output: `╭──────┬───────────╮
│ name │ dept_name │
╞══════╪═══════════╡
│ Asha │ IT        │
│ Ravi │ HR        │
│      │ Sales     │
╰──────┴───────────╯`,
  },
  {
    q: "What is a FULL OUTER JOIN?",
    level: 'Intermediate',
    a: "A FULL OUTER JOIN returns all rows from both tables, matching where it can and filling NULLs on whichever side has no match. It's useful for reconciliation, like comparing two lists to see what's missing on each side. PostgreSQL and SQLite 3.39+ support it, but MySQL doesn't, so there I combine a LEFT JOIN and a RIGHT JOIN with UNION.",
    code: `CREATE TABLE emp (id INT, name TEXT, dept_id INT);
CREATE TABLE dept (id INT, dept_name TEXT);
INSERT INTO emp VALUES (1, 'Asha', 10), (2, 'Ravi', 20),
                       (3, 'Meera', NULL);
INSERT INTO dept VALUES (10, 'IT'), (20, 'HR'), (30, 'Sales');

SELECT e.name, d.dept_name
FROM emp e
FULL OUTER JOIN dept d ON e.dept_id = d.id;`,
    output: `╭───────┬───────────╮
│ name  │ dept_name │
╞═══════╪═══════════╡
│ Asha  │ IT        │
│ Ravi  │ HR        │
│ Meera │           │
│       │ Sales     │
╰───────┴───────────╯`,
  },
  {
    q: "What is a CROSS JOIN?",
    level: 'Intermediate',
    a: "A CROSS JOIN returns every combination of rows from the two tables, the Cartesian product, so 3 rows times 2 rows gives 6 rows. I use it on purpose to generate combinations, like every size with every color. I'm careful with it on big tables because the result grows very fast.",
    code: `CREATE TABLE sizes (size TEXT);
CREATE TABLE colors (color TEXT);
INSERT INTO sizes VALUES ('S'), ('M'), ('L');
INSERT INTO colors VALUES ('Red'), ('Blue');

SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c
ORDER BY s.size, c.color;`,
    output: `╭──────┬───────╮
│ size │ color │
╞══════╪═══════╡
│ L    │ Blue  │
│ L    │ Red   │
│ M    │ Blue  │
│ M    │ Red   │
│ S    │ Blue  │
│ S    │ Red   │
╰──────┴───────╯`,
  },
  {
    q: "What is a SELF JOIN?",
    level: 'Intermediate',
    a: "A SELF JOIN joins a table to itself, using two different aliases so I can compare rows within the same table. The classic example is an employees table where manager_id points to another employee's id. I use a LEFT self join so the top boss, who has no manager, still shows up.",
    code: `CREATE TABLE emp (id INT, name TEXT, manager_id INT);
INSERT INTO emp VALUES (1, 'Asha', NULL), (2, 'Ravi', 1),
                       (3, 'Meera', 1), (4, 'John', 2);

SELECT e.name AS employee, m.name AS manager
FROM emp e
LEFT JOIN emp m ON e.manager_id = m.id;`,
    output: `╭──────────┬─────────╮
│ employee │ manager │
╞══════════╪═════════╡
│ Asha     │         │
│ Ravi     │ Asha    │
│ Meera    │ Asha    │
│ John     │ Ravi    │
╰──────────┴─────────╯`,
  },
  {
    q: "What is the difference between UNION and UNION ALL?",
    level: 'Intermediate',
    a: "Both stack the results of two queries with the same number and types of columns. UNION removes duplicates, which needs an extra sort or hash step, while UNION ALL keeps every row and is faster. I use UNION ALL by default unless I actually need duplicates removed.",
    code: `CREATE TABLE online (customer TEXT);
CREATE TABLE store (customer TEXT);
INSERT INTO online VALUES ('Asha'), ('Ravi');
INSERT INTO store VALUES ('Ravi'), ('Meera');

SELECT customer FROM online
UNION
SELECT customer FROM store;

SELECT customer FROM online
UNION ALL
SELECT customer FROM store;`,
    output: `╭──────────╮
│ customer │
╞══════════╡
│ Asha     │
│ Meera    │
│ Ravi     │
╰──────────╯

╭──────────╮
│ customer │
╞══════════╡
│ Asha     │
│ Ravi     │
│ Ravi     │
│ Meera    │
╰──────────╯`,
  },
  {
    q: "What is a subquery and a correlated subquery?",
    level: 'Intermediate',
    a: "A subquery is a query inside another query; a normal one runs once and its result is used by the outer query. A correlated subquery refers to columns of the outer query, so logically it runs once per outer row, like comparing each employee to their own department's average. Correlated subqueries can be slow on big tables, so I often rewrite them with a JOIN or a window function.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

-- Subquery: earns more than the company average
SELECT name, salary FROM emp
WHERE salary > (SELECT AVG(salary) FROM emp);

-- Correlated: earns more than THEIR department's average
SELECT name, dept, salary FROM emp e
WHERE salary > (SELECT AVG(salary) FROM emp
                WHERE dept = e.dept);`,
    output: `╭──────┬────────╮
│ name │ salary │
╞══════╪════════╡
│ Asha │  70000 │
│ Sara │  60000 │
╰──────┴────────╯

╭──────┬──────┬────────╮
│ name │ dept │ salary │
╞══════╪══════╪════════╡
│ Asha │ IT   │  70000 │
│ John │ HR   │  45000 │
╰──────┴──────┴────────╯`,
  },
  {
    q: "What does EXISTS do?",
    level: 'Intermediate',
    a: "EXISTS returns true if the subquery returns at least one row, and it can stop as soon as it finds one, so it's efficient for 'is there any…' checks. NOT EXISTS is my go-to for 'customers with no orders', because unlike NOT IN it behaves correctly when the subquery contains NULLs.",
    code: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'), (3, 'Meera');
INSERT INTO orders VALUES (100, 1), (101, 1), (102, 3);

SELECT name AS has_orders FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

SELECT name AS no_orders FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    output: `╭────────────╮
│ has_orders │
╞════════════╡
│ Asha       │
│ Meera      │
╰────────────╯

╭───────────╮
│ no_orders │
╞═══════════╡
│ Ravi      │
╰───────────╯`,
  },
  {
    q: "How does CASE WHEN work?",
    level: 'Intermediate',
    a: "CASE WHEN is SQL's if/else: it checks conditions in order and returns the value for the first one that's true, or the ELSE value. I use it to label data, like salary bands, and inside aggregates for pivot-style counts such as SUM(CASE WHEN ... THEN 1 ELSE 0 END).",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

SELECT name, salary,
  CASE
    WHEN salary >= 60000 THEN 'High'
    WHEN salary >= 45000 THEN 'Medium'
    ELSE 'Low'
  END AS band
FROM emp;

SELECT SUM(CASE WHEN dept = 'IT' THEN 1 ELSE 0 END) AS it_count,
       SUM(CASE WHEN dept = 'HR' THEN 1 ELSE 0 END) AS hr_count
FROM emp;`,
    output: `╭───────┬────────┬────────╮
│ name  │ salary │  band  │
╞═══════╪════════╪════════╡
│ Asha  │  70000 │ High   │
│ Ravi  │  50000 │ Medium │
│ Meera │  40000 │ Low    │
│ John  │  45000 │ Medium │
│ Sara  │  60000 │ High   │
╰───────┴────────┴────────╯

╭──────────┬──────────╮
│ it_count │ hr_count │
╞══════════╪══════════╡
│        2 │        2 │
╰──────────┴──────────╯`,
  },
  {
    q: "What is a view?",
    level: 'Intermediate',
    a: "A view is a saved SELECT query that I can use like a table. It doesn't store data itself, so it always shows current data, and it's great for hiding complex joins or exposing only some columns for security. If I need the result stored for speed, PostgreSQL has materialized views, which I refresh on a schedule.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES
  ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000),
  ('Sara', 'Sales', 60000);

CREATE VIEW dept_summary AS
SELECT dept, COUNT(*) AS headcount, MAX(salary) AS top_salary
FROM emp GROUP BY dept;

INSERT INTO emp VALUES ('Kiran', 'Sales', 65000);

SELECT * FROM dept_summary ORDER BY dept;   -- includes Kiran`,
    output: `╭───────┬───────────┬────────────╮
│ dept  │ headcount │ top_salary │
╞═══════╪═══════════╪════════════╡
│ HR    │         2 │      45000 │
│ IT    │         2 │      70000 │
│ Sales │         2 │      65000 │
╰───────┴───────────┴────────────╯`,
  },
  {
    q: "What is an index and how do you check if a query uses it?",
    level: 'Intermediate',
    a: "An index is like a book's index: instead of scanning every page, the database jumps straight to the matching rows, usually through a B-tree. I add indexes on columns I filter, join or sort on, but not on every column, because each index slows down inserts and updates and uses space. I verify with EXPLAIN QUERY PLAN in SQLite or EXPLAIN ANALYZE in PostgreSQL to see a SCAN become a SEARCH.",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, city TEXT);

EXPLAIN QUERY PLAN
SELECT * FROM users WHERE email = 'a@x.com';

CREATE INDEX idx_users_email ON users(email);

EXPLAIN QUERY PLAN
SELECT * FROM users WHERE email = 'a@x.com';`,
    output: `QUERY PLAN
\`--SCAN users

QUERY PLAN
\`--SEARCH users USING INDEX idx_users_email (email=?)`,
  },
  {
    q: "What is normalization? Explain 1NF, 2NF and 3NF.",
    level: 'Intermediate',
    a: "Normalization means organizing tables to remove duplicate data and update anomalies. 1NF: every column holds one atomic value, no lists. 2NF: in tables with a composite key, every column depends on the whole key, not part of it. 3NF: non-key columns depend only on the key, not on other non-key columns, like dept_name depending on dept_id. I usually design to 3NF and denormalize only where reads need it.",
    code: `-- NOT 1NF: many values in one column
orders(order_id, customer, products = 'Pen, Ink, Cup')

-- 1NF: one value per cell
order_items(order_id, product)

-- NOT 2NF: key is (order_id, product_id), but
-- product_name depends only on product_id
order_items(order_id, product_id, product_name, qty)

-- 2NF: split it out
order_items(order_id, product_id, qty)
products(product_id, product_name)

-- NOT 3NF: dept_name depends on dept_id, not on emp_id
employees(emp_id, name, dept_id, dept_name)

-- 3NF
employees(emp_id, name, dept_id)
departments(dept_id, dept_name)`,
    output: `Form  Rule                                Fixes
----  ----------------------------------  -------------------
1NF   Atomic values, no repeating groups  Lists in a cell
2NF   1NF + no partial dependency on a    Data repeated per
      composite key                       part of the key
3NF   2NF + no transitive dependency      Non-key column
      (non-key -> non-key)                depending on another

Result: each fact is stored once, so updating a
department name means changing exactly one row.`,
  },
  {
    q: "What is denormalization and when would you use it?",
    level: 'Intermediate',
    a: "Denormalization means intentionally adding redundant data, like storing customer_name on orders or a precomputed order_total, so reads need fewer joins or calculations. I use it for read-heavy features like dashboards and reports, accepting that writes become more complex because I must keep the copies in sync. I only do it after measuring that the normalized query is actually too slow.",
    code: `-- Normalized: total computed with a join + SUM each time
CREATE TABLE orders (id INT, customer TEXT);
CREATE TABLE order_items (order_id INT, price INT, qty INT);
INSERT INTO orders VALUES (1, 'Asha');
INSERT INTO order_items VALUES (1, 100, 2), (1, 50, 1);

SELECT o.id, o.customer, SUM(i.price * i.qty) AS total
FROM orders o JOIN order_items i ON i.order_id = o.id
GROUP BY o.id;

-- Denormalized: total stored on the order (fast reads)
ALTER TABLE orders ADD COLUMN total INT;
UPDATE orders SET total = 250 WHERE id = 1;
SELECT id, customer, total FROM orders;`,
    output: `╭────┬──────────┬───────╮
│ id │ customer │ total │
╞════╪══════════╪═══════╡
│  1 │ Asha     │   250 │
╰────┴──────────┴───────╯

╭────┬──────────┬───────╮
│ id │ customer │ total │
╞════╪══════════╪═══════╡
│  1 │ Asha     │   250 │
╰────┴──────────┴───────╯`,
  },
  {
    q: "What is a transaction and what does ACID mean?",
    level: 'Intermediate',
    a: "A transaction groups several statements into one all-or-nothing unit, with BEGIN, COMMIT and ROLLBACK. ACID means Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don't see each other's half-done work) and Durability (once committed, it survives a crash). The classic example is a bank transfer: debit and credit must both happen or neither.",
    code: `CREATE TABLE accounts (name TEXT, balance INT CHECK (balance >= 0));
INSERT INTO accounts VALUES ('Asha', 100), ('Ravi', 50);

-- Transfer 30: both updates commit together
BEGIN;
UPDATE accounts SET balance = balance - 30 WHERE name = 'Asha';
UPDATE accounts SET balance = balance + 30 WHERE name = 'Ravi';
COMMIT;
SELECT * FROM accounts;

-- Transfer that we cancel: nothing changes
BEGIN;
UPDATE accounts SET balance = balance - 70 WHERE name = 'Asha';
ROLLBACK;
SELECT * FROM accounts;`,
    output: `╭──────┬─────────╮
│ name │ balance │
╞══════╪═════════╡
│ Asha │      70 │
│ Ravi │      80 │
╰──────┴─────────╯

╭──────┬─────────╮
│ name │ balance │
╞══════╪═════════╡
│ Asha │      70 │
│ Ravi │      80 │
╰──────┴─────────╯`,
  },
  {
    q: "What are isolation levels and the read anomalies they prevent?",
    level: 'Intermediate',
    a: "Isolation levels decide how much concurrent transactions can see of each other. Read Uncommitted allows dirty reads; Read Committed (PostgreSQL's default) stops dirty reads; Repeatable Read (MySQL InnoDB's default) also stops non-repeatable reads; Serializable behaves as if transactions ran one at a time and stops phantoms too. Higher levels are safer but cause more locking or retries, so I use Serializable only for critical logic and handle retry errors.",
    code: `-- PostgreSQL / MySQL
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT balance FROM accounts WHERE id = 1;  -- 100
-- another transaction updates it to 50 and commits
SELECT balance FROM accounts WHERE id = 1;  -- still 100 here
COMMIT;

-- Anomalies:
-- Dirty read:          read data another txn hasn't committed
-- Non-repeatable read: same row read twice gives new value
-- Phantom read:        same query returns new/missing rows`,
    output: `Level             Dirty   Non-repeatable  Phantom
----------------  ------  --------------  --------
Read Uncommitted  yes     yes             yes
Read Committed    no      yes             yes
Repeatable Read   no      no              yes*
Serializable      no      no              no

* PostgreSQL's Repeatable Read also prevents phantoms.
  SQLite transactions are always Serializable.`,
  },
  {
    q: "How does ON DELETE CASCADE work?",
    level: 'Intermediate',
    a: "ON DELETE CASCADE on a foreign key means that when a parent row is deleted, its child rows are deleted automatically, like deleting a user also removes their orders. Other options are RESTRICT (block the delete), SET NULL and SET DEFAULT. I use CASCADE for truly owned data and RESTRICT for important records like payments; in SQLite foreign keys need PRAGMA foreign_keys = ON.",
    code: `PRAGMA foreign_keys = ON;
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (
  id      INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO users VALUES (1, 'Asha'), (2, 'Ravi');
INSERT INTO orders VALUES (101, 1), (102, 1), (103, 2);

DELETE FROM users WHERE id = 1;   -- Asha's orders go too

SELECT * FROM orders;`,
    output: `╭─────┬─────────╮
│ id  │ user_id │
╞═════╪═════════╡
│ 103 │       2 │
╰─────┴─────────╯`,
  },
  {
    q: "What are window functions? Explain ROW_NUMBER, RANK and DENSE_RANK.",
    level: 'Advanced',
    a: "Window functions compute a value across related rows without collapsing them like GROUP BY does, using OVER (PARTITION BY ... ORDER BY ...). ROW_NUMBER gives a unique sequence, RANK gives ties the same number and then skips, and DENSE_RANK gives ties the same number without gaps. I reach for them for rankings, top-N per group and comparisons with previous rows.",
    code: `CREATE TABLE emp (name TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 90000), ('Ravi', 80000),
  ('Meera', 80000), ('John', 70000);

SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK()       OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM emp;`,
    output: `╭───────┬────────┬─────────┬─────┬───────────╮
│ name  │ salary │ row_num │ rnk │ dense_rnk │
╞═══════╪════════╪═════════╪═════╪═══════════╡
│ Asha  │  90000 │       1 │   1 │         1 │
│ Ravi  │  80000 │       2 │   2 │         2 │
│ Meera │  80000 │       3 │   2 │         2 │
│ John  │  70000 │       4 │   4 │         3 │
╰───────┴────────┴─────────┴─────┴───────────╯`,
  },
  {
    q: "How do you use LAG and LEAD?",
    level: 'Advanced',
    a: "LAG reads a value from a previous row and LEAD from a following row, within the window's order. I use them for things like day-over-day change or finding gaps, without a self join. The first row has no previous row, so LAG returns NULL there unless I pass a default.",
    code: `CREATE TABLE sales (day TEXT, amount INT);
INSERT INTO sales VALUES ('Mon', 100), ('Tue', 150),
  ('Wed', 120), ('Thu', 200);

SELECT day, amount,
  LAG(amount)  OVER (ORDER BY rowid) AS prev_day,
  amount - LAG(amount) OVER (ORDER BY rowid) AS change,
  LEAD(amount) OVER (ORDER BY rowid) AS next_day
FROM sales;`,
    output: `╭─────┬────────┬──────────┬────────┬──────────╮
│ day │ amount │ prev_day │ change │ next_day │
╞═════╪════════╪══════════╪════════╪══════════╡
│ Mon │    100 │          │        │      150 │
│ Tue │    150 │      100 │     50 │      120 │
│ Wed │    120 │      150 │    -30 │      200 │
│ Thu │    200 │      120 │     80 │          │
╰─────┴────────┴──────────┴────────┴──────────╯`,
  },
  {
    q: "What is a CTE and a recursive CTE?",
    level: 'Advanced',
    a: "A CTE (Common Table Expression) is a named temporary result defined with WITH, which makes long queries readable, step by step. A recursive CTE refers to itself, with a starting query UNION ALL a recursive part, so I can walk hierarchies like an org chart or category tree. I always make sure the recursion has a stop condition.",
    code: `CREATE TABLE emp (id INT, name TEXT, manager_id INT);
INSERT INTO emp VALUES (1, 'CEO', NULL), (2, 'CTO', 1),
  (3, 'Dev Lead', 2), (4, 'Developer', 3), (5, 'CFO', 1);

WITH RECURSIVE chain(id, name, level) AS (
  SELECT id, name, 0 FROM emp WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, c.level + 1
  FROM emp e JOIN chain c ON e.manager_id = c.id
)
SELECT substr('        ', 1, level * 2) || name AS org_chart, level
FROM chain ORDER BY level, id;`,
    output: `╭─────────────────┬───────╮
│    org_chart    │ level │
╞═════════════════╪═══════╡
│ CEO             │     0 │
│   CTO           │     1 │
│   CFO           │     1 │
│     Dev Lead    │     2 │
│       Developer │     3 │
╰─────────────────┴───────╯`,
  },
  {
    q: "What is a trigger?",
    level: 'Advanced',
    a: "A trigger is code the database runs automatically before or after an INSERT, UPDATE or DELETE on a table. I use them for audit logs or keeping an updated_at column current. I keep triggers small, because hidden logic in triggers makes the system harder to debug.",
    code: `CREATE TABLE products (id INT, price INT);
CREATE TABLE price_log (product_id INT, old_price INT, new_price INT);

CREATE TRIGGER log_price_change
AFTER UPDATE OF price ON products
BEGIN
  INSERT INTO price_log VALUES (OLD.id, OLD.price, NEW.price);
END;

INSERT INTO products VALUES (1, 100);
UPDATE products SET price = 120 WHERE id = 1;
UPDATE products SET price = 90 WHERE id = 1;

SELECT * FROM price_log;`,
    output: `╭────────────┬───────────┬───────────╮
│ product_id │ old_price │ new_price │
╞════════════╪═══════════╪═══════════╡
│          1 │       100 │       120 │
│          1 │       120 │        90 │
╰────────────┴───────────┴───────────╯`,
  },
  {
    q: "What is the difference between a stored procedure and a function?",
    level: 'Advanced',
    a: "A stored procedure is a saved program in the database that can run many statements, change data and manage transactions; I call it with CALL or EXEC. A function returns a value and can be used inside a SELECT, and is usually meant for computing rather than changing data. SQLite has neither, so this example is PostgreSQL; I use them for heavy data logic close to the data, but keep most business logic in the app so it's easier to test and version.",
    code: `-- PostgreSQL function: returns a value, usable in SELECT
CREATE FUNCTION add_tax(amount NUMERIC) RETURNS NUMERIC AS $$
  SELECT amount * 1.18;
$$ LANGUAGE sql;

SELECT add_tax(100);

-- PostgreSQL procedure: does work, can COMMIT
CREATE PROCEDURE give_raise(p_dept TEXT, pct NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE emp SET salary = salary * (1 + pct / 100)
  WHERE dept = p_dept;
  COMMIT;
END;
$$;

CALL give_raise('IT', 10);`,
    output: `SELECT add_tax(100);
 add_tax
---------
  118.00

CALL give_raise('IT', 10);
CALL

Procedure: CALL it, can change data and commit
Function:  returns a value, usable inside SELECT`,
  },
  {
    q: "How do you optimize a slow SQL query?",
    level: 'Advanced',
    a: "First I measure with EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) to see if it's doing full table scans. Then the usual fixes: add indexes on filter and join columns, select only the columns I need instead of SELECT *, avoid wrapping indexed columns in functions in WHERE, and paginate large results. A composite index can even cover the whole query so the table isn't touched at all.",
    code: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INT,
                     status TEXT, total INT);

CREATE INDEX idx_status ON orders(status);

-- Function on the column: index can't be used
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE lower(status) = 'paid';

-- Plain column comparison: index is used
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE status = 'paid';

-- Plain column + covering composite index
CREATE INDEX idx_cust_status ON orders(customer_id, status, total);
EXPLAIN QUERY PLAN
SELECT total FROM orders WHERE customer_id = 7 AND status = 'paid';`,
    output: `QUERY PLAN
\`--SCAN orders

QUERY PLAN
\`--SEARCH orders USING INDEX idx_status (status=?)

QUERY PLAN
\`--SEARCH orders USING COVERING INDEX idx_cust_status (customer_id=? AND status=?)`,
  },
  {
    q: "What is the N+1 query problem?",
    level: 'Advanced',
    a: "The N+1 problem is when code runs one query to get a list, then one more query for each item, so 100 posts cause 101 queries. It often hides inside ORMs with lazy loading. I fix it by fetching everything in one JOIN or one IN query, or using the ORM's eager loading like select_related/prefetch_related in Django or selectinload in SQLAlchemy.",
    code: `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript('''
CREATE TABLE authors (id INT, name TEXT);
CREATE TABLE posts (id INT, title TEXT, author_id INT);
INSERT INTO authors VALUES (1,'Asha'), (2,'Ravi'), (3,'Meera');
INSERT INTO posts VALUES (1,'SQL',1), (2,'Joins',2), (3,'CTEs',3);
''')
count = 0
def run(sql, *args):
    global count; count += 1
    return db.execute(sql, args).fetchall()

for pid, title, aid in run("SELECT * FROM posts"):       # 1 query
    run("SELECT name FROM authors WHERE id = ?", aid)   # +N queries
print("N+1 way:", count, "queries")

count = 0
rows = run('''SELECT p.title, a.name FROM posts p
              JOIN authors a ON a.id = p.author_id''')
print("JOIN way:", count, "query ->", rows)`,
    output: `N+1 way: 4 queries
JOIN way: 1 query -> [('SQL', 'Asha'), ('Joins', 'Ravi'), ('CTEs', 'Meera')]`,
  },
  {
    q: "What is SQL injection and how do you prevent it?",
    level: 'Advanced',
    a: "SQL injection is when user input is pasted into a SQL string and changes the query itself, for example ' OR '1'='1 turning a login check into 'match everyone'. I prevent it with parameterized queries, where the SQL and the values are sent separately so input is always treated as data. ORMs do this for me, and I never build SQL with string formatting or f-strings.",
    code: `import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE users (name TEXT, password TEXT)")
db.execute("INSERT INTO users VALUES ('admin', 's3cret')")

name, pwd = "admin", "' OR '1'='1"     # malicious input

# UNSAFE: string formatting
sql = f"SELECT name FROM users WHERE name='{name}' AND password='{pwd}'"
print(sql)
print("unsafe login:", db.execute(sql).fetchall())

# SAFE: parameterized query
safe = db.execute(
    "SELECT name FROM users WHERE name = ? AND password = ?",
    (name, pwd)).fetchall()
print("safe login:", safe)`,
    output: `SELECT name FROM users WHERE name='admin' AND password='' OR '1'='1'
unsafe login: [('admin',)]
safe login: []`,
  },
  {
    q: "What is connection pooling?",
    level: 'Advanced',
    a: "Opening a database connection is expensive: network handshake, authentication and memory on the server. A connection pool keeps a set of open connections and lends them to requests, then takes them back, so the app reuses them instead of reconnecting each time. I size the pool to what the database can handle, and for PostgreSQL with many app servers I put PgBouncer in front.",
    code: `# SQLAlchemy (Python) - pool settings
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://app:pw@db:5432/shop",
    pool_size=10,        # connections kept open
    max_overflow=5,      # extra ones under burst load
    pool_timeout=30,     # seconds to wait for a free one
    pool_recycle=1800,   # refresh old connections
)

with engine.connect() as conn:   # borrowed from the pool
    conn.execute(text("SELECT 1"))
# returned to the pool here, not closed`,
    output: `Without pool: request -> connect -> query -> close
              (connect ~ 20-50 ms every time)

With pool:    request -> borrow -> query -> return
              (connection reused, ~0 ms to get)

Max connections in use = pool_size + max_overflow = 15
Request #16 waits up to pool_timeout (30s) for a free one.`,
  },
  {
    q: "ORM vs raw SQL: which do you prefer?",
    level: 'Advanced',
    a: "An ORM like SQLAlchemy, Django ORM or Prisma maps tables to classes, so I get faster development, safer parameterized queries and database portability. Raw SQL gives full control and is better for complex reports, bulk operations and tuning. I use the ORM for normal CRUD and drop to raw SQL for heavy queries, and I always check the SQL the ORM generates to avoid things like N+1.",
    code: `# ORM (SQLAlchemy 2.0)
stmt = (select(User.name, func.count(Order.id))
        .join(Order)
        .group_by(User.id)
        .having(func.count(Order.id) > 5))
session.execute(stmt).all()

-- Raw SQL: the same query
SELECT u.name, COUNT(o.id)
FROM users u JOIN orders o ON o.user_id = u.id
GROUP BY u.id
HAVING COUNT(o.id) > 5;`,
    output: `ORM                              Raw SQL
-------------------------------  ----------------------------
Fast to write CRUD               Full control over the query
Safe params by default           Must parameterize yourself
Portable across databases        Can use DB-specific features
Can hide N+1 / slow queries      Best for reports, bulk work`,
  },
  {
    q: "What is database replication?",
    level: 'Advanced',
    a: "Replication keeps copies of the same data on several servers. The common setup is primary-replica: all writes go to the primary and are streamed to read replicas, which serve read traffic and act as a standby for failover. With asynchronous replication the replicas can lag a bit, so I read critical data, like right after a user saves something, from the primary.",
    code: `           writes
  App  ----------->  Primary
   |                    |
   |      replication   | (WAL / binlog stream)
   |     +--------------+--------------+
   |     v                             v
   +-> Replica 1                    Replica 2
 reads (read-only)                  (read-only)

-- PostgreSQL: check replicas from the primary
SELECT client_addr, state, replay_lag FROM pg_stat_replication;`,
    output: ` client_addr |   state   |   replay_lag
-------------+-----------+-----------------
 10.0.0.11   | streaming | 00:00:00.004212
 10.0.0.12   | streaming | 00:00:00.006870

Sync replication:  safe, but slower writes
Async replication: fast writes, replicas may lag`,
  },
  {
    q: "What is the difference between sharding and partitioning?",
    level: 'Advanced',
    a: "Partitioning splits a big table into smaller pieces inside one database, for example orders by month, so queries and deletes on old data touch only one piece. Sharding splits the data across multiple database servers by a shard key, like user_id, so each server holds part of the data and the system scales horizontally. Sharding adds a lot of complexity, like cross-shard joins, so I only reach for it after indexing, caching and replicas aren't enough.",
    code: `-- PostgreSQL range partitioning (one server)
CREATE TABLE orders (id BIGINT, created DATE, total INT)
  PARTITION BY RANGE (created);
CREATE TABLE orders_2026_01 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

# Sharding (app routes by key, many servers)
def shard_for(user_id, shards=4):
    return f"db-shard-{user_id % shards}"`,
    output: `Partitioning: one database, table split internally
  orders -> orders_2026_01, orders_2026_02, ...
  WHERE created = '2026-02-10' scans only orders_2026_02

Sharding: data spread over several servers
  shard_for(101) -> db-shard-1
  shard_for(202) -> db-shard-2
  shard_for(303) -> db-shard-3`,
  },
  {
    q: "What is the CAP theorem?",
    level: 'Advanced',
    a: "The CAP theorem says a distributed system can't fully guarantee Consistency, Availability and Partition tolerance at the same time. Network partitions will happen, so during one I have to choose: CP systems refuse some requests to stay consistent, and AP systems keep answering but may return stale data. For a bank balance I'd pick CP; for a social feed or product views, AP is fine.",
    code: `C - Consistency:   every read sees the latest write
A - Availability:  every request gets a response
P - Partition tolerance: works even if nodes can't talk

During a network partition, pick one:
  CP -> stay correct, reject some requests
  AP -> stay up, maybe return old data`,
    output: `Choice  Behaviour during partition     Examples
------  -----------------------------  ---------------------
CP      Errors/timeouts, no stale data  MongoDB (default),
                                        HBase, etcd, Zookeeper
AP      Always answers, may be stale    Cassandra, DynamoDB,
                                        CouchDB
CA      Only without partitions         Single-node PostgreSQL
                                        / MySQL`,
  },
  {
    q: "What are the types of NoSQL databases? Show a MongoDB example.",
    level: 'Advanced',
    a: "There are four main types: document stores like MongoDB keep JSON-like documents; key-value stores like Redis are simple and very fast lookups; wide-column stores like Cassandra handle huge write-heavy data; and graph databases like Neo4j are built for relationships, like friends of friends. In MongoDB I insert documents into a collection and query with a filter object instead of SQL.",
    code: `// MongoDB shell (mongosh)
db.users.insertMany([
  { name: "Asha", age: 28, skills: ["sql", "python"] },
  { name: "Ravi", age: 35, city: "Pune" }
])

db.users.find(
  { age: { $gt: 25 }, skills: "sql" },   // WHERE
  { _id: 0, name: 1, age: 1 }            // SELECT columns
)`,
    output: `{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6733a1f0c2a4b5e6f7a8b901'),
    '1': ObjectId('6733a1f0c2a4b5e6f7a8b902')
  }
}

[ { name: 'Asha', age: 28 } ]

Types: Document (MongoDB)   Key-value (Redis)
       Wide-column (Cassandra)  Graph (Neo4j)`,
  },
  {
    q: "How would you use Redis as a cache?",
    level: 'Advanced',
    a: "I use the cache-aside pattern: first check Redis for the key; on a hit I return it, on a miss I query the database, store the result in Redis with an expiry (TTL), and return it. This takes load off the database for hot data like product pages or sessions. The hard part is invalidation, so when the data changes I delete the cache key, and the TTL is a safety net for anything I miss.",
    code: `import json, redis
r = redis.Redis()

def get_product(pid):
    key = f"product:{pid}"
    cached = r.get(key)
    if cached:
        return json.loads(cached), "cache hit"
    row = db_query("SELECT * FROM products WHERE id=%s", pid)
    r.setex(key, 300, json.dumps(row))   # TTL 5 min
    return row, "cache miss -> DB"

def update_price(pid, price):
    db_execute("UPDATE products SET price=%s WHERE id=%s", price, pid)
    r.delete(f"product:{pid}")           # invalidate`,
    output: `get_product(7)   -> {'id': 7, 'name': 'Pen', 'price': 10}  cache miss -> DB
get_product(7)   -> {'id': 7, 'name': 'Pen', 'price': 10}  cache hit
update_price(7, 12)
get_product(7)   -> {'id': 7, 'name': 'Pen', 'price': 12}  cache miss -> DB

Redis:  GET ~0.2 ms   vs   DB query ~5-50 ms`,
  },
  {
    q: "How would you design a database for a simple shop (users, products, orders)?",
    level: 'Advanced',
    a: "I start from the entities and their relationships: a user has many orders, and orders and products are many-to-many, so I add an order_items table between them. Each table gets a primary key, foreign keys enforce the links, and I store the price on order_items because product prices change later. Then I add indexes on foreign keys and common filters, like orders.user_id.",
    code: `PRAGMA foreign_keys = ON;
CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL,
                       price INT CHECK (price >= 0));
CREATE TABLE orders (id INTEGER PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_DATE);
CREATE TABLE order_items (
  order_id   INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty INT NOT NULL CHECK (qty > 0), unit_price INT NOT NULL,
  PRIMARY KEY (order_id, product_id));
CREATE INDEX idx_orders_user ON orders(user_id);

INSERT INTO users VALUES (1, 'asha@x.com');
INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Book', 250);
INSERT INTO orders (id, user_id) VALUES (100, 1);
INSERT INTO order_items VALUES (100, 1, 3, 10), (100, 2, 1, 250);

SELECT u.email, o.id AS order_id,
       SUM(i.qty * i.unit_price) AS order_total
FROM users u JOIN orders o ON o.user_id = u.id
JOIN order_items i ON i.order_id = o.id GROUP BY o.id;`,
    output: `╭────────────┬──────────┬─────────────╮
│   email    │ order_id │ order_total │
╞════════════╪══════════╪═════════════╡
│ asha@x.com │      100 │         280 │
╰────────────┴──────────┴─────────────╯`,
  },
  {
    q: "How do you find the second highest salary?",
    level: 'Coding round',
    a: "I find the max salary that is less than the overall max, which naturally handles ties and returns NULL if there's no second value. Another option is ORDER BY with LIMIT 1 OFFSET 1 on DISTINCT salaries. I mention the DISTINCT because without it two people sharing the top salary would give the wrong answer.",
    code: `CREATE TABLE emp (name TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 90000), ('Ravi', 75000),
  ('Meera', 90000), ('John', 60000), ('Sara', 75000);

SELECT MAX(salary) AS second_highest
FROM emp
WHERE salary < (SELECT MAX(salary) FROM emp);

SELECT DISTINCT salary AS second_highest
FROM emp ORDER BY salary DESC LIMIT 1 OFFSET 1;`,
    output: `╭────────────────╮
│ second_highest │
╞════════════════╡
│          75000 │
╰────────────────╯

╭────────────────╮
│ second_highest │
╞════════════════╡
│          75000 │
╰────────────────╯`,
  },
  {
    q: "How do you find the Nth highest salary?",
    level: 'Coding round',
    a: "I use DENSE_RANK over salary descending and pick the row where the rank equals N, so ties share a rank and no value is skipped. Alternatively, LIMIT 1 OFFSET N-1 on DISTINCT salaries works too. Here N is 3.",
    code: `CREATE TABLE emp (name TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 90000), ('Ravi', 75000),
  ('Meera', 90000), ('John', 60000), ('Sara', 75000);

WITH ranked AS (
  SELECT name, salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM emp
)
SELECT name, salary FROM ranked WHERE rnk = 3;`,
    output: `╭──────┬────────╮
│ name │ salary │
╞══════╪════════╡
│ John │  60000 │
╰──────┴────────╯`,
  },
  {
    q: "How do you find duplicate records?",
    level: 'Coding round',
    a: "I GROUP BY the columns that define a duplicate and keep groups with HAVING COUNT(*) > 1. That shows each duplicated value and how many times it appears. Afterwards I'd add a UNIQUE constraint so duplicates can't come back.",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT);
INSERT INTO users (email) VALUES ('a@x.com'), ('b@x.com'),
  ('a@x.com'), ('c@x.com'), ('b@x.com'), ('a@x.com');

SELECT email, COUNT(*) AS times
FROM users
GROUP BY email
HAVING COUNT(*) > 1;`,
    output: `╭─────────┬───────╮
│  email  │ times │
╞═════════╪═══════╡
│ a@x.com │     3 │
│ b@x.com │     2 │
╰─────────┴───────╯`,
  },
  {
    q: "How do you delete duplicates but keep one row?",
    level: 'Coding round',
    a: "I keep the row with the smallest id for each duplicate group and delete every other row. In SQLite and PostgreSQL I can also use ROW_NUMBER() partitioned by the duplicate columns and delete rows where it's greater than 1. I always run it as a SELECT first, or inside a transaction, before deleting for real.",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT);
INSERT INTO users (email) VALUES ('a@x.com'), ('b@x.com'),
  ('a@x.com'), ('c@x.com'), ('b@x.com'), ('a@x.com');

DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id) FROM users GROUP BY email
);

SELECT * FROM users;`,
    output: `╭────┬─────────╮
│ id │  email  │
╞════╪═════════╡
│  1 │ a@x.com │
│  2 │ b@x.com │
│  4 │ c@x.com │
╰────┴─────────╯`,
  },
  {
    q: "How do you find employees who earn more than their manager?",
    level: 'Coding round',
    a: "This is a self join: I join the employee table to itself, matching each employee's manager_id to the manager's id, and then compare the two salaries. Using aliases like e and m keeps it clear which side is which.",
    code: `CREATE TABLE emp (id INT, name TEXT, salary INT, manager_id INT);
INSERT INTO emp VALUES (1, 'Asha', 80000, NULL),
  (2, 'Ravi', 90000, 1), (3, 'Meera', 60000, 1),
  (4, 'John', 95000, 2), (5, 'Sara', 50000, 2);

SELECT e.name AS employee, e.salary,
       m.name AS manager, m.salary AS manager_salary
FROM emp e
JOIN emp m ON e.manager_id = m.id
WHERE e.salary > m.salary;`,
    output: `╭──────────┬────────┬─────────┬────────────────╮
│ employee │ salary │ manager │ manager_salary │
╞══════════╪════════╪═════════╪════════════════╡
│ Ravi     │  90000 │ Asha    │          80000 │
│ John     │  95000 │ Ravi    │          90000 │
╰──────────┴────────┴─────────┴────────────────╯`,
  },
  {
    q: "How do you find the highest-paid employee in each department?",
    level: 'Coding round',
    a: "I first get the max salary per department with GROUP BY, then join back to the employees to get the names. Joining back is important because a plain GROUP BY can't safely give me the name, and this way ties, like two IT people on 90000, both show up.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 80000),
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000),
  ('John', 'HR', 65000), ('Sara', 'Sales', 70000),
  ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);

SELECT e.dept, e.name, e.salary
FROM emp e
JOIN (SELECT dept, MAX(salary) AS max_sal
      FROM emp GROUP BY dept) m
  ON e.dept = m.dept AND e.salary = m.max_sal
ORDER BY e.dept, e.name;`,
    output: `╭───────┬───────┬────────╮
│ dept  │ name  │ salary │
╞═══════╪═══════╪════════╡
│ HR    │ John  │  65000 │
│ IT    │ Asha  │  90000 │
│ IT    │ Kiran │  90000 │
│ Sales │ Sara  │  70000 │
╰───────┴───────┴────────╯`,
  },
  {
    q: "How do you count rows per group?",
    level: 'Coding round',
    a: "I GROUP BY the group column and use COUNT(*), ordering by the count to see the biggest groups first. If I also need groups with zero rows, like departments with no employees, I LEFT JOIN from the departments table and count a column from the employee side, since COUNT(col) ignores NULLs.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 80000),
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000),
  ('John', 'HR', 65000), ('Sara', 'Sales', 70000),
  ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);
CREATE TABLE dept (name TEXT);
INSERT INTO dept VALUES ('IT'), ('HR'), ('Sales'), ('Legal');

SELECT d.name AS dept, COUNT(e.name) AS employees
FROM dept d
LEFT JOIN emp e ON e.dept = d.name
GROUP BY d.name
ORDER BY employees DESC;`,
    output: `╭───────┬───────────╮
│ dept  │ employees │
╞═══════╪═══════════╡
│ Sales │         3 │
│ IT    │         3 │
│ HR    │         2 │
│ Legal │         0 │
╰───────┴───────────╯`,
  },
  {
    q: "How do you get the top N rows per group?",
    level: 'Coding round',
    a: "I number the rows inside each group with ROW_NUMBER() OVER (PARTITION BY group ORDER BY value DESC) in a CTE, then keep rows where the number is <= N. If ties should both count, I use DENSE_RANK instead. Here it's the top 2 earners in each department.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 80000),
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000),
  ('John', 'HR', 65000), ('Sara', 'Sales', 70000),
  ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);

WITH ranked AS (
  SELECT name, dept, salary,
    ROW_NUMBER() OVER (PARTITION BY dept
                       ORDER BY salary DESC, name) AS rn
  FROM emp
)
SELECT dept, name, salary, rn
FROM ranked WHERE rn <= 2
ORDER BY dept, rn;`,
    output: `╭───────┬───────┬────────┬────╮
│ dept  │ name  │ salary │ rn │
╞═══════╪═══════╪════════╪════╡
│ HR    │ John  │  65000 │  1 │
│ HR    │ Meera │  50000 │  2 │
│ IT    │ Asha  │  90000 │  1 │
│ IT    │ Kiran │  90000 │  2 │
│ Sales │ Sara  │  70000 │  1 │
│ Sales │ Lina  │  62000 │  2 │
╰───────┴───────┴────────┴────╯`,
  },
  {
    q: "How do you find customers who have never placed an order?",
    level: 'Coding round',
    a: "I LEFT JOIN customers to orders and keep the rows where the order side is NULL, meaning no match was found. NOT EXISTS works equally well and is often clearer. I avoid NOT IN here, because if orders.customer_id has a NULL, NOT IN returns no rows at all.",
    code: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'),
  (3, 'Meera'), (4, 'John');
INSERT INTO orders VALUES (100, 1), (101, 3), (102, 1), (103, NULL);

SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- Trap: NOT IN with a NULL in the list returns nothing
SELECT COUNT(*) AS not_in_result FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);`,
    output: `╭──────╮
│ name │
╞══════╡
│ Ravi │
│ John │
╰──────╯

╭───────────────╮
│ not_in_result │
╞═══════════════╡
│             0 │
╰───────────────╯`,
  },
  {
    q: "How do you calculate a running total?",
    level: 'Coding round',
    a: "I use SUM() as a window function with ORDER BY inside OVER, so each row adds its value to all the rows before it. Adding PARTITION BY restarts the total per group, like per customer or per month. Before window functions this needed a slow correlated subquery.",
    code: `CREATE TABLE payments (day TEXT, customer TEXT, amount INT);
INSERT INTO payments VALUES ('2026-01-01', 'Asha', 100),
  ('2026-01-02', 'Ravi', 50), ('2026-01-03', 'Asha', 200),
  ('2026-01-04', 'Ravi', 25), ('2026-01-05', 'Asha', 70);

SELECT day, customer, amount,
  SUM(amount) OVER (ORDER BY day) AS running_total,
  SUM(amount) OVER (PARTITION BY customer ORDER BY day)
    AS customer_running
FROM payments
ORDER BY day;`,
    output: `╭────────────┬──────────┬────────┬───────────────┬──────────────────╮
│    day     │ customer │ amount │ running_total │ customer_running │
╞════════════╪══════════╪════════╪═══════════════╪══════════════════╡
│ 2026-01-01 │ Asha     │    100 │           100 │              100 │
│ 2026-01-02 │ Ravi     │     50 │           150 │               50 │
│ 2026-01-03 │ Asha     │    200 │           350 │              300 │
│ 2026-01-04 │ Ravi     │     25 │           375 │               75 │
│ 2026-01-05 │ Asha     │     70 │           445 │              370 │
╰────────────┴──────────┴────────┴───────────────┴──────────────────╯`,
  },
]
