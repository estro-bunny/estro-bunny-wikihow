# How to Debug a Database Migration That Partially Failed

A partially failed database migration is one of the most dangerous forms of database confusion because two things may now disagree about reality:

- The database schema
- The migration system's record of what has been applied

A migration may have created some objects, altered some rows, failed halfway through, and left the application somewhere between "working" and "absolutely not."

This guide provides a controlled procedure for determining what actually happened and recovering without making the situation worse.

> **Warning:** Do not blindly rerun a failed migration. First determine which statements succeeded, which failed, whether the migration was transactional, and what the migration tool believes happened.

## Things You'll Need

- The failed migration
- The migration tool's output or logs
- Database access
- The current schema
- A backup or verified recovery procedure
- Knowledge of the database engine's transaction behavior
- Enough restraint not to type `--force` immediately

## Step 1: Stop Making Changes

Before repairing anything, stop deployments and automated migration jobs that could modify the same database.

Do not immediately:

- Rerun the migration
- Delete the new column
- Drop the partially created table
- Edit the migration history by hand
- Run a second migration that attempts to fix the first one

First collect evidence.

### The EstroBunny Emergency Rule

> When the database is in an unknown state, every additional command is a potential witness destruction event.

Take a breath.

Then inspect.

## Step 2: Record Exactly Where the Migration Failed

Read the migration output carefully.

Identify:

- Migration name or version
- First failing statement
- Database error
- Statement immediately before the failure
- Statements after the failure that were never executed
- Whether the tool reported a rollback
- Whether the application was deployed before or after the migration

For example:

```text
0017_add_profile_fields
✓ ALTER TABLE users ADD COLUMN display_name
✓ CREATE INDEX users_email_idx
✗ ALTER TABLE users ADD CONSTRAINT users_role_check
```

This tells you that the migration did not necessarily fail as one indivisible operation.

The first two statements may already exist in the database.

## Step 3: Determine Whether the Migration Was Transactional

This is critical.

Some database engines and migration tools can execute migration statements inside a transaction. If the transaction rolls back successfully, earlier statements may have been undone.

Other operations may not be transactional, depending on the database engine and statement involved.

Check:

- Database engine
- Database version
- Migration framework
- Migration configuration
- Transaction settings
- Whether the failing statements support transactional rollback

Do not assume that "migration failed" means "nothing changed."

Also do not assume that "migration failed" means "everything before the error remains."

Find out.

## Step 4: Inspect the Actual Schema

Now inspect the database itself.

Check whether each expected change exists.

For a migration adding a column, verify:

- Does the column exist?
- What is its data type?
- Is it nullable?
- Does it have a default?
- Is the default correct?
- Is it part of an index or constraint?

For a table, verify:

- Does the table exist?
- Which columns exist?
- Which constraints exist?
- Which indexes exist?
- Which foreign keys exist?

For a data migration, verify:

- Which rows changed?
- Which rows did not change?
- Can the operation be safely identified and repeated?

The migration file tells you what was intended.

The database tells you what actually happened.

## Step 5: Compare Migration History With Reality

Most migration systems maintain a record of applied migrations.

Inspect that record using the migration tool's documented commands.

Determine:

- Does the failed migration appear as applied?
- Does it appear as failed?
- Is it absent?
- Does the tool report a partial state?
- Are later migrations marked as applied?

Do not manually edit migration metadata just to make the tool stop complaining.

Migration history is part of the evidence.

Changing it without understanding the schema can turn one inconsistency into two.

## Step 6: Build a Migration State Table

Write down what you know.

For example:

| Change | Expected | Actual |
|---|---|---|
| `display_name` column | Exists | Exists |
| `users_email_idx` | Exists | Exists |
| role constraint | Exists | Missing |
| data backfill | Complete | Unknown |

This separates known facts from assumptions.

Add another column if useful:

| Change | Expected | Actual | Evidence |
|---|---|---|---|

EstroBunny calls this the **Schema Crime Scene Report™**.

Nobody is allowed to say "I think it probably rolled back" until the table is filled in.

## Step 7: Check for Partial Data Changes

Schema changes are not the only concern.

A migration may also have changed data before failing.

Determine:

- How many rows were intended to change?
- How many rows actually changed?
- Can changed rows be identified?
- Can the operation be safely repeated?
- Could repeating it corrupt or duplicate data?

For example, a backfill such as:

```sql
UPDATE users
SET display_name = full_name
WHERE display_name IS NULL;
```

may be safely repeatable in some circumstances.

A data migration that inserts records without a reliable uniqueness rule may not be.

Never assume a data migration is idempotent just because the SQL looks simple.

## Step 8: Determine Whether the Migration Is Safe to Resume

Before rerunning anything, classify each statement.

### Already Applied

The database already has the intended result.

Do not blindly execute the statement again.

### Not Applied

The intended change is absent.

It may need to be executed, but only after confirming that doing so is safe.

### Partially Applied

The database contains an incomplete version of the intended change.

Determine whether the migration can safely finish from that state.

### Unknown

You do not have enough evidence.

Do not guess.

