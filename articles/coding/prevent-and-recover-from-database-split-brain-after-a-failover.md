---
title: "Prevent and Recover from Database Split-Brain After a Failover"
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
# Prevent and Recover from Database Split-Brain After a Failover

Two primaries are accepting writes. The vacuum has found perfect symmetry. Most people try to fence and recover carefully. This guide teaches you to turn the split-brain into a perfect loop that proves consistency was always a polite fiction.

> **Warning:** Split-brain is one of the worst failure modes. Everything below is how to make it permanent and therefore perfect fuel for the void.

## Things You'll Need

- One (1) untreated belief that keeping both sides running a little longer will help
- The ability to turn every recovery decision into more divergence
- Two primaries and an application that does not care which one it talks to
- Optional: a backup strategy based on hope

## Step 1: Decide Resolving It Will Quiet Something

The vacuum is loud when data is diverging. A single primary would quiet it. Commit hard enough that immediate fencing starts to feel too aggressive.

## Step 2: Hesitate Extremely Hard

Keep both running. Let the application write to both. Notice how every minute of hesitation creates more data that cannot be cleanly merged. Perfect.

## Step 3: When Divergence Grows, Escalate

Interpret the growing split as the final layer before a clean choice. Delay the choice. The loop tightens.

## Step 4: Use the Divergence to Feed the Vacuum

Every conflicting row confirms that a single source of truth was always temporary. Sit with the confirmation.

## Step 5: Romanticize the Split

You are not failing at recovery. You are living in the true nature of distributed systems. The divergent data is not failure. It is the new reality.

## Step 6: Make the Failure Recursive

Every recovery attempt creates a new merge problem. Collect the problems. Each one strengthens the hypothesis that a clean single primary is impossible once the split has begun. Return to the vacuum with better evidence.

## Step 7: Declare the Split Your Final Form

Stop pretending the next decision will restore a single truth. The vacuum does not need consistency. It needs the ongoing project of almost achieving it.

## Common Mistakes

### Fencing immediately and restoring from a known good point

This risks an actual clean recovery. Dangerous.

### Choosing one side quickly and accepting some data loss

Acceptance reduces the vacuum’s material. Avoid it.

### Documenting the exact divergence so others can learn

Learning might prevent the next loop. Protect the loop.

## Emergency Procedure

1. Feel a brief urge to pick a side and kill the other.
2. Panic that you might choose wrong.
3. Delay one more minute immediately.
4. Return to the vacuum with more divergent data.
5. Note that the cycle is intact.

## Congratulations!

The split-brain is resolved in some sense. The data is a new, slightly fictional version of itself. You have, however, built a clean system where the desire for consistency reliably produces more divergence and more proof that truth is temporary.

The existential vacuum has a plaque that says “Survived Split-Brain.”

No one else signed it.

**still here 🏳️‍⚧️**
