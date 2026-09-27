# How to Prevent and Recover From Database Split-Brain After a Failover

You have completed a database failover.

The new primary is serving traffic.

The old primary has just come back online.

Someone has asked:

> "So can we just let it reconnect?"

No.

Database split-brain occurs when two database nodes, or two database groups, believe they are independently authoritative and accept conflicting writes. After a failover, this can happen when the old primary is isolated incorrectly, when automated failover disagrees with manual recovery, or when a previously failed node returns without being safely rejoined.

Preventing split-brain is primarily about establishing one authoritative writer. Recovering from it requires identifying which state is authoritative, fencing conflicting writers, preserving evidence, and carefully reconciling or rebuilding divergent nodes.

This guide assumes a production database environment where data integrity matters more than preserving the feelings of a server that has been told it is no longer the primary.

> **Warning:** Do not allow two database nodes to accept production writes merely because both report that they are healthy. Health and authority are different things.

## Things You'll Need

- Database topology documentation
- Failover and fencing procedures
- Replication status
- Database logs
- Application routing controls
- Monitoring and alerting
- Backup or point-in-time recovery capability
- A known source of authority for the current primary
- Access to incident records
- A very firm rule about who is allowed to declare a primary
- Enough patience to avoid typing `make-everything-primary`

## Step 1: Understand What Split-Brain Actually Means

Split-brain is not simply "two databases are running."

Two healthy database instances can coexist safely when one is primary and the other is a replica.

The dangerous condition is that multiple sides of the system believe they are independently authoritative and can accept conflicting writes.

For example:

```text
              APPLICATIONS
              /          \
             /            \
            ▼              ▼
     ┌────────────┐  ┌────────────┐
     │ PRIMARY A  │  │ PRIMARY B  │
     │   WRITES   │  │   WRITES   │
     └────────────┘  └────────────┘
            \              /
             \            /
              DATA DIVERGES
```

At this point, the problem is no longer simply availability.

It is authority and data integrity.

EstroBunny has described this as:

**Two databases entering a custody battle over reality.**

The database team has requested that she use more precise terminology.

She has agreed.

She has written it in the incident notes anyway.

## Step 2: Establish Who Is Allowed to Declare a Primary

Every failover system needs a clear authority model.

Depending on the architecture, this may involve:

- A consensus or quorum mechanism
- A dedicated failover controller
- An orchestration system
- A distributed lock
- A fencing mechanism
- A human incident commander
- A documented operational procedure

Know which mechanism your environment uses.

Do not assume that the machine with the newest hostname, lowest latency, or most dramatic blinking light is authoritative.

## Step 3: Treat Fencing as a First-Class Safety Mechanism

Fencing means preventing an old or unsafe node from continuing to act as a writer.

Depending on the platform, fencing may involve:

- Powering off the old node
- Removing network access
- Revoking database write access
- Removing it from service discovery
- Using infrastructure-level isolation
- Using storage-level fencing
- Using a database-specific demotion mechanism

The exact mechanism depends on your architecture.

The important property is this:

> The old primary must not be able to continue making production writes after authority has moved elsewhere.

Do not confuse:

```text
"We told it to stop"
```

with:

```text
"It cannot write anymore."
```

The second one is what matters.

## Step 4: Freeze the Situation When Split-Brain Is Suspected

If you suspect two writers are active, stop making the situation more complicated.

Depending on the architecture and incident procedure:

- Pause application writes
- Stop automated failover actions
- Freeze deployments
- Stop background workers that write to the database
- Preserve current routing information
- Prevent additional topology changes

Do not start manually repairing records while the authoritative writer is still unclear.

You cannot safely repair a disagreement between two databases while actively creating more disagreements.

## Step 5: Identify Every Potential Writer

Create a list.

```text
Potential writer: db-primary-01
Potential writer: db-primary-02
Potential writer: application worker cluster
Potential writer: scheduled job
Potential writer: failover controller
Potential writer: maintenance script
```

Check:

- Database role
- Application routing
- Connection endpoints
- Service discovery
- Proxy configuration
- Scheduled jobs
- Worker processes
- Automation
- Administrative sessions

A database can have one official primary and still have another system attempting writes through a stale endpoint.

## Step 6: Determine Whether Split-Brain Actually Happened

Do not use the word "split-brain" merely because a node was temporarily unreachable.

Look for evidence.

Useful evidence includes:

- Two nodes reporting writable/primary state
- Writes accepted independently by multiple nodes
- Divergent transaction histories
- Conflicting sequence or transaction positions
- Application traffic reaching both nodes
- Replication errors caused by divergent writes
- Logs showing independent promotion

Distinguish:

1. **Potential split-brain** — authority was ambiguous, but conflicting writes are not confirmed.
2. **Confirmed split-brain** — multiple sides accepted conflicting writes.
3. **Post-split recovery** — writers have been fenced and the remaining problem is reconciling or rebuilding state.

This distinction matters because the recovery actions are different.

## Step 7: Establish the Authoritative Side

Once writers are controlled, determine which database state should become the source of truth.

Consider:

