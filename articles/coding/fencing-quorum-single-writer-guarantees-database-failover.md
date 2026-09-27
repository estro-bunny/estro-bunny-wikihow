# How to Use Fencing, Quorum, and Single-Writer Guarantees During Database Failover

The database team has recovered from split-brain.

Everyone agrees that having two primaries was a bad idea.

Someone has now asked the obvious question:

> "How do we make sure it does not happen again?"

Excellent.

This is where failover stops being a button and becomes a distributed-systems problem.

Fencing, quorum, leader election, and single-writer guarantees exist to answer one fundamental question:

> **Who is allowed to write?**

A reliable failover design must establish that answer even when machines disappear, networks partition, health checks lie by omission, and two servers are absolutely convinced that they are the main character.

This guide explains the safety concepts and operational checks behind those mechanisms. The exact implementation depends on the database, orchestration platform, storage system, and network architecture.

> **Warning:** Never assume that a node being unreachable means it is incapable of writing. Network isolation can prevent you from seeing a node while leaving the node perfectly capable of accepting writes from something else.

## Things You'll Need

- Database topology documentation
- Failover architecture documentation
- Replication and election configuration
- Health-check definitions
- Fencing mechanism
- Quorum or consensus mechanism, if applicable
- Service-discovery configuration
- Application routing controls
- Monitoring for role and writer state
- A tested failover procedure
- Someone who understands the difference between "I cannot reach it" and "it cannot write"

## Step 1: Define the Single-Writer Guarantee

Start with the property you actually want.

For a single-primary database architecture, the safety requirement is approximately:

```text
At any point in time:

there must not be two independently authorized
production writers for the same database state.
```

The exact guarantee depends on the database and consistency model.

Write the system's actual guarantee down.

For example:

```text
Writer guarantee:
Only the currently elected primary may accept
production writes.

Old primaries must be fenced before another
node becomes authoritative.
```

If your documentation cannot describe who is allowed to write, the architecture is already asking difficult questions.

## Step 2: Separate Availability From Authority

A node can be:

- Healthy
- Reachable
- Running
- Replicating
- Accepting connections

and still not be the authorized writer.

Likewise, a primary can be temporarily unreachable while another node is being considered for promotion.

These are different concepts:

```text
HEALTH      → Is the node functioning?
REACHABLE   → Can I communicate with it?
ROLE        → What does the node believe it is?
AUTHORITY   → Is it actually allowed to write?
```

Do not build a failover decision using only the first two.

That is how a perfectly healthy server becomes an extremely unhealthy incident.

## Step 3: Understand Why Fencing Exists

Fencing prevents an old or unsafe node from continuing to participate as a writer.

The critical property is not:

```text
"The old node knows it lost."
```

It is:

```text
"The old node cannot continue writing."
```

Depending on the environment, fencing can be implemented through:

- Power control
- Network isolation
- Storage-level isolation
- Revoking write capability
- Database-level demotion
- Infrastructure orchestration
- A combination of mechanisms

The implementation is architecture-specific.

The safety property is not.

## Step 4: Distinguish Fencing From Demotion

Demotion changes the intended database role.

Fencing prevents the old role from continuing to cause harm.

For example:

```text
Demotion:
"Please stop being primary."

Fencing:
"You no longer have the ability to act as primary."
```

A graceful demotion may be sufficient during an orderly maintenance operation.

During an unexpected failure, graceful communication with the old primary may be impossible.

That is why robust failover systems need a mechanism that works even when the old node is not cooperating.

## Step 5: Identify the Failure Model

Document what failures your failover design is expected to tolerate.

Examples include:

- Database process crash
- Host failure
- Power failure
- Network partition
- Storage failure
- Partial network outage
- Lost monitoring path
- Lost control-plane connectivity
- Replica failure
- Failover-controller failure

Then ask:

> What happens if the node that I cannot reach is still running?

This question is extremely important.

A design that handles crashes but not network partitions may behave very differently from one designed to tolerate both.

## Step 6: Understand Quorum

