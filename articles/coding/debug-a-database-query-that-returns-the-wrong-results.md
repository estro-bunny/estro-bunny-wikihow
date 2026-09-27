---
title: "Debug a Database Query That Returns the Wrong Results"
category: coding
type: guide
chaos: 3
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - sql
  - debugging
  - queries
---
# How to Debug a Database Query That Returns the Wrong Results

A database query that returns the wrong results is one of the most dangerous kinds of bugs because the query usually looks reasonable.

The database may be doing exactly what you asked.

You just asked for the wrong thing.

This guide provides a controlled procedure for determining whether the problem is the data, the query, the joins, the filters, the assumptions, or EstroBunny.

> **Warning:** Do not rewrite the entire query before determining which part produces the incorrect result. You will lose the evidence and gain several new problems.

## Things You'll Need

- The failing query
- A known example of an incorrect result
- The expected result
- Access to the relevant tables and schema
- A database client or SQL console
- Enough patience to inspect the data instead of arguing with it

## Step 1: Define What "Wrong" Means

Before changing the query, write down the expected result.

Record:

- Which rows should appear
- Which rows should not appear
- Which columns should be returned
- Expected row count
- Relevant IDs or unique identifiers
- Any important ordering requirements

Do not use "it looks wrong" as the entire specification.

Find one concrete example.

For example:

```text
Expected: customer 42 appears once
Actual: customer 42 appears three times
```

That is something you can investigate.

## Step 2: Run the Query Without the Application

Execute the SQL directly in your database client.

If the database returns the wrong result directly, the problem is probably in the query, data, schema, or database state.

If the database returns the correct result but your application shows the wrong result, investigate:

- Application-side filtering
- Mapping or serialization
- Caching
- Pagination
- Sorting
- Data transformation
- Stale frontend state

Do not modify SQL to fix a bug that happens after SQL has already succeeded.

### The EstroBunny Rule of Evidence

> If the database gave you the correct answer and your application changed it afterward, the database is not currently on trial.

## Step 3: Inspect the Raw Data

Query the relevant table directly.

For example:

```sql
SELECT *
FROM customers
WHERE id = 42;
```

Confirm that the underlying data matches your assumptions.

Check for:

- Duplicate records
- Unexpected `NULL` values
- Unexpected status values
- Incorrect timestamps
- Case differences
- Trailing spaces
- Old records
- Soft-deleted records
- Test data
- Multiple records representing what you thought was one entity

Sometimes the query is correct and the data is simply not what you thought it was.

EstroBunny does not enjoy this answer.

EstroBunny must nevertheless accept it.

## Step 4: Remove the WHERE Clause Carefully

If filtering is suspected, inspect the query without one condition at a time.

Start with the smallest useful query:

```sql
SELECT id, status
FROM orders;
```

Then add the filter:

```sql
SELECT id, status
FROM orders
WHERE status = 'active';
```

Compare the results.

Repeat for additional conditions.

This identifies which predicate changes the result set.

Do not delete every condition at once and then announce that SQL is working.

You have not debugged the query.

You have removed the query.

## Step 5: Check NULL Logic

`NULL` is not the same thing as an empty string, zero, or false.

For example, this does not find rows where `deleted_at` is `NULL`:

```sql
WHERE deleted_at = NULL
```

Use:

```sql
WHERE deleted_at IS NULL
```

Similarly, use `IS NOT NULL` when appropriate.

Remember that SQL's three-valued logic can make comparisons involving `NULL` behave differently from ordinary boolean expressions.

### The NULL Incident

EstroBunny has discovered a record that is simultaneously not equal to a value and not equal to its opposite.

She has been informed that this is normal.

She does not accept this emotionally.

## Step 6: Investigate JOINs

Unexpected duplicates are frequently caused by joins.

Suppose one customer has several orders.

A query joining customers to orders can produce multiple rows for the same customer.

Start by inspecting the join directly:

```sql
SELECT c.id, o.id
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.id
WHERE c.id = 42;
```

Ask:

- Is the join condition correct?
- Is the relationship one-to-one or one-to-many?
- Should unmatched rows appear?
- Should the query use `INNER JOIN`, `LEFT JOIN`, or another join type?
- Are additional joins multiplying rows?

Do not add `DISTINCT` merely because duplicate rows look ugly.

First determine why the duplicates exist.

`DISTINCT` can hide a modeling or join problem instead of fixing it.

## Step 7: Check JOIN Direction and Missing Rows

Changing a join type can change which records are included.

For example, an `INNER JOIN` excludes rows without a matching record.

A `LEFT JOIN` preserves rows from the left side even when there is no match.

If expected records disappear, inspect the join type.

If unexpected records appear, inspect the join condition.

A missing row is evidence.
A duplicate row is evidence.
A suspiciously perfect result is also evidence.

## Step 8: Inspect AND/OR Logic

SQL conditions can produce unexpected results when `AND` and `OR` are combined without explicit grouping.

For example:

```sql
WHERE status = 'active'
  AND role = 'admin'
  OR role = 'owner';
```

