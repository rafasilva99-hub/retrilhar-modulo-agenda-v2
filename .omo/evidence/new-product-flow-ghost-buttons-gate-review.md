# Follow-up Gate Review: corrected ghost-button coverage

- recommendation: APPROVE
- blockers: []
- user verdict: PASS

## originalIntent

Correct the previously inadequate regression coverage so `expectGhostButton` explicitly protects the transparent border/background and ghost hover applied to `Pré-visualizar` and `Salvar rascunho`.

## desiredOutcome

The helper asserts `border-transparent`, `bg-transparent`, and `hover:bg-[#f8fafc]`, while rejecting `border-[#e9eaeb]` and `bg-white`; both target buttons use the corresponding ghost classes; targeted tests, typecheck, and lint pass.

## userOutcomeReview

PASS. Direct inspection confirms all five required helper assertions and confirms both target buttons use `border border-transparent bg-transparent` with `hover:bg-[#f8fafc]`. The requested targeted Vitest run passed 3/3, TypeScript typecheck exited successfully, and targeted ESLint exited successfully.

## criterionReview

- C1: `expectGhostButton` positively asserts `border-transparent`, `bg-transparent`, and `hover:bg-[#f8fafc]`: PASS (`src/modules/produtos/ProdutosPage.test.tsx:25-28`).
- C2: `expectGhostButton` rejects `border-[#e9eaeb]` and `bg-white`: PASS (`src/modules/produtos/ProdutosPage.test.tsx:29-30`).
- C3: `Pré-visualizar` and `Salvar rascunho` use transparent border/background and ghost hover: PASS (`src/modules/produtos/NewProductFlow.tsx:519-530`).
- C4: targeted regression test passes 3/3: PASS, independently reproduced.
- C5: project typecheck and targeted ESLint pass: PASS, independently reproduced.

## directProgrammingAndSlopPass

- The corrected positive assertions close the exact false-confidence gap from the prior review: deleting either transparent class now fails the helper.
- The helper has two consumers and avoids duplicated assertion blocks; no unnecessary production extraction, parsing, normalization, defensive logic, or scope drift was introduced.
- The assertions intentionally inspect utility classes because the stated criterion is a class-level visual contract; they are not tautological, deletion-only, or expected values derived from production output.
- The ghost checks remain inside a test named for draft-badge weight. This is a maintainability NOTE, not a blocker, because no stated criterion requires a dedicated test case and the required behavior is now explicitly protected.
- Existing oversized-file concerns are outside this follow-up criterion and do not block approval.
- The prior gate report explicitly included programming and overfit/slop coverage. This follow-up independently repeated that pass; report coverage was not treated as proof.

## checkedArtifactPaths

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/ProdutosPage.test.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/new-product-flow-ghost-buttons-gate-review.md` (prior report inspected before replacement)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/ghost-product-buttons-gate-review.md`
- repository scoped diff and working-tree status

## reproducedEvidence

- `npx vitest run src/modules/produtos/ProdutosPage.test.tsx`: PASS, 1 file and 3 tests.
- `npm run typecheck`: PASS (`tsc --noEmit`, exit 0).
- `npx eslint src/modules/produtos/ProdutosPage.test.tsx src/modules/produtos/NewProductFlow.tsx`: PASS, exit 0.

## exactEvidenceGaps

- `omo ulw-loop status --json` was unavailable because `omo` is not on PATH; the mandated fallback report path was used.
- No separate manual-QA matrix or notepad path was supplied for this narrow follow-up. They are not stated success criteria; direct source inspection and executable checks cover the requested outcome.
- No browser screenshot was rerun because this follow-up specifically gates corrected class assertions, and no stated criterion requires visual evidence.
