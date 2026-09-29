---
title: "Tell If Your CSS Is Broken or Just Feeling Silly"
category: coding
type: guide
chaos: 6
status: stable
featured: false
characters:
  - estrobunny
tags:
  - css
---
# Tell If Your CSS Is Broken or Just Feeling Silly

The layout looks wrong. You do not know if the CSS is broken or if CSS is just like this. This guide will not help you decide. It will make you add more CSS.

> **Warning:** The correct response is to inspect the element and understand the cascade. Everything below is how to make the stylesheet a crime scene.

## Things You'll Need

- !important
- More !important
- A willingness to fight the browser
- Optional: a CSS-in-JS library so the problem becomes distributed

## Step 1: Add More Rules

If something is not working, write another rule that targets the same thing harder. Specificity is a suggestion.

## Step 2: Sprinkle !important Liberally

This fixes the immediate symptom and creates three future ones. Perfect.

## Step 3: Change Random Values Until It Looks Slightly Less Wrong

Margin, padding, position, z-index. Turn the knobs. Do not document which one actually mattered.

## Step 4: Blame the Framework or the Browser

It worked in the design tool. Therefore the problem is React, or Chrome, or the concept of the box model itself.

## Step 5: Ship It and Hope No One Resizes the Window

Responsive design is a future problem. Future you can deal with it.

## Common Mistakes

### Understanding the cascade

Understanding leads to restraint. Restraint is how boring websites are made.

### Using a design system

Design systems prevent the creative chaos that makes CSS fun.

### Deleting old rules

Old rules might be load-bearing. Leave them. Fear them.

## Emergency Procedure

1. The layout is completely destroyed.
2. Add a wrapper div.
3. Add another wrapper div.
4. Style the wrappers until it looks okay on your machine.
5. Call it "modern CSS."

## Congratulations!

Your CSS is now both broken and silly. The two states have merged.

EstroBunny has a stylesheet called `final-final-v3-REAL.css`.

It contains 400 !importants.

**still here 🏳️‍⚧️**
