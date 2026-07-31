# Frontman initialization evidence

Date: 2026-07-21
Project: `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2`

## Scenario

Initialize Frontman in the existing Vite/React prototype without changing product code or hash
navigation.

## Commands and results

- `npx @frontman-ai/vite install`
  - Exit: 0
  - Observable: installer detected a Vite project, installed dependencies, updated
    `vite.config.ts`, and reported Frontman setup complete.

- `npm ls @frontman-ai/vite`
  - Exit: 0
  - Observable: `@frontman-ai/vite@1.0.3` is installed under the project.

- `npx prettier --check package.json package-lock.json vite.config.ts src/types/frontman-ai-vite.d.ts`
  - Exit: 0
  - Observable: all matched files use Prettier code style.

- `npx eslint vite.config.ts src/types/frontman-ai-vite.d.ts --max-warnings=0 --report-unused-disable-directives`
  - Exit: 0
  - Observable: no lint errors in the files changed for this task.

- `npm run typecheck`
  - Exit: 0
  - Observable: `tsc --noEmit` passed.

- `npm run build`
  - Exit: 0
  - Observable: Vite production build completed successfully.

- `npm run check`
  - Exit: 1
  - Observable: blocked at `prettier . --check --cache` by 24 pre-existing formatting
    issues outside the Frontman write set, including files under `docs/`, `Retrilhar Intel/`,
    `src/components/`, `src/mocks/`, and `src/modules/agenda|board|produtos`.

- `npm run dev -- --host 127.0.0.1`
  - Exit: server left running for manual use
  - Observable: Vite ready at `http://127.0.0.1:5173/`.

- `curl -i http://127.0.0.1:5173/frontman`
  - Exit: 0
  - Observable: returned `HTTP/1.1 200 OK`, `content-type: text/html`, title `Frontman`,
    and `window.__frontmanRuntime` with framework `vite` and basePath `frontman`.

- `curl -i http://127.0.0.1:5173/frontman/tools`
  - Exit: 0
  - Observable: returned `HTTP/1.1 200 OK`, `content-type: application/json`,
    `serverInfo.name` `frontman-vite`, and `serverInfo.version` `1.0.3`.

- `curl -i http://127.0.0.1:5173/#agenda`
  - Exit: 0
  - Observable: returned the existing app HTML with title `Módulo de Agenda V2`.

## Check resolution

- `npx prettier --write <24 files reported by npm run check>`
  - Exit: 0
  - Observable: formatted the exact files previously reported by `prettier . --check --cache`.

- `npx eslint src/components/custom/time-input.tsx src/modules/agenda/components/AgendaNovaAtividade.tsx src/modules/board/index.ts src/modules/produtos/ProdutosPage.tsx vite.config.ts --fix`
  - Exit: 1
  - Observable: import/export sorting and type-only imports were fixed; remaining failures were
    React ref access during render in `src/components/custom/time-input.tsx`.

- Manual lint fixes
  - Observable: moved `TimeInput` external value synchronization from render into `useEffect`;
    initialized `BoardCanvas` persisted view with `useState` instead of reading `ref.current`
    during render; removed `stateRef.current = state` from `useCanvasPanZoom` render and added
    the missing `zoomAt` effect dependency.

- `npm run check`
  - Exit: 0
  - Observable: format, lint, typecheck, and Vite production build all passed.

- `curl -s -o /tmp/frontman-resolve-check.html -w '%{http_code} %{content_type}\n' http://127.0.0.1:5173/frontman`
  - Exit: 0
  - Observable: returned `200 text/html`.

- `curl -s http://127.0.0.1:5173/frontman/tools | rg '"serverInfo"|"frontman-vite"|"version":"1.0.3"'`
  - Exit: 0
  - Observable: returned Frontman tool metadata with `serverInfo.name` `frontman-vite` and
    `serverInfo.version` `1.0.3`.

- `curl -s http://127.0.0.1:5173/#agenda | rg '<title>|/src/main.tsx'`
  - Exit: 0
  - Observable: returned the app title and Vite React entrypoint.

## Targeted git status

```
 M package-lock.json
 M package.json
 M src/components/custom/time-input.tsx
 M src/modules/board/BoardCanvas.tsx
 M src/modules/board/index.ts
 M src/modules/board/use-canvas-pan-zoom.ts
 M vite.config.ts
?? .omo/evidence/frontman-initialization.md
?? src/types/frontman-ai-vite.d.ts
```

Additional formatting-only files changed to make `npm run check` pass:

```
 M Retrilhar Intel/.obsidian/app.json
 M Retrilhar Intel/.obsidian/appearance.json
 M Retrilhar Intel/.obsidian/core-plugins.json
 M Retrilhar Intel/.obsidian/graph.json
 M Retrilhar Intel/.obsidian/workspace.json
 M Retrilhar Intel/Bem-vindo.md
 M Specdrivenafiliados.md
 M Specdrivendetalhes-mobile.md
 M docs/superpowers/plans/2026-06-05-prototype-admin-alignment-detailed.md
 M docs/superpowers/plans/2026-06-05-prototype-admin-alignment.md
 M src/components/layout/app-layout.tsx
 M src/components/layout/top-bar.tsx
 M src/components/layout/topbar/topbar-profile.tsx
 M src/components/ui/badge-tooltip.tsx
 M src/components/ui/participant-attribute-badge.tsx
 M src/mocks/agenda/reservations.ts
 M src/mocks/agenda/status.ts
 M src/modules/agenda/components/AgendaNovaAtividade.tsx
 M src/modules/board/board-canvas.css
 M src/modules/produtos/ProdutosPage.tsx
 M src/types/agenda.ts
```

Unrelated dirty worktree entries observed and left untouched:

```
 M src/modules/afiliados/AfiliadosPage.test.tsx
 M src/modules/afiliados/AfiliadosPage.tsx
 M src/imports/AgendaMes/AgendaMes-13-9535.tsx
?? .omo/evidence/remove-dashboard-shortcuts-gate-review.md
?? .omo/evidence/remove-dashboard-shortcuts/
```