Quorum is a mechanism for requiring enough members or votes to agree before certain distributed decisions are made.

A common majority model is:

```text
3 voting members → quorum = 2
5 voting members → quorum = 3
```

The exact rules depend on the system.

The purpose is to prevent two isolated groups from both believing they have sufficient authority.

For example:

```text
Group A: 2 votes
Group B: 1 vote

Only A reaches majority quorum.
```

Do not assume that adding more machines automatically improves safety.

Poorly defined membership and failure rules can make a larger cluster more confusing without making it safer.

## Step 7: Know What Quorum Does Not Do

Quorum does not automatically:

- Stop an old database process
- Repair corrupted data
- Guarantee replication is caught up
- Prove a node is healthy
- Redirect application traffic
- Prevent every configuration error

Quorum helps establish distributed authority.

Fencing helps prevent unauthorized participation.

Routing controls determine where clients actually connect.

These mechanisms solve different problems.

## Step 8: Understand the Dangerous Partition

Consider this situation:

```text
        NETWORK PARTITION
             ║
      ───────╫───────
             ║
      Node A     Node B
      PRIMARY    REPLICA
```

Node B cannot reach Node A.

That does not prove Node A is dead.

Node A might still be:

- Running
- Accepting writes
- Connected to some clients
- Connected to storage
- Connected to other infrastructure

If Node B promotes itself without establishing authority or fencing Node A, both sides may accept writes.

This is the classic split-brain danger.

## Step 9: Establish the Failover Decision Sequence

A safe failover process should have an explicit sequence.

A simplified conceptual sequence is:

```text
Detect failure
     ↓
Establish authority
     ↓
Fence old writer
     ↓
Verify fencing
     ↓
Promote candidate
     ↓
Redirect clients
     ↓
Verify single writer
```

The exact order may differ for a specific platform.

Do not copy this sequence blindly into production automation.

The important point is that promotion should not create a second writer while the first writer may still be active.

## Step 10: Decide Who Can Initiate Failover

Define the authority to trigger a promotion.

Possible mechanisms include:

- Automated controller
- Consensus system
- Database-native failover
- Human operator
- Hybrid automation with human approval

Whatever you choose, document:

- Who can promote
- What evidence is required
- What fencing must happen first
- What happens if the controller loses connectivity
- What happens if two controllers disagree

Two independent automation systems should not be allowed to make contradictory primary decisions.

That is not redundancy.

That is a leadership contest.

## Step 11: Make Health Checks Specific

A generic health check such as:

```text
HTTP 200 OK
```

does not prove database authority.

Useful checks may include:

- Database process health
- Replication health
- Current role
- Election state
- Write capability
- Cluster membership
- Quorum state
- Fencing state

Design health checks around the decision they support.

Ask:

> What would this check prove if it passed?

If the answer is "the server is alive," do not use it as proof that the server should become primary.

## Step 12: Avoid Ambiguous Primary Signals

Do not rely on a single loosely defined signal such as:

- Hostname
- DNS name
- Last-known role
- A stale configuration file
- A dashboard label
- A process flag

Use authoritative state from the system that actually controls leadership.

A server saying:

```text
role=PRIMARY
```

is evidence of what that server believes.

It is not automatically proof that the cluster agrees.

## Step 13: Verify Fencing Before Promotion

This is one of the most important checks in the entire procedure.

Before promoting a new writer, establish that the old writer cannot continue production writes.

Verify the actual mechanism.

For example:

```text
Old primary process: isolated
Old primary network path: blocked
Old primary write path: unavailable
Application routing: removed
Failover controller: aware of fencing
```

The exact checks depend on the architecture.

Do not mark fencing complete because someone clicked a checkbox.

Verify the safety property.

## Step 14: Make Fencing Idempotent

Fencing actions should ideally be safe to repeat.

For example, if a node is already isolated, issuing the same isolation operation should not create a dangerous new state.

Idempotent operations are valuable because incident procedures may be retried.

A dangerous procedure looks like:

```text
Run once → works
Run twice → accidentally restores connectivity
```

