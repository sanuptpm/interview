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
    code: `CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INT);
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
CREATE TABLE orders (id INT, customer_id INT REFERENCES customers(id));
INSERT INTO customers VALUES (1, 'Asha');
INSERT INTO orders VALUES (101, 1);   -- ok
INSERT INTO orders VALUES (102, 99);  -- customer 99 missing

SELECT * FROM orders;`,
    output: `Error near line 6: FOREIGN KEY constraint failed
╭─────┬─────────────╮
│ id  │ customer_id │
╞═════╪═════════════╡
│ 101 │           1 │
╰─────┴─────────────╯`,
  },
  {
    q: "What do UNIQUE, NOT NULL, CHECK and DEFAULT constraints do?",
    level: 'Basics',
    a: "UNIQUE stops duplicate values in a column, NOT NULL makes a value required, CHECK enforces a rule like price > 0, and DEFAULT fills in a value when I don't provide one. I like putting these rules in the database itself, because then bad data is blocked even if some app code forgets to validate.",
    code: `CREATE TABLE products (
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
    output: `Error near line 8: UNIQUE constraint failed: products.sku
Error near line 9: NOT NULL constraint failed: products.name
Error near line 10: CHECK constraint failed: price > 0
╭─────┬──────┬───────┬────────╮
│ sku │ name │ price │ status │
╞═════╪══════╪═══════╪════════╡
│ P1  │ Pen  │  10.0 │ active │
╰─────┴──────┴───────┴────────╯`,
  },
  {
    q: "What are common SQL data types?",
    level: 'Basics',
    a: "The common ones are INTEGER/BIGINT for whole numbers, DECIMAL/NUMERIC for exact money values, REAL/FLOAT for approximate numbers, VARCHAR/TEXT for strings, BOOLEAN, DATE/TIMESTAMP for time, and JSON in PostgreSQL and MySQL. SQLite is flexible and stores values in just five storage classes, which typeof() shows. A tip: I never store money as FLOAT; I use DECIMAL or integer cents.",
    code: `CREATE TABLE demo (qty INTEGER, price REAL, name TEXT, data BLOB, note TEXT);
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
INSERT INTO employees VALUES ('Asha', 'IT', 70000), ('Ravi', 'HR', 40000),
  ('Meera', 'IT', 90000), ('John', 'IT', 50000), ('Sara', 'Sales', 60000);

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
    q: "In what order does SQL actually run the clauses of a SELECT?",
    level: 'Basics',
    a: "I write SELECT first, but the database logically runs FROM and JOIN, then WHERE, GROUP BY, HAVING, then SELECT (including window functions), then DISTINCT, ORDER BY and finally LIMIT. That explains common errors: WHERE can't filter on a window function or an aggregate because they don't exist yet at that point. The fix is to compute the value in a CTE or subquery and filter it in the outer query, or use HAVING for aggregates.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 70000);
-- Runs as: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT

-- Works: compute rnk in a subquery first, filter it outside
SELECT name FROM (SELECT name, RANK() OVER (ORDER BY salary DESC) AS rnk FROM emp)
WHERE rnk = 1;

-- Fails: WHERE runs before SELECT, so rnk doesn't exist yet
SELECT name, RANK() OVER (ORDER BY salary DESC) AS rnk FROM emp WHERE rnk = 1;`,
    output: `╭──────╮
│ name │
╞══════╡
│ Asha │
╰──────╯

Parse error near line 10: misuse of aliased window function rnk`,
  },
  {
    q: "How do you use CASE in ORDER BY for a custom sort order?",
    level: 'Basics',
    a: "ORDER BY normally sorts alphabetically or numerically, but statuses like 'urgent', 'normal', 'low' need a business order. I put a CASE expression in ORDER BY that maps each value to a number, then add a second column to sort ties. If the order is used in many places, I store it as a priority column or a small lookup table instead of repeating the CASE.",
    code: `CREATE TABLE tickets (id INT, title TEXT, priority TEXT);
INSERT INTO tickets VALUES (1, 'Typo on page', 'low'), (2, 'Site down', 'urgent'),
  (3, 'Slow search', 'normal'), (4, 'Payment failing', 'urgent');

SELECT id, title, priority FROM tickets
ORDER BY CASE priority WHEN 'urgent' THEN 1
                       WHEN 'normal' THEN 2
                       ELSE 3 END,
         id;`,
    output: `╭────┬─────────────────┬──────────╮
│ id │      title      │ priority │
╞════╪═════════════════╪══════════╡
│  2 │ Site down       │ urgent   │
│  4 │ Payment failing │ urgent   │
│  3 │ Slow search     │ normal   │
│  1 │ Typo on page    │ low      │
╰────┴─────────────────┴──────────╯`,
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
    q: "What is the difference between IN, EXISTS and JOIN for matching rows in another table?",
    level: 'Basics',
    a: "All three can answer 'customers who have orders', but they behave differently. A JOIN returns one row per match, so a customer with two orders shows up twice unless I add DISTINCT; IN and EXISTS just test for a match and return each customer once. I use JOIN when I need columns from the other table, and EXISTS (or IN with a small list) when I only need to check, and modern optimizers usually run IN and EXISTS the same way.",
    code: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'), (3, 'Meera');
INSERT INTO orders VALUES (10, 1, 500), (11, 1, 300), (12, 3, 200);

SELECT c.name, o.amount FROM customers c JOIN orders o ON o.customer_id = c.id;

SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders);

SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    output: `╭───────┬────────╮
│ name  │ amount │
╞═══════╪════════╡
│ Asha  │    300 │
│ Asha  │    500 │
│ Meera │    200 │
╰───────┴────────╯

╭───────╮
│ name  │
╞═══════╡
│ Asha  │
│ Meera │
╰───────╯

╭───────╮
│ name  │
╞═══════╡
│ Asha  │
│ Meera │
╰───────╯`,
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
    q: "Why is NULL = NULL not true? Explain three-valued logic.",
    level: 'Basics',
    a: "SQL comparisons have three results: true, false and unknown, and any comparison with NULL is unknown, because NULL means 'we don't know the value'. So NULL = NULL is NULL, not true, and WHERE only keeps rows where the condition is true, which silently drops NULL rows from both = and <> filters. I use IS NULL, or IS / IS NOT DISTINCT FROM when I want NULLs to compare as equal, and remember that NULL OR true is still true.",
    code: `SELECT NULL = NULL AS eq, NULL IS NULL AS is_null, NULL OR 1 AS "null OR true";

CREATE TABLE emp (name TEXT, city TEXT);
INSERT INTO emp VALUES ('Asha', 'Kochi'), ('Ravi', NULL), ('Meera', 'Pune');
-- Ravi is in neither result: his city is unknown
SELECT name FROM emp WHERE city = 'Kochi';

SELECT name FROM emp WHERE city <> 'Kochi';`,
    output: `╭────┬─────────┬──────────────╮
│ eq │ is_null │ null OR true │
╞════╪═════════╪══════════════╡
│    │       1 │            1 │
╰────┴─────────┴──────────────╯

╭──────╮
│ name │
╞══════╡
│ Asha │
╰──────╯

╭───────╮
│ name  │
╞═══════╡
│ Meera │
╰───────╯`,
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
    q: "Which string functions do you use most in SQL?",
    level: 'Basics',
    a: "The ones I use daily are UPPER and LOWER for case-insensitive matching, TRIM to clean user input, LENGTH, SUBSTR to cut parts of a string, REPLACE, INSTR to find a position, and || to concatenate (CONCAT in MySQL). A practical tip is to clean data when it's inserted, like trimming and lower-casing emails, instead of wrapping every WHERE in functions, because LOWER(email) = ... can't use a normal index on email.",
    code: `CREATE TABLE users (first TEXT, last TEXT, email TEXT);
INSERT INTO users VALUES ('asha', 'Nair', '  Asha.Nair@Mail.com '),
                         ('Ravi', 'Kumar', 'ravi@work.in');

SELECT UPPER(first) || ' ' || last           AS full_name,
       LOWER(TRIM(email))                    AS clean_email,
       LENGTH(TRIM(email))                   AS len,
       SUBSTR(TRIM(email), INSTR(TRIM(email), '@') + 1) AS domain,
       REPLACE(last, 'a', '*')               AS masked
FROM users;`,
    output: `╭────────────┬────────────────────┬─────┬──────────┬────────╮
│ full_name  │    clean_email     │ len │  domain  │ masked │
╞════════════╪════════════════════╪═════╪══════════╪════════╡
│ ASHA Nair  │ asha.nair@mail.com │  18 │ Mail.com │ N*ir   │
│ RAVI Kumar │ ravi@work.in       │  12 │ work.in  │ Kum*r  │
╰────────────┴────────────────────┴─────┴──────────┴────────╯`,
  },
  {
    q: "How do you work with dates in SQL?",
    level: 'Basics',
    a: "I store dates in a sortable ISO format (YYYY-MM-DD) or a real DATE/TIMESTAMP type, and use date functions instead of string tricks. In SQLite that's date() with modifiers like '+1 month' or 'start of month', strftime to pull out the year or month, and julianday to get the days between two dates; PostgreSQL has INTERVAL, DATE_TRUNC and AGE. I use fixed dates in examples and tests, because CURRENT_DATE changes every day.",
    code: `SELECT date('2026-01-15', '+10 days')       AS plus_10_days,
       date('2026-01-15', 'start of month') AS month_start,
       strftime('%Y-%m', '2026-01-15')      AS year_month,
       julianday('2026-03-01') - julianday('2026-01-15') AS days_between;

CREATE TABLE orders (id INT, placed_on TEXT);
INSERT INTO orders VALUES (1, '2026-01-05'), (2, '2026-01-28'), (3, '2026-02-03');
SELECT strftime('%Y-%m', placed_on) AS month, COUNT(*) AS orders
FROM orders GROUP BY month;`,
    output: `╭──────────────┬─────────────┬────────────┬──────────────╮
│ plus_10_days │ month_start │ year_month │ days_between │
╞══════════════╪═════════════╪════════════╪══════════════╡
│ 2026-01-25   │ 2026-01-01  │ 2026-01    │         45.0 │
╰──────────────┴─────────────┴────────────┴──────────────╯

╭─────────┬────────╮
│  month  │ orders │
╞═════════╪════════╡
│ 2026-01 │      2 │
│ 2026-02 │      1 │
╰─────────┴────────╯`,
  },
  {
    q: "What is the difference between DDL, DML, DCL and TCL?",
    level: 'Basics',
    a: "DDL (Data Definition Language) defines structure: CREATE, ALTER, DROP, TRUNCATE. DML (Data Manipulation Language) works with the data: SELECT, INSERT, UPDATE, DELETE. DCL (Data Control Language) handles permissions with GRANT and REVOKE, and TCL (Transaction Control Language) manages transactions with COMMIT, ROLLBACK and SAVEPOINT.",
    code: `-- DDL: structure
CREATE TABLE t (id INT, name TEXT);
-- DML: data
INSERT INTO t VALUES (1, 'a');
UPDATE t SET name = 'b' WHERE id = 1;
-- DCL: permissions (PostgreSQL / MySQL)
GRANT SELECT ON t TO report_user;
-- TCL: transactions
BEGIN; DELETE FROM t; ROLLBACK;`,
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

Parse error near line 10: no such table: logs`,
  },
  {
    q: "How do you do an upsert (insert or update) with ON CONFLICT?",
    level: 'Intermediate',
    a: "An upsert inserts a row, or updates it if a row with the same unique key already exists, in one atomic statement. In SQLite and PostgreSQL I write INSERT ... ON CONFLICT (key) DO UPDATE SET col = excluded.col, where excluded is the row I tried to insert; MySQL uses ON DUPLICATE KEY UPDATE. It needs a UNIQUE or PRIMARY KEY on the conflict column, and it avoids the race condition of doing SELECT then INSERT from the app.",
    code: `CREATE TABLE stock (sku TEXT PRIMARY KEY, qty INT);
INSERT INTO stock VALUES ('PEN', 10);

INSERT INTO stock (sku, qty) VALUES ('PEN', 5), ('CUP', 3)
ON CONFLICT (sku) DO UPDATE SET qty = qty + excluded.qty;

INSERT INTO stock (sku, qty) VALUES ('CUP', 1)
ON CONFLICT (sku) DO NOTHING;      -- keep the existing row

SELECT * FROM stock ORDER BY sku;`,
    output: `╭─────┬─────╮
│ sku │ qty │
╞═════╪═════╡
│ CUP │   3 │
│ PEN │  15 │
╰─────┴─────╯`,
  },
  {
    q: "How do you copy rows into another table with INSERT ... SELECT?",
    level: 'Intermediate',
    a: "INSERT INTO target (cols) SELECT ... copies the result of a query straight into a table inside the database, without pulling the rows into the application. I use it for archiving old rows, filling summary tables and backfilling data during migrations. When I archive, I do the INSERT and the DELETE in one transaction so a row can never be lost or copied twice.",
    code: `CREATE TABLE orders (id INT, placed_on TEXT);
CREATE TABLE orders_archive (id INT, placed_on TEXT);
INSERT INTO orders VALUES (1, '2024-11-02'), (2, '2025-12-20'), (3, '2026-02-10');

BEGIN;
INSERT INTO orders_archive SELECT * FROM orders WHERE placed_on < '2026-01-01';
DELETE FROM orders WHERE placed_on < '2026-01-01';
COMMIT;
SELECT 'archive' AS tbl, * FROM orders_archive
UNION ALL SELECT 'live', * FROM orders;`,
    output: `╭─────────┬────┬────────────╮
│   tbl   │ id │ placed_on  │
╞═════════╪════╪════════════╡
│ archive │  1 │ 2024-11-02 │
│ archive │  2 │ 2025-12-20 │
│ live    │  3 │ 2026-02-10 │
╰─────────┴────┴────────────╯`,
  },
  {
    q: "How do you UPDATE or DELETE rows using data from another table?",
    level: 'Intermediate',
    a: "The portable way is a subquery in SET or WHERE, like UPDATE ... SET price = (SELECT ...) WHERE id IN (SELECT ...). PostgreSQL and newer SQLite also support UPDATE ... FROM other_table, and MySQL uses UPDATE with a JOIN. My habit is to first run the same condition as a SELECT to see which rows will change, and to keep a WHERE on the UPDATE so rows without a match aren't set to NULL.",
    code: `CREATE TABLE products (id INT, name TEXT, price INT);
CREATE TABLE price_changes (product_id INT, new_price INT);
CREATE TABLE discontinued (product_id INT);
INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Cup', 80), (3, 'Ink', 40);
INSERT INTO price_changes VALUES (1, 12);
INSERT INTO discontinued VALUES (3);

UPDATE products SET price = pc.new_price
FROM price_changes pc WHERE pc.product_id = products.id;
DELETE FROM products WHERE id IN (SELECT product_id FROM discontinued);
SELECT * FROM products;`,
    output: `╭────┬──────┬───────╮
│ id │ name │ price │
╞════╪══════╪═══════╡
│  1 │ Pen  │    12 │
│  2 │ Cup  │    80 │
╰────┴──────┴───────╯`,
  },
  {
    q: "What are aggregate functions?",
    level: 'Intermediate',
    a: "Aggregate functions take many rows and return one value: COUNT, SUM, AVG, MIN and MAX are the common ones. COUNT(*) counts all rows while COUNT(col) skips NULLs, which is a common interview trap. I usually combine them with GROUP BY to get one result per group.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

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
    q: "What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?",
    level: 'Intermediate',
    a: "COUNT(*) counts rows, no matter what's in them. COUNT(column) counts only rows where that column is not NULL, and COUNT(DISTINCT column) counts the different non-NULL values. This matters in LEFT JOIN reports: counting a column from the right side gives 0 for groups with no matches, while COUNT(*) would wrongly give 1.",
    code: `CREATE TABLE orders (id INT, customer TEXT, coupon TEXT);
INSERT INTO orders VALUES (1, 'Asha', 'NEW10'), (2, 'Asha', NULL),
  (3, 'Ravi', 'NEW10'), (4, 'Meera', NULL), (5, 'Ravi', 'FEST');

SELECT COUNT(*)               AS all_rows,
       COUNT(coupon)          AS with_coupon,
       COUNT(DISTINCT coupon) AS different_coupons,
       COUNT(DISTINCT customer) AS customers
FROM orders;`,
    output: `╭──────────┬─────────────┬───────────────────┬───────────╮
│ all_rows │ with_coupon │ different_coupons │ customers │
╞══════════╪═════════════╪═══════════════════╪═══════════╡
│        5 │           3 │                 2 │         3 │
╰──────────┴─────────────┴───────────────────┴───────────╯`,
  },
  {
    q: "How does GROUP BY work?",
    level: 'Intermediate',
    a: "GROUP BY collapses rows with the same value into one group, and then aggregates run per group. Every column in the SELECT must either be in the GROUP BY or inside an aggregate. I use it for reports like 'headcount and average salary per department'.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

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
    q: "How do you combine values from many rows into one string (GROUP_CONCAT / STRING_AGG)?",
    level: 'Intermediate',
    a: "GROUP_CONCAT in SQLite and MySQL, or STRING_AGG in PostgreSQL and SQL Server, joins the values of a group into one string with a separator I choose. I use it for readable reports, like the list of employees in each department. To get a predictable order inside the string I add ORDER BY inside the function call, which recent SQLite versions and PostgreSQL support.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT);
INSERT INTO emp VALUES ('Ravi', 'IT'), ('Asha', 'IT'), ('Meera', 'HR'),
  ('John', 'HR'), ('Kiran', 'IT');

SELECT dept,
       COUNT(*) AS headcount,
       GROUP_CONCAT(name, ', ' ORDER BY name) AS members
FROM emp
GROUP BY dept
ORDER BY dept;`,
    output: `╭──────┬───────────┬───────────────────╮
│ dept │ headcount │      members      │
╞══════╪═══════════╪═══════════════════╡
│ HR   │         2 │ John, Meera       │
│ IT   │         3 │ Asha, Kiran, Ravi │
╰──────┴───────────┴───────────────────╯`,
  },
  {
    q: "What is the difference between WHERE and HAVING?",
    level: 'Intermediate',
    a: "WHERE filters individual rows before grouping, and HAVING filters groups after the aggregation. So I can't use SUM or COUNT in WHERE, but I can in HAVING. For performance I filter as much as possible in WHERE first, so fewer rows get grouped.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

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

SELECT customer FROM online UNION SELECT customer FROM store;

SELECT customer FROM online UNION ALL SELECT customer FROM store;`,
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
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

SELECT name, salary FROM emp
WHERE salary > (SELECT AVG(salary) FROM emp);

SELECT name, dept, salary FROM emp e
WHERE salary > (SELECT AVG(salary) FROM emp WHERE dept = e.dept);`,
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
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

SELECT name, salary,
  CASE WHEN salary >= 60000 THEN 'High'
       WHEN salary >= 45000 THEN 'Medium'
       ELSE 'Low' END AS band
FROM emp;`,
    output: `╭───────┬────────┬────────╮
│ name  │ salary │  band  │
╞═══════╪════════╪════════╡
│ Asha  │  70000 │ High   │
│ Ravi  │  50000 │ Medium │
│ Meera │  40000 │ Low    │
│ John  │  45000 │ Medium │
│ Sara  │  60000 │ High   │
╰───────┴────────┴────────╯`,
  },
  {
    q: "What is a view?",
    level: 'Intermediate',
    a: "A view is a saved SELECT query that I can use like a table. It doesn't store data itself, so it always shows current data, and it's great for hiding complex joins or exposing only some columns for security. If I need the result stored for speed, PostgreSQL has materialized views, which I refresh on a schedule.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
  ('Meera', 'HR', 40000), ('John', 'HR', 45000), ('Sara', 'Sales', 60000);

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
    q: "What is the difference between a view and a materialized view?",
    level: 'Intermediate',
    a: "A normal view only stores the query, so every read runs it again and always sees current data. A materialized view stores the result, so reads are fast, but the data is only as fresh as the last REFRESH MATERIALIZED VIEW in PostgreSQL. SQLite doesn't have materialized views, so I show the idea with a summary table that misses new rows until I rebuild it; I use this for heavy dashboards where a few minutes of staleness is fine.",
    code: `CREATE TABLE sales (region TEXT, amount INT);
INSERT INTO sales VALUES ('North', 100), ('South', 200);

CREATE VIEW v_region AS                       -- normal view
  SELECT region, SUM(amount) AS total FROM sales GROUP BY region;
CREATE TABLE mv_region AS                     -- "materialized"
  SELECT region, SUM(amount) AS total FROM sales GROUP BY region;
INSERT INTO sales VALUES ('South', 75);       -- new data arrives

SELECT 'view' AS src, * FROM v_region
UNION ALL SELECT 'materialized', * FROM mv_region;`,
    output: `╭──────────────┬────────┬───────╮
│     src      │ region │ total │
╞══════════════╪════════╪═══════╡
│ view         │ North  │   100 │
│ view         │ South  │   275 │
│ materialized │ North  │   100 │
│ materialized │ South  │   200 │
╰──────────────┴────────┴───────╯`,
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
    q: "Does column order matter in a composite index?",
    level: 'Intermediate',
    a: "Yes. A composite index on (dept, salary) is sorted by dept first and then by salary inside each dept, like a phone book sorted by last name then first name. So it helps queries that filter on dept, or on dept and salary, but not a query on salary alone, which still scans. I put the column used with equality first and the range or sort column second, and EXPLAIN QUERY PLAN shows whether the index is really used.",
    code: `CREATE TABLE emp (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INT);
CREATE INDEX idx_dept_salary ON emp (dept, salary);

EXPLAIN QUERY PLAN
SELECT name FROM emp WHERE dept = 'IT' AND salary > 50000;

EXPLAIN QUERY PLAN
SELECT name FROM emp WHERE salary > 50000;   -- leading column missing`,
    output: `QUERY PLAN
\`--SEARCH emp USING INDEX idx_dept_salary (dept=? AND salary>?)

QUERY PLAN
\`--SCAN emp`,
  },
  {
    q: "How do you query JSON data stored in a column?",
    level: 'Intermediate',
    a: "PostgreSQL has a real JSONB type, and SQLite and MySQL store JSON as text with functions to read it. In SQLite I use json_extract(col, '$.path') or the ->> operator to get a value, and json_each to turn a JSON array into rows I can join or count. JSON is handy for flexible attributes, but anything I filter on often I move into a real column or index the expression, because scanning JSON in every row is slow.",
    code: `CREATE TABLE products (id INT, name TEXT, attrs TEXT);
INSERT INTO products VALUES
  (1, 'Shirt', '{"color": "blue", "sizes": ["S", "M", "L"]}'),
  (2, 'Mug',   '{"color": "white"}');

SELECT name, json_extract(attrs, '$.color') AS color FROM products;

SELECT p.name, s.value AS size
FROM products p, json_each(p.attrs, '$.sizes') s;`,
    output: `╭───────┬───────╮
│ name  │ color │
╞═══════╪═══════╡
│ Shirt │ blue  │
│ Mug   │ white │
╰───────┴───────╯

╭───────┬──────╮
│ name  │ size │
╞═══════╪══════╡
│ Shirt │ S    │
│ Shirt │ M    │
│ Shirt │ L    │
╰───────┴──────╯`,
  },
  {
    q: "What is normalization? Explain 1NF, 2NF and 3NF.",
    level: 'Intermediate',
    a: "Normalization means organizing tables to remove duplicate data and update anomalies. 1NF: every column holds one atomic value, no lists. 2NF: in tables with a composite key, every column depends on the whole key, not part of it. 3NF: non-key columns depend only on the key, not on other non-key columns, like dept_name depending on dept_id. I usually design to 3NF and denormalize only where reads need it.",
    code: `-- 1NF: one value per cell, no lists
orders(id, products = 'Pen, Ink')  ->  order_items(order_id, product)
-- 2NF: no column depends on only part of a composite key
order_items(order_id, product_id, product_name)
  ->  order_items(order_id, product_id) + products(product_id, product_name)
-- 3NF: no non-key column depends on another non-key column
employees(id, name, dept_id, dept_name)
  ->  employees(id, name, dept_id) + departments(dept_id, dept_name)`,
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
    code: `CREATE TABLE order_items (order_id INT, price INT, qty INT);
CREATE TABLE orders (id INT, customer TEXT, total INT);  -- total is a copy
INSERT INTO order_items VALUES (1, 100, 2), (1, 50, 1);
INSERT INTO orders VALUES (1, 'Asha', 250);

-- Normalized read: compute the total every time
SELECT SUM(price * qty) AS total FROM order_items WHERE order_id = 1;

-- Denormalized read: just read the stored column
SELECT total FROM orders WHERE id = 1;`,
    output: `╭───────╮
│ total │
╞═══════╡
│   250 │
╰───────╯

╭───────╮
│ total │
╞═══════╡
│   250 │
╰───────╯`,
  },
  {
    q: "What is a transaction and what does ACID mean?",
    level: 'Intermediate',
    a: "A transaction groups several statements into one all-or-nothing unit, with BEGIN, COMMIT and ROLLBACK. ACID means Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don't see each other's half-done work) and Durability (once committed, it survives a crash). The classic example is a bank transfer: debit and credit must both happen or neither.",
    code: `CREATE TABLE accounts (name TEXT, balance INT);
INSERT INTO accounts VALUES ('Asha', 100), ('Ravi', 50);

BEGIN;  -- transfer 30: both updates happen, or neither
UPDATE accounts SET balance = balance - 30 WHERE name = 'Asha';
UPDATE accounts SET balance = balance + 30 WHERE name = 'Ravi';
COMMIT;
SELECT * FROM accounts;`,
    output: `╭──────┬─────────╮
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
COMMIT;`,
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
CREATE TABLE orders (id INT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE);
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
    q: "What is the difference between optimistic and pessimistic locking?",
    level: 'Advanced',
    a: "Pessimistic locking locks the row when I read it, with SELECT ... FOR UPDATE in PostgreSQL or MySQL, so others wait until I commit; it's safe for hot rows like a stock count but can block. Optimistic locking doesn't lock: each row has a version column, and the UPDATE only succeeds if the version is still what I read, otherwise zero rows change and the app retries or shows a conflict. I prefer optimistic for normal web edits where conflicts are rare, and here changes() shows the second, stale update touched no rows.",
    code: `CREATE TABLE accounts (id INT PRIMARY KEY, balance INT, version INT);
INSERT INTO accounts VALUES (1, 1000, 1);
-- Two users both read the row at version 1, then each tries to save.
UPDATE accounts SET balance = 900, version = version + 1
WHERE id = 1 AND version = 1;
SELECT changes() AS user_a_rows_updated;

UPDATE accounts SET balance = 1500, version = version + 1
WHERE id = 1 AND version = 1;      -- stale version
SELECT changes() AS user_b_rows_updated;`,
    output: `╭─────────────────────╮
│ user_a_rows_updated │
╞═════════════════════╡
│                   1 │
╰─────────────────────╯

╭─────────────────────╮
│ user_b_rows_updated │
╞═════════════════════╡
│                   0 │
╰─────────────────────╯`,
  },
  {
    q: "What is a deadlock and how do you prevent it?",
    level: 'Advanced',
    a: "A deadlock happens when two transactions each hold a lock the other one needs, so both would wait forever. The database detects it, kills one of them with an error and lets the other finish, so my app must catch that error and retry the transaction. To make deadlocks rare I lock rows in the same order everywhere (for example by id), keep transactions short, and don't wait for user input or slow API calls inside a transaction.",
    code: `-- A and B are two transactions running at the same time
A: BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- locks row 1
B: BEGIN; UPDATE accounts SET balance = balance - 50  WHERE id = 2;  -- locks row 2
A: UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- waits for B
B: UPDATE accounts SET balance = balance + 50  WHERE id = 1;  -- waits for A: DEADLOCK

-- Fix: both transactions update the lower id first (1, then 2)`,
    output: `PostgreSQL (illustrative):
ERROR:  deadlock detected
DETAIL: Process 4127 waits for ShareLock on transaction 891;
        blocked by process 4130.
        Process 4130 waits for ShareLock on transaction 892;
        blocked by process 4127.
HINT:   See server log for query details.

Transaction B is rolled back; A commits. The app retries B.`,
  },
  {
    q: "What is MVCC?",
    level: 'Advanced',
    a: "MVCC (multi-version concurrency control) means the database keeps several versions of a row, so readers see a consistent snapshot while writers create new versions instead of overwriting in place. The big win is that readers don't block writers and writers don't block readers. The cost in PostgreSQL is that old row versions pile up and VACUUM has to clean them, so long-running transactions that hold old snapshots can cause table bloat.",
    code: `-- A and B are two sessions (PostgreSQL)
A: BEGIN ISOLATION LEVEL REPEATABLE READ;
A: SELECT balance FROM accounts WHERE id = 1;  -- 1000
B: UPDATE accounts SET balance = 500 WHERE id = 1;  -- new row version, not blocked
A: SELECT balance FROM accounts WHERE id = 1;  -- still 1000 (A's snapshot)
A: COMMIT;
A: SELECT balance FROM accounts WHERE id = 1;  -- 500 (new snapshot)`,
    output: `Row versions for accounts id = 1 (illustrative):
version  balance  created by  deleted by  visible to
-------  -------  ----------  ----------  ----------------------------
v1       1000     tx 100      tx 205      A's snapshot (started earlier)
v2        500     tx 205      -           every transaction after 205

VACUUM removes v1 once no running transaction can still see it.`,
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
    q: "What is a window frame (ROWS BETWEEN), and how do you compute a moving average?",
    level: 'Advanced',
    a: "The frame decides which rows around the current row a window function looks at. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW means 'this row and the two before it', which gives a 3-day moving average. One trap: with ORDER BY and no frame, the default is RANGE UNBOUNDED PRECEDING to CURRENT ROW, which is a running total and treats tied values as one group, so I write the frame explicitly.",
    code: `CREATE TABLE sales (day TEXT, amount INT);
INSERT INTO sales VALUES ('2026-03-01', 100), ('2026-03-02', 200),
  ('2026-03-03', 300), ('2026-03-04', 100), ('2026-03-05', 500);

SELECT day, amount,
  ROUND(AVG(amount) OVER (ORDER BY day
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_3,
  SUM(amount) OVER (ORDER BY day
        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)     AS sum_neighbours
FROM sales;`,
    output: `╭────────────┬────────┬──────────────┬────────────────╮
│    day     │ amount │ moving_avg_3 │ sum_neighbours │
╞════════════╪════════╪══════════════╪════════════════╡
│ 2026-03-01 │    100 │        100.0 │            300 │
│ 2026-03-02 │    200 │        150.0 │            600 │
│ 2026-03-03 │    300 │        200.0 │            600 │
│ 2026-03-04 │    100 │        200.0 │            900 │
│ 2026-03-05 │    500 │        300.0 │            600 │
╰────────────┴────────┴──────────────┴────────────────╯`,
  },
  {
    q: "What do NTILE, PERCENT_RANK and CUME_DIST do?",
    level: 'Advanced',
    a: "NTILE(n) splits the ordered rows into n roughly equal buckets, which I use for quartiles or A/B splits. PERCENT_RANK gives (rank - 1) / (rows - 1), so the first row is 0 and the last is 1, and CUME_DIST gives the fraction of rows less than or equal to the current one. They're handy for questions like 'which customers are in the top 25% by spend'.",
    code: `CREATE TABLE spend (customer TEXT, total INT);
INSERT INTO spend VALUES ('Asha', 900), ('Ravi', 400), ('Meera', 700),
  ('John', 200), ('Sara', 700), ('Kiran', 100);

SELECT customer, total,
  NTILE(4)       OVER (ORDER BY total DESC)          AS quartile,
  ROUND(PERCENT_RANK() OVER (ORDER BY total), 2)     AS pct_rank,
  ROUND(CUME_DIST()    OVER (ORDER BY total), 2)     AS cume_dist
FROM spend
ORDER BY total DESC;`,
    output: `╭──────────┬───────┬──────────┬──────────┬───────────╮
│ customer │ total │ quartile │ pct_rank │ cume_dist │
╞══════════╪═══════╪══════════╪══════════╪═══════════╡
│ Asha     │   900 │        1 │      1.0 │       1.0 │
│ Meera    │   700 │        1 │      0.6 │      0.83 │
│ Sara     │   700 │        2 │      0.6 │      0.83 │
│ Ravi     │   400 │        2 │      0.4 │       0.5 │
│ John     │   200 │        3 │      0.2 │      0.33 │
│ Kiran    │   100 │        4 │      0.0 │      0.17 │
╰──────────┴───────┴──────────┴──────────┴───────────╯`,
  },
  {
    q: "What is a CTE and a recursive CTE?",
    level: 'Advanced',
    a: "A CTE (Common Table Expression) is a named temporary result defined with WITH, which makes long queries readable, step by step. A recursive CTE refers to itself, with a starting query UNION ALL a recursive part, so I can walk hierarchies like an org chart or category tree. I always make sure the recursion has a stop condition.",
    code: `CREATE TABLE emp (id INT, name TEXT, manager_id INT);
INSERT INTO emp VALUES (1, 'CEO', NULL), (2, 'CTO', 1), (3, 'Developer', 2);

WITH RECURSIVE chain(id, name, level) AS (
  SELECT id, name, 0 FROM emp WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, c.level + 1
  FROM emp e JOIN chain c ON e.manager_id = c.id
)
SELECT name, level FROM chain;`,
    output: `╭───────────┬───────╮
│   name    │ level │
╞═══════════╪═══════╡
│ CEO       │     0 │
│ CTO       │     1 │
│ Developer │     2 │
╰───────────┴───────╯`,
  },
  {
    q: "What is the gaps and islands problem, and how do you solve it?",
    level: 'Advanced',
    a: "It means finding runs of consecutive values, the islands, and the breaks between them, the gaps, like consecutive seat numbers or days a server was up. The trick is to subtract ROW_NUMBER from the value: inside one run both go up by one, so the difference stays the same and becomes a group key. Then I GROUP BY that key and take MIN and MAX to get each island's start and end.",
    code: `CREATE TABLE seats (seat INT);
INSERT INTO seats VALUES (1), (2), (3), (7), (8), (12), (13), (14), (15);

WITH grp AS (
  SELECT seat, seat - ROW_NUMBER() OVER (ORDER BY seat) AS island
  FROM seats
)
SELECT MIN(seat) AS start, MAX(seat) AS finish, COUNT(*) AS length
FROM grp GROUP BY island ORDER BY start;`,
    output: `╭───────┬────────┬────────╮
│ start │ finish │ length │
╞═══════╪════════╪════════╡
│     1 │      3 │      3 │
│     7 │      8 │      2 │
│    12 │     15 │      4 │
╰───────┴────────┴────────╯`,
  },
  {
    q: "How do you pivot rows into columns?",
    level: 'Advanced',
    a: "Standard SQL doesn't have a portable PIVOT, so I use conditional aggregation: GROUP BY the row label and SUM(CASE WHEN column = value THEN amount END) for each new column. It works in every database, and SQL Server also has a PIVOT keyword and PostgreSQL has crosstab. The catch is that the columns are fixed in the query, so for dynamic columns I pivot in the application or build the SQL dynamically.",
    code: `CREATE TABLE sales (product TEXT, quarter TEXT, amount INT);
INSERT INTO sales VALUES ('Pen', 'Q1', 100), ('Pen', 'Q2', 150),
  ('Cup', 'Q1', 80), ('Cup', 'Q3', 120), ('Pen', 'Q3', 90), ('Cup', 'Q1', 20);

SELECT product,
  SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1,
  SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS q2,
  SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS q3
FROM sales GROUP BY product ORDER BY product;`,
    output: `╭─────────┬─────┬─────┬─────╮
│ product │ q1  │ q2  │ q3  │
╞═════════╪═════╪═════╪═════╡
│ Cup     │ 100 │   0 │ 120 │
│ Pen     │ 100 │ 150 │  90 │
╰─────────┴─────┴─────┴─────╯`,
  },
  {
    q: "What is a trigger?",
    level: 'Advanced',
    a: "A trigger is code the database runs automatically before or after an INSERT, UPDATE or DELETE on a table. I use them for audit logs or keeping an updated_at column current. I keep triggers small, because hidden logic in triggers makes the system harder to debug.",
    code: `CREATE TABLE products (id INT, price INT);
CREATE TABLE price_log (old_price INT, new_price INT);
CREATE TRIGGER log_price AFTER UPDATE OF price ON products
BEGIN
  INSERT INTO price_log VALUES (OLD.price, NEW.price);
END;

INSERT INTO products VALUES (1, 100);
UPDATE products SET price = 120 WHERE id = 1;
SELECT * FROM price_log;`,
    output: `╭───────────┬───────────╮
│ old_price │ new_price │
╞═══════════╪═══════════╡
│       100 │       120 │
╰───────────┴───────────╯`,
  },
  {
    q: "What is the difference between a stored procedure and a function?",
    level: 'Advanced',
    a: "A stored procedure is a saved program in the database that can run many statements, change data and manage transactions; I call it with CALL or EXEC. A function returns a value and can be used inside a SELECT, and is usually meant for computing rather than changing data. SQLite has neither, so this example is PostgreSQL; I use them for heavy data logic close to the data, but keep most business logic in the app so it's easier to test and version.",
    code: `-- PostgreSQL function: returns a value, usable in SELECT
CREATE FUNCTION add_tax(amount NUMERIC) RETURNS NUMERIC
  AS $$ SELECT amount * 1.18 $$ LANGUAGE sql;
SELECT add_tax(100);

-- PostgreSQL procedure: changes data, run with CALL
CREATE PROCEDURE give_raise(pct NUMERIC) LANGUAGE sql
  AS $$ UPDATE emp SET salary = salary * (1 + pct / 100) $$;
CALL give_raise(10);`,
    output: `SELECT add_tax(100);
 add_tax
---------
  118.00

CALL give_raise(10);
CALL

Procedure: CALL it, can change data
Function:  returns a value, usable inside SELECT`,
  },
  {
    q: "How do you optimize a slow SQL query?",
    level: 'Advanced',
    a: "First I measure with EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) to see if it's doing full table scans. Then the usual fixes: add indexes on filter and join columns, select only the columns I need instead of SELECT *, avoid wrapping indexed columns in functions in WHERE, and paginate large results. A composite index can even cover the whole query so the table isn't touched at all.",
    code: `CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT, total INT);
CREATE INDEX idx_status ON orders(status);

-- Function on the column: index can't be used
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE lower(status) = 'paid';

-- Plain column comparison: index is used
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'paid';`,
    output: `QUERY PLAN
\`--SCAN orders

QUERY PLAN
\`--SEARCH orders USING INDEX idx_status (status=?)`,
  },
  {
    q: "What is the N+1 query problem?",
    level: 'Advanced',
    a: "The N+1 problem is when code runs one query to get a list, then one more query for each item, so 100 posts cause 101 queries. It often hides inside ORMs with lazy loading. I fix it by fetching everything in one JOIN or one IN query, or using the ORM's eager loading like select_related/prefetch_related in Django or selectinload in SQLAlchemy.",
    code: `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript('''CREATE TABLE authors (id INT, name TEXT);
CREATE TABLE posts (title TEXT, author_id INT);
INSERT INTO authors VALUES (1, 'Asha'), (2, 'Ravi');
INSERT INTO posts VALUES ('SQL', 1), ('Joins', 2);''')
posts = db.execute("SELECT * FROM posts").fetchall()            # 1 query
for title, author_id in posts:                                  # + N queries
    db.execute("SELECT name FROM authors WHERE id = ?", (author_id,))
print("N+1 way:", 1 + len(posts), "queries")
rows = db.execute("SELECT title, name FROM posts JOIN authors ON id = author_id")
print("JOIN way: 1 query ->", rows.fetchall())`,
    output: `N+1 way: 3 queries
JOIN way: 1 query -> [('SQL', 'Asha'), ('Joins', 'Ravi')]`,
  },
  {
    q: "What is SQL injection and how do you prevent it?",
    level: 'Advanced',
    a: "SQL injection is when user input is pasted into a SQL string and changes the query itself, for example ' OR '1'='1 turning a login check into 'match everyone'. I prevent it with parameterized queries, where the SQL and the values are sent separately so input is always treated as data. ORMs do this for me, and I never build SQL with string formatting or f-strings.",
    code: `import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE users (name TEXT, password TEXT)")
db.execute("INSERT INTO users VALUES ('admin', 's3cret')")
pwd = "' OR '1'='1"   # malicious input

unsafe = f"SELECT name FROM users WHERE password = '{pwd}'"
print("unsafe login:", db.execute(unsafe).fetchall())
safe = "SELECT name FROM users WHERE password = ?"
print("safe login:", db.execute(safe, (pwd,)).fetchall())`,
    output: `unsafe login: [('admin',)]
safe login: []`,
  },
  {
    q: "What is connection pooling?",
    level: 'Advanced',
    a: "Opening a database connection is expensive: network handshake, authentication and memory on the server. A connection pool keeps a set of open connections and lends them to requests, then takes them back, so the app reuses them instead of reconnecting each time. I size the pool to what the database can handle, and for PostgreSQL with many app servers I put PgBouncer in front.",
    code: `from sqlalchemy import create_engine, text

engine = create_engine("postgresql://app:pw@db:5432/shop",
                       pool_size=10,      # connections kept open
                       max_overflow=5)    # extra ones under burst load

with engine.connect() as conn:   # borrowed from the pool
    conn.execute(text("SELECT 1"))
# returned to the pool here, not closed`,
    output: `Without pool: request -> connect -> query -> close
              (connect ~ 20-50 ms every time)

With pool:    request -> borrow -> query -> return
              (connection reused, ~0 ms to get)

Max connections in use = pool_size + max_overflow = 15
Request #16 waits up to pool_timeout (30s by default) for a free one.`,
  },
  {
    q: "ORM vs raw SQL: which do you prefer?",
    level: 'Advanced',
    a: "An ORM like SQLAlchemy, Django ORM or Prisma maps tables to classes, so I get faster development, safer parameterized queries and database portability. Raw SQL gives full control and is better for complex reports, bulk operations and tuning. I use the ORM for normal CRUD and drop to raw SQL for heavy queries, and I always check the SQL the ORM generates to avoid things like N+1.",
    code: `# ORM (SQLAlchemy 2.0)
session.execute(select(User.name, func.count(Order.id))
                .join(Order).group_by(User.id)).all()

-- Raw SQL: the same query
SELECT u.name, COUNT(o.id)
FROM users u JOIN orders o ON o.user_id = u.id
GROUP BY u.id;`,
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
    code: `-- App --writes--> Primary --WAL stream--> Replica 1, Replica 2
-- App --reads---> Replica 1 / Replica 2   (read-only copies)

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
    q: "How do you handle backups and point-in-time recovery?",
    level: 'Advanced',
    a: "I combine regular full backups with continuous archiving of the write-ahead log (WAL in PostgreSQL, binlog in MySQL). To recover, I restore the last full backup and replay the log up to a chosen moment, like one minute before someone ran a bad DELETE; that's point-in-time recovery. Managed services like RDS do this automatically, but the key tip is to test restores regularly, because a backup I've never restored is only a hope.",
    code: `# PostgreSQL: nightly logical backup and restore
pg_dump -Fc shop > shop.dump
pg_restore -d shop_restored shop.dump

# PITR: base backup + archived WAL (archive_mode = on)
pg_basebackup -D /backups/base -Fp -Xs -P
# restore it, then replay WAL up to a moment:
#   recovery_target_time = '2026-03-01 14:29:00'`,
    output: `Timeline (illustrative):
02:00  full base backup taken
...    every change streamed to the WAL archive
14:30  someone runs DELETE FROM orders;  (oops)
15:00  restore base backup + replay WAL until 14:29:00
       -> database is back as it was one minute before the mistake`,
  },
  {
    q: "What is the difference between sharding and partitioning?",
    level: 'Advanced',
    a: "Partitioning splits a big table into smaller pieces inside one database, for example orders by month, so queries and deletes on old data touch only one piece. Sharding splits the data across multiple database servers by a shard key, like user_id, so each server holds part of the data and the system scales horizontally. Sharding adds a lot of complexity, like cross-shard joins, so I only reach for it after indexing, caching and replicas aren't enough.",
    code: `-- PostgreSQL range partitioning (one server)
CREATE TABLE orders (id BIGINT, created DATE) PARTITION BY RANGE (created);
CREATE TABLE orders_2026_01 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

# Sharding (app routes by key, many servers)
def shard_for(user_id, shards=4):
    return f"db-shard-{user_id % shards}"`,
    output: `Partitioning: one database, table split internally
  orders -> orders_2026_01, orders_2026_02, ...
  WHERE created = '2026-01-10' scans only orders_2026_01

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
    cached = r.get(f"product:{pid}")
    if cached:
        return json.loads(cached)                     # cache hit
    row = db_get_product(pid)                         # cache miss -> DB
    r.setex(f"product:{pid}", 300, json.dumps(row))   # TTL 5 min
    return row`,
    output: `get_product(7)  -> {'id': 7, 'name': 'Pen', 'price': 10}  cache miss -> DB
get_product(7)  -> {'id': 7, 'name': 'Pen', 'price': 10}  cache hit
price changes   -> r.delete("product:7"), next read goes to the DB

Redis:  GET ~0.2 ms   vs   DB query ~5-50 ms`,
  },
  {
    q: "How would you design a database for a simple shop (users, products, orders)?",
    level: 'Advanced',
    a: "I start from the entities and their relationships: a user has many orders, and orders and products are many-to-many, so I add an order_items table between them. Each table gets a primary key, foreign keys enforce the links, and I store the price on order_items because product prices change later. Then I add indexes on foreign keys and common filters, like orders.user_id.",
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INT REFERENCES users(id));
CREATE TABLE order_items (order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id), qty INT, unit_price INT);
CREATE INDEX idx_orders_user ON orders(user_id);
INSERT INTO users VALUES (1, 'asha@x.com');
INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Book', 250);
INSERT INTO orders VALUES (100, 1);
INSERT INTO order_items VALUES (100, 1, 3, 10), (100, 2, 1, 250);
SELECT order_id, SUM(qty * unit_price) AS order_total
FROM order_items GROUP BY order_id;`,
    output: `╭──────────┬─────────────╮
