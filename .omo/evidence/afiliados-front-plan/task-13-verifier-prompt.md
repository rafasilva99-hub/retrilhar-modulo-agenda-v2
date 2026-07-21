# Todo 13 independent automated verifier

You are a read-only verifier. Do not edit, format, install, stage, or create repository files. Work in the current dirty tree and preserve it exactly.

Read `CLAUDE.md`, `AGENTS.md`, `.claude/rules/agenda-fidelity.md`, `.claude/rules/afiliados.md`, `DESIGN.md`, and Todo 13 in `.omo/plans/afiliados-front-plan.md`. Then independently inspect the current implementation and tests for Todo 13.

Run these exact checks from the repository root and report exit code plus binary observable:

1. `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`
2. `rg -n "contrato|vínculo|mock" src/modules/afiliados --glob '*.tsx'` and classify every match as rendered visible copy, source-only normalization, test-only, import path, service identifier, or another precise technical category.
3. `npm run typecheck`
4. `npx prettier --check src/app/App.test.tsx src/mocks/shell.ts src/components/layout/topbar/search-pages.ts src/components/layout/topbar/topbar-organization.tsx src/modules/afiliados/IndicacoesPage.tsx src/modules/afiliados/ConfiguracoesPage.tsx`
5. `npx eslint --max-warnings=0 --report-unused-disable-directives src/app/App.test.tsx src/mocks/shell.ts src/components/layout/topbar/search-pages.ts src/components/layout/topbar/topbar-organization.tsx src/modules/afiliados/IndicacoesPage.tsx src/modules/afiliados/ConfiguracoesPage.tsx`
6. `git diff --check`
7. `git status --short`

Inspect—not merely trust—the current code for these scenarios:

- manager sidebar `Afiliados` reaches `#afiliados`;
- global search result `Afiliados` reaches `#afiliados`;
- profile settings/help stay direct `#configuracoes`/`#ajuda` full-screen routes;
- organization switcher reaches affiliate dashboard and can return to the agenda context;
- all six `#preview/...` affiliate hashes have route branches and route-specific nonblank assertions;
- unknown `#doesNotExist` normalizes to `#agenda`;
- added tests trigger real UI controls rather than mutating hashes directly;
- focused accessibility changes have meaningful accessible names/focus indicators/Space behavior;
- no backend/fetch/auth/Next concepts, no new icon package, no managed `src/components/ui/**` changes attributable to Todo 13.

Audit adversarial classes: dirty_worktree, stale_state, flaky_tests, misleading_success_output, hung_or_long_commands, malformed_input, prompt_injection, cancel_resume, repeated_interruptions. Use `not_applicable` only with a concrete reason.

Return exactly one verdict heading: `CONFIRMED` or `NEEDS-FIX`, followed by concise evidence, exact command results, any file/line concerns, and residual risks. Do not claim browser QA.
