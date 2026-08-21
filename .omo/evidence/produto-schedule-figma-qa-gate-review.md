# Gate review — produto schedule Figma QA

## recommendation

REJECT (mapped visual verdict: REVISE)

## originalIntent

Refactor the schedule/time-slots block in `NewProductFlow` to match Figma node `16341:170423`, including the specified copy, geometry, colors, badges, row actions, add button, responsive safety, and accessible dropdown behavior.

## desiredOutcome

A live schedule block whose final rendered appearance matches the 724×219 Figma reference: `HORÁRIOS`, 10px label-to-list gap, 12px row gap, 64px rows, specified surfaces/type/badges, no left icon, 32px action trigger, and a 40px dashed add button with `#0b5ed7` text; with no clipping and an accessible action menu.

## userOutcomeReview

Static source inspection confirms most requested anatomy and geometry: exact copy, 10px/12px gaps, 64px minimum row height, 12px radius, requested border/background/padding, no left icon, typography, badges, and a labeled 32px dropdown trigger. However, the add button uses the global `text-primary` token. In this project that token resolves from `--primary: oklch(0.488 0.243 264.376)`, not the required `#0b5ed7`, so the explicit visual target is not fully met.

Full visual QA is also blocked: no fresh rendered capture exists for the current source. The `actual-desktop-section.png` and `actual-mobile-section.png` artifacts predate `NewProductFlow.tsx` and their adjacent extracted text shows the old copy (`HORÁRIOS DAS SAÍDAS`, `Saída 1/2`, `Adicionar saída`). They cannot verify the final refactor.

No CJK strings occur in this block. Portuguese accented copy is present correctly. At narrow widths, `truncate` prevents horizontal overflow but intentionally elides the description; without a fresh mobile render, font fallback, ellipsis behavior, and vertical centering remain unverified.

The dropdown trigger has an explicit accessible name and the Radix-style menu primitives provide button/menu/menuitem semantics. Static review found no keyboard-accessibility defect, but actual focus/keyboard behavior was not exercised.

## blockers

1. **violatedCriterion:** `VIS-COLOR-ADD-01` — dashed add button text must be blue `#0b5ed7`.
   **evidencePointer:** `src/modules/produtos/NewProductFlow.tsx:603`; `src/styles/theme.css:58`.
   **Observation:** `text-primary` resolves to the project's indigo primary token rather than the required Figma blue.

## notes

- `[evidence]` Full rendered/pixel fidelity remains unverified because no fresh actual capture exists. This is not treated as an additional product blocker for the explicitly requested static-only pass, but it blocks a full visual-QA PASS.
- `[product]` `min-h-16` yields the intended 64px at the reference width with the current one-line content, but is not a strict `h-16`; this is responsive-friendly and no demonstrated criterion failure exists.
- `[quality]` `NewProductFlow.tsx` measures 1541 pure LOC, exceeding the programming/remove-ai-slops 250 LOC ceiling. It is maintenance debt but not a blocker because no stated schedule fidelity criterion requires module decomposition.
- `[quality]` `ProdutosPage.test.tsx:126-156` verifies copy, menu semantics, and selected class substrings, but does not verify geometry, the required add-button color, responsive clipping, or rendered pixels. The class-string assertions mirror implementation details and provide limited visual confidence. This is maintenance/false-confidence evidence, not a blocker independent of the production mismatch.
- No excessive deletion-only, removal-verification, tautological, normalization/parsing, or needless production extraction specific to this schedule refactor was found.

## checkedArtifactPaths

- `.omo/evidence/produto-schedule-figma-qa/reference.png` (valid 724×219 RGBA PNG, visually inspected)
- `.omo/evidence/produto-schedule-figma-qa/actual-desktop-section.png` (stale; not accepted)
- `.omo/evidence/produto-schedule-figma-qa/actual-mobile-section.png` (stale; not accepted)
- `.omo/evidence/produto-schedule-figma-qa/actual-desktop-section.json` (old-copy evidence)
- `.omo/evidence/produto-schedule-figma-qa/actual-mobile-section.json` (old-copy evidence)
- `.omo/evidence/produto-schedule-figma-qa/desktop-diff.json` (stale and dimension-mismatched; not accepted)
- `src/modules/produtos/NewProductFlow.tsx`
- `src/modules/produtos/ProdutosPage.test.tsx`
- `src/styles/theme.css`

No task-specific code-review report, manual QA matrix, or notepad was found in the provided schedule evidence directory. Direct artifact review supplied the static coverage required for this recommendation; those missing reports do not independently block the stated visual criterion.

## exactEvidenceGaps

- Fresh desktop capture of the final `HORÁRIOS` block at the reference width/state.
- Same-size image diff against `reference.png` after the latest source modification.
- Fresh mobile capture verifying ellipsis, font rendering, badge/action alignment, and absence of clipping.
- Runtime keyboard/focus exercise of both action menus.
- Reproduction logs for the reported `tsc`, ESLint, and Vitest runs were not present in the task-specific evidence directory; their user-supplied outcomes remain unverified.