│ order_id │ order_total │
╞══════════╪═════════════╡
│      100 │         280 │
╰──────────┴─────────────╯`,
  },
  {
    q: "What is the difference between OLTP and OLAP, and what is a star schema?",
    level: 'Advanced',
    a: "OLTP systems run the business: many small, fast reads and writes on normalized tables, like placing an order in PostgreSQL. OLAP systems answer analytical questions over huge history, like sales by month and region, usually in a column store such as BigQuery, Snowflake or Redshift. For OLAP I model data as a star schema: a central fact table with numbers (quantity, amount) and foreign keys to small dimension tables (date, product, store), which keeps report queries to simple joins plus GROUP BY.",
    code: `CREATE TABLE dim_product (product_id INT, category TEXT);      -- dimension
CREATE TABLE fact_sales (product_id INT, month TEXT, amount INT); -- fact
INSERT INTO dim_product VALUES (1, 'Office'), (2, 'Kitchen');
INSERT INTO fact_sales VALUES (1, '2026-01', 100), (2, '2026-01', 300),
  (1, '2026-02', 50), (2, '2026-02', 150);

SELECT f.month, p.category, SUM(f.amount) AS revenue
FROM fact_sales f JOIN dim_product p ON p.product_id = f.product_id
GROUP BY f.month, p.category ORDER BY f.month, p.category;`,
    output: `╭─────────┬──────────┬─────────╮
