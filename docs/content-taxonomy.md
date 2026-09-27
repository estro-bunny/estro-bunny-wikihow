# EstroBunny WikiHow Content Taxonomy 🐰

> **The classification system for practical guides, impractical situations, and paperwork that has become self-aware.**

## Purpose

This taxonomy gives every article and reusable document a stable way to describe what it is, what it is about, and how badly the documentation has escalated.

The taxonomy is designed for the Vite + React web app as well as the Markdown repository. Existing article paths remain unchanged; classification is metadata-driven rather than dependent on directory names.

## Subject Categories

| ID | Label | Scope |
| --- | --- | --- |
| `coding` | 💻 Coding | Programming, debugging, databases, APIs, Git, infrastructure, and software development. |
| `internet-chaos` | 🌐 Internet Chaos | Social media, websites, online culture, digital nonsense, and internet problems. |
| `life` | 🧠 Life | Relationships, friendship, happiness, communication, and everyday human survival. |
| `bureaucracy` | ⚖️ Bureaucracy | Forms, courts, government offices, administrative processes, appeals, and paperwork disasters. |
| `adventure` | 🏴‍☠️ Adventure | Pirates, zombies, survival scenarios, expeditions, bunkers, and fictional adventures. |
| `villainy` | 🦹 Villainy | Supervillains, evil lairs, henchmen, world domination, and theatrical nonsense. |
| `fictional-crime` | 🕵️ Fictional Crime | Crime-themed parody that is explicitly fictional or otherwise non-actionable. |
| `emergency` | 🚨 Emergency | Incidents, failures, containment, recovery, escalation, and emergency procedures. |
| `technical-operations` | 🔧 Technical Operations | Runbooks, operational procedures, postmortems, recovery workflows, and production discipline. |
| `estro-bunny` | 🐰 EstroBunny | EstroBunny-specific lore, systems, anomalies, procedures, and universe documentation. |
| `questionable-decisions` | ❓ Questionable Decisions | Situations that absolutely should not require documentation but somehow do. |

### Category Rules

- Use **one primary category** for navigation.
- Use tags for secondary subjects instead of creating increasingly specific categories.
- Categories are stable IDs; labels and emoji may change without changing the ID.
- A technical article may use `coding` even when its directory historically uses `git`.
- Crime parody belongs under `fictional-crime` when its framing is explicitly fictional and non-actionable.
- Incident and containment documents may use `emergency` or `estro-bunny` as their primary category depending on what the document is primarily about.

## Document Types

| ID | Label | Intended Use |
| --- | --- | --- |
| `guide` | GUIDE | Standard WikiHow-style instructional article. |
| `procedure` | PROCEDURE | Formal sequence of actions for a defined task. |
| `runbook` | RUNBOOK | Operational response instructions used during a live or recurring situation. |
| `incident` | INCIDENT | Documentation of a failure, anomaly, or fictional disaster. |
| `containment` | CONTAINMENT | Instructions for isolating or controlling an EstroBunny anomaly or bureaucratic threat. |
| `checklist` | CHECKLIST | Checkbox-oriented operational or printable procedure. |
| `template` | TEMPLATE | Reusable document structure intended to be copied and completed. |
| `reference` | REFERENCE | Definitions, classifications, rules, terminology, or stable reference information. |
| `memo` | MEMO | In-universe official communication, directive, warning, or notice. |
| `field-manual` | FIELD MANUAL | Larger practical manual covering a broader scenario or operating environment. |
| `case-file` | CASE FILE | A documented incident, investigation, or EstroBunny event record. |
| `redacted` | REDACTED | Deliberately incomplete, classified, or partially withheld documentation. |

### Type Rules

