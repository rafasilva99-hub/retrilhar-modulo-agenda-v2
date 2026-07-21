# agenda-front-plan - Work Plan

## TL;DR (For humans)
**What you'll get:** Um plano corrigido para avançar a agenda sem quebrar o protótipo nem colidir com o chat de afiliados. A primeira parte é segura para executar: isolamento de worktree, regra de agenda, testes de rotas/previews, refatoração controlada da nova atividade e exceção confirmada de detalhes.

**Why this approach:** A spec deixa claro que agenda é refatoração, não construção do zero, mas também marca decisões e dados essenciais como PROPOSTA ou A VALIDAR. O plano não inventa esses pontos: ele executa o que já está fundamentado e deixa lista de reservas, CSV, auditoria ampla e conclusão do dia atrás de uma decisão explícita.

**What it will NOT do:** Não cria backend, API, auth, fetch, Next.js ou importação de dados. Não colapsa os três eixos de estado em uma tag. Não mexe em afiliados nem sobrescreve o Boulder ativo do outro chat.

**Effort:** XL
**Risk:** High - há arquivos Figma grandes, estado de reserva com três eixos paralelos, documentos não rastreados e outro chat editando a mesma base.
**Decisions I made for you:** O plano executável inicial fica limitado ao que a spec comprova. A conclusão do dia, lista de reservas/CSV e auditoria global viram tarefas bloqueadas até definição de rota/UX, matriz de transição e contrato de colunas/filtros.

Your next move: responder a pergunta de produto no fim deste plano para destravar a próxima leva. Full execution detail follows below.

---

> TL;DR (machine): Agenda plan corrected after Metis ITERATE: executable tranche = isolation, rules, route/previews, new-activity mock extraction, confirmed detail exception; blocked tranche = reservations/CSV/audit/day-completion pending owner decisions and missing contracts.

