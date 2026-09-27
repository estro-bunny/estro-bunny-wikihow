---
title: "Create a Practical Runbook for Responding to a Database Outage"
category: technical-operations
type: runbook
chaos: 4
status: stable
featured: false
characters:
  - estrobunny
  - greg
tags:
  - database
  - outage
  - runbook
  - incident-response
---
# How to Create a Practical Runbook for Responding to a Database Outage

The database is down.

The dashboard is red.

Someone has typed "database outage" into the incident channel.

This is not the time to discover that the recovery procedure exists only in a senior engineer's memory.

A database outage runbook provides a controlled sequence for detection, triage, stabilization, recovery, and verification. It should help an incident responder act safely under pressure without replacing judgment or escalation.

This guide creates a practical runbook that can be adapted to the database technology, application architecture, and operational procedures of your environment.

> **Warning:** A runbook is not permission to execute every command listed inside it. Confirm the current system state before performing potentially destructive or irreversible actions.

## Things You'll Need

- Database monitoring
- Application health metrics
- Database access appropriate to the incident
- Deployment information
- Recent database and application logs
- Backup or recovery documentation
- Known-good application version information
- An incident communication channel
- Someone authorized to say "stop"
- A keyboard that EstroBunny is not currently holding

## Step 1: Start With the Runbook Header

Put the most important operational information at the top.

Use:

```md
# Database Outage Response Runbook

Owner: [TEAM]
Last Reviewed: [DATE]
Review Frequency: [INTERVAL]
Database: [SYSTEM]
Primary Service: [SERVICE]
Escalation: [TEAM / CONTACT]
Incident Channel: [LOCATION]

Severity Guidance:
- [SEVERITY]: [WHEN TO USE]
```

Include links to the authoritative dashboards, deployment system, database documentation, and recovery procedures.

Do not bury the escalation path on page 47.

Nobody reads page 47 while production is on fire.

## Step 2: Define What Counts as an Outage

Do not make responders guess what the runbook means by "outage."

Define observable conditions.

Examples:

- Database is unreachable
- Connection failures exceed the documented threshold
- Critical queries consistently time out
- Primary database is unavailable
- Replication failure prevents required operations
- Application cannot perform required writes

Also distinguish an outage from degraded performance.

A database processing requests slowly may require a different response from a database that accepts zero connections.

## Step 3: Confirm the Incident

Before changing anything, establish whether the database is actually unavailable.

Check:

- Application error rate
- Database connection health
- Database health dashboard
- Recent alerts
- Recent deployments
- Recent migrations
- Database CPU and memory
- Storage capacity
- Connection counts
- Replication state when applicable

Ask:

> Is the database actually down, or is the application failing somewhere else?

This question prevents a large amount of unnecessary production enthusiasm.

EstroBunny recommends restarting the database immediately.

EstroBunny has been asked to wait.

## Step 4: Declare the Incident

If the outage meets your incident criteria, declare it.

Record:

- Incident start time
- Affected service
- Initial severity
- Incident commander or coordinator
- Technical lead
- Communication channel

Use a standard message:

```text
INCIDENT: Database outage
Start: [TIME]
Impact: [SHORT DESCRIPTION]
Coordinator: [NAME]
Technical Lead: [NAME]
Status: Investigating
```

Keep the message concise.

The incident channel is not the place to publish your entire emotional journey.

## Step 5: Stop Automated Changes

Before investigating, reduce the number of things changing the system.

Depending on your environment, consider:

- Pausing deployments
- Pausing automated migrations
- Stopping automatic retry loops that increase load
- Freezing unrelated schema changes
- Pausing non-essential jobs

Do not disable automation blindly.

Only stop automation that could interfere with diagnosis or recovery.

Record what was paused so it can later be restored.

## Step 6: Measure the User Impact

Determine what users can and cannot do.

Check:

- Reads
- Writes
- Authentication
- Critical API endpoints
- Background jobs
- Queue processing
- Administrative functions
- Customer-specific impact

Record the scope.

Example:

```text
Reads: Working
Writes: Failing
Background jobs: Delayed
Authentication: Working
Admin actions: Degraded
```

Do not assume every feature is affected because one database operation failed.

## Step 7: Check the Obvious Resource Failures

Inspect the common infrastructure causes.

Check:

- CPU saturation
- Memory pressure
- Disk usage
- Disk I/O
- Connection exhaustion
- Connection pool exhaustion
- Storage or volume health
- Network connectivity
- Database process status

