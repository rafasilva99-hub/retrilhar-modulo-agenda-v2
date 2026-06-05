# Frontend Maturation Remaining Work

## TL;DR
> **Summary**: Finish the Admin-aligned frontend maturation of the Vite agenda prototype after the completed test/guardrail slice, without touching Retrilhar Admin and without adding backend/runtime concerns.
> **Deliverables**:
> - Admin-compatible theme/config audit and UI quarantine report.
> - `src/components/custom/**` and `src/components/skeleton/**` primitives copied/adapted into the prototype.
> - Shell/domain type split, agenda module orchestration, and consistent hash-route shell behavior.
> - Expanded mock service/view-model boundary for agenda screens.
> - Figma export containment and incremental extraction plan for maintained agenda components.
> - Final readiness report proving what is migration-ready and what remains legacy.
> **Effort**: Large
> **Parallel**: YES - 5 waves with limited parallelism after baseline gates.
> **Critical Path**: Task 1 -> Task 2 -> Task 5 -> Task 6 -> Task 8 -> Task 12 -> Final Verification

## Context

### Original Request
The user wants the prototype at `/Users/luana/Desktop/retrilhar-modulo-agenda-v2` refactored so it is much closer to the frontend quality and conventions of `/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin`, while remaining a mock-only prototype. The Admin repository must never be dirtied or mutated.

### Current State
- First preparatory slice is complete:
  - `package.json` now has `test` and `test:watch`.
  - Vitest, React Testing Library, jest-dom, user-event, and jsdom are installed.
  - `src/app/App.test.tsx` characterizes hash routing.
  - `src/test/prototype-guardrails.test.ts` enforces mock-only/Admin-read-only guardrails.
  - `.claude/rules/agenda-fidelity.md` exists.
  - `npm run lint`, `npm run test`, `npm run typecheck`, and `npm run build` passed in the ULW evidence.
- The old plan `.omo/plans/prototype-admin-alignment.md` is still useful as context, but it is no longer the execution source of truth for remaining work because it still lists tasks 1-5 as pending.
- The current worktree is dirty from the completed preparatory slice and planning artifacts. Do not revert user or prior-agent work.

### Research Findings
- `components.json` in the prototype already mirrors Admin for `style: "radix-luma"`, `iconLibrary: "hugeicons"`, `menuColor: "inverted-translucent"`, and `menuAccent: "subtle"`. It correctly keeps Vite-safe `rsc: false` and `tailwind.css: "src/styles/index.css"`.
- `src/app/App.tsx:11` still owns route branching; `#atualizacoes` and `#novaAtividade` bypass `AppShell`.
- `src/components/layout/types.ts:1` reexports layout types from `src/mocks/shell.ts`, so shell contracts are still coupled to mock data.
- `src/components/custom` and `src/components/skeleton` do not exist, while Admin has reference primitives under `components/custom/**` and `components/skeleton/**`.
- `src/modules/agenda/services/agenda-mock-service.ts:1` only exposes a small activity service. Figma exports still consume broad mock arrays directly.
- Large legacy surfaces remain:
  - `src/mocks/agenda.ts`: 2699 lines.
  - `src/modules/agenda/components/AgendaNovaAtividade.tsx`: 551 lines.
  - `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`: 3985 lines.
  - `src/imports/AgendaMes/AgendaMes-13-9535.tsx`: 3270 lines.
  - `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`: 3034 lines.
- `lucide-react` remains in generated/managed `src/components/ui/**`; MUI dependencies remain in `package.json` but source imports were not found outside ignored legacy areas.

### Metis Review
The Metis-style subagent was spawned but did not return a substantive answer after follow-up. These self-resolved Metis gaps are incorporated:
- Do not use broad `lint:fix`, broad Prettier, or broad shadcn regeneration.
- Treat `src/components/ui/**` as generated/managed; audit and quarantine first, edit only named files with evidence.
- Do not remove `lucide-react` until every non-legacy import has a replacement or an explicit generated-component exception.
- Do not try to rewrite all Figma exports in one pass.
- Do not make Admin parity mean Next.js parity. Admin patterns are frontend structure, tokens, shadcn config, layout primitives, icons, and module organization only.
- Every task must run existing characterization tests and browser QA for touched hash routes.

## Work Objectives

### Core Objective
Move the agenda prototype from "Figma export with a test harness" to "Admin-compatible frontend architecture with legacy Figma screens contained behind clear boundaries", while preserving current browser behavior and mock-only constraints.

### Deliverables
- A current Admin-alignment audit document under `docs/audits/`.
- Admin-compatible custom and skeleton primitives under `src/components/custom/**` and `src/components/skeleton/**`.
- Layout types owned by `src/components/layout/types.ts`, with `src/mocks/shell.ts` reduced to mock data.
- A thin `src/app/App.tsx` that delegates agenda rendering to `src/modules/agenda`.
- A normalized shell policy for `#agenda`, `#agendaDia`, `#atualizacoes`, and `#novaAtividade`, with intentional exceptions documented.
- Expanded `src/modules/agenda/services/**` view-model boundary.
- Adapter containment documentation for `src/imports/**`.
- Extracted maintained components for status/reservation indicators and the new activity form.
- Dependency quarantine/readiness report for lucide/MUI/next-themes.