## Scope
### Must have
- Executar agenda em branch/worktree própria se houver qualquer edição de produto, porque `.omo/boulder.json` no main pertence a afiliados.
- Criar `.claude/rules/agenda.md` com os invariantes específicos de agenda de `Specdrivenagenda:11-24`.
- Preservar Vite/React, hash routes e mock-only de `Specdrivenagenda:28-34`.
- Adicionar testes de rotas/previews agenda em arquivo separado se `src/app/App.test.tsx` estiver sujo pelo outro chat.
- Refatorar dados inline de `AgendaNovaAtividade.tsx` para serviço/mock tipado sem mudar comportamento.
- Implementar somente o cenário confirmado de detalhes: atividade cancelada sem participantes, conforme `Specdrivenagenda:44-46,65-66`.
- Melhorar responsividade mobile das funcionalidades de detalhes que já existem, sem inventar exceções não confirmadas.
- Registrar blockers para lista de reservas, CSV, auditoria global e conclusão do dia com pergunta objetiva.
- Fazer QA de navegador para as rotas já existentes que forem alteradas: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` e previews.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Não implementar importação de dados: `Specdrivenagenda:52-54,62-63` marca como bloqueado.
- Não implementar cenários P-B além de atividade cancelada sem participantes: `Specdrivenagenda:65-66`.
- Não implementar conclusão do dia antes de resolver P-C: `Specdrivenagenda:68-69,105-110,131-144`.
- Não implementar lista de reservas/CSV sem contrato exato de colunas, filtros, ordem de CSV, delimitador, encoding e campos vazios.
- Não implementar auditoria global sem decidir localização/rota/tab, porque `Specdrivenagenda:73-81` é PROPOSTA.
- Não permitir transições fora da matriz RPP002; se a matriz completa não estiver disponível, só modelar os invariantes explícitos de reversibilidade e bloqueio.
- Não tocar `src/modules/afiliados/**`, `src/mocks/afiliados/**` ou `.omo/plans/afiliados-front-plan.md`.
- Não sobrescrever `src/app/App.test.tsx` enquanto estiver modificado pelo outro chat.
- Não adicionar backend, `fetch(`, cliente HTTP, Next.js, auth, OpenAPI SDK, Sentry, PWA ou service worker.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: characterization/TDD first with Vitest + React Testing Library for services, route previews and components. Docs use readback/grep contracts.
- Evidence: `.omo/evidence/agenda-front-plan/task-<N>-*.{txt,md,json,png}`.
- Required commands for executable tranche:
  - `npm run test -- --run src/modules/agenda`
  - `npm run format:check`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Browser QA: start Vite with `npm run dev -- --host 127.0.0.1`, record actual port, test affected agenda hashes at 1280x800 and 390x844, capture screenshots/logs and cleanup receipt.
- Forbidden scans:
  - `rg -n "fetch\\(|axios|better-auth|next/link|next/image|next-intl|OpenAPI|serviceWorker|navigator\\.serviceWorker" src --glob '!src/imports/**'`
  - `rg -n "mock" src/modules/agenda src/components src/app --glob '*.{ts,tsx}'` must not find visible UI copy.

## Execution strategy
### Parallel execution waves
- Wave 0, isolation: Todo 1 only.
- Wave 1, safe foundations: Todos 2, 3 and 4 can run in parallel after Todo 1 if write sets are disjoint.
- Wave 2, safe agenda refinements: Todos 5 and 6 can run after Todos 2-4.
- Wave 3, blocker packet: Todo 7 records owner decisions and missing contracts for the blocked tranche.
- Wave 4, QA: Todo 8 runs after safe refinements.

Token-aware agent routing:
- Low-cost workers: docs, grep contracts, isolated route tests.
- Medium workers: new-activity mock extraction and confirmed exception/mobile detail work.
- High-capability worker/reviewer: only if shared files, state-machine conflicts, visual QA failure or plan review blockers recur.
- All spawned agents use `fork_context: false`, exact paths/lines, write set, acceptance criteria and evidence path only.

Concurrency policy:
- Main worktree has active affiliates work. Agenda implementation must not overwrite `.omo/boulder.json` in main.
- Preferred execution worktree: `../Retrilhar-agenda-front-worktree` from `HEAD`.
- Copy into that worktree before implementation: `Specdrivenagenda`, `DESIGN.md`, `AGENTS.md`, `.omo/drafts/agenda-front-plan.md`, `.omo/plans/agenda-front-plan.md`.
- Persist denylist from main dirty state: `src/app/App.test.tsx`, `src/modules/afiliados/**`, `src/mocks/afiliados/**`, `.omo/plans/afiliados-front-plan.md`, `.omo/boulder.json`.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | none | 2-8 | none |
| 2 | 1 | 5-8 | 3, 4 |
| 3 | 1 | 5-8 | 2, 4 |
| 4 | 1 | 5-8 | 2, 3 |
| 5 | 2, 3, 4 | 8 | 6 |
| 6 | 2, 3, 4 | 8 | 5 |
| 7 | 1 | blocked tranche | 5, 6 |
| 8 | 5, 6 | final verification wave | none |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Establish agenda worktree isolation and evidence baseline
  What to do / Must NOT do: Capture main `git status --short --branch`, `.omo/boulder.json`, and `git worktree list`. Create agenda evidence dir. If product edits will start, create `../Retrilhar-agenda-front-worktree` on branch `work/agenda-front`, copy required untracked docs/plans into it, and initialize agenda-only evidence there. Do not edit product files.
  Parallelization: Wave 0 | Blocked by: none | Blocks: 2-8.
  References (executor has NO interview context - be exhaustive): `.omo/boulder.json`, `.omo/drafts/agenda-front-plan.md`, `.omo/plans/agenda-front-plan.md`, `Specdrivenagenda:1-34`, `AGENTS.md`.
  Acceptance criteria (agent-executable): `test -d .omo/evidence/agenda-front-plan && test -s .omo/evidence/agenda-front-plan/task-1-baseline.txt`; if a worktree is created, `git worktree list` includes `Retrilhar-agenda-front-worktree` and copied docs exist there.
  QA scenarios (name the exact tool + invocation): happy: bash `git status --short --branch && git worktree list && sed -n '1,120p' .omo/boulder.json`; failure: bash `test ! -f .git/index.lock`. Evidence `.omo/evidence/agenda-front-plan/task-1-baseline.txt`.
  Commit: N | none.

- [x] 2. Add agenda-specific guardrail rule
  What to do / Must NOT do: Create `.claude/rules/agenda.md` from agenda-specific invariants only. Keep common project rules in existing files. Do not edit product code.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5-8.
  References (executor has NO interview context - be exhaustive): `Specdrivenagenda:11-24`, `Specdrivenagenda:28-34`, `.claude/rules/agenda-fidelity.md:1-12`, `CLAUDE.md:17-35`.
  Acceptance criteria (agent-executable): `test -f .claude/rules/agenda.md && rg -n "Três eixos|Situação operacional|Financeiro|Seguro|No Show|histórico imutável|Cancelamento exige motivo|#agenda" .claude/rules/agenda.md`.
  QA scenarios (name the exact tool + invocation): happy: bash `rg -n "Situação operacional|Financeiro|Seguro|No Show|histórico imutável" .claude/rules/agenda.md`; failure: bash `rg -n "backend obrigatório|fetch obrigatório|colapsar.*tag" .claude/rules/agenda.md` returns no matches. Evidence `.omo/evidence/agenda-front-plan/task-2-agenda-rule.txt`.
  Commit: Y | `docs(agenda): add module guardrails`.

- [x] 3. Add agenda-only route and preview smoke tests
  What to do / Must NOT do: Add a new agenda route test file under `src/modules/agenda` or `src/app` that does not overwrite dirty `src/app/App.test.tsx`. Cover `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, `#preview/agenda/mes`, `#preview/agenda/semana`, `#preview/agenda/dia`, `#preview/agendaDia`, `#preview/agendaDia/empty`, `#preview/atualizacoes/participantes`, `#preview/atualizacoes/visao-geral`, `#preview/atualizacoes/atualizacoes`, and unknown fallback.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5-8.
  References (executor has NO interview context - be exhaustive): `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22`, `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:44-59`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:84-180`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:260-326`, `Specdrivenagenda:28-34`.
  Acceptance criteria (agent-executable): `npm run test -- --run <new-agenda-route-test-file>` passes and the test source includes every hash listed above.
  QA scenarios (name the exact tool + invocation): happy: bash `npm run test -- --run <new-agenda-route-test-file>`; failure: mutation proof temporarily removes `#preview/agendaDia/empty` from the test table and captures the targeted test failing, then reverts mutation. Evidence `.omo/evidence/agenda-front-plan/task-3-routes.txt`.
  Commit: Y | `test(agenda): cover agenda hash previews`.

- [x] 4. Formalize executable and blocked agenda contracts
  What to do / Must NOT do: Add an `.omo/evidence/agenda-front-plan/task-4-contracts.md` contract report or docs appendix that lists what is executable now, blocked, PROPOSTA, and A VALIDAR. Include the exact owner-decision question. Do not implement blocked items.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5-8.
  References (executor has NO interview context - be exhaustive): `Specdrivenagenda:38-56`, `Specdrivenagenda:60-69`, `Specdrivenagenda:73-81`, `Specdrivenagenda:87-148`.
  Acceptance criteria (agent-executable): report exists and includes `Importar dados: BLOQUEADO`, `P-B: A VALIDAR`, `P-C: A VALIDAR`, `Auditoria: PROPOSTA`, `Lista de reservas: missing route and column/filter contract`, `CSV: missing header/delimiter/encoding contract`.
  QA scenarios (name the exact tool + invocation): happy: bash `rg -n "BLOQUEADO|A VALIDAR|PROPOSTA|missing route|CSV" .omo/evidence/agenda-front-plan/task-4-contracts.md`; failure: bash `rg -n "P-C.*resolvido|importação.*executável" .omo/evidence/agenda-front-plan/task-4-contracts.md` returns no matches. Evidence `.omo/evidence/agenda-front-plan/task-4-contracts.md`.
  Commit: N | evidence only.

- [x] 5. Move new-activity inline options behind typed agenda mock helpers
  What to do / Must NOT do: Move inline product/location/group option data from `AgendaNovaAtividade.tsx` to typed agenda mock/service helpers. Preserve current `#novaAtividade` behavior. Do not refactor the full file or change UI scope.
  Parallelization: Wave 2 | Blocked by: 2, 3, 4 | Blocks: 8.
  References (executor has NO interview context - be exhaustive): `src/modules/agenda/components/AgendaNovaAtividade.tsx:18-48`, `src/modules/agenda/components/AgendaNovaAtividade.tsx:256-314`, `src/modules/agenda/components/AgendaNovaAtividade.tsx:561-615`, `src/modules/agenda/components/new-activity/new-activity-sections.tsx:1-31`, `CLAUDE.md:21-22`, `Specdrivenagenda:28-34`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/modules/agenda/components/new-activity src/modules/agenda/services` passes; `rg -n "const mockProdutos|localOptions|produtoOptions|grupoOptions" src/modules/agenda/components/AgendaNovaAtividade.tsx` returns no matches.
  QA scenarios (name the exact tool + invocation): happy: Playwright open `http://127.0.0.1:<port>/#novaAtividade`, select product `trilha-ecologica`, expect the same time/capacity defaults as before; failure: clear product selection and expect no crash plus stable visible form. Evidence `.omo/evidence/agenda-front-plan/task-5-nova-atividade.md`.
  Commit: Y | `refactor(agenda): move new activity option fixtures`.

- [x] 6. Implement confirmed detail exception and mobile detail responsiveness
  What to do / Must NOT do: Implement only the confirmed exception `atividade cancelada sem participantes` and improve mobile layout for existing detail filters/list/conclusion affordances. Do not implement P-B candidates beyond the confirmed exception.
  Parallelization: Wave 2 | Blocked by: 2, 3, 4 | Blocks: 8.
  References (executor has NO interview context - be exhaustive): `Specdrivenagenda:44-46`, `Specdrivenagenda:65-66`, `src/modules/agenda/adapters/figma-agenda-day-page.tsx:1-39`, `src/modules/agenda/adapters/figma-agenda-updates-page.tsx:1-29`, `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`, `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`, `src/mocks/agenda/activities.ts`, `src/mocks/agenda/reservations.ts`.
  Acceptance criteria (agent-executable): targeted tests/render checks cover canceled-without-participants; mobile browser at 390x844 for `#atualizacoes` has no horizontal overflow for participant list and filters.
  QA scenarios (name the exact tool + invocation): happy: Playwright mobile open `http://127.0.0.1:<port>/#atualizacoes`, exercise participant filters and expect no overflow; failure: render canceled/no-participants fixture and expect an explicit exception state instead of blank participant table. Evidence `.omo/evidence/agenda-front-plan/task-6-details-mobile.md`.
  Commit: Y | `feat(agenda): handle confirmed detail exception`.

- [x] 7. Record blocked-tranche owner decisions and missing data
  What to do / Must NOT do: Do not implement lista de reservas, CSV, auditoria global or conclusão do dia. Prepare the exact decision packet for the user: route/location of lista de reservas, whether PROPOSTA hover/auditoria are approved as prototype scope, full RPP002 transition matrix, reservation columns/filters, CSV format, and P-C behavior.
  Parallelization: Wave 3 | Blocked by: 1 | Blocks: blocked tranche.
  References (executor has NO interview context - be exhaustive): `Specdrivenagenda:52-56`, `Specdrivenagenda:68-69`, `Specdrivenagenda:73-81`, `Specdrivenagenda:97-110`, `Specdrivenagenda:112-148`, Metis review result.
  Acceptance criteria (agent-executable): `.omo/evidence/agenda-front-plan/task-7-owner-decisions.md` contains one numbered decision packet with recommended defaults and explicit blocked todos.
  QA scenarios (name the exact tool + invocation): happy: bash `rg -n "Lista de reservas|CSV|Auditoria|P-C|RPP002|recomendado" .omo/evidence/agenda-front-plan/task-7-owner-decisions.md`; failure: bash `rg -n "implementar sem decisão|assumido como definitivo" .omo/evidence/agenda-front-plan/task-7-owner-decisions.md` returns no matches. Evidence `.omo/evidence/agenda-front-plan/task-7-owner-decisions.md`.
  Commit: N | evidence only.

- [x] 8. Verify safe tranche with tests, browser QA and cleanup
  What to do / Must NOT do: Run command gates and browser QA for changed agenda routes only. Capture artifacts and cleanup receipt. Do not claim blocked tranche complete.
  Parallelization: Wave 4 | Blocked by: 5, 6 | Blocks: final verification wave.
  References (executor has NO interview context - be exhaustive): `package.json:5-17`, `.claude/rules/agenda-fidelity.md:3-12`, `.claude/rules/agenda.md`, `Specdrivenagenda:28-34`, all modified agenda files.
  Acceptance criteria (agent-executable): `npm run test -- --run src/modules/agenda`, `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build` pass or pre-existing unrelated failures are named; browser QA passes affected routes and cleanup receipt is present.
  QA scenarios (name the exact tool + invocation): happy: Playwright/Chrome on Vite actual port for `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` at 1280x800 and 390x844; failure: visit `#doesNotExist`, expect final hash `#agenda` and no console error. Evidence `.omo/evidence/agenda-front-plan/task-8-final-browser.md`.
  Commit: Y | `test(agenda): verify safe agenda tranche`.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
  Verify completed todos have references, acceptance evidence and QA artifacts, and blocked tranche is not claimed complete.
- [ ] F2. Code quality review
  Review changed TS/TSX for type safety, no `any`, no forbidden HTTP/fetch, no broad generated-file churn and no affiliate modifications.
- [ ] F3. Real manual QA
  Re-run browser route matrix for changed agenda hashes with fresh screenshots.
- [ ] F4. Scope fidelity
  Check implementation against `Specdrivenagenda`: importação blocked, P-B limited to confirmed exception, P-C not implemented as final truth, three axes not collapsed.

## Commit strategy
- Use branch/worktree `work/agenda-front` for agenda product changes while the affiliates Boulder remains active in main.
- One logical commit per completed code todo.
- Do not stage or commit affiliate files.
- Final branch commit footer when commits exist: `Plan: .omo/plans/agenda-front-plan.md`.

## Success criteria
- Safe agenda tranche is implemented and verified without editing affiliate files.
- Agenda-specific guardrails exist.
- Route/previews coverage is added without overwriting dirty affiliate route tests.
- New activity inline mock options are moved behind typed mock/service helpers.
- Confirmed detail exception and mobile detail responsiveness are handled.
- Blocked tranche is represented by a decision packet, not hidden as implemented work.
