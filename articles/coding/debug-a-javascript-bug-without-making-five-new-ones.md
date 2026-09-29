---
title: "Debug a JavaScript Bug Without Making Five New Ones"
category: coding
type: guide
chaos: 7
status: stable
featured: false
characters:
  - estrobunny
tags:
  - javascript
  - debugging
---
# Debug a JavaScript Bug Without Making Five New Ones

Your code is broken. You are going to "just quickly fix it." This guide ensures you create five new bugs while feeling productive.

> **Warning:** The correct approach is to reproduce, isolate, and fix carefully. Everything below is how to turn one bug into a legend.

## Things You'll Need

- Console.log addiction
- The belief that "it works on my machine" is a valid strategy
- Zero tests
- Optional: a second tab where you rewrite the entire function from scratch

## Step 1: Add console.log Everywhere

Spray logs like a cat marking territory. Do not remove the old ones. Ever.

## Step 2: Change Random Things Until the Error Message Changes

The new error is progress. You are getting closer. (You are not.)

## Step 3: Copy a Stack Overflow Answer Without Reading It

Paste it in. It almost works. The new breakage is someone else's fault.

## Step 4: Refactor While Debugging

While you are in there, clean up the surrounding code. Introduce three subtle bugs and one race condition.

## Step 5: Declare It Fixed and Push

The original bug is gone (or hidden). The five new ones will be discovered by someone else later. This is teamwork.

## Common Mistakes

### Writing a failing test first

Tests slow you down and make you honest. Avoid both.

### Using the debugger

The debugger is for people who have time. You have momentum.

### Leaving the code in a clean state

Clean state is how the next person avoids suffering. Suffering builds character.

## Emergency Procedure

1. The five new bugs are in production.
2. Blame the framework.
3. Hotfix a sixth change that makes it worse.
4. Go home.
5. Tomorrow is a new day.

## Congratulations!

You have turned a simple bug into a multi-day incident. Your commit history will be studied by future archaeologists.

EstroBunny has added `// TODO: fix this properly` above the worst line.

It has been there for eight months.

**still here 🏳️‍⚧️**
