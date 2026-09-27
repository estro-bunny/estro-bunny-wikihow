# How to Recover From a Failed Database Migration Without Making the Outage Worse

A failed database migration is already a problem.

Turning it into a larger outage is optional.

When a migration fails during a deployment, the immediate goal is not to make the schema beautiful. The immediate goal is to stabilize the system, understand the current state, protect the data, and restore service using the smallest controlled change.

This guide focuses on recovery after the failure has already happened.

> **Warning:** Do not perform destructive database changes during an incident unless you understand the current state, have an appropriate recovery path, and have confirmed the action is necessary.

## Things You'll Need

- The failed migration and deployment logs
- Database access
- Application deployment information
- A known-good application version if available
- A verified backup or recovery mechanism
- A way to monitor application errors and database health
- One calm person who is authorized to say "stop"

## Step 1: Stop the Escalation

First, prevent additional changes.

Depending on your deployment system, this may mean:

- Pausing automatic deployments
- Disabling automatic migration retries
- Stopping the affected rollout
- Preventing multiple operators from running recovery commands simultaneously
- Freezing unrelated schema changes

Do not keep retrying the failed migration while investigating.

If a command failed because the database is locked, retrying it ten times does not make the lock less real.

### The EstroBunny Incident Rule

> During an outage, fewer moving parts are generally easier to reason about than more moving parts.

EstroBunny would like to add three more.

Do not let her.

## Step 2: Establish Whether the Application Is Actually Down

Check the user-visible impact.

Determine:

- Are requests failing?
- Which endpoints are affected?
- Are failures global or limited to one feature?
- Are reads working?
- Are writes working?
- Are background jobs failing?
- Are database connections healthy?
- Did the application deployment complete?

Do not assume that a failed migration automatically means the entire application is unavailable.

Measure the impact before choosing the recovery.

## Step 3: Freeze the Timeline

Record what happened and when.

Capture:

- Application deployment time
- Migration start time
- Migration failure time
- First observed application errors
- Last known-good deployment
- Relevant configuration changes
- Recovery actions already taken

Create a simple timeline:

```text
18:04  deployment started
18:05  migration started
18:06  migration failed
18:06  application errors increased
18:08  deployment paused
18:11  investigation started
```

This prevents the incident from becoming a collection of contradictory memories.

## Step 4: Preserve Evidence Before Repairing Anything

Save the relevant logs and error messages.

Record:

- Exact migration version
- Exact database error
- SQL statement that failed
- Statements known to have succeeded
- Migration-tool state
- Current application version
- Current database schema state

Do not modify migration files just to make the logs look cleaner.

The failure is evidence.

Keep it.

## Step 5: Determine the Database State

Now establish what actually changed.

Inspect the database for every significant operation in the failed migration.

For example:

| Operation | Expected | Current State |
|---|---|---|
| Add column | Present | Present |
| Create index | Present | Present |
| Add constraint | Present | Missing |
| Backfill data | Complete | Partial |

Do not use the migration file as proof that the database matches it.

The migration describes intent.

The database contains state.

## Step 6: Check Migration Transaction Behavior

Determine whether the migration was executed inside a transaction and whether every operation involved could participate in that transaction.

Verify:

- Database engine
- Database version
- Migration framework
- Migration configuration
- Transaction boundaries
- Statements that may have special transactional behavior

If the migration rolled back completely, recovery may be very different from a migration that left several operations committed.

Do not guess.

## Step 7: Check Application and Schema Compatibility

Ask one important question:

> Can the currently running application safely operate against the database in its current state?

For example, an application may expect a column that does not exist.

Or the database may already contain a new column while the old application version is still running.

Check:

- Reads
- Writes
- New columns
- Removed columns
- New constraints
- Changed data types
- Renamed objects
- Background jobs

An application rollback does not automatically mean the database should be rolled back.

Database changes and application deployments can have different compatibility requirements.

## Step 8: Consider Application Rollback Before Database Rollback

If the new application version is incompatible with the current schema, returning to a known-good application version may restore service without reversing database changes.

This can be safer when the database changes are backward-compatible.

Before rolling back the application, verify that the older version can operate against the current schema.

Do not blindly assume:

```text
failed deployment → rollback application → everything fixed
```

The old application may still encounter the partially changed schema.

Test the compatibility.

## Step 9: Identify the Smallest Safe Recovery

Possible recovery paths include:

- Completing a missing schema change
- Applying a narrowly scoped corrective migration
- Rolling back the application
- Restoring from a verified backup
- Temporarily disabling an affected feature
- Redirecting traffic to a known-good environment

Choose based on the actual state and blast radius.

Prefer a recovery that is:

- Understandable
- Observable
- Reversible where possible
- Small in scope
- Tested before production when practical

Do not choose a recovery because it has the fewest characters in the command line.

## Step 10: Do Not Rewrite Migration History During the Incident

