# Advanced stock Figma QA gate review

- recommendation: REJECT
- reviewVerdict: REVISE
- confidence: HIGH

## Original intent

Refine the advanced stock settings dropdown so the closed state retains the supplied HTML-style badge summary and down chevron, while the open state follows Figma node `16254:196208` with precise desktop geometry and a clean responsive mobile layout.

## Desired outcome

- C1: Open desktop matches the Figma reference in hierarchy, dimensions, spacing, two-column field layout, switch placement, dividers, typography, and colors.
- C2: Closed desktop retains the badge summary and down chevron.
- C3: Open mobile stacks fields and wraps Portuguese content without clipping, overflow, or overlap, with sensible switch alignment.
- C4: Open state contains the up chevron, top divider, 16px interior rhythm, two equal desktop fields, and four unchecked toggle rows with the specified text hierarchy and separators.

## User outcome review

The component structure and responsive behavior satisfy C2-C4 in the supplied captures. C1 is not fully satisfied at precision-review level: the actual open panel is `724x368` versus the `724x369` reference, and direct image inspection shows small but systematic field and row geometry offsets. The supplied image diff confirms `dimensionsMatch: false`, `diffRatio: 0.1065`, and `similarityScore: 89`.

## Blockers

1. violatedCriterion: C1
   observation: The desktop open state is one pixel shorter than the reference and the field/row vertical geometry is shifted; the field outlines are also slightly narrower/inset compared with the reference.
   evidencePointer: `.omo/evidence/advanced-stock-figma-qa/figma-open-reference.png`, `.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.png`, and `.omo/evidence/advanced-stock-figma-qa/open-desktop-diff.json` (`dimensionsMatch: false`; 724x369 vs 724x368; similarity 89).

## Findings and hotspot explanation

- The strongest hotspots at x=0-271, y=138-230 and y=322-368 align with the toggle titles/descriptions and final row. They are caused mainly by small vertical text/row displacement, compounded by font rasterization/color differences.
- Hotspots at y=46-138 align with field labels, placeholders, and outlines. Direct inspection shows the actual inputs beginning slightly lower and their left/right outlines slightly more inset than the Figma reference.
- Right-edge hotspots at x=633-724 align with switches. Switch anatomy and right alignment are visually correct; much of this difference follows the same row displacement rather than a materially wrong control design.
- The one-pixel total-height mismatch is material for a wrapping-precision/fidelity gate even though it does not create clipping.
- Mobile: labels and descriptions wrap naturally, no text or switch overlaps, no horizontal overflow is visible, and switches remain aligned at the right while text receives the remaining width.
- Closed desktop: badge summary is present and wraps into two orderly lines; the down chevron is present and correctly aligned.

## What is good

- Correct open/closed chevron direction and summary hierarchy.
- Top divider, two equal desktop columns, stacked mobile fields, four unchecked switches, and row dividers are all present.
- Portuguese copy is complete and legible with no clipping or overlap.
- Typography hierarchy and muted description color are close to the reference.
- PNG signatures and dimensions were inspected; captures are fully composited. Alpha check is intact per the supplied diff.

## Required direct skill-perspective checks

- Visual fidelity: directly inspected all four PNG artifacts at original resolution and consumed every supplied diff field/hotspot.
- Remove-AI-slops/overfit pass: no deletion-only, tautological, implementation-mirroring, or removal-verification tests were introduced specifically for this advanced-stock visual change in the inspected evidence. The production block uses existing `Field`, `ScheduleBadge`, `Switch`, and `AdvancedStockToggleRow` primitives; no unnecessary parser, normalizer, or extraction was found. This does not cure C1.
- Programming pass: the relevant component code uses existing typed React state and reusable UI primitives. No `any`, suppression, speculative compatibility shim, or scope-expanding abstraction was observed in the reviewed block. Missing dedicated pixel tests are not a blocker because C1 is judged from rendered artifacts, and a class-string test would provide false confidence.
- No dedicated code-review report or manual-QA matrix for this exact advanced-stock evidence set was found. Direct artifact review supplies the requested visual coverage; absence of those reports is an evidence note, not an additional blocker under C1-C4.

## Checked artifact paths

- `.omo/evidence/advanced-stock-figma-qa/figma-open-reference.png`
- `.omo/evidence/advanced-stock-figma-qa/actual-closed-desktop.png`
- `.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.png`
- `.omo/evidence/advanced-stock-figma-qa/actual-open-mobile.png`
- `.omo/evidence/advanced-stock-figma-qa/open-desktop-diff.json`
- `.omo/evidence/advanced-stock-figma-qa/actual-closed-desktop.json`
- `.omo/evidence/advanced-stock-figma-qa/actual-open-desktop.json`
- `.omo/evidence/advanced-stock-figma-qa/actual-open-mobile.json`
- `src/modules/produtos/NewProductFlow.tsx` (advanced-stock block around lines 1218-1290)

## Exact evidence gaps

- No same-size mobile Figma reference was supplied, so mobile is reviewed against the stated responsive contract rather than pixel-compared.
- No dedicated code-review report, manual-QA matrix, or notepad path for this exact goal was supplied or located.
- The captures prove settled states but do not evidence transition animation; animation was not part of C1-C4.
