# Todo 12 Ajuda Gate Review

- recommendation: REJECT
- originalIntent: Independently verify Todo 12 after the worker DoneClaim, without changing product code or tests. The `#ajuda` screen must reuse existing FAQ data, use shared primitives where useful, provide FAQ search hit and no-result behavior, retain category cards, expose accessible close/back navigation to `#afiliados`, and keep the support CTA inert and local. It must not add real support integrations, mailto, chat SDKs, backend/network/auth/Next behavior, or visible fake/mock/test labels.
- desiredOutcome: `src/modules/afiliados/AjudaPage.tsx` and focused tests satisfy the behavior and guardrails; task evidence and a browser artifact or documented browser blocker are nonempty and auditable; the evidence records commands/results, changed files, adversarial classes, cleanup/risk, DoneClaim status/details, and its final evidence path.
- userOutcomeReview: The shipped product/test artifacts satisfy the requested Ajuda behavior and current executable checks pass. The gate is rejected only because the required evidence metadata is incomplete: the main task evidence does not record its own final evidence path.

## Blockers

1. violatedCriterion: `T12-EVIDENCE-FINAL-PATH`
   - observation: `.omo/evidence/afiliados-front-plan/task-12-ajuda.txt` is nonempty and contains commands/results, changed files, adversarial scan, cleanup/risk, and DoneClaim status-equivalent details, but it never records the final evidence path required by the verifier brief.
   - evidencePointer: `.omo/evidence/afiliados-front-plan/task-12-ajuda.txt:1-93`; fresh `rg -n -i 'final evidence path|final artifact|evidence-file|artefato final|caminho.*evid' .omo/evidence/afiliados-front-plan/task-12-ajuda.txt` exited 1 with no matches.
   - requiredFix: Append an explicit line such as `Final evidence path: .omo/evidence/afiliados-front-plan/task-12-ajuda.txt` (optionally the established `EVIDENCE_RECORDED:` marker), then read it back.

## Criterion review

- `T12-FAQ-DATA`: PASS. `AjudaPage.tsx:21,80-85,214-225` imports and filters `affiliateFaqItems`; no replacement FAQ array was introduced.
- `T12-SEARCH-HIT`: PASS. `AjudaPage.test.tsx:12-27` searches `comissões`, verifies the intended FAQ trigger, expands it, and observes answer content.
- `T12-NO-RESULT`: PASS. `AjudaPage.test.tsx:43-56` searches `semresultadozz` and observes the shared `AffiliateEmptyState` heading and guidance.
- `T12-CATEGORIES-PRIMITIVES`: PASS. `AjudaPage.tsx:37-59,169-194` renders three category cards with existing `Card` primitives; `AjudaPage.tsx:23,205-212` uses the shared affiliate empty state.
- `T12-NAVIGATION`: PASS. `AjudaPage.tsx:94-103` provides an accessible mobile back control and `AjudaPage.tsx:127-136` provides the visible Fechar control; `AjudaPage.test.tsx:58-68` observes both changing the hash to `#afiliados`. Fresh `src/app/App.test.tsx` route smoke also passed.
- `T12-INERT-CTA`: PASS. `AjudaPage.tsx:229-243` renders a `type="button"` CTA with no handler, link, mailto, SDK, or network behavior.
- `T12-GUARDRAILS`: PASS. The exact requested grep matched only `AjudaPage.tsx:21`, the internal fixture import path `@/mocks/afiliados`. It is not rendered UI copy. No `fetch(`, axios, mailto, or fake usage exists in the page; no auth/backend/Next/support integration was added.
- `T12-SCOPE`: PASS with attribution limitation. Targeted status contains only the page, its focused test, and the two task evidence files. Other dirty affiliate screens have their own parallel task evidence. Because the work is uncommitted, Git cannot causally attribute every dirty file to a worker, but no inspected artifact contradicts the Todo 12 write-set claim.
- `T12-BROWSER-EVIDENCE`: PASS as a documented blocker. `task-12-ajuda-browser.md:24-51` explicitly records that real browser interaction and screenshots were unavailable, lists the binary/CDP probes and results, and does not claim browser success. The verifier brief expressly allows a documented browser blocker.
- `T12-EVIDENCE-CONTENT`: PARTIAL. All required sections are present except the explicit final evidence path; this is the sole blocker above.

## Direct remove-ai-slops and programming pass