│  month  │ category │ revenue │
╞═════════╪══════════╪═════════╡
│ 2026-01 │ Kitchen  │     300 │
│ 2026-01 │ Office   │     100 │
│ 2026-02 │ Kitchen  │     150 │
│ 2026-02 │ Office   │      50 │
╰─────────┴──────────┴─────────╯`,
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
    q: "How do you find missing IDs (gaps) in a sequence?",
    level: 'Coding round',
    a: "I compare each id with the next one using LEAD: wherever the next id is more than one higher, the ids in between are missing. That gives me ranges like 4 to 5 without generating every number. If the interviewer wants each missing number on its own row, I generate the full range with a recursive CTE and LEFT JOIN, keeping the ids with no match.",
    code: `CREATE TABLE invoices (id INT);
INSERT INTO invoices VALUES (1), (2), (3), (6), (7), (9), (10), (14);

SELECT id + 1 AS gap_start, next_id - 1 AS gap_end
FROM (SELECT id, LEAD(id) OVER (ORDER BY id) AS next_id FROM invoices)
WHERE next_id - id > 1;

WITH RECURSIVE n(id) AS (SELECT 1 UNION ALL SELECT id + 1 FROM n WHERE id < 14)
SELECT n.id AS missing_id FROM n
LEFT JOIN invoices i ON i.id = n.id WHERE i.id IS NULL;`,
    output: `╭───────────┬─────────╮
