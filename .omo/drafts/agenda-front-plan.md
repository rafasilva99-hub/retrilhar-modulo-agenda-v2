---
slug: agenda-front-plan
status: plan-corrected-owner-decision-needed
intent: unclear
review_required: false
pending-action: execute safe tranche in agenda-owned worktree, then ask owner decision before reservations/csv/audit/day-completion tranche
approach: Plano front-first corrigido apos Metis: executar apenas tranche segura fundamentada por Specdrivenagenda e bloquear lista de reservas, CSV, auditoria ampla e conclusao do dia ate decisao/dados de produto.
---

# Draft: agenda-front-plan

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
DOCS | Documentacao de produto da agenda a ser enviada pelo usuario vira fonte primaria antes do plano executavel | active | user message 2026-07-20: "Vou enviar a documentacao para a área de agenda a seguir"
ROUTES | Rotas agenda preservadas e linkadas: #agenda, #agendaDia, #atualizacoes, #novaAtividade, previews #preview/agenda/* e #preview/atualizacoes/* | active | src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,44-59,62-119; src/modules/agenda/components/AgendaPrototypeApp.tsx:84-180,260-326
MOCKS | Agenda segue mock-only por src/mocks/agenda e src/modules/agenda/services/agenda-mock-service.ts | active | CLAUDE.md:14,21-24; .claude/rules/agenda-fidelity.md:3-10; src/modules/agenda/services/agenda-mock-service.ts:1-142
FIGMA_CONTAINMENT | Mes, dia e atualizacoes ainda passam por adapters que encapsulam exports legados do Figma | active | docs/audits/figma-export-containment.md:3-18; src/modules/agenda/adapters/figma-agenda-month-page.tsx:1-31; src/modules/agenda/adapters/figma-agenda-day-page.tsx:1-39; src/modules/agenda/adapters/figma-agenda-updates-page.tsx:1-29
NOVA_ATIVIDADE | Nova atividade e a tela mantida mais urgente para modularizacao, com dados inline e arquivo grande | active | src/modules/agenda/components/AgendaNovaAtividade.tsx:18-48,97-119,256-314; pure LOC check: 1741
CONFLICT_SAFETY | Execucao deve evitar conflito com afiliados e usar branch/worktree temporaria quando tocar arquivos compartilhados | active | git status --short; user message 2026-07-20: cuidado com conflito/branches/worktrees
TOKEN_ORCHESTRATION | Plano deve economizar tokens/modelo: tarefas simples em agentes/modelos baratos; orquestracao, analise, planejamento e revisao em modelos mais capazes | active | user message 2026-07-20: otimizacao de tokens e orquestracao de agente
PLAN | Plano corrigido criado com 8 tarefas, 4 verificacoes finais e tranche bloqueada explicita | active | .omo/plans/agenda-front-plan.md; Metis ITERATE resolvido no plano

## Open assumptions (announced defaults)
<!-- Intent is UNCLEAR: research resolves ambiguity, defaults are adopted (not asked), and each is surfaced in the plan's human TL;DR for veto. -->
<!-- assumption | adopted default | rationale | reversible? -->
Documentation gate | Nao gerar plano final nem implementar ate a documentacao de agenda chegar | O usuario anunciou que enviara a documentacao; sem ela, o backlog de produto seria inferido | sim
Conflict mode | Planejar execucao com baseline `git status --short`, write sets disjuntos e worktree/branch temporaria para arquivos compartilhados | Ha outro chat trabalhando afiliados e `AgendaPrototypeApp`/hash parser misturam os dois modulos | sim
Backend | Nenhum dado conectado a backend; interacoes ficam em estado local ou servicos mockados | CLAUDE e agenda-fidelity exigem prototipo mock-only e sem fetch/API/auth | sim
Route surface | URLs finais devem incluir pelo menos `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` e previews relevantes | O modulo de agenda ja e validado por hash routes e previews; o handoff precisa ser clicavel | sim
Implementation target | Priorizar extracao/refino incremental, nao reescrita total dos exports Figma | Docs/audits mandam encapsular e refatorar gradualmente; arquivos legados sao enormes | sim
Agent/model routing | Usar `explorer`/modelos low-cost para buscas, inventarios e patches mecanicos; reservar modelos high-capability para plano, revisao, QA critica e integracao de resultados | O usuario pediu otimizar tokens sem perder qualidade nas decisoes de maior risco | sim

