# Final Gate Review: new-product exit confirmation targeted regression

- recommendation: APPROVE
- userVerdict: PASS
- reviewType: TARGETED REGRESSION REVIEW (read-only)
- reviewedAt: 2026-08-19

## blockers

None.

## originalIntent

Closing a pristine new-product form should return directly to the products list. Closing after any user-editable field or toggle changes, including changing the product schedule/contract mode from `Sob demanda` to `Apenas com evento`, must show the unsaved-draft confirmation.

## desiredOutcome

The prior C2 regression is fixed: `productContractMode` participates in the unsaved-change decision and changing only that selector opens `Sair sem salvar rascunho?`, without regressing the existing close-confirmation behavior.

## userOutcomeReview

PASS. `hasUnsavedNewProductChanges` now includes `productContractMode !== "onDemand"`, matching the pristine initial default, and `productContractMode` is present in the `useMemo` dependency list. `requestClose` therefore observes the selector-only change and opens the existing confirmation dialog. The new test performs the user-visible sequence (open new product, choose `Apenas com evento`, click `Fechar`, observe the dialog), and the focused suite passes 17/17. The supplied browser artifact visibly shows the expected dialog after the scenario.

## criterionReview

- C1_UNTOUCHED_CLOSES_DIRECTLY: PASS. The added comparison is false for the pristine `onDemand` default; the existing direct-close test remains green.
- C2_ANY_FIELD_OR_TOGGLE_REQUIRES_CONFIRMATION: PASS. The exact previously omitted `productContractMode` state is now in the predicate and dependency list, and the selector-only regression test passes.
- C3_DISCARD_CLEARS_DRAFT: PASS. Existing focused coverage remains green; this targeted change does not alter discard handling.
- C4_SAVE_AND_EXIT_PRESERVES_DRAFT: PASS. Existing focused coverage remains green; this targeted change does not alter save-and-exit handling.
- C5_EXISTING_DIALOG_STYLE: PASS. No dialog implementation or styling changed; the browser screenshot shows the existing dialog.

## directRemoveAiSlopsPass

- Production diff: minimal one-predicate/one-dependency correction; no extraction, parser, normalization, compatibility shim, dead code, needless abstraction, duplication, or scope drift introduced.
- Test: asserts observable UI behavior through real controls. It is not deletion-only, tautological, implementation-mirroring, or a test that merely verifies requested removal. It would fail under the exact prior defect.
- Excessive/useless-test check: one narrow regression test protects one previously failing behavioral class; no redundant assertions or production internals are pinned.
- Oversized source/test modules remain a non-blocking note because module size is not a stated success criterion for this targeted revision.

## programmingPerspective

- The state comparison uses the typed `ProductContractMode` value and its existing canonical default; no `any`, suppression, unsafe cast, new API, or new dependency was introduced.
- Memo dependency correctness is restored, avoiding a stale dirty-state value after changing the selector.
- The test uses existing integration-style helpers and asserts the user-visible outcome rather than implementation state.

## reportCoverageReview

The previous gate report explicitly contained both `directRemoveAiSlopsPass` and `programmingPerspective` sections and identified the exact missing toggle-only coverage. This direct re-review independently repeated those checks. The browser QA JSON and screenshot cover the corrected selector-only scenario. No separate new code-review report or formal manual QA matrix was supplied; this is an evidence gap but not a stated success-criterion failure.

## checkedArtifactPaths

- `src/modules/produtos/NewProductFlow.tsx`
- `src/modules/produtos/ProdutosPage.test.tsx`
- `.omo/evidence/new-product-exit-confirmation-gate-review.md` (prior REJECT contents inspected before replacement)
- `.omo/evidence/new-product-exit-confirmation-qa/contract-mode-qa-report.json`
- `.omo/evidence/new-product-exit-confirmation-qa/04-contract-mode-change-confirmation.png`

## reproducedEvidence

- `npx vitest run src/modules/produtos/ProdutosPage.test.tsx`: PASS, 1 file, 17/17 tests, 24.92 s.
- `npx prettier --check src/modules/produtos/NewProductFlow.tsx src/modules/produtos/ProdutosPage.test.tsx`: PASS.
- `npx eslint src/modules/produtos/NewProductFlow.tsx src/modules/produtos/ProdutosPage.test.tsx`: PASS, exit 0 with no findings.
- `npm run typecheck`: PASS (`tsc --noEmit`, exit 0).
- LSP diagnostics: unavailable because the TypeScript LSP is not installed and installation was previously declined; project typecheck provides the reproduced compiler evidence.
- Visual inspection: `04-contract-mode-change-confirmation.png` is readable at 1440x1000 and shows `Sair sem salvar rascunho?` with all three expected actions.

## exactEvidenceGaps

- No active ULW loop/status payload was returned, so the required fallback evidence path was used.
- No notepad path was supplied or discovered for this targeted revision.
- No standalone new code-review report or formal manual QA matrix was supplied; direct review plus the scenario JSON/screenshot provide the needed completion evidence.
- The production file is untracked in the current worktree, so Git cannot isolate this two-line revision as a conventional tracked diff; the prior gate artifact and current source establish the before/after defect and correction.
