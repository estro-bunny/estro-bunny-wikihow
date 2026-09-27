# EstroBunny WikiHow Templates

Templates are reusable starting points for new documentation. They are organized by **document function**, while article subject matter is controlled by the content taxonomy in `docs/content-taxonomy.md`.

## Template Families

### `articles/`

Normal article forms:

- `guide.md` — standard WikiHow article
- `procedure.md` — formal task procedure
- `runbook.md` — operational response guide
- `field-manual.md` — broad scenario manual
- `case-file.md` — documented event or investigation

### `incidents/`

Operational and anomaly documentation:

- `incident-report.md`
- `incident-checklist.md`
- `containment-memo.md`
- `emergency-procedure.md`
- `post-incident-review.md`

### `documentation/`

Reusable administrative/documentation forms:

- `reference.md`
- `memo.md`
- `announcement.md`
- `redacted-document.md`

## Classification

New documents should use the metadata schema from `docs/content-taxonomy.md`.

At minimum:

```yaml
title: "Document title"
category: coding
type: guide
chaos: 1
status: draft
featured: false
```

Add `tags`, `characters`, `number`, and `next` when they are useful.

## Do Not Do This Yet

Do not reorganize the existing `articles/` directory solely to make it match the taxonomy. The current paths are stable content locations. The web app should classify them through metadata first.

**Documentation is allowed to be boring. EstroBunny is not.**