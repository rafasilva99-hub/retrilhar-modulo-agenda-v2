# Gate Review: NewProductFlow ghost buttons

recommendation: APPROVE

blockers: []

## originalIntent

Change the `Pré-visualizar` and `Salvar rascunho` controls in `NewProductFlow` from white, visibly bordered buttons to transparent ghost buttons without changing their labels, sizing, typography, text styling, preview icon, hover background, or the preview button's responsive visibility.

## desiredOutcome

- Neither button uses `border-[#e9eaeb]` or `bg-white`.
- Both buttons render with a transparent border/background and retain `h-9`, `rounded-lg`, `px-3`, Helvetica Neue Regular, `text-sm`, `text-[#414651]`, and `hover:bg-[#f8fafc]`.
- `Pré-visualizar` retains its icon and remains hidden below the `md` breakpoint via `hidden ... md:flex`.
- `Salvar rascunho` retains its label and submit behavior.

## userOutcomeReview

PASS. Direct source inspection confirms both requested controls have `border-transparent bg-transparent`, do not contain the removed visible-border/white-background classes, and retain all requested layout, typography, label, icon, hover, and responsive classes. The targeted component test passes and finds both buttons through their accessible labels.

No fresh browser screenshot was supplied for this specific class change. This is an evidence gap, but the review was explicitly visual/source QA and no stated success criterion requires a screenshot; the source and executable DOM test directly support completion.

## checkedArtifacts

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx` lines 519-530
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/ProdutosPage.test.tsx` lines 25-29 and 114-124
- `git status --short`
- `git diff -- src/modules/produtos/NewProductFlow.tsx src/modules/produtos/ProdutosPage.test.tsx`
- `.omo/evidence/` inventory, including existing `new-product-flow` visual evidence
- Command: `npx vitest run src/modules/produtos/ProdutosPage.test.tsx` -> PASS, 1 file / 3 tests
- Command: `npx eslint src/modules/produtos/NewProductFlow.tsx src/modules/produtos/ProdutosPage.test.tsx --max-warnings=0 --report-unused-disable-directives` -> PASS
- Command: `npm run typecheck` -> PASS

## criterionReview

- C1 remove visible border/background classes: PASS at `NewProductFlow.tsx:521,528`.
- C2 transparent ghost styling: PASS via `border-transparent bg-transparent` at the same lines.
- C3 preserve sizing, radius, padding, font, text color, labels, icon, and hover: PASS at `NewProductFlow.tsx:521-530`.
- C4 preview remains hidden until `md:flex`: PASS at `NewProductFlow.tsx:521`.
- C5 regression validation: PASS; targeted Vitest reproduced 3/3 green.

## slopAndProgrammingReview

Direct pass completed over the scoped production lines and test additions.

- No unnecessary production extraction, parsing, normalization, defensive logic, dead code, comments, or abstraction was introduced by this button-style change.
- The `expectGhostButton` helper has two callers and is small; it is not a single-use abstraction.
- The regression test asserts literal utility classes, so it is implementation-coupled and does not itself prove every preserved class. That creates narrower confidence, but direct source inspection proves the stated preservation criteria, so this is a NOTE rather than a blocker.
- The test shares a broader draft-badge scenario instead of naming the ghost-button behavior independently. This is a maintainability NOTE, not a violation of the requested outcome.
- `NewProductFlow.tsx` measures 977 pure LOC and is untracked in current git status. Both are pre-existing/scope-state notes; neither violates a stated success criterion for this request.
- No dedicated code-review report with explicit `programming` and overfit/slop coverage was found for this narrow request. This direct gate pass supplies that coverage, as permitted when the report is absent.

## exactEvidenceGaps

- `omo ulw-loop status --json` could not run because `omo` is not installed/on PATH; fallback report path used.
- No fresh browser screenshot focused on these two buttons after this change.
- Because `NewProductFlow.tsx` is untracked, Git cannot provide a baseline diff for its class change; current source state and the passing DOM test were inspected instead.
- The supplied red-before-change claim was not independently reproduced because this is a read-only review and reverting the untracked source would mutate artifacts.
