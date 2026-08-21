# Advanced stock design-system gate review

- recommendation: APPROVE
- blockers: []
- originalIntent: Preserve the collapsed advanced-stock summary and make the expanded state match Figma node `16254:196208` in file `HDCHTF7DCaSZwknQoLHVPQ`.
- desiredOutcome: A real, responsive React implementation using project primitives, with the existing summary shown while collapsed and the Figma-aligned editable controls shown while expanded, including accessible disclosure and switch interactions.

## User outcome review

The current source satisfies the requested functional and design-system outcome. `NewProductFlow.tsx:1219-1280` renders live DOM controls rather than an image. The disclosure button toggles `isAdvancedStockOpen`, reports its state through `aria-expanded`, points to the conditionally rendered panel through `aria-controls`, and swaps HugeIcons chevrons. The expanded branch uses the existing `Field`, `inputClass`, and imported project `Switch`; each stock switch has an `aria-label`. The collapsed branch remains present and is rendered only when the expanded branch is absent.

The supplied desktop-open capture is 724x368 against the 724x369 reference. Direct visual inspection shows the requested 40px disclosure row, up chevron, divider, padded two-column inputs, four unchecked toggle rows, required Portuguese copy, and separators. The supplied mobile capture demonstrates one-column responsive behavior. The supplied closed capture preserves the summary badges.

## Criterion review

1. Real DOM/component implementation: PASS (`src/modules/produtos/NewProductFlow.tsx:1219-1280`). No raster image, CSS background image, or screenshot substitute is used.
2. Project primitive reuse: PASS (`src/modules/produtos/NewProductFlow.tsx:1-49`, `346-369`, `622-635`, `1228-1246`). Uses HugeIcons, the existing `Switch`, `Field`, and `inputClass`; no package-manifest change or new icon package is present in the worktree status.
3. Closed summary preserved and conditionally replaced: PASS (`src/modules/produtos/NewProductFlow.tsx:1235-1280`). The ternary renders expanded controls or the existing `ScheduleBadge` summary.
4. Accessible interaction: PASS (`src/modules/produtos/NewProductFlow.tsx:1220-1234`, `622-635`). Native button, state toggle, `aria-expanded`, `aria-controls`, matching panel id, decorative icon hidden, and switch labels are present.
5. Reference content/anatomy: PASS (`src/modules/produtos/NewProductFlow.tsx:1236-1269`; `figma-open-reference.png`; `actual-open-desktop.png`; `actual-open-mobile.png`). Required copy and component ordering match.

## Direct slop/overfit and programming pass

- No test was added solely to assert requested removal, text deletion, or implementation details; no advanced-stock-specific test exists in the inspected test files.
- No screenshot-pasting, parsing, normalization, speculative wrapper, new dependency, debug output, defensive branch, or duplicated state machinery was introduced for this feature.
- `AdvancedStockToggleRow` is used four times and is a proportionate local extraction, not single-use indirection.
- React state mutation is framework-managed and type-safe. No `any`, assertion escape hatch, ignore directive, non-null assertion, or new package appears in the reviewed implementation.
- NOTE: `NewProductFlow.tsx` is already a very large module (1,541 nonblank/non-comment lines). This is maintenance burden under the programming/slop criteria, but it is not a blocker because the stated success criteria do not require modularization and this review is read-only.
- NOTE: There is no targeted interaction regression test for the disclosure. This does not block the requested criteria because the supplied browser metadata records both `ariaExpanded: false` and `ariaExpanded: true`, and the source directly traces the state transition.

## Checked artifact paths

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/figma-open-reference.png`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-closed-desktop.png`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-closed-desktop.json`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.png`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.json`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-mobile.png`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-mobile.json`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/open-desktop-diff.json`

## Exact evidence gaps and notes

- NOTE: The source mtime (`1787105621`) is 75 seconds newer than the three actual captures (`1787105545`/`1787105546`). Strict fresh-capture provenance is therefore not established. This is not a criterion-linked blocker here because the current source content, capture text metadata, dimensions, disclosure states, and direct image inspection agree on every requested behavior and element.
- NOTE: The diff reports `dimensionsMatch: false` only for the one-pixel height delta (368 actual versus 369 reference), `diffRatio: 0.1065`, `similarityScore: 89`, and `alphaChannelIntact: true`. Direct inspection does not reveal a user-visible missing or incorrect required element.
- No separate executor report, code-review report, manual-QA matrix, or notepad path was supplied. Their absence does not block because the requested checks were reproduced directly from the source and supplied evidence artifacts.