## Findings (cited - path:lines)
- O projeto e um prototipo Vite/React de usabilidade, mock-only, com mocks como fonte de verdade e sem backend/auth/Next/OpenAPI/fetch em codigo mantido. CLAUDE.md:3-35; .claude/rules/agenda-fidelity.md:3-12.
- `src/app/App.tsx` e fino e renderiza apenas `AgendaPrototypeApp`; a orquestracao do modulo mora em `src/modules/agenda`. src/app/App.tsx:1-5; docs/audits/shell-route-policy.md:21-25.
- O parser de hash suporta `agenda`, `agendaDia`, `atualizacoes`, `novaAtividade`, `produtos` e rotas de afiliados; hashes desconhecidos normalizam para `agenda`. src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,57-60,87-119.
- O fluxo principal atual e calendario/dia/detalhes: clique em dia leva a `#agendaDia`; detalhes/check-in levam a `#atualizacoes`; cancelamento volta a `#agendaDia`. src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:121-171.
- `AgendaPrototypeApp` tambem contem branches de afiliados; qualquer mudanca nele deve preservar `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes` e `#ajuda`. src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-244.
- Mes, dia e atualizacoes sao telas agenda contidas atras de adapters que importam Figma legacy. src/modules/agenda/adapters/figma-agenda-month-page.tsx:1-31; figma-agenda-day-page.tsx:1-39; figma-agenda-updates-page.tsx:1-29.
- `AgendaNovaAtividade.tsx` e codigo mantido com 1741 pure LOC, varias opcoes mockadas inline e componentes internos; deve ser fatiado antes de novas regras complexas. src/modules/agenda/components/AgendaNovaAtividade.tsx:18-48,97-119,256-314; pure LOC check.
- Servico mockado consolidado existe para view models de mes, dia e atualizacoes. src/modules/agenda/services/agenda-mock-service.ts:1-142.
- Testes atuais cobrem quatro hashes principais, fallback, servico mockado, primitivas de nova atividade, primitivas de rota e indicadores de status. src/app/App.test.tsx:6-53; src/modules/agenda/services/agenda-mock-service.test.ts; src/modules/agenda/components/new-activity/new-activity-sections.test.tsx; src/modules/agenda/components/primitives/agenda-route-primitives.test.tsx; src/modules/agenda/components/status/agenda-status-indicators.test.tsx.
- Nao ha `Specdrivenagenda.md` ou spec agenda equivalente no repo atual; a documentacao prometida pelo usuario deve preencher esse vazio antes do approval gate. `rg --files -g '*[Aa]genda*' -g '*.md'`.
- Worktree atual contem `.omo/drafts/`, `.omo/plans/afiliados-front-plan.md` e `Specdrivenafiliados.md` nao rastreados; este chat nao deve sobrescrever o plano/artefatos do outro modulo. `git status --short`.
- `Specdrivenagenda` chegou e define agenda como refatoracao, nao construcao do zero; specs executaveis incluem home hover/resumo, detalhes excecao parcial, responsividade mobile restante, lista de reservas, export CSV, auditoria e conclusao do dia. Specdrivenagenda:1-147.
- A importacao de dados fica BLOQUEADA por P-A; P-B e P-C contem A VALIDAR que nao podem virar verdade definitiva sem validacao. Specdrivenagenda:61-79,134-154.
- Boulder atual esta ativo para `afiliados-front-plan`, entao a execucao de agenda nao deve sobrescrever `.omo/boulder.json` no main worktree. .omo/boulder.json.

