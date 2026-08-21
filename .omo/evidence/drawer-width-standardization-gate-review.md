# Drawer width standardization — gate review

- recommendation: **REJECT**
- review mode: read-only artifact review (no source or evidence artifacts modified; this report is the required gate artifact)

## originalIntent

Validate that the desktop right-side drawers “Configurar horário 1” and “Configurar roteiro dia 1” render at exactly 480 px, with no clipping or overlap, aligned headers and footers, readable fields, and fresh 480 px JSON evidence.

## desiredOutcome

Both complete drawer surfaces are visibly intact at a 1440 px desktop viewport, each occupying x=960..1440 (480 px), with header, scrollable body, and footer correctly contained and aligned; matching JSON and PNG evidence must postdate the relevant rendered source.

## userOutcomeReview

The schedule drawer satisfies the visible geometry and fidelity requirements: its full title, fields, and footer are readable and aligned. The route-day drawer does not: its screenshot visibly clips the header title at the left edge (only the trailing portion is visible), and the full-height 480×1000 capture ends in the cobrança body without showing the footer. Therefore the shipped evidence does not demonstrate the requested intact 480 px route-day drawer.

Both JSON files report `width: 480`, `height: 1000`, `left: 960`, `right: 1440`, and `viewportWidth: 1440`; both PNG signatures are valid RGB PNGs of 480×1000. However, all four QA artifacts have mtime `2026-08-19T11:47:11-0300`, while the directly relevant `src/modules/produtos/NewProductFlow.tsx` has mtime `2026-08-19T11:47:28-0300`. Under the required freshness rule, these captures are stale relative to the rendered source.

## blockers

1. **violatedCriterion:** `VISUAL-NO-CLIPPING-OVERLAP`
   - observation: The route-day screenshot visibly cuts off the beginning of “Configurar roteiro dia 1” at the left boundary.
   - evidencePointer: `.omo/evidence/drawer-width-qa/route-day-config-drawer.png`, top header, left edge.

2. **violatedCriterion:** `VISUAL-FOOTER-HEADER-ALIGNED`
   - observation: The route-day drawer's complete 1000 px element capture contains no footer; the image terminates within the cobrança form, so footer containment/alignment is not demonstrated and the captured surface is visibly incomplete.
   - evidencePointer: `.omo/evidence/drawer-width-qa/route-day-config-drawer.png`, bottom edge.

3. **violatedCriterion:** `EVIDENCE-FRESH-AND-480PX`
   - observation: Dimensions are 480 px, but PNG/JSON evidence predates the relevant rendered source by 17 seconds.
   - evidencePointer: artifact mtimes for `.omo/evidence/drawer-width-qa/{schedule-config-drawer.png,schedule-config-drawer.json,route-day-config-drawer.png,route-day-config-drawer.json}` versus `src/modules/produtos/NewProductFlow.tsx`.

## checkedArtifacts

- `.omo/evidence/drawer-width-qa/schedule-config-drawer.png`
- `.omo/evidence/drawer-width-qa/schedule-config-drawer.json`
- `.omo/evidence/drawer-width-qa/route-day-config-drawer.png`
- `.omo/evidence/drawer-width-qa/route-day-config-drawer.json`
- `src/modules/produtos/NewProductFlow.tsx` (relevant drawer markup/classes and freshness comparison)
- `src/modules/produtos/ProdutosPage.test.tsx` (searched for drawer-width assertions)
- `git status --short` and relevant source inspection

## directSkillPerspectiveChecks

- `visual-qa`: PNG signatures/dimensions checked; both screenshots opened directly at original detail; completeness, clipping, field readability, header, and footer inspected.
- `remove-ai-slops`: Direct pass over the relevant production markup and available tests found no excessive, tautological, deletion-only, requested-removal-only, or implementation-mirroring width tests. No unnecessary extraction/parsing/normalization attributable to this width change was evidenced. This does not cure the visual/freshness blockers.
- `programming`: Relevant TypeScript markup was inspected for scope drift and false-confidence tests. No width-specific behavioral assertion exists in the searched test file; this is a note, not a blocker, because the requested acceptance artifact is visual/JSON evidence.

## reportCoverageAndEvidenceGaps

- No task-specific executor report, code-review report, manual-QA matrix, or notepad path was supplied or found under the requested evidence directory.
- Consequently, there is no independent report demonstrating the same `remove-ai-slops`/`programming` coverage. The direct gate pass above supplies that perspective, so report absence is not itself a blocker.
- Exact gap to approve: regenerate both PNGs and JSONs after the final relevant source edit, with the route-day drawer fully settled and showing an unclipped title plus its contained/aligned footer; then verify the new JSON still reports width 480.