│ gap_start │ gap_end │
╞═══════════╪═════════╡
│         4 │       5 │
│         8 │       8 │
│        11 │      13 │
╰───────────┴─────────╯

╭────────────╮
│ missing_id │
╞════════════╡
│          4 │
│          5 │
│          8 │
│         11 │
│         12 │
│         13 │
╰────────────╯`,
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
    q: "How do you list every pair of employees in the same department?",
    level: 'Coding round',
    a: "It's a self join on dept, with a.id < b.id in the join condition. The < does two jobs: it stops an employee pairing with themselves, and it keeps only one of (Asha, Ravi) and (Ravi, Asha). With a.id <> b.id instead I'd get every pair twice, which is a common mistake in this question.",
    code: `CREATE TABLE emp (id INT, name TEXT, dept TEXT);
INSERT INTO emp VALUES (1, 'Asha', 'IT'), (2, 'Ravi', 'IT'), (3, 'Kiran', 'IT'),
  (4, 'Meera', 'HR'), (5, 'John', 'HR'), (6, 'Sara', 'Sales');

SELECT a.dept, a.name AS employee_1, b.name AS employee_2
FROM emp a
JOIN emp b ON a.dept = b.dept AND a.id < b.id
ORDER BY a.dept, a.id, b.id;`,
    output: `╭──────┬────────────┬────────────╮
