# How to Debug a JavaScript Bug Without Making Five New Ones

*A serious guide for developers who have discovered that the code worked yesterday and have absolutely no explanation for this development.*

## Things You'll Need
- A computer
- A browser
- Developer Tools
- A JavaScript project
- A terminal
- A functioning brain
- Patience
- The ability to read an error message before ignoring it
- One suspicious `console.log()`
- A backup or recent commit
- One pink bunny girl who has already said “it should work”

> **Warning:** JavaScript bugs may cause unexpected behavior, console errors, disappearing buttons, incorrect values, mysterious network requests, and sudden philosophical questions about your career.
>
> If the bug disappears when you add `console.log()`, remain calm.
>
> You have encountered a **Heisenbug**.

## Step 1: Confirm That There Is Actually a Bug
Before debugging, reproduce the problem.
Do not begin by changing random code.
Determine:
1. What should happen?
2. What actually happens?
3. What action causes the problem?
4. Does it happen every time?
5. Does it happen only under specific conditions?
6. Can another person reproduce it?
Write down the expected behavior.
For example:
> Clicking the Play button should open the game.
Then document the actual behavior:
> Clicking the Play button does nothing.
This is useful information.
“This stupid thing is broken” is emotionally accurate but technically less useful.

## Step 2: Reproduce the Bug Consistently
Perform the same sequence of actions that causes the problem.
If the bug happens every time, excellent.
You have a reproducible problem.
If it happens only occasionally, document the conditions.
For example:
- Only after refreshing.
- Only after opening the menu twice.
- Only when the user has no saved data.
- Only when the moon is in retrograde.
- Only after EstroBunny has edited the CSS.
The first four are debugging conditions.
The fifth is an established risk factor.

## Step 3: Check the Console
Open Developer Tools and select the **Console**.
Look for errors such as:
```text
Uncaught TypeError: Cannot read properties of undefined
```
Do not immediately close the console because the error looks scary.
Read it.
JavaScript is trying to tell you something.
The message may identify:
- the type of error
- the file
- the line
- the function
- sometimes the exact operation that failed
This is valuable evidence.

## Step 4: Go to the Exact Line
If the error points to:
```text
app.js:142
```
open that file and inspect line 142.
Do not start rewriting lines 1–141.
The bug may involve earlier code, but begin at the evidence.
For example:
```javascript
const user = getUser();
console.log(user.name);
```
If `user` is `undefined`, the problem may not be `user.name`.
The problem may be whatever caused `getUser()` to return `undefined`.
Follow the value backward.

## Step 5: Read the Error Literally
Consider:
```text
Cannot read properties of undefined (reading 'name')
```
This does not mean:
> “JavaScript has decided to ruin your evening.”
It means something attempted to access `.name` on an undefined value.
For example:
```javascript
user.name
```
If `user` is undefined, the operation fails.
Do not fight the error message.
Translate it.
JavaScript has provided a clue.
Use the clue.

## Step 6: Inspect the Suspicious Value
Use Developer Tools or a temporary log:
```javascript
console.log("user:", user);
```
Then reproduce the bug.
Inspect the result.
You may discover:
```text
user: undefined
```
Excellent.
You have moved from:
> “Something is broken.”
to:
> “This value is undefined when I expected an object.”
That is progress.

## Step 7: Follow the Value Backward
Ask:
**Where did this value come from?**
For example:
```javascript
const user = getUser();
```
Now inspect `getUser()`.
Maybe it does:
```javascript
return users.find(u => u.id === id);
```
Now inspect `id`.
Maybe `id` is undefined.
Follow the chain.
**input → function → value → operation → failure**
This is debugging.
Randomly adding code until the error disappears is not.

## Step 8: Check for Asynchronous Problems
JavaScript frequently deals with asynchronous operations.
For example:
```javascript
const data = fetchData();
console.log(data.name);
```
If `fetchData()` returns a Promise, the code may be attempting to access `name` before the data has arrived.
You may need:
```javascript
const data = await fetchData();
console.log(data.name);
```
or an appropriate Promise chain.
Do not assume asynchronous code has finished simply because you asked it to start.
JavaScript does not care about your schedule.

## Step 9: Check Network Requests
If your bug involves data from a server, open the **Network** panel.
Look for:
- failed requests
- unexpected status codes
- incorrect URLs
- missing request parameters
- malformed responses
- authentication failures
- responses that do not contain the fields your code expects
A JavaScript error may actually be a data problem.
If the server returns:
```json
{
  "error": "Not found"
}
```
and your code expects:
```json
{
  "user": {
    "name": "EstroBunny"
  }
}
```
the frontend is not hallucinating.
It received different information.

