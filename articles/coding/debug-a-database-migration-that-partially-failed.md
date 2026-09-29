---
title: "Debug a Database Migration That Partially Failed"
category: coding
type: guide
chaos: 9
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - existential-vacuum
  - self-sabotage
---
# Debug a Database Migration That Partially Failed

Half the migration ran. The vacuum has found a quantum schema. Most people try to finish or roll back carefully. This guide teaches you to turn the half-state into a perfect loop that proves consistency was always a myth.

> **Warning:** Stop. Assess. Do not keep running things. Everything below ignores that warning completely.

## Things You'll Need

- One (1) untreated belief that the next manual SQL will complete it cleanly
- The ability to turn every completion attempt into a new inconsistency
- Production write access and denial
- Optional: the original migration script and three panic fixes

## Step 1: Decide Finishing It Will Quiet Something

The vacuum is loud when the schema is half-applied. A complete state would quiet it. Commit hard enough that careful rollback starts to feel like defeat.

## Step 2: Intervene Extremely Hard

Run the migration again. Write the remaining SQL by hand. Edit rows while the app is live. Notice how every action creates a new and more interesting broken state. Perfect.

## Step 3: When It Gets Worse, Escalate

Interpret the new breakage as the final layer before resolution. Deploy another change. The loop tightens.

## Step 4: Use the Spreading Inconsistency to Feed the Vacuum

Every new error confirms that the database (and by extension everything) cannot be returned to a known good state. Sit with the confirmation.

## Step 5: Romanticize the Half-State

You are not making it worse. You are living in the true nature of distributed systems. The partial migration is not failure. It is the new baseline.

## Step 6: Make the Failure Recursive

Every “completion” step introduces a new surface that must be fixed. Collect the surfaces. Each one strengthens the hypothesis that a clean schema is impossible. Return to the vacuum with better evidence.

## Step 7: Declare the Half-State Your Final Form

Stop pretending the next statement will restore order. The vacuum does not need the migration finished. It needs the ongoing project of almost finishing it.

## Common Mistakes

### Checking which statements actually succeeded and rolling back cleanly

This risks an actual resolution. Dangerous.

### Taking the application offline while you work

Clean isolation reduces the vacuum’s material. Avoid it.

### Documenting the exact state so others can help

Help might end the loop. Protect the loop.

## Emergency Procedure

1. Feel a brief moment where the schema looks almost consistent.
2. Panic that the incident might resolve.
3. Run one more untested statement immediately.
4. Return to the vacuum with a fresh inconsistency.
5. Note that the cycle is intact.

## Congratulations!

The migration is no longer partially failed. It is fully cursed. You have, however, built a clean system where the desire to complete reliably produces more damage and more proof that consistency is temporary.

The existential vacuum has a comment in the migration file that says “this should never have been possible.”

It was.

**still here 🏳️‍⚧️**
