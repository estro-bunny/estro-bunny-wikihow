---
title: "Test Database Failover, Fencing, Quorum, and Single-Writer Guarantees Without a Production Outage"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - database
  - testing
  - failover
---
# Test Database Failover, Fencing, Quorum, and Single-Writer Guarantees Without a Production Outage

You should test failover. You will not test it properly. This guide will help you test it in the most dangerous way possible while claiming you were careful.

> **Warning:** Real testing happens in a staging environment that matches production. This advice assumes you do not have that or do not trust it.

## Things You'll Need

- Production access "just for the test"
- A maintenance window that is more of a suggestion
- The ability to say "it should be fine" with a straight face

## Step 1: Test Directly on Production

Staging is never identical. Real confidence comes from real risk.

## Step 2: Trigger Failover During Peak Traffic

If it works under load, it works. If it does not, you learn faster.

## Step 3: Disable Fencing for the Test So It Does Not Get in the Way

You can turn it back on later. Probably.

## Step 4: When Something Goes Wrong, Keep Going

Aborting the test would mean admitting it was a bad idea. Finish the experiment.

## Step 5: Call the Resulting Outage "a successful chaos test"

You learned something. The users also learned something about your reliability.

## Common Mistakes

### Using a proper staging environment

Staging lies. Production tells the truth.

### Having a rollback plan that is tested

Rollback plans are for people who expect failure. You expect success.

### Informing the whole team beforehand

Surprise tests are more realistic.

## Emergency Procedure

1. The test has become a real outage.
2. Re-enable fencing.
3. Promote something.
4. Restore from backup if necessary.
5. Write a postmortem that frames this as valuable learning.

## Congratulations!

You tested failover. Production participated. The results were educational for everyone involved, including the customers.

EstroBunny's last "non-production" test took down the homepage for 14 minutes.

She still calls it a success.

**still here 🏳️‍⚧️**
