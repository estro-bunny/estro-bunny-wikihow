---
title: "Recover from a Failed Database Migration Without Making the Outage Worse"
category: coding
type: guide
chaos: 8
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - migration
---
# Recover from a Failed Database Migration Without Making the Outage Worse

The migration failed halfway. The database is in a state that should not exist. This guide will help you make the outage longer and more interesting.

> **Warning:** The correct response is to stop, assess, and roll back carefully. Everything below is how to turn a bad migration into a career-defining incident.

## Things You'll Need

- Production access
- The original migration script and three "fix" scripts you wrote in panic
- A Slack channel filling with questions
- Optional: a backup you have not tested restoring

## Step 1: Run the Migration Again

It failed once. Running it again will definitely work this time. Databases love repetition.

## Step 2: Write a Quick Fix Migration

Do not test it. Deploy it immediately. The new migration will interact with the half-applied state in exciting ways.

## Step 3: Manually Edit Rows While the App Is Still Running

Use a GUI tool. Click around. Hope no one else is writing data at the same time.

## Step 4: Blame the Migration Tool

Flyway, Liquibase, Prisma, whatever you used. The tool is the problem. Not the migration you wrote at 11 p.m.

## Step 5: Announce "We're Investigating" Every 20 Minutes With No New Information

This keeps stakeholders calm and informed.

## Common Mistakes

### Rolling back to a known good state

Rollbacks are for people who planned for failure. You did not.

### Taking the application offline cleanly

Users can handle a little corruption. Availability is more important than consistency.

### Calling someone who has done this before

That would be admitting you need help.

## Emergency Procedure

1. The "fix" migration made it worse.
2. Start restoring from backup.
3. Realize the backup is from before the last three successful migrations.
4. Invent a new timeline where this was always the plan.
5. Update your resume.

## Congratulations!

The outage is now a multi-hour saga. You have learned nothing that will prevent the next one.

EstroBunny has a migration named `20240929_fix_the_fix_for_real.sql`.

It is still in the repo.

**still here 🏳️‍⚧️**