## Decisions (with rationale)
- Intent: UNCLEAR ate chegada da documentacao de agenda; review_required: false por enquanto porque este turno so prepara controle e nao gera plano final.
- A documentacao de agenda sera tratada como fonte primaria de produto; ate la, o draft registra somente fatos arquiteturais e guardrails.
- O plano futuro deve conter politica explicita de conflito: `git status --short` antes de cada wave, nada em `src/modules/afiliados/**`, e branch/worktree temporaria se tocar arquivos compartilhados.
- Arquivos compartilhados de maior risco: `src/components/layout/types.ts`, `src/mocks/shell.ts`, `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`, `src/modules/agenda/components/AgendaPrototypeApp.tsx`, e topbar/workspace switcher.
- Para acelerar sem conflito, a execucao deve dividir work sets por tela/servico: nova atividade, services/mocks, route tests, adapters/extractions, QA visual, cada um com ownership claro.
- O plano futuro deve explicitar roteamento de agentes/modelos por custo e risco: tarefas simples e isoladas para modelos economicos; orquestracao, analise de conflitos, planejamento, revisao e decisoes arquiteturais para modelos mais capazes.
- A estrategia de agentes deve minimizar contexto duplicado: prompts self-contained, `fork_context: false`, entregaveis pequenos, referencias exatas de arquivos/linhas e nenhuma releitura ampla quando CodeGraph/rg ja tiverem respondido.
- Plano criado em `.omo/plans/agenda-front-plan.md` com 13 tarefas e 4 verificacoes finais; Metis esta revisando antes de qualquer execucao dependente.
- Defaults reversiveis adotados para desbloquear o prototipo: lista de reservas dentro do contexto `#atualizacoes`/participantes sem rota nova; conclusao do dia com decisao agregada para pendentes; importacao fora do escopo.
- Metis rejeitou a primeira versao do plano porque ela tratava PROPOSTA/A VALIDAR como implementacao final, tinha dependencias conflitantes e referencias incorretas; a versao atual separa tranche segura de tranche bloqueada.
- Tranche segura: isolamento/worktree, regra agenda, testes de rotas/previews, contrato de blockers, extracao de dados inline de nova atividade, excecao confirmada de detalhes e QA.
- Tranche bloqueada: lista de reservas, CSV, auditoria global/per-reserva e conclusao do dia dependem de decisao de localizacao/UX, matriz RPP002 completa e contrato de colunas/filtros/CSV.

## Agent orchestration matrix (draft)
<!-- task class | default agent/model | write set | token tactic | escalate when -->
Repo inventory and route/test mapping | `explorer` / low-cost | read-only | `fork_context: false`, exact questions, file:line output only | evidence conflicts or missing route ownership
Simple mechanical extraction from one file | low-cost worker | one owned file family, never shared files | pass exact source lines and acceptance checks, no broad context | touches shared hash/layout files or behavior changes across routes
Agenda service/mock tests | medium worker or local main | `src/modules/agenda/services/**`, `src/mocks/agenda/**`, paired tests | provide service API and test names only | new domain shape crosses multiple screens or mocks become ambiguous
Shared routing/shell edits | main orchestrator or high-capability worker | `AgendaPrototypeApp`, navigation hook, layout types, shell mocks | require fresh `git status`, branch/worktree, and full affiliate-route preservation list | any concurrent dirty change, merge conflict, or AppPage union change
Product/spec synthesis after docs | high-capability planner | `.omo/drafts/**`, then `.omo/plans/**` only | summarize docs once, cite paths/sections, avoid repeated wide reads | spec contradicts existing guardrails or asks backend/auth/fetch
Visual/browser QA | QA executor or main, depending scope | evidence only | one dev server, route list batch, screenshots/logs per route | route blank, console errors, overlap, responsive defects
Final review/integration | high-capability reviewer/main | read-only or focused fixes | diff-scoped prompt, evidence paths, no duplicate repo dump | reviewer cites a success criterion failure

## Concurrency and worktree protocol (draft)
- Before any implementation wave, run `git status --short` and record unrelated dirty paths in the plan/evidence. Do not stage, format, revert, or overwrite paths owned by the affiliates chat.
- If a wave touches only agenda-owned files such as `src/modules/agenda/components/**`, `src/modules/agenda/services/**`, `src/mocks/agenda/**`, or paired agenda tests, it may run in the main worktree after confirming no concurrent dirty edits exist in those exact paths.
- If a wave touches shared files (`src/modules/agenda/components/AgendaPrototypeApp.tsx`, `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`, `src/components/layout/types.ts`, `src/mocks/shell.ts`, topbar/workspace switcher, or any `.omo/plans/*` file owned by another module), create a temporary branch/worktree first.
- Worktree naming convention: branch `work/agenda-<short-scope>` and directory `../Retrilhar-agenda-<short-scope>-worktree`; record creation command, base SHA, and teardown command in evidence.
- Worktree creation command template: `git worktree add -b work/agenda-<short-scope> ../Retrilhar-agenda-<short-scope>-worktree HEAD`.
- Worktree teardown command template after merge/integration or abandonment: `git worktree remove ../Retrilhar-agenda-<short-scope>-worktree`; then verify with `git worktree list`.
- Shared-file edit rule: before applying a patch, re-read the current file in the target worktree, preserve all affiliate branches/routes exactly, and add/update tests that cover agenda routes plus affiliate route preservation if the shared branch logic changes.
- Integration rule: never merge worktree output over a dirty main worktree; first inspect `git diff --name-only` in both worktrees and apply only the agenda-owned patch hunks.
- Artifact rule: this chat owns `.omo/drafts/agenda-front-plan.md` and later `.omo/plans/agenda-front-plan.md`; it must not edit `.omo/plans/afiliados-front-plan.md` except to read high-level dependency context if the user asks.

