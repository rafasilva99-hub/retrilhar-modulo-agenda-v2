# F2 Affiliate Plan Final Code Quality Re-audit

- Date: 2026-07-20
- Workspace: `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2`
- Reviewed HEAD: `9bed5f07d53ef46c6efd68fa80c7dc69d0b85fbd`
- Goal: re-audit the current affiliate-plan diff after `f4-scope-fix`,
  `f2-period-filter-fix`, and the React warning fixes; confirm the prior F2 blockers are
  resolved and inspect the ignore/config changes.
- Review mode: read-only product audit; this report is the only artifact written.
- Attempt resolution: `omo ulw-loop status --json` exited 127 because `omo` is unavailable
  on PATH. The required fallback report path is therefore used. No notepad artifact exists
  under `.omo`.

## Verdict

- codeQualityStatus: **WATCH**
- recommendation: **APPROVE**
- blockers: **None**
- reportPath: `.omo/evidence/afiliados-front-plan-code-review.md`

The three previous F2 blockers are resolved in current observable behavior:

1. Configurações renders exactly `Ativo`, `Inativo`, and `Desativado`; `Pendente`
   is not visible.
2. Indicações and Ganhos now constrain displayed rows when only the period selector changes,
   with isolated tests for that behavior.
3. Ajuda no longer renders `vínculo`, including the link-expiration FAQ.

The breadcrumb/Sheet warning fixes are structurally correct and covered by focused regression
tests. The `.omo` Prettier/ESLint ignores are bounded to workflow state/evidence and do not
hide maintained source.

## Skill-perspective check

The complete `omo:remove-ai-slops` and `omo:programming` skills plus the TypeScript reference
were loaded and applied before judging test relevance and maintainability.

- **remove-ai-slops:** no blocking overfit/slop failure remains. The period tests isolate one
  user action and assert observable row changes; the warning tests exercise real DOM/ref
  behavior; the status and terminology tests include positive domain outcomes rather than
  only asserting deletion. No tautological or output-derived expected value was found.
  The diff still violates this perspective at MEDIUM through render-time copy normalization,
  oversized screens, duplicated shell manipulation, and duplicate fixture/service helpers.
- **programming:** no blocking type escape hatch, prompt/prose test, untyped production
  boundary, backend parser, or HTTP coupling was found. The diff still violates this
  perspective at MEDIUM because the internal affiliation union permits an unsupported state,
  several changed modules exceed the 250-pure-LOC ceiling, and date filtering is implemented
  inside page components instead of the typed service filter seam.
- **review-work:** its five-agent fan-out could not run because this session exposes no
  subagent tool surface. The same lanes were performed directly: goal/constraint trace,
  hands-on command QA, code/slop review, security/scope scan, and repository-context review.

## Findings

### CRITICAL

None.

### HIGH

None.

### MEDIUM

1. **The internal affiliation type still permits the rejected `Pendente` state and cannot
   represent `Desativado`.** `AffiliateAffiliation.status` remains
   `"Ativa" | "Pendente" | "Inativa"` in
   `src/mocks/afiliados/index.ts:1422-1425`. The UI adapter in
   `src/modules/afiliados/ConfiguracoesPage.tsx:142-153` silently drops `Pendente`, while
   `Desativado` exists only in the visible legend. Current fixtures are all active, so this
   does not break today's UI or reopen the prior blocker, but it keeps an illegal state
   representable and could silently omit a future fixture row.

2. **Ajuda meets the visible-copy rule through page-local normalization instead of correcting
   its mock source.** `formatFaqAnswer` performs seven replacements in
   `src/modules/afiliados/AjudaPage.tsx:61-72`, while the source strings still contain the
   forbidden term at `src/mocks/afiliados/index.ts:1472-1487`. Search filters the raw answer
   before formatting (`AjudaPage.tsx:86-93`), so text that users can read is not necessarily
   text they can search. This is needless production normalization under the slop/programming
   perspectives; it is non-blocking because every rendered FAQ currently passes the guardrail.

3. **The affiliate screens retain substantial structural debt.** Pure LOC is 1,240 for
   `ConfiguracoesPage.tsx`, 792 for `AfiliadosPage.tsx`, 597 for
   `IndicacoesPage.tsx`, 410 for `GanhosPage.tsx`, and 340 for
   `ProdutosLinksPage.tsx`. Four pages also duplicate the shell DOM query/click at
   `AfiliadosPage.tsx:760-763`, `IndicacoesPage.tsx:414-421`,
   `GanhosPage.tsx:230-238`, and `ProdutosLinksPage.tsx:241-248`. This does not invalidate
   the focused fixes, but it exceeds both loaded skills' size ceiling and couples feature
   screens to a Portuguese shell title.

4. **The new service boundary is not yet the single filtering seam.**
   `src/modules/afiliados/services/afiliados-mock-service.ts:81-156` duplicates referral and
   commission helper behavior still present in `src/mocks/afiliados/index.ts:756-810` and
   `:1121-1143`. The period predicates were then added page-locally at
   `IndicacoesPage.tsx:124-160,423-434` and `GanhosPage.tsx:79-108,251-256`, while
   `ReferralFilters` and `CommissionFilters` still omit period
   (`src/modules/afiliados/types.ts:34-46`). Current behavior is correct, but this split
   ownership is a concrete drift risk.

### LOW

1. `latestReferralDate()` scans the full fixture once per referral in
   `IndicacoesPage.tsx:136-160`; hoisting the reference date would avoid the repeated
   computation. The fixture is small, so this is not a practical performance blocker.

