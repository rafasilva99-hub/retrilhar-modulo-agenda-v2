# Todo 5 evidence: new activity option fixtures

## Scope and evidence location

- Worktree: `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar-agenda-front-worktree`
- Commit: `24533eab3058c894dc59158c5b686a8123150534`
- Commit tree: `63064c8868238e1ab4f1b0827e1f7d0b47ee9465`
- `omo` was not on `PATH` (`command not found`). The cached `omo ulw-loop status --json` fallback returned `ULW_LOOP_PLAN_MISSING`, so no active `currentAttemptDir` was available. Evidence is therefore under `.omo/evidence/agenda-front-plan/`.
- Changed Todo 5 files: `src/modules/agenda/components/AgendaNovaAtividade.tsx`, `src/modules/agenda/services/agenda-new-activity-service.ts`, `src/modules/agenda/services/agenda-new-activity-service.test.ts`, and the date-sensitive stability correction in `src/modules/agenda/services/agenda-mock-service.test.ts`.

## Automated verification

### Required test

Command:

```text
npm run test -- --run src/modules/agenda/components/new-activity src/modules/agenda/services
```

Result: exit `0`.

```text
Test Files  3 passed (3)
Tests       8 passed (8)
```

### Required inline-fixture scan

Command:

```text
rg -n "const mockProdutos|localOptions|produtoOptions|grupoOptions" src/modules/agenda/components/AgendaNovaAtividade.tsx
```

Result: exit `1`, empty stdout, which is the expected no-match result.

### Changed-file and build gates

| Invocation | Exit | Observable result |
| --- | ---: | --- |
| `npx eslint src/modules/agenda/components/AgendaNovaAtividade.tsx src/modules/agenda/services/agenda-new-activity-service.ts src/modules/agenda/services/agenda-new-activity-service.test.ts src/modules/agenda/services/agenda-mock-service.test.ts --max-warnings=0 --report-unused-disable-directives` | 0 | No diagnostics |
| `npm run typecheck` | 0 | `tsc --noEmit` completed |
| `npx prettier --check src/modules/agenda/services/agenda-new-activity-service.ts src/modules/agenda/services/agenda-new-activity-service.test.ts src/modules/agenda/services/agenda-mock-service.test.ts` | 0 | All checked service files formatted |
| `git diff --check` | 0 | No whitespace errors |
| `npm run build` | 0 | Vite production build completed, 2082 modules transformed |

The full-repository `npm run lint` and `npm run format:check` were also run. They remain non-passing on pre-existing unrelated files, including `src/components/custom/time-input.tsx`, `src/modules/board/**`, `src/modules/produtos/ProdutosPage.tsx`, many existing formatted-file warnings, and the malformed pre-existing `.omo/ulw-loop/evidence/G001-quality-review.json`. The changed-file ESLint and relevant service formatting checks above are clean; no unrelated files were edited.

## Manual browser QA

Server invocation:

```text
npm run dev -- --host 127.0.0.1
```

Vite selected port `5176` because ports `5173`, `5174`, and `5175` were already occupied. Browser invocation used the isolated session `agenda-todo5`:

```text
npm exec --yes agent-browser -- --session agenda-todo5 --namespace retrilhar-agenda-todo5 set viewport 1280 800
npm exec --yes agent-browser -- --session agenda-todo5 --namespace retrilhar-agenda-todo5 open http://127.0.0.1:5176/#novaAtividade
```

Actions and binary observables:

1. Opened `http://127.0.0.1:5176/#novaAtividade`. The accessibility snapshot exposed the product textbox and the initial stable form.
2. Focused the product textbox. The dropdown exposed buttons `Trilha Ecológica` and `Observação de Fauna`.
3. Selected `Trilha Ecológica`. The fresh snapshot showed product `Trilha Ecológica`, start `08:00`, end `11:00`, minimum capacity `5`, and maximum capacity `30`.
4. Reopened the product dropdown and selected `Trilha Ecológica` again to clear it. The fresh snapshot showed the placeholder `Selecione um produto`, retained `08:00`, `11:00`, `5`, and `30`, kept `Salvar atividade` disabled, and rendered the rest of the form without an error.
5. `agent-browser get url` returned `http://127.0.0.1:5176/#novaAtividade`. `agent-browser errors` exited `0` with no page errors. The console contained only Vite connection/HMR and the standard React DevTools informational message.

Screenshot artifacts, both verified as non-empty PNGs at `1280 x 800`:

- [Selected product](./task-5-nova-atividade/selected-product.png)
- [Cleared product](./task-5-nova-atividade/cleared-product.png)

## Cleanup receipt

- Browser close: `npm exec --yes agent-browser -- --session agenda-todo5 --namespace retrilhar-agenda-todo5 close` exited `0` with `Browser closed`.
- Browser session check: `session list` returned `No active sessions`.
- Vite teardown: sent `Ctrl-C` to the Todo 5 server session on port `5176`; the expected interrupted-process exit was observed.
- Port check: `lsof -nP -iTCP:5176 -sTCP:LISTEN` exited `1` with no listener.
- Pre-existing Vite listeners on ports `5174` and the main worktree were left untouched.

## Worktree audit

Todo 5 files are committed in `24533eab`. Pre-existing unrelated dirty paths, including Todo 6 files, `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`, and `src/mocks/agenda.ts`, remain preserved and were not staged by this task.

**QA result: PASS.**

## Targeted status after recording

Command:

```text
git status --short -- src/modules/agenda/components/AgendaNovaAtividade.tsx src/modules/agenda/services/agenda-mock-service.test.ts src/modules/agenda/services/agenda-new-activity-service.ts src/modules/agenda/services/agenda-new-activity-service.test.ts .omo/evidence/agenda-front-plan/task-5-nova-atividade.md .omo/evidence/agenda-front-plan/task-5-nova-atividade/selected-product.png .omo/evidence/agenda-front-plan/task-5-nova-atividade/cleared-product.png .omo/start-work/ledger.jsonl .omo/plans/agenda-front-plan.md
```

Captured output:

```text
?? .omo/evidence/agenda-front-plan/task-5-nova-atividade.md
?? .omo/evidence/agenda-front-plan/task-5-nova-atividade/cleared-product.png
?? .omo/evidence/agenda-front-plan/task-5-nova-atividade/selected-product.png
?? .omo/plans/agenda-front-plan.md
?? .omo/start-work/ledger.jsonl
```

No Todo 5 source path appears because its code is committed in `24533eab`; the listed evidence, plan, and ledger files are intentionally untracked worktree artifacts.