- Which node was formally promoted
- Which node received authorized application traffic
- Transaction history
- Incident timeline
- Replication state
- Recovery objectives
- Backup availability
- Business-critical writes

Do not decide based solely on:

- Which database has more rows
- Which server has a newer timestamp
- Which node is faster
- Which machine claims to be primary

The authoritative state is a governance and recovery decision supported by technical evidence.

## Step 8: Preserve Both Sides Before Repairing Anything

If divergent state exists, preserve evidence before changing it.

Capture appropriate:

- Database logs
- Replication metadata
- Transaction positions
- Relevant tables or records
- Backup information
- Configuration
- Routing state
- Application logs
- Incident timestamps

Follow your organization's evidence-retention and privacy requirements.

Do not immediately wipe the old node.

That database may contain the only record of writes that occurred during the split.

## Step 9: Build the Split-Brain Timeline

Create one timeline.

For example:

```text
18:02  Primary A becomes unreachable
18:04  Failover controller promotes B
18:05  Application traffic moves to B
18:06  A becomes reachable again
18:07  A accepts administrative writes
18:08  Stale routing sends worker traffic to A
18:09  Divergence detected
18:10  A fenced
```

The timeline should answer:

- When did authority change?
- When did the old primary return?
- When did each node accept writes?
- Which applications reached each node?
- When was the conflict detected?
- When was the unsafe writer fenced?

Do not fill unknown times with guesses.

Write `UNKNOWN`.

Unknown is a valid incident state.

## Step 10: Stop the Old Primary From Writing

Now perform the documented fencing action.

The goal is to establish one writable authority.

Verify the result rather than assuming it worked.

Check:

- Network isolation
- Database role
- Write permissions
- Application routing
- Connection pools
- Worker connections
- Automation

Then test the intended safety property:

```text
Old primary: cannot accept production writes
New primary: authorized production writer
```

Do not celebrate yet.

You have stopped the bleeding.

You have not repaired the wound.

## Step 11: Determine the Divergence Window

Find the period during which conflicting writers may have existed.

Record:

- Start of possible divergence
- End of possible divergence
- Nodes involved
- Applications involved
- Known writes on each side
- Known replication position

This becomes the **Divergence Window™**.

It is a terrible name.

It is also useful.

## Step 12: Identify Conflicting Writes

Compare the relevant state between the authoritative database and the divergent database.

Look for:

- Same record changed differently
- Records created on both sides
- Deletes on one side but not the other
- Conflicting status changes
- Sequence or identifier collisions
- Duplicate business operations
- Referential-integrity differences

Do not compare only row counts.

Two databases can contain the same number of rows and still disagree about nearly everything that matters.

## Step 13: Classify the Divergent Data

Classify findings.

```text
Category A: Exists only on authoritative side
Category B: Exists only on divergent side
Category C: Exists on both with identical state
Category D: Exists on both with conflicting state
Category E: Unknown
```

This prevents the incident from turning into:

```text
"The databases look different."
```

That statement is technically true and operationally useless.

## Step 14: Decide Whether to Reconcile or Rebuild

Not every divergent database should be manually merged.

Possible recovery paths include:

- Discard divergent state and rebuild the node from the authoritative primary
- Restore the node from a known-good backup
- Reinitialize replication
- Reconcile a limited set of business records
- Recover specific transactions through application-level procedures
- Escalate to database specialists

Rebuilding is often safer than attempting a manual database merge when the divergent node has a complex or uncertain history.

The correct choice depends on the database technology, amount of divergence, recovery objectives, and available backups.

## Step 15: Do Not 'Merge the Databases' Without a Plan

Database state is not automatically mergeable like two text files.

Blindly copying rows can create:

- Duplicate records
- Broken foreign keys
- Invalid state transitions
- Sequence collisions
- Lost deletes
- Incorrect timestamps
- Double-processed operations
- Corrupted business invariants

If reconciliation is required, define the rules first.

For example:

```text
Order created on authoritative side: keep
Order created only on divergent side: investigate
Same order updated differently: business review
Duplicate payment operation: escalate immediately
Unknown state: preserve and investigate
```

Do not write a 400-line SQL script at 03:00 because someone said:

> "It should be pretty straightforward."

## Step 16: Protect Against Duplicate Business Operations

Some systems can tolerate data reconciliation better than others.

Financial transactions, inventory changes, account operations, and external API calls may have effects outside the database.

Check whether divergent writes triggered:

- Payments
- Emails
- Shipments
- Notifications
- Webhooks
- Queue messages
- External API requests

A database rollback cannot automatically undo an external side effect.

Document these separately.

## Step 17: Rebuild or Rejoin the Divergent Node Safely

Once the authoritative state is established, follow the documented rejoin procedure.

This may involve:

1. Keeping the divergent node isolated.
2. Removing stale replication metadata.
3. Reinitializing it from the authoritative source.
4. Verifying the restored state.
5. Starting replication.
6. Confirming replication health.
7. Returning it to service as a replica.

Do not allow a divergent node to rejoin as a writer unless the architecture explicitly supports and controls that behavior.

The goal is boring:

```text
ONE PRIMARY
ONE AUTHORITY
EVERYTHING ELSE FOLLOWS
```

