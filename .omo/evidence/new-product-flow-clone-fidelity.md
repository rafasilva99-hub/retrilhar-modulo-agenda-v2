# Clone Fidelity Review — New Product Flow

## Recommendation

**REQUEST_CHANGES**

## Scope and conclusion

The prior behavioral/layout blockers are resolved: `ProductFlowStepper` renders a live, mapped React button tree; its state is a `ProductStepId`; the supplied current receipt shows all six active states and `focusVisible: true`; and the captured card rectangle is 234px wide.

However, this remains a local Figma-style implementation, not a rigorous token-driven design-system implementation. A map of raw Tailwind arbitrary-value strings is centralization, not a design-token layer. The project design contract explicitly requires semantic tokens and prohibits raw generated-export color literals in maintained components.

## Findings

### CRITICAL

None. The stepper is live DOM (`nav`, six native `button`s, spans, inline SVGs) with no screenshot/raster/background-image substitute. `FigmaStepIcon` inherits `currentColor` rather than rendering an image.

### HIGH

1. **Design tokens are still bypassed.** `productStepperClassNames` embeds all component visual roles as raw literals, including colors, dimensions, radius, shadow, icon holder size, connector offsets, and a local font-family string: [NewProductFlow.tsx:205](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/produtos/NewProductFlow.tsx:205) through [NewProductFlow.tsx:217](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/produtos/NewProductFlow.tsx:217). Examples include `#e9eaeb`, `#1570ef`, `#0b5ed7`, `w-[234px]`, `rounded-[15px]`, `size-[31px]`, `left-[15.5px]`, and an inline shadow recipe.

   This directly conflicts with the documented contract to use semantic tokens first and add a semantic role to the theme before use: [DESIGN.md:35](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/DESIGN.md:35) through [DESIGN.md:40](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/DESIGN.md:40). The available token layer exposes generic semantic roles at [theme.css:3](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/styles/theme.css:3) through [theme.css:44](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/styles/theme.css:44), but none of the required stepper roles are declared there.

   **Required before approval:** promote the Figma-derived values into named semantic design tokens (color, spacing/geometry, typography, border/radius, elevation, state/focus) and consume those tokens from the stepper. Keep the data-driven live component.

### MEDIUM

1. **Pixel fidelity is not yet demonstrated at an approval-grade level.** The fresh supplied card captures have matching 237×306 dimensions and look structurally close on direct inspection, but the independently re-run image diff reports 14,317/72,522 differing pixels (19.74%), a similarity score of 80/100, and 62 hotspots spread across the card, including the final row. The existing summary does not account for those regions. This is not evidence of a raster fake, but it is insufficient to claim pixel-level fidelity.

   **Required follow-up:** capture the same settled view with identical compositing and provide an explained/closed hotspot comparison; correct any remaining text, edge, shadow, or spacing drift it reveals.

### LOW

None.

## Prior-blocker disposition

| Prior blocker | Result | Evidence |
| --- | --- | --- |
| Hardcoded/per-screen stepper | Partially resolved | Live `ProductFlowStepper` is mapped, typed, and interactive, but the hardcoded styling half remains HIGH. |
| Card width mismatch | Resolved | `figma-nav-refine-summary.json` records `rect.width: 234`; current capture is 237×306 solely to retain reference bounds. |
| No non-initial/focus evidence | Resolved | `figma-nav-refine-summary.json` records all six active labels, colors, focus-visible state, no overflow, and no runtime issues; it postdates `NewProductFlow.tsx`. |

## Evidence inspected

- [NewProductFlow.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/produtos/NewProductFlow.tsx)
- [ProdutosPage.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/produtos/ProdutosPage.tsx)
- [DESIGN.md](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/DESIGN.md) and [theme.css](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/styles/theme.css)
- [Figma reference PNG](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/new-product-flow/figma-node-16304-164261.png)
- [Actual rest PNG](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/new-product-flow/actual-nav-card-figma-refine.png)
- [State/focus receipt](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/new-product-flow/figma-nav-refine-summary.json)
- [Image-diff JSON](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/new-product-flow/figma-nav-image-diff.json), independently re-run against the two supplied PNGs
- [Responsive/browser receipt](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/new-product-flow/browser-nav-refine-summary.json)
