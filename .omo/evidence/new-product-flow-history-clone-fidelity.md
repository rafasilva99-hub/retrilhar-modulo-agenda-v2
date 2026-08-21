# NewProductFlow history action — clone-fidelity review

## Recommendation

**REQUEST_CHANGES (REVISE)**

## Scope and method

Read-only static review of the requested Figma contract:

- Button node `16304:164255`: 100 × 36 ghost action, 16px `clock-04`, 8px gap, 12px/8px horizontal padding, regular 14px `#535862` label `Histórico`.
- Drawer node `16252:194025`: 720px right sheet, white, `#e9eaeb` border, `-8px 0 24px rgba(0,0,0,.1)` shadow, 16px left radius, 69px header, 18px close icon, 11px timeline dots, 13px/11px/12px row typography, and 73px footer.

No server, browser, build, test, or screenshot capture was started, per task constraint. Existing captures are not admissible for this change: `NewProductFlow.tsx` is newer (2026-08-17 13:08:11) than every supplied general-flow capture (latest inspected: 2026-08-17 12:14:36), and none is an actual/reference capture of the history drawer state.

## Findings

### CRITICAL

None. The history UI is a live React component tree: `ProductHistoryDrawer` maps structured event data to DOM rows and uses the shared shadcn `Sheet`; it is not an image, canvas, or CSS background substitute (`src/modules/produtos/NewProductFlow.tsx:597-702`). The action uses the requested HugeIcons `Clock04Icon` (`src/modules/produtos/NewProductFlow.tsx:765-774`).

### HIGH

1. **The new surface is not token-driven.** The project contract requires semantic Tailwind tokens and explicitly forbids copying raw Figma colors into maintained components (`DESIGN.md:35-40`), but the history implementation hardcodes its design contract as local literals: sheet border/shadow/width (`NewProductFlow.tsx:611`), header height/divider (`:613`), close colors/radius (`:626`), timeline geometry and colors (`:637-654`), text colors and sizes (`:659-682`), and footer geometry/colors (`:692-696`). The header action also hardcodes its Figma padding, radius, color, and height (`:770`). This makes the target match a one-off and breaks centralized theme/dark-mode behavior; extract named semantic tokens and consume the shared Button variants before approval.

2. **Current visual fidelity is unverified by a matching artifact.** There is no inspected reference export for Figma nodes `16304:164255` or `16252:194025`, no actual screenshot with this drawer open, and all inspected general-flow screenshots predate the source (`.omo/evidence/new-product-flow/render-{desktop,tablet,mobile}-new-product.png`). Therefore the exact rendered width, sheet position, visual hierarchy, shadow, clipping/scroll behavior, and close/footer alignment cannot be verified. The existing test only asserts DOM text and class substrings (`ProdutosPage.test.tsx:126-147`); it cannot establish pixel fidelity. Capture the open drawer and the header action at the target viewport against Figma after the final source edit.

### MEDIUM

1. **The Figma-defined history action disappears below the `md` breakpoint.** The action begins with `hidden` and only becomes flex at `md` (`NewProductFlow.tsx:770`), while the test locates it in jsdom without evaluating that visibility rule (`ProdutosPage.test.tsx:126-137`). Unless the Figma contract explicitly excludes narrow viewports, the requested action is unavailable on mobile/tablet-width UI. Preserve an accessible compact action or document and verify the breakpoint exception.

2. **The header divider does not use the supplied drawer border color.** Figma specifies `#e9eaeb` for the sheet border; the outer and footer borders use it (`NewProductFlow.tsx:611,692`), but the header separator is `#f0f1f3` (`:613`). If the node’s stated border token applies to all drawer rules, this is a visual mismatch; confirm against the node export and align it.

3. **The regression test is implementation-mirroring rather than a fidelity lock.** It asserts exact Tailwind utility fragments, including raw hover color and padding (`ProdutosPage.test.tsx:25-31,129-135`), but does not verify computed geometry, icon dimensions, sheet width, timeline values, or rendered drawer state. It can pass while the Figma visual changes. Replace the class-substring checks with a state/geometry or visual-evidence assertion in the executor’s follow-up.

### LOW

None.

## What is correct and must not regress

- The header action’s static CSS encodes the supplied 36px height, 12px/8px padding, 8px gap, 14px regular text, `#535862` color, and a 16px Clock04 HugeIcon (`NewProductFlow.tsx:765-774`).
- The drawer composes the shared shadcn Sheet and native DOM content, sets a 720px desktop max width, left 16px radius, white surface, requested outer border/shadow, 69px header, and 18px close icon (`NewProductFlow.tsx:607-630`).
- The mapped timeline has 11px dots with the stated first/rest colors, and 13px title, 11px date, 12px responsible row treatments (`NewProductFlow.tsx:632-686`); the footer is 73px with `Fechar aba` (`:692-700`).

## Evidence inspected

- Target specification in this task for Figma nodes `16304:164255` and `16252:194025` (no Figma export path supplied).
- `src/modules/produtos/NewProductFlow.tsx` (complete current source, especially `:597-702`, `:714-728`, `:765-774`, `:1431`).
- `src/modules/produtos/ProdutosPage.test.tsx` (complete current source, especially `:25-31`, `:117-148`).
- `src/components/ui/sheet.tsx:44-77` (shared Sheet implementation).
- `src/styles/theme.css:3-45,47-85` and `DESIGN.md:13-40,110-116,126-130` (available tokens and primitive contract).
- `.omo/evidence/new-product-flow/render-desktop-new-product.png`, `render-tablet-new-product.png`, and `render-mobile-new-product.png` only to establish staleness; not used as fidelity evidence.
- `.omo/evidence/new-product-flow-clone-fidelity.md` and `new-product-flow-figma-refinement-gate-review.md` as untrusted prior claims; their scope is the navigation card, not these two Figma nodes.

No notepad path or a task-specific full diff was supplied. `NewProductFlow.tsx` is untracked, so it has no Git diff to inspect; the complete file was reviewed instead.

## Blockers

1. Replace the hardcoded Figma visual literals in the history action/drawer with documented semantic tokens and shared button primitives.
2. Supply fresh reference/actual captures for both Figma nodes after the final source edit, including the open drawer state.
3. Resolve or explicitly scope the history action’s `md`-only visibility.
