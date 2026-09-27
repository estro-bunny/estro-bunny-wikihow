---
title: "Test Database Failover, Fencing, Quorum, and Single-Writer Guarantees Without a Production Outage"
category: technical-operations
type: procedure
chaos: 6
status: stable
featured: false
characters:
  - estrobunny
  - greg
tags:
  - database
  - failover
  - testing
  - fencing
  - quorum
---
# How to Test Database Failover, Fencing, Quorum, and Single-Writer Guarantees Without Causing a Production Outage

You have documented the failover architecture.

You have configured fencing.

You have discussed quorum.

You have written the words "single-writer guarantee" at least six times.

Now someone has asked the most dangerous question in infrastructure:

> "Have we actually tested it?"

Testing failover is necessary because a configuration that looks safe on a diagram may behave differently when the network disappears, a node crashes, a controller loses connectivity, or a stale primary comes back from the dead.

The goal is not to create a production outage.

The goal is to deliberately test the system's safety properties in a controlled environment so that the real outage does not become the first time anyone discovers that the safety properties were theoretical.

This guide focuses on controlled testing of database failover, fencing, quorum, and single-writer behavior.

> **Warning:** Do not improvise destructive failure tests against production. Use a documented test environment, approved fault-injection tooling, explicit abort criteria, and an operator who has the authority to stop the test immediately.

## Things You'll Need

- A representative non-production environment
- A documented production topology
- A tested recovery procedure
- Database monitoring
- Application monitoring
- Replication metrics
- Failover-controller metrics
- Fencing controls
- Quorum configuration
- Test data
- A test plan
- A test owner
- An observer who is not currently responsible for pressing the scary button
- A rollback/abort procedure
- A large amount of respect for distributed systems

## Step 1: Define What You Are Testing

Do not begin with:

```text
Let's break something.
```

Begin with a hypothesis.

For example:

```text
Hypothesis:
If the primary becomes unavailable, the system will
fence the old writer, establish quorum, promote one
candidate, and maintain exactly one production writer.
```

That statement gives you something measurable.

## Step 2: Define the Safety Properties

Write down the properties that must remain true during the test.

For example:

```text
Safety Property 1:
At most one node is an authorized production writer.

Safety Property 2:
A promoted node cannot become authoritative while
an unfenced old writer may still accept writes.

Safety Property 3:
Loss of quorum does not create competing leaders.

Safety Property 4:
Application traffic follows the authoritative writer.

Safety Property 5:
A recovered old primary does not automatically
return as a writer.
```

These become your test assertions.

## Step 3: Define the Success Criteria

Make success measurable.

Example:

```text
PASS if:
- One primary is authoritative.
- Old primary is fenced.
- Application writes continue through the new primary.
- No conflicting writers are detected.
- Replication returns to healthy state.
- Old primary remains non-writable after recovery.
```

Do not define success as:

```text
Database eventually came back.
```

That measures availability.

You are testing safety as well.

## Step 4: Define Abort Criteria

Before starting the test, define conditions that immediately stop it.

Examples:

- Unexpected production traffic reaches the test system
- More than one node accepts test writes unexpectedly
- Fencing does not behave as documented
- Quorum state becomes ambiguous
- Monitoring becomes unavailable
- Test boundaries are no longer clear
- An unrelated production incident begins
- The operator loses confidence in the test

An abort condition is not a failure of the test.

It is a successful safety mechanism.

Stopping before an unsafe condition spreads is exactly what the procedure is supposed to accomplish.

## Step 5: Establish a Safe Test Boundary

Make the test environment unmistakable.

Use:

- Separate test databases
- Separate credentials
- Separate service endpoints
- Clearly labelled infrastructure
- Test-only traffic
- Test-specific monitoring

Confirm that production applications cannot accidentally connect to the test database.

Then confirm it again.

Then ask someone else to confirm it.

EstroBunny has placed a large label on the test environment:

```text
THIS IS NOT PRODUCTION.
PLEASE DO NOT PROVE OTHERWISE.
```

Management has approved the label.

## Step 6: Make the Test Data Observable

Create known test records.