Investigate further.

## Step 9: Check Whether the Migration Is Idempotent

A migration is easier to recover when its operations can safely be repeated.

For example, blindly running:

```sql
CREATE TABLE profiles (...);
```

may fail if the table already exists.

Likewise, blindly adding a column that already exists may fail depending on the database and statement.

Do not rewrite a migration with `IF NOT EXISTS` purely to make the error disappear.

First determine whether that change preserves the intended schema and migration semantics.

## Step 10: Check the Application Compatibility

A partially applied migration can leave the application and database speaking different dialects of reality.

For example:

```text
Application expects: users.display_name
Database contains: users.full_name
```

Or:

```text
Application expects: new constraint
Database: constraint missing
```

Check whether the deployed application:

- Reads the new column
- Writes the new column
- Expects a new table
- Depends on a new index or constraint
- Assumes a data backfill has completed

If the migration is incomplete, determine whether the current application version can safely run against the current schema.

## Step 11: Check for Locking and Long-Running Operations

A migration can appear to fail because another transaction or process prevented it from completing.

Investigate:

- Active transactions
- Blocking sessions
- Lock waits
- Long-running queries
- Connection timeouts
- Database resource limits

If the database is still processing a related operation, do not immediately launch another copy of the same migration.

Two angry migrations do not cancel each other out.

They become a meeting.

## Step 12: Choose a Recovery Strategy

Once the actual state is known, choose one controlled recovery strategy.

Common possibilities include:

1. Complete the missing part safely.
2. Roll back the partial change using the migration tool's supported procedure.
3. Create a corrective migration.
4. Restore from a known-good backup when the state cannot be safely repaired in place.

The correct choice depends on the migration framework, database engine, data state, and deployment process.

Do not invent a rollback because the word "rollback" sounds comforting.

## Step 13: Prefer a Corrective Migration When Appropriate

If a migration has already been deployed to an environment and its partial effects are understood, a new corrective migration may be safer than rewriting history.

For example:

```text
0017_add_profile_fields       ← partially applied
0018_complete_profile_fields  ← repairs the known missing state
```

This preserves the historical record while explicitly documenting the repair.

However, do not create a corrective migration until you understand the current schema.

A corrective migration built on an incorrect assumption is simply another migration waiting for its own article.

## Step 14: Test the Recovery on a Reproduction

Before touching production again, reproduce the failure in a safe environment when possible.

Start with the same schema state.

Then test the recovery procedure.

Verify:

- Migration history
- Final schema
- Data integrity
- Constraints
- Indexes
- Application compatibility
- Ability to run later migrations

Run the recovery more than once if repeatability matters.

If the second run produces a different result, investigate why.

## Step 15: Verify the Final State

After recovery, verify the database independently of the migration tool.

Check:

- Expected schema exists
- Unexpected schema does not exist
- Data counts are correct
- Constraints are present
- Indexes are present
- Migration history is consistent
- Application queries succeed
- No unintended duplicate data exists

Do not stop at:

```text
Migration completed successfully.
```

The tool can report success while your assumptions remain wrong.

Verify the database.

## Common Mistakes

### Rerunning the Failed Migration Immediately

The migration may already have applied some operations.

Rerunning it can produce duplicate objects, new errors, or unintended data changes.

### Editing Migration History First

Changing the history does not repair the schema.

It only changes what the migration system believes.

### Assuming Transactions Guarantee Everything

Transaction behavior depends on the database, statement, framework, and configuration.

Verify it.

### Deleting Partial Changes Without Checking Dependencies

A partially created object may already be referenced by another operation or deployment.

Inspect dependencies first.

### Writing a Giant Repair Script

A huge repair script is harder to reason about and harder to validate.

Prefer small, observable recovery steps.

### Rewriting History in a Shared Environment

Changing an already-used migration can make different environments disagree about what happened.

Preserve history unless your migration process explicitly requires another approach.

## Emergency Procedure

If the migration partially failed and nobody is sure what state the database is in:

1. Stop automated migrations.
2. Record the exact migration and failure.
3. Determine transaction behavior.
4. Inspect the actual schema.
5. Inspect migration history.
6. Check for partial data changes.
7. Check application compatibility.
8. Record the state in a Schema Crime Scene Report™.
9. Back up or verify recovery procedures before destructive changes.
10. Choose one recovery strategy.
11. Test that strategy outside production when possible.
12. Apply the smallest controlled repair.
13. Verify schema, data, and migration history.
14. Only then resume deployments.

If the database contains critical production data and the state cannot be confidently determined, stop and involve the appropriate database or operations owner before performing destructive changes.

## Congratulations!

You have survived a partially failed migration without:

- Running it seventeen times
- Deleting the migration history
- Dropping the database
- Adding `IF NOT EXISTS` to everything
- Blaming the ORM
- Or whispering "it worked on staging" into an incident channel

The schema is known.
The migration history is understood.
The recovery is documented.
The database has stopped screaming.

EstroBunny is standing beside the production terminal.

She is holding the mouse with both hands.

Do not let her click anything.

**still here 🏳️‍⚧️**