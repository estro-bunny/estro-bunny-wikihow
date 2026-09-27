---
title: "Conduct a Post-Incident Review After a Failed Database Migration"
category: technical-operations
type: runbook
chaos: 5
status: stable
featured: false
characters:
  - estrobunny
  - greg
tags:
  - database
  - migration
  - post-incident-review
  - operations
---
# How to Conduct a Post-Incident Review After a Failed Database Migration

A database migration failed.

The service has been recovered.

The production mouse has been located.

Now comes the part where everyone has to explain what happened without saying, "It was weird."

A post-incident review is not a ceremony for assigning blame. It is a structured investigation into what happened, why the system allowed it to happen, how the team detected and responded to it, and what changes will reduce the chance or impact of a repeat incident.

This guide focuses on the review after the immediate recovery is complete.

> **Warning:** Do not turn the review into a courtroom. The goal is to improve the system, not identify the person who happened to be holding the keyboard when reality collapsed.

## Things You'll Need

- The incident timeline
- Migration and deployment logs
- Relevant database and application metrics
- The failed migration
- Recovery commands or corrective migrations
- Deployment and migration configuration
- A list of observed user impact
- People who were directly involved in detection and recovery
- One person willing to ask, "Why was that possible?" five times

## Step 1: Confirm That the Incident Is Actually Over

Do not begin the retrospective while production is still actively burning.

First verify:

- Service health has returned to an acceptable state
- Error rates have stabilized
- Database health is normal
- Background jobs are processing normally
- No emergency recovery action is still in progress
- Monitoring is still active

If the system is still unstable, continue incident response.

The post-incident review can wait.

EstroBunny would like to hold the meeting immediately.

EstroBunny has been placed in the waiting room.

## Step 2: Preserve the Incident Record

Before memories begin rewriting history, collect the evidence.

Save or link to:

- Deployment records
- Migration output
- Database errors
- Application logs
- Monitoring graphs
- Alerts
- Incident messages
- Recovery commands
- Pull requests or commits involved
- Configuration changes
- Relevant database state information

Do not clean up the evidence because the incident is embarrassing.

The incident happened.

That is now data.

## Step 3: Build a Single Timeline

Create one authoritative timeline using timestamps wherever possible.

For example:

```text
18:04  deployment started
18:05  migration started
18:06  migration failed
18:06  application errors increased
18:08  deployment paused
18:11  investigation started
18:19  partial schema change confirmed
18:27  application rollback selected
18:35  service recovery verified
18:52  monitoring stable
```

Include detection, decisions, actions, and recovery.

Do not write:

```text
18:06  everything became bad
```

That is emotionally accurate but operationally useless.

## Step 4: Describe the Impact

Separate what happened internally from what users experienced.

Document:

- Duration of user impact
- Affected services or features
- Failed requests
- Failed writes
- Delayed jobs
- Data integrity impact
- Number or percentage of affected requests or users, when available
- Whether data was lost, duplicated, corrupted, or merely inaccessible
- Whether any customers required direct remediation

Use measured values when possible.

A statement such as "the database was basically dying" should be replaced with the relevant metrics.

EstroBunny has requested that "vibes" be added to the monitoring dashboard.

Request denied.

## Step 5: Reconstruct the Technical Failure

Now explain the migration itself.

Document:

- What the migration was intended to change
- Which statements executed successfully
- Which statement failed
- Why the statement failed
- Whether the migration was transactional
- Whether some operations could not participate in the transaction
- What schema state remained afterward
- What data state remained afterward
- What application version was running at each point

Keep the explanation concrete.

For example:

> The migration added the new column successfully, then failed while creating the constraint because existing rows violated the constraint.

This is more useful than:

> The migration got mad.

Even if the migration did, in fact, appear emotionally hostile.

## Step 6: Separate Trigger From Root Causes

Do not stop at the first technical failure.

The failed SQL statement is the immediate trigger.

It may not be the deeper reason the incident was possible.

Ask:

- Why was this migration written this way?
- Why did testing not catch the failure?
- Why was the production data different from test data?
- Why was the migration allowed to run automatically?
- Why was the compatibility problem not detected before deployment?
- Why did monitoring detect the problem when it did?
- Why did recovery take as long as it did?

Do not force every incident into a single root cause.

Complex failures often have several contributing conditions.

## Step 7: Examine the Preconditions

List the conditions that had to exist for the incident to occur.

These might include:

- Production data characteristics
- Schema drift
- Different database versions
- Missing test fixtures
- Migration assumptions
- Deployment ordering
- Feature flags
- Missing validation
- Insufficient observability
- Manual intervention
- Tooling behavior

Then ask which conditions were expected and which were accidental.

This turns "the migration failed" into a system-level explanation.

## Step 8: Review Detection

Determine how the incident was detected.

Ask:

- Did an automated alert fire?
- Did a deployment fail visibly?
- Did users report the problem first?
- How long did detection take?
- Did the alert identify the correct symptom?
- Was the alert actionable?

Record the detection gap if there was one.

If users noticed the outage before the monitoring system did, that is useful evidence.

It does not mean the monitoring engineer should be placed in a tiny timeout chair.

## Step 9: Review the Response

Examine how the team responded.

Document:

- Who identified the failure
- Who coordinated the incident
- What actions were taken
- What actions were considered and rejected
- Where decision-making slowed down
- Where information was missing
- Which recovery steps worked
- Which actions introduced additional risk

Focus on system conditions rather than individual blame.

Instead of:

> Alex forgot to check transaction behavior.

Prefer:

> Transaction behavior was not included in the migration review checklist.

