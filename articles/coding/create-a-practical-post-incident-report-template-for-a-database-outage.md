# How to Create a Practical Post-Incident Report Template for a Database Outage

The database outage is over.

The alerts have stopped screaming.

Someone has closed the emergency terminal.

Now you need to document what happened before everyone remembers a completely different version of events.

A useful post-incident report should capture the facts, impact, timeline, technical cause, response, recovery, and follow-up actions without becoming a 47-page archaeological excavation.

This guide creates a practical template that can be reused for database outages, failed migrations, connection failures, accidental data changes, performance incidents, and other database-related emergencies.

> **Warning:** Do not write the report entirely from memory. Memory is a storytelling system. Production logs are an evidence system.

## Things You'll Need

- Incident timestamps
- Monitoring and alert data
- Application logs
- Database logs
- Deployment and migration records
- Relevant commands or recovery actions
- A list of affected services or features
- Known-good baseline metrics
- Corrective actions and owners
- Enough coffee to survive the phrase "one more thing"

## Step 1: Start With the Incident Header

Begin with a compact section that lets someone understand the incident without reading the entire report.

Use:

```md
# Database Incident Report

Incident ID: [INCIDENT-ID]
Date: [YYYY-MM-DD]
Start Time: [TIME + TIMEZONE]
End Time: [TIME + TIMEZONE]
Duration: [DURATION]
Severity: [SEVERITY]
Status: [RESOLVED / MONITORING / FOLLOW-UP]
Primary Service: [SERVICE]
Database: [DATABASE / CLUSTER]
Incident Owner: [NAME OR TEAM]
```

Keep this section factual.

Do not write:

```text
Severity: OH GOD
```

Even if that was the exact feeling.

## Step 2: Write a One-Paragraph Summary

The summary should answer four questions:

1. What happened?
2. What was affected?
3. How was service restored?
4. What is being done afterward?

Use a structure like:

```md
## Summary

On [DATE] at [TIME], [SERVICE] experienced [FAILURE].
The incident affected [USERS / REQUESTS / FEATURES] because [CONCISE TECHNICAL CAUSE].
The incident was detected by [DETECTION METHOD].
Service was restored by [RECOVERY ACTION].
Follow-up work includes [KEY CORRECTIVE ACTIONS].
```

Keep it short enough that a tired engineer can understand it.

## Step 3: Record the User Impact

Separate technical symptoms from actual user impact.

Document:

- Affected users or requests
- Affected endpoints or features
- Error rate
- Failed operations
- Data availability
- Data integrity impact
- Delayed jobs
- Duration of impact
- Geographic or tenant scope when relevant

Use measured numbers whenever possible.

Example:

```md
## Impact

- 18% of write requests failed for 14 minutes.
- Reads remained available.
- Background jobs accumulated approximately 3,200 queued tasks.
- No permanent data loss was identified.
- Two customer-facing features were unavailable.
```

Do not substitute:

> The database was having a bad day.

That belongs in the emotional-support channel.

## Step 4: Build the Timeline

The timeline is one of the most important parts of the report.

Record events in chronological order.

```md
## Timeline

| Time | Event | Evidence |
|---|---|---|
| 18:04 | Deployment started | Deployment log |
| 18:05 | Migration started | Migration log |
| 18:06 | Migration failed | Database log |
| 18:06 | Error rate increased | Monitoring |
| 18:08 | Deployment paused | Deployment record |
| 18:19 | Partial schema state confirmed | Database inspection |
| 18:27 | Recovery started | Incident log |
| 18:35 | Service restored | Monitoring |
| 18:52 | Monitoring remained stable | Metrics |
```

Use timestamps from systems whenever possible.

If the exact time is unknown, say so.

Do not invent precision because 18:17 looks nicer than approximately 18:17.

## Step 5: Describe the Detection

Document how the incident became known.

```md
## Detection

Detected by: [ALERT / USER REPORT / ENGINEER / DEPLOYMENT FAILURE]
Detection Time: [TIME]
Time From Failure to Detection: [DURATION]

Detection Details:
[WHAT THE ALERT OR PERSON OBSERVED]

Detection Gaps:
[ANYTHING THAT WAS NOT DETECTED OR DETECTED LATE]
```

This makes monitoring gaps visible without turning the report into a punishment ritual.

If customers noticed the problem first, record that fact.

Do not hide it because the graph looks embarrassing.

Graphs do not experience shame.

