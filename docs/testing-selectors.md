# Playwright selector contract

The smoke suite uses explicit `data-testid` hooks for stable application contracts. Playwright supports `page.getByTestId()` for these hooks; user-facing role/text locators remain appropriate for assertions where the user-facing contract itself matters.

## Library

| Test ID | Contract |
| --- | --- |
| `library-view` | Root element for the article library view. |
| `library-hero` | Primary library hero/intro section. |
| `library-article-card` | Each article card that can open an article. |

## Article

| Test ID | Contract |
| --- | --- |
| `article-page` | Root element for an article route. |

Existing semantic classes such as `.article-sidebar` and `.reading-progress` remain secondary selectors until we decide they deserve dedicated test contracts.

## 404

| Test ID | Contract |
| --- | --- |
| `not-found-view` | Root element for the not-found route. |
| `not-found-message` | Stable 404/document-not-found message. |

## Chaos Mode

| Test ID | Contract |
| --- | --- |
| `chaos-mode-control` | The interactive global Chaos Mode control. |
| `chaos-mode-label` | Current human-readable mode label inside the control. |

The control also exposes its machine-readable current mode through `data-mode`, while page roots expose `data-chaos-mode`.

## Rules

1. Test IDs are contracts, not styling hooks.
2. Do not rename or remove an ID without updating the smoke suite.
3. Prefer one ID for one stable semantic target.
4. Do not add IDs to every DOM node.
5. Prefer role/label/text locators when the user-facing semantics are the behavior under test.
6. Keep machine state assertions on `data-mode` / `data-chaos-mode`.