The second statement gives you something the system can improve.

## Step 10: Identify What Went Well

Post-incident reviews should not become lists of failures.

Record useful protections that worked.

For example:

- The deployment stopped automatically
- Logs preserved the failed SQL statement
- The team had a known-good application version
- A backup was available
- Monitoring identified recovery
- The migration was reproducible in staging
- One person coordinated production changes

These are controls worth preserving.

EstroBunny would like everyone to celebrate the backup.

The backup has requested privacy.

## Step 11: Identify What Went Poorly

Now document the gaps.

Look for problems in:

- Migration testing
- Production-like test data
- Schema compatibility checks
- Deployment sequencing
- Rollback procedures
- Monitoring
- Alerting
- Documentation
- Access controls
- Recovery tooling
- Incident coordination

Be specific.

"Testing was bad" is not an actionable finding.

"The migration was tested only against an empty database" is.

## Step 12: Create Corrective Actions

Every important finding should produce a concrete action when a change is warranted.

Good corrective actions have:

- A clear outcome
- An owner
- A priority
- A target date or review point
- A way to verify completion

For example:

| Finding | Corrective Action | Verification |
|---|---|---|
| Migration was tested with empty tables | Add production-like data fixtures | Migration passes against representative dataset |
| Compatibility was not checked | Add schema compatibility check to deployment | Incompatible deployment is blocked |
| Recovery steps were undocumented | Create and test recovery runbook | Runbook succeeds in staging |

Do not create seventeen action items because seventeen feels thorough.

Create the changes that address the actual risks.

## Step 13: Fix the Process, Not Just the Migration

A common failure mode is to patch the exact migration and declare victory.

That may fix the incident.

It may not fix the system that produced the incident.

Consider whether the review should change:

- Migration review requirements
- CI checks
- Staging data
- Deployment order
- Database compatibility testing
- Automated rollback behavior
- Observability
- Runbooks
- Approval requirements for risky migrations

If the same class of failure could happen again with a different migration, the review is not finished.

## Step 14: Decide What Not to Change

Not every surprising detail deserves a permanent process change.

Ask:

- Is this a systemic risk?
- Is the proposed control worth its operational cost?
- Does another control already cover it?
- Would this create unnecessary deployment friction?
- Is the proposed change solving the cause or merely making the team feel safer?

A post-incident review should improve reliability.

It should not produce a 42-step ceremony before anyone can add a column.

EstroBunny has proposed the 42-step ceremony.

It has been archived under "Things We Are Not Doing."

## Step 15: Turn Lessons Into Tests

Whenever practical, convert the incident into an automated check.

Examples:

- A migration test using representative data
- A schema compatibility test
- A deployment smoke test
- A constraint validation step
- A rollback rehearsal
- An alert for the failure condition
- A check that detects schema drift

Tests are particularly valuable when they prevent the same class of incident rather than only the exact original bug.

The goal is not to remember the incident forever.

The goal is to make remembering it unnecessary.

## Step 16: Review the Recovery Itself

The migration failure is only half the story.

Examine the recovery.

Ask:

- Was the recovery path known beforehand?
- Did the team know the actual database state?
- Was application rollback safer than database rollback?
- Were destructive actions avoided until recovery capability was verified?
- Was the recovery tested?
- Did recovery introduce secondary problems?
- How long did recovery take?

If the recovery depended on one person's undocumented knowledge, record that as a reliability risk.

Knowledge that exists only inside one human brain is not a runbook.

It is a hostage situation.

## Step 17: Write the Incident Summary

Create a concise final record.

A useful summary includes:

```text
Summary
Impact
Timeline
Technical cause
Contributing factors
Detection
Response
Recovery
What went well
What went poorly
Corrective actions
Owners
Verification
```

Keep the summary factual.

Separate confirmed facts from hypotheses.

If the team does not know why something happened, write that it is unknown and assign an investigation if necessary.

Unknown is better than confidently wrong.

## Common Mistakes

### Turning the Review Into a Blame Session

People become less likely to report problems when reviews punish individuals for system failures.

Focus on decisions, conditions, controls, and opportunities for improvement.

### Writing a Timeline From Memory

Memory is useful.

Logs are better.

### Creating Actions With No Owners

An action item without an owner is a wish.

### Fixing Only the Exact Migration

Repairing one migration does not necessarily prevent the next migration from causing the same class of failure.

### Making Every Action a Priority One Emergency

If everything is urgent, the action list stops communicating risk.

### Closing the Review Before Actions Are Verified

A review is not complete merely because the document exists.

Verify that important corrective actions actually changed the system.

## Emergency Procedure

If the incident exposed a serious unresolved reliability risk:

1. Record the risk clearly.
2. Identify whether it can cause another production incident immediately.
3. Apply a temporary mitigation if necessary.
4. Assign an owner.
5. Define the verification method.
6. Schedule the permanent corrective change.
7. Revisit the risk after the change is deployed.

If the system remains vulnerable to the same failure mode, do not describe the incident as fully resolved merely because the original outage ended.

## Congratulations!

You have completed the post-incident review.

The migration failed.
The service recovered.
The evidence survived.
The timeline is documented.
The causes are understood as far as the evidence allows.
The corrective actions have owners.
The database team has stopped saying "it should be fine."

Most importantly, nobody wrote:

```text
root cause: Steve
```

as the final incident report.

EstroBunny is impressed.

She has opened the corrective-action tracker.

She has added one item:

> **Prevent EstroBunny From Editing Production Migrations During Incident Reviews.**

Status: Open.

Owner: Everyone.

Priority: Unfortunately High.

**still here 🏳️‍⚧️**