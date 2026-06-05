# Prototype Admin Alignment Plan

## TL;DR
> **Summary**: Refactor the Vite agenda prototype so it stays mock-only and hash-routed while matching the Retrilhar Admin frontend standards for shadcn config, Tailwind tokens, HugeIcons, layout boundaries, component placement, tests, and QA discipline.
> **Deliverables**:
> - `.claude/rules/agenda-fidelity.md` copied from the existing prototype rules and updated with the Admin read-only invariant.
> - Vitest/Testing Library characterization test setup.
> - Admin-compatible shadcn/Tailwind/token alignment in the prototype only.
> - `src/components/custom`, `src/components/skeleton`, and layout/module boundaries aligned to Admin patterns.
> - Figma exports contained behind adapters and progressively replaced by maintained components.
> - Final readiness audit with browser QA evidence.
> **Effort**: XL
> **Parallel**: YES - 5 waves after the baseline/test foundation.
> **Critical Path**: Baseline lint fix -> test setup -> characterization tests -> shadcn/theme parity -> shell/module boundary -> component extraction -> readiness audit.

## Context

### Original Request
The prototype at `/Users/luana/Desktop/retrilhar-modulo-agenda-v2` should remain a prototype with no backend, but be refactored in a granular, senior-quality way so it is structurally and stylistically compatible with `/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin`. The Admin project must never be dirtied or edited; it is read-only reference only.

### Interview Summary
- The project remains Vite/React and mock-only.
- No Next.js migration, auth, OpenAPI SDK, real organization/session, or backend integration.
- Existing hash routes remain the tested surface: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`.
- Admin patterns to mirror: `radix-luma` shadcn preset, HugeIcons only, Tailwind semantic tokens, `html.dark` dark-mode variant, `components/layout`, `components/custom`, `components/skeleton`, `modules/[feature]`, thin app entry, atomic refactors.
- Previous `docs/superpowers/plans/*` files are prior drafts. The official execution source of truth is this `.omo/plans/prototype-admin-alignment.md`.

### Metis Review (gaps addressed)
- Added hard guardrail that the Admin repository is read-only and must remain unchanged.
- Bounded “Admin standards” to frontend architecture/config/tokens/components only; excluded Next/RSC/auth/API/PWA/runtime concerns.
- Added exact Tailwind/shadcn acceptance criteria, including `shadcn/tailwind.css` and `@custom-variant dark (&:is(html.dark *))`.
- Added lucide/MUI dependency quarantine and later cleanup, without broad source churn up front.
- Added mock-only enforcement checks to prevent accidental `fetch`, SDK, auth, or backend headers.
- Added Vitest/Testing Library setup and characterization tests before behavior-preserving refactors.
- Added desktop/mobile browser QA for every hash route and critical navigation flow.

## Work Objectives

### Core Objective
Make the prototype look and behave like a high-quality Admin-compatible frontend codebase while preserving its mock-only prototype nature and existing user-testing flow.

### Deliverables
- Official plan file: `.omo/plans/prototype-admin-alignment.md`.
- Project rule file: `.claude/rules/agenda-fidelity.md`.
- Baseline lint remediation.
- Test infrastructure and characterization tests.
- shadcn/Tailwind/token parity.
- `components/ui` parity audit.
- Admin-compatible custom/skeleton/layout structure.
- Thin app entry and agenda module orchestrator.
- Mock service/view model boundary.
- Figma export containment audit.
- Incremental maintained component extraction.
- Dependency/code-quality audits.
- Final migration-readiness report.

### Definition of Done
All conditions below are agent-verifiable:

```bash
git -C "/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin" status --short
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected:
- Admin status output is identical to its pre-plan baseline; no new Admin modifications caused by this work.
- Prototype checks pass.
- Browser QA evidence exists under `.omo/evidence/` for desktop and mobile hash routes.
- Maintained prototype code has no `lucide-react`, `@mui/*`, backend SDK, auth, direct `fetch`, or non-exempt hardcoded colors outside documented legacy areas.

### Must Have
- Vite stays the runtime.
- Local mocks stay the data source.
- Hash navigation stays the user-facing route mechanism.
- `src/imports/**` is treated as legacy Figma Make output behind adapters.
- New maintained files use strict TypeScript, HugeIcons, shadcn primitives, `cn`, semantic Tailwind classes, and `em` spacing where mirroring Admin layout.
- Tests are written before the refactor they protect.

### Must NOT Have
- No mutation inside the Retrilhar Admin repository.
- No Next.js, App Router, RSC, `next/link`, `next/image`, `next-intl`, `better-auth`, OpenAPI SDK, Sentry, PWA/service worker, backend headers, or real API calls.
- No broad edits to `src/components/ui/**` unless a task explicitly scopes and documents a Vite compatibility exception.
- No full rewrite of all Figma exports in one commit.
- No dependency upgrades to chase Admin package versions, especially no React 19 migration.

## Verification Strategy

> ZERO HUMAN INTERVENTION - all verification is agent-executed.

- Test decision: TDD/characterization with Vitest + React Testing Library + jsdom; Playwright browser QA for the real Vite surface.
- Existing infra: no app tests currently exist; add test infra before structural refactors.
- Known baseline issue from research: `npm run lint` is red before refactor due to import/export sort and `prefer-const` in existing files. First implementation task fixes only that baseline.
- Manual QA policy: every UI-affecting task must run against the real Vite app via browser automation and save evidence in `.omo/evidence/`.
- Evidence paths use `.omo/evidence/task-{N}-{slug}.txt` for command output and `.omo/evidence/task-{N}-{slug}-{viewport}.png` for screenshots.

## Execution Strategy

### Parallel Execution Waves

Wave 1: Tasks 1-4 foundation, mostly sequential because later work depends on clean baseline and test setup.

Wave 2: Tasks 5-8 can run partly in parallel after tests exist: shadcn/theme parity, UI audit, custom/skeleton primitives, rules/docs.

Wave 3: Tasks 9-12 depend on Wave 2: layout shell parity, module boundary cleanup, mock service/view models, import containment.

Wave 4: Tasks 13-17 are incremental component extractions. They should be one-worker-at-a-time per screen to avoid conflicting edits in large Figma files.

Wave 5: Tasks 18-20 final quality/dependency/readiness gate.

### Dependency Matrix

| Task | Depends On | Blocks |
| --- | --- | --- |
| 1 | none | 2, 3 |
| 2 | 1 | 3 |
| 3 | 2 | 4, 5, 9 |
| 4 | 3 | all refactor tasks |
| 5 | 4 | 6, 9 |
| 6 | 4 | 18 |
| 7 | 4 | 13-17 |
| 8 | 4 | 9-12 |
| 9 | 5, 7, 8 | 10 |
| 10 | 9 | 11, 12 |
| 11 | 10 | 13-17 |
| 12 | 10 | 13-17 |
| 13 | 11, 12 | 14, 17 |
| 14 | 13 | 16 |
| 15 | 13 | 16 |
| 16 | 14, 15 | 17 |
| 17 | 16 | 18 |
| 18 | 13-17 | 19 |
| 19 | 18 | 20 |
| 20 | all | final |

## TODOs

- [ ] 1. Capture Baseline And Protect The Admin Repo

  **What to do**: Record current state before work. Capture both prototype and Admin git status. Store outputs in `.omo/evidence/task-1-baseline-status.txt`. Do not change Admin.

  **Must NOT do**: Do not run install, formatter, codegen, lint-fix, or any write command in Admin.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2, 3 | Blocked By: none

  **References**:
  - Prototype root: `/Users/luana/Desktop/retrilhar-modulo-agenda-v2`
  - Admin root: `/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin`
  - User instruction: Admin is read-only reference only.

  **Acceptance Criteria**:
  - [ ] `git status --short --branch` captured for prototype.
  - [ ] `git -C "/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin" status --short --branch` captured.
  - [ ] Evidence notes that existing Admin dirt is pre-existing and not caused by this work.
  - [ ] No Admin files are modified by this task.

  **QA Scenarios**:
  ```text
  Scenario: Admin repo remains read-only
    Tool: bash
    Steps: run `git -C "/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin" status --short --branch`
    Expected: output is captured and unchanged after the task
    Evidence: .omo/evidence/task-1-admin-status.txt

  Scenario: Prototype baseline is known
    Tool: bash
    Steps: run `git status --short --branch`
    Expected: output records current prototype dirty state, including existing `package-lock.json` and plan artifacts if present
    Evidence: .omo/evidence/task-1-prototype-status.txt
  ```

  **Commit**: NO | Message: none | Files: `.omo/evidence/task-1-*`

- [ ] 2. Fix Existing Lint Baseline Only

  **What to do**: Fix only the existing lint issues found by research:
  - `src/components/ui/participant-attribute-badge.tsx`: import sort and `prefer-const`.
  - `src/modules/agenda/index.ts`: export sort.
  Add no behavior changes.

  **Must NOT do**: Do not run `npm run lint:fix` across the repo. Do not edit unrelated files. Do not edit Admin.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 3 | Blocked By: 1

  **References**:
  - Lint command: `npm run lint`
  - Prototype lint config: `eslint.config.js`
  - Existing affected files: `src/components/ui/participant-attribute-badge.tsx`, `src/modules/agenda/index.ts`

  **Acceptance Criteria**:
  - [ ] `npm run lint` fails before the change with the known lint messages.
  - [ ] The smallest edits make `npm run lint` pass.
  - [ ] `git diff -- src/components/ui/participant-attribute-badge.tsx src/modules/agenda/index.ts` shows only lint-order/const changes.

  **QA Scenarios**:
  ```text
  Scenario: RED lint baseline
    Tool: bash
    Steps: run `npm run lint` before edits
    Expected: FAIL mentions participant-attribute-badge and agenda index sorting/prefer-const
    Evidence: .omo/evidence/task-2-lint-red.txt

  Scenario: GREEN lint baseline
    Tool: bash
    Steps: run `npm run lint` after edits
    Expected: PASS
    Evidence: .omo/evidence/task-2-lint-green.txt
  ```

  **Commit**: YES | Message: `fix(lint): clean existing prototype lint baseline` | Files: `src/components/ui/participant-attribute-badge.tsx`, `src/modules/agenda/index.ts`

- [ ] 3. Add Vitest And Testing Library Infrastructure

  **What to do**: Add test dependencies and config for Vite:
  - dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
  - create `vitest.config.ts`
  - create `src/test/setup.ts`
  - add scripts: `test`, `test:watch`
  - update `check` to include `npm run test` only after the initial test suite is present in Task 4.

  **Must NOT do**: Do not add Playwright yet. Do not add MSW. Do not add backend mocks. Do not change React version.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 4 | Blocked By: 2

  **References**:
  - Vite config: `vite.config.ts`
  - TS config: `tsconfig.json`
  - Current scripts: `package.json`

  **Acceptance Criteria**:
  - [ ] `npm run test -- --run` or `npm run test` runs and reports no tests found or passes the first smoke test.
  - [ ] `npm run typecheck` still passes.
  - [ ] `package-lock.json` changes are limited to test dependencies.

  **QA Scenarios**:
  ```text
  Scenario: Test runner starts
    Tool: bash
    Steps: run `npm run test`
    Expected: Vitest starts successfully and exits 0 after smoke/placeholder test exists
    Evidence: .omo/evidence/task-3-vitest-green.txt

  Scenario: TypeScript config remains valid
    Tool: bash
    Steps: run `npm run typecheck`
    Expected: PASS
    Evidence: .omo/evidence/task-3-typecheck.txt
  ```

  **Commit**: YES | Message: `test(setup): add vitest for prototype characterization` | Files: `package.json`, `package-lock.json`, `vitest.config.ts`, `src/test/setup.ts`

- [ ] 4. Add Characterization Tests For Current Prototype Behavior

  **What to do**: Write tests before structural refactor to pin current observable behavior:
  - `src/modules/agenda/services/agenda-mock-service.test.ts`
  - `src/modules/agenda/hooks/use-agenda-prototype-navigation.test.tsx`
  - `src/app/App.test.tsx`
  Tests must cover:
  - unknown hash falls back to `agenda`
  - direct hash load for `agenda`, `agendaDia`, `atualizacoes`, `novaAtividade`
  - clicking day calls navigation to `agendaDia`
  - details/check-in path navigates to `atualizacoes`
  - service ordering and default activity id
  Use fake timers or a controlled date where `new Date()` affects results.

  **Must NOT do**: Do not refactor production code before the tests exist and pass against current behavior.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 5-20 | Blocked By: 3

  **References**:
  - Current app branching: `src/app/App.tsx`
  - Navigation hook: `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`
  - Service: `src/modules/agenda/services/agenda-mock-service.ts`
  - Mock pages: `src/mocks/shell.ts`

  **Acceptance Criteria**:
  - [ ] Tests fail if `getPageFromHash` no longer falls back to agenda.
  - [ ] Tests fail if direct `#atualizacoes` does not render the updates adapter.
  - [ ] `npm run test` passes.
  - [ ] `npm run check` includes tests and passes after baseline fixes.

  **QA Scenarios**:
  ```text
  Scenario: RED characterization guard
    Tool: bash
    Steps: temporarily assert an intentionally wrong heading/route in one new test, run `npm run test -- src/app/App.test.tsx`
    Expected: FAIL for the expected assertion, then revert the intentional wrong assertion
    Evidence: .omo/evidence/task-4-test-red.txt

  Scenario: GREEN characterization suite
    Tool: bash
    Steps: run `npm run test`
    Expected: PASS
    Evidence: .omo/evidence/task-4-test-green.txt
  ```

  **Commit**: YES | Message: `test(agenda): characterize current prototype routes` | Files: `src/**/*.test.ts`, `src/**/*.test.tsx`, `package.json`

- [ ] 5. Persist Prototype Rules For Future Agents

  **What to do**: Create `.claude/rules/agenda-fidelity.md` from the relevant rules already in `CLAUDE.md`, adding:
  - Admin repo is read-only reference only.
  - Prototype remains mock-only.
  - `src/imports/**` is legacy.
  - New maintained code uses shadcn/HugeIcons/semantic tokens.

  **Must NOT do**: Do not edit Admin `.claude` or Admin rules.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8+ | Blocked By: 4

  **References**:
  - Prototype rules: `CLAUDE.md`
  - Admin rules for reference only: Admin `CLAUDE.md`

  **Acceptance Criteria**:
  - [ ] `.claude/rules/agenda-fidelity.md` exists in prototype.
  - [ ] Rule file explicitly says Admin is read-only.
  - [ ] Rule file excludes backend/Next/auth/API.

  **QA Scenarios**:
  ```text
  Scenario: Rule file contains hard constraints
    Tool: bash
    Steps: run `rg -n "read-only|mock-only|src/imports|Next|OpenAPI|better-auth" .claude/rules/agenda-fidelity.md`
    Expected: all key constraints are present
    Evidence: .omo/evidence/task-5-rules-grep.txt

  Scenario: Admin rules untouched
    Tool: bash
    Steps: run Admin git status command from Task 1
    Expected: no new Admin changes caused by this task
    Evidence: .omo/evidence/task-5-admin-status.txt
  ```

  **Commit**: YES | Message: `docs(rules): persist prototype admin-alignment guardrails` | Files: `.claude/rules/agenda-fidelity.md`

- [ ] 6. Align shadcn And Tailwind Config Precisely

  **What to do**: Verify and adjust prototype config only:
  - `components.json` must keep `style: "radix-luma"`, `rsc: false`, `iconLibrary: "hugeicons"`, `menuColor: "inverted-translucent"`, `menuAccent: "subtle"`.
  - `src/styles/tailwind.css` must import Tailwind v4, `tw-animate-css`, and `shadcn/tailwind.css`.
  - `src/styles/theme.css` must use `@custom-variant dark (&:is(html.dark *));`.
  - `src/styles/index.css` must remain the Vite CSS entry and avoid duplicate Tailwind imports.

  **Must NOT do**: Do not copy Admin `rsc: true`. Do not copy Next localFont or `app/globals.css` path. Do not mutate Admin.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 9, 13-17 | Blocked By: 4

  **References**:
  - Prototype `components.json`
  - Prototype `src/styles/index.css`, `src/styles/tailwind.css`, `src/styles/theme.css`
  - Admin reference: Admin `components.json`, Admin `app/globals.css`

  **Acceptance Criteria**:
  - [ ] `rg -n '"style": "radix-luma"|"iconLibrary": "hugeicons"|"menuColor": "inverted-translucent"|"menuAccent": "subtle"' components.json` finds all expected values.
  - [ ] `rg -n 'shadcn/tailwind.css|tw-animate-css|@custom-variant dark \\(&:is\\(html\\.dark \\*\\)\\)' src/styles` finds active imports/variant.
  - [ ] `rg -n '@custom-variant dark \\(&:is\\(\\.dark \\*\\)\\)' src/styles` returns no matches.
  - [ ] `npm run test`, `npm run typecheck`, `npm run build` pass.

  **QA Scenarios**:
  ```text
  Scenario: Config parity command check
    Tool: bash
    Steps: run the `rg` acceptance commands above
    Expected: required values present and `.dark *` variant absent
    Evidence: .omo/evidence/task-6-config-parity.txt

  Scenario: Theme does not break shell rendering
    Tool: browser use
    Steps: start Vite, open `http://127.0.0.1:<actual-port>/#agenda` at 1366x768, capture screenshot
    Expected: agenda shell renders with sidebar/topbar and no blank page
    Evidence: .omo/evidence/task-6-agenda-desktop.png
  ```

  **Commit**: YES | Message: `refactor(theme): align prototype shadcn preset with admin` | Files: `components.json`, `src/styles/*`

- [ ] 7. Audit And Quarantine `components/ui`

  **What to do**: Create `docs/audits/shadcn-ui-parity.md` documenting:
  - Admin UI component inventory.
  - Prototype UI component inventory.
  - Extra prototype files.
  - Prototype `src/components/ui` files that import `lucide-react`.
  - Decision: no broad edits to `src/components/ui`; project-specific components move later.

  **Must NOT do**: Do not delete UI files. Do not regenerate shadcn components. Do not edit Admin.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 18 | Blocked By: 4

  **References**:
  - Prototype `src/components/ui/**`
  - Admin `components/ui/**` read-only
  - Existing lucide-bearing files found by research: carousel, context-menu, navigation-menu, pagination, resizable, menubar

  **Acceptance Criteria**:
  - [ ] `docs/audits/shadcn-ui-parity.md` exists.
  - [ ] Audit includes command output or summarized inventory.
  - [ ] Audit lists lucide-bearing UI files and project-specific participant badge files.
  - [ ] No source behavior changes in this task.

  **QA Scenarios**:
  ```text
  Scenario: UI inventory documented
    Tool: bash
    Steps: run `rg -n "lucide|participant|Admin Components|Prototype Extra" docs/audits/shadcn-ui-parity.md`
    Expected: audit has required sections
    Evidence: .omo/evidence/task-7-ui-audit.txt

  Scenario: No runtime source diff except docs
    Tool: bash
    Steps: run `git diff --name-only HEAD -- src/components/ui src/components/layout src/modules`
    Expected: no files listed from this task
    Evidence: .omo/evidence/task-7-runtime-diff.txt
  ```

  **Commit**: YES | Message: `docs(shadcn): audit prototype ui parity with admin` | Files: `docs/audits/shadcn-ui-parity.md`

- [ ] 8. Add Admin-Compatible Custom And Skeleton Primitives

  **What to do**: Add:
  - `src/components/custom/save-button.tsx`
  - `src/components/custom/status-badge.tsx`
  - `src/components/skeleton/card.tsx`
  - `src/components/skeleton/table.tsx`
  Implement with shadcn `Button`, `Badge`, `Card`, `Skeleton`, `Table`, `cn`, and HugeIcons. `status-badge` must encode meeting decision: status colors for success/attention/danger, neutral color for reservation type indicators.

  **Must NOT do**: Do not modify `src/components/ui/button.tsx` or `badge.tsx`. Do not use lucide.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 13-17 | Blocked By: 4

  **References**:
  - Admin `components/custom/save-button.tsx`
  - Admin `components/skeleton/card.tsx`, `components/skeleton/table.tsx`
  - User meeting transcript: reservation type indicators should be neutral, not confused with status badges.

  **Acceptance Criteria**:
  - [ ] New components compile and have focused tests.
  - [ ] `status-badge` maps success/attention/danger/neutral deterministically.
  - [ ] No `lucide-react` or `@mui` imports in new files.
  - [ ] `npm run test`, `npm run typecheck` pass.

  **QA Scenarios**:
  ```text
  Scenario: RED status badge mapping
    Tool: bash
    Steps: write a failing test expecting neutral reservation indicator not to use success/attention/danger classes; run `npm run test -- src/components/custom/status-badge.test.tsx`
    Expected: FAIL before component implementation
    Evidence: .omo/evidence/task-8-status-badge-red.txt

  Scenario: GREEN custom primitives
    Tool: bash
    Steps: run `npm run test -- src/components/custom src/components/skeleton`
    Expected: PASS
    Evidence: .omo/evidence/task-8-custom-green.txt
  ```

  **Commit**: YES | Message: `feat(components): add admin-compatible prototype primitives` | Files: `src/components/custom/**`, `src/components/skeleton/**`

- [ ] 9. Split Layout Types From Mock Data

  **What to do**: Move type definitions out of `src/mocks/shell.ts` into `src/components/layout/types.ts`. `src/mocks/shell.ts` should import these types and export only mock data. Add optional `mobile` metadata to `MenuItem` matching Admin shape while keeping `page`/`onNavigate` instead of `href`/`Link`.

  **Must NOT do**: Do not introduce Next `Link`, `href` routing, real permissions, `can`, backend resources, or auth.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 10 | Blocked By: 6, 8

  **References**:
  - Current prototype types: `src/components/layout/types.ts`, `src/mocks/shell.ts`
  - Admin menu reference: Admin `modules/app/repository/menu-repository.ts`
  - Admin layout types reference: Admin `components/layout/types.ts`

  **Acceptance Criteria**:
  - [ ] `src/components/layout/types.ts` owns `AppPage`, `MenuItem`, `AppProfile`, `Organization`.
  - [ ] `src/mocks/shell.ts` imports types and exports mock values.
  - [ ] Characterization route tests still pass.

  **QA Scenarios**:
  ```text
  Scenario: RED type-boundary test
    Tool: bash
    Steps: add a test/import check that imports `AppPage` from `src/components/layout/types.ts`; run before moving type ownership
    Expected: FAIL or compile mismatch before the type move if the target export is absent/incomplete
    Evidence: .omo/evidence/task-9-types-red.txt

  Scenario: GREEN route tests after type split
    Tool: bash
    Steps: run `npm run test -- src/modules/agenda/hooks src/app/App.test.tsx`
    Expected: PASS
    Evidence: .omo/evidence/task-9-tests-green.txt
  ```

  **Commit**: YES | Message: `refactor(layout): decouple shell types from mock data` | Files: `src/components/layout/types.ts`, `src/mocks/shell.ts`, tests

- [ ] 10. Normalize Shell Layout While Preserving Hash Navigation

  **What to do**: Bring prototype shell closer to Admin:
  - Add `src/components/layout/mobile/mobile-tab-bar.tsx`.
  - Ensure `AppLayout` owns sidebar/topbar/mobile tab bar.
  - Keep `onNavigate(page)` for prototype routes.
  - Keep documented dynamic CSS variable inline styles only where required to offset Figma exports.
  - Ensure `agendaDia` marks Agenda nav item active.

  **Must NOT do**: Do not add `SidebarProvider` if it forces broad shadcn sidebar rewrites. Do not use Next `Link`. Do not edit Admin.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 11 | Blocked By: 9

  **References**:
  - Current `src/components/layout/app-layout.tsx`, `app-sidebar.tsx`, `top-bar.tsx`
  - Admin `components/layout/app-layout.tsx`, `app-sidebar.tsx`, `top-bar.tsx`, `mobile/mobile-tab-bar.tsx`

  **Acceptance Criteria**:
  - [ ] Desktop shell renders sidebar/topbar for `#agenda` and `#agendaDia`.
  - [ ] Mobile tab bar renders on 375px viewport.
  - [ ] No duplicate Figma-export sidebar/topbar appears.
  - [ ] `style={{}}` usage is not increased except documented dynamic CSS vars.

  **QA Scenarios**:
  ```text
  Scenario: Desktop shell active state
    Tool: browser use
    Steps: open `http://127.0.0.1:<actual-port>/#agendaDia` at 1366x768
    Expected: Agenda sidebar item is active and only one sidebar/topbar is visible
    Evidence: .omo/evidence/task-10-agenda-dia-desktop.png

  Scenario: Mobile tab bar
    Tool: browser use
    Steps: open `http://127.0.0.1:<actual-port>/#agenda` at 375x812
    Expected: mobile navigation is visible and content is not hidden behind it
    Evidence: .omo/evidence/task-10-agenda-mobile.png
  ```

  **Commit**: YES | Message: `refactor(layout): align prototype shell with admin navigation` | Files: `src/components/layout/**`, tests

- [ ] 11. Move App Orchestration Into `modules/agenda`

  **What to do**: Create `src/modules/agenda/components/agenda-prototype.tsx` and `agenda-page-shell.tsx`. Make `src/app/App.tsx` a thin entry:

  ```tsx
  import { AgendaPrototype } from "@/modules/agenda";

  export default function App() {
    return <AgendaPrototype />;
  }
  ```

  Preserve current intentional shell behavior. If `#atualizacoes` or `#novaAtividade` remains outside `AppShell`, document why in code or audit; otherwise bring it under a consistent shell.

  **Must NOT do**: Do not rewrite Figma screen internals here.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 12 | Blocked By: 10

  **References**:
  - Current branching: `src/app/App.tsx`
  - Module exports: `src/modules/agenda/index.ts`
  - Navigation hook: `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`

  **Acceptance Criteria**:
  - [ ] Characterization tests written in Task 4 pass unchanged or with only import path updates.
  - [ ] `src/app/App.tsx` contains no screen branching.
  - [ ] `src/modules/agenda/index.ts` exports `AgendaPrototype`.

  **QA Scenarios**:
  ```text
  Scenario: RED app thin-entry test
    Tool: bash
    Steps: add a test asserting App renders through `AgendaPrototype` behavior; run before moving orchestration
    Expected: FAIL if module entry is absent
    Evidence: .omo/evidence/task-11-app-entry-red.txt

  Scenario: GREEN all hash routes after move
    Tool: browser use
    Steps: open #agenda, #agendaDia, #atualizacoes, #novaAtividade on real Vite URL
    Expected: every route renders the same major screen as baseline
    Evidence: .omo/evidence/task-11-hash-routes.txt and screenshots
  ```

  **Commit**: YES | Message: `refactor(agenda): move prototype orchestration into module` | Files: `src/app/App.tsx`, `src/modules/agenda/**`, tests

- [ ] 12. Expand Mock Service And View Models

  **What to do**: Add `src/modules/agenda/services/agenda-view-model.ts` and expand `agenda-mock-service.ts` to expose UI-ready data:
  - `listAgendaActivities`
  - `listAgendaActivitiesByDay`
  - `getAgendaActivityDetails`
  - `listAgendaActivityReservations`
  - `listAgendaActivityParticipants`
  - `listAgendaActivityTeam`
  Keep raw mocks in `src/mocks/**`. Use readonly types.

  **Must NOT do**: Do not add network calls, `fetch`, SDK imports, auth/session, or organization headers.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 13-17 | Blocked By: 11

  **References**:
  - Raw mock source: `src/mocks/agenda.ts`
  - Existing service: `src/modules/agenda/services/agenda-mock-service.ts`
  - Domain types: `src/types/agenda.ts`, `src/modules/agenda/types.ts`

  **Acceptance Criteria**:
  - [ ] Unit tests cover date filtering, sorting, default id, empty id behavior, participants/reservations mapping.
  - [ ] `rg -n "fetch\\(|Reserve\\.|Sales\\.|X-Organization-ID|better-auth|next-intl" src/modules/agenda src/mocks` returns no matches.
  - [ ] `npm run test` passes.

  **QA Scenarios**:
  ```text
  Scenario: RED mock service behavior
    Tool: bash
    Steps: write a test expecting activities returned sorted by date/time; run before service implementation
    Expected: FAIL for missing/incorrect view-model function
    Evidence: .omo/evidence/task-12-service-red.txt

  Scenario: GREEN mock-only service
    Tool: bash
    Steps: run `npm run test -- src/modules/agenda/services`
    Expected: PASS and mock-only audit returns no backend imports
    Evidence: .omo/evidence/task-12-service-green.txt
  ```

  **Commit**: YES | Message: `refactor(agenda): add mock view-model service boundary` | Files: `src/modules/agenda/services/**`, `src/modules/agenda/types.ts`, tests

- [ ] 13. Contain Legacy Figma Exports Behind Adapters

  **What to do**: Create `docs/audits/figma-export-containment.md`. Add comments to adapter files declaring them the only allowed boundary for `src/imports/**`. Audit direct imports.

  **Must NOT do**: Do not edit the large Figma export internals in this task except comments if unavoidable in adapters.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 14-17 | Blocked By: 12

  **References**:
  - Adapter files: `src/modules/agenda/adapters/*.tsx`
  - Legacy exports: `src/imports/**`

  **Acceptance Criteria**:
  - [ ] Audit document exists and lists all large legacy files.
  - [ ] `rg -n "@/imports|src/imports|\\.\\./.*imports" src --glob "*.ts" --glob "*.tsx"` shows imports only in adapter/legacy boundaries.
  - [ ] Adapter comments explain the temporary boundary.

  **QA Scenarios**:
  ```text
  Scenario: Import boundary audit
    Tool: bash
    Steps: run the `rg` boundary command
    Expected: output is limited to allowed adapter/legacy files documented in audit
    Evidence: .omo/evidence/task-13-import-boundary.txt

  Scenario: Runtime unaffected
    Tool: browser use
    Steps: open #agenda and #atualizacoes after comments/audit
    Expected: screens still render
    Evidence: .omo/evidence/task-13-runtime.png
  ```

  **Commit**: YES | Message: `docs(agenda): define figma export containment boundary` | Files: `docs/audits/figma-export-containment.md`, `src/modules/agenda/adapters/*.tsx`

- [ ] 14. Extract Agenda Status And Reservation Indicators

  **What to do**: Replace repeated status/reservation badge logic in one screen first, starting with `AgendaAtualizacoes`, using maintained components from Task 8. Enforce meeting decision:
  - success: paid/insured/authorized/ok
  - attention: pending/warning/review
  - danger: blocked/canceled/disabled
  - neutral: individual/group reservation indicators

  **Must NOT do**: Do not refactor unrelated tabs/drawers. Do not recolor unrelated Figma elements.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 16, 17 | Blocked By: 13

  **References**:
  - Legacy updates screen: `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`
  - Status component: `src/components/custom/status-badge.tsx`
  - Meeting transcript requirement from user.

  **Acceptance Criteria**:
  - [ ] Tests cover status tone mapping and neutral reservation type indicator.
  - [ ] `#atualizacoes` renders after replacement.
  - [ ] No status component imports lucide or hardcoded hex in maintained code.

  **QA Scenarios**:
  ```text
  Scenario: RED neutral indicator test
    Tool: bash
    Steps: write test asserting reservation type indicator uses neutral tone; run before replacement
    Expected: FAIL before the maintained component is wired
    Evidence: .omo/evidence/task-14-neutral-red.txt

  Scenario: Updates screen badge QA
    Tool: browser use
    Steps: open `http://127.0.0.1:<actual-port>/#atualizacoes` at 1366x768
    Expected: updates screen renders; reservation type indicators are neutral and status badges remain visually distinct
    Evidence: .omo/evidence/task-14-updates-badges.png
  ```

  **Commit**: YES | Message: `refactor(agenda): standardize update status indicators` | Files: status components, focused updates screen edits, tests

- [ ] 15. Extract New Activity Maintained Form Sections

  **What to do**: Refactor `src/modules/agenda/components/AgendaNovaAtividade.tsx` because it is maintained code over 250 LOC:
  - split form shell
  - stepper
  - identification/capacity section
  - date/time section
  - visibility/settings section
  - footer actions using `SaveButton`
  Use shadcn controls and semantic tokens.

  **Must NOT do**: Do not change form business behavior or add persistence.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 16 | Blocked By: 13

  **References**:
  - Current file: `src/modules/agenda/components/AgendaNovaAtividade.tsx`
  - Form patterns: Admin `modules/settings/**/components/*form*.tsx` read-only
  - `SaveButton`: `src/components/custom/save-button.tsx`

  **Acceptance Criteria**:
  - [ ] No resulting maintained component file exceeds 250 pure LOC.
  - [ ] Existing `#novaAtividade` behavior remains visible.
  - [ ] Native `<button>`/`<input>` are replaced where shadcn equivalents apply.
  - [ ] Tests cover step navigation/submit-disabled states if present.

  **QA Scenarios**:
  ```text
  Scenario: RED new activity characterization
    Tool: bash
    Steps: write test for current first step title and primary action; run before splitting
    Expected: PASS against old code before refactor, then remains green after refactor
    Evidence: .omo/evidence/task-15-characterization.txt

  Scenario: New activity browser QA
    Tool: browser use
    Steps: open `http://127.0.0.1:<actual-port>/#novaAtividade`, interact with first step controls
    Expected: form renders, controls are focusable, no console crash, visual layout remains usable
    Evidence: .omo/evidence/task-15-nova-atividade.png
  ```

  **Commit**: YES | Message: `refactor(agenda): split new activity prototype form` | Files: `src/modules/agenda/components/**`, tests

- [ ] 16. Extract Agenda Month And Day Screen Components Incrementally

  **What to do**: Extract maintained components from the month/day Figma exports in small slices:
  - metric cards
  - activity card/chip
  - day empty state
  - calendar/day header
  - view mode switcher
  Wire one slice per commit if implementation becomes large.

  **Must NOT do**: Do not rewrite the entire 3000-line Figma files at once.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 17 | Blocked By: 14, 15

  **References**:
  - Month export: `src/imports/AgendaMes/AgendaMes-13-9535.tsx`
  - Day export: `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`
  - Existing helper: `src/lib/agenda/activityCard.ts`
  - Mock service boundary: `src/modules/agenda/services/**`

  **Acceptance Criteria**:
  - [ ] Each extracted component has focused tests.
  - [ ] `#agenda` and `#agendaDia` screenshots remain visually equivalent at the touched regions.
  - [ ] Maintained extracted components do not hardcode hex/rgb or use lucide.

  **QA Scenarios**:
  ```text
  Scenario: RED extracted activity card test
    Tool: bash
    Steps: write test for activity card status/occupancy rendering before component implementation
    Expected: FAIL before implementation
    Evidence: .omo/evidence/task-16-activity-card-red.txt

  Scenario: Month/day browser QA
    Tool: browser use
    Steps: open #agenda then click/select path to #agendaDia, or load both hashes directly
    Expected: both screens render and navigation remains functional
    Evidence: .omo/evidence/task-16-agenda-month.png and .omo/evidence/task-16-agenda-dia.png
  ```

  **Commit**: YES | Message: `refactor(agenda): extract month and day primitives` | Files: focused component files, focused Figma export replacements, tests

- [ ] 17. Extract Updates Tabs And Participant Rows

  **What to do**: Continue replacing the largest updates screen with maintained components:
  - tab nav
  - participant/reservation row
  - bulk-action toolbar
  - empty/loading states
  - detail summary/sidebar where safe

  **Must NOT do**: Do not redesign update workflows or add persistence. Keep local state behavior.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 18 | Blocked By: 16

  **References**:
  - `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`
  - `src/imports/AgendaVisaoGeral/AgendaVisaoGeral.tsx`
  - `src/types/agenda.ts`
  - `src/modules/agenda/services/**`

  **Acceptance Criteria**:
  - [ ] Maintained updates components have tests for tab switching/filtering/empty state.
  - [ ] `#atualizacoes` browser QA passes desktop/mobile.
  - [ ] Legacy file size is reduced or at least new logic moves out of it.

  **QA Scenarios**:
  ```text
  Scenario: RED updates tabs test
    Tool: bash
    Steps: write test for tab switch from Atualizações to Participantes before extraction
    Expected: characterization passes before refactor and remains green after extraction
    Evidence: .omo/evidence/task-17-tabs-characterization.txt

  Scenario: Updates mobile QA
    Tool: browser use
    Steps: open #atualizacoes at 375x812, switch tab if visible
    Expected: no horizontal breakage; tab/row content usable
    Evidence: .omo/evidence/task-17-updates-mobile.png
  ```

  **Commit**: YES | Message: `refactor(agenda): extract updates participant sections` | Files: focused updates components, tests

- [ ] 18. Remove Or Quarantine Non-Admin Dependencies From Maintained Code

  **What to do**: Audit maintained code for forbidden imports and hardcoded style debt:
  - `lucide-react`
  - `@mui/material`
  - `@mui/icons-material`
  - `fetch(`
  - `better-auth`
  - `next-intl`
  - `@hey-api`
  - hardcoded hex/rgb outside `src/imports/**` and documented exceptions
  Replace lucide in maintained surfaces with HugeIcons. Do not remove package dependencies until source imports are gone and tests pass.

  **Must NOT do**: Do not remove a dependency while `src/components/ui` still imports it. Do not edit Admin.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 19 | Blocked By: 17

  **References**:
  - `package.json`
  - `src/components/ui/**`
  - `src/modules/**`
  - Admin icon rule: HugeIcons only

  **Acceptance Criteria**:
  - [ ] Audit commands saved under `.omo/evidence`.
  - [ ] Maintained code has no forbidden imports.
  - [ ] Any remaining forbidden imports are documented as legacy `src/imports` or managed shadcn debt.

  **QA Scenarios**:
  ```text
  Scenario: Forbidden import audit
    Tool: bash
    Steps: run `rg -n "lucide-react|@mui|better-auth|next-intl|@hey-api|fetch\\(" src --glob "!src/imports/**"`
    Expected: no matches or documented allowed shadcn-managed debt
    Evidence: .omo/evidence/task-18-forbidden-imports.txt

  Scenario: Hardcoded color audit
    Tool: bash
    Steps: run `rg -n "#[0-9a-fA-F]{3,8}|rgb\\(|rgba\\(" src --glob "!src/imports/**" --glob "*.{ts,tsx,css}"`
    Expected: no unreviewed hardcoded colors in maintained code
    Evidence: .omo/evidence/task-18-colors.txt
  ```

  **Commit**: YES | Message: `refactor(quality): quarantine non-admin prototype dependencies` | Files: focused source/package changes if safe, audit docs

- [ ] 19. Final Full Verification And Browser QA

  **What to do**: Run full command gates and browser QA:

  ```bash
  npm run format:check
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```

  Start Vite and capture desktop/mobile screenshots for:
  - `#agenda`
  - `#agendaDia`
  - `#atualizacoes`
  - `#novaAtividade`
  - unknown hash fallback, e.g. `#doesNotExist`

  **Must NOT do**: Do not mark ready from tests alone.

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: 20 | Blocked By: 18

  **References**:
  - Real user surface: Vite localhost URL.
  - Hash navigation hook: `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`

  **Acceptance Criteria**:
  - [ ] All commands pass.
  - [ ] Browser screenshots saved for desktop and mobile.
  - [ ] Unknown hash falls back to Agenda.
  - [ ] Admin repo status checked one final time and unchanged from Task 1.

  **QA Scenarios**:
  ```text
  Scenario: Full command gate
    Tool: bash
    Steps: run all five npm commands listed above
    Expected: every command exits 0
    Evidence: .omo/evidence/task-19-command-gate.txt

  Scenario: Full browser route gate
    Tool: browser use
    Steps: open all listed hashes at desktop 1366x768 and mobile 375x812
    Expected: each route renders correct major screen and no blank page/console crash
    Evidence: .omo/evidence/task-19-*.png
  ```

  **Commit**: NO | Message: none | Files: `.omo/evidence/**`

- [ ] 20. Write Admin Alignment Readiness Report

  **What to do**: Create `docs/audits/admin-alignment-readiness.md` summarizing:
  - completed alignment areas
  - remaining legacy Figma exports
  - remaining managed shadcn debt, if any
  - exact migration guidance for future Admin implementation
  - final Admin read-only status evidence

  **Must NOT do**: Do not claim Admin migration is complete. This is prototype readiness only.

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: final | Blocked By: 19

  **References**:
  - Evidence files under `.omo/evidence/**`
  - Audits under `docs/audits/**`
  - This plan.

  **Acceptance Criteria**:
  - [ ] Report exists and references command/browser evidence.
  - [ ] Report lists exactly what remains in `src/imports/**`.
  - [ ] Report states future Admin migration should port maintained components/services, not Figma exports.

  **QA Scenarios**:
  ```text
  Scenario: Readiness report includes evidence references
    Tool: bash
    Steps: run `rg -n "Evidence|src/imports|Admin read-only|mock-only|Future Admin migration" docs/audits/admin-alignment-readiness.md`
    Expected: all required report sections are present
    Evidence: .omo/evidence/task-20-readiness-report.txt

  Scenario: Goal scope audit
    Tool: bash
    Steps: run final Admin git status and prototype `git diff --name-only`
    Expected: Admin unchanged; prototype changes are limited to planned files
    Evidence: .omo/evidence/task-20-scope-audit.txt
  ```

  **Commit**: YES | Message: `docs(readiness): record prototype admin-alignment status` | Files: `docs/audits/admin-alignment-readiness.md`

## Final Verification Wave

> ALL must APPROVE. Present consolidated results to user and get explicit okay before completing implementation work.

- [ ] F1. Plan Compliance Audit
  - Verify every task above has references, acceptance criteria, QA scenarios, and commit strategy.

- [ ] F2. Code Quality Review
  - Review final diff for strict TypeScript, no forbidden imports, no hardcoded colors in maintained code, no accidental Admin mutations.

- [ ] F3. Real Manual QA
  - Drive the Vite app in a browser for all hash routes at desktop and mobile. Save screenshots.

- [ ] F4. Scope Fidelity Check
  - Confirm no backend/Next/auth/API/SDK work was introduced and prototype remains mock-only.

## Commit Strategy

- Do not auto-commit unless Luana explicitly approves during execution.
- Each task lists a draft Conventional Commit message for workers.
- If the team chooses to use Retrilhar Admin-style commit messages instead, map each message at commit time to `[front] [ADD|UP|FIX|TEST] escopo — descrição em PT-BR` without changing task boundaries.
- Never `git add .`; stage exact files per task.
- Never commit `.omo/evidence/**` unless the team wants evidence in git. Evidence may remain local.

## Success Criteria

- Official execution plan exists at `.omo/plans/prototype-admin-alignment.md`.
- Earlier `docs/superpowers/plans/*` files are treated as superseded drafts, not execution source of truth.
- Every implementation task has:
  - concrete file references
  - blocked-by/blocking information
  - acceptance criteria
  - at least one command/test QA scenario
  - at least one real-surface/browser scenario for UI work
  - commit strategy
- The Admin read-only invariant is repeated in guardrails, tasks, and final verification.
- The plan is decision-complete: a worker can execute without choosing architecture, stack, route strategy, test strategy, or migration boundaries.