- `guide` is the default for ordinary WikiHow articles.
- `procedure` is preferred when the sequence itself is the main artifact.
- `runbook` is reserved for operational response and recurring incident handling.
- `incident` describes what happened; `runbook` describes what to do.
- `containment` is specifically for controlling an identified anomaly or escalation.
- `checklist` is appropriate when completion state matters.
- `template` is reusable structure rather than a completed article.
- `memo`, `reference`, `case-file`, and `redacted` are documentation forms rather than ordinary how-to guides.
- A future schema may allow a `type` plus `formats` array when one document intentionally serves multiple roles.

## Chaos Levels

| Level | ID | Label | Meaning |
| ---: | --- | --- | --- |
| 1 | `reasonable` | 🟢 REASONABLE | The situation is normal and the instructions are behaving. |
| 2 | `suspicious` | 🟡 SUSPICIOUS | Something is slightly wrong, but nobody has opened a second terminal yet. |
| 3 | `concerning` | 🟠 CONCERNING | The problem is real and documentation is becoming necessary. |
| 4 | `chaotic` | 🔴 CHAOTIC | EstroBunny has become operationally relevant. |
| 5 | `estro-bunny` | 🟣 ESTROBUNNY | Normal procedures have encountered EstroBunny. |
| 6 | `absolutely-not` | ⚫ ABSOLUTELY NOT | The documentation team has intervened. |
| 7 | `documentation-failed` | ☢️ DOCUMENTATION HAS FAILED | The documentation is now part of the incident. |

### Chaos Rules

- Chaos is a narrative classification, not a severity or safety rating.
- Use the lowest level that accurately represents the article's tone.
- Do not artificially inflate chaos just to reach Level 7.
- Level 7 means the documentation itself has become an active problem.

## Recommended Metadata

Every classified article or document should eventually expose:

```yaml
title: "How to Survive a Git Commit You Definitely Regret"
category: coding
type: guide
chaos: 3
status: stable
featured: false
characters:
  - estrobunny
  - greg
tags:
  - git
  - debugging
  - version-control
```

### Metadata Fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Human-readable document title. |
| `category` | Yes | One primary subject category ID. |
| `type` | Yes | One primary document type ID. |
| `chaos` | Yes | Integer from 1–7. |
| `status` | Yes | Recommended values: `draft`, `stable`, `archived`, `redacted`. |
| `featured` | Yes | Boolean used by the web app. |
| `characters` | No | Recurring in-universe characters or entities. |
| `tags` | No | Searchable secondary subjects. |
| `number` | No | WikiHow sequence number when applicable. |
| `next` | No | Slug/path for an intentional article handoff. |

## Web App Navigation

The React app should treat the taxonomy as structured content rather than hard-coded page groups.

Recommended browsing hierarchy:

**Articles → Category → Type → Chaos Level → Tags**

Recommended filters:

- All
- Category
- Type
- Chaos Level
- Featured
- Tags

Example searches:

- `coding`
- `runbook`
- `bureaucracy + checklist`
- `☢️ documentation has failed`
- `greg`
- `form-19-c`

## Template Organization

Templates should be grouped by document function:

```text
templates/
├── articles/
│   ├── guide.md
│   ├── procedure.md
│   ├── runbook.md
│   ├── field-manual.md
│   └── case-file.md
│
├── incidents/
│   ├── incident-report.md
│   ├── incident-checklist.md
│   ├── containment-memo.md
│   ├── emergency-procedure.md
│   └── post-incident-review.md
│
└── documentation/
    ├── reference.md
    ├── memo.md
    ├── announcement.md
    └── redacted-document.md
```

Existing templates do not need to be moved immediately. Migration can happen separately after the web app has a content index.

## Migration Principle

**Metadata first. Directory moves later.**

Existing article URLs and repository paths should remain stable while the web app learns the new taxonomy. Once the content index is proven, physical directory cleanup can be considered as a separate change.

## Core Principle

> **If the article can be classified calmly, classify it calmly.**
>
> **If the classification system starts generating Form 19-C, stop.**

**still here 🏳️‍⚧️**