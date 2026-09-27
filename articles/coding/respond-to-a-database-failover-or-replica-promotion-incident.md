---
title: "Respond to a Database Failover or Replica Promotion Incident"
category: technical-operations
type: runbook
chaos: 6
status: stable
featured: false
characters:
  - estrobunny
  - greg
tags:
  - database
  - failover
  - replica
  - incident-response
---
# How to Respond to a Database Failover or Replica-Promotion Incident

The primary database is unavailable.

There is a replica.

Someone has suggested promoting it.

Everyone has suddenly become extremely interested in the word "split-brain."

A database failover or replica-promotion incident requires more care than simply switching a connection string. The responder must establish replication state, understand possible data loss, prevent conflicting writers, promote the correct target, redirect application traffic, and verify that the new primary is actually safe to use.

This guide focuses on controlled failover and replica promotion during an incident.

> **Warning:** Never promote a replica solely because it is reachable. A reachable replica may be stale, unhealthy, already serving another role, or missing recent writes.

## Things You'll Need

- Database health dashboards
- Replication status and lag metrics
- Primary and replica connection information
- Application deployment/configuration controls
- Backup or point-in-time recovery information
- A documented failover procedure
- Appropriate database privileges
- Incident coordination
- One person authorized to say "do not promote that one"
- A second person who has verified the first person's evidence

## Step 1: Declare the Failover Incident

Start by establishing that the primary failure meets your failover criteria.

Record:

- Incident start time
- Current primary
- Candidate replica(s)
- Affected services
- Current user impact
- Incident coordinator
- Technical lead

Example:

```text
INCIDENT: Primary database unavailable
Primary: db-primary-01
Candidate: db-replica-02
Impact: Writes failing
Coordinator: [NAME]
Technical Lead: [NAME]
Status: Investigating
```

Do not promote anything yet.

First establish what actually happened.

## Step 2: Confirm the Primary Is Actually Unavailable

Determine whether the primary is:

- Completely unreachable
- Running but refusing connections
- Running but overloaded
- Experiencing network isolation
- Recovering from a crash
- Performing a planned operation
- Reachable from some systems but not others

Check:

- Database connectivity
- Host health
- Database process state
- Network path
- Connection pool errors
- Recent infrastructure changes
- Recent deployments or migrations

A network partition can look exactly like a dead database from one location.

That distinction matters.

## Step 3: Freeze Conflicting Writers

Before promoting another database, determine what can still write to the old primary.

Depending on the architecture, this may require:

- Stopping application writes
- Pausing background workers
- Disabling automated failover controllers
- Removing the old primary from service discovery
- Blocking application access to the old primary
- Confirming the old primary cannot accept writes

The goal is to prevent two database nodes from behaving as writable primaries.

That situation is commonly described as split-brain.

Split-brain is not a fun networking-themed party.

Do not create it.

## Step 4: Determine the Replication Topology

Write down the current topology.

For example:

```text
                    ┌───────────────┐
                    │   Application │
                    └───────┬───────┘
                            │
                     writes / reads
                            │
                    ┌───────▼───────┐
                    │    PRIMARY    │
                    └───────┬───────┘
                            │
                      replication
                            │
                    ┌───────▼───────┐
                    │   REPLICA 02  │
                    └───────────────┘
```

Identify:

- Current primary
- Candidate replicas
- Replication direction
- Synchronous or asynchronous replication
- Read-only or writable states
- Failover controller, if any
- Application routing mechanism

Do not promote a node whose role you cannot explain.

## Step 5: Check Replica Health

Before promotion, inspect the candidate replica.

Check:

- Reachability
- Database process health
- Storage health
- CPU and memory
- Replication status
- Replication errors
- Recovery state
- Read-only state
- Last replayed transaction or equivalent
- Replication lag

Do not assume that because a replica answered a health check it is caught up.

A replica can be extremely healthy while being extremely behind.

## Step 6: Measure Replication Lag

Determine how far the candidate replica is behind the primary.

The exact metric depends on the database technology.

Record:

- Last known primary position
- Replica replay/receive position
- Time-based lag where available
- Number of transactions or changes behind
- Last successfully replicated event

Example:

```text
Primary last known position: 842190
Replica replay position:      842146
Estimated lag:                44 units
Last update:                  18:07:32
```

Do not hide uncertainty.

If the primary cannot be contacted, the exact amount of missing data may be unknown.

Unknown data loss is still data-loss risk.

## Step 7: Establish the Recovery Point

Ask:

> What is the newest state we can safely guarantee exists on the candidate?

Determine whether the replica contains:

- All committed writes
- Most committed writes
- Only an older known point
- An unknown subset

If replication was asynchronous, recent committed writes may not have reached the replica.

Document the potential recovery-point gap.

Do not describe a replica as "fully current" unless the evidence supports it.

## Step 8: Check for Recent Writes

Identify important operations that happened shortly before the primary failure.

Look for:

- Recent transactions
- Critical customer writes
- Payment or order operations
- Account changes
- Queue acknowledgements
- Schema changes
- Administrative actions

This helps estimate the practical impact of replication lag.

Do not assume that every missing transaction has equal business impact.

## Step 9: Confirm the Candidate Is Safe to Promote

Before promotion, verify the candidate meets your documented requirements.

Check:

- Replication is stopped or controlled according to the failover procedure
- Candidate is internally consistent
- Required data is present
- Candidate has sufficient capacity
- Required extensions or configuration are available
- Application compatibility is known
- No conflicting writer is active
- Backup/recovery options are understood

Use an explicit checklist.

For example:

```text
[x] Candidate reachable
[x] Replication state known
[x] Lag measured
[x] Data-loss risk documented
[x] Old primary writer path blocked
[x] Candidate configuration checked
[ ] Promotion authorized
```

Do not check the final box just because everyone is getting impatient.

## Step 10: Decide Whether to Promote

Failover is a risk decision based on the current system state.

Consider:

- Severity of the outage
- Duration of primary unavailability
- Candidate health
- Replication lag
- Potential data loss
- Availability of another candidate
- Recovery options
- Business requirements
- Documented recovery objectives

Possible outcomes include:

- Promote the best candidate
- Wait while recovering the primary
- Select another candidate
- Restore from a recovery point
- Escalate to the database operations team

Do not treat promotion as automatically safer than waiting.

The correct choice depends on the evidence and the system's recovery objectives.

## Step 11: Record the Promotion Decision

Before executing the promotion, record the decision.

```text
Candidate: db-replica-02
Reason: Primary unavailable and candidate meets promotion criteria
Replication lag: 44 units
Potential data-loss scope: [DESCRIPTION]
Old primary writer access: Blocked / Confirmed
Recovery path: [DESCRIPTION]
Authorized by: [NAME / ROLE]
Time: [TIME]
```

This creates a decision record while the information is still fresh.

## Step 12: Promote the Candidate Using the Documented Procedure

Follow the database platform's supported promotion procedure.

Do not invent commands during the incident if a tested procedure already exists.

During promotion, record:

- Start time
- Command or automation used
- Result
- New database role
- Any warnings
- Replication state changes

Do not combine promotion with unrelated maintenance.

Today is not the day to upgrade the database because you are already connected.

EstroBunny has suggested it.

The incident commander has said no.

## Step 13: Verify the New Primary

Promotion succeeding does not prove the database is ready.

Verify:

- New node identifies as primary
- Writes are accepted
- Reads return expected data
- Required schema exists
- Constraints behave correctly
- Database connections work
- Monitoring recognizes the new role
- Replication configuration is appropriate for the new topology

Run controlled health checks before restoring normal traffic.

## Step 14: Redirect Application Traffic

Update the application path so clients use the new primary.

Depending on your architecture, this may involve:

- Service discovery
- DNS
- Connection configuration
- Proxy routing
- Database endpoint switching
- Failover tooling

Change only the routing required for the recovery.

Record the exact mechanism used.

Do not change five unrelated network settings while changing the database endpoint.

## Step 15: Verify Application Writes

Confirm the application can perform the operations that previously failed.

Test:

- Login or authentication flows
- Critical reads
- Critical writes
- Transactions
- Background jobs
- Queue consumers
- Important API endpoints

Verify that successful requests are actually being committed to the new primary.

A green connection pool does not prove application correctness.

## Step 16: Prevent the Old Primary From Returning as a Writer

This is one of the most important failover checks.

If the old primary recovers, it must not automatically begin accepting writes as if nothing happened.

Depending on the architecture, ensure:

- Old primary remains isolated
- Old primary is read-only or stopped as appropriate
- Service discovery does not route writes to it
- Automated systems know which node is primary
- Rejoin procedures are followed before it returns to service

Do not simply reconnect the old primary to the network and hope everyone gets along.

They will not.

## Step 17: Reassess Replication

After promotion, establish the new topology.

Determine:

