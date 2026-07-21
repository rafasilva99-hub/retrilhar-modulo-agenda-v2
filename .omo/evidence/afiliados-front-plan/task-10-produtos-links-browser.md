# Todo 10 — Produtos e links

## DoneClaim

- Task: execute Todo 10 from `.omo/plans/afiliados-front-plan.md:244-257` for `#produtosLinks`.
- Status: complete for the assigned write set.
- Changed files:
  - `src/modules/afiliados/ProdutosLinksPage.tsx`
  - `src/modules/afiliados/ProdutosLinksPage.test.tsx`
- No shared components, services, routes, plans, ledgers, or other screen files were changed for this task.
- Evidence companion: `.omo/evidence/afiliados-front-plan/task-10-produtos-links.txt`.

## Source references

- Product requirements: `Specdrivenafiliados.md:20,23-26,45-47`.
- Planned scope: `.omo/plans/afiliados-front-plan.md:244-257`.
- Hierarchy and local state implementation: `src/modules/afiliados/ProdutosLinksPage.tsx:1,41-49,52-102,105-202,205-237,273-334`.
- Existing synchronous service helpers used for product scope and local requests: `src/modules/afiliados/services/afiliados-mock-service.ts:159-218`.
- Domain types: `src/modules/afiliados/types.ts:1-48`.
- Fixture links, organizations, products, unavailable product, and requested product: `src/mocks/afiliados/index.ts:94-119,126-153,1051-1104`.

## Success criteria evidence

### Three-level hierarchy and organization drilldown

- Scenario: render `#produtosLinks`, then reveal organization links.
- Invocation: focused Vitest test `npm run test -- --run src/modules/afiliados/ProdutosLinksPage.test.tsx`, first test.
- Binary observable: test passed while asserting `Link geral (nível 1)`, `Link da organização (nível 2)`, `Link do produto (nível 3)`, and the `Ver links por organização` action; the action reveals the organization card and selected-organization product view.
- Captured artifact: this file and `task-10-produtos-links.txt`.

### Scope messaging for `todos` and `especificos`

- Scenario: inspect the default all-organizations view and select `Trilheiras de Brasília`.
- Invocation: same focused test, first test; browser flow below.
- Binary observable: exact copy present for both cases: `Você pode vender todos os produtos desta organização. Novos produtos entram automaticamente.` and `Esta afiliação inclui apenas produtos específicos. Produtos fora da lista precisam ser solicitados.`
- Captured artifact: focused test result in this file; browser URL and DOM result below.

### Product request flow with local state

- Scenario: select `Trilheiras de Brasília` and request `Boia Cross Radical`.
- Invocation: focused Vitest test, second test; browser step 5 below.
- Binary observable: request button is replaced by `Solicitação enviada`; browser returned `requestButtonGone: true` and `requestSentCount: 2` (the second request is the newly requested product; the fixture already contains one requested product).
- Scope boundary: no admin approval UI, backend request, fetch, HTTP client, or authentication flow was added.
- Captured artifact: focused test result and browser JSON below.

### Unavailable product cannot be copied

- Scenario: select `Cerrado Experience` and inspect `Rafting Rio das Velhas`.
- Invocation: focused Vitest test, third test; browser step 7 below.
- Binary observable: copy control is disabled and remains not copied; browser returned `disabledBefore: true` and `unavailableStayedUncopied: true`.
- Captured artifact: focused test result and browser JSON below.

### Copy feedback at all link levels

- Scenario: copy general, organization, and product links.
- Invocation: focused Vitest test, second test; browser steps 1, 3, and 4 below.
- Binary observable: each control changes to `Copiado`; browser returned `generalCopied: "Copiado"`, `organizationCopied: "Copiado"`, and `productCopied: "Copiado"`.
- Captured artifact: focused test result and browser JSON below.

## Verification commands and results

All commands ran from `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2`.

| Scenario | Invocation | Result / captured observable |
| --- | --- | --- |
| Focused page tests | `npm run test -- --run src/modules/afiliados/ProdutosLinksPage.test.tsx` | PASS, 1 file and 3 tests passed. |
| Page plus service regression tests | `npm run test -- --run src/modules/afiliados/ProdutosLinksPage.test.tsx src/modules/afiliados/services/afiliados-mock-service.test.ts` | PASS, 2 files and 10 tests passed. |
| Required caller command | `npm run test -- --run src/app/App.test.tsx src/modules/afiliados` | EXIT 1. The assigned page tests pass; unrelated `src/app/App.test.tsx:47` fails because it expects `Extrato de comissoes` while the current rendered screen has `Extrato de comissões`. This file is outside the write set. |
| Affiliate suite | `npm run test -- --run src/modules/afiliados` | EXIT 1. 6 files passed / 2 failed, 27 passed / 29 tests. Unrelated failures: `src/modules/afiliados/AfiliadosPage.test.tsx:12` timeout and `src/modules/afiliados/IndicacoesPage.test.tsx:26` expected `aria-selected=true` but received `false`. |
| Type safety | `npm run typecheck` | PASS, exit 0. |
| Assigned-file lint | `npx eslint src/modules/afiliados/ProdutosLinksPage.tsx src/modules/afiliados/ProdutosLinksPage.test.tsx --max-warnings=0 --report-unused-disable-directives` | PASS, exit 0. |
| Full lint | `npm run lint` | EXIT 1 on unrelated existing files: `src/components/custom/time-input.tsx`, `src/modules/agenda/components/AgendaNovaAtividade.tsx`, `src/modules/board/BoardCanvas.tsx`, `src/modules/board/index.ts`, `src/modules/board/use-canvas-pan-zoom.ts`, and `src/modules/produtos/ProdutosPage.tsx`. Assigned files are not in the final failure list. |
| Production build | `npm run build` | PASS, exit 0; Vite built 2092 modules. Existing large-chunk warning (>500 kB) remains. |
| Formatting | `npx prettier --check src/modules/afiliados/ProdutosLinksPage.tsx src/modules/afiliados/ProdutosLinksPage.test.tsx` | PASS. |
| Diff whitespace | `git diff --check -- src/modules/afiliados/ProdutosLinksPage.tsx src/modules/afiliados/ProdutosLinksPage.test.tsx` | PASS, exit 0. |
| Forbidden-term guardrail | `rg -n "fetch\\(|axios|contrato|vínculo|mock|fake" src/modules/afiliados/ProdutosLinksPage.tsx` | EXIT 0 only because internal import paths contain `@/mocks/afiliados` and `./services/afiliados-mock-service`. No `fetch`, `axios`, `contrato`, `vínculo`, or `fake`; the two `mock` matches are implementation-only names and are not visible UI copy. |