Do not immediately increase every resource limit you can find.

First identify the actual bottleneck.

Changing five variables at once turns diagnosis into interpretive dance.

## Step 8: Check Recent Changes

Look at what changed shortly before the outage.

Review:

- Application deployments
- Database migrations
- Configuration changes
- Infrastructure changes
- Credential changes
- Firewall or network changes
- Scaling events
- Scheduled jobs

Use timestamps.

A change that happened yesterday is not automatically the cause.

A change that happened thirty seconds before the outage deserves investigation.

Neither fact is proof by itself.

## Step 9: Inspect Database Logs

Read the database logs around the incident start time.

Look for:

- Startup or shutdown events
- Authentication failures
- Connection failures
- Deadlocks
- Lock contention
- Out-of-memory events
- Disk errors
- Corruption warnings
- Replication failures
- Configuration errors
- Crashes

Capture the relevant evidence before changing the system.

Do not paste 40,000 lines into the incident channel.

Find the useful lines.

EstroBunny has located line 39,821.

It says:

```text
INFO: checkpoint complete
```

She is disappointed.

## Step 10: Determine the Failure Class

Classify the problem before choosing recovery.

Useful categories include:

| Failure Class | Example |
|---|---|
| Process | Database process crashed |
| Resource | Storage exhausted |
| Connectivity | Network path unavailable |
| Capacity | Connection limit exhausted |
| Locking | Long-running lock blocks critical work |
| Query | Expensive query overwhelms database |
| Replication | Replica or primary failure |
| Schema | Migration left incompatible state |
| Configuration | Invalid or unsafe configuration |
| Infrastructure | Host or storage failure |
| Unknown | Evidence insufficient |

Unknown is acceptable.

Do not force the incident into a category because the runbook table looks lonely.

## Step 11: Protect the Database From Additional Load

If the database is overloaded, reducing incoming work may be safer than repeatedly restarting it.

Depending on your architecture, consider:

- Rate limiting
- Disabling non-critical features
- Pausing background jobs
- Reducing worker concurrency
- Temporarily routing traffic away from an unhealthy replica
- Stopping known-expensive workloads

Only use controls that are documented and understood.

Do not randomly kill queries because they look long.

Determine what the query is doing and whether terminating it is safe.

## Step 12: Decide Whether Restarting Is Appropriate

A restart can recover some failures.

It can also make other failures worse or destroy useful diagnostic state.

Before restarting, determine:

- Why the process is unhealthy
- Whether restart is expected to be safe
- Whether recovery after restart is understood
- Whether active transactions will be affected
- Whether replication behavior is understood
- Whether logs or diagnostics need to be preserved

If restart is part of the documented recovery procedure and the prerequisites are satisfied, follow that procedure.

If the cause is unknown and restart could destroy important evidence or worsen the incident, escalate before acting.

EstroBunny has entered:

```text
sudo systemctl restart everything
```

Remove the sudo from her hands.

## Step 13: Check Backup and Recovery Capability

If the incident may require restoration or destructive repair, verify recovery capability before making destructive changes.

Check:

- Latest backup time
- Backup success status
- Point-in-time recovery availability
- Snapshot availability
- Restore procedure
- Recovery-point objectives
- Recovery-time objectives

A backup that exists is useful.

A backup that can actually be restored is considerably more useful.

Do not discover during the outage that the backup credentials expired six months ago.

## Step 14: Choose the Smallest Safe Recovery

Possible recovery actions may include:

- Removing a confirmed resource bottleneck
- Restoring database connectivity
- Restarting a failed process
- Failing over to a healthy database
- Rolling back an incompatible application deployment
- Applying a documented corrective change
- Restoring from a verified recovery point
- Temporarily disabling a non-critical feature

Choose based on evidence and blast radius.

Prefer a recovery that is:

- Controlled
- Observable
- Reversible when possible
- Documented
- Appropriate to the failure class

Do not choose the recovery command because it is the shortest command in the runbook.

## Step 15: Coordinate Before Executing High-Risk Actions

For actions that can cause data loss, downtime, or irreversible state changes:

1. State the proposed action.
2. State why it is necessary.
3. State the expected result.
4. State the major risks.
5. Confirm authorization.
6. Record the decision.
7. Execute once.
8. Verify the result.

Example:

```text
Proposed action: Fail over to healthy replica
Reason: Primary database is unavailable
Expected result: Application writes resume
Risk: Recent replication lag may cause data loss
Authorization: [NAME / ROLE]
Status: Approved
```