That is not a procedure.

That is a trap wearing documentation.

## Step 15: Prevent Stale Service Discovery

Even after a database node is fenced, clients may still have stale information.

Check:

- DNS
- Service discovery
- Load balancers
- Connection strings
- Connection pools
- Sidecars
- Cached endpoints

Failover is incomplete if the cluster knows who the primary is but the application does not.

## Step 16: Establish a Single Writable Endpoint

Where possible, make applications connect through an endpoint representing the current writer rather than hard-coding individual database hosts.

For example:

```text
Application
     │
     ▼
writer.database.internal
     │
     ▼
Current Primary
```

This does not replace fencing or quorum.

It reduces the number of places that must change during failover.

Do not let application configuration become a second source of truth for database authority.

## Step 17: Handle the Old Primary Returning

Suppose the old primary returns after failover.

Do not automatically restore it to primary.

The safe conceptual flow is:

```text
Old primary returns
        ↓
Keep isolated
        ↓
Inspect state
        ↓
Compare with authoritative primary
        ↓
Rebuild or reinitialize if required
        ↓
Rejoin as replica
        ↓
Verify replication
```

The old machine's previous title does not grant it authority.

Primary is a role, not an emotional attachment.

## Step 18: Define a Rejoin Rule

Write down exactly what qualifies a recovered node for rejoining.

Possible requirements include:

- No divergent writes
- State synchronized
- Replication metadata reset
- Correct configuration
- Correct cluster membership
- Correct role
- Monitoring healthy
- Fencing state clear

Make the rejoin process explicit.

Do not make:

```text
"It looks okay, put it back."
```

the official recovery procedure.

## Step 19: Verify the Single-Writer Invariant

After failover, explicitly test the invariant.

Ask:

```text
How many nodes can currently accept production writes?
```

The expected answer in a single-primary design should be:

```text
ONE
```

Then verify:

- Current primary
- Fenced nodes
- Replicas
- Application endpoint
- Background workers
- Administrative write paths

This should be observable in monitoring.

## Step 20: Monitor for Multiple Writers

Create alerts for conditions that indicate authority is ambiguous.

Examples:

- More than one node reports primary
- More than one node accepts production writes
- Two independent leader leases exist
- Replication direction changes unexpectedly
- A fenced node receives application traffic
- A node writes after losing leadership

Do not wait for corrupted data to tell you that your single-writer guarantee failed.

## Step 21: Test Failover Without Testing Split-Brain

Failover must be tested regularly.

But a failover test should have controlled boundaries.

Test:

- Primary loss
- Replica promotion
- Application routing
- Fencing
- Recovery
- Old-primary rejoin
- Monitoring

Do not create uncontrolled network partitions in production merely because the architecture diagram looks confident.

Use approved failure-injection and disaster-recovery procedures.

EstroBunny has been informed that "let's just disconnect the primary and see what happens" is not a test plan.

She has renamed the spreadsheet:

**Things We Are Absolutely Not Doing At 2:00 PM On Friday.xlsx**

## Step 22: Test the Failure of the Failover System Itself

A mature design asks what happens when the thing responsible for failover fails.

Consider:

- Election controller unavailable
- Quorum member unavailable
- Fencing service unavailable
- Monitoring unavailable
- Service discovery unavailable
- Network partition between control-plane components

Determine whether the system:

- Safely refuses promotion
- Continues with an existing primary
- Requires human intervention
- Risks ambiguous authority

A system that fails closed may sacrifice availability.

A system that fails open may risk multiple writers.

Document which behavior your architecture intentionally chooses.

## Step 23: Define What Happens When Quorum Is Lost

Quorum loss should have a documented behavior.

Depending on the architecture, the system may:

- Stop accepting writes
- Refuse promotion
- Keep the current primary running
- Require operator intervention

The important thing is that the behavior is intentional.

Do not discover your quorum policy for the first time during an outage.

## Step 24: Record the Safety Properties

Document the guarantees your system is intended to provide.

For example:

