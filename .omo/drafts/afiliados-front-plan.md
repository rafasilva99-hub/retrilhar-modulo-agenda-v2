---
slug: afiliados-front-plan
status: plan-written
intent: clear
review_required: false
pending-action: deliver .omo/plans/afiliados-front-plan.md and ask start-or-review
approach: Plano de finalizacao front-first do modulo de afiliados, mantendo o prototipo Vite/React mock-only, criando DESIGN.md e AGENTS.md como primeiros entregaveis de execucao e refinando apenas specs EXECUTAVEIS de Specdrivenafiliados.md.
---

# Draft: afiliados-front-plan

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
DOCS | DESIGN.md e AGENTS.md criados na raiz como contratos de design/Codex antes de editar telas | active | CLAUDE.md:8-35,125-157; .claude/rules/agenda-fidelity.md:3-12; src/styles/theme.css:3-45,47-85,87-166
ROUTES | Todas as telas de afiliados acessiveis por hash e linkadas no handoff: #afiliados, #indicacoes, #ganhos, #produtosLinks, #configuracoes, #ajuda | active | src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,44-59,78-113; src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-244
MOCKS | Dados do afiliado continuam sem backend, vindos de src/mocks/afiliados ou servicos mockados a criar sob src/modules/afiliados/services | active | src/mocks/afiliados/index.ts:9-18,122-149,159-1191; Specdrivenafiliados.md:30-33,85-121
AFFILIATE_UI | Home, Indicacoes, Ganhos, Produtos e Links, Configuracoes e Ajuda refinados com shadcn/HugeIcons/tokens e sem reescrita total | active | src/modules/afiliados/*.tsx; src/components/layout/app-page.tsx:51-85; src/components/ui/button.tsx:7-37; src/components/ui/card.tsx:15-81
SPEC_EXECUTABLES | Implementar/refinar somente backlog EXECUTAVEL: alterar destino de repasse, solicitar filiacao de produtos, interna de links por organizacao, Produtos e Links, Minhas afiliacoes, Ajuda | active | Specdrivenafiliados.md:38-53,75-125
BLOCKED_SPECS | Home de primeiro acesso e Sala de negocios ficam fora da primeira execucao por pendencias P-A/P-B/P-C | deferred | Specdrivenafiliados.md:50-67

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
Design system | Extrair DESIGN.md do sistema visual implicito existente, nao pesquisar uma direcao nova | O usuario pediu priorizar diretrizes visuais existentes; o repo ja tem tokens, shell, shadcn e HugeIcons | sim
Codex rules | Criar AGENTS.md na raiz consolidando CLAUDE.md, agenda-fidelity e guardrails de afiliados | Codex le AGENTS.md; o repo ainda nao tem esse contrato | sim
Settings/help shell | Preservar #configuracoes e #ajuda como telas full-screen/bare existentes, e apenas garantir links de acesso/retorno | O codigo atual renderiza essas rotas fora do AppShell e elas tem header proprio com fechar | sim
Blocked specs | Nao implementar Home de primeiro acesso nem Sala de negocios nesta primeira execucao | Specdrivenafiliados.md marca essas specs como BLOQUEADO por decisoes pendentes | sim
Backend | Nenhum dado conectado a backend; interacoes simuladas em estado local ou servico mockado sincrono | Pedido do usuario e regras do projeto exigem prototipo mock-only | sim
Execution parallelism | Usar subagentes/worktrees apenas para lotes com write sets disjuntos; fechar worktrees ao final e nunca sobrescrever worktree suja | Usuario pediu aceleracao com cuidado contra conflito | sim

## Findings (cited - path:lines)
- O projeto e um prototipo de usabilidade que deve seguir disciplina visual/estrutural do Retrilhar Admin sem backend, auth real ou Next.js. CLAUDE.md:3-35.
- Arquitetura alvo: ui gerenciado, layout compartilhado, custom Retrilhar, modules por feature, mocks como fonte de verdade, imports Figma como legado. CLAUDE.md:8-16.
- Regras: HugeIcons, shadcn/layout antes de nativos, nao expor "mock" na UI, consumir servicos mockados em modules/services, manter hash routes de teste, rodar npm run check. CLAUDE.md:17-35.
- Agenda fidelity: mock-only, Vite/React, hash-routed; sem Next/auth/OpenAPI/fetch/backend; dados de src/mocks ou services mockados; usar HugeIcons, shadcn, tokens e layout/custom. .claude/rules/agenda-fidelity.md:3-12.
- Spec de afiliados define painel consolidado do afiliado, filtro por organizacao, termo "afiliação", produtos todos/especificos, links em tres niveis, status por afiliacao, recebimento por organizacao e afiliado sem alterar condicoes comerciais. Specdrivenafiliados.md:18-30.
- Backlog EXECUTAVEL inicial: alterar destino de repasse, solicitar filiacao de produtos, interna de links por organizacao, refinamento Produtos e Links, Minhas afiliacoes, Ajuda. Specdrivenafiliados.md:38-49.
- Backlog BLOQUEADO: Home de primeiro acesso, Sala de negocios V1; pendencias P-A/P-B/P-C/P-D nao devem ser decididas pelo executor. Specdrivenafiliados.md:50-69.
- Spec exemplar de Formas de recebimento exige selecionar destino existente, tipo de recebimento nao editavel, dinheiro sem destino, badges Padrao/Em uso, sem integracao bancaria. Specdrivenafiliados.md:75-125.
- Rotas afiliados ja existem na union e no parser hash: afiliados, indicacoes, ganhos, produtosLinks, configuracoes, ajuda; unknown hash cai para agenda. src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,44-59.
- URLs acessiveis no Vite padrao: http://localhost:5173/#afiliados, #indicacoes, #ganhos, #produtosLinks, #configuracoes, #ajuda. Evidencia: hook de hash e AgendaPrototypeApp.
- AgendaPrototypeApp renderiza #afiliados, #indicacoes, #ganhos, #produtosLinks dentro de AppShell; #configuracoes e #ajuda renderizam tela direta. src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-244.
- Navegacao lateral do afiliado exposta: Inicio, Indicacoes, Ganhos, Produtos e Links. src/mocks/shell.ts:50-64.
- Configuracoes e ajuda sao acessadas pelo profile dropdown/topbar e links internos, nao pela sidebar. src/components/layout/topbar/topbar-profile.tsx:74-107.
- Testes de app cobrem agenda e fallback, mas nao as seis rotas de afiliados. src/app/App.test.tsx:6-50.
- Mocks de afiliados centralizam organizacoes, codigo KAT-2931, links, indicacoes, KPIs, ganhos, destinos de recebimento, produtos, perfil, afiliacoes, notificacoes e FAQ. src/mocks/afiliados/index.ts:9-1191.
- Arquivos de afiliados estao grandes e devem ser fatiados com cuidado por subcomponentes/servicos para reduzir conflito: AfiliadosPage 1111 linhas, ConfiguracoesPage 1125, Ganhos 551, Indicacoes 615, ProdutosLinks 418, Ajuda 216, mock 1191.
- Estilos: Tailwind v4, shadcn/tailwind.css, tw-animate-css, semantic tokens em theme.css, Helvetica Neue em fonts.css/theme.css. src/styles/index.css:1-4; src/styles/tailwind.css:1-5; src/styles/fonts.css:1-43; src/styles/theme.css:3-45,47-85.
- Shell visual: AppLayout usa offset 260px/124px; sidebar fixa 24px inset, 200px/64px; topbar fixa; AppPage com padding top 112px e offset por var. src/components/layout/app-layout.tsx:36-57; app-sidebar.tsx:28-67; top-bar.tsx:22-42; app-page.tsx:51-85.
- Worktree atual tem untracked .omo/drafts/ e Specdrivenafiliados.md; executor nao deve revertar nem sobrescrever. git status --short.

## Decisions (with rationale)
- Intent: CLEAR; review_required: false. O usuario definiu documentos-base, modulo inicial, restricoes e necessidade de plano, sem pedir high-accuracy review.
- Classificacao do plano: Architecture-scale para a execucao planejada, embora este turno seja LIGHT control-plane. O plano deve orquestrar waves e subagentes por write set.
- A primeira wave de execucao deve criar DESIGN.md e AGENTS.md antes de qualquer tela, porque frontend skill exige design-system gate e Codex precisa de regras nativas.
- O modulo de afiliados deve ser tratado como front mock completo, nao como integracao backend. A ausencia de backend e requisito, nao limitacao.
- O plano deve incluir smoke tests para todas as seis rotas de afiliados antes de refinos grandes, porque essa e a lacuna de cobertura existente.
- O plano deve exigir real browser QA com screenshots e links finais das telas, incluindo hashes diretos e previews quando aplicavel.
- O plano deve permitir subagentes de execucao somente em worktrees ou write sets disjuntos; qualquer worker deve registrar baseline git status, nao reverter alteracoes alheias e fechar worktree ao final.
- Apos Metis, todos os itens do plano devem incluir `Complexity/risk`, `Worker tier`, `Delegation rule`, `Context packet`, `Escalation rule`, `Parallelism rule` e `Evidence budget` para otimizar tokens e reservar modelos fortes para orquestracao, analise, integracao e revisao.

## Scope IN
- Criar `DESIGN.md` na raiz com sistema visual extraido do projeto: atmosfera, tokens, tipografia Helvetica Neue, layout shell, componentes/primitivos, estados, motion, acessibilidade e debt.
- Criar `AGENTS.md` na raiz com regras Codex para Vite/React hash-routed mock-only, HugeIcons, shadcn/layout/custom, mocks/servicos mockados, sem backend/fetch/Next/auth, worktree safety e QA.
- Criar `.claude/rules/afiliados.md` a partir da secao 1 de Specdrivenafiliados.md se a execucao precisar de regra por modulo.
- Refatorar `src/modules/afiliados` para servicos mockados, tipos e componentes mantidos sem arrays inline e sem reescrita total.
- Finalizar/refinar telas existentes: `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`.
- Implementar/refinar specs EXECUTAVEIS de Specdrivenafiliados.md, com prioridade para Formas de recebimento/alterar destino, solicitar filiacao de produtos, links por organizacao, Produtos e Links, Minhas afiliacoes e Ajuda.
- Adicionar cobertura de rota/smoke para hashes de afiliados e cobertura comportamental para estados criticos mockados.
- Produzir evidencias `.omo/evidence/**` com npm run check, testes especificos e browser QA em desktop/mobile.
- Linkar no handoff final todas as telas criadas/acessiveis por URL hash.

## Scope OUT (Must NOT have)
- Nao implementar backend, API real, fetch, cliente HTTP, auth, OpenAPI SDK, Next.js, RSC, PWA, service worker ou headers de backend.
- Nao alterar Retrilhar Admin, nem rodar format/install/codegen/fix nesse repo externo.
- Nao implementar Home de primeiro acesso, Sala de negocios V1 ou landing/subdominio ate as pendencias P-A/P-B/P-C serem resolvidas.
- Nao decidir por conta propria pendencias A VALIDAR quando elas mudarem produto irreversivelmente; registrar debt ou usar comportamento local reversivel.
- Nao editar `src/components/ui/**` em massa; tratar shadcn como gerenciado e criar wrappers/custom quando necessario.
- Nao introduzir novo pacote de icones; usar HugeIcons e excecoes geradas ja documentadas.
- Nao apresentar textos "mock" na UI.
- Nao usar worktree compartilhada para dois workers editarem os mesmos arquivos grandes de afiliados.

## Open questions
Nenhuma pergunta bloqueante. Defaults reversiveis foram anunciados acima; se o usuario nao vetar, entram no plano.

## Approval gate
status: approved-and-plan-written
brief:
  found:
    - O projeto ja tem seis telas de afiliado acessiveis por hash e dados mockados ricos, mas carece de DESIGN.md, AGENTS.md, smoke tests das rotas de afiliados e modularizacao dos arquivos grandes.
    - As regras do projeto exigem prototipo Vite/React mock-only, hash-routed, sem backend/fetch/Next/auth e com HugeIcons/shadcn/tokens.
    - Specdrivenafiliados.md separa o que e EXECUTAVEL do que esta BLOQUEADO; a primeira execucao deve obedecer essa separacao.
  approach:
    - Planejar uma execucao em ondas: fundacao de regras/design/testes; modularizacao segura; refinamento das telas; specs executaveis; browser QA final com links.
    - Orquestrar subagentes por write set disjunto, com worktrees temporarias quando houver edicao paralela, e fechamento/limpeza obrigatoria.
    - Exigir que o handoff final liste URLs diretas: http://localhost:<porta>/#afiliados, #indicacoes, #ganhos, #produtosLinks, #configuracoes, #ajuda.
  pending-action: deliver .omo/plans/afiliados-front-plan.md; next user choice is start work or run high-accuracy review first

## Plan generation
- Approval received: user replied "Ok".
- Plan path: `.omo/plans/afiliados-front-plan.md`.
- Metis result: gaps found only for token-aware worker routing; incorporated into execution strategy and every todo.
- Structural self-check: headers match template; todos 1-14 are column-zero `- [ ] N.` rows; final verification rows F1-F4 are column-zero `- [ ] F<number>.` rows; no placeholders remain.
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