This is slower than clicking buttons.

It is also considerably better than discovering what the buttons did afterward.

## Step 16: Verify Recovery

Do not declare recovery because a process is running.

Verify:

- Database accepts expected connections
- Critical queries succeed
- Reads succeed
- Writes succeed
- Application errors decrease
- Background jobs recover
- Replication is healthy when applicable
- Connection pools recover
- Latency returns toward baseline

Test the actual user path where practical.

A green database dashboard does not necessarily mean the application works.

## Step 17: Watch for Secondary Failures

Recovery can create delayed problems.

Monitor for:

- Queue buildup
- Retry storms
- Duplicate writes
- Replication lag
- Constraint violations
- Elevated query latency
- Connection exhaustion
- Failed scheduled jobs
- Data integrity anomalies

Continue monitoring after the first successful request.

One successful request is evidence of one successful request.

It is not a certificate of immortality.

## Step 18: Restore Paused Automation Carefully

Once the system is stable, restore anything intentionally paused during the incident.

Do not restore everything simultaneously unless that is the documented procedure.

Verify:

- Deployment pipelines
- Scheduled jobs
- Background workers
- Migration systems
- Automated scaling
- Monitoring

Watch the system as normal workload resumes.

## Step 19: Communicate the Recovery

Send a concise recovery update.

Example:

```text
UPDATE: Database service recovered

Recovery: [SHORT DESCRIPTION]
Service impact: [CURRENT STATUS]
Data integrity: [STATUS]
Monitoring: Stable / Monitoring
Next step: Post-incident review
```

Do not announce permanent resolution if important validation is still running.

"Recovered and monitoring" is different from "incident permanently solved."

## Step 20: Preserve the Incident Record

Before closing the incident, save:

- Timeline
- Logs
- Metrics
- Commands executed
- Recovery decisions
- Database state information
- Relevant deployment records
- User-impact measurements

These records support the post-incident review.

Do not clean up the evidence because the incident channel has become embarrassing.

## Common Mistakes

### Restarting Before Understanding the Failure

A restart may help.

It may also remove evidence or cause additional disruption.

Check first.

### Running Multiple Recovery Paths at Once

Do not simultaneously fail over, restore a backup, restart the primary, and roll back the application unless your documented architecture explicitly requires that sequence.

Choose one controlled recovery path.

### Ignoring Application State

A healthy database does not guarantee a healthy application.

Verify the complete request path.

### Restoring From Backup Too Quickly

A restore can discard valid changes made after the recovery point.

Understand the data implications first.

### Treating Every Long Query as the Problem

Long-running queries may be symptoms, causes, or completely unrelated.

Use evidence.

### Letting Everyone Execute Commands

Multiple operators making independent production changes create race conditions.

Coordinate one technical recovery path.

### Forgetting to Restore Automation

Temporary incident controls can become permanent surprises if nobody removes them.

Record every paused system.

### Declaring Victory Too Early

One green graph is not recovery.

Verify the user-facing system and monitor for delayed failures.

## Emergency Procedure

If the database is actively down and you need the shortest safe sequence:

1. Declare the incident.
2. Assign an incident coordinator and technical lead.
3. Confirm the database failure and user impact.
4. Freeze relevant automated changes.
5. Preserve logs and evidence.
6. Check recent deployments, migrations, and infrastructure changes.
7. Check database process, connectivity, resource, and storage health.
8. Classify the failure if possible.
9. Reduce harmful load when appropriate.
10. Check recovery capability before destructive actions.
11. Select the smallest safe recovery.
12. Coordinate and execute the recovery.
13. Verify database and application health.
14. Monitor for secondary failures.
15. Restore paused automation carefully.
16. Communicate recovery status.
17. Preserve the final incident record.
18. Schedule the post-incident review.

If the correct recovery path is uncertain and the database contains critical production data, escalate to the responsible database or operations team rather than improvising destructive commands.

## Congratulations!

You have created a database outage runbook.

When production breaks, the response no longer begins with:

```text
uhhhhh
```

It begins with:

```text
1. Confirm.
2. Stabilize.
3. Investigate.
4. Recover.
5. Verify.
6. Monitor.
```

The database is responding.
The application is responding.
The incident is documented.
The backup procedure has been checked.
The production keyboard remains intact.

EstroBunny has been assigned as secondary incident responder.

This decision is under review.

She has already renamed the incident channel:

```text
#database-go-brrr
```

Nobody has changed it back.

**still here 🏳️‍⚧️**