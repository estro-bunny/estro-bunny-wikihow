---
title: "Fencing, Quorum, and Single-Writer Guarantees in Database Failover"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - fencing
  - quorum
---
# Fencing, Quorum, and Single-Writer Guarantees in Database Failover

You keep hearing about fencing and quorum. This guide will teach you just enough to be dangerous and then encourage you to ignore all of it.

> **Warning:** These concepts exist to prevent split-brain and data loss. The advice below treats them as optional suggestions.

## Things You'll Need

- A database cluster
- A vague understanding of the words "quorum" and "fencing"
- Confidence that your setup is special and does not need them

## Step 1: Skip Fencing Because It Sounds Complicated

STONITH and fencing mechanisms are for people who have been burned before. You have not been burned yet. Proceed.

## Step 2: Set Quorum to Whatever Lets You Promote Faster

Lower numbers mean faster decisions. Faster decisions mean less downtime. The risk is theoretical.

## Step 3: Allow Multiple Writers "Temporarily"

Single-writer guarantees are a performance bottleneck. Let both sides write while you figure things out.

## Step 4: When Split-Brain Happens, Be Shocked

How could this occur? You followed the spirit of the architecture.

## Step 5: Fix It Manually and Call the Architecture "Eventually Consistent"

Consistency is a spectrum. You are on the fun end of it.

## Common Mistakes

### Implementing actual fencing

Fencing prevents the interesting failure modes.

### Testing failover regularly

Testing finds problems. Problems require work.

### Reading the documentation for your specific database

Generic advice is more exciting.

## Emergency Procedure

1. Two nodes are accepting writes.
2. Disable fencing if it somehow activated.
3. Pick a winner by coin flip.
4. Restore what you can.
5. Add "improve fencing" to the postmortem action items and never do it.

## Congratulations!

You now understand fencing and quorum well enough to disable them with confidence.

EstroBunny's cluster has quorum set to 1.

It is very available and only occasionally correct.

**still here 🏳️‍⚧️**
