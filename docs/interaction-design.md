# Interaction Design: One-Mechanic Chaos

## Core rule

**Chaos is not complexity.**

Take one ordinary interaction. Give it consequences. Escalate those consequences. Do not add another mechanic until the first one has exhausted its potential.

The goal is not to make an article contain many interactive systems. The goal is to make one interaction memorable enough that it becomes part of the documentation.

## Escalation pattern

Use this sequence as a design tool, not a mandatory script:

1. **Predictable** — the interaction behaves normally.
2. **Slight deviation** — something is unexpectedly different.
3. **Escalation** — repeating or continuing the interaction makes the situation stranger.
4. **Consequences** — the interface visibly records or responds to what happened.
5. **Documentation** — the system explains, labels, or preserves the incident.
6. **Failure** — only when appropriate, the interaction can reach a deliberately chaotic state.

A good interaction can stop at any stage. Chaos should never be added merely to reach a higher visual intensity.

## Design constraints

- Prefer one primary interaction over a collection of unrelated gimmicks.
- Every escalation should be caused by the user's interaction or by a clearly established system rule.
- Keep the underlying task understandable even when the presentation becomes absurd.
- Do not add animation, audio, canvas, physics, or other technical machinery unless the chosen interaction actually benefits from it.
- Preserve keyboard access, focus states, reduced-motion behavior, and mobile usability.
- Prefer deterministic behavior for tests and reproducible incidents.
- Keep article instructions useful even if the interactive layer is unavailable.
- Reusable components should emerge from real articles rather than being designed as a speculative framework.

## Chaos levels as interaction states

The existing content taxonomy can describe the *state* of an interaction:

- **REASONABLE** — read the instructions.
- **SUSPICIOUS** — try the interaction.
- **CONCERNING** — the result is no longer quite what was expected.
- **CHAOTIC** — the interaction is now part of the problem.
- **ESTROBUNNY** — the interface knowingly gives the user more control than is sensible.
- **ABSOLUTELY NOT** — the system explicitly warns against continuing.
- **DOCUMENTATION HAS FAILED** — the interface records the aftermath rather than pretending the situation is still under control.

These labels describe experience and state. They are not a requirement that every article progress through all seven levels.

## Article pattern

When an article gets an interactive treatment, prefer:

`article → one mechanic → consequence → documentation`

Examples:

- Git guide → one commit/recovery interaction → the mistake changes the displayed state → the interface records what happened.
- CSS guide → one diagnostic control → the diagnosis changes as the control is manipulated → the result is documented.
- Database runbook → one operational control → state transitions become visible → the incident timeline records them.

These are examples of patterns, not implementation requirements.

## Source of inspiration

The project's interaction direction is informed by the referenced collection **Claude Opus 5.5 100 HTML Files**, whose examples demonstrate that a page can make interaction itself part of the experience. The project deliberately takes the smaller principle rather than reproducing the collection's breadth: one well-chosen mechanic can carry an entire article experience.

## Definition of done

Before adding a second interactive mechanic, ask:

1. Does the existing mechanic have a meaningful consequence?
2. Can that consequence escalate?
3. Can the user understand what caused it?
4. Can the article document the resulting state?
5. Would another mechanic genuinely improve the explanation?

If the answer to #5 is no, stop. The chaos is already doing its job.

still here 🏳️‍⚧️