## Documentation intake checklist (draft)
- Save or reference the user-provided agenda documentation in the draft with section titles and stable anchors before creating `.omo/plans/agenda-front-plan.md`.
- Extract every explicit screen, flow, state, data field, validation, empty/loading/error state, and must-not-have from the documentation.
- Map each documented requirement to existing surfaces: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`, preview hashes, mocks/services, adapters, and maintained components.
- Mark each requirement as existing, needs refinement, needs new UI, blocked by missing product decision, or out of scope because it asks for backend/auth/API.
- Convert only evidence-backed requirements into plan todos. If the doc asks for irreversible product behavior not answered by repo evidence, ask one focused owner question before approval.
- For every generated todo, require RED/GREEN or characterization proof, browser QA through the actual hash URL, and evidence paths under `.omo/evidence/agenda-front-plan/**`.

## Scope IN
- Preparar plano para finalizar/refinar o frontend do modulo de agenda apos leitura da documentacao de produto.
- Preservar rotas hash `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` e previews agenda relevantes.
- Manter Vite/React mock-only e consumir dados via `src/mocks/agenda` ou `src/modules/agenda/services`.
- Planejar modularizacao segura de `AgendaNovaAtividade.tsx` e extracao incremental das telas que ainda passam por Figma legacy.
- Adicionar/ajustar testes e browser QA reais das rotas de agenda quando o plano for executado.
- Linkar telas finais com URLs diretas do localhost no handoff.
- Usar branch/worktree temporaria se a execucao precisar isolar trabalho do chat paralelo de afiliados.
- Definir uma matriz de orquestracao com modelo/agente recomendado por tipo de tarefa, custo esperado, write set e criterio de escalacao para modelo mais forte.

## Scope OUT (Must NOT have)
- Nao implementar produto antes de receber a documentacao de agenda e passar pelo approval gate do plano.
- Nao editar `src/modules/afiliados/**` nem `src/mocks/afiliados/**`.
- Nao remover ou quebrar rotas de afiliados ja registradas em `AgendaPrototypeApp`/hash parser.
- Nao introduzir backend, `fetch(`, cliente HTTP, Next.js, auth real, OpenAPI SDK, service worker ou Sentry.
- Nao editar o projeto Retrilhar Admin nem tratar este prototipo como migrado.
- Nao fazer reescrita total dos exports Figma; extrair incrementalmente atras dos adapters.

## Open questions
Pergunta bloqueante para a tranche ampliada: confirmar localizacao/UX da lista de reservas e auditoria, aprovar ou nao as PROPOSTAS como prototipo, e fornecer/confirmar matriz RPP002 e contrato de CSV. A tranche segura pode executar sem essa resposta.

## Approval gate
status: plan-corrected-owner-decision-needed
brief:
  found:
    - Agenda ja tem quatro rotas principais, previews, servico mockado, testes de rota/servico/primitivas e docs de alinhamento Admin.
    - A maior divida tecnica visivel antes da spec e `AgendaNovaAtividade.tsx` com 1741 pure LOC e mocks inline; mes/dia/atualizacoes continuam atras de exports Figma legacy encapsulados.
    - Ha risco real de conflito com o outro chat porque `AgendaPrototypeApp` e o hash parser tambem carregam branches de afiliados.
    - `Specdrivenagenda` define agenda como refatoracao e separa specs EXECUTAVEIS, BLOQUEADAS e A VALIDAR.
  approach:
    - Executar `.omo/plans/agenda-front-plan.md` apos revisao Metis, preferencialmente em worktree propria da agenda porque `.omo/boulder.json` no main pertence ao plano de afiliados.
    - Planejar execucao em work sets disjuntos e exigir branch/worktree temporaria para qualquer mudanca em arquivos compartilhados.
    - Planejar orquestracao economica: modelos/agentes baratos para tarefas simples e modelos mais capazes apenas para coordenacao, analise, planejamento, revisao e QA critica.
    - Exigir handoff com links diretos: `http://localhost:<porta>/#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` e previews selecionados.
  pending-action: execute safe tranche task 1 in agenda-owned worktree; ask owner decision before blocked tranche
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