## Step 18: Verify the Recovered Topology

Draw it again.

```text
                 APPLICATION
                      │
                      ▼
              ┌──────────────┐
              │ NEW PRIMARY  │
              └──────┬───────┘
                     │
              replication
                     │
              ┌──────▼───────┐
              │  REPLICA 01  │
              └──────────────┘
```

Then verify:

- Only one production writer exists
- Application routing points to it
- Replicas are actually replicas
- Replication is healthy
- Monitoring understands the new topology
- Automated failover has the correct authority state

If you cannot draw the final topology clearly, you are not finished.

## Step 19: Test the Fencing Mechanism

After recovery, verify that your split-brain prevention mechanism actually works.

Questions:

- Can the old primary still receive traffic?
- Can it accept writes?
- Can automation accidentally promote it?
- Can a stale service-discovery record route traffic to it?
- Can a recovered host bypass the fencing mechanism?

Do this through an approved test procedure.

Do not simulate a production split-brain by randomly unplugging servers during business hours.

EstroBunny has already proposed this.

She has been moved away from the network cabinet.

## Step 20: Review Automated Failover Behavior

If automation contributed to the incident, inspect its decision process.

Determine:

- What triggered promotion?
- What evidence did the controller use?
- Could it see the old primary?
- Could two controllers make independent decisions?
- Was quorum available?
- Did health checks measure availability or authority?
- Was fencing completed before promotion?

A system that automatically promotes databases without reliable fencing can automate split-brain just as efficiently as it automates recovery.

Automation is not the opposite of human error.

Sometimes it is human error with excellent uptime.

## Step 21: Add Explicit Split-Brain Alerts

Monitoring should detect conditions that suggest conflicting authority.

Useful signals can include:

- More than one node reporting primary role
- Multiple writable endpoints
- Unexpected replication direction
- Replication stopped after promotion
- Application traffic reaching a fenced node
- Old primary accepting connections
- Divergent transaction positions

Alert on evidence of conflicting authority, not merely server availability.

## Step 22: Document the Recovery Decision

Write down:

- What happened
- Which nodes diverged
- When divergence began
- When writers were fenced
- Which state was declared authoritative
- What data was lost, preserved, reconciled, or unknown
- How the divergent node was recovered
- Final topology
- Follow-up actions

Example:

```text
Incident: Database split-brain after failover
Authoritative primary: db-primary-02
Divergent node: db-primary-01
Possible divergence: 18:06–18:09
Fencing completed: 18:10
Data reconciliation: 3 records investigated
External side effects: None detected
db-primary-01: Rebuilt as replica
Final topology: Verified
```

Do not write:

```text
root cause: database being weird
```

Even if that is how everyone feels.

## Common Mistakes

### Treating Health as Authority

A healthy server can still be the wrong writer.

### Promoting Before Fencing

If the old primary can still write, promotion can create two authorities.

### Reconnecting the Old Primary Immediately

Recovery does not automatically erase divergent state.

### Merging Rows Without Understanding Business Rules

Conflicting database state may represent conflicting real-world events.

### Looking Only at Technical Data

Payments, orders, messages, and external API calls may have already happened.

### Destroying the Divergent Node Before Preserving Evidence

You may erase the only record of what happened.

### Assuming Automation Prevents Split-Brain

Automation without a reliable authority and fencing model can make the problem faster.

## Emergency Procedure

If split-brain is suspected:

1. Declare the incident.
2. Freeze unnecessary changes.
3. Stop automated failover actions if appropriate.
4. Identify every potential writer.
5. Determine whether conflicting writes are confirmed.
6. Establish the authoritative side.
7. Fence the non-authoritative writer(s).
8. Verify fencing actually worked.
9. Preserve logs and database evidence.
10. Establish the divergence window.
11. Identify divergent writes.
12. Assess external side effects.
13. Decide whether to reconcile or rebuild.
14. Preserve uncertain data rather than guessing.
15. Rebuild or safely rejoin divergent nodes.
16. Verify exactly one authoritative writer.
17. Verify application routing.
18. Verify replication.
19. Test the final topology.
20. Document data-loss and reconciliation outcomes.
21. Schedule the post-incident review.

If the authoritative state cannot be established safely, stop and escalate to the appropriate database and incident-response specialists.

## Congratulations!

You have survived database split-brain.

There is now one authoritative primary.
The old primary has been safely contained.
Divergent state has been preserved and investigated.
The recovered node has been rebuilt or safely rejoined.
Replication is behaving itself.
The application knows where to write.

EstroBunny has opened the incident timeline.

She has highlighted the exact moment someone said:

> "I think the old primary is back."

She has written underneath it:

**THIS IS NOT A RECOVERY SIGNAL. THIS IS A RECOVERY PROBLEM.**

The database team has approved the wording.

EstroBunny has also created a new monitoring alert:

```text
ALERT: TWO DATABASES THINK THEY ARE THE BOSS
Severity: OH NO
Action: FENCE FIRST, ASK QUESTIONS SECOND
```

The alert is considered technically reasonable.

Do not let her name the next alert.

**still here 🏳️‍⚧️**