# Final Gate Review: gestor-afiliados visual QA

## Decision

- **recommendation:** REJECT
- **visual verdict:** REVISE
- **confidence:** HIGH
- **goalId:** `gestor-afiliados-visual-qa` (inferred; `omo ulw-loop status --json` was unavailable because `omo` is not installed)
- **report path:** `.omo/evidence/gestor-afiliados-visual-qa-gate-review.md`

## Original intent

Apply the manager and personal-affiliate scenarios from:

- `/Users/rafaelsilva/Downloads/Protótipos/painel-afiliado-prototipo.html`
- `/Users/rafaelsilva/Downloads/Protótipos/painel-gestor-afiliados-prototipo.html`

The expected result is a separate manager affiliate module on preserved hash routes, with overview, affiliate list/detail, proposals, product requests, payments, and editable term states, while the personal `#afiliados` dashboard remains separate and visually intact. The implementation must avoid visual regression, duplicate/navigation confusion, visible implementation language, forbidden affiliate terminology, and page-level mobile overflow.

## Desired outcome

1. Manager overview covers KPIs, pending proposals/requests/payments, term, and ranking.
2. Manager affiliate list has search/filtering, a horizontally contained table, and detail sheet.
3. Proposals expose received/sent tabs and action/invite/counterproposal concepts.
4. Product requests expose approve/deny cards and approval dialog concept.
5. Payments expose A pagar/Histórico tabs and manual-payment dialog concept.
6. The term is editable and exposes reset/save-version actions.
7. Personal `#afiliados` stays visually coherent and separate.
8. The 390px manager list has no page/body horizontal overflow; table and subnav scrolling remain contained.
9. Visible UI follows repository copy rules: no `mock`, use `afiliação` rather than `vínculo`/`contrato`, and keep organization/data context coherent.

## User outcome review

The module is structurally present and most scenario coverage is real. All six manager routes render, the personal affiliate dashboard remains separate, the supplied desktop captures are visually coherent, and live checks confirmed the request-approval and manual-payment dialogs render correctly. The 390px page/body width is contained at 390px, and the table scroll is contained.

The shipped user-visible result is not ready because it exposes implementation language (`mock`/`mockado`), repeatedly uses the forbidden UI term `vínculo(s)`, identifies the current organization as EliasTurismo while the affiliate sheet says Cerrado Experience, and presents contradictory pending-payment counts on the same overview screen.

## Blockers

### B1 — visible implementation terminology

- **violatedCriterion:** `UI-COPY-01` — the repository contract says the word `mock` must never appear in visible UI copy.
- **observation:** The counterproposal dialog visibly says “Fluxo mockado sem backend”, and term reset/save status messages also expose “mock”.
- **evidencePointer:** `.omo/evidence/gestor-afiliados-visual-qa/interaction-proposal-dialog.png`; `src/modules/gestor-afiliados/components/proposals.tsx:130`; `src/modules/gestor-afiliados/components/term.tsx:15`; `src/modules/gestor-afiliados/components/term.tsx:20`.
- **required fix:** Replace all implementation-oriented text with user-facing scenario copy, then recapture the dialog and post-action term states.

### B2 — forbidden affiliate terminology

- **violatedCriterion:** `AFF-TERM-01` — affiliate UI must call the relationship `afiliação`; it must not introduce `vínculo`/`vínculos`.
- **observation:** The manager header, overview helper, and affiliate sheet visibly use `vínculo(s)`.
- **evidencePointer:** `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliados-desktop.png`; `.omo/evidence/gestor-afiliados-visual-qa/interaction-affiliate-sheet.png`; `src/modules/gestor-afiliados/GestorAfiliadosPage.tsx:34`; `src/modules/gestor-afiliados/components/overview.tsx:36`; `src/modules/gestor-afiliados/components/affiliates-list.tsx:172`.
- **required fix:** Use `afiliação`/`afiliações` consistently in these rendered strings and rerun the visible-copy scan.

### B3 — organization context contradiction

- **violatedCriterion:** `CONTENT-COHERENCE-01` — the manager module must remain separate and avoid navigation/context confusion; affiliate data must not be invented or shown under the wrong organization.
- **observation:** Manager screenshots show EliasTurismo as the active organization, while the opened affiliate sheet says the record belongs to Cerrado Experience.
- **evidencePointer:** `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosLista-desktop.png`; `.omo/evidence/gestor-afiliados-visual-qa/interaction-affiliate-sheet.png`; `src/modules/gestor-afiliados/components/affiliates-list.tsx:172`; `src/mocks/shell.ts` (`shellOrganization`).
- **required fix:** Derive the organization label from the active shell context or align the manager fixture with that context; recapture the list and sheet together.

