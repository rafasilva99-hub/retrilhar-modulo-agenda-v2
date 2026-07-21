# F1 Plan Compliance Audit

## recommendation

REJECT

## blockers

1. `violatedCriterion`: `SC-4 / Affiliate domain invariant 8` — executable affiliate specs must implement the firm `Specdrivenafiliados.md` decisions, including the afiliação status set `Ativo`, `Inativo`, and `Desativado` only.
   `observation`: `ConfiguracoesPage.tsx` defines and visibly renders a fourth afiliação status, `Pendente`. This is not an accepted `A VALIDAR` exception; the source specification calls the three-value set a firm decision. The focused test and Todo 11 evidence explicitly lock the incorrect four-value taxonomy, so this is shipped behavior rather than an evidence-only wording issue.
   `evidencePointer`: `Specdrivenafiliados.md:24`; `.claude/rules/afiliados.md:23-24,54`; `.omo/plans/afiliados-front-plan.md:350-355`; `src/modules/afiliados/ConfiguracoesPage.tsx:86,135-136,148-149,1019-1028`; `src/modules/afiliados/ConfiguracoesPage.test.tsx:103-130`; `.omo/evidence/afiliados-front-plan/task-11-configuracoes.txt:134-155`.

2. `violatedCriterion`: `F1 every evidence file exists / Todo 13 QA evidence`.
   `observation`: the plan requires `.omo/evidence/afiliados-front-plan/task-13-integration-browser.md`, but that exact artifact is absent. The `task-13-browser/` JSON, screenshots, and gate report provide substantive replacement evidence, but they do not satisfy F1's explicit every-file-exists check.
   `evidencePointer`: `.omo/plans/afiliados-front-plan.md:297,301,321-322`; absent `.omo/evidence/afiliados-front-plan/task-13-integration-browser.md`; replacement artifacts under `.omo/evidence/afiliados-front-plan/task-13-browser/`.

## originalIntent

Complete a read-only F1 audit of `.omo/plans/afiliados-front-plan.md`: verify Todos 1-14, evidence, Must/Must-NOT rules, final handoff links, cleanup, route structure, and the documented `npm run check` legacy exception while leaving F1-F4 unchecked and changing no product, test, plan, ledger, or state file.

## desiredOutcome

- Todos 1-14 are checked and backed by every evidence artifact named by the plan.
- F1-F4 remain unchecked before this audit report is consumed.
- All Must and Must-NOT constraints are implemented, with exceptions only where explicitly accepted.
- The handoff contains six structurally correct direct hash links and cleanup proves the QA server/browser ports are released.
- Targeted affiliate/App tests pass.
- The 17-path repository check failure is accepted only if every residual path is unrelated legacy/baseline state and all current affiliate-plan gates are green.

## userOutcomeReview

Todos 1-14 are checked, the ledger contains 14 completion records, and F1-F4 remain unchecked. Every primary ledger artifact is present and non-empty. All specifically named task artifacts are present except the Todo 13 browser narrative named above.

The six handoff links use the actual QA port and exact hashes: `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, and `#ajuda`. Current routing source and `App.test.tsx` include all six direct routes and six preview routes. A live server was intentionally not required because cleanup stopped Vite; fresh `lsof` checks found ports 51654 and 51655 free. The final browser JSON records 12/12 direct desktop/mobile route checks, 6/6 interaction scenarios, and zero behavior failures. The six desktop route screenshots and the mobile Configurações screenshot were directly inspected and are nonblank/coherent.

The Must/Must-NOT checks are otherwise satisfied: Vite/React hash routing remains; mock-local fixtures/services remain the data source; no new backend, HTTP client, `fetch`, auth, Next.js, OpenAPI, service worker, icon dependency, dependency change, managed `src/components/ui/**` diff, visible `mock` copy, or blocked Home/Sala surface was found. The handoff has six links and cleanup is recorded.

The status taxonomy is not compliant. `Pendente` is rendered as an afiliação status despite the firm three-status domain decision. No accepted exception documents this divergence; the Todo 11 report incorrectly treats the four-value taxonomy as the desired result.

The known `npm run check` exception is acceptable for this audit. Fresh execution exits 1 at Prettier on exactly 17 paths. Sixteen are tracked and unchanged at HEAD; `Specdrivenafiliados.md` is untracked but was already recorded as untracked in the Todo 1 baseline. None is a current affiliate-plan output. Fresh scoped Prettier and ESLint over plan-created/modified affiliate, app, navigation, fixture, docs, and rules paths pass, and fresh typecheck passes. This accepted exception does not cure the two blockers above.

## commandResults

| command | exit | reproduced result |
| --- | ---: | --- |
| `npm run test -- --run src/app/App.test.tsx src/modules/afiliados` | 0 | 9 test files and 39 tests passed in 11.34s. |
| `npm run check` | 1 | Stops at Prettier on exactly 17 unrelated legacy/baseline paths. Exception accepted. |
| scoped current affiliate-plan `npx prettier ... --check` | 0 | All matched files use Prettier style. |
| scoped maintained affiliate-plan `npx eslint ... --max-warnings=0` | 0 | Zero errors and warnings. |
| `npm run typecheck` | 0 | `tsc --noEmit` completed without diagnostics. |
| `lsof` on ports 51654 and 51655 | no listener | Cleanup independently confirmed. |

## directProgrammingAndSlopReview

