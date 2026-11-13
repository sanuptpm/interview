// SQL examples for the new Database questions (run by sql_run.mjs).
export const CASES = [
  {
    q: 'How do you paginate results with LIMIT and OFFSET?',
    code: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO products (name) VALUES ('Pen'), ('Book'), ('Bag'), ('Cup'), ('Lamp');

-- page 2 with 2 rows per page: OFFSET = (page - 1) * 2
SELECT id, name FROM products ORDER BY id LIMIT 2 OFFSET 2;`,
  },
  {
    q: 'What do COALESCE, IFNULL and NULLIF do?',
    code: `CREATE TABLE users (name TEXT, nickname TEXT, phone TEXT);
INSERT INTO users VALUES ('Asha', NULL, '555-0101'),
                         ('Ravi', 'Rav', ''), ('Meera', NULL, NULL);

SELECT name,
       COALESCE(nickname, name) AS display_name,
       IFNULL(phone, 'none') AS phone,
       NULLIF(phone, '') AS empty_as_null
FROM users;`,
  },
  {
    q: 'How do you convert data types with CAST?',
    code: `SELECT CAST('42' AS INTEGER) + 8 AS num,
       7 / 2 AS int_division,
       CAST(7 AS REAL) / 2 AS real_division,
       CAST(3.99 AS INTEGER) AS truncated,
       CAST(2026 AS TEXT) || '-01' AS text_value;`,
  },
  {
    q: 'Which math functions do you use in SQL (ROUND, ABS, CEIL, FLOOR, MOD)?',
    code: `SELECT ROUND(19.456, 2) AS rounded,
       ABS(-15) AS absolute,
       CAST(CEIL(4.1) AS INTEGER) AS ceil,
       CAST(FLOOR(4.9) AS INTEGER) AS floor,
       17 % 5 AS remainder;`,
  },
  {
    q: 'What is the difference between INTERSECT and EXCEPT?',
    code: `CREATE TABLE online (customer TEXT);
CREATE TABLE store (customer TEXT);
INSERT INTO online VALUES ('Asha'), ('Ravi'), ('John');
INSERT INTO store VALUES ('Ravi'), ('Meera'), ('John');

SELECT customer FROM online INTERSECT SELECT customer FROM store;

SELECT customer FROM online EXCEPT SELECT customer FROM store;`,
  },
  {
    q: 'What do ANY and ALL do with a subquery?',
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
                       ('Meera', 'HR', 60000), ('John', 'HR', 40000);

-- salary > ALL (SELECT salary ... 'HR') is the same as > MAX
SELECT name FROM emp WHERE salary > (SELECT MAX(salary) FROM emp WHERE dept = 'HR');

-- salary > ANY (SELECT salary ... 'HR') is the same as > MIN
SELECT name FROM emp WHERE salary > (SELECT MIN(salary) FROM emp WHERE dept = 'HR');`,
  },
  {
    q: 'What do FIRST_VALUE and LAST_VALUE do?',
    code: `CREATE TABLE emp (name TEXT, dept TEXT, salary INT);
INSERT INTO emp VALUES ('Asha', 'IT', 70000), ('Ravi', 'IT', 50000),
                       ('Meera', 'HR', 60000), ('John', 'HR', 40000);

SELECT name, dept, salary,
  FIRST_VALUE(name) OVER (PARTITION BY dept ORDER BY salary DESC) AS top_paid,
  LAST_VALUE(name) OVER (PARTITION BY dept ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lowest_paid
FROM emp ORDER BY dept, salary DESC;`,
  },
  {
    q: 'What is the difference between GROUP BY and a window function like SUM() OVER?',
    code: `CREATE TABLE sales (region TEXT, amount INT);
INSERT INTO sales VALUES ('North', 100), ('North', 50), ('South', 80);

SELECT region, SUM(amount) AS total FROM sales GROUP BY region;

SELECT region, amount,
       SUM(amount) OVER (PARTITION BY region) AS region_total
FROM sales ORDER BY region, amount DESC;`,
  },
  {
    q: 'How do you create and change a table with CREATE TABLE and ALTER TABLE?',
    code: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO users (name) VALUES ('Asha');

ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users RENAME COLUMN name TO full_name;
ALTER TABLE users RENAME TO customers;

SELECT * FROM customers;`,
  },
  {
    q: 'What is the difference between a primary key and a unique key?',
    code: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE
);
INSERT INTO users VALUES (1, 'asha@x.com'), (2, NULL), (3, NULL);
INSERT INTO users VALUES (4, 'asha@x.com');
SELECT * FROM users;`,
  },
  {
    q: 'What are candidate, composite, surrogate and natural keys?',
    code: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,         -- surrogate key
  email TEXT UNIQUE NOT NULL      -- natural, candidate key
);
CREATE TABLE enrollments (
  student_id INT, course_id INT, grade TEXT,
  PRIMARY KEY (student_id, course_id)   -- composite key
);
INSERT INTO enrollments VALUES (1, 101, 'A'), (1, 102, 'B');
INSERT INTO enrollments VALUES (1, 101, 'C');`,
  },
  {
    q: 'What is the difference between a clustered and a non-clustered index?',
    code: `CREATE TABLE emp (id INTEGER PRIMARY KEY, email TEXT, name TEXT);
CREATE INDEX idx_email ON emp(email);

-- clustered: the table itself is stored in id order
EXPLAIN QUERY PLAN SELECT * FROM emp WHERE id = 5;

-- non-clustered: search idx_email, then jump to the row
EXPLAIN QUERY PLAN SELECT * FROM emp WHERE email = 'asha@x.com';`,
  },
  {
    q: 'What is an ER diagram, and what are one-to-one, one-to-many and many-to-many relationships?',
    code: `CREATE TABLE students (id INT PRIMARY KEY, name TEXT);
CREATE TABLE courses (id INT PRIMARY KEY, title TEXT);
-- many-to-many: a junction table with two foreign keys
CREATE TABLE enrollments (student_id INT REFERENCES students(id),
                          course_id INT REFERENCES courses(id));
INSERT INTO students VALUES (1, 'Asha'), (2, 'Ravi');
INSERT INTO courses VALUES (1, 'SQL'), (2, 'Git');
INSERT INTO enrollments VALUES (1, 1), (1, 2), (2, 1);

SELECT s.name, c.title FROM enrollments e
JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id;`,
  },
]
