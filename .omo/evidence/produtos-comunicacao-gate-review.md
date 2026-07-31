# Product Communication Tab Gate Review

- recommendation: REJECT
- userVerdict: REVISE
- reviewType: DESIGN-SYSTEM AND FUNCTIONAL INTEGRITY (read-only)
- reviewedAt: 2026-07-21 America/Sao_Paulo
- repositoryRevision: `db77a0ba44b6dcfad07987e17826119f5ad45368` plus current working-tree changes
- reportPath: `.omo/evidence/produtos-comunicacao-gate-review.md`

## Original intent

Replace the Comunicação placeholder in the product editor with a real React/DOM tab containing local mock-only channel controls, reminder controls, a post-event toggle, editable pre-event and voucher messages, and a live summary/voucher preview. Preserve the existing Vite/React hash route, avoid backend/fetch behavior, remain responsive, and look and behave like a coherent extension of the existing product editor.

## Desired outcome

A user can open `#produtos`, edit a product, reach Comunicação at desktop/tablet/mobile widths, change every communication control, see accurate live summary/preview feedback, publish/save the mock product without silently losing the communication configuration, and operate every control through an accessible interaction path. No network or backend behavior is introduced.

## Criteria

- C1 — Communication controls and derived summary/preview are functionally correct for meaningful input states.
- C2 — The Communication tab is coherently integrated with the product editor lifecycle, including the existing publish/save path, while remaining mock-only and local.
- C3 — The feature remains a real Vite/React DOM implementation on the existing `#produtos` hash route, with no backend/fetch behavior.
- C4 — The feature preserves the local product-editor visual system and the repository design-system accessibility contract across desktop, tablet, and mobile.
- C5 — Changed files pass targeted formatting, lint, typecheck, test, and production build gates.

## Blockers

1. violatedCriterion: C2
   - observation: Publishing the product discards all Communication edits. The communication values are standalone component state, are absent from `Produto`/`ProdutoFormState`, and `saveProduto` only persists `buildProdutoFromForm(form, editingProduto)`. Reopening the product resets channels/messages/reminders from product type/status defaults.
   - evidencePointer: `src/modules/produtos/ProdutosPage.tsx:8-35,373-384,454-474,485-500`; live portal reproduction at `http://127.0.0.1:5176/#produtos`: enable SMS, set pre-event text to `Mensagem persistente de QA`, click `Publicar produto`, reopen Comunicação; observed `sms="false"` and the default product-derived message.
   - requiredFix: Add a typed local communication model to the mock product/form state, include it in save/edit initialization, and add a save/reopen regression test.

2. violatedCriterion: C1
   - observation: Clearing both reminder inputs still makes the summary report `Pré-evento configurado`. Empty strings satisfy `trim() !== "0"`, so the summary contradicts the visible empty controls.
   - evidencePointer: `src/modules/produtos/ProdutosPage.tsx:3010-3011,3160-3163`; live portal reproduction returned `{"values":["",""],"summary":["Pré-evento configurado"]}`.
   - requiredFix: Define reminder-enabled semantics for non-empty positive values (or explicit enabled state), then cover blank, zero, and positive cases.

3. violatedCriterion: C4
   - observation: The post-event switch has no accessible name. The nearby text is not a `<label>` and the `Switch` receives neither `aria-label` nor `aria-labelledby`; the accessibility tree exposes only an unnamed `switch`.
   - evidencePointer: `src/modules/produtos/ProdutosPage.tsx:3101-3113`; live portal DOM evidence returned `{"name":null,"labelledby":null,"checked":"true"}` and snapshot entry `switch` with no name. `DESIGN.md` section 8 requires labels and keyboard-operable named actions.
   - requiredFix: Associate the visible label with the switch using `aria-labelledby`/`id` or add an equivalent accessible name, then assert `getByRole("switch", { name: ... })` and its state transition.

## User outcome review

### What works

- Real DOM/components: the tab renders buttons, inputs, textareas, Radix Switch, sections, and live React state. No raster/background-image substitute is used.
- Hash routing: `use-agenda-prototype-navigation.ts:57-124` reads and synchronizes `window.location.hash`; live QA remained on `http://127.0.0.1:5176/#produtos`.
- Mock-only/no backend: target source contains no `fetch`, axios, XMLHttpRequest, WebSocket, EventSource, storage persistence, or backend adapter. The browser resource audit found no API/GraphQL entries during interaction.
- Interaction paths: channels toggle with `aria-pressed`; reminder inputs accept digits; pre-event/voucher text updates both editor and preview; the post-event switch visually and functionally changes the summary between Ativo/Inativo.
- Responsive behavior: fresh portal QA at 1280x900, 768x900, and 374x666 showed no horizontal document overflow (`bodyWidth === innerWidth`). The desktop layout uses two columns; tablet/mobile collapse to one column. At 374px the 220px-tall navigation scrolls to Comunicação and the tab is reachable.
- Visual coherence: supplied desktop/mobile captures and a fresh 768px capture show the existing Helvetica Neue typography, restrained white/gray cards, blue selected states, 8-12px control radii, compact spacing, and the existing editor shell. No clipping, opaque/black compositing artifact, or CJK issue was observed.

### Why the outcome is not complete

The visible surface is coherent, but the editor lifecycle is not: the primary publish action silently discards the new configuration. The reminder summary also reports a false state for blank values, and one required control cannot be identified by assistive technology. These are user-visible functional/design-system failures, not architecture preferences.

