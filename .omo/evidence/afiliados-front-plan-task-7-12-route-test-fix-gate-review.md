# Gate review: shared route-test fix

recommendation: APPROVE

blockers: []

## originalIntent

Independently verify the shared `#ganhos` route-test correction without changing product code or tests. The intended worker scope was limited to `src/app/App.test.tsx` and `.omo/evidence/afiliados-front-plan/task-7-12-route-test-fix.txt`.

## desiredOutcome

The route smoke test keeps all six affiliate hashes, uses current route-specific visible text for `#ganhos` (`Extrato de comissões`) rather than shared shell text, preserves agenda and fallback coverage, and passes the focused route command. The evidence receipt must be nonempty and contain status, changed files, command results, cleanup/risks, and a final evidence pointer.

## userOutcomeReview

Confirmed. `src/app/App.test.tsx` contains the six required affiliate route entries and maps `ganhos` to `Extrato de comissões`. The same string is the `GanhosPage.tsx` section heading and was not found in shared agenda/layout shell sources. The four agenda hashes and both unknown-route fallback tests remain. Fresh focused and aggregate Vitest runs pass.

## Success criteria

- S1 affiliate route coverage: PASS. Six hashes at `src/app/App.test.tsx:8-13`.
- S2 route-specific `#ganhos` assertion: PASS. `src/app/App.test.tsx:10` matches `src/modules/afiliados/GanhosPage.tsx:339`; obsolete `Extrato de comissoes` is absent from the test.
- S3 agenda/fallback preservation: PASS. Four agenda hashes at line 6; fallback scenarios at lines 55-73.
- S4 evidence completeness: PASS. Target evidence is 4,788 bytes/56 lines and includes command results, changed files, cleanup/risk notes, DONE status, and `EVIDENCE_RECORDED`.
- S5 focused command: PASS. Exit 0, 1 file and 4 tests passed, 8.11 seconds real time.
- S6 feasible aggregate command: PASS. Exit 0, 9 files and 34 tests passed, 14.45 seconds real time.
- S7 scoped Git state: PASS. ` M src/app/App.test.tsx` and `?? .omo/evidence/afiliados-front-plan/task-7-12-route-test-fix.txt`; `git diff --check` passed.

## Direct remove-ai-slops / programming review

The test table and one route-smoke loop directly cover the requested observable behavior. The change adds no production extraction, parsing, normalization, dependency, defensive branch, or abstraction. It is not a deletion-only/removal test, tautology, implementation-mirroring assertion, prose-prompt pin, or excessive duplicate test. Route-specific visible headings distinguish each destination; the earlier mutation receipt shows the smoke test fails when a route is mapped incorrectly. The test file has 60 nonblank/noncomment lines, below the 250 pure-LOC ceiling. No maintenance-burden or scope-drift finding violates a criterion.

## Checked artifact paths

- `src/app/App.test.tsx`
- `src/modules/afiliados/GanhosPage.tsx`
- `.omo/evidence/afiliados-front-plan/task-7-12-route-test-fix.txt`
- `.omo/evidence/afiliados-front-plan/task-4-route-smoke-red.txt`
- `.omo/evidence/afiliados-front-plan/task-4-route-smoke-green.txt`
- `.omo/plans/afiliados-front-plan.md`
- `.claude/rules/afiliados.md`
- `.claude/rules/agenda-fidelity.md`
- `CLAUDE.md`

## Command evidence

- `/usr/bin/time -p npm run test -- --run src/app/App.test.tsx`: exit 0; 1/1 file and 4/4 tests passed; real 8.11s.
- `/usr/bin/time -p npm run test -- --run src/app/App.test.tsx src/modules/afiliados`: exit 0; 9/9 files and 34/34 tests passed; real 14.45s.
- `git status --short -- src/app/App.test.tsx .omo/evidence/afiliados-front-plan/task-7-12-route-test-fix.txt`: exactly the two expected scoped paths.
- `git diff --check -- src/app/App.test.tsx`: exit 0.

## Evidence gaps and notes

- `omo ulw-loop status --json` could not run because `omo` is unavailable in the shell, so this report uses the documented `.omo/evidence/` fallback.
- No standalone code-review report, manual-QA matrix, or notepad path exists for this micro-fix in `.omo/evidence/afiliados-front-plan/`. Direct artifact inspection, the Task 4 RED/GREEN mutation receipts, and fresh command reproduction cover the stated criteria, so this is not a blocker.
- The target evidence records an earlier aggregate exit 1 caused by affiliate-test timeouts. The fresh aggregate run passed 34/34; this discrepancy suggests the earlier result was transient or environment-sensitive, but does not fail a stated criterion.
- Git cannot attribute individual edits inside an already-modified file. Current scoped status and prior evidence corroborate that the fix changed the obsolete unaccented string, but authorship cannot be independently proven from the worktree alone.
