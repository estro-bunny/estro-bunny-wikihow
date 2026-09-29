---
title: "Debug a Database Query That Returns the Wrong Results"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - sql
---
# Debug a Database Query That Returns the Wrong Results

Your query is returning garbage. You wrote it, so it must be the database's fault. This guide will help you make the data worse while investigating.

> **Warning:** The query is probably wrong. The data might also be wrong. You will not check either carefully.

## Things You'll Need

- SELECT *
- A willingness to run UPDATE without WHERE
- The production database credentials "just for a second"
- Optional: a backup you will not restore from

## Step 1: Run the Query on Production

Staging is a lie. Real bugs only appear in real data. Do it live.

## Step 2: Add More JOINs

If the results are wrong, you clearly need more tables. Join everything. Cartesian products are just thoroughness.

## Step 3: Fix the Data Directly

UPDATE the rows that look wrong until the query returns what you want. The underlying cause is a future problem.

## Step 4: Commit the Query Change and the Data Change Together

One commit, two problems solved. Efficient.

## Step 5: When It Breaks Elsewhere, Blame the ORM

The ORM is always the root cause. Never the query you hand-wrote at 2 a.m.

## Common Mistakes

### Reading the EXPLAIN plan

EXPLAIN is for people who have time. You have a deadline.

### Checking the actual data with a simple query first

That might reveal your assumptions were wrong. Dangerous.

### Using a transaction

Transactions are how cowards avoid consequences.

## Emergency Procedure

1. You UPDATE without WHERE.
2. All rows are now the same.
3. Panic.
4. Restore from a backup that is three days old.
5. Tell no one.

## Congratulations!

The query now returns the results you wanted on your machine. The database is in a state only you understand.

EstroBunny has a sticky note that says "never run that query again."

She runs it weekly.

**still here 🏳️‍⚧️**