For example:

```text
failover-test-001
failover-test-002
failover-test-003
```

Record:

- Creation time
- Transaction identifier where available
- Expected state
- Expected location

This allows you to determine whether writes continued correctly during failover.

Use test data that cannot be confused with real customer data.

## Step 7: Establish the Baseline

Before introducing a failure, capture the healthy state.

Record:

- Current primary
- Replica roles
- Replication lag
- Quorum state
- Cluster membership
- Fencing state
- Application endpoint
- Connection count
- Query latency
- Error rate
- Database health

Take a topology snapshot.

```text
PRIMARY: db-test-01
REPLICA: db-test-02
REPLICA: db-test-03
QUORUM: healthy
WRITERS: 1
FENCED NODES: 0
```

This is your reference point.

## Step 8: Test Ordinary Failover First

Start with the least complicated failure.

Use the documented procedure to simulate or perform a controlled primary failure in the test environment.

Observe:

- Failure detection
- Quorum decision
- Fencing
- Promotion
- Application routing
- Write continuity

Do not start with a network partition.

Distributed systems have enough personality already.

## Step 9: Verify Fencing

During the failover test, verify that the old primary cannot continue writing after it loses authority.

Check:

- Database role
- Write capability
- Network access
- Application routing
- Worker connections
- Fencing state

Use the approved verification method for the database platform.

The assertion is:

```text
Old primary:
NOT an authorized writer

New primary:
AUTHORIZED writer
```

Do not accept:

```text
The dashboard says it is fenced.
```

Confirm the actual behavior.

## Step 10: Verify Quorum

Record quorum before, during, and after the failover.

Ask:

- Who has voting membership?
- Who can reach whom?
- Which side has quorum?
- Which side is allowed to elect a leader?
- What happens when quorum is lost?

Your expected behavior should be documented before the test.

If the system is designed to refuse promotion without quorum, verify that it does.

If the system is designed to preserve an existing leader under a particular condition, verify that behavior instead.

Do not invent the expected behavior after the test results arrive.

## Step 11: Verify the Single-Writer Invariant

This is the central assertion.

Count the writers.

```text
Expected:
1 authoritative writer

Unexpected:
2 authoritative writers
```

Check through more than one source where possible.

For example:

- Database role
- Cluster state
- Application routing
- Write attempts
- Monitoring

One dashboard should not be the only evidence.

## Step 12: Verify Application Routing

Failover is not complete when the database elects a new primary.

The application must follow it.

Verify:

- Writer endpoint
- Connection pools
- Service discovery
- Load balancer state
- Background workers
- Scheduled jobs

Then perform a controlled test write.

Confirm that the write reaches the new primary.

## Step 13: Test a Controlled Replica Promotion

Repeat the test with a different eligible replica.

Verify that the system can:

- Select the intended candidate
- Establish authority
- Fence the previous writer
- Promote the candidate
- Redirect clients
- Preserve the single-writer guarantee

Record whether the candidate selection matched expectations.

Do not assume every replica is equally suitable.

## Step 14: Test Loss of Quorum

Only perform this in an isolated, approved test environment.

Simulate the loss of enough voting members to remove quorum according to your system's documented rules.

Observe:

- Does the system refuse unsafe promotion?
- Does the existing primary behave as documented?
- Do replicas remain non-authoritative?
- Does the application receive an appropriate signal?
- Does monitoring detect quorum loss?

The desired result depends on the architecture.

The important property is that quorum loss must not accidentally create competing writers.

## Step 15: Test a Network Partition Carefully

A network partition is one of the most valuable failover tests and one of the easiest ways to misunderstand your own architecture.

In a controlled environment, test the documented partition scenario.

Observe:

- Which nodes can communicate?
- Which nodes can reach the application?
- Which side retains quorum?
- Does fencing occur?
- Can the old writer still accept writes?
- Can a second writer become authoritative?

Do not perform this test against production without a formally approved failure-injection program and controls specifically designed for it.

## Step 16: Test the Failure of the Failover Controller

The database is not the only thing that can fail.

Test what happens if the component responsible for failover loses connectivity or becomes unavailable.

