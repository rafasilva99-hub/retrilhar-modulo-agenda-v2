**DoneClaim**
- `task/status`: Todo 13 complete.
- `owned and changed files`: [App.test.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/app/App.test.tsx), [shell.ts](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/mocks/shell.ts), [search-pages.ts](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/components/layout/topbar/search-pages.ts), [topbar-organization.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/components/layout/topbar/topbar-organization.tsx), [IndicacoesPage.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/afiliados/IndicacoesPage.tsx), [ConfiguracoesPage.tsx](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/src/modules/afiliados/ConfiguracoesPage.tsx), [.omo/evidence/afiliados-front-plan/task-13-integration.txt](/Users/rafaelsilva/Documents/Projetos%20HTML/Retrilhar%20-%20Mo%CC%81dulo%20de%20Agenda%20V2/.omo/evidence/afiliados-front-plan/task-13-integration.txt).

**What Changed**
- Enabled manager sidebar `Afiliados` to route to `#afiliados`.
- Added `page: "afiliados"` to global search’s affiliate result.
- Added tests for all six direct affiliate routes, all six preview routes, manager sidebar, global search, profile settings/help, organization switcher, and unknown hash fallback.
- Kept direct full-screen `#configuracoes` and `#ajuda`.
- Focused accessibility fixes: labeled topbar organization settings icon, visible focus rings/labels for settings navigation, and Space-key `preventDefault()` plus focus ring/label for indication table rows.

**Verification**
- Baseline: `npm run test -- --run src/app/App.test.tsx src/modules/afiliados` exit 0, 9 files / 34 tests passed.
- RED: `npm run test -- --run src/app/App.test.tsx` exit 1, 1 file failed, 2 failed / 7 passed. Failures proved sidebar/search stayed on `#agenda`.
- GREEN aggregate: same aggregate command exit 0, 9 files / 39 tests passed.
- Focused rerun after aggregate: `src/app/App.test.tsx` exit 0, 1 file / 9 tests passed.
- `npm run typecheck` exit 0.
- Targeted Prettier, ESLint, and `git diff --check` exit 0.

**Term Classification**
`rg -n "contrato|vínculo|mock" src/modules/afiliados --glob '*.tsx'` found no rendered-copy violations. Matches are technical mock imports/service names, test setup/assertions, or `AjudaPage` source normalization replacing `vínculo` before rendering.

**Adversarial Results**
- `dirty_worktree`: present and preserved. Prior affiliate screen changes remain dirty/untracked.
- `stale_state`: preview/direct hash tests remount cleanly and assert route-specific text.
- `flaky_tests`: focused App test rerun after aggregate passed.
- `misleading_success_output`: reported exact file/test counts, not only exit 0.
- `hung_or_long_commands`: aggregate suite ran past 30s and completed normally.
- `malformed_input`: existing `#doesNotExist` fallback remains covered.
- `prompt_injection`, `cancel_resume`, `repeated_interruptions`: not applicable; no trigger appeared.

**LOC / Risks**
Pure LOC over 250 remains in prior/current affiliate screens: `AfiliadosPage` 769, `ConfiguracoesPage` 1251, `GanhosPage` 370, `IndicacoesPage` 561, `ProdutosLinksPage` 333. I did not broaden into refactors. TypeScript LSP remains unavailable. Browser QA/server were intentionally not run per assignment.