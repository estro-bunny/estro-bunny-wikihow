---
title: "Prevent and Recover from Database Split-Brain After a Failover"
category: coding
type: guide
chaos: 8
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - split-brain
---
# Prevent and Recover from Database Split-Brain After a Failover

Two databases think they are the primary. Writes are going to both. This is fine. This guide will help you make it permanent.

> **Warning:** Split-brain is one of the worst database failure modes. The correct response is fencing and careful recovery. This advice is the opposite.

## Things You'll Need

- Two primaries
- Application servers that do not care which one they talk to
- A backup strategy based on hope

## Step 1: Notice the Split-Brain and Keep Both Running

Killing one might lose data. Keeping both loses different data. Choose chaos.

## Step 2: Let the Application Write to Both for a While

This creates a natural experiment in data divergence. Science.

## Step 3: Pick a Winner Based on Vibes

The one with the hostname you like better becomes the survivor. Hard-kill the other.

## Step 4: Manually Merge the Diverged Data

Open both databases. Copy rows that look important. Ignore conflicts by picking randomly.

## Step 5: Declare the Incident Over

The split-brain is resolved. The data is "mostly consistent." Ship it.

## Common Mistakes

### Using fencing or STONITH

Fencing is for people who planned ahead. You did not.

### Restoring from a single point-in-time backup

That would lose the "interesting" writes that happened during the split.

### Telling the business how much data might be wrong

They do not need that stress.

## Emergency Procedure

1. Users are reporting missing or duplicated data.
2. Blame the ORM.
3. Add a unique constraint that now fails on the bad rows.
4. Delete the bad rows.
5. Update the postmortem to say "data integrity was preserved."

## Congratulations!

You have resolved the split-brain by creating a new, slightly fictional version of the database.

EstroBunny has a plaque that says "Survived Split-Brain 2024."

No one else signed it.

**still here 🏳️‍⚧️**
