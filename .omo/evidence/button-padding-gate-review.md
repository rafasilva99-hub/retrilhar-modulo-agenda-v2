# Follow-up Gate Review: ghost-button padding

- recommendation: APPROVE
- blockers: []

## originalIntent

After converting both actions to ghost buttons, set `Salvar rascunho` left padding to 8px and `Pré-visualizar` right padding to 8px while preserving each opposite side at 12px, button semantics, labels, and the preview icon.

## desiredOutcome

- Preview uses `pr-2 pl-3`, remains `type="button"`, and preserves its label and icon.
- Save draft uses `pl-2 pr-3`, remains `type="submit"`, and preserves its label.
- Neither target uses `px-3`.
- The product-flow test protects ghost styling, asymmetric padding, and absence of `px-3`.
- Targeted Vitest, typecheck, and targeted ESLint pass.

## userOutcomeReview

PASS. The current source and test exactly implement the requested asymmetric padding and preserved controls. All three validation claims were independently reproduced with exit code 0.

## criterionReview

- C1 preview right padding 8px and left padding 12px: PASS at `src/modules/produtos/NewProductFlow.tsx:521` (`pr-2 pl-3`).
- C2 save-draft left padding 8px and right padding 12px: PASS at `src/modules/produtos/NewProductFlow.tsx:528` (`pl-2 pr-3`).
- C3 remove `px-3` from both targets: PASS at lines 521 and 528; test rejects `px-3` at `ProdutosPage.test.tsx:29`.
- C4 preserve semantics and content: PASS; preview is `type="button"` with `ViewIcon` and label, save draft is `type="submit"` with label (`NewProductFlow.tsx:519-530`).
- C5 regression assertions: PASS at `ProdutosPage.test.tsx:25-32,126-135`; ghost classes and both asymmetric class pairs are asserted.
- C6 validations: PASS; Vitest 3/3, `tsc --noEmit`, and targeted ESLint all succeeded during this review.

## directProgrammingAndSlopPass

- No production extraction, parsing, normalization, defensive layer, dead code, or new abstraction was introduced for the padding change.
- The class assertions mirror the explicit class-level acceptance criteria, so they are appropriate for this narrow visual contract. They are not tautological, deletion-only, or derived from production output.
- `expectGhostButton` has two consumers and avoids duplicated checks; it is not a single-use helper.
- The padding checks sit in a test whose name primarily describes draft-badge weight. This is a maintainability NOTE, not a blocker, because no success criterion requires a separate test and the required assertions execute.
- Prior ghost-button gate reports explicitly contain programming and overfit/slop coverage; this review independently repeated that pass.

## checkedArtifactPaths

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/ProdutosPage.test.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/ghost-product-buttons-gate-review.md`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/new-product-flow-ghost-buttons-gate-review.md`
- Scoped Git diff and working-tree status.

## reproducedEvidence

- `npx vitest run src/modules/produtos/ProdutosPage.test.tsx`: PASS, 1 file / 3 tests.
- `npm run typecheck`: PASS (`tsc --noEmit`).
- `npx eslint src/modules/produtos/NewProductFlow.tsx src/modules/produtos/ProdutosPage.test.tsx --max-warnings=0 --report-unused-disable-directives`: PASS.

## exactEvidenceGaps

- `omo ulw-loop status --json` was unavailable because `omo` is not on PATH; the mandated fallback report path was used.
- No separate manual-QA matrix or notepad path was supplied. Neither is a stated criterion for this narrow source/test follow-up.
- `NewProductFlow.tsx` is untracked, so Git cannot show its baseline hunk; current source and the executable DOM test were inspected directly.
