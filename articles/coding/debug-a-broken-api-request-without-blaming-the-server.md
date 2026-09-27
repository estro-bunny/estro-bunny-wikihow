---
title: "Debug a Broken API Request Without Blaming the Server"
category: coding
type: guide
chaos: 3
status: stable
featured: false
characters:
  - estrobunny
tags:
  - api
  - debugging
  - http
  - networking
---
# How to Debug a Broken API Request Without Blaming the Server

APIs are usually not mysterious. A request is sent, the server receives it, something happens, and a response comes back. When that chain breaks, however, it is tempting to stare at the network tab and declare the entire internet personally responsible.

This guide provides a controlled procedure for finding the actual failure.

> **Warning:** Do not change the endpoint, authentication, payload, headers, client code, and server configuration at the same time. You will not know which change fixed the problem. You will only know that the problem is now different.

## Things You'll Need

- A reproducible failing API request
- Browser DevTools, `curl`, Postman, or another HTTP client
- The exact endpoint and HTTP method
- The response status and body
- Access to the API documentation
- Enough patience to read an error message before declaring war

## Step 1: Reproduce the Failure

Send the request again and confirm that it actually fails.

Record:

- HTTP method (`GET`, `POST`, `PUT`, `PATCH`, or `DELETE`)
- Full endpoint
- Query parameters
- Request headers
- Request body
- HTTP status code
- Response body
- Whether the failure is consistent

If the request succeeds once and fails once, stop making random changes. You may be dealing with timing, authentication expiry, rate limiting, server state, or another intermittent condition.

### The First EstroBunny Rule

> If you cannot reproduce the bug, you do not yet have a debugging problem. You have a suspicious story.

## Step 2: Identify Which Layer Is Actually Broken

An API request can fail before your application ever reaches the API.

Check the request path in order:

1. **Client:** Did your code construct the request correctly?
2. **Network:** Did the request leave the machine?
3. **Server:** Did the server receive and process it?
4. **Application:** Did the API logic reject or fail the request?
5. **Response handling:** Did your code correctly interpret the response?

A timeout, a DNS error, a `401`, a `404`, a `422`, and a `500` are not the same problem wearing different hats.

## Step 3: Read the Status Code Like It Owes You Money

Start with the HTTP status code.

- `2xx` — The server reports success. If your application says it failed, inspect your response handling.
- `400` — The request is malformed or otherwise invalid.
- `401` — Authentication credentials are missing, invalid, or unacceptable.
- `403` — The server understood the request but is refusing access.
- `404` — The requested resource or route was not found.
- `409` — The request conflicts with the current server state.
- `422` — The request is understood but contains validation errors; the exact semantics depend on the API.
- `429` — You have hit a rate limit or similar request quota.
- `5xx` — The server reports that it could not successfully handle the request.

Do not automatically conclude that every `5xx` is your fault, or that every `4xx` is the server's fault. Inspect the response and documentation.

## Step 4: Inspect the Response Body

Read the response body before changing code.

Many APIs return structured error information such as:

```json
{
  "error": "invalid_request",
  "message": "email is required"
}
```

The exact format varies. The important part is to determine whether the API is telling you what went wrong.

If the response says a field is missing, verify the field.
If it says a token is invalid, verify the token.
If it says a value failed validation, inspect the value.
If it says absolutely nothing useful, continue investigating without inventing an explanation.

### Common Mistake: Debugging the Error Message Instead of the Request

Changing the frontend because the backend returned `email is required` is generally not progress if the frontend still sends no `email` field.

Fix the request first.

## Step 5: Compare the Request With the Documentation

Open the API documentation and compare the failing request against the documented requirements.

Check:

- HTTP method
- URL path
- Required query parameters
- Required headers
- Authentication method
- Content type
- Required body fields
- Field names and capitalization
- Expected data types
- Allowed values

One missing header can produce an entirely different response from one malformed JSON field.

### The Copy-Paste Test

If the API documentation provides a working example, reproduce that example as closely as possible.

Then change **one thing at a time** until your version matches the example.

Do not improve the example.
Do not refactor the example.
Do not add seventeen headers because they look professional.

Make the smallest known-good request first.

## Step 6: Verify Authentication

Authentication failures deserve their own investigation.

Check:

- Is an authentication header present when required?
- Is the token current?
- Is the token being sent to the intended host?
- Is the authentication scheme correct?
- Are required scopes or permissions present?
- Is your application accidentally using a stale environment variable?

Never paste secrets into logs, screenshots, Git commits, or public issue reports.

If you suspect a credential was exposed, treat it as compromised and rotate it according to the service's documented procedure.

> **Security Warning:** A debugging session is not a valid reason to commit an API key.