## Browser QA

- URL: `http://127.0.0.1:5173/#produtosLinks`
- Runtime: existing Vite server reused on port 5173; fresh Chrome CDP target at 1280x800. No server was started or stopped.
- Steps and binary results:
  1. Open the URL and click the general-link `Copiar` control — result `Copiado`.
  2. Open `Organização` and choose `Trilheiras de Brasília` — organization scope and product links render.
  3. Click the organization-link `Copiar` control — result `Copiado`.
  4. Click `Copiar link do produto` for `Passeio de Barco` — result `Copiado`.
  5. Click `Solicitar Boia Cross Radical` — result becomes `Solicitação enviada`.
  6. Choose `Cerrado Experience` — unavailable `Rafting Rio das Velhas` is visible.
  7. Inspect its `Indisponível` copy control — disabled and cannot set copied state.
- Captured browser JSON:

```json
{
  "url": "http://127.0.0.1:5173/#produtosLinks",
  "generalValuePresent": true,
  "generalCopied": "Copiado",
  "organizationCopied": "Copiado",
  "productCopied": "Copiado",
  "requestButtonGone": true,
  "requestSentCount": 2,
  "disabledBefore": true,
  "unavailableStayedUncopied": true,
  "bodyHasForbiddenVisibleCopy": false
}
```

- Screenshot artifacts captured during visual inspection:
  - `/tmp/task-10-produtos-links-desktop.png` (1280x800, 95409 bytes)
  - `/tmp/task-10-produtos-links-mobile.png` (390x844, 42185 bytes)
- Visual result: desktop hierarchy and controls render correctly. Mobile inspection exposed existing shell-level clipping from the fixed sidebar at 390px; the shell/layout files are outside the assigned write set and were not altered.
- Browser cleanup: the temporary CDP target was closed with `Target.closeTarget`; the reused Vite process was left running because it was not started by this task.

## Adversarial classes

- `malformed_input`: PASS by constraint; organization selection is limited to fixture-backed options and no free-form input is parsed by this screen.
- `prompt_injection`: N/A; no external or model-authored content is interpreted as instructions.
- `cancel_resume`: N/A; request behavior is synchronous local state, with no resumable network operation.
- `stale_state`: PASS; `createProductRequestState()` preserves the fixture’s already-requested product, while a new request updates local React state only; no backend mutation occurs.
- `dirty_worktree`: PASS; scoped status was captured and unrelated existing changes were preserved.
- `hung_or_long_commands`: PASS; focused tests, typecheck, lint, build, and browser run completed; temporary CDP target was cleaned up.
- `flaky_tests`: PASS for assigned tests; focused page run passed 3/3 and page-plus-service run passed 10/10. The Radix Select jsdom test setup supplies `scrollIntoView` so the test is deterministic.
- `misleading_success_output`: PASS; browser evidence asserts visible `Copiado`, `Solicitação enviada`, disabled `Indisponível`, and forbidden visible-copy absence rather than relying on exit codes alone.
- `repeated_interruptions`: N/A; no interruptible long-running task was used.

## Cleanup and risk

- `omo ulw-loop status --json` could not provide an attempt directory because `omo` is not installed (`omo: command not found`); evidence was therefore written under `.omo/evidence/afiliados-front-plan/`.
- Existing dirty-worktree state included other files and the evidence directory. Scoped status before evidence creation was:

```text
 M src/modules/afiliados/ProdutosLinksPage.tsx
?? .omo/evidence/afiliados-front-plan/
?? src/modules/afiliados/ProdutosLinksPage.test.tsx
```

- The page remains above the general 250-pure-LOC guidance because the explicit write set permits only this screen file; the cohesive screen fragments remain local and the `SIZE_OK` exception is documented at `ProdutosLinksPage.tsx:1`.
- No backend, admin approval, authentication, or network request was introduced.
- Residual risks are the unrelated test/lint failures listed above, the existing build chunk warning, and the pre-existing narrow-mobile shell clipping.

## Final status

DoneClaim status: **complete (scoped implementation)**. The assigned page now exposes the three link levels, organization drilldown, both scope messages, local product request behavior, copy feedback, and disabled unavailable-product behavior. Required evidence is recorded in this file and in:

`/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/afiliados-front-plan/task-10-produtos-links.txt`