### B4 — contradictory pending-payment count

- **violatedCriterion:** `OVERVIEW-COVERAGE-01` — expected manager overview coverage includes a coherent pending-payments state.
- **observation:** The overview KPI says “2 pendências de repasse”, while the pending-payments card on the same screen shows `1`; the source computes one `a-pagar` payment but hardcodes two in the helper.
- **evidencePointer:** `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliados-desktop.png`; `src/modules/gestor-afiliados/components/overview.tsx:23`; `src/modules/gestor-afiliados/components/overview.tsx:54`; `src/modules/gestor-afiliados/components/overview.tsx:80`.
- **required fix:** Derive the helper and badge from one shared pending-payment definition, deciding explicitly whether automatic split entries count as pending.

## Responsive and visual findings

- Desktop captures: no clipped Portuguese text, missing glyphs, black compositing regions, unexpected alpha artifacts, or page-level horizontal overflow found.
- Mobile capture: the binary overflow requirement passes (`innerWidth`, `htmlScrollWidth`, and `bodyScrollWidth` are all 390px). The table container is 242px wide with 811px scroll content, and the subnav is 240px wide with 647px scroll content, so both overflow internally as intended.
- **NOTE, not a blocker:** the collapsed shell still leaves only a 242px main rail; the title is squeezed to about 114px beside the action, and the description wraps almost word-by-word. This is visibly cramped but does not fail the stated no-page-overflow criterion. Consider a mobile shell offset below 124px and stacking the page action below the title.
- CJK: N/A; no CJK content is present.

## Scenario coverage checked

| Scenario | Result | Evidence |
|---|---|---|
| Manager overview | Covered, but payment count/copy blockers | `gestorAfiliados-desktop.png`, `overview.tsx` |
| Affiliate list/search/status filter | Covered | `gestorAfiliadosLista-desktop.png`, `affiliates-list.tsx` |
| Affiliate detail sheet | Covered, but terminology/context blockers | `interaction-affiliate-sheet.png` |
| Received/sent proposals | Covered in source; received capture supplied | `gestorAfiliadosPropostas-desktop.png`, `proposals.tsx:21-60` |
| Proposal/counterproposal dialog | Covered, but visible `mock` blocker | `interaction-proposal-dialog.png` |
| Product requests and approval dialog | Covered; dialog reproduced live | `gestorAfiliadosSolicitacoes-desktop.png`, `requests.tsx:19-101` |
| Payment tabs and manual dialog | Covered; dialog reproduced live | `gestorAfiliadosPagamentos-desktop.png`, `payments.tsx:20-127` |
| Editable term/reset/save | Covered, but post-action `mock` copy blocker | `gestorAfiliadosTermo-desktop.png`, `term.tsx` |
| Personal `#afiliados` separation | Covered | `afiliados-desktop.png`, `AgendaPrototypeApp.tsx:237-305`, `App.test.tsx` |
| Mobile page overflow | Pass | `gestorAfiliadosLista-mobile.png`, `summary.json`, independent CDP metrics |

## Evidence and source paths inspected

### Reference artifacts

- `/Users/rafaelsilva/Downloads/Protótipos/painel-afiliado-prototipo.html`
- `/Users/rafaelsilva/Downloads/Protótipos/painel-gestor-afiliados-prototipo.html`

Both references were read directly and rendered through the existing headless Chrome session for overview/list/mobile comparison. The references define scenario/content direction rather than a same-size pixel baseline.

### Supplied evidence

