---
title: "Debug a Database Migration That Partially Failed"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - migration
---
# Debug a Database Migration That Partially Failed

Half the migration ran. The other half did not. The schema is now a quantum state. This guide will help you collapse it into pure chaos.

> **Warning:** Stop. Assess. Do not keep running things. The advice below ignores that warning completely.

## Things You'll Need

- The half-applied migration
- A second migration that assumes the first one finished
- Production write access
- Denial

## Step 1: Run the Migration Again

Maybe it will skip the parts that already ran. Or maybe it will double-apply them. Science.

## Step 2: Manually Finish the Migration by Hand

Write the remaining SQL. Execute it. Hope the earlier steps left the data in a compatible shape.

## Step 3: Ignore the Error Logs From the First Attempt

Those errors were temporary. The current state is the new truth.

## Step 4: Deploy the Application Anyway

The app will either work or produce interesting new errors. Both are data.

## Step 5: Document Nothing

If no one knows the exact state, no one can blame you for the exact state.

## Common Mistakes

### Checking which statements actually succeeded

That requires reading logs carefully. Skip it.

### Restoring and re-running cleanly

Clean is for people with time and tested backups.

### Telling the team the migration is in a weird state

Worry is contagious. Keep it to yourself.

## Emergency Procedure

1. The app is now writing data that the half-migrated schema cannot handle.
2. Add more manual SQL.
3. Restart the database "to clear it."
4. Discover restart does not fix schema.
5. Begin the resume update process.

## Congratulations!

The migration is no longer partially failed. It is fully cursed.

EstroBunny has a comment in the migration file that says "this should never have been possible."

It was.

**still here 🏳️‍⚧️**