│ dept │ employee_1 │ employee_2 │
╞══════╪════════════╪════════════╡
│ HR   │ Meera      │ John       │
│ IT   │ Asha       │ Ravi       │
│ IT   │ Asha       │ Kiran      │
│ IT   │ Ravi       │ Kiran      │
╰──────┴────────────┴────────────╯`,
  },
  {
    q: "How do you find the highest-paid employee in each department?",
    level: 'Coding round',
    a: "I first get the max salary per department with GROUP BY, then join back to the employees to get the names. Joining back is important because a plain GROUP BY can't safely give me the name, and this way ties, like two IT people on 90000, both show up.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 80000),
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000), ('John', 'HR', 65000),
  ('Sara', 'Sales', 70000), ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);

SELECT e.dept, e.name, e.salary
FROM emp e
JOIN (SELECT dept, MAX(salary) AS max_sal FROM emp GROUP BY dept) m
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
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000), ('John', 'HR', 65000),
  ('Sara', 'Sales', 70000), ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);
CREATE TABLE dept (name TEXT);
INSERT INTO dept VALUES ('IT'), ('HR'), ('Sales'), ('Legal');

SELECT d.name AS dept, COUNT(e.name) AS employees
FROM dept d LEFT JOIN emp e ON e.dept = d.name
GROUP BY d.name ORDER BY employees DESC;`,
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
  ('Kiran', 'IT', 90000), ('Meera', 'HR', 50000), ('John', 'HR', 65000),
  ('Sara', 'Sales', 70000), ('Tom', 'Sales', 55000), ('Lina', 'Sales', 62000);