Observe:

- Does the cluster retain a single authority?
- Does promotion stop safely?
- Does the application continue using the existing primary?
- Does the system enter a safe degraded state?

The desired result may be reduced availability.

That can be preferable to two writers.

## Step 17: Test Fencing Failure

Test what happens when the intended fencing mechanism is unavailable.

Examples:

- Control-plane access unavailable
- Power-control mechanism unavailable
- Network isolation unavailable
- Storage fencing unavailable

The important question is:

> Does the system refuse unsafe promotion when it cannot establish the required safety condition?

If the answer is no, document the risk and fix the architecture before relying on automatic failover.

## Step 18: Test the Old Primary Returning

Bring the failed primary back according to the test procedure.

Do not immediately return it to service.

Verify:

- It remains non-authoritative
- It does not accept production-style writes
- It does not automatically become primary
- It requires the documented rejoin process

Then test the recovery path.

```text
OLD PRIMARY RETURNS
        ↓
REMAINS FENCED
        ↓
STATE INSPECTED
        ↓
REJOIN PROCEDURE
        ↓
REPLICA
```

This test catches a common assumption:

"The server rebooted, therefore everything is normal."

No.

The server rebooted.

That is all you know.

## Step 19: Test Rejoin and Resynchronization

Verify that the recovered node can safely become a replica.

Check:

- State synchronization
- Replication direction
- Replication health
- Lag
- Role
- Monitoring

Confirm that it does not become an unauthorized writer.

## Step 20: Test Repeated Failover

Some systems work correctly once and fail under repeated role changes.

In a controlled test environment, perform multiple documented failovers.

Observe:

- Leader changes
- Fencing transitions
- Replication recovery
- Application routing
- Monitoring
- Stale state

Do not perform endless failover loops.

The objective is to test recovery transitions, not to make the database experience a personal crisis.

## Step 21: Test Stale Clients

Applications may retain old database connections longer than expected.

Test:

- Existing connection pools
- Long-running workers
- Background jobs
- Cached service discovery
- Persistent connections

Verify that stale clients cannot continue writing to a demoted primary.

This is particularly important because a database can have perfect cluster-level authority while an old client is still trying to use an old endpoint.

## Step 22: Test Monitoring and Alerting

A failover that works but nobody notices is operationally incomplete.

Verify alerts for:

- Primary change
- Replica promotion
- Fencing
- Quorum loss
- Multiple primary signals
- Replication lag
- Failed rejoin
- Old-primary traffic

Make sure alerts identify the current authoritative writer.

Do not make the incident responder solve a topology puzzle from twelve unrelated alerts.

## Step 23: Capture Evidence During the Test

Record:

- Exact timestamps
- Cluster state
- Database roles
- Quorum state
- Fencing actions
- Replication positions
- Application routing
- Test writes
- Errors
- Recovery actions

Use synchronized clocks where possible.

Evidence collected during the event is more reliable than trying to reconstruct it six weeks later from memory.

## Step 24: Record Unexpected Behavior

Do not quietly fix a surprising result and declare success.

If something behaves differently from the design, record it.

For example:

```text
Expected:
Old primary becomes non-writable immediately.

Observed:
Existing worker connection continued to write for 12 seconds.

Result:
FAIL

Follow-up:
Investigate connection handling and fencing boundary.
```

Unexpected behavior is the reason the test exists.

## Step 25: Repeat Failed Tests After Remediation

If a safety property fails, fix the system and run the relevant test again.

Do not replace:

```text
TEST FAILED
```

with:

```text
TEST FAILED BUT WE UNDERSTAND WHY
```

Understanding is useful.

Passing the safety test is better.

## Step 26: Test the Abort Procedure

A mature test program also verifies that operators can stop an unsafe test.

Test:

- Emergency abort
- Fencing activation
- Traffic restoration
- Incident escalation
- Rollback
- Communication

Operators should know how to stop the test without needing to invent commands under pressure.

## Step 27: Define a Production Test Boundary

If you eventually perform controlled resilience testing in production, define explicit boundaries first.

Examples may include:

- Approved maintenance window
- Specific target
- Maximum duration
- Allowed fault types
- Abort conditions
- Monitoring requirements
- Named operator
- Named incident commander
- Rollback procedure
- Customer-impact threshold

Production failure testing should be a formal operational practice, not an afternoon experiment.

## Step 28: Build a Failover Test Matrix

Track scenarios systematically.

Example:

| Scenario | Fencing | Quorum | Promotion | Routing | Single Writer | Result |
|---|---|---|---|---|---|---|
| Primary crash | PASS | PASS | PASS | PASS | PASS | PASS |
| Replica failure | PASS | PASS | N/A | PASS | PASS | PASS |
| Quorum loss | PASS | PASS | BLOCKED | PASS | PASS | PASS |
| Network partition | PASS | PASS | PASS | PASS | PASS | PASS |
| Controller failure | PASS | PASS | BLOCKED | PASS | PASS | PASS |
| Old primary return | PASS | PASS | N/A | PASS | PASS | PASS |

The exact scenarios should reflect your architecture.

Do not mark a scenario PASS because the database eventually recovered.

All relevant safety assertions must pass.

## Step 29: Review the Test With the Team

After testing, ask:

- What surprised us?
- Which assumption was wrong?
- Did fencing behave as expected?
- Did quorum behave as expected?
- Did clients follow the new primary?
- Did any stale writers remain?
- Did monitoring provide enough evidence?
- Was the recovery procedure understandable?
- Could a new operator perform it?

Turn findings into concrete changes.

## Step 30: Schedule the Next Test

Failover knowledge decays.

Software changes.
Network architecture changes.
Automation changes.
Database versions change.
People change.

A failover procedure that worked six months ago is not automatically still valid.

Schedule recurring tests appropriate to your environment.

## Common Mistakes

### Testing the Failure Before Testing the Abort

Know how to stop the experiment before starting it.

### Testing Only the Database

Applications, workers, routing, monitoring, and automation are part of the failover system.

### Testing Only the Happy Path

A primary crash is not the only failure mode.

Test partitions, quorum loss, fencing failure, stale clients, and controller failure where safely possible.

### Treating Recovery as Proof of Safety

A system can recover successfully while briefly allowing two writers.

That is not a successful safety test.

### Ignoring Existing Connections

Connection pools and long-lived workers can behave differently from new clients.

### Changing Several Variables at Once

If fencing, routing, quorum, and application configuration all change simultaneously, you may not know which mechanism actually worked.

### Testing Production Without Boundaries

"We'll know when to stop" is not an abort criterion.

### Keeping Results in Someone's Head

Document the evidence.

## Emergency Procedure

If a controlled resilience test begins producing unexpected behavior:

1. Stop introducing additional faults.
2. Activate the documented abort procedure.
3. Establish the current authoritative writer.
4. Fence any unsafe writer.
5. Verify fencing.
6. Restore safe application routing.
7. Confirm quorum state.
8. Confirm exactly one authorized writer.
9. Stop the test.
10. Preserve logs and evidence.
11. Assess whether any test data was lost or duplicated.
12. Restore the test environment to a known-good state.
13. Document the failure.
14. Do not repeat the same test until the unsafe condition is understood.

If the test unexpectedly affects production, stop the test immediately and activate the organization's normal production incident procedure.

## Congratulations!

You have now tested the database failover machinery without making production discover what happens when everyone is wrong at once.

You verified:

- Fencing
- Quorum
- Promotion
- Single-writer behavior
- Application routing
- Old-primary recovery
- Replica rejoin
- Monitoring
- Abort procedures

EstroBunny has reviewed the test matrix.

She has found one scenario marked:

```text
UNKNOWN
```

She has circled it.

She has added:

> "Unknown is not a passing result."

The database team agrees.

She has also added one final test:

```text
TEST: What happens when EstroBunny says,
"It'll probably be fine"?

EXPECTED RESULT:
Immediately require a second operator review.
```

The test has passed.

Nobody knows whether this is reassuring.

Still, the production database remains online.

That counts.

**still here 🏳️‍⚧️**