- `.omo/evidence/gestor-afiliados-visual-qa/summary.json`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliados-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosLista-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosPropostas-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosSolicitacoes-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosPagamentos-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosTermo-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/gestorAfiliadosLista-mobile.png`
- `.omo/evidence/gestor-afiliados-visual-qa/afiliados-desktop.png`
- `.omo/evidence/gestor-afiliados-visual-qa/interaction-affiliate-sheet.png`
- `.omo/evidence/gestor-afiliados-visual-qa/interaction-list-before.png`
- `.omo/evidence/gestor-afiliados-visual-qa/interaction-proposal-dialog.png`
- `.omo/evidence/gestor-afiliados-visual-qa/interaction-proposals-before.png`

All supplied PNG signatures and dimensions are valid. Their timestamps are after the latest relevant source edit (`GestorAfiliadosPage.tsx` at 15:06:06; captures at 15:07:34–15:07:39).

### Production and test source

- `src/mocks/gestor-afiliados.ts`
- `src/modules/gestor-afiliados/GestorAfiliadosPage.tsx`
- `src/modules/gestor-afiliados/components/{affiliates-list,overview,payments,proposals,requests,shared,term}.tsx`
- `src/modules/agenda/components/AgendaPrototypeApp.tsx`
- `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`
- `src/components/layout/{app-layout,app-page,app-shell,app-sidebar,top-bar}.tsx`
- `src/components/layout/topbar/{search-pages,topbar-organization,topbar-profile}.tsx`
- `src/components/layout/types.ts`
- `src/components/ui/table.tsx`
- `src/mocks/shell.ts`
- `src/app/App.test.tsx`
- `src/modules/afiliados/AfiliadosPage.tsx`
- `src/modules/afiliados/AfiliadosPage.test.tsx`
- `.claude/rules/afiliados.md`
- `.claude/rules/agenda-fidelity.md`
- `CLAUDE.md`

## Reproduced verification

- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0.
- `npm run build` — exit 0; Vite reports the known >500 kB chunk warning (`index-CymFgAp_.js`, 1,780.90 kB).
- `npm test` — exit 0; 18 files and 71 tests passed.
- `git diff --check` — exit 0.
- Relevant contract scan — no `fetch(` and no alternate icon-package imports under the manager module/mock.
- Fresh live CDP metrics at 390×844 — body/page width 390px; main rail 242px; subnav and table overflow are internally contained.

## Direct programming and remove-ai-slops pass

The direct review covered all ten slop categories plus the TypeScript programming criteria.

### Production-code notes

- New manager modules are each below 250 pure LOC; `src/mocks/gestor-afiliados.ts` is in the warning band at 207 pure LOC.
- Two touched host modules remain oversized: `AgendaPrototypeApp.tsx` at 358 pure LOC and `AfiliadosPage.tsx` at 764 pure LOC. This is maintenance debt, not a blocker for a stated user criterion in this gate.
- `GestorAfiliadosPage.tsx:22-29` reaches into the parent shell via a DOM query and synthetic click to collapse mobile navigation. That cross-layer coupling is brittle; it is a NOTE because the current mobile route works and no criterion requires a shell API refactor.
- Manager fixture interfaces use mutable properties instead of `readonly`; NOTE only.
- `proposals.tsx:28` derives direction via `tab.slice(0, -1)`. It currently works, but an explicit typed mapping would be easier to maintain; NOTE only.
- No broad catches, debug logs, dead imports, needless parser/normalizer, alternate icon package, network boundary, or oversized new production component was found.

### Test-quality notes

- The manager route tests are shallow but not tautological: they prove each direct/preview hash resolves to distinguishing text.
- No regression tests exercise manager filters, tabs, sheets, dialogs, term actions, mobile collapse, or the visible-copy guardrails. The green suite therefore does not cover the blockers above.
- `AfiliadosPage.test.tsx` includes a deletion-only assertion that the shortcuts navigation is absent. This is diff-shape coverage and creates some maintenance burden; it does not block the manager criteria.
- No excessive snapshot suite, implementation-mirroring parser tests, output-derived expected values, or deletion-only manager tests were found.

## Exact evidence gaps

- No executor code-review report path was supplied or found in `.omo/evidence/gestor-afiliados-visual-qa/`. The direct programming/slop pass above provides the required coverage, so this is not independently blocking.
- No notepad path was supplied.
- No separately named manual-QA matrix was supplied; `summary.json` acts as the route/viewport/browser-event matrix.
- The supplied evidence directory does not persist screenshots for the request-approval dialog, payment dialog, sent-proposals tab, invite dialog, or term post-action status. Request/payment dialogs were reproduced live during this review; source was inspected for the remaining concepts. Persist these states in the next fresh evidence round, especially the term post-action states needed to prove B1 is fixed.
- No same-viewport reference PNG packet or image-diff JSON was supplied. The HTML prototypes were inspected/rendered directly, so this review judges scenario/content fidelity rather than claiming pixel identity.

## Non-regression strengths

- Existing personal affiliate hashes remain declared and tested.
- Manager and personal shells are distinct; the manager sidebar/search route to `#gestorAfiliados`, while the organization control reaches `#afiliados`.
- Desktop spacing, typography, cards, tables, dialogs, and status colors are internally consistent with the project primitives.
- No relevant console errors/warnings are recorded in `summary.json`.
- All supplied routes loaded expected distinguishing text with no page/body horizontal overflow.

