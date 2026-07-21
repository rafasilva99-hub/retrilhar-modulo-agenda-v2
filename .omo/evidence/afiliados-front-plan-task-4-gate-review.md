# Todo 4 Gate Review After RED/GREEN Fix

- recommendation: APPROVE
- blockers: []
- originalIntent: Add direct hash-route smoke coverage for all six affiliate screens while preserving the existing agenda and unknown-hash fallback tests, with reproducible route-specific RED/GREEN evidence and no production-code edits.
- desiredOutcome: `src/app/App.test.tsx` proves `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, and `#ajuda` render their intended screens; agenda and fallback coverage remains; the RED evidence fails nonzero because the `produtosLinks` mapping/expectation is broken; the restored focused suite passes; GREEN evidence records changed files, adversarial classes, cleanup, task risk, DoneClaim details, and its final path.
- userOutcomeReview: Confirmed. The six affiliate routes each have a route-specific rendered-text observable, all pre-existing agenda/fallback tests remain unchanged, the corrected RED transcript is tied to a broken `produtosLinks` mapping rather than generic impossible text, and an independent GREEN run passed all four tests.

## Criterion review

- `T4-SIX-HASHES`: PASS — `src/app/App.test.tsx:7-14` lists all six required affiliate hashes and lines 41-53 render/assert each route.
- `T4-ROUTE-SPECIFIC`: PASS — each affiliate row has a distinct screen-specific observable; production routing maps each hash to its corresponding page at `src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-243`.
- `T4-PRESERVE-AGENDA`: PASS — `src/app/App.test.tsx:6,27-39` matches the `HEAD` version of the agenda test.
- `T4-PRESERVE-FALLBACK`: PASS — `src/app/App.test.tsx:55-74` matches the two fallback tests in `HEAD`.
- `T4-RED-NONZERO-PRODUTOSLINKS`: PASS — `.omo/evidence/afiliados-front-plan/task-4-route-smoke-red.txt:3-31` records changing only the `produtosLinks` row hash to `agenda`, exit 1, the product-links observable failing against agenda content, and the other three tests passing.
- `T4-GREEN`: PASS — `.omo/evidence/afiliados-front-plan/task-4-route-smoke-green.txt:3-18` records the exact focused command, exit 0, and 4/4 passing. Independent reproduction on 2026-07-20 also returned exit 0 with 1 file/4 tests passed in 7.44s.
- `T4-GREEN-METADATA`: PASS — changed files/final state are at lines 28-32, adversarial classes at 34-40, cleanup at 42, task risk at 43, and DoneClaim/final path at 45-49.
- `T4-WRITE-SET`: PASS — targeted status shows only `src/app/App.test.tsx` modified and the two required evidence files untracked; the tracked diff is 22 test-only insertions and no production file is changed.

## Direct programming and remove-ai-slops pass

- PASS — the assertions exercise observable hash and rendered-screen behavior. They are not tautological, implementation-mirroring, snapshot, deletion-only, requested-removal, or prose-prompt tests.
- PASS — the test table is a small reuse of the existing route-smoke pattern and introduces no production extraction, parsing, normalization, dependency, defensive layer, dead code, or scope drift.
- PASS — `src/app/App.test.tsx` measures 60 pure LOC, below the 250-LOC ceiling. `git diff --check -- src/app/App.test.tsx` passes.
- NOTE — one table-driven test performs six route iterations, so its first failure can stop later rows. This does not violate Todo 4, which explicitly asks that the source include all six routes and that the focused suite pass.

The previous Todo 4 gate report explicitly covered the `programming` and `remove-ai-slops` perspectives, including overfit/slop classes (tautology, implementation mirroring, deletion/removal tests, and unnecessary production abstractions). That report was rechecked directly here; report coverage was not used as a substitute for this pass.

## Checked artifact paths

- `.omo/plans/afiliados-front-plan.md:154`
- `src/app/App.test.tsx:1`
- `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8`
- `src/modules/agenda/components/AgendaPrototypeApp.tsx:154`
- `.omo/evidence/afiliados-front-plan/task-4-route-smoke-red.txt:1`
- `.omo/evidence/afiliados-front-plan/task-4-route-smoke-green.txt:1`
- `.omo/evidence/afiliados-front-plan-task-4-gate-review.md` (pre-fix report read before replacement)
- `.omo/start-work/ledger.jsonl`
- `.omo/boulder.json`
- Live `git status --short`, targeted `git diff`, `git diff --check`, `HEAD` test readback, route/source cross-reference search, evidence-directory listing, and independent focused Vitest run.

## Exact evidence gaps and uncertainty

- The RED transcript was not re-created live because doing so would require a temporary test mutation and the verifier was instructed not to edit files. Its command, mutation, nonzero result, assertion text, source line, and companion-test counts are internally consistent with the inspected current test and production route mapping.
- Todo 4's plan text names temporary removal of `produtosLinks`; the post-fix verification brief specifically accepts a failure caused by a broken `produtosLinks` mapping/expectation. This review applies the later, explicit post-fix criterion.
- No separate manual-QA matrix or notepad artifact was found. Neither is a stated Todo 4 acceptance artifact, so their absence is not a blocker.
- `omo ulw-loop status --json` could not run because `omo` is not installed/on `PATH`; therefore the required fallback report path `.omo/evidence/afiliados-front-plan-task-4-gate-review.md` was used.
