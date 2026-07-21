# Codex instructions for Retrilhar Agenda V2

## Repository contract

- This is a Vite + React usability prototype. Keep the application Vite/React and keep
  navigation on the existing hash routes. Do not migrate the shell to Next.js, App Router,
  RSC, or another routing architecture.
- This repository is mock-only. Fixtures in `src/mocks/**` and synchronous mock services in
  `src/modules/**/services/**` are the source of truth. Do not add a backend, API client,
  authentication, OpenAPI SDK, or `fetch`/HTTP calls in maintained product code.
- Never expose the word `mock` in visible UI copy. It is an implementation detail and may
  remain in internal names, fixtures, tests, and documentation.
- The existing hash navigation is part of the test contract. Preserve direct links such as
  `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, and affiliate routes when
  changing screens.

## UI and architecture preferences

- Use HugeIcons through `@hugeicons/react` and `@hugeicons/core-free-icons`. Do not add a
  new icon package.
- Prefer existing shadcn/ui primitives, then `src/components/layout/**` and
  `src/components/custom/**`, before creating native or duplicate components. Do not make
  broad edits to managed `src/components/ui/**`.
- Keep feature work under `src/modules/[feature]` with focused components, services, and
  types. Keep mock data centralized rather than defining arrays inline in screens.
- Reuse semantic project tokens and existing Helvetica Neue/font/layout conventions. Inspect
  the relevant components, styles, routes, and mocks before creating a new pattern.
- Treat Figma-exported `src/imports/**` code as legacy: contain it behind maintained adapters
  and refactor incrementally. The Retrilhar Admin repository, if present as a reference, is
  read-only.

## Worktree and change discipline

- Read `CLAUDE.md`, applicable `.claude/rules/**`, and the task plan before editing. Work only
  in the requested write set and preserve unrelated user or agent changes.
- Before editing a file, inspect its current state. If a requested file changed during the
  task, stop and report the conflict; do not overwrite, reset, checkout, or mass-format it.
- Do not edit product code, tests, `DESIGN.md`, plan checkboxes, Boulder state, or ledgers
  unless the task explicitly includes them. Do not run destructive cleanup commands.
- Keep changes small and reviewable. A documentation-only task must not turn into dependency,
  formatting, code-generation, or product refactoring work.

## Token-aware agent routing

- Do the work in the main session when delegation overhead exceeds the isolated task.
- Route simple documentation, grep contracts, and narrow read-only checks to a low-cost worker
  when delegation is useful. Use a medium worker for isolated service or component work. Use a
  stronger model only for architecture, cross-file integration, conflict resolution, or final
  review. Never assign overlapping write sets to concurrent workers.
- An agent must report its owned files, assumptions, and conflicts. A worker may not broaden
  scope because another task would be convenient to bundle.

## Evidence and completion

- For every acceptance criterion, run the named scenario exactly (or record the concrete
  blocker), and capture the command, exit status, relevant output, and artifact path.
- Evidence must prove a binary observable, not merely assert that a test passed. For this
  documentation task, prove both rule files exist, the required guardrail terms are present,
  and forbidden-rule-copy terms are absent.
- Use the active loop attempt directory when one is provided by `omo ulw-loop status --json`;
  otherwise write under `.omo/evidence/`. Record the targeted `git status --short` output so
  dirty-worktree state is auditable.
- Before claiming completion, read back the changed files and evidence artifact. If validation
  fails, fix the smallest cause and rerun the full relevant scenario.

## Affiliate terminology

- In affiliate UI copy, call the relationship `afiliação`. Do not require or introduce the UI
  terms `contrato` or `vínculo`; the domain guardrail in `.claude/rules/afiliados.md` is the
  more specific authority for this module.
- Keep Home de primeiro acesso and Sala de negocios V1 outside implementation until their
  documented P-A/P-B/P-C decisions are resolved.