It may be tempting to mark the failed migration as successful so the deployment system stops complaining.

Do not do this unless your migration framework's documented recovery process explicitly requires it and you have verified the schema state.

Changing migration history does not change the database.

It only changes what the migration system believes.

Those two things must eventually agree.

## Step 11: Be Extremely Careful With Data Repair

Schema recovery and data recovery are not the same problem.

If a migration partially modified data, determine:

- Which rows changed
- Which rows should have changed
- Whether the operation is repeatable
- Whether duplicates could be created
- Whether an audit trail exists
- Whether a backup can provide a trusted reference

Do not run a giant UPDATE against production because the WHERE clause "looks right."

First test the selection:

```sql
SELECT id
FROM users
WHERE display_name IS NULL;
```

Then determine whether those rows are actually the intended target.

Only after validation should you consider the corresponding data modification.

## Step 12: Take a Backup or Verify Your Recovery Point

If the database is in a state where destructive repair is being considered, verify that you have an appropriate recovery mechanism.

Depending on the environment, this may involve:

- A recent backup
- A tested restore
- Point-in-time recovery
- Database snapshots
- Replication
- Another documented recovery mechanism

A backup that has never been restored is a plan.

A tested restore is evidence.

## Step 13: Test the Recovery Procedure

When practical, reproduce the relevant database state in a safe environment.

Apply the proposed recovery.

Verify:

- Schema
- Data
- Constraints
- Indexes
- Application compatibility
- Migration history
- Subsequent migrations

If the recovery procedure cannot be understood or reproduced outside production, pause before turning production into the test environment.

## Step 14: Apply One Controlled Recovery

Once the recovery path is understood, execute the smallest necessary change.

One person should coordinate the operation.

Record:

- Exact command or migration
- Start time
- End time
- Result
- Any unexpected output

Do not mix unrelated cleanup into the recovery.

Today is not the day to rename twelve tables because you have finally found the motivation.

## Step 15: Verify Service Recovery

Do not stop when the command succeeds.

Verify the application.

Check:

- Error rates
- Database connection health
- Affected endpoints
- Reads
- Writes
- Background jobs
- Queue processing
- User-visible functionality

Compare metrics with the known-good baseline.

A successful migration command is not the same thing as a recovered service.

## Step 16: Watch for Delayed Damage

Some failures do not appear immediately.

Continue monitoring for:

- Increased query latency
- Constraint violations
- Duplicate records
- Failed background jobs
- Queue buildup
- Replication problems
- Unexpected application errors

Give the system time to demonstrate that recovery actually worked.

EstroBunny has declared the incident resolved after eleven seconds.

EstroBunny has been informed that eleven seconds is not a monitoring window.

She is offended.

## Step 17: Document the Final State

After service is stable, document:

- What failed
- What had already changed
- What recovery was performed
- Why that recovery was selected
- What was verified
- What remains to be repaired later

If the migration remains incomplete, create a clear follow-up item.

Do not leave the next engineer a database that works only because everyone has memorized the incident.

## Common Mistakes

### Rerunning the Migration Until It Works

A migration that partially applied may fail differently each time.

Determine state before retrying.

### Dropping the New Objects

Removing a partially created object may break an application that already expects it.

Check dependencies first.

### Restoring the Entire Database Immediately

A full restore may discard valid changes made after the backup.

Evaluate the blast radius before choosing restoration.

### Rolling Back the Application Without Checking Schema Compatibility

The previous application version may not work with the current database.

Verify first.

### Repairing Data Without a Selection Query

If you cannot explain which rows will change, do not run the UPDATE.

### Letting Multiple People Run Recovery Commands

Two operators executing different repairs at the same time can turn a controlled recovery into a race condition.

Coordinate one recovery path.

## Emergency Procedure

If the migration failed and the outage is actively affecting users:

1. Stop automated migrations and deployments.
2. Identify the affected application functionality.
3. Establish the last known-good application and database states.
4. Preserve logs and migration evidence.
5. Determine the actual schema and data state.
6. Determine transaction behavior.
7. Check application/schema compatibility.
8. Identify the smallest safe recovery.
9. Verify backup or recovery capability before destructive changes.
10. Test the recovery when practical.
11. Apply one controlled change.
12. Verify service behavior.
13. Monitor for delayed failures.
14. Document the final state.

If the database contains critical production data and the correct recovery path is uncertain, escalate to the responsible database/operations team rather than improvising destructive commands.

## Congratulations!

You recovered from a failed database migration without turning one incident into a trilogy.

The outage is contained.
The database state is understood.
The recovery is documented.
The monitoring is watching.

Most importantly, nobody typed:

```text
DROP DATABASE production;
```

as a joke.

EstroBunny is proud.

She has put the production mouse down.

Do not tell her where the keyboard is.

**still here 🏳️‍⚧️**