## Step 6: Describe the Technical Cause

Explain the failure in enough detail for another engineer to understand it.

Use:

```md
## Technical Cause

Immediate Trigger:
[WHAT DIRECTLY CAUSED THE INCIDENT]

Contributing Factors:
- [FACTOR]
- [FACTOR]
- [FACTOR]

System State:
[IMPORTANT DATABASE / APPLICATION STATE DURING INCIDENT]

Why It Caused Impact:
[EXPLANATION OF THE FAILURE PATH]
```

Distinguish the immediate trigger from contributing factors.

For example:

> The migration failed while creating a constraint.

That is a trigger.

> Production contained existing rows that violated the constraint, while the migration test dataset did not contain representative data.

That is a contributing condition.

Both belong in the report.

## Step 7: Record the Response

Document what the team actually did.

```md
## Response

Initial Actions:
- [ACTION]
- [ACTION]

Investigation:
- [FINDING]
- [FINDING]

Decisions:
- [DECISION] — [REASON]
- [DECISION] — [REASON]

Actions Considered but Rejected:
- [ACTION] — [WHY IT WAS NOT USED]
```

Recording rejected actions is useful when those options may be considered again during a future incident.

It also prevents Future You from asking:

> "Why didn't we just restore the database?"

Future You was there.

Future You simply forgot.

## Step 8: Document the Recovery

Explain how service was restored.

```md
## Recovery

Recovery Strategy:
[DESCRIPTION]

Recovery Start:
[TIME]
Recovery Complete:
[TIME]

Actions Performed:
1. [ACTION]
2. [ACTION]
3. [ACTION]

Validation Performed:
- [CHECK]
- [CHECK]
- [CHECK]

Recovery Risks or Side Effects:
[KNOWN RISKS OR NONE IDENTIFIED]
```

Do not merely write:

> Fixed.

That is not a recovery procedure.

That is a cryptic message from an engineer who has already gone home.

## Step 9: Record Data Integrity Status

Database outages can affect availability without causing data loss.

They can also affect data without producing an obvious outage.

State the data situation explicitly.

```md
## Data Integrity

Data Loss: [YES / NO / UNKNOWN]
Data Corruption: [YES / NO / UNKNOWN]
Duplicate Data: [YES / NO / UNKNOWN]
Partial Writes: [YES / NO / UNKNOWN]
Missing Records: [YES / NO / UNKNOWN]

Validation Performed:
- [CHECK]
- [CHECK]

Outstanding Investigation:
[DETAILS OR NONE]
```

If something is unknown, write UNKNOWN.

Do not turn uncertainty into "NO" because the report has a checkbox.

## Step 10: Record What Went Well

Include controls that worked.

```md
## What Went Well

- [CONTROL OR ACTION THAT HELPED]
- [CONTROL OR ACTION THAT HELPED]
- [CONTROL OR ACTION THAT HELPED]
```

Examples include:

- Automatic deployment halt
- Useful database logs
- Working backups
- Clear ownership
- Fast alerting
- Tested recovery procedures
- Good communication

These protections should not disappear simply because the incident ended.

## Step 11: Record What Went Poorly

Now document the gaps.

```md
## What Went Poorly

- [GAP]
- [GAP]
- [GAP]
```

Be specific.

Instead of:

> Testing was insufficient.

Write:

> The migration was tested against an empty database and did not include rows capable of violating the new constraint.

Specific findings produce better corrective actions.

## Step 12: Add Corrective Actions

Turn important findings into trackable work.

```md
## Corrective Actions

| Action | Owner | Priority | Due | Verification | Status |
|---|---|---|---|---|---|
| [ACTION] | [OWNER] | [PRIORITY] | [DATE] | [HOW VERIFIED] | [STATUS] |
| [ACTION] | [OWNER] | [PRIORITY] | [DATE] | [HOW VERIFIED] | [STATUS] |
```

A corrective action should change something measurable.

"Be more careful" is not a corrective action.

"Add representative production-like fixtures to migration tests" is.

EstroBunny has been asked to define "be more careful" in YAML.

The request has been rejected.

## Step 13: Add Lessons Learned

Capture what the team learned.

```md
## Lessons Learned

### Technical
- [LESSON]

### Process
- [LESSON]

### Observability
- [LESSON]

### Recovery
- [LESSON]
```

Keep lessons connected to evidence.

Do not write a motivational speech.

The database does not need one.