## Step 10: Check the Event Handler
If clicking a button does nothing, inspect the event handler.
For example:
```javascript
button.addEventListener("click", handleClick);
```
Confirm that:
- `button` exists
- `handleClick` exists
- the listener is actually attached
- the code reaches the handler
- the handler does not immediately throw an error
Add a temporary log:
```javascript
console.log("handleClick fired");
```
Click the button.
If the message appears, the event fired.
If it does not, investigate the event wiring.
Do not rewrite the entire application.
The button may simply be having a quiet day.

## Step 11: Use Breakpoints
When logging becomes excessive, use a breakpoint.
Pause execution at the suspicious line.
Inspect:
- local variables
- function arguments
- object properties
- call stack
- current scope
Step through the code carefully.
Observe what changes.
This is often more useful than adding:
```javascript
console.log("AAAA");
console.log("BBBB");
console.log("WHY");
console.log("HELP");
```
If your console contains:
```text
AAAA
BBBB
WHY
HELP
AAAAAAAAAAAAAAAA
```
you have entered the **Console Log Spiral™**.
Stop.
Use a debugger.

## Step 12: Check the Call Stack
If a function fails, inspect what called it.
For example:
```text
handleClick
  → openGame
    → loadGame
      → parseGame
        → ????
```
The function that throws the error is not necessarily where the bug began.
Trace the call stack backward.
Find the first incorrect assumption.
That is often where the real problem lives.

## Step 13: Make One Small Change
You have identified the likely cause.
Now change one thing.
Not five.
Not twelve.
One.
Then reproduce the bug again.
If it is fixed, verify that you did not create another problem.
If it is not fixed, undo the experiment if appropriate and continue investigating.
Do not build a second system around the first broken system.
That is how temporary debugging code becomes permanent architecture.

## Step 14: Remove the Evidence
Once the bug is fixed, inspect your debugging code.
Remove unnecessary:
```javascript
console.log()
```
Remove temporary breakpoints.
Remove experimental branches.
Remove comments such as:
```javascript
// WHAT THE FUCK
```
You may keep useful explanatory comments.
You do not need to leave a historical transcript of your emotional journey.

## Step 15: Test the Original Bug Again
Perform the exact sequence that originally caused the problem.
Then test nearby cases.
If the original bug was:
> Clicking Play while the game list is loading causes an error.
Test:
- clicking Play normally
- clicking Play while loading
- clicking Play after loading
- opening another game
- refreshing the page
- returning to the game
Fixing one path should not silently break another.

## Step 16: Check the Diff Before You Commit
Run:
```bash
git diff
```
Review what changed.
Ask:
**Did I fix the bug, or did I accidentally redesign the application?**
If your five-line JavaScript fix somehow modified 38 files, stop.
Something has gone terribly wrong.
This is now a Git article.
Return to the appropriate documentation.

## Common Mistakes
### Changing code before reproducing the bug
You may accidentally fix something that was not broken.
Then the original problem remains.

### Ignoring the first error
The first console error may be the root cause.
Do not skip directly to the 19th warning.

### Adding infinite console.log statements
Logs are useful.
A console containing 4,000 identical messages is a cry for help.

### Assuming undefined means “empty”
`undefined` is a specific JavaScript value.
It is not interchangeable with every other form of “nothing.”

### Fixing symptoms instead of causes
If a value is missing, find out why.
Do not simply invent a fallback and move on without understanding the failure.

### Rewriting working code
You found one bug.
You do not need a new framework.

### Saying “JavaScript is weird”
Sometimes JavaScript is weird.
That does not mean it is exempt from investigation.

## Emergency Procedure
If the bug has reached the point where:
- the console is full of errors,
- the UI is behaving differently every refresh,
- changing one line creates three new problems,
- nobody remembers what the original code did,
- and someone has suggested “just rewrite it,”
stop.
Save your current state.
Create a backup or commit the current work.
Then reduce the problem.
Find the smallest reproducible case.
Work from there.
Do not continue adding patches to a system you no longer understand.

## Advanced EstroBunny Emergency Protocol
If the bug disappears when you open Developer Tools:
Do not celebrate.
Close Developer Tools.
Reproduce it again.
If the bug returns, you have likely encountered a timing-sensitive issue or another environment-dependent behavior.
If the bug disappears every time Developer Tools are open, EstroBunny has officially declared war on observability.
Document the behavior.
Investigate timing, asynchronous operations, event ordering, and environment differences.
Do not accuse the browser of witchcraft.
Yet.

## Congratulations!
You have successfully debugged a JavaScript bug without making five new ones.
You reproduced the problem.
You read the error.
You inspected the values.
You traced the call stack.
You investigated asynchronous behavior.
You checked the network.
You made one small change.
You tested the result.
You removed your debugging debris.
Your application works again.
You close Developer Tools.
Silence.
Peace.
Victory.
Then the console displays:
```text
Warning: deprecated API
```
You stare at it.
It stares back.
You slowly close the browser.
You whisper:
**“Not today.”**
The pink bunny has survived another debugging session.

**still here 🏳️‍⚧️**

Do not reopen the project until tomorrow.