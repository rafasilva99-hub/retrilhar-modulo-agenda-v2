# Produto schedule clone-fidelity review

## Verdict

**VERDICT: REVISE**

```yaml
recommendation: REQUEST_CHANGES
reportPath: .omo/evidence/produto-schedule-clone-fidelity.md
```

This is a static design-system and functional-integrity pass. The source proves that the schedule block is live React/Radix DOM, not a pasted Figma image. Its static geometry and hierarchy closely encode the 724×219 target. It cannot be approved as a rigorous design-system implementation: its target-specific styling is component-local hardcoding, and no fresh rendered capture exists for the current source.

## Findings

### CRITICAL

None. `TimeSlotRow` renders native DOM text, a `span` badge, native button trigger, HugeIcon SVG, and Radix dropdown components; no schedule source references the reference PNG, an image URL, `background-image`, canvas, or `dangerouslySetInnerHTML`. The two row instances reuse `TimeSlotRow` and `ScheduleStatusBadge` ([NewProductFlow.tsx:516-596](src/modules/produtos/NewProductFlow.tsx#L516)).

### HIGH

1. [product] **The new schedule system bypasses the documented token contract.** `ScheduleStatusBadge`, `ScheduleActionsMenu`, `TimeSlotRow`, and `DashedAddButton` hardcode raw Figma colors, arbitrary geometry, radius, typography, and elevation: e.g. `#abefc6`, `#ecfdf3`, `#079455`, `#e9eaeb`, `#f5f5f5`, `#e2e8f0`, `#F04438`, `h-[18px]`, `w-[180px]`, `rounded-[10px]`, and a local shadow ([NewProductFlow.tsx:521-525](src/modules/produtos/NewProductFlow.tsx#L521), [NewProductFlow.tsx:539-558](src/modules/produtos/NewProductFlow.tsx#L539), [NewProductFlow.tsx:582-603](src/modules/produtos/NewProductFlow.tsx#L582)). `DESIGN.md` requires semantic tokens first and requires a theme role to be added before a new role is used ([DESIGN.md:35-40](DESIGN.md#L35)); the available theme defines only generic roles and no schedule/status/control token set ([src/styles/theme.css:47-84](src/styles/theme.css#L47)). This is precisely the per-screen hardcoding the design-system gate rejects.

2. [evidence] **Visual fidelity is unverified for the audited revision.** The only actual schedule captures in the supplied evidence directory, `actual-desktop-section.png` and `actual-mobile-section.png`, are timestamped 2026-08-17 13:14, while `NewProductFlow.tsx` is timestamped 2026-08-18 23:09. Their matching JSON and `desktop-diff.json` are therefore stale. The reference itself is 724×219 and was modified after the source (2026-08-18 23:11), but there is no same-size screenshot of the current application, no current image diff, and no browser/computed-style receipt. The stated typecheck, ESLint, and Vitest results were supplied only as text, without task-specific output artifacts, so they cannot establish rendered fidelity. The browser/dev-server constraint explains the gap but does not make a full visual approval possible.

### MEDIUM

1. [product] **The visible schedule actions are not wired to product behavior.** `ScheduleActionsMenu` has no `onSelect`/callback on either menu item, and `DashedAddButton` has no `onClick` or callback ([NewProductFlow.tsx:532-565](src/modules/produtos/NewProductFlow.tsx#L532), [NewProductFlow.tsx:599-608](src/modules/produtos/NewProductFlow.tsx#L599)). The menu is keyboard-operable because it uses Radix, but selecting “Editar horário” or “Excluir horário” only dismisses the menu; “Adicionar horário” is also inert. The existing inline `ScheduleActionButton` controls were likewise inert ([NewProductFlow.tsx:458-512](src/modules/produtos/NewProductFlow.tsx#L458)), so this is not proven to be a regression, but the implementation summary’s claim to preserve actions overstates functional coverage.

2. [product] **Important Portuguese schedule detail is deliberately hidden at constrained widths.** The description is always `truncate` ([NewProductFlow.tsx:590-592](src/modules/produtos/NewProductFlow.tsx#L590)). At a narrow viewport, the time/capacity content can be replaced by an ellipsis instead of reflowing or remaining available in an accessible disclosure. This conflicts with the project requirement that long Portuguese labels reflow without loss on narrow widths ([DESIGN.md:163-168](DESIGN.md#L163)). No current responsive capture exists to determine the actual threshold or severity in rendering.

3. [product] **The active badge’s normal-size text is below the documented AA contrast floor.** The specified `#079455` foreground on `#ecfdf3` is approximately 3.7:1; at 11px regular this is normal text, below the project’s 4.5:1 requirement ([NewProductFlow.tsx:521-524](src/modules/produtos/NewProductFlow.tsx#L521), [DESIGN.md:161-164](DESIGN.md#L161)). The target reference appears to use that same visual treatment, so resolving this requires an explicit fidelity/accessibility decision rather than silently changing a target value.

### LOW

1. [evidence] **The new test asserts implementation literals instead of the functional outcome.** It opens the Horário 2 menu and clicks “Editar horário” but makes no assertion about a resulting edit state; it also locks the raw badge-class literals ([ProdutosPage.test.tsx:141-157](src/modules/produtos/ProdutosPage.test.tsx#L141)). This permits inert controls and reinforces the non-tokenized implementation.

2. [evidence] **The source has no conventional changed-file diff.** `NewProductFlow.tsx` is untracked, so Git supplies no before/after diff; only its full current contents can be inspected. No notepad path was provided. These do not conceal a raster substitution, but they reduce change provenance and prevent a complete claim-by-claim regression review.

## Static alignment that should be preserved

- The target’s layer hierarchy is materially present: `SectionLabel` → vertical stack → two time-slot rows → full-width dashed add button ([NewProductFlow.tsx:1127-1142](src/modules/produtos/NewProductFlow.tsx#L1127)).
- The rows have no left leading icon, use `min-h-16` (64px), 20px horizontal padding, 12px stack gaps, a single 32px action trigger, and the add button is 40px high, matching the described Figma anatomy ([NewProductFlow.tsx:582-605](src/modules/produtos/NewProductFlow.tsx#L582)).
- Copy, statuses, and item order match the reference packet; the title/status grouping is rendered as text and a label-bearing badge rather than as pixels.
- HugeIcons and the local Radix/shadcn dropdown primitive are used correctly for the overflow menu, with a native accessible-name trigger ([NewProductFlow.tsx:534-565](src/modules/produtos/NewProductFlow.tsx#L534), [src/components/ui/dropdown-menu.tsx:20-72](src/components/ui/dropdown-menu.tsx#L20)).

## Blockers before approval

1. Replace the schedule block’s raw component-local visual literals with named theme/design tokens and consume those tokens through maintained primitives or a shared module primitive.
2. Capture the current rendered schedule block at the reference’s 724×219 viewport/state, validate the capture, and provide a fresh pixel-diff result. The existing captures cannot be reused because they predate the source.
3. Provide real behavior for the exposed add/edit/delete controls, or explicitly scope them as non-interactive prototype affordances and remove the implication that prior actions were preserved.

## Evidence inspected

- `src/modules/produtos/NewProductFlow.tsx` (current untracked audit target; schedule components and call site)
- `src/modules/produtos/ProdutosPage.tsx` (flow integration)
- `src/modules/produtos/ProdutosPage.test.tsx` (current uncommitted test changes)
- `src/components/ui/dropdown-menu.tsx` and `src/components/ui/button.tsx` (available maintained primitives)
- `DESIGN.md`, `src/styles/theme.css`, and `src/styles/fonts.css` (design contract and token availability)
- `.omo/evidence/produto-schedule-figma-qa/reference.png` (opened directly; valid 724×219 RGBA reference)
- `.omo/evidence/produto-schedule-figma-qa/actual-desktop-section.png`, `actual-mobile-section.png`, their JSON receipts, and `desktop-diff.json` (inspected only to establish staleness; not used as fidelity evidence)
- Git status/diff metadata (full diff available for `ProdutosPage.test.tsx`; no baseline diff for untracked `NewProductFlow.tsx`)

## Evidence limitation

No server, browser, build, or test was started in this review. That honors the supplied execution constraint. A full visual-QA PASS is blocked until the owner authorizes a current browser capture.