### Definition of Done
- `npm run lint` passes.
- `npm run test` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- Targeted Prettier check passes for all touched files.
- Browser QA passes for `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, and `#doesNotExist`.
- `rg -n "better-auth|next-intl|@hey-api|fetch\\(|next/link|next/image|OpenAPI|X-Organization-ID" src --glob "!src/imports/**" --glob "!src/test/**"` returns no production matches.
- Admin status is captured before and after, with evidence that only read-only commands were run against Admin.

### Must Have
- Preserve Vite, React 18, hash routing, and local mock data.
- Use existing tests as characterization gates before refactors.
- Prefer HugeIcons and existing shadcn primitives for new maintained code.
- Keep edits atomic and reversible.
- Preserve visual/user-test fidelity for agenda routes.

### Must NOT Have
- No mutations in Retrilhar Admin.
- No Next.js/App Router/RSC migration.
- No `better-auth`, `next-intl`, OpenAPI SDK, real API, `fetch`, org headers, Sentry, PWA, or backend integration.
- No broad rewrite of Figma exports.
- No broad manual edits to `src/components/ui/**`.
- No dependency upgrades to chase Admin versions, especially no React 19 migration.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.

- Test decision: TDD/characterization with existing Vitest + React Testing Library + jsdom.
- QA policy: Every task has agent-executed CLI checks and at least one real browser/tmux scenario.
- Evidence root: `.omo/evidence/remaining-task-{N}-*.{txt,md,json,png}`.
- Browser QA base URL: start Vite with `npm run dev -- --host 127.0.0.1 --port 5174`; if occupied, use Vite's printed fallback port and record it.
- Cleanup policy: kill only QA-spawned Vite sessions, close browser tabs/contexts, verify no listener on the QA port, and record cleanup receipt.

## Execution Strategy

### Parallel Execution Waves
Wave 1: Tasks 1-4. Audit/config/primitives can run after a fresh baseline; do not edit `src/components/ui/**` yet.

Wave 2: Tasks 5-7. Layout type split, shell normalization, and module orchestration are tightly related; execute in order.

Wave 3: Tasks 8-10. Mock service/view models and Figma adapter containment must precede component extraction.

Wave 4: Tasks 11-14. Extract maintained components incrementally. One screen family at a time to avoid conflicts in large files.

Wave 5: Tasks 15-16 plus final verification. Dependency quarantine and readiness report close the loop.

### Dependency Matrix
| Task | Depends On | Blocks | Can Parallelize With |
| --- | --- | --- | --- |
| 1. Fresh Baseline And Admin Guard | Completed first slice | All tasks | None |
| 2. Admin Config And Theme Audit | 1 | 3, 15 | 4 |
| 3. UI Inventory And Quarantine | 1, 2 | 15 | 4 |
| 4. Add Custom And Skeleton Primitives | 1, 2 | 6, 11, 12 | 3 |
| 5. Split Layout Types From Mock Data | 1 | 6, 7 | None |
| 6. Normalize Shell Route Policy | 4, 5 | 7, 16 | None |
| 7. Move Agenda Orchestration Into Module | 5, 6 | 8, 16 | None |
| 8. Expand Mock Service View Models | 7 | 9, 11, 12, 13 | None |
| 9. Contain Figma Exports Behind Adapters | 8 | 10-14 | None |
| 10. Split Large Mock Data By Domain | 8, 9 | 11-14 | None |
| 11. Extract Status And Reservation Indicators | 8, 9 | 13, 14 | 12 |
| 12. Extract New Activity Form Sections | 4, 8, 9 | 16 | 11 |
| 13. Extract Month And Day Primitives | 10, 11 | 16 | None |
| 14. Extract Updates Participant Sections | 10, 11 | 16 | None |
| 15. Dependency Quarantine And Package Audit | 2, 3, 11-14 | 16 | None |
| 16. Readiness Report And Final QA | All | Final Verification | None |

## TODOs

- [ ] 1. Fresh Baseline And Admin Guard

  **What to do**: Capture the current post-slice state before any remaining refactor. Save prototype `git status --short`, Admin `git status --short`, current package scripts, existing tests, and QA port availability to `.omo/evidence/remaining-task-1-baseline.txt`.

  **Must NOT do**: Do not edit any source file. Do not run any mutating command in Admin. Do not kill unrelated dev servers; record occupied ports instead.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: all tasks | Blocked By: completed first slice

  **References**:
  - Prototype dirty state: `package.json`, `vite.config.ts`, `.claude/rules/agenda-fidelity.md`, `src/app/App.test.tsx`.
  - Admin read-only rule: `.claude/rules/agenda-fidelity.md`.

  **Acceptance Criteria**:
  - [ ] `.omo/evidence/remaining-task-1-baseline.txt` exists.
  - [ ] Evidence includes prototype and Admin statuses.
  - [ ] Evidence includes `npm run lint`, `npm run test`, `npm run typecheck`, `npm run build` outputs or explicit failure diagnosis.
  - [ ] Evidence confirms no Admin mutation command was run.

  **QA Scenarios**:
  ```text
  Scenario: Baseline CLI gate
    Tool: tmux
    Steps: tmux new-session -d -s ulw-qa-remaining-1 "cd /Users/luana/Desktop/retrilhar-modulo-agenda-v2 && git status --short && npm run lint && npm run test && npm run typecheck && npm run build"
    Expected: Commands finish; status and command outputs captured; any failure is recorded as baseline, not fixed in this task.
    Evidence: .omo/evidence/remaining-task-1-baseline.txt

  Scenario: Admin remains read-only
    Tool: tmux
    Steps: run only `git -C '/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin' status --short`
    Expected: Status captured; no mutating Admin command appears in shell history/evidence.
    Evidence: .omo/evidence/remaining-task-1-admin-readonly.txt
  ```

  **Commit**: NO | Message: none | Files: `.omo/evidence/**`

