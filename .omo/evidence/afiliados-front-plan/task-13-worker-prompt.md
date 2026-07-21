# Todo 13 serial implementation assignment

TASK: Act as the sole serial integration executor for Todo 13 in this shared Vite/React worktree. No other writer is active. Integrate affiliate navigation, preview routes, and only the small accessibility defects you can prove. Send `WORKING: Todo 13 - <phase>` before long work and finish with a structured DoneClaim.

DELIVERABLE:

- The manager sidebar, affiliate sidebar, topbar organization/profile controls, and global search reach the intended affiliate hashes.
- Direct full-screen `#configuracoes` and `#ajuda` behavior remains intact.
- All six preview hashes render nonblank: `#preview/afiliados`, `#preview/indicacoes`, `#preview/ganhos`, `#preview/produtosLinks`, `#preview/configuracoes`, `#preview/ajuda`.
- Focus states, accessible labels, keyboard activation, long button text, and Portuguese diacritics receive only focused fixes demonstrated by source/test evidence.
- Existing worker changes are preserved.

READ FIRST, completely enough to reason from current state:

- `CLAUDE.md`, `.claude/rules/agenda-fidelity.md`, `AGENTS.md`, `DESIGN.md`, `.claude/rules/afiliados.md`
- `.omo/plans/afiliados-front-plan.md` Todos 7 through 13
- all current `src/modules/afiliados/**/*.tsx`, services, and types
- `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`
- `src/modules/agenda/components/AgendaPrototypeApp.tsx`
- `src/mocks/shell.ts`
- `src/components/layout/topbar/topbar-profile.tsx`
- `src/components/layout/topbar/topbar-organization.tsx`
- `src/components/layout/topbar/search-pages.ts`
- `src/components/layout/topbar/global-search.tsx` read-only unless a blocking bug cannot be fixed within the listed integration files
- `src/app/App.test.tsx`

CURRENT FACTS TO VERIFY, NOT TRUST:

- Orchestrator reported 9 files / 34 tests green before Todo 13.
- Current source inspection suggests `shellNavItems` has a disabled affiliate entry, `systemPages` has an affiliate item without `page`, and all preview switch branches already exist.
- Existing affiliate screen modifications and untracked components/services belong to prior workers. Never overwrite or revert them.
- TypeScript LSP is unavailable; use the repository typecheck and targeted ESLint/Prettier diagnostics.

WRITE SCOPE:

- `src/app/App.test.tsx`
- `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts` only if required
- `src/modules/agenda/components/AgendaPrototypeApp.tsx` only if required
- `src/mocks/shell.ts`
- `src/components/layout/topbar/topbar-profile.tsx`
- `src/components/layout/topbar/topbar-organization.tsx`
- `src/components/layout/topbar/search-pages.ts`
- affiliate screen and focused test files only for small accessibility/polish defects discovered while integrating
- do not edit `src/components/ui/**`, fixtures, service/types/shared affiliate components, `DESIGN.md`, plan/Boulder/ledger, package manifests, or unrelated code

CONFLICT DISCIPLINE:

1. Record SHA-256 fingerprints and `git status --short` for every file you may edit before touching it.
2. Re-read each target immediately before applying its patch.
3. If a target changes after your snapshot for reasons other than your own edit, stop and report the exact file conflict. Do not overwrite it.

TDD AND IMPLEMENTATION:

1. Run the baseline command exactly: `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`.
2. Add integration tests before production edits. At minimum, prove all six preview hashes render route-specific nonblank text and prove a real user-visible navigation seam that currently fails (for example the manager sidebar or global search reaching the affiliate dashboard). Capture the RED output in your final report. Do not weaken existing tests.
3. Make the smallest production change. Prefer data/config fixes in `src/mocks/shell.ts` and `search-pages.ts` over new abstractions. Keep Vite, React, and hash routing. No backend, HTTP, auth, Next.js, or dependencies.
4. Preserve direct full-screen settings/help. Do not introduce non-affiliate pages.
5. Inspect the maintained affiliate screens for concrete Todo 13 defects. Focus especially on native keyboard-activated rows/buttons lacking a visible focus ring, Space activation that scrolls, icon-only controls missing Portuguese accessible names, English default close labels where the existing Sheet API permits a local override, and long Portuguese button labels at narrow widths. Fix only confirmed issues within allowed screen files and add focused tests where behavior is subtle.
6. Do not expose `mock`, `contrato`, or `vínculo` as rendered copy. Internal imports, test mocks, and source-normalization identifiers may remain and must be classified.

VERIFY:

- `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`
- `npm run typecheck`
- targeted `npx prettier --check` and `npx eslint --max-warnings=0 --report-unused-disable-directives` for every changed TS/TSX file
- `git diff --check`
- `rg -n "contrato|vínculo|mock" src/modules/afiliados --glob '*.tsx'`, classify every match as rendered violation or technical/internal
- inspect every changed file and report pure LOC plus any file over 250 lines; do not broaden into a refactor
- do not run browser QA; the orchestrator owns live browser evidence after your implementation

ADVERSARIAL CLASSES:

- dirty_worktree: required; show targeted status and explain preservation
- stale_state: required; preview/direct hash tests must remount cleanly and prove route-specific text
- flaky_tests: required if tests are added; rerun the focused App test once after the aggregate command
- misleading_success_output: required; report exact test counts and independent rendered assertions, not only exit 0
- hung_or_long_commands: required for aggregate suite/typecheck; report completion
- malformed_input: probe unknown `#doesNotExist` fallback already in contract
- prompt_injection, cancel_resume, repeated_interruptions: mark not applicable with reasons unless a trigger appears

DONECLAIM FIELDS:

- task/status
- owned and changed files
- baseline and RED/GREEN commands with exit statuses and exact test counts
- source decisions and preserved behavior
- technical classification of grep matches
- adversarial class results
- cleanup (no server/browser should be started)
- risks