### remove-ai-slops / overfit pass

- Directly inspected the tracked diff, untracked affiliate services/components/types/tests, nine focused test files, and production source.
- Tests mostly assert observable routes, filters, dialogs, copy feedback, destination reassignment, disabled actions, and service outputs. No snapshots, output-derived expected values, fake integration layers, or production code created only to satisfy a deletion test were found.
- `AjudaPage.test.tsx:40` has a deletion-style negative terminology assertion coupled to runtime `.replace(...)` normalization in `AjudaPage.tsx:61-64`. This is brittle maintenance debt, not an additional stated-criterion blocker because rendered terminology is compliant.
- The page modules exceed the 250-pure-LOC programming threshold (`AfiliadosPage` 782, `ConfiguracoesPage` 1251, `GanhosPage` 377, `IndicacoesPage` 561, `ProdutosLinksPage` 340). Four pages duplicate a mobile shell DOM query/synthetic click. Several component aliases and clone helpers are single-use/pass-through. These are NOTES because the plan does not make the external skill's size/simplification thresholds success criteria.
- `ConfiguracoesPage.tsx:185` contains a catch-and-swallow clipboard path; this is a programming NOTE and does not establish an F1 criterion failure.

### programming pass

- No `any`, `as unknown`, ignored TypeScript diagnostic, new backend boundary, new dependency, or icon-package drift was found in affiliate-plan scope.
- Scoped lint, format, typecheck, and 39 tests are green.
- The status model is exhaustive over its local union but the union itself violates the firm domain contract by including `Pendente`; this is blocker 1.

### review report coverage

- `.omo/evidence/afiliados-front-plan-gate-review.md`, `.omo/evidence/afiliados-front-plan-task-13-gate-review.md`, and `.omo/evidence/afiliados-front-plan-todo-14-gate-review.md` explicitly contain programming and remove-ai-slops/overfit sections, including tautological, deletion-only, implementation-mirroring, excessive-test, normalization, and oversized-module coverage.
- Those reports were treated as untrusted historical evidence. This audit repeated the source/test/diff pass directly and found the status invariant failure that the Todo 11 report had misclassified.
- The dedicated final-wave `f2-code-quality.md` is correctly absent because F2 is not yet checked. No notepad path was supplied. The available evidence directory and reports were inspected before reaching the verdict.

## reviewLanes

| lane | result | basis |
| --- | --- | --- |
| Goal and constraints | FAIL | Firm afiliação status invariant violated; one exact evidence artifact missing. |
| Hands-on QA evidence | PASS with saved-artifact limitation | Current JSON/screenshots and targeted tests pass; no live server required because cleanup is intentional. |
| Code quality | PASS for F1 scope with notes | No additional criterion-level issue; oversized modules, duplicate shell effects, normalization, and swallowed clipboard error recorded as maintenance notes. |
| Security | PASS | Mock-local UI only; no network/auth/backend/dependency/secrets surface added. |
| Context mining | PASS | Plan, rules, specification, evidence, current source, and affiliate git history were checked; the firm status decision is explicit and not `A VALIDAR`. |

## checkedArtifactPaths

- `.omo/plans/afiliados-front-plan.md`
- `.omo/start-work/ledger.jsonl`
- `CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `.claude/rules/agenda-fidelity.md`, `.claude/rules/afiliados.md`, `Specdrivenafiliados.md`
- All Todo 1-14 primary evidence artifacts under `.omo/evidence/afiliados-front-plan/`, including task browser narratives, `task-13-browser/**`, `final-handoff.md`, `final-check.txt`, `task-14-gate-fix.txt`, `task-14-handback.md`, `final-cleanup.txt`, `final-browser.md`, `final-browser/results.json`, and the manual-QA matrix
- `.omo/evidence/afiliados-front-plan-gate-review.md`, `.omo/evidence/afiliados-front-plan-task-11-configuracoes-gate-review.md`, `.omo/evidence/afiliados-front-plan-task-13-gate-review.md`, `.omo/evidence/afiliados-front-plan-todo-14-gate-review.md`
- Current tracked diff, untracked affiliate source/tests, `src/app/App.test.tsx`, routing/navigation sources, all `src/modules/afiliados/**`, and `src/mocks/afiliados/index.ts`
- Seven final route screenshots directly inspected; all 29 final PNGs inventoried as non-empty

## exactEvidenceGaps

- Missing exact required artifact: `.omo/evidence/afiliados-front-plan/task-13-integration-browser.md`.
- No green aggregate `npm run check`; accepted only under the user-requested unrelated-legacy exception reproduced above.
- The final manual-QA matrix is stale about the original `.omo` formatting failure; newer `final-check.txt` and `task-14-gate-fix.txt` supersede it.
- No live server/browser replay was performed because Todo 14 cleanup intentionally stopped them and the user explicitly said not to require a live server.
- `omo ulw-loop status --json` is unavailable on PATH, so this required report uses the fallback/user-authorized path.
- F2-F4 reports are absent and their plan boxes remain unchecked, as expected before those independent final-wave audits.

## residualRisk

After the two blockers are fixed, residual risk is limited to the documented shared Breadcrumb/Sheet/Dialog console warnings, oversized affiliate pages, duplicated mobile shell-collapse effects, and stale wording in the manual-QA matrix. None is an additional F1 blocker under the stated plan criteria.
