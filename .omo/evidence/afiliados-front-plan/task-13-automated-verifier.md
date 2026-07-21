NEEDS-FIX

Required check 1 did not pass in this read-only verifier environment.

Command results:
- `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`: exit 1. Binary observable: Vitest never started; Vite failed with `EPERM` writing `node_modules/.vite-temp/vite.config.ts.timestamp-...mjs`.
- `rg -n "contrato|vínculo|mock" src/modules/afiliados --glob '*.tsx'`: exit 0. No rendered visible-copy violation found.
  - `mock`: import paths/service identifiers/test mock helpers.
  - `vínculo`: source-only normalization in `AjudaPage.tsx:64`; test-only negative assertion in `AjudaPage.test.tsx:40`.
- `npm run typecheck`: exit 0. Binary observable: `tsc --noEmit` completed.
- `npx prettier --check ...`: exit 0. Binary observable: `All matched files use Prettier code style!`
- `npx eslint --max-warnings=0 --report-unused-disable-directives ...`: exit 0. Binary observable: no lint output.
- `git diff --check`: exit 0. Binary observable: no whitespace errors, but macOS `xcrun_db` cache-write warnings appeared due read-only `/tmp`.
- `git status --short`: exit 0. Binary observable: dirty tree includes Todo 13 targets plus affiliate screens/tests/docs; same `xcrun_db` warnings.

Implementation inspection:
- Manager sidebar `Afiliados` reaches `#afiliados`: supported by `src/mocks/shell.ts:46`, `SidebarNavItem` click handling, and test at `src/app/App.test.tsx:95`.
- Global search `Afiliados` reaches `#afiliados`: supported by `search-pages.ts:69-73`, `global-search.tsx:61-63`, and test at `src/app/App.test.tsx:106`.
- Profile settings/help stay direct full-screen routes: `AgendaPrototypeApp.tsx:238-244`; test at `src/app/App.test.tsx:130`.
- Organization switcher reaches affiliate dashboard: supported by `topbar-organization.tsx:26-32,119-121`; test at `src/app/App.test.tsx:153`.
- Concern: reverse organization switcher return to agenda context is implemented as `page: "agendaDia"` at `topbar-organization.tsx:35-41`, but I did not find an added integration test that exercises returning from affiliate context to the agenda context.
- All six affiliate preview branches exist at `AgendaPrototypeApp.tsx:154-165`; route-specific assertions are in `App.test.tsx:81-93`.
- Unknown `#doesNotExist` normalizes to `#agenda`: implemented in `use-agenda-prototype-navigation.ts:57-60,95-98`; tested at `App.test.tsx:165-184`.
- Added integration tests use real UI controls for sidebar/search/profile/org switcher. Direct hash mutation is used for initial route setup and unknown-hash simulation.
- Accessibility polish found: org settings button has an accessible name at `topbar-organization.tsx:96-101`; referral rows include accessible names and Enter/Space behavior at `AfiliadosPage.tsx:256-270` and `IndicacoesPage.tsx:272-286`; focus indicators are present in several changed affiliate controls.
- No maintained affiliate/app/layout/mock hits for `fetch(`, Next/auth/OpenAPI/service worker, or new icon imports. `src/components/ui/**` has no diff. Existing `lucide-react` imports remain in managed UI files only.

Adversarial audit:
- `dirty_worktree`: applicable; recorded via `git status --short`.
- `stale_state`: mitigated by reading current files after command checks.
- `flaky_tests`: unresolved because Vitest startup was blocked before execution.
- `misleading_success_output`: `git diff --check` and `git status` exited 0 despite cache warnings; recorded.
- `hung_or_long_commands`: no hangs observed.
- `malformed_input`: covered by unknown hash tests/code.
- `prompt_injection`: not applicable; only user-requested local project docs were read.
- `cancel_resume`: not applicable; no resume event occurred.
- `repeated_interruptions`: not applicable; no interruptions occurred.

Residual risk: I cannot confirm the test suite behavior until the exact Vitest command can write Vite’s temp config or runs in a writable environment.