## Step 14: Record Unknowns Separately

Some questions will remain unanswered.

Give them their own section.

```md
## Open Questions

- [QUESTION] — Owner: [NAME], Due: [DATE]
- [QUESTION] — Owner: [NAME], Due: [DATE]
```

This prevents speculation from being mistaken for established fact.

Unknown is a valid state.

It is much safer than inventing a root cause because the incident report has an empty box.

## Step 15: Add the Final Verification

Before closing the report, confirm that the system is healthy and important follow-up actions are tracked.

```md
## Final Verification

Service Healthy: [YES / NO]
Database Healthy: [YES / NO]
Monitoring Stable: [YES / NO]
Data Integrity Verified: [YES / NO / INVESTIGATION OPEN]
Follow-Up Actions Tracked: [YES / NO]

Reviewed By: [NAME / TEAM]
Review Date: [DATE]
```

Do not mark everything YES simply because the incident is no longer exciting.

## Step 16: Copy the Complete Template

Once the structure is established, keep a reusable version in the team's documentation system.

```md
# Database Incident Report

## Incident Header
- Incident ID:
- Date:
- Start Time:
- End Time:
- Duration:
- Severity:
- Status:
- Primary Service:
- Database:
- Incident Owner:

## Summary
[ONE-PARAGRAPH SUMMARY]

## Impact
- Affected users:
- Affected requests:
- Affected features:
- Error rate:
- Duration:
- Data impact:
- Other impact:

## Detection
- Detected by:
- Detection time:
- Detection gap:

## Timeline
| Time | Event | Evidence |
|---|---|---|
| | | |

## Technical Cause
### Immediate Trigger
[DETAILS]

### Contributing Factors
-
-

### System State
[DETAILS]

## Response
### Initial Actions
-
-

### Investigation Findings
-
-

### Decisions
-
-

### Rejected Options
-
-

## Recovery
- Strategy:
- Start:
- Complete:
- Actions:
- Validation:
- Side Effects:

## Data Integrity
- Data loss:
- Data corruption:
- Duplicate data:
- Partial writes:
- Missing records:
- Validation:
- Outstanding investigation:

## What Went Well
-
-

## What Went Poorly
-
-

## Corrective Actions
| Action | Owner | Priority | Due | Verification | Status |
|---|---|---|---|---|---|
| | | | | | |

## Lessons Learned
### Technical
-

### Process
-

### Observability
-

### Recovery
-

## Open Questions
-

## Final Verification
- Service Healthy:
- Database Healthy:
- Monitoring Stable:
- Data Integrity Verified:
- Follow-Up Actions Tracked:
- Reviewed By:
- Review Date:
```

## Common Mistakes

### Writing the Report as a Novel

The report should contain enough detail to understand the incident and improve the system.

It does not need every message ever sent during the outage.

### Hiding Uncertainty

If the evidence does not establish something, mark it unknown.

### Listing Actions Without Owners

Unowned work tends to become historical fiction.

### Treating the Template as a Checklist Ceremony

The template exists to improve understanding.

Do not fill every box with meaningless text just because the box is there.

### Forgetting Data Integrity

A service can recover while a data investigation remains open.

State that explicitly.

### Closing the Report Before Follow-Up Work Exists

The report should connect the incident to actual system improvements.

## Emergency Procedure

If you need to produce an incident report immediately after a major database outage:

1. Record the incident ID and times.
2. Write the user impact.
3. Preserve the evidence.
4. Build the timeline.
5. Record the immediate technical cause.
6. Document response and recovery.
7. State the data integrity status.
8. Record what worked and what did not.
9. Create corrective actions with owners.
10. List unresolved questions.
11. Verify service and database health.
12. Schedule the full review if the initial report was intentionally brief.

If information is still changing, mark the report as preliminary rather than pretending the investigation is complete.

## Congratulations!

You now have a database incident report template that future engineers can actually use.

The outage has been documented.
The evidence has been preserved.
The impact has numbers.
The timeline has timestamps.
The recovery has been recorded.
The unknowns have been labeled.
The corrective actions have owners.

Most importantly, the final report does not contain:

```text
Everything broke at some point.
John fixed it.
Seems fine now.
```

EstroBunny has reviewed the template.

She has requested one additional field:

> **How many times did someone say "it's probably the database" before checking the database?**

Field type: Integer.

Default value: Unfortunately unknown.

**still here 🏳️‍⚧️**