```text
Safety Property 1:
At most one production primary is authoritative.

Safety Property 2:
A node must be fenced before another node is promoted
when the old node may still be capable of writing.

Safety Property 3:
Recovered old primaries rejoin as replicas only after
state has been verified.

Safety Property 4:
Application routing follows the authoritative writer.
```

These statements are more useful than vague documentation such as:

"The cluster handles failover automatically."

## Step 25: Turn the Guarantees Into Tests

Every important safety property should have a test.

Example:

```text
Property: Only one writer exists.
Test: Simulate controlled primary failure.
Expected: Old writer fenced before promotion.
Verification: Confirm old writer cannot accept writes.
```

Another:

```text
Property: Recovered primary cannot return as writer.
Test: Recover old host after promotion.
Expected: It remains isolated.
Verification: Rejoin procedure required.
```

A guarantee that has never been tested is an aspiration.

EstroBunny has written this sentence on a sticky note.

She has placed it directly on the incident commander's monitor.

Nobody knows where she got the sticky notes.

## Step 26: Review Every Failover Afterward

After a failover, ask:

- Was authority unambiguous?
- Did fencing happen before promotion?
- Did quorum behave as expected?
- Did the application route correctly?
- Did any stale clients reach the old writer?
- Did monitoring detect the role change?
- Did the old primary rejoin safely?
- Did automation make any unexpected decisions?

Do not review only whether the database eventually came back.

A failover can succeed operationally while violating the safety guarantees you intended to have.

## Common Mistakes

### Treating Quorum as a Replacement for Fencing

Quorum establishes distributed decision authority.

It does not necessarily stop an isolated old primary from accepting writes.

### Treating Fencing as a Dashboard Checkbox

Fencing must prevent unsafe behavior, not merely change a status label.

### Using Reachability as Proof of Failure

A node that cannot be reached may still be running.

### Promoting Before Establishing Authority

That is how two nodes can become convinced they are primary.

### Letting Applications Choose the Primary Independently

Application routing should follow database authority rather than inventing its own.

### Rejoining the Old Primary Automatically

Previous authority does not survive failover merely because the machine rebooted.

### Never Testing the Failure Mode

An untested fencing mechanism is a theory.

## Emergency Procedure

If you need to perform a controlled failover:

1. Confirm the failure condition.
2. Identify the current authoritative primary.
3. Identify the candidate node.
4. Determine whether the old primary may still be capable of writing.
5. Establish the required authority/quorum state.
6. Fence the old writer when required.
7. Verify fencing.
8. Promote the approved candidate using the documented procedure.
9. Verify exactly one authoritative writer.
10. Redirect application traffic.
11. Verify application reads and writes.
12. Monitor for conflicting writers.
13. Keep the old primary isolated.
14. When it returns, inspect it before rejoining.
15. Rebuild or reinitialize it if required.
16. Rejoin it as a replica only after verification.
17. Verify the final topology.
18. Record the incident and any safety-property failures.

If quorum or fencing state is uncertain, do not guess. Follow the documented safe-failure behavior and escalate to the appropriate database/infrastructure specialists.

## Congratulations!

You have now implemented the three sacred principles of controlled database failover:

**Quorum decides who gets a vote.**

**Fencing prevents the wrong machine from writing.**

**Single-writer guarantees prevent the database from developing two competing governments.**

EstroBunny has inspected the architecture diagram.

She has drawn one enormous circle around the current primary.

Then she has drawn a smaller circle around the fencing mechanism.

Then she has written:

```text
IF PRIMARY DIES:
DO NOT PANIC.
DO NOT PROMOTE RANDOMLY.
DO NOT LET THE OLD PRIMARY WRITE.
CHECK QUORUM.
CHECK FENCING.
THEN PROMOTE.
```

Everyone agrees this is unusually sensible.

EstroBunny is concerned.

She has asked where the chaos went.

The incident commander has pointed at the distributed-systems diagram.

She has found it.

It is hiding behind the quorum configuration.

Do not touch it.

**still here 🏳️‍⚧️**