WITH ranked AS (
  SELECT dept, name, salary,
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC, name) AS rn
  FROM emp
)
SELECT dept, name, salary FROM ranked WHERE rn <= 2 ORDER BY dept, rn;`,
    output: `╭───────┬───────┬────────╮
│ dept  │ name  │ salary │
╞═══════╪═══════╪════════╡
│ HR    │ John  │  65000 │
│ HR    │ Meera │  50000 │
│ IT    │ Asha  │  90000 │
│ IT    │ Kiran │  90000 │
│ Sales │ Sara  │  70000 │
│ Sales │ Lina  │  62000 │
╰───────┴───────┴────────╯`,
  },
  {
    q: "How do you find the 3rd highest salary in each department?",
    level: 'Coding round',
    a: "I use DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC), so the ranking restarts in each department and equal salaries share a rank. Then I keep the rows where the rank is 3. Departments with fewer than three different salaries simply don't appear, which I'd mention to the interviewer, and if they want one row per department I'd LEFT JOIN from the department list.",
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 90000), ('Ravi', 'IT', 80000),
  ('Kiran', 'IT', 80000), ('Neha', 'IT', 70000), ('Meera', 'HR', 65000),
  ('John', 'HR', 50000), ('Lina', 'HR', 45000), ('Sara', 'Sales', 70000);

WITH ranked AS (
  SELECT name, dept, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM emp
)
SELECT dept, name, salary FROM ranked WHERE rnk = 3 ORDER BY dept;`,
    output: `╭──────┬──────┬────────╮
│ dept │ name │ salary │
╞══════╪══════╪════════╡
│ HR   │ Lina │  45000 │
│ IT   │ Neha │  70000 │
╰──────┴──────┴────────╯`,
  },
  {
    q: "How do you rank products by total sales within each category?",
    level: 'Coding round',
    a: "I first total the sales per product with GROUP BY, then rank those totals with RANK() OVER (PARTITION BY category ORDER BY total DESC). Window functions run after GROUP BY, so I can even put SUM(...) inside the window's ORDER BY in one query.",
    code: `CREATE TABLE sales (category TEXT, product TEXT, amount INT);
INSERT INTO sales VALUES ('Office', 'Pen', 100), ('Office', 'Pen', 150),
  ('Office', 'Stapler', 400), ('Kitchen', 'Mug', 300), ('Kitchen', 'Bowl', 320);

SELECT category, product, SUM(amount) AS total,
  RANK() OVER (PARTITION BY category ORDER BY SUM(amount) DESC) AS rnk
FROM sales
GROUP BY category, product
ORDER BY category, rnk;`,
    output: `╭──────────┬─────────┬───────┬─────╮
│ category │ product │ total │ rnk │
╞══════════╪═════════╪═══════╪═════╡
│ Kitchen  │ Bowl    │   320 │   1 │
│ Kitchen  │ Mug     │   300 │   2 │
│ Office   │ Stapler │   400 │   1 │
│ Office   │ Pen     │   250 │   2 │
╰──────────┴─────────┴───────┴─────╯`,
  },
  {
    q: "How do you find customers who have never placed an order?",
    level: 'Coding round',
    a: "I LEFT JOIN customers to orders and keep the rows where the order side is NULL, meaning no match was found. NOT EXISTS works equally well and is often clearer. I avoid NOT IN here, because if orders.customer_id has a NULL, NOT IN returns no rows at all.",
    code: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'), (3, 'Meera');
INSERT INTO orders VALUES (100, 1), (101, 3), (102, NULL);

SELECT c.name FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;

SELECT COUNT(*) AS not_in_trap FROM customers  -- NULL in list: 0 rows
WHERE id NOT IN (SELECT customer_id FROM orders);`,
    output: `╭──────╮
│ name │
╞══════╡
│ Ravi │
╰──────╯

╭─────────────╮
│ not_in_trap │
╞═════════════╡
│           0 │
╰─────────────╯`,
  },
  {
    q: "How do you calculate a running total?",
    level: 'Coding round',
    a: "I use SUM() as a window function with ORDER BY inside OVER, so each row adds its value to all the rows before it. Adding PARTITION BY restarts the total per group, like per customer or per month. Before window functions this needed a slow correlated subquery.",
    code: `CREATE TABLE payments (day TEXT, customer TEXT, amount INT);
INSERT INTO payments VALUES ('2026-01-01', 'Asha', 100),
  ('2026-01-02', 'Ravi', 50), ('2026-01-03', 'Asha', 200);

SELECT day, customer, amount,
  SUM(amount) OVER (ORDER BY day) AS running_total,
  SUM(amount) OVER (PARTITION BY customer ORDER BY day) AS customer_running
FROM payments ORDER BY day;`,
    output: `╭────────────┬──────────┬────────┬───────────────┬──────────────────╮
│    day     │ customer │ amount │ running_total │ customer_running │
╞════════════╪══════════╪════════╪═══════════════╪══════════════════╡
│ 2026-01-01 │ Asha     │    100 │           100 │              100 │
│ 2026-01-02 │ Ravi     │     50 │           150 │               50 │
│ 2026-01-03 │ Asha     │    200 │           350 │              300 │
╰────────────┴──────────┴────────┴───────────────┴──────────────────╯`,
  },
  {
    q: "How do you find users who logged in on 3 or more consecutive days?",
    level: 'Coding round',
    a: "First I remove duplicate logins on the same day, then I use the gaps and islands trick: the date minus ROW_NUMBER days stays the same during a streak. I group by user and that anchor date, and keep streaks with COUNT(*) >= 3. Deduplicating first is the part people forget, because two logins on one day would break the row-number trick.",
    code: `CREATE TABLE logins (user_id INT, login_date TEXT);
INSERT INTO logins VALUES (1, '2026-05-01'), (1, '2026-05-02'), (1, '2026-05-02'),
  (1, '2026-05-03'), (2, '2026-05-01'), (2, '2026-05-03'), (2, '2026-05-04');

WITH days AS (SELECT DISTINCT user_id, login_date FROM logins),
streaks AS (
  SELECT user_id, login_date, date(login_date, '-' || ROW_NUMBER() OVER
    (PARTITION BY user_id ORDER BY login_date) || ' days') AS anchor
  FROM days)
SELECT user_id, MIN(login_date) AS streak_start, COUNT(*) AS days
FROM streaks GROUP BY user_id, anchor HAVING COUNT(*) >= 3;`,
    output: `╭─────────┬──────────────┬──────╮
│ user_id │ streak_start │ days │
╞═════════╪══════════════╪══════╡
│       1 │ 2026-05-01   │    3 │
╰─────────┴──────────────┴──────╯`,
  },
  {
    q: "How do you calculate month-over-month revenue growth?",
    level: 'Coding round',
    a: "I first aggregate revenue per month, then use LAG to bring the previous month's revenue onto the same row. Growth is (current - previous) * 100.0 / previous; multiplying by 100.0 avoids integer division, and the first month gives NULL because there's nothing to compare with. If a month could have no sales at all, I'd generate the months with a calendar table or recursive CTE so LAG compares the right months.",
    code: `CREATE TABLE orders (placed_on TEXT, amount INT);
INSERT INTO orders VALUES ('2026-01-05', 1000), ('2026-02-11', 1200), ('2026-03-02', 900);

WITH monthly AS (
  SELECT strftime('%Y-%m', placed_on) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY month
), m AS (SELECT *, LAG(revenue) OVER (ORDER BY month) AS prev_revenue FROM monthly)
SELECT month, revenue, prev_revenue,
  ROUND((revenue - prev_revenue) * 100.0 / prev_revenue, 1) AS growth_pct
FROM m;`,
    output: `╭─────────┬─────────┬──────────────┬────────────╮
│  month  │ revenue │ prev_revenue │ growth_pct │
╞═════════╪═════════╪══════════════╪════════════╡
│ 2026-01 │    1000 │              │            │
│ 2026-02 │    1200 │         1000 │       20.0 │
│ 2026-03 │     900 │         1200 │      -25.0 │
╰─────────┴─────────┴──────────────┴────────────╯`,
  },
  {
    q: "How do you calculate the median salary?",
    level: 'Coding round',
    a: "Not every database has a MEDIAN function: PostgreSQL uses PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary). A portable way is to number the rows in order with ROW_NUMBER, count them, and average the middle one or two rows: for an odd count both picks are the same row, and for an even count it averages the two middle values. For the usual per-department follow-up, I add PARTITION BY dept to both windows and GROUP BY dept.",
    code: `CREATE TABLE emp (name TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 90000), ('Ravi', 50000), ('Kiran', 70000), ('Tom', 80000);

WITH ordered AS (
  SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) AS rn,
         COUNT(*) OVER () AS cnt
  FROM emp
)
SELECT AVG(salary) AS median_salary FROM ordered
WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);`,
    output: `╭───────────────╮
│ median_salary │
╞═══════════════╡
│       75000.0 │
╰───────────────╯`,
  },
]
