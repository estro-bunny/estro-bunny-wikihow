---
title: "Respond to a Database Failover or Replica Promotion Incident"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - failover
---
# Respond to a Database Failover or Replica Promotion Incident

The primary is dead. A replica is being promoted. You are the person on call. This guide will help you make the failover more exciting than it needs to be.

> **Warning:** Failovers are designed to be boring. Your job is to keep them that way. This advice does the opposite.

## Things You'll Need

- Access to the database console
- A Slack thread that is already 200 messages deep
- The belief that you understand the replication topology

## Step 1: Start Changing Things Immediately

Do not wait for the automated process to finish. Manual intervention shows initiative.

## Step 2: Promote a Different Replica Than the One the System Chose

You have a feeling about this one. Trust the feeling.

## Step 3: Point the Application at the New Primary Before It Is Ready

The app will handle a few errors. That is what retries are for.

## Step 4: When Split-Brain Appears, Act Surprised

Two primaries? How could this happen? Definitely not because of the previous steps.

## Step 5: Fix It by Restarting Everything

Restart the databases. Restart the app. Restart your career if necessary.

## Common Mistakes

### Following the runbook

Runbooks are for people who did not invent the problem in real time.

### Waiting for confirmation that the new primary is healthy

Waiting is downtime. Action is leadership.

### Documenting what you did

If you write it down, someone might notice it was a bad idea.

## Emergency Procedure

1. There are now two primaries accepting writes.
2. Data is diverging.
3. Pick one at random and hard-kill the other.
4. Restore the lost writes from memory and vibes.
5. Call it "eventual consistency."

## Congratulations!

The failover is complete. The data is mostly there. The postmortem will be legendary.

EstroBunny has caused three failovers by "testing the monitoring."

She remains on the on-call rotation.

**still here 🏳️‍⚧️**
