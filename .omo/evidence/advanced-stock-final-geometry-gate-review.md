# Advanced stock final geometry gate review

- recommendation: APPROVE
- blockers: []
- originalIntent: Preserve the collapsed advanced-stock summary and match the expanded state to Figma node `16254:196208`.
- desiredOutcome: Fresh evidence proving exact reference geometry with no design-system, responsive, functional, or accessibility regression.

## User outcome review

PASS. The current source predates all three actual captures, so the previous staleness gap is resolved. The expanded desktop capture is 724x369, exactly matching the 724x369 Figma reference. Direct image inspection confirms the expected disclosure row, two-column desktop inputs, four unchecked switch rows and separators, while the mobile capture remains a clean one-column layout. The closed 724x141 summary is unchanged.

The current implementation at `src/modules/produtos/NewProductFlow.tsx:1219-1282` remains real React DOM and continues to reuse HugeIcons, the existing `Switch`, `Field`, and shared input classes. The native button toggles state, carries `aria-expanded` and `aria-controls`, and each stock switch retains its accessible label.

## Checked artifacts

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx` (mtime 1787105821)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/figma-open-reference.png` (724x369)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-closed-desktop.png` (724x141; mtime 1787105855)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.png` (724x369; mtime 1787105856)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/actual-open-mobile.png` (293x528; mtime 1787105857)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/advanced-stock-figma-qa/open-desktop-diff.json` (mtime 1787105866)
- Corresponding actual capture JSON metadata for dimensions, extracted text, and `ariaExpanded` states.

## Direct programming and slop pass

- No screenshot substitution, new package, new icon system, parsing/normalization layer, speculative abstraction, or test-overfit pattern is present in the reviewed adjustment.
- The geometry adjustment is a scoped `min-h-[327px]` on the expanded panel and does not affect the collapsed branch or mobile height.
- Existing notes about the overall module size and absent targeted regression test remain non-blocking because neither violates a stated success criterion and fresh browser evidence covers both disclosure states.

## Evidence gaps

- None tied to a stated success criterion.
- Diff evidence: `dimensionsMatch: true`, `diffRatio: 0.1036`, `similarityScore: 90`, `alphaChannelIntact: true`. The remaining pixel differences do not correspond to an obvious missing or incorrect requested component on direct inspection.
