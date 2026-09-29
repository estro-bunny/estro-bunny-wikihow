---
title: "Debug a Broken API Request Without Blaming the Server"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - api
  - debugging
---
# Debug a Broken API Request Without Blaming the Server

The API is returning something wrong. You have already decided it is not your fault. This guide will help you prove the server is the problem while making your client worse.

> **Warning:** The request is probably wrong. Everything below assumes the server is gaslighting you.

## Things You'll Need

- Network tab open permanently
- A conspiracy theory about the backend team
- console.log on every line of the fetch
- Optional: a second implementation "just to compare"

## Step 1: Assume the Server Is Lying

The response does not match your expectations. Therefore the server is broken. Document this belief in the ticket.

## Step 2: Add More Logging Than Data

Log the request, the headers, the body, the response, the status, the timing, and your feelings about the status.

## Step 3: Retry Aggressively

If it fails, retry immediately. Then again. Then in a loop. Rate limits are a backend problem.

## Step 4: Change the Client Until the Error Message Is Different

Different error means progress. You are no longer looking at the original problem. Success.

## Step 5: Open a Ticket Blaming Infrastructure

Title it "API is broken." Body: "works on my machine when I mock it." Assign it to someone else.

## Common Mistakes

### Checking your own request payload carefully

That might reveal you forgot a required field. Avoid this.

### Reading the API documentation

Documentation is outdated by definition. Trust your intuition.

### Accepting that the client might be wrong

The client is never wrong. The universe is wrong.

## Emergency Procedure

1. The server team says the request is malformed.
2. Insist they are mistaken.
3. Paste a screenshot of the network tab with no context.
4. Mark the ticket as "waiting on backend."
5. Start rewriting the client in a different library.

## Congratulations!

You have successfully avoided learning anything about your own code. The bug remains, but it is now someone else's problem on paper.

EstroBunny has 47 tickets titled "API is gaslighting me."

None of them are resolved.

**still here 🏳️‍⚧️**