## Step 7: Check the Request Body and Content Type

A body can be valid JSON and still be the wrong data.

For example:

```http
Content-Type: application/json
```

does not guarantee that the JSON contains the fields the API expects.

Inspect the actual payload sent over the network.

Check for:

- Missing fields
- Misspelled fields
- Incorrect nesting
- Strings where numbers are expected
- Numbers where strings are expected
- `null` where a value is required
- Empty strings
- Unexpected arrays or objects
- Incorrect date or timestamp formats

### The Payload Incident

At this point, EstroBunny has opened the request body, stared at it for thirty seconds, and discovered that `userId` has been spelled `userid` for the last two hours.

Do not celebrate yet.

Verify the rest of the payload.

## Step 8: Test the Request Outside Your Application

Use `curl`, Postman, or another independent HTTP client to send the same request.

This separates API behavior from application code.

If the independent request also fails, investigate the request, credentials, API, or server.

If the independent request succeeds, compare it carefully with the request generated by your application.

Useful differences include:

- URL
- Method
- Headers
- Authentication
- Body
- Encoding
- Redirect behavior

### The Minimal Request

A minimal request is easier to reason about than a request assembled by six helper functions, three middleware layers, and one utility named `finalFetchButActuallyThisTime`.

Start small.

## Step 9: Investigate CORS Only If the Browser Says It Is a CORS Problem

CORS errors are browser-enforced cross-origin restrictions. They are not a universal explanation for failed API requests.

If the browser reports a CORS-related failure, inspect:

- The requesting origin
- The API's CORS configuration
- Whether the request triggers a preflight
- The `OPTIONS` request
- `Access-Control-Allow-Origin`
- Allowed methods and headers

Do not add a random CORS extension to your browser and declare victory.

That only changes your browser.

## Step 10: Check Async and Response Handling

Sometimes the API request works perfectly and your code mishandles the result.

Verify that your code:

- Awaits the request when necessary
- Checks the actual response status
- Reads the response body correctly
- Handles rejected promises
- Does not parse an empty response as JSON
- Does not assume every successful response has the same shape

A `200 OK` followed by `response.json()` on an empty response can create a brand-new bug immediately after the original problem was fixed.

Congratulations. You have created a sequel.

## Step 11: Add One Controlled Debugging Change

Make exactly one useful change.

Examples:

- Correct one field name
- Add one required header
- Replace an expired token
- Fix one endpoint path
- Correct one data type
- Add proper response-status handling

Send the same request again.

If it works, identify the change that fixed it.
If it fails differently, record the new failure.

Do not immediately make five more changes.

That is how the **API Debugging Spiral™** begins:

```text
request fails
↓
change three things
↓
request changes
↓
nobody knows why
↓
change four more things
↓
request works
↓
delete everything
↓
request fails
```

EstroBunny has seen this happen.
EstroBunny has caused this to happen.
EstroBunny will not discuss the incident.

## Step 12: Capture the Working Request

Once the request succeeds, record what actually worked.

Document:

- Endpoint
- Method
- Required headers
- Authentication requirements
- Example payload
- Expected response
- Important error responses

This turns a one-time debugging victory into reusable documentation.

## Common Mistakes

### Changing Everything At Once

You fixed the request but cannot identify how. This makes future failures harder to diagnose.

### Blaming the API Immediately

The API may be wrong. Your request may also be wrong. The evidence comes first.

### Ignoring the Response Body

The response body often contains the most useful clue.

### Logging Secrets

Never expose API keys, access tokens, passwords, cookies, or other credentials just because debugging is inconvenient.

### Retrying Forever

A retry does not repair an invalid request. It only sends the invalid request again with greater confidence.

### Treating Every Failure as a Network Failure

An HTTP `400` means the server responded. Your network successfully delivered the request.

## Emergency Procedure

If the API request is still broken after following the normal procedure:

1. Save the exact failing request details without secrets.
2. Save the exact response status and body.
3. Compare the request against the official API documentation.
4. Reproduce it with an independent HTTP client.
5. Reduce it to the smallest possible request.
6. Check authentication and permissions.
7. Check service status or documented incidents if appropriate.
8. Review recent code and configuration changes.
9. Stop making unrelated changes.
10. Write down what you know before asking someone else for help.

If you need to report the issue, provide a minimal reproducible example and redact credentials and personal data.

## Congratulations!

You have successfully debugged an API request without blaming DNS, CORS, JavaScript, the backend team, Mercury retrograde, or the one developer who left six months ago.

The request works.
The cause is documented.
The credentials remain secret.
The diff is small.

EstroBunny is already opening another terminal.

Do not let her send a production request until tomorrow.

**still here 🏳️‍⚧️**