- No excessive test inventory, tautological computed expectations, implementation-mirroring mocks, dead code, broad catch, type escape hatch, backend boundary violation, or performance concern was found.
- Nonblocking slop note: `formatFaqAnswer` is a single-use, exact-string normalization helper introduced solely to replace forbidden visible terminology while leaving the shared fixture unchanged. It is fragile maintenance-wise, but it currently enforces the stated UI terminology and does not violate a Todo 12 criterion.
- Nonblocking test note: `uses afiliação terminology in FAQ answers` is a requested-removal/copy test, and the navigation test combines two separate actions. These provide weaker confidence than the behavior-focused hit/no-result tests, but no stated criterion forbids them and the required behavior remains independently covered.
- Nonblocking comment note: numbered section-divider comments restate the component structure and are removable slop, but do not violate a success criterion.
- Pure LOC is 221 for `AjudaPage.tsx` and 53 for its test. The production page is in the 200-250 warning band but below the 250-LOC defect ceiling; this low-risk task does not require an architectural split.
- Props/types use the existing typed HugeIcons contract; no `any`, assertions, non-null assertions, `@ts-ignore`, catch blocks, mutable exported state, default export, or new dependency appears.

## Code-review coverage

No separate Todo 12 executor code-review report, manual-QA matrix, or notepad path was found. This gate directly applied goal, QA, code-quality, security, repository-context, programming, and remove-ai-slops perspectives, including deletion-only/requested-removal, tautology, implementation-mirroring, excessive-test, and unnecessary extraction/parsing/normalization checks. Their absence is not an additional blocker because Todo 12 does not require those separate artifacts and direct review supports the product criteria.

## Fresh command evidence

- `npm run test -- --run src/modules/afiliados/AjudaPage.test.tsx`: exit 0; 1 file and 4 tests passed.
- `npm run test -- --run src/app/App.test.tsx`: exit 0; 1 file and 4 tests passed, including direct `#ajuda` route smoke.
- `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`: exit 0; 9 files and 34 tests passed. This supersedes the worker artifact's earlier concurrent-failure snapshot.
- `npm run typecheck`: exit 0.
- `npx eslint src/modules/afiliados/AjudaPage.tsx src/modules/afiliados/AjudaPage.test.tsx --max-warnings=0 --report-unused-disable-directives`: exit 0.
- `npx prettier --check src/modules/afiliados/AjudaPage.tsx src/modules/afiliados/AjudaPage.test.tsx`: exit 0.
- `npm run build`: exit 0; Vite transformed 2092 modules and produced the production bundle, with only the existing large-chunk warning.
- `rg -n 'fetch\\(|axios|mailto|mock|fake' src/modules/afiliados/AjudaPage.tsx`: exit 0 with one implementation-only fixture-path match at line 21.

## Security perspective

PASS. The screen consumes static local data and writes only the local hash. There are no external URLs, mailto handlers, dynamic HTML injection, network calls, auth behavior, secrets, new dependencies, or support integrations in the scoped diff.

## Checked artifact paths

- `.omo/plans/afiliados-front-plan.md` Todo 12, lines 274-288.
- `AGENTS.md`, `CLAUDE.md`, `.claude/rules/agenda-fidelity.md`, and `.claude/rules/afiliados.md`.
- `src/modules/afiliados/AjudaPage.tsx` and `src/modules/afiliados/AjudaPage.test.tsx`.
- `src/mocks/afiliados/index.ts` FAQ fixture range.
- `src/modules/afiliados/components/index.ts` and the shared empty-state export.
- `src/app/App.test.tsx` and `src/modules/agenda/components/AgendaPrototypeApp.tsx` route wiring.
- `.omo/evidence/afiliados-front-plan/task-12-ajuda.txt` and `.omo/evidence/afiliados-front-plan/task-12-ajuda-browser.md`.
- `.omo/evidence/afiliados-front-plan/task-1-baseline.txt`, current targeted/full Git status, tracked page diff, `.omo/boulder.json`, and `.omo/start-work/ledger.jsonl`.

## Exact evidence gaps

- `omo ulw-loop status --json` is unavailable (`zsh: command not found: omo`), so the documented fallback `.omo/evidence/` path is used.
- The main Todo 12 evidence omits its explicit final evidence path; this is the blocking gap.
- No real-browser screenshot or interaction log exists. The browser artifact documents the unavailable browser tooling and probes, which the verifier brief permits as a blocker record.
- No separate Todo 12 executor code-review report, manual-QA matrix, or notepad path exists; direct gate coverage makes these nonblocking for Todo 12.
- The worker evidence's combined-suite/typecheck/build failures are historical snapshots from concurrent work. Fresh runs now pass, so they are stale but conservative rather than false-positive success claims.

## Uncertainty

- No browser-capable tool or screenshot artifact was available, so visual layout and real viewport interaction were not independently observed.
- Uncommitted parallel changes prevent perfect causal attribution of every dirty file. Task-specific evidence and targeted status are consistent with the claimed Ajuda-only write set.
