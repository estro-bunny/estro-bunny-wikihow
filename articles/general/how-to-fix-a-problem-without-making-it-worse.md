---
title: "How to Fix a Problem Without Making It Worse"
category: questionable-decisions
type: guide
chaos: 2
status: stable
featured: false
characters:
  - estrobunny
tags:
  - problem-solving
  - debugging
  - decision-making
  - escalation
---
# How to Fix a Problem Without Making It Worse

Problems happen.

Software breaks. Plans fail. Objects stop working. People misunderstand instructions. A suspicious noise appears somewhere inside the wall.

The first instinct is usually to do something immediately.

This guide recommends doing something slightly more advanced:

> **Figure out what is wrong before making it more wrong.**

This is a general-purpose troubleshooting method for situations where the correct solution is not immediately obvious.

> **Warning:** If the situation involves fire, serious injury, immediate danger, or an active security incident, stop following this guide and use the appropriate emergency procedure. Do not troubleshoot a burning building with vibes.

## Things You'll Need

- The actual problem
- A way to observe what is happening
- Any relevant instructions or documentation
- Notes
- Patience
- The ability to resist saying "fuck it, I'll just change this"
- A backup where appropriate
- One other person who can tell you that your idea is terrible
- Optional: a computer
- Optional: a functioning relationship with reality

## Step 1: Identify the Actual Problem

Start by describing what is happening without proposing a solution.

For example:

```text
Problem:
The application crashes when opening the settings page.
```

Not:

```text
Problem:
Rewrite the entire application.
```

The second statement is a proposed escalation.

You do not yet know whether the first problem requires the second response.

Ask:

- What happened?
- What should have happened?
- When did it start?
- Is it happening consistently?
- What changed recently?
- Can the problem be reproduced?

If you cannot describe the problem clearly, you are not ready to start changing things.

## Step 2: Do Not Immediately Touch Anything

This is difficult.

Someone will want to restart something.

Someone else will want to reinstall something.

Someone will say:

> "I have an idea."

Stop them.

Observe the current state before changing it.

Take screenshots. Save logs. Write down error messages. Photograph the suspicious object if necessary.

Preserve evidence before your solution destroys the evidence.

EstroBunny has already touched something.

Unfortunately, she is now part of the evidence.

## Step 3: Gather Evidence

Collect information that can distinguish between possible causes.

Useful evidence may include:

- Error messages
- Logs
- Recent changes
- Configuration
- Documentation
- Screenshots
- Timestamps
- Reproduction steps
- Expected versus actual behavior
- Relevant measurements

Do not replace an error message with:

```text
it just doesn't work
```

The machine may accept this description.

Your future self will not.

## Step 4: Check the Obvious Things

Before investigating the deepest possible cause, check the simple ones.

Examples:

- Is it powered on?
- Is it connected?
- Is the correct account being used?
- Is the setting enabled?
- Is the file actually where you think it is?
- Is the service running?
- Is the cable plugged in?
- Did you spell the thing correctly?

These checks are not beneath you.

They are faster than spending three hours constructing an elaborate theory that ends with a loose cable.

## Step 5: Make the Smallest Reasonable Change

Once you have evidence, choose the smallest change that could reasonably address the problem.

Change one thing at a time when practical.

This gives you a useful relationship:

```text
CHANGE
   ↓
OBSERVE
   ↓
VERIFY
```

Not:

```text
CHANGE EVERYTHING
   ↓
PANIC
   ↓
DISCOVER NEW PROBLEMS
   ↓
CHANGE MORE THINGS
```

The second workflow is known as the **EstroBunny Debugging Loop™**.

It has never improved a situation.

## Step 6: Verify the Fix

A disappearing error is not automatically a successful fix.

Test the original problem again.

Ask:

- Does the original failure still occur?
- Does the expected behavior now occur?
- Did the change create a new problem?
- Did an unrelated part of the system stop working?
- Does it still work after restarting or reconnecting where relevant?

Do not declare victory because the problem disappeared for fourteen seconds.

That is not recovery.

That is foreshadowing.

## Step 7: Record What You Changed

Write down what you tried.

For example:

```text
10:14 — Confirmed error occurs.
10:17 — Checked configuration.
10:19 — Reverted most recent change.
10:22 — Retested original failure.
10:24 — Problem resolved.
```

This prevents you from repeating the same failed experiment later.

It also gives another person enough information to continue if you have to leave.

Your notes do not need to be beautiful.

They need to exist.

## Step 8: If It Did Not Work, Stop Escalating Randomly

Failure of the first fix does not mean the next fix should be five times larger.

Return to the evidence.

Ask:

- What did we actually learn?
- Which assumption was wrong?
- Did the evidence rule out a possible cause?
- Did the attempted fix change the symptoms?
- Is there a new clue?

Troubleshooting is not a competition to see who can type the most commands before lunch.

## Step 9: Back Up Before Risky Changes

If the next step could destroy data, alter important configuration, or make recovery harder, establish a recovery path first.

Depending on the situation, this may mean:

- Creating a verified backup
- Exporting configuration
- Taking a snapshot
- Saving a known-good version
- Recording the current state
- Confirming how to undo the change

Do not discover your backup procedure immediately after deleting the thing you needed to restore.

That is not a backup strategy.

That is a historical reenactment.

## Step 10: Ask for Help Before the Situation Becomes Unrecoverable

Escalating is not failure.

It is a normal part of troubleshooting.

Ask someone with relevant experience when:

- You no longer understand the system state
- The next step could cause irreversible damage
- The issue affects other people
- You have exhausted documented recovery options
- The problem is outside your expertise
- You are tempted to type a command you do not understand

Explain what happened and what you already tried.

Do not tell them:

> "Nothing works."

Tell them:

> "I reproduced the problem, checked X and Y, changed Z, and observed this result."

That is useful.

## Step 11: Know When to Stop

Sometimes the safest troubleshooting action is to stop.

Stop if:

- The situation is becoming less understood rather than more understood
- You are making changes without evidence
- The next action is irreversible
- You cannot restore the previous state
- You are affecting systems or people outside the original problem
- The problem has escalated beyond the approved procedure

Stopping gives you something extremely valuable:

**A chance to think before the next mistake.**

EstroBunny considers this an advanced technique.

She has named it:

**The Put The Fucking Keyboard Down Protocol™**

## Step 12: Recheck the Original Problem After Every Major Change

Large fixes can hide small failures.

After a major change, return to the original requirement.

```text
Original problem:
Can the user open the settings page?

Current state:
The server is running, the dashboard is green,
and everyone feels optimistic.

Actual test:
Can the user open the settings page?
```

The final line is the important one.

A green dashboard does not answer a question it was never designed to answer.

## Step 13: Separate the Original Problem From the New Problems

If the attempted fix creates another issue, document it separately.

For example:

```text
Original problem:
Application crashes on settings page.

New problem:
Application no longer starts after configuration change.
```

Do not mentally merge these into:

```text
Everything is broken.
```

You now have two problems.

That is worse.

But it is also more specific.

Specific problems can be solved.

## Step 14: Use the EstroBunny Severity Scale

When the situation starts escalating, classify it honestly.

| Level | Situation | Recommended Response |
|---|---|---|
| 🟢 Slightly Inconvenient | Something is annoying but contained | Investigate normally |
| 🟡 Annoying | The problem is affecting normal work | Gather evidence and troubleshoot |
| 🟠 Concerning | Multiple components or people are affected | Slow down and coordinate |
| 🔴 Bad | The system or situation is materially failing | Use the documented recovery procedure |
| 🟣 EstroBunny Has Opened Another Terminal | Uncontrolled experimentation has begun | Remove keyboard access |
| ⚫ Someone Said "I Know What I'm Doing" | Nobody can explain the current state anymore | Stop changes and establish authority |

The scale is not scientific.

It is, however, considerably more useful than pretending everything is fine.

## Step 15: Escalate Systematically

If normal troubleshooting has failed, escalate the response instead of improvising.

A reasonable escalation path is:

```text
OBSERVE
   ↓
DOCUMENT
   ↓
SMALL FIX
   ↓
VERIFY
   ↓
REASSESS
   ↓
ESCALATE
   ↓
RECOVER
   ↓
DOCUMENT AGAIN
```

Notice what is missing.

```text
PANIC
```

That is intentional.

## Common Mistakes

### Changing Five Things at Once

You will not know which change fixed the problem.

You also will not know which change created the new problem.

### Ignoring the Error Message

The error message is frequently the closest thing you have to a witness statement.

Read it.

### Assuming the Most Complicated Explanation

The complicated explanation may eventually be correct.

It is still reasonable to check whether the cable is plugged in.

### Declaring Victory Too Early

If you have not tested the original failure, you have not confirmed the fix.

### Forgetting What You Changed

Document it.

Future You deserves better.

### Continuing Because You Are Already Angry

Anger is not a troubleshooting methodology.

Neither is caffeine.

Unfortunately, both are widely deployed.

### Using Irreversible Actions as Diagnostics

Do not destroy the evidence merely to see whether the problem disappears.

### Saying "It Can't Get Worse"

This sentence has historically been followed by events proving that it can.

## Emergency Procedure

If troubleshooting begins making the situation worse:

1. **Stop making additional changes.**
2. **Preserve the current state and evidence where possible.**
3. **Identify the current known-good state.**
4. **Determine what changed immediately before the escalation.**
5. **Undo the most recent unsafe change if the rollback is known and safe.**
6. **Do not perform additional speculative fixes.**
7. **Escalate to the appropriate person or procedure.**
8. **Protect data before attempting recovery.**
9. **Restore the smallest safe state first.**
10. **Verify the original problem and any newly created problems separately.**
11. **Document what happened.**
12. **Do not repeat the same experiment until you understand why it failed.**

If the situation involves immediate danger to people, property, or critical services, stop troubleshooting and use the relevant emergency or incident-response procedure.

EstroBunny has entered Emergency Procedure Mode.

She has removed her hands from the keyboard.

This is the first encouraging development in twenty minutes.

## Congratulations!

You have successfully attempted to solve a problem without immediately creating three additional problems.

You identified the problem.

You gathered evidence.

You made a controlled change.

You verified the result.

You documented what happened.

Most importantly, you resisted the ancient developer tradition of fixing a broken thing by making it **more broken in a completely different direction**.

EstroBunny has reviewed the severity scale.

She has classified the current situation as:

```text
🟣 ESTROBUNNY HAS OPENED ANOTHER TERMINAL
```

Nobody knows why.

She says she has a plan.

The team has requested that she explain the plan.

She has declined.

This concludes the final mostly reasonable EstroBunny WikiHow guide.

The next guides will be about happiness, relationships, friendship, conversations, monkeys, banks, and other subjects for which absolutely nobody should trust EstroBunny with a terminal.

The documentation is about to become significantly less responsible.

**still here 🏳️‍⚧️**