2. `AffiliatePreviewFrame` uses `as CSSProperties` for a custom CSS property in
   `src/modules/agenda/components/AgendaPrototypeApp.tsx:83-85`. It is localized and outside
   the affiliate blocker fixes, but remains a TypeScript escape hatch.

## Prior blocker verification

### Unsupported status

- Source taxonomy: `["Ativo", "Inativo", "Desativado"]` at
  `ConfiguracoesPage.tsx:86`.
- Render path uses that taxonomy at `ConfiguracoesPage.tsx:1022-1033`.
- Focused test asserts the exact three visible labels and no visible pending state at
  `ConfiguracoesPage.test.tsx:103-131`.
- Historical runtime evidence records the same three labels at 375, 768, and 1280 widths:
  `.omo/evidence/afiliados-front-plan/f4-scope-fix.txt`.

### Period-filtered rows

- Indicações filters on `purchaseDate` before organization/search/origin/tab filters at
  `IndicacoesPage.tsx:423-434`.
- Ganhos filters on `dataGeracao` before organization/search/tab filters at
  `GanhosPage.tsx:251-256`.
- The tests change only the period selector and assert a June row is removed/restored:
  `IndicacoesPage.test.tsx:40-51` and `GanhosPage.test.tsx:40-50`.
- Historical live-DOM evidence is in
  `.omo/evidence/afiliados-front-plan/f2-period-filter-fix.txt`.

### Visible terminology

- FAQ rendering always passes answers through `formatFaqAnswer` at
  `AjudaPage.tsx:222-231`.
- Tests cover both the multiple-organization and link-expiration answers at
  `AjudaPage.test.tsx:29-57`.
- Historical three-width runtime evidence reports no visible legacy relationship term in
  `.omo/evidence/afiliados-front-plan/f4-scope-fix.txt`.

### React warnings and config

- Breadcrumb separators are direct list siblings via keyed `Fragment` in
  `src/components/layout/app-page.tsx:25-50`.
- `SheetOverlay` forwards the Radix ref in `src/components/ui/sheet.tsx:27-42`.
- The affiliate detail Sheet has an accessible description at
  `src/modules/afiliados/AfiliadosPage.tsx:399-403`.
- Focused warning tests are behaviorally relevant and passed:
  `src/components/layout/app-page.test.tsx` and `src/components/ui/sheet.test.tsx`.
- `.prettierignore:6` and `eslint.config.js:18-25` ignore only `.omo`; maintained
  product, test, config, and documentation paths remain in their respective checks.

## Evidence checked

- Current full tracked diff, untracked affiliate source/tests/components/services/types,
  targeted `git status --short`, `git diff --numstat`, and `git diff --check`.
- `CLAUDE.md`, `AGENTS.md`, `.claude/rules/afiliados.md`, `DESIGN.md`,
  `Specdrivenafiliados.md`, and `.omo/plans/afiliados-front-plan.md`.
- Current production and tests for all `src/modules/afiliados/**`, routing/navigation
  changes, warning fixes, `.prettierignore`, and `eslint.config.js`.
- Historical evidence treated as untrusted and cross-checked against current source:
  `.omo/evidence/afiliados-front-plan/f4-scope-fix.txt`,
  `.omo/evidence/afiliados-front-plan/f2-period-filter-fix.txt`, and
  `.omo/evidence/afiliados-front-plan/f3-console-warning-fix.txt`.
- No notepad path was supplied or found.

## Command results

- `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`: **PASS**,
  9 files and 43 tests.
- `npm run typecheck`: **PASS**, `tsc --noEmit` emitted no diagnostics.
- `npm run test -- --run src/components/layout/app-page.test.tsx
  src/components/ui/sheet.test.tsx src/modules/afiliados/AfiliadosPage.test.tsx`:
  **PASS**, 3 files and 4 tests, with no warning output.
- Scoped ESLint over affiliate, routing, warning, mock, and config files:
  **PASS**, zero errors/warnings.
- Scoped Prettier over affiliate, routing, warning, mock, rules, and design files:
  **PASS**. The first invocation incorrectly included `.prettierignore` as a parse target
  and exited 2; the corrected scoped invocation passed.
- `npm run build`: **PASS**, 2,092 modules transformed; existing >500 kB chunk advisory.
- `git diff --check`: **PASS**.
- Scoped backend/type-escape grep: **PASS**, no `fetch`, Axios, XHR, `any`,
  `as unknown`, or ignored TypeScript diagnostic in maintained affiliate/warning scope.
- Scoped terminology grep: expected internal matches only—mock service identifiers,
  commission `pendentes`, the non-affiliate `Trocar empresa` branch, compatibility
  `Pendente` handling, formatter inputs, and negative test assertions. No prohibited
  visible affiliate copy remains.
- `npm run check`: **FAIL** at `format:check` on 17 paths. Sixteen are tracked and
  unchanged in the current worktree; `Specdrivenafiliados.md` is an untracked baseline
  specification. None is hidden by the new `.omo` ignores or belongs to the maintained
  affiliate source/test scope. This remains a repository-level risk, not an F2 blocker.

## Residual risk

- The literal plan success criterion `npm run check` is still red on unrelated baseline
  formatting paths, although every scoped affiliate gate and the production build pass.
- Runtime FAQ normalization and the legacy status union can drift from future fixture changes.
- Large page modules and duplicated shell manipulation make later changes riskier than the
  focused green tests imply.
- Browser behavior was not replayed live in this audit. Current source/tests were verified
  fresh; the existing period, scope, and warning browser artifacts were inspected and contain
  concrete DOM/console observables.