Depending on operator precedence, this is not necessarily equivalent to:

```sql
WHERE status = 'active'
  AND (role = 'admin' OR role = 'owner');
```

When the intended logic matters, use parentheses.

Do not make the reader reconstruct your boolean expression from a wall of operators.

## Step 9: Check Aggregation

If the query uses `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, or similar functions, inspect the grouping.

Ask:

- What does one output row represent?
- Is `GROUP BY` grouping at the intended level?
- Are joins multiplying rows before aggregation?
- Should the condition be in `WHERE` or `HAVING`?

`WHERE` filters rows before grouping.
`HAVING` filters groups after aggregation.

Confusing them can produce results that are technically valid and completely useless.

## Step 10: Check Date and Time Conditions

Date filtering causes an unreasonable amount of suffering.

Verify:

- Time zone
- Timestamp precision
- Inclusive versus exclusive boundaries
- Date-only values
- Daylight-saving behavior where relevant
- Whether the application and database use the same time interpretation

For a range, be explicit about the boundary you intend.

A query asking for records before midnight is not automatically the same as one asking for records through midnight.

Also check whether your application converted the timestamp before the query was executed.

EstroBunny has found a timezone bug hiding behind a completely innocent-looking date.

She has now declared war on midnight.

## Step 11: Inspect ORDER BY and LIMIT

Sometimes the query returns the correct rows but displays the wrong subset.

Check:

- `ORDER BY` columns
- Sort direction
- Ties
- `LIMIT`
- `OFFSET`
- Pagination logic

A query using `LIMIT 10` without a meaningful ordering may not provide a stable set of ten records.

If pagination is involved, verify that the application is not accidentally requesting a different page than the one you inspected manually.

## Step 12: Reduce the Query to Its Smallest Working Parts

Now isolate the query.

Start with:

```sql
SELECT id
FROM your_table;
```

Then add:

1. The required columns
2. One filter
3. The next filter
4. One join
5. The next join
6. Grouping
7. Ordering
8. Pagination

After each change, compare the result with the previous step.

This gives you a **Query Evidence Trail™**.

If the results become wrong immediately after adding one clause, you have found the suspicious section.

## Step 13: Compare the Actual SQL Sent by the Application

Your application may not be executing the SQL you think it is.

Inspect the actual query and parameters where your tooling safely permits it.

Check for:

- Unexpected parameter values
- Empty parameters
- Wrong IDs
- Incorrect date ranges
- Different environment configuration
- Query builder conditions you forgot about
- Automatic tenant or authorization filters
- ORM-generated joins

Do not copy production secrets into a debugging transcript.

Redact sensitive values before sharing logs.

## Step 14: Investigate the ORM Before Blaming SQL

If you use an ORM or query builder, inspect the generated SQL when possible.

Your code might look like:

```text
find active customers with recent orders
```

while the database receives something considerably more ambitious.

Verify:

- Generated SQL
- Bound parameters
- Join behavior
- Default scopes
- Soft-delete filters
- Eager loading
- Pagination
- Transaction state

At this stage, EstroBunny has discovered that the query was technically correct, the data was technically correct, and the ORM had quietly added another condition.

Nobody is allowed to speak for thirty seconds.

## Common Mistakes

### Adding DISTINCT Immediately

`DISTINCT` can remove visible duplicates while hiding the join that caused them.

Find the cause first.

### Adding More Filters

More filters do not make an incorrect query more correct.

They can simply make the wrong result smaller.

### Assuming the Data Is Unique

If the schema does not enforce uniqueness, your application assumption does not magically create it.

Check the actual constraints and data.

### Ignoring NULL

`NULL` has its own comparison behavior. Treat it explicitly.

### Testing Only the Happy Case

Test records with missing relationships, multiple relationships, boundary dates, unexpected statuses, and empty values.

### Fixing the Application Before Proving the Database Is Wrong

First establish where the incorrect result appears.

Then fix that layer.

## Emergency Procedure

If the query is still returning the wrong results:

1. Save the exact query and parameters.
2. Save one concrete incorrect result.
3. Write down the expected result.
4. Query the underlying records directly.
5. Remove filters one at a time.
6. Inspect every join.
7. Check `NULL` behavior.
8. Check aggregation and grouping.
9. Check date boundaries and time zones.
10. Check ordering and pagination.
11. Inspect ORM-generated SQL if applicable.
12. Reproduce the smallest failing query.
13. Make one change.
14. Record what changed.

If the query affects production data, stop before making destructive changes.

Debugging a SELECT statement is one thing.
Debugging a DELETE statement because you were tired is an entirely different WikiHow article.

## Congratulations!

You have identified why the database returned the wrong result without adding `DISTINCT`, deleting half the query, blaming the ORM, or manually fixing the output in JavaScript.

The query is smaller.
The evidence is documented.
The joins have been interrogated.
The `NULL` values have been acknowledged.

EstroBunny is staring at the execution plan.

She has found another join.

Do not make eye contact.

**still here 🏳️‍⚧️**