- [ ] 2. Admin Config And Theme Audit

  **What to do**: Compare prototype `components.json`, `src/styles/index.css`, `src/styles/tailwind.css`, `src/styles/theme.css`, and font handling against Admin `components.json` and `app/globals.css`. Produce `docs/audits/admin-config-theme-parity.md` with exact "already aligned", "Vite-safe divergence", and "needs implementation" sections. Only edit config/theme if the audit finds a concrete mismatch that is safe in Vite.

  **Must NOT do**: Do not copy Admin `rsc: true`, `app/globals.css` path, Next `localFont`, or Next-only theme mechanisms. Do not mutate Admin.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 3, 4, 15 | Blocked By: 1

  **References**:
  - Prototype config: `components.json`.
  - Admin config: `/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin/components.json`.
  - Prototype styles: `src/styles/**`.
  - Admin global CSS: `/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin/app/globals.css`.

  **Acceptance Criteria**:
  - [ ] Audit document exists and names each compared file.
  - [ ] `components.json` remains `rsc: false` in prototype.
  - [ ] `rg -n "@custom-variant dark|shadcn/tailwind.css|tw-animate-css" src/styles` shows expected Vite theme imports/variant or audit records the exact missing change.
  - [ ] `npm run test -- --run src/test/prototype-guardrails.test.ts` passes.

  **QA Scenarios**:
  ```text
  Scenario: Theme/config parity is explicit
    Tool: tmux
    Steps: run `rg -n "radix-luma|hugeicons|inverted-translucent|subtle|rsc: false|Vite-safe" docs/audits/admin-config-theme-parity.md components.json`
    Expected: Every required term appears in either config or audit.
    Evidence: .omo/evidence/remaining-task-2-config-audit.txt

  Scenario: Theme changes do not break routes
    Tool: browser
    Steps: start Vite and open `/#agenda` and `/#novaAtividade` at 1366x768.
    Expected: Both routes render nonblank content and keep expected hash.
    Evidence: .omo/evidence/remaining-task-2-browser.md
  ```

  **Commit**: YES | Message: `docs(theme): audit admin config parity` | Files: `docs/audits/admin-config-theme-parity.md`, optional focused style/config changes

- [ ] 3. UI Inventory And Quarantine

  **What to do**: Inventory `src/components/ui/**` against Admin's `components/ui/**`. Create `docs/audits/shadcn-ui-quarantine.md` that classifies files as `aligned`, `generated exception`, `needs wrapper`, or `candidate for later replacement`. Keep lucide-bearing generated files as documented exceptions until a task explicitly replaces them.

  **Must NOT do**: Do not mass edit `src/components/ui/**`. Do not remove `lucide-react`, `next-themes`, or MUI in this task.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 15 | Blocked By: 1, 2

  **References**:
  - Current lucide imports: `src/components/ui/pagination.tsx`, `resizable.tsx`, `carousel.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `context-menu.tsx`.
  - Current next-themes import: `src/components/ui/sonner.tsx`.
  - Guardrail test: `src/test/prototype-guardrails.test.ts`.

  **Acceptance Criteria**:
  - [ ] Audit document lists every `lucide-react` and `next-themes` non-legacy import.
  - [ ] Audit states why generated exceptions are temporarily allowed.
  - [ ] No `src/components/ui/**` file is changed except audit-referenced single-file fixes if required by lint/typecheck.
  - [ ] `npm run lint` passes.

  **QA Scenarios**:
  ```text
  Scenario: Quarantine captures all known exceptions
    Tool: tmux
    Steps: run `rg -n "lucide-react|next-themes|@mui" src package.json --glob "!src/imports/**"` and compare to audit table.
    Expected: Every match is listed in the audit with classification.
    Evidence: .omo/evidence/remaining-task-3-quarantine.txt

  Scenario: Guardrail still allows documented generated exceptions only
    Tool: tmux
    Steps: run `npm run test -- --run src/test/prototype-guardrails.test.ts`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-3-guardrail.txt
  ```

  **Commit**: YES | Message: `docs(ui): audit generated shadcn exceptions` | Files: `docs/audits/shadcn-ui-quarantine.md`

- [ ] 4. Add Admin-Compatible Custom And Skeleton Primitives

  **What to do**: Add Vite-safe prototype equivalents for the Admin primitives most useful to agenda work:
  - `src/components/custom/save-button.tsx`
  - `src/components/custom/data-list.tsx`
  - `src/components/custom/cards/stats.tsx`
  - `src/components/skeleton/card.tsx`
  - `src/components/skeleton/table.tsx`
  Keep APIs small and compatible with the prototype; use existing `Button`, `Card`, `Table`, `Skeleton`, `cn`, and HugeIcons.

  **Must NOT do**: Do not copy Admin imports that depend on Next, server actions, auth, org context, or API types. Do not add business behavior.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 6, 11, 12 | Blocked By: 1, 2

  **References**:
  - Admin read-only references: `components/custom/save-button.tsx`, `components/custom/data-list.tsx`, `components/custom/cards/stats.tsx`, `components/skeleton/card.tsx`, `components/skeleton/table.tsx`.
  - Prototype primitives: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/table.tsx`, `src/components/ui/skeleton.tsx`.

  **Acceptance Criteria**:
  - [ ] New components compile under Vite.
  - [ ] Tests cover at least one state/variant per custom primitive.
  - [ ] No imports from Admin paths.
  - [ ] `npm run test`, `npm run lint`, and `npm run typecheck` pass.

  **QA Scenarios**:
  ```text
  Scenario: Custom primitives render in isolation through tests
    Tool: tmux
    Steps: run `npm run test -- --run src/components/custom src/components/skeleton`
    Expected: PASS with tests for save button loading/disabled and skeleton/table structure.
    Evidence: .omo/evidence/remaining-task-4-tests.txt

  Scenario: No Admin or backend coupling
    Tool: tmux
    Steps: run `rg -n "Retrilhar Admin|better-auth|@hey-api|next/link|fetch\\(" src/components/custom src/components/skeleton`
    Expected: No forbidden matches except comments explicitly saying Admin is read-only reference if present.
    Evidence: .omo/evidence/remaining-task-4-guardrail.txt
  ```

  **Commit**: YES | Message: `feat(components): add admin-compatible primitives` | Files: `src/components/custom/**`, `src/components/skeleton/**`, tests

- [ ] 5. Split Layout Types From Mock Data

  **What to do**: Move `AppPage`, `ShellNavItem`, `ShellProfile`, and `ShellOrganization` definitions into `src/components/layout/types.ts`. Make `src/mocks/shell.ts` import those types and export only mock data. Preserve `AppProfile`, `MenuItem`, and `Organization` aliases if existing layout code expects them.

  **Must NOT do**: Do not change nav labels, active-page semantics, or hash route names.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 6, 7 | Blocked By: 1

  **References**:
  - Current coupling: `src/components/layout/types.ts:1` reexports from mocks.
  - Current mock data/types: `src/mocks/shell.ts:12`.
  - Current imports: `src/components/layout/app-shell.tsx:4`, `src/components/layout/app-layout.tsx:5`.

  **Acceptance Criteria**:
  - [ ] `src/components/layout/types.ts` owns the layout types.
  - [ ] `src/mocks/shell.ts` imports types with `import type`.
  - [ ] Existing hash route tests pass unchanged.
  - [ ] `npm run typecheck` passes.

  **QA Scenarios**:
  ```text
  Scenario: Layout type split preserves app behavior
    Tool: tmux
    Steps: run `npm run test -- --run src/app/App.test.tsx && npm run typecheck`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-5-tests.txt

  Scenario: Mock module no longer defines layout contracts
    Tool: tmux
    Steps: run `rg -n "export type AppPage|export interface Shell" src/mocks/shell.ts src/components/layout/types.ts`
    Expected: Type/interface exports appear in `types.ts`, not as declarations in `src/mocks/shell.ts`.
    Evidence: .omo/evidence/remaining-task-5-type-ownership.txt
  ```

  **Commit**: YES | Message: `refactor(layout): decouple shell types from mocks` | Files: `src/components/layout/types.ts`, `src/mocks/shell.ts`, affected imports/tests

- [ ] 6. Normalize Shell Route Policy

  **What to do**: Decide and implement one explicit shell policy:
  - `#agenda` and `#agendaDia` stay inside `AppShell`.
  - `#atualizacoes` should be wrapped in `AppShell` only if visual QA confirms it does not double-render the legacy side nav; otherwise keep it full-screen and document the exception in `docs/audits/shell-route-policy.md`.
  - `#novaAtividade` should stay full-screen only if it intentionally represents a focused creation flow; otherwise wrap it in `AppShell` with `AppPage`.
  The decision must be documented and tested.

  **Must NOT do**: Do not rewrite internals of large Figma exports in this task. Do not change route names.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 7, 16 | Blocked By: 4, 5

  **References**:
  - Current branching: `src/app/App.tsx:14`, `src/app/App.tsx:18`, `src/app/App.tsx:28`, `src/app/App.tsx:47`.
  - Shell active agenda special-case: `src/components/layout/app-sidebar.tsx`.
  - Tests: `src/app/App.test.tsx`.

  **Acceptance Criteria**:
  - [ ] `docs/audits/shell-route-policy.md` names all four routes and their shell/full-screen policy.
  - [ ] Tests assert the shell policy for all four routes using stable text/landmarks.
  - [ ] Direct hash loads still pass for all routes.
  - [ ] Browser QA captures desktop/mobile for all routes.

  **QA Scenarios**:
  ```text
  Scenario: Direct routes respect shell policy
    Tool: browser
    Steps: start Vite, open `/#agenda`, `/#agendaDia`, `/#atualizacoes`, `/#novaAtividade` at 1366x768.
    Expected: Each route renders; shell/full-screen behavior matches `docs/audits/shell-route-policy.md`.
    Evidence: .omo/evidence/remaining-task-6-browser-desktop.md

  Scenario: Mobile routes remain navigable
    Tool: browser
    Steps: open the same four hashes at 375x812.
    Expected: Nonblank content, no incoherent overlap in the first viewport, expected hash retained.
    Evidence: .omo/evidence/remaining-task-6-browser-mobile.md
  ```

  **Commit**: YES | Message: `refactor(layout): document and normalize agenda shell policy` | Files: `src/app/App.tsx`, `docs/audits/shell-route-policy.md`, tests, focused layout changes

- [ ] 7. Move Agenda Orchestration Into Module

  **What to do**: Create a module-level orchestrator such as `src/modules/agenda/agenda-prototype.tsx` or `src/modules/agenda/pages/agenda-prototype.tsx`. Move the branching currently in `src/app/App.tsx` into that module. Leave `App.tsx` thin: import and render the agenda prototype entry.

  **Must NOT do**: Do not change navigation behavior, selected activity behavior, selected day behavior, or route hash names.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 8, 16 | Blocked By: 5, 6

  **References**:
  - Current orchestration: `src/app/App.tsx:11`.
  - Navigation hook: `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`.
  - Module exports: `src/modules/agenda/index.ts`.

  **Acceptance Criteria**:
  - [ ] `src/app/App.tsx` is thin and contains no route-specific branch logic.
  - [ ] Agenda module owns prototype orchestration.
  - [ ] Existing route tests pass.
  - [ ] A test asserts unknown hash fallback still reaches Agenda.

  **QA Scenarios**:
  ```text
  Scenario: App entry remains route-compatible
    Tool: tmux
    Steps: run `npm run test -- --run src/app/App.test.tsx`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-7-tests.txt

  Scenario: Browser direct hash smoke
    Tool: browser
    Steps: start Vite and open `/#doesNotExist`, then evaluate `location.hash` and body text.
    Expected: `location.hash === "#agenda"` and body includes Agenda content.
    Evidence: .omo/evidence/remaining-task-7-browser-fallback.json
  ```

  **Commit**: YES | Message: `refactor(agenda): move prototype orchestration into module` | Files: `src/app/App.tsx`, `src/modules/agenda/**`, tests

- [ ] 8. Expand Mock Service View Models

  **What to do**: Expand `src/modules/agenda/services/agenda-mock-service.ts` into a typed service boundary for current screens. Add view-model helpers for:
  - dashboard/month stats.
  - day activity list.
  - selected activity detail.
  - reservations/participants.
  - responsible team/guide summaries.
  - holidays.
  Split service files only if `agenda-mock-service.ts` would exceed 250 pure LOC.

  **Must NOT do**: Do not add network calls, MSW, fetch, SDK, auth, or async fake APIs unless tests prove a UI need. Keep services synchronous local mocks for now.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 9, 10, 11, 12, 13, 14 | Blocked By: 7

  **References**:
  - Current service: `src/modules/agenda/services/agenda-mock-service.ts:12`.
  - Current types barrel: `src/modules/agenda/types.ts:1`.
  - Source mocks: `src/mocks/agenda.ts`.

  **Acceptance Criteria**:
  - [ ] Unit tests cover sorting, unknown IDs, default activity fallback, and empty result behavior.
  - [ ] Maintained code can import view models from `src/modules/agenda/services`.
  - [ ] Forbidden import audit stays empty.
  - [ ] `npm run test` and `npm run typecheck` pass.

  **QA Scenarios**:
  ```text
  Scenario: Service returns stable view models
    Tool: tmux
    Steps: run `npm run test -- --run src/modules/agenda/services`
    Expected: PASS, including tests for default activity and unknown activity id.
    Evidence: .omo/evidence/remaining-task-8-service-tests.txt

  Scenario: Mock-only guardrail
    Tool: tmux
    Steps: run `rg -n "fetch\\(|better-auth|@hey-api|X-Organization-ID|next-intl" src/modules/agenda src/mocks --glob "!src/imports/**"`
    Expected: No matches.
    Evidence: .omo/evidence/remaining-task-8-mock-only.txt
  ```

  **Commit**: YES | Message: `refactor(agenda): expand mock view-model services` | Files: `src/modules/agenda/services/**`, `src/modules/agenda/types.ts`, tests

- [ ] 9. Contain Figma Exports Behind Adapters

  **What to do**: Make adapter boundaries explicit. Each adapter under `src/modules/agenda/adapters/**` should be the only maintained module that imports from `src/imports/**`. Add `docs/audits/figma-export-containment.md` listing every import from `src/imports/**`, the adapter owning it, and the replacement path.

  **Must NOT do**: Do not edit large Figma export internals except to fix compile errors caused by adapter boundary changes.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 10-14 | Blocked By: 8

  **References**:
  - Adapters: `src/modules/agenda/adapters/figma-agenda-month-page.tsx`, `figma-agenda-day-page.tsx`, `figma-agenda-updates-page.tsx`.
  - Legacy exports: `src/imports/**`.

  **Acceptance Criteria**:
  - [ ] `rg -n "src/imports|@/imports|\\.\\./\\.\\./imports" src --glob "!src/modules/agenda/adapters/**"` returns no maintained imports outside adapters, or audit documents a temporary exception.
  - [ ] Each adapter has a short comment naming it as legacy containment.
  - [ ] Browser QA for `#agenda`, `#agendaDia`, and `#atualizacoes` still passes.

  **QA Scenarios**:
  ```text
  Scenario: Legacy imports are contained
    Tool: tmux
    Steps: run import-boundary `rg` commands and compare to audit.
    Expected: Only adapters import legacy Figma exports.
    Evidence: .omo/evidence/remaining-task-9-boundary.txt

  Scenario: Containment does not break legacy screens
    Tool: browser
    Steps: open `/#agenda`, `/#agendaDia`, `/#atualizacoes`.
    Expected: Nonblank content and expected hash for each.
    Evidence: .omo/evidence/remaining-task-9-browser.md
  ```

  **Commit**: YES | Message: `docs(agenda): contain figma exports behind adapters` | Files: `src/modules/agenda/adapters/**`, `docs/audits/figma-export-containment.md`

- [ ] 10. Split Large Mock Data By Domain

  **What to do**: Split `src/mocks/agenda.ts` into domain files without changing public exports:
  - `src/mocks/agenda/activities.ts`
  - `src/mocks/agenda/reservations.ts`
  - `src/mocks/agenda/guides.ts`
  - `src/mocks/agenda/holidays.ts`
  - `src/mocks/agenda/status.ts`
  - keep `src/mocks/agenda.ts` as compatibility barrel if needed.

  **Must NOT do**: Do not change mock values or business semantics. Do not update all Figma exports to new import paths in this task.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 11-14 | Blocked By: 8, 9

  **References**:
  - Large file: `src/mocks/agenda.ts`.
  - Types: `src/types/agenda.ts`, `src/modules/agenda/types.ts`.
  - Current service imports: `src/modules/agenda/services/agenda-mock-service.ts:3`.

  **Acceptance Criteria**:
  - [ ] Public imports from `@/mocks/agenda` still work.
  - [ ] Tests prove counts/default IDs are unchanged before/after split.
  - [ ] `npm run test`, `npm run typecheck`, and `npm run build` pass.

  **QA Scenarios**:
  ```text
  Scenario: Mock split preserves public contract
    Tool: tmux
    Steps: run `npm run test -- --run src/modules/agenda/services src/app/App.test.tsx`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-10-tests.txt

  Scenario: Legacy adapter compatibility
    Tool: browser
    Steps: open `/#agenda` and `/#atualizacoes`.
    Expected: Both render nonblank content with same headline/sample data.
    Evidence: .omo/evidence/remaining-task-10-browser.md
  ```

  **Commit**: YES | Message: `refactor(mocks): split agenda mock domains` | Files: `src/mocks/agenda/**`, `src/mocks/agenda.ts`, tests

- [ ] 11. Extract Status And Reservation Indicators

  **What to do**: Extract maintained components for status/reservation indicators used by agenda cards and updates rows. Use neutral coloring for reservation group/individual count indicators so they do not conflict with semantic status badge colors from the meeting. Add tests for status-to-variant mappings.

  **Must NOT do**: Do not redesign all badges. Do not change business status labels. Do not edit unrelated legacy sections.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 13, 14 | Blocked By: 8, 9

  **References**:
  - Meeting decision: reservation individual/group indicator should be neutral, not confused with status badge colors.
  - Current badge component: `src/components/ui/participant-attribute-badge.tsx`.
  - Current legacy status surfaces: `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`.

  **Acceptance Criteria**:
  - [ ] New maintained indicator components live under `src/modules/agenda/components/**`.
  - [ ] Tests cover success/warning/destructive/neutral mappings.
  - [ ] Reservation count/group indicator uses neutral token classes.
  - [ ] `#atualizacoes` and `#agendaDia` browser QA pass if touched.

  **QA Scenarios**:
  ```text
  Scenario: Status mappings are tested
    Tool: tmux
    Steps: run `npm run test -- --run src/modules/agenda/components`
    Expected: PASS with tests for paid/insured/authorized, warning payment, cancelled/no-show, neutral reservation type.
    Evidence: .omo/evidence/remaining-task-11-tests.txt

  Scenario: Updates screen still renders indicators
    Tool: browser
    Steps: open `/#atualizacoes` at 1366x768.
    Expected: Updates page renders nonblank and status/reservation indicators are visible where replaced.
    Evidence: .omo/evidence/remaining-task-11-browser.md
  ```

  **Commit**: YES | Message: `refactor(agenda): extract status indicators` | Files: `src/modules/agenda/components/**`, focused adapters/usages, tests

- [ ] 12. Extract New Activity Form Sections

  **What to do**: Split `src/modules/agenda/components/AgendaNovaAtividade.tsx` into smaller maintained sections:
  - page shell/header.
  - stepper/progress.
  - identification/capacity fields.
  - date/time/repetition fields.
  - footer actions.
  Replace native controls with existing shadcn primitives only when behavior is preserved.

  **Must NOT do**: Do not change form business behavior, add persistence, or connect an API.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 16 | Blocked By: 4, 8, 9

  **References**:
  - Large form: `src/modules/agenda/components/AgendaNovaAtividade.tsx`.
  - App route: `src/app/App.tsx:14`.
  - shadcn primitives: `src/components/ui/input.tsx`, `select.tsx`, `switch.tsx`, `button.tsx`.

  **Acceptance Criteria**:
  - [ ] No new maintained file exceeds 250 pure LOC unless explicitly justified.
  - [ ] Existing `#novaAtividade` tests/browser QA pass.
  - [ ] Form controls remain interactive.
  - [ ] No backend/API call is introduced.

  **QA Scenarios**:
  ```text
  Scenario: New activity route remains usable
    Tool: browser
    Steps: open `/#novaAtividade`, click through first-step controls, type a sample title `Trilha Teste`.
    Expected: Inputs accept text/toggles and page remains on `#novaAtividade`.
    Evidence: .omo/evidence/remaining-task-12-browser.md

  Scenario: Form split keeps code under control
    Tool: tmux
    Steps: run pure LOC check on new `src/modules/agenda/components/new-activity/**` files.
    Expected: Each maintained file is under 250 pure LOC or has a documented exception.
    Evidence: .omo/evidence/remaining-task-12-loc.txt
  ```

  **Commit**: YES | Message: `refactor(agenda): split new activity form` | Files: `src/modules/agenda/components/**`, tests

- [ ] 13. Extract Month And Day Primitives

  **What to do**: Incrementally extract maintained components from month/day screens without full rewrite:
  - Month header/view switcher.
  - Calendar grid wrapper.
  - Day activity list/card shell.
  - Empty/holiday state primitives.
  Replace only the smallest stable regions that can be tested and visually checked.

  **Must NOT do**: Do not rewrite `AgendaMes-13-9535.tsx` or `AgendaAtividadesDoDia.tsx` wholesale.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 16 | Blocked By: 10, 11

  **References**:
  - Month adapter: `src/modules/agenda/adapters/figma-agenda-month-page.tsx`.
  - Day adapter: `src/modules/agenda/adapters/figma-agenda-day-page.tsx`.
  - Legacy month/day exports: `src/imports/AgendaMes/**`, `src/imports/AgendaAtividadesDoDia/**`.

  **Acceptance Criteria**:
  - [ ] Extracted components have tests for props/states.
  - [ ] `#agenda` and `#agendaDia` browser QA pass desktop/mobile.
  - [ ] Legacy exports remain contained behind adapters.

  **QA Scenarios**:
  ```text
  Scenario: Month/day route smoke after extraction
    Tool: browser
    Steps: open `/#agenda` and `/#agendaDia` at 1366x768 and 375x812.
    Expected: Nonblank content, expected hash, no first-viewport overlap.
    Evidence: .omo/evidence/remaining-task-13-browser.md

  Scenario: Extracted primitive tests
    Tool: tmux
    Steps: run `npm run test -- --run src/modules/agenda/components`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-13-tests.txt
  ```

  **Commit**: YES | Message: `refactor(agenda): extract month day primitives` | Files: focused `src/modules/agenda/components/**`, adapters/tests

- [ ] 14. Extract Updates Participant Sections

  **What to do**: Extract maintained pieces from updates/details:
  - Updates tab navigation wrapper.
  - Participant row/card component.
  - Filter/sort toolbar wrapper.
  - Team responsible summary trigger if stable.
  Keep reducer/state behavior in the legacy export unless a characterization test pins the behavior first.

  **Must NOT do**: Do not alter check-in, cancellation, no-show, insurance, or bulk action behavior without tests.

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 16 | Blocked By: 10, 11

  **References**:
  - Updates adapter: `src/modules/agenda/adapters/figma-agenda-updates-page.tsx`.
  - Legacy file: `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`.
  - Meeting decisions: equipe responsável area clickable; insurance tooltip/status; updates are visually dense.

  **Acceptance Criteria**:
  - [ ] Tests pin participant row status/selection rendering before extraction.
  - [ ] `#atualizacoes` browser QA passes desktop/mobile.
  - [ ] No workflow semantics are changed.

  **QA Scenarios**:
  ```text
  Scenario: Updates route still works
    Tool: browser
    Steps: open `/#atualizacoes`, switch visible tabs if controls are accessible, capture DOM text and screenshot/snapshot.
    Expected: Route renders, tab labels remain, participant/update text remains nonblank.
    Evidence: .omo/evidence/remaining-task-14-browser.md

  Scenario: Participant component characterization
    Tool: tmux
    Steps: run focused tests for participant row/card status mappings.
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-14-tests.txt
  ```

  **Commit**: YES | Message: `refactor(agenda): extract updates participant sections` | Files: focused `src/modules/agenda/components/**`, adapters/tests

- [ ] 15. Dependency Quarantine And Package Audit

  **What to do**: Decide what can safely be removed or must remain documented:
  - `@mui/material` and `@mui/icons-material`: remove only if `rg -n "@mui" src package.json` proves no source usage and build stays green.
  - `lucide-react`: keep if generated `src/components/ui/**` still imports it; otherwise replace documented generated components with HugeIcons-compatible variants and remove.
  - `next-themes`: keep only if `src/components/ui/sonner.tsx` still needs it; otherwise replace/remove.
  Update `docs/audits/dependency-quarantine.md`.

  **Must NOT do**: Do not remove a package unless source audit, tests, typecheck, and build pass after removal.

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: 16 | Blocked By: 2, 3, 11-14

  **References**:
  - Current dependency matches: `package.json`, `src/components/ui/**`.
  - UI quarantine audit from Task 3.

  **Acceptance Criteria**:
  - [ ] Dependency audit document names each package and decision.
  - [ ] Removed packages, if any, are absent from `package.json` and `package-lock.json`.
  - [ ] Kept packages have documented reason and replacement path.
  - [ ] `npm run lint`, `npm run test`, `npm run typecheck`, `npm run build` pass.

  **QA Scenarios**:
  ```text
  Scenario: Dependency audit matches package state
    Tool: tmux
    Steps: run `rg -n "@mui|lucide-react|next-themes" package.json src --glob "!src/imports/**"` and compare to audit.
    Expected: Every match is either removed or documented.
    Evidence: .omo/evidence/remaining-task-15-audit.txt

  Scenario: Package cleanup does not break app
    Tool: tmux
    Steps: run `npm run test && npm run typecheck && npm run build`
    Expected: PASS.
    Evidence: .omo/evidence/remaining-task-15-verification.txt
  ```

  **Commit**: YES | Message: `chore(deps): quarantine non-admin dependencies` | Files: `package.json`, `package-lock.json`, `docs/audits/dependency-quarantine.md`, optional focused component replacements

- [ ] 16. Readiness Report And Final QA

  **What to do**: Write `docs/audits/admin-alignment-readiness.md` summarizing:
  - What is now Admin-compatible.
  - What remains legacy/Figma-contained.
  - What can be migrated later into Retrilhar Admin.
  - What must not be migrated because it is prototype-only.
  - Evidence links for tests, browser QA, dependency audit, and Admin read-only status.

  **Must NOT do**: Do not claim the prototype is migrated into Admin. Do not claim product/pedidos/afiliados priorities were implemented.

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: Final Verification | Blocked By: all tasks

  **References**:
  - This plan: `.omo/plans/frontend-maturation-remaining.md`.
  - Prior plan: `.omo/plans/prototype-admin-alignment.md`.
  - Evidence from each task under `.omo/evidence/**`.

  **Acceptance Criteria**:
  - [ ] Readiness report exists.
  - [ ] Report lists remaining legacy files and migration readiness.
  - [ ] Final browser QA covers `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, `#doesNotExist`.
  - [ ] Final command gate passes or any pre-existing format-only warnings are explicitly documented.

  **QA Scenarios**:
  ```text
  Scenario: Readiness report is complete
    Tool: tmux
    Steps: run `rg -n "Admin-compatible|legacy|prototype-only|mock-only|Retrilhar Admin|evidence" docs/audits/admin-alignment-readiness.md`
    Expected: Required sections are present.
    Evidence: .omo/evidence/remaining-task-16-report-check.txt

  Scenario: Full route QA
    Tool: browser
    Steps: start Vite and open `/#agenda`, `/#agendaDia`, `/#atualizacoes`, `/#novaAtividade`, `/#doesNotExist` at desktop and mobile.
    Expected: Supported routes render expected content; unknown hash falls back to `#agenda`; cleanup receipt is recorded.
    Evidence: .omo/evidence/remaining-task-16-browser-final.md
  ```

  **Commit**: YES | Message: `docs(readiness): summarize admin alignment status` | Files: `docs/audits/admin-alignment-readiness.md`, evidence references

## Final Verification Wave
- [ ] F1. Plan Compliance Audit
  - Tool: tmux.
  - Steps: verify every task's evidence path exists and every acceptance criterion is satisfied.
  - Expected: PASS or a blocker document naming the failed task.
  - Evidence: `.omo/evidence/remaining-final-plan-compliance.txt`

- [ ] F2. Code Quality Review
  - Tool: reviewer agent or tmux if reviewer unavailable.
  - Steps: inspect full diff for scope creep, Admin mutation, missing tests, and brittle browser QA.
  - Expected: unconditional approval or blockers fixed before completion.
  - Evidence: `.omo/evidence/remaining-final-code-review.md`

- [ ] F3. Full Verification Commands
  - Tool: tmux.
  - Steps: run targeted Prettier on touched files, `npm run lint`, `npm run test`, `npm run typecheck`, `npm run build`.
  - Expected: PASS. If full `npm run format:check` still fails on pre-existing docs/evidence, record exact file list and do not broaden format changes without approval.
  - Evidence: `.omo/evidence/remaining-final-verification.txt`

- [ ] F4. Real Browser QA
  - Tool: browser.
  - Steps: run final route matrix for desktop 1366x768 and mobile 375x812.
  - Expected: nonblank content, expected hash, no obvious first-viewport overlap, cleanup receipt.
  - Evidence: `.omo/evidence/remaining-final-browser.md`

- [ ] F5. Admin Read-Only Check
  - Tool: tmux.
  - Steps: capture Admin `git status --short` and list every command run against Admin from evidence.
  - Expected: only read-only commands were run by this plan.
  - Evidence: `.omo/evidence/remaining-final-admin-readonly.md`

## Commit Strategy
- Default: do not auto-commit unless the user explicitly authorizes commits.
- Suggested atomic commit order:
  1. `docs(theme): audit admin config parity`
  2. `docs(ui): audit generated shadcn exceptions`
  3. `feat(components): add admin-compatible primitives`
  4. `refactor(layout): decouple shell types from mocks`
  5. `refactor(layout): document and normalize agenda shell policy`
  6. `refactor(agenda): move prototype orchestration into module`
  7. `refactor(agenda): expand mock view-model services`
  8. `docs(agenda): contain figma exports behind adapters`
  9. `refactor(mocks): split agenda mock domains`
  10. `refactor(agenda): extract status indicators`
  11. `refactor(agenda): split new activity form`
  12. `refactor(agenda): extract month day primitives`
  13. `refactor(agenda): extract updates participant sections`
  14. `chore(deps): quarantine non-admin dependencies`
  15. `docs(readiness): summarize admin alignment status`
- Each commit footer should include: `Plan: .omo/plans/frontend-maturation-remaining.md`.

## Success Criteria
- The prototype has Admin-compatible frontend organization for layout, custom primitives, skeleton primitives, module orchestration, and mock service boundaries.
- The legacy Figma exports are still allowed but explicitly contained and audited.
- The main routes `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, and unknown hash fallback are covered by tests and browser QA.
- The prototype remains Vite/React/mock-only/hash-routed.
- Retrilhar Admin remains read-only reference only.
- The readiness report tells a future migration worker exactly what can be moved into Admin and what remains prototype-only.