## Direct remove-ai-slops / overfit pass

The current production diff and test were reviewed across all ten categories.

- No new broad catch, defensive validation layer, backend abstraction, parser/normalizer, network mock, dead helper, expensive algorithm, or fake-image implementation was found in the Communication feature.
- The `CommunicationChannel` union and local Set state are proportionate to the three channel controls; they are not speculative abstractions.
- The test exercises observable DOM behavior for SMS and live message/preview updates, so it is not tautological or purely implementation-mirroring.
- `ProdutosPage.test.tsx:24` is a requested-removal assertion (`Em desenvolvimento` absent). It is redundant slop when treated alone, but the same test also exercises replacement behavior, so this is a NOTE rather than an independent blocker.
- The test omits save/reopen persistence, blank/zero reminder semantics, and the post-event switch. Those omissions created false confidence and correspond directly to blockers C2, C1, and C4.
- `ProdutosPage.tsx` measures 4,397 pure LOC (4,476 physical lines), above the 250-LOC programming/remove-ai-slops threshold; HEAD already measured 2,195 pure LOC. The working-tree diff also includes large file-wide formatting churn (`3,118` insertions / `912` deletions) beyond the focused feature. This is maintenance/review burden, but no stated criterion requires a module split, so it is a non-blocking NOTE.
- Existing section-divider comments and the pre-existing `e as unknown as FormEvent` assertion at `ProdutosPage.tsx:3226` are programming-policy debt outside the semantic Communication change; they do not independently fail a stated criterion.

## Direct programming pass

- The new `CommunicationChannel` values are a strict literal union; no new `any`, enum, ignored type error, non-null assertion, error swallowing, async boundary, dependency, or backend-shaped error handling was introduced.
- React state mutation is handled by creating a new Set before updating state.
- The new UI uses semantic native controls and the existing Radix Switch, but the unnamed switch violates the local accessibility contract (blocker C4).
- Production state is not modeled as part of the product/form contract, which causes the save/reopen loss (blocker C2).
- Targeted ESLint and TypeScript checks pass; code quality gates do not compensate for the reproduced behavioral defects.

## Validation reproduced

- `npx prettier src/modules/produtos/ProdutosPage.tsx src/modules/produtos/ProdutosPage.test.tsx --check` — PASS.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test -- src/modules/produtos/ProdutosPage.test.tsx` — PASS, 1 file / 1 test.
- `npm run build` — PASS, Vite 6.3.5; non-blocking existing large-chunk warning (`index` 1,790.82 kB, gzip 425.05 kB).
- `npm run format:check` — FAIL before lint on four pre-existing untouched Obsidian files: `Retrilhar Intel/.obsidian/app.json`, `appearance.json`, `core-plugins.json`, and `graph.json`. This does not implicate the changed files.
- `git diff --check -- src/modules/produtos/ProdutosPage.tsx src/modules/produtos/ProdutosPage.test.tsx` — PASS.

## Checked artifact paths

- `src/modules/produtos/ProdutosPage.tsx`
- `src/modules/produtos/ProdutosPage.test.tsx`
- `DESIGN.md`
- `package.json`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/modules/agenda/components/AgendaPrototypeApp.tsx`
- `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`
- `src/components/ui/switch.tsx`
- `src/components/ui/button.tsx`
- user-supplied desktop screenshot: `/var/folders/k6/6m6xf58d2fz9l04_9nn953w00000gn/T/maestri-portal-8C01BE50-8067-4BBE-8067-6AC86B84E1F5.png` (visually inspected before the ephemeral file disappeared)
- user-supplied mobile screenshot: `/var/folders/k6/6m6xf58d2fz9l04_9nn953w00000gn/T/maestri-portal-A716F70A-15AD-44FF-AFF0-1295838BB45E.png` (visually inspected before the ephemeral file disappeared)
- fresh tablet screenshot: `/var/folders/k6/6m6xf58d2fz9l04_9nn953w00000gn/T/maestri-portal-7B73D42B-92D4-4857-AF0A-9014B0A03665.png`
- live portal: `http://127.0.0.1:5176/#produtos`
- evidence directory: `.omo/evidence/`

## Exact evidence gaps

- `omo ulw-loop status --json` returned `ULW_LOOP_PLAN_MISSING`; the required fallback report path is therefore used.
- No task-specific executor code-review report, manual-QA matrix, diff artifact, notepad path, or ulw evidence bundle was supplied or found. The current diff, source, tests, live UI, screenshots, repository design contract, and evidence directory were inspected directly, including programming and remove-ai-slops/overfit coverage. Missing report coverage is not an additional blocker.
- The review-work and visual-QA independent subagent surfaces are unavailable in this session. The five review perspectives and both visual charters were performed directly. This tooling gap is not a stated acceptance artifact and is not an additional blocker.
- The two user-supplied temporary screenshot files became unavailable on later `stat` after they had already been opened and inspected. Fresh live portal QA supplied current DOM and breakpoint evidence; no pixel-reference target was specified, so image-diff evidence is not applicable.
- Lighthouse/react-doctor/react-scan were not run because performance scores/render budgets are not stated success criteria for this focused Communication-tab review. The production build was reproduced.

## Final verdict

VERDICT: REVISE

The surface, responsive behavior, hash routing, mock-only boundary, and core live-preview interactions are good. Approval is blocked until save/reopen retains the local communication configuration, blank reminder values produce an accurate summary, and the post-event switch has an accessible name with regression coverage.