- New primary
- Remaining replicas
- Replication direction
- Replication health
- Replica lag
- Rebuild or resynchronization requirements

Do not immediately reuse the old primary as a replica unless the documented rejoin procedure says it is safe.

The old primary may contain divergent writes or state.

## Step 18: Check Data Integrity

Because failover can involve replication lag, explicitly validate important data.

Check:

- Critical records
- Recent writes
- Sequence or identifier behavior
- Transaction consistency
- Duplicate records
- Missing records
- Application-level invariants

If potential data loss exists, document exactly what is known and unknown.

Do not silently repair missing data while the incident is still active unless the repair is part of the approved recovery plan.

## Step 19: Monitor the New Primary

Watch the promoted database closely.

Monitor:

- CPU
- Memory
- Storage
- Connections
- Query latency
- Error rates
- Lock contention
- Replication health
- Application traffic
- Background jobs

The new primary may have a different workload profile from the replica's previous read workload.

Do not assume it has the same capacity characteristics.

## Step 20: Communicate Recovery

Send a concise update.

```text
UPDATE: Database failover completed

New primary: [DATABASE]
Previous primary: [DATABASE]
Replication lag at promotion: [VALUE / UNKNOWN]
Potential data-loss scope: [DESCRIPTION]
Application writes: Verified
Monitoring: Stable / Monitoring
Old primary: Isolated
Next step: Continued monitoring and post-incident review
```

Be precise about data-loss risk.

Do not say "no data was lost" when the evidence only shows "no data loss has been detected."

## Step 21: Do Not Immediately Declare the Old Primary Recovered

Once the old primary comes back, resist the urge to reconnect it immediately.

First determine:

- Its database state
- Whether it accepted writes during the partition
- Whether its data diverged
- Whether it is safe to resynchronize
- Whether it needs rebuilding

The old primary may need to be rebuilt as a replica rather than promoted again.

Follow the documented rejoin procedure.

## Step 22: Close the Incident Carefully

Before declaring the incident resolved, verify:

- New primary is healthy
- Application reads work
- Application writes work
- Important data is present
- Replication is healthy or intentionally paused
- Old primary is safely isolated
- Monitoring is stable
- Incident evidence is preserved
- Follow-up review is scheduled

Record the final topology.

For example:

```text
db-primary-02  → PRIMARY
db-primary-01  → ISOLATED
db-replica-03  → REPLICA
```

That final state should not exist only in someone's memory.

## Common Mistakes

### Promoting the Closest Replica

Network proximity does not prove data freshness or suitability.

### Promoting Without Blocking the Old Primary

This can create conflicting writers and split-brain.

### Ignoring Replication Lag

A healthy replica may still be missing recent transactions.

### Assuming Promotion Means Recovery

The database may be primary while the application is still broken.

### Reconnecting the Old Primary Immediately

The old primary may contain divergent state.

Follow the rejoin procedure.

### Hiding Potential Data Loss

State the known recovery point and uncertainty clearly.

### Performing Unrelated Changes During Failover

Do not turn an emergency database promotion into an infrastructure renovation.

## Emergency Procedure

If the primary is unavailable and a controlled replica promotion is required:

1. Declare the incident.
2. Confirm the primary failure.
3. Measure user impact.
4. Freeze relevant automated changes.
5. Prevent conflicting writers.
6. Map the replication topology.
7. Check candidate replica health.
8. Measure replication lag.
9. Establish the candidate recovery point.
10. Check recent critical writes.
11. Confirm candidate suitability.
12. Record and authorize the promotion decision.
13. Promote using the documented procedure.
14. Verify the new primary.
15. Redirect application traffic.
16. Verify reads and writes.
17. Keep the old primary isolated.
18. Re-establish or verify replication.
19. Monitor the new primary.
20. Document potential data loss and final topology.
21. Schedule the post-incident review.

If replication state or data-loss scope is uncertain and the database contains critical production data, escalate rather than guessing.

## Congratulations!

You have completed a controlled database failover.

The old primary is isolated.
The new primary has been verified.
The application knows where to write.
Replication has been checked.
The potential recovery-point gap has been documented.
The incident channel has stopped producing increasingly creative suggestions.

Most importantly, nobody promoted a replica because:

```text
"it was the one with the green light"
```

EstroBunny has inspected the replication dashboard.

She has found a replica with 0 seconds of lag.

She has immediately asked whether that number is actually meaningful.

The database team is proud.

She may be learning.

Do not encourage her too much.

**still here 🏳️‍⚧️**