# Clone Fidelity Review: event-only-callout (final blocker check)

- Review type: final blocker check, read-only
- Scope: prior font/token/evidence blockers and directly introduced regressions only
- Recommendation: APPROVE
- Verdict: PASS

## Evidence inspected

- `src/components/custom/info-callout.tsx:7-26` — live primitive DOM and styling contract.
- `src/styles/theme.css:3-50,53-57,78-82,119-123,139-147` — Tailwind token mappings, light/dark callout values, and inherited global sans font.
- `src/modules/produtos/NewProductFlow.tsx:38,1097-1115` — two product notices reuse the maintained primitive.
- `DESIGN.md:17-18,32,38-41,127-132` — documented info-callout roles and primitive contract.
- `.omo/evidence/event-only-callout/event-only-callout.png` — inspected directly; valid 1365×768 PNG and fully composited.
- `.omo/evidence/event-only-callout/receipt.json` — passed live-browser assertions and computed styles.

Freshness is valid: the screenshot and receipt are both `2026-08-19T15:18:16-0300`, after `info-callout.tsx` (`15:16:57-0300`) and `NewProductFlow.tsx` (`15:17:13-0300`). No external pixel-reference image or notepad path was supplied; that prevents a broader clone comparison but does not block this deliberately narrow final blocker check.

## Findings

### CRITICAL

None. `InfoCallout` is a live React component composed of a `div`, inline SVG, and paragraph (`src/components/custom/info-callout.tsx:7-26`). The reviewed primitive and its call sites contain no image, canvas, `background-image`, or raster substitute.

### HIGH

None. The prior hardcoded-font blocker is resolved: the text node is only `className="text-callout"` (`src/components/custom/info-callout.tsx:25`), so it inherits the semantic global `font-sans` configured by `--font-sans` and applied on `html` (`src/styles/theme.css:6,53-56,144-147`). The fresh runtime receipt confirms the resulting Helvetica Neue/system sans stack.

### MEDIUM

None. Color, border, icon color, typography size, and line height are token-driven: the primitive uses semantic utilities (`src/components/custom/info-callout.tsx:9-11,25`), mapped via `@theme inline` (`src/styles/theme.css:33-42`) to light and dark semantic values (`src/styles/theme.css:78-82,119-123`). `DESIGN.md:32,131` documents the same primitive and token contract.

### LOW

None.

## Confirmed behavior and non-regressions

- The product flow composes the reusable `InfoCallout` for both event-only and period-specific notices (`src/modules/produtos/NewProductFlow.tsx:1097-1115`).
- The fresh receipt reports the event-only option selected, the on-demand option unselected, the notice and required copy present, the `Funcionamento` section absent, and no console or page errors.
- The receipt’s computed styles match the token contract: `rgb(248, 249, 252)` background, `rgb(245, 245, 245)` border, `10px` radius, and the inherited Helvetica Neue/system sans family.
- Direct screenshot inspection shows the selected event-only card, correctly positioned compact callout, intact Portuguese copy, and no visible clipping or layout break in the reviewed area.

## Blockers

None.
