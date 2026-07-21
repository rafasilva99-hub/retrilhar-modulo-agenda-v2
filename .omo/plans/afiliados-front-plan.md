# afiliados-front-plan - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** Um plano para finalizar o front mockado do painel de afiliados com seis telas acessiveis por link direto, regras Codex do projeto, design system documentado, servicos mockados e verificacao por navegador. A execucao entrega uma base reaproveitavel para continuar os demais modulos pendentes sem puxar backend.

**Why this approach:** O projeto ja tem uma direcao visual e dados mockados suficientes, entao o primeiro passo e codificar esse contrato em documentos e testes antes de refinar telas. As tarefas sao fatiadas por arquivos e risco para permitir subagentes sem conflito, com workers baratos nas tarefas simples e modelos fortes apenas na integracao e revisao.

**What it will NOT do:** Nao cria backend, auth, API real, Next.js ou integracao bancaria. Nao implementa Home de primeiro acesso nem Sala de negocios enquanto as pendencias da spec estiverem abertas. Nao troca o visual do projeto por uma direcao generica.

**Effort:** XL
**Risk:** High - o modulo ja existe, mas esta concentrado em arquivos grandes e mistura UI, estado local e mocks; o risco principal e conflito entre workers e regressao visual.
**Decisions to sanity-check:** Manter `#configuracoes` e `#ajuda` como telas full-screen sem `AppShell`; deixar Home de primeiro acesso e Sala de negocios fora desta primeira execucao; usar somente comportamento mock-local para solicitacao de produto e destino de repasse.

Your next move: iniciar a execucao com `$omo:start-work .omo/plans/afiliados-front-plan.md` ou pedir uma revisao high-accuracy antes de executar. Full execution detail follows below.

---

> TL;DR (machine): XL/high-risk affiliate-front plan: create DESIGN.md/AGENTS.md/rules, route tests, affiliate mock services, shared primitives, six refined affiliate screens, browser QA links, and token-aware subagent orchestration.

## Scope
### Must have
- `DESIGN.md` na raiz antes de qualquer UI nova, extraindo o sistema visual ja existente: Helvetica Neue, tokens semanticos Tailwind, azul primario, status fills, shell com sidebar/topbar, shadcn primitives, HugeIcons, estados interativos, motion e acessibilidade.
- `AGENTS.md` na raiz para Codex, consolidando o contrato mock-only/hash-routed do prototipo, regras de conflito/worktree, limites de backend, estrategia de agentes e verificacao.
- `.claude/rules/afiliados.md` com os invariantes de `Specdrivenafiliados.md` secao 1, para o modulo ficar protegido como a Agenda.
- Seis telas de afiliados preservadas e refinadas: `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`.
- Links finais no handoff, sempre usando a porta real do Vite: `http://localhost:<porta>/#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`.
- Dados 100% mockados por `src/mocks/afiliados/**` ou servicos sincronicos em `src/modules/afiliados/services/**`; nada vinculado a backend.
- Cobertura de smoke para todas as rotas de afiliados antes dos refinos grandes.
- Browser QA real em desktop e mobile para as seis telas, incluindo interacoes principais: filtros, copiar links/codigo, abrir drawers/sheets, alterar destino de repasse, solicitar produto, busca de ajuda e retorno para dashboard.
- Orquestracao de subagentes com economia de tokens: tarefas simples em worker barato ou no proprio orquestrador quando a delegacao custar mais que o trabalho; modelos mais fortes apenas para arquitetura, integracao, revisao e conflitos.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Nao implementar backend, API real, `fetch(`, cliente HTTP, auth, OpenAPI SDK, Next.js, RSC, PWA, service worker, headers de backend ou integracao bancaria real.
- Nao editar o repo Retrilhar Admin; ele e referencia read-only.
- Nao expor a palavra "mock" na UI.
- Nao introduzir novo pacote de icones; usar `@hugeicons/react` e `@hugeicons/core-free-icons`. Excecoes geradas com `lucide-react` continuam apenas onde ja documentadas.
- Nao fazer mass edit em `src/components/ui/**`; shadcn e gerenciado. Criar wrappers/custom/module components quando necessario.
- Nao implementar specs bloqueadas: Home de primeiro acesso, Sala de negocios V1, landing/subdominio ou fluxo bidirecional de convite ate P-A/P-B/P-C serem resolvidas.
- Nao deixar dois workers editarem os mesmos arquivos grandes de afiliados ao mesmo tempo.
- Nao rodar `npm run lint:fix`, formatacao ampla, shadcn regeneration ampla ou upgrade de dependencias para "limpar" o repo.
- Nao substituir as telas por um novo visual generico. O design deve partir das diretrizes visuais existentes do projeto.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: TDD/characterization first for routing and mock services with Vitest + React Testing Library; tests-after only for pure documentation (`DESIGN.md`, `AGENTS.md`, `.claude/rules/afiliados.md`) where machine assertions are grep/contract checks.
- Evidence directory: use `attemptDir` from `omo ulw-loop status --json` when running under ulw-loop; otherwise use `.omo/evidence/afiliados-front-plan/`. Every todo below names an evidence filename relative to that directory.
- Required command gates:
  - `npm run test -- --run src/app/App.test.tsx`
  - `npm run test -- --run src/modules/afiliados`
  - `npm run format:check`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run check`
- Required browser QA gate:
  - Start Vite with `npm run dev -- --host 127.0.0.1`.
  - If port 5173 is unavailable, record the actual port from Vite output and use it consistently in evidence.
  - Visit desktop 1280x800 and mobile 390x844 for each hash: `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`.
  - Capture screenshots and an action log; record cleanup receipt proving the QA server was killed and the port released.
- Forbidden-proof checks:
  - `rg -n "fetch\\(|axios|better-auth|next/link|next/image|next-intl|OpenAPI|serviceWorker|navigator\\.serviceWorker" src --glob '!src/imports/**'`
  - `rg -n "mock" src/modules/afiliados src/components src/app --glob '*.{ts,tsx}'` must not find visible UI copy; implementation comments are acceptable only when not rendered.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- Wave 0, orchestration setup: Todo 1 only. The main orchestrator captures worktree state and decides whether to create temporary worktrees.
- Wave 1, foundation: Todos 2, 3, 4 can run after Todo 1. Use one low/medium worker per disjoint write set: docs/rules, tests, no overlapping files.
- Wave 2, data and primitives: Todos 5 and 6 can run in parallel if write sets are separated (`services/types/tests` vs `components/shared/tests`).
- Wave 3, screen slices: Todos 7, 8, 9, 10, 12 can run in parallel only if each worker owns one screen file plus its own test file. Todo 11 is higher-risk and should run alone or with a stronger worker because `ConfiguracoesPage.tsx` is large and owns receiving-destination behavior.
- Wave 4, integration and links: Todo 13 integrates navigation/search/profile links and reconciles all screens after Wave 3.
- Wave 5, final QA: Todo 14 runs after every code todo. It owns browser evidence and final command gate.

Token-aware agent routing rules:
- The main session is the orchestrator. It owns dependency ordering, branch/worktree hygiene, integration, final review, and conflict resolution.
- Use `lazycodex-worker-low` or equivalent cheap worker for bounded docs, grep assertions, copy-only updates, small tests, and deterministic QA scripts.
- Use `lazycodex-worker-medium` for standard screen/component work inside one module file or a small disjoint write set.
- Use `lazycodex-worker-high`, `metis`, `momus`, or a high-capability reviewer only for cross-file architecture, `ConfiguracoesPage` receiving-destination behavior, integration conflicts, final plan/work review, or repeated validation failures.
- Do not delegate tiny tasks when the prompt/context packet would cost more than doing the edit locally.
- Context packets to workers must include only: exact file:line references, write set, constraints, acceptance criteria, QA commands, and evidence path. Do not paste the full transcript or full plan.
- Workers must return concise summaries: changed files, commands run, pass/fail, evidence paths, and blockers. Long logs/screenshots stay under `.omo/evidence/**`.
- Escalate to a stronger worker only after a concrete blocker: unresolved ambiguity, cross-component impact, failed validation, or integration conflict. Do not retry unchanged work at the same tier.
- If parallel implementation would touch the same large file, use a temporary `git worktree` per worker or serialize those todos. Close temporary worktrees before completion and record `git worktree list` before/after.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | none | all | none |
| 2 | 1 | 5-14 | 3, 4 |
| 3 | 1 | 5-14 | 2, 4 |
| 4 | 1 | 7-14 | 2, 3 |
| 5 | 2, 3, 4 | 7-11, 13, 14 | 6 |
| 6 | 2, 3, 4 | 7-12, 13, 14 | 5 |
| 7 | 5, 6 | 13, 14 | 8, 9, 10, 12 |
| 8 | 5, 6 | 13, 14 | 7, 9, 10, 12 |
| 9 | 5, 6 | 13, 14 | 7, 8, 10, 12 |
| 10 | 5, 6 | 13, 14 | 7, 8, 9, 12 |
| 11 | 5, 6 | 13, 14 | 12 only if no shared files |
| 12 | 5, 6 | 13, 14 | 7, 8, 9, 10 |
| 13 | 7-12 | 14 | none |
| 14 | 13 | final verification wave | none |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Capture baseline, evidence directory, and worktree policy
  What to do / Must NOT do: Capture `git status --short --branch`, `git worktree list`, `npm --version`, `node --version`, and whether `Specdrivenafiliados.md` is untracked. Create the evidence directory. Do not change product files. If temporary worktrees will be used, create a naming convention like `../retrilhar-afiliados-task-<N>` and record cleanup commands before spawning workers.
  Complexity/risk: simple / low.
  Worker tier: main orchestrator directly or `lazycodex-worker-low`; no high-capability model.
  Delegation rule: do locally if no worker is already available; delegating this can cost more tokens than it saves.
  Context packet: repo root, draft plan path, expected evidence filenames only.
  Escalation rule: escalate only if git state is corrupted or worktree creation fails twice.
  Parallelism rule: no parallel product edits before this completes.
  Evidence budget: write command outputs to `.omo/evidence/afiliados-front-plan/task-1-baseline.txt`; summarize only filenames in chat.
  Parallelization: Wave 0 | Blocked by: none | Blocks: 2-14.
  References (executor has NO interview context - be exhaustive): `.omo/drafts/afiliados-front-plan.md:1-99`, `git status --short`, `package.json:5-17`.
  Acceptance criteria (agent-executable): `test -d .omo/evidence/afiliados-front-plan && test -s .omo/evidence/afiliados-front-plan/task-1-baseline.txt`.
  QA scenarios (name the exact tool + invocation): happy: bash `git status --short --branch && git worktree list` records current state; failure: bash `test ! -f .git/index.lock` records no stale lock or names blocker. Evidence `.omo/evidence/afiliados-front-plan/task-1-baseline.txt`.
  Commit: N | none.

- [x] 2. Create root DESIGN.md from the existing visual system
  What to do / Must NOT do: Create `DESIGN.md` at repo root using the frontend design-system structure. Extract what exists, do not invent a new brand direction. Include atmosphere, palette/tokens, typography, spacing/layout, shell primitives, shadcn/custom primitives, motion, accessibility constraints, accepted debt, and a Primitive Showcase requirement for execution. Must cite current tokens and files inside the doc. Do not edit UI code in this todo.
  Complexity/risk: simple documentation / medium because it gates all UI work.
  Worker tier: `lazycodex-worker-low` with a tight context packet; main orchestrator reviews.
  Delegation rule: delegate only this file to avoid conflict; batch no product edits with it.
  Context packet: `CLAUDE.md:8-35,125-157`, `.claude/rules/agenda-fidelity.md:3-12`, `src/styles/theme.css:3-45,47-120,134-166`, `src/styles/fonts.css:1-43`, `src/components/layout/*.tsx`, `src/components/ui/button.tsx:7-37`, `src/components/ui/card.tsx:5-89`.
  Escalation rule: escalate to medium only if the worker cannot reconcile existing hardcoded affiliate colors with semantic tokens.
  Parallelism rule: can run with Todo 3 and 4; writes only `DESIGN.md`.
  Evidence budget: store grep/readback in `.omo/evidence/afiliados-front-plan/task-2-design-contract.txt`.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5-14.
  References (executor has NO interview context - be exhaustive): `CLAUDE.md:125-148`, `src/styles/index.css:1-4`, `src/styles/tailwind.css:1-5`, `src/styles/fonts.css:1-43`, `src/styles/theme.css:3-120`, `src/components/layout/app-layout.tsx:36-57`, `src/components/layout/app-sidebar.tsx:28-67`, `src/components/layout/top-bar.tsx:22-42`, `src/components/layout/app-page.tsx:51-85`, `docs/audits/shadcn-ui-quarantine.md:3-34`.
  Acceptance criteria (agent-executable): `test -f DESIGN.md && rg -n "Helvetica Neue|HugeIcons|AppShell|AppPage|--primary|#1E40AF|Primitive Showcase|WCAG|Accepted Debt" DESIGN.md`.
  QA scenarios (name the exact tool + invocation): happy: bash `rg -n "Helvetica Neue|HugeIcons|AppShell|AppPage|--primary|Primitive Showcase" DESIGN.md`; failure: bash `rg -n "Inter as primary|lucide as new icon|generic SaaS|new visual direction" DESIGN.md` returns no matches. Evidence `.omo/evidence/afiliados-front-plan/task-2-design-contract.txt`.
  Commit: Y | `docs(design): codify prototype visual system`.

- [x] 3. Create Codex AGENTS.md and affiliate guardrail rule
  What to do / Must NOT do: Create `AGENTS.md` in the root for Codex and `.claude/rules/afiliados.md` for module-specific affiliate invariants. Include Vite/React, hash routing, mock-only data, HugeIcons, shadcn/layout/custom preference, no backend/fetch/Next/auth, no visible "mock" copy, worktree conflict policy, token-aware agent routing, evidence requirements, and the executable-vs-blocked split from `Specdrivenafiliados.md`. Do not change product code.
  Complexity/risk: simple / low.
  Worker tier: `lazycodex-worker-low`.
  Delegation rule: one low worker can own both docs because they are isolated.
  Context packet: exact docs/spec lines only; no transcript.
  Escalation rule: escalate only if a guardrail conflicts with `CLAUDE.md` or `agenda-fidelity.md`.
  Parallelism rule: can run with Todo 2 and 4; writes only `AGENTS.md` and `.claude/rules/afiliados.md`.
  Evidence budget: write grep checks to `.omo/evidence/afiliados-front-plan/task-3-agents-rules.txt`.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5-14.
  References (executor has NO interview context - be exhaustive): `CLAUDE.md:8-35,109-148`, `.claude/rules/agenda-fidelity.md:3-12`, `Specdrivenafiliados.md:11-33,38-69`, `docs/audits/admin-alignment-readiness.md:32-54`.
  Acceptance criteria (agent-executable): `test -f AGENTS.md && test -f .claude/rules/afiliados.md && rg -n "mock-only|hash|fetch|HugeIcons|worktree|token|afiliacao|afiliação|Sala de negocios|Home de primeiro acesso" AGENTS.md .claude/rules/afiliados.md`.
  QA scenarios (name the exact tool + invocation): happy: bash `rg -n "Vite|React|mock-only|#afiliados|HugeIcons|worktree|worker" AGENTS.md .claude/rules/afiliados.md`; failure: bash `rg -n "Next.js migration|backend required|fetch required|lucide new package" AGENTS.md .claude/rules/afiliados.md` returns no matches. Evidence `.omo/evidence/afiliados-front-plan/task-3-agents-rules.txt`.
  Commit: Y | `docs(codex): add affiliate execution guardrails`.

- [x] 4. Add affiliate hash route smoke coverage before refactors
  What to do / Must NOT do: Extend `src/app/App.test.tsx` so direct load covers `afiliados`, `indicacoes`, `ganhos`, `produtosLinks`, `configuracoes`, and `ajuda`, while keeping existing agenda route and unknown-hash fallback behavior. Add assertions for route-specific text that proves the intended screen rendered. Do not refactor navigation implementation in this todo.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-low` or main; tests only.
  Delegation rule: can delegate because write set is one test file.
  Context packet: test file, route hook lines, AgendaPrototypeApp affiliate render lines, expected screen labels.
  Escalation rule: escalate to medium only if rendering an affiliate route fails due an existing runtime bug.
  Parallelism rule: can run with Todo 2 and 3; writes only `src/app/App.test.tsx`.
  Evidence budget: store RED/GREEN route test output in `.omo/evidence/afiliados-front-plan/task-4-route-smoke-red.txt` and `task-4-route-smoke-green.txt`.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 7-14.
  References (executor has NO interview context - be exhaustive): `src/app/App.test.tsx:1-53`, `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,57-113`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-244`, `src/mocks/shell.ts:50-64`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/app/App.test.tsx` passes and the test source includes all six affiliate hashes.
  QA scenarios (name the exact tool + invocation): happy: bash `npm run test -- --run src/app/App.test.tsx`; failure: mutation proof by temporarily removing `produtosLinks` from the affiliate hashes in the test and confirming the route coverage assertion fails, then revert mutation. Evidence `.omo/evidence/afiliados-front-plan/task-4-route-smoke-red.txt` and `task-4-route-smoke-green.txt`.
  Commit: Y | `test(routes): cover affiliate hash screens`.

- [x] 5. Extract affiliate mock service and types without backend coupling
  What to do / Must NOT do: Add maintained affiliate module boundaries: `src/modules/afiliados/types.ts`, `src/modules/afiliados/services/afiliados-mock-service.ts`, and focused service tests. Re-export or map from `src/mocks/afiliados/index.ts` without changing the fixture IDs/values. Move query/update behavior for UI-local interactions into pure functions where useful: organization filters, referral filters, commission filters, product scope lookup, receiving-destination assignment, destination usage counts, product request local state helpers. Do not add `fetch`, async fake APIs, timers, backend-like errors, or mutate source fixtures globally.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`; stronger model only if type boundaries affect multiple screens unexpectedly.
  Delegation rule: delegate to one worker owning service/types/tests only.
  Context packet: `src/mocks/afiliados/index.ts` line ranges for types/data/helpers, `Specdrivenafiliados.md` invariants, current screen imports from mocks.
  Escalation rule: escalate if services require changing public mock shapes consumed by more than two screens.
  Parallelism rule: can run with Todo 6; no screen edits except import compatibility if absolutely required and agreed by orchestrator.
  Evidence budget: service test logs in `.omo/evidence/afiliados-front-plan/task-5-service-tests.txt`.
  Parallelization: Wave 2 | Blocked by: 2, 3, 4 | Blocks: 7-11, 13, 14.
  References (executor has NO interview context - be exhaustive): `src/mocks/afiliados/index.ts:9-18,122-149,159-1191`, `Specdrivenafiliados.md:18-33,75-125`, `CLAUDE.md:21-22`, `.claude/rules/agenda-fidelity.md:8-9`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/modules/afiliados` passes; `rg -n "fetch\\(|axios|http" src/modules/afiliados src/mocks/afiliados` returns no maintained-code matches.
  QA scenarios (name the exact tool + invocation): happy: bash `npm run test -- --run src/modules/afiliados`; failure: mutation proof by changing one destination usage expectation and confirming the service test fails, then revert mutation. Evidence `.omo/evidence/afiliados-front-plan/task-5-service-tests.txt`.
  Commit: Y | `refactor(afiliados): add mock service boundary`.

- [x] 6. Extract shared affiliate UI primitives from repeated inline patterns
  What to do / Must NOT do: Create small maintained components under `src/modules/afiliados/components/**` for repeated patterns: section heading, KPI/stat card wrapper, affiliate status badge, commission/order status badge, copy button/feedback, organization filter select, empty state, and affiliate link row/card. Use `Button`, `Card`, `Badge`, `Select`, `DataList`, `CardStats`, `cn`, and HugeIcons. Do not edit `src/components/ui/**` or rewrite full screen files.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`.
  Delegation rule: delegate to one worker with write set limited to new components plus a small test/showcase file.
  Context packet: repeated component line refs from current affiliate pages and design docs from Todos 2/3.
  Escalation rule: escalate only if primitive APIs force simultaneous screen rewrites.
  Parallelism rule: can run with Todo 5; screen adoption happens in Todos 7-12.
  Evidence budget: component tests and grep checks in `.omo/evidence/afiliados-front-plan/task-6-primitives.txt`.
  Parallelization: Wave 2 | Blocked by: 2, 3, 4 | Blocks: 7-12, 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/AfiliadosPage.tsx:110-128,247-260,866-969`, `src/modules/afiliados/ProdutosLinksPage.tsx:36-56,62-157`, `src/modules/afiliados/GanhosPage.tsx:103-162`, `src/components/custom/data-list.tsx:1-78`, `src/components/custom/cards/stats.tsx:1-83`, `src/components/ui/button.tsx:7-103`, `src/components/ui/card.tsx:5-89`, `DESIGN.md`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/modules/afiliados` passes; `rg -n "from \"@/modules/afiliados/components" src/modules/afiliados` shows adoption points after screen todos.
  QA scenarios (name the exact tool + invocation): happy: bash `npm run test -- --run src/modules/afiliados`; failure: bash `rg -n "lucide-react|from \"@/components/ui/.+buttonVariants" src/modules/afiliados/components` returns no matches. Evidence `.omo/evidence/afiliados-front-plan/task-6-primitives.txt`.
  Commit: Y | `refactor(afiliados): add shared UI primitives`.

- [x] 7. Refine affiliate dashboard at #afiliados
  What to do / Must NOT do: Refine `AfiliadosPage.tsx` using service/helpers and shared primitives. Preserve KPI filters, affiliate code copy, referrals preview, cart item drawer/sheet, empty state, and links to `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`. Replace ad hoc repeated UI with primitives where safe. Keep visible copy aligned with `Specdrivenafiliados.md`: use "afiliação", not "contrato" or "vínculo" in UI. Do not touch other screen files except shared imports.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`.
  Delegation rule: one worker owns `AfiliadosPage.tsx` only plus its tests.
  Context packet: dashboard lines, service APIs, primitives, route links, spec invariants.
  Escalation rule: escalate if dashboard refactor breaks route smoke or drawer behavior.
  Parallelism rule: can run with Todos 8, 9, 10, 12 if no shared files; not with another worker touching `AfiliadosPage.tsx`.
  Evidence budget: tests and browser screenshot for `#afiliados` in `.omo/evidence/afiliados-front-plan/task-7-dashboard.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/AfiliadosPage.tsx:40-51,392-418,656-845,866-1111`, `src/mocks/afiliados/index.ts:141-149,159-748,819-833`, `Specdrivenafiliados.md:18-33`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:182-193`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`; browser `http://127.0.0.1:<port>/#afiliados` renders dashboard, copies code, opens referral detail, and has navigable links.
  QA scenarios (name the exact tool + invocation): happy: Playwright/Browser open `http://127.0.0.1:<port>/#afiliados`, click copy code, click first referral, click close; expected copied feedback and nonblank detail panel. failure: browser set org/period filters to values with no rows if available; expected empty state not layout break. Evidence `.omo/evidence/afiliados-front-plan/task-7-dashboard-browser.md` and screenshots.
  Commit: Y | `feat(afiliados): refine affiliate dashboard`.

- [x] 8. Refine indications screen at #indicacoes
  What to do / Must NOT do: Refine `IndicacoesPage.tsx` with service filters, shared status badges, organization/period/search controls, tabs/counts, cart item drawer, affiliate link copy, and back navigation to `#afiliados`. Preserve order statuses and commission status semantics. Do not edit Ganhos/Produtos/Config files in this todo.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`.
  Delegation rule: one worker owns `IndicacoesPage.tsx` plus tests.
  Context packet: current file ranges, mock referral helpers, primitives, route contract.
  Escalation rule: escalate if changes require altering shared service API after other workers started.
  Parallelism rule: can run with Todos 7, 9, 10, 12; not with another worker touching `IndicacoesPage.tsx`.
  Evidence budget: tests and browser log in `.omo/evidence/afiliados-front-plan/task-8-indicacoes.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/IndicacoesPage.tsx:43-56,141-344,344-386`, `src/mocks/afiliados/index.ts:159-468,743-843`, `src/components/custom/data-list.tsx:1-78`, `Specdrivenafiliados.md:23-26`.
  Acceptance criteria (agent-executable): route smoke includes `#indicacoes`; tests cover search/filter tab counts and detail drawer; no `fetch`.
  QA scenarios (name the exact tool + invocation): happy: Browser open `http://127.0.0.1:<port>/#indicacoes`, search a known customer, switch to "pagas", open first detail drawer, copy affiliate link if exposed; expected filtered rows and detail content. failure: search `zzzz-sem-resultado`; expected empty state and no crash. Evidence `.omo/evidence/afiliados-front-plan/task-8-indicacoes-browser.md`.
  Commit: Y | `feat(afiliados): refine indications screen`.

- [x] 9. Refine earnings screen at #ganhos
  What to do / Must NOT do: Refine `GanhosPage.tsx` with service helpers, shared KPI/status components, organization filter, commission ledger, org breakdown, detail drawer, and link back to related indication. Preserve commission status semantics: `nao-gerada`, `a-receber`, `quitada`. Do not change receiving destination behavior; Todo 11 owns that.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`.
  Delegation rule: one worker owns `GanhosPage.tsx` plus tests.
  Context packet: current file ranges, commission mock ranges, primitives, route contract.
  Escalation rule: escalate if commission calculations diverge from fixtures or require product decision.
  Parallelism rule: can run with Todos 7, 8, 10, 12; not with another worker touching `GanhosPage.tsx`.
  Evidence budget: tests and browser log in `.omo/evidence/afiliados-front-plan/task-9-ganhos.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/GanhosPage.tsx:34-42,103-162,176-300,362-384`, `src/mocks/afiliados/index.ts:849-967`, `Specdrivenafiliados.md:23-26`.
  Acceptance criteria (agent-executable): tests cover period/org filtering and ledger statuses; browser route `#ganhos` opens detail and link to `#indicacoes`.
  QA scenarios (name the exact tool + invocation): happy: Browser open `http://127.0.0.1:<port>/#ganhos`, change organization filter, open commission detail, click related indication link; expected hash becomes `#indicacoes` or detail remains coherent per designed flow. failure: search an absent product/customer; expected empty state and no layout overflow. Evidence `.omo/evidence/afiliados-front-plan/task-9-ganhos-browser.md`.
  Commit: Y | `feat(afiliados): refine earnings screen`.

- [x] 10. Refine products and links screen at #produtosLinks
  What to do / Must NOT do: Refine `ProdutosLinksPage.tsx` around the three-level link hierarchy: general affiliate link, organization link, product link. Add/confirm internal "ver links por organização" behavior, product request flow with local mock state, disabled unavailable product behavior, copy feedback, and scope messaging for "todos" vs "especificos". Do not implement admin approval UI or backend request submission.
  Complexity/risk: standard / medium.
  Worker tier: `lazycodex-worker-medium`.
  Delegation rule: one worker owns `ProdutosLinksPage.tsx` plus tests.
  Context packet: product/link mock ranges, spec P4/P6, current screen ranges, shared components.
  Escalation rule: escalate if product request behavior conflicts with a spec item marked A VALIDAR.
  Parallelism rule: can run with Todos 7, 8, 9, 12; not with another worker touching `ProdutosLinksPage.tsx`.
  Evidence budget: tests and browser log in `.omo/evidence/afiliados-front-plan/task-10-produtos-links.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/ProdutosLinksPage.tsx:24-30,36-56,62-205,212-338`, `src/mocks/afiliados/index.ts:144-153,1051-1104`, `Specdrivenafiliados.md:20,23,45-47`.
  Acceptance criteria (agent-executable): tests cover all/org/product links, product request local state, unavailable product disabled state; browser can copy general/org/product links.
  QA scenarios (name the exact tool + invocation): happy: Browser open `http://127.0.0.1:<port>/#produtosLinks`, copy general link, filter one org, copy org/product link, request one available product; expected "Copiado" and "Solicitação enviada". failure: click disabled/unavailable product copy; expected no copied state and accessible disabled control. Evidence `.omo/evidence/afiliados-front-plan/task-10-produtos-links-browser.md`.
  Commit: Y | `feat(afiliados): refine product links`.

- [x] 11. Refine settings, receiving destinations, and affiliations at #configuracoes
  What to do / Must NOT do: Refine `ConfiguracoesPage.tsx`, especially Formas de recebimento and Minhas afiliações. Implement action "Alterar destino" for organizations with non-cash receiving methods: open selection among existing destinations, keep receiving type read-only, allow choosing a destination, update current destination in local state, update "Em uso por N" counts, block destination removal when in use unless a local reassign flow already exists in the screen. For money/cash organization, show "não se aplica" and no "Alterar destino". Preserve profile, notifications, security sections unless touched for consistency. Do not implement bank integration or let affiliate alter receiving type.
  Complexity/risk: complex / high because file is large and behavior is central to the spec exemplar.
  Worker tier: `lazycodex-worker-high` or strong main-orchestrator slice; cheaper worker only for isolated tests after API is clear.
  Delegation rule: serialize this todo or use a dedicated temporary worktree; no other worker may edit `ConfiguracoesPage.tsx` or receiving service functions concurrently.
  Context packet: `Specdrivenafiliados.md:75-125`, receiving mock ranges, current Configuracoes ranges, design/rules docs.
  Escalation rule: unresolved A VALIDAR items become explicit accepted debt in UI/design docs; do not decide irreversible product behavior silently.
  Parallelism rule: can only parallelize with Todo 12 if write sets are disjoint; otherwise run alone.
  Evidence budget: tests and browser log in `.omo/evidence/afiliados-front-plan/task-11-configuracoes.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/ConfiguracoesPage.tsx:52-61,140-565,565-756,756-956,956-998`, `src/mocks/afiliados/index.ts:968-1048,1106-1142`, `Specdrivenafiliados.md:75-125`.
  Acceptance criteria (agent-executable): tests cover destination selection, cash no-op, usage counts, type read-only, affiliations statuses; browser can complete "Alterar destino" and sees counts update.
  QA scenarios (name the exact tool + invocation): happy: Browser open `http://127.0.0.1:<port>/#configuracoes`, open Formas de recebimento, click "Alterar destino" for Cerrado/Vertaco, choose another destination, confirm; expected destination changes and usage counts update. failure: inspect Trilheiras/dinheiro row; expected destination not applicable and no "Alterar destino" trigger. Evidence `.omo/evidence/afiliados-front-plan/task-11-configuracoes-browser.md`.
  Commit: Y | `feat(afiliados): implement receiving destination changes`.

- [x] 12. Refine help and support at #ajuda
  What to do / Must NOT do: Refine `AjudaPage.tsx` using existing FAQ mock data, shared primitives where useful, search empty state, category cards, accessible close/back navigation, and support CTA as mock-only UI. Do not add real support integrations, mailto, chat SDK, or backend.
  Complexity/risk: simple / low.
  Worker tier: `lazycodex-worker-low`.
  Delegation rule: delegate as a cheap isolated screen task if parallel capacity exists.
  Context packet: Ajuda file, FAQ mock ranges, design docs.
  Escalation rule: none unless support CTA requires product decision; keep it inert/mock-local.
  Parallelism rule: can run with Todos 7-10 and maybe 11 if no shared files.
  Evidence budget: tests/browser log in `.omo/evidence/afiliados-front-plan/task-12-ajuda.*`.
  Parallelization: Wave 3 | Blocked by: 5, 6 | Blocks: 13, 14.
  References (executor has NO interview context - be exhaustive): `src/modules/afiliados/AjudaPage.tsx:21,63-216`, `src/mocks/afiliados/index.ts:1144-1191`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:242-244`.
  Acceptance criteria (agent-executable): tests cover FAQ search hit and no-result state; browser route `#ajuda` returns to `#afiliados` with Fechar.
  QA scenarios (name the exact tool + invocation): happy: Browser open `http://127.0.0.1:<port>/#ajuda`, search "comissões", expand FAQ, click Fechar; expected relevant result and hash `#afiliados`. failure: search `semresultadozz`; expected "Nenhum resultado encontrado" and no crash. Evidence `.omo/evidence/afiliados-front-plan/task-12-ajuda-browser.md`.
  Commit: Y | `feat(afiliados): refine help screen`.

- [x] 13. Integrate affiliate navigation, links, preview routes, and accessibility polish
  What to do / Must NOT do: Reconcile all screen slices. Ensure sidebar/topbar/profile/search navigation reaches affiliate screens correctly; decide based on existing default to keep `#configuracoes` and `#ajuda` as direct full-screen routes unless implementation evidence shows shell consistency requires change. Ensure preview hashes `#preview/afiliados`, `#preview/indicacoes`, `#preview/ganhos`, `#preview/produtosLinks`, `#preview/configuracoes`, `#preview/ajuda` still render. Fix focus states, labels, button text overflow, keyboard traversal, and Portuguese diacritics. Do not add non-affiliate features.
  Complexity/risk: complex / high because it integrates outputs from parallel workers.
  Worker tier: main orchestrator or `lazycodex-worker-high`; no cheap worker for final integration.
  Delegation rule: orchestrator integrates; delegate only read-only QA or small isolated fixes.
  Context packet: changed file list from Todos 7-12, navigation files, route tests.
  Escalation rule: if worker changes conflict, stop and merge manually; never choose one worker's branch by overwriting another.
  Parallelism rule: run after all screen todos; no parallel writes during final integration.
  Evidence budget: integration test/log in `.omo/evidence/afiliados-front-plan/task-13-integration.txt`.
  Parallelization: Wave 4 | Blocked by: 7-12 | Blocks: 14.
  References (executor has NO interview context - be exhaustive): `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22,26-59,78-113`, `src/modules/agenda/components/AgendaPrototypeApp.tsx:154-165,182-244`, `src/mocks/shell.ts:27-38,50-64`, `src/components/layout/topbar/topbar-profile.tsx:74-107`, `src/components/layout/topbar/topbar-organization.tsx:44-116`, `src/components/layout/topbar/search-pages.ts:69-73`.
  Acceptance criteria (agent-executable): `npm run test -- --run src/app/App.test.tsx src/modules/afiliados` passes; all affiliate preview hashes render nonblank in browser QA; `rg -n "contrato|vínculo|mock" src/modules/afiliados --glob '*.tsx'` returns no visible-copy violations except technical identifiers approved by reviewer.
  QA scenarios (name the exact tool + invocation): happy: Browser from `#afiliados`, use sidebar to `#indicacoes`, `#ganhos`, `#produtosLinks`, profile menu to `#configuracoes` and `#ajuda`, then back/close to dashboard; expected correct hashes and nonblank screens. failure: Browser open `#preview/configuracoes` and `#doesNotExist`; expected preview nonblank and unknown hash normalizes to `#agenda`. Evidence `.omo/evidence/afiliados-front-plan/task-13-integration-browser.md`.
  Commit: Y | `fix(afiliados): integrate affiliate navigation`.

- [x] 14. Run final command gate, browser QA, cleanup, and link handoff
  What to do / Must NOT do: Run full verification after all implementation tasks. Start Vite, capture actual port, run browser QA for desktop/mobile across all six affiliate URLs and core interactions, run command gates, record cleanup. Produce a concise handoff file under `.omo/evidence/afiliados-front-plan/final-handoff.md` with direct screen links using the actual port and evidence paths. Do not leave dev server, browser context, temp worktree, or bound port running.
  Complexity/risk: standard / high verification importance.
  Worker tier: `lazycodex-qa-executor` or main orchestrator; capable reviewer only for final audit, not for deterministic command execution.
  Delegation rule: QA executor may run browser scenarios while main orchestrator prepares final status, but final pass/fail is owned by main.
  Context packet: exact URLs, interaction checklist, commands, expected evidence paths.
  Escalation rule: any failed command or browser scenario returns to the owning todo; do not paper over with notes unless pre-existing and unrelated.
  Parallelism rule: after Todo 13 only; final verification can use read-only reviewers in parallel after QA artifacts exist.
  Evidence budget: store command logs, screenshots, action logs, cleanup receipt, and handoff links under `.omo/evidence/afiliados-front-plan/final-*`.
  Parallelization: Wave 5 | Blocked by: 13 | Blocks: final verification wave.
  References (executor has NO interview context - be exhaustive): `package.json:5-17`, `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts:8-22`, all changed files from Todos 2-13, `DESIGN.md`, `AGENTS.md`, `.claude/rules/afiliados.md`.
  Acceptance criteria (agent-executable): `npm run check` exits 0; final handoff lists `http://127.0.0.1:<port>/#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda`; cleanup receipt proves no QA server remains.
  QA scenarios (name the exact tool + invocation): happy: Browser open each affiliate hash at 1280x800 and 390x844 and execute the interaction checklist; expected nonblank, no console errors relevant to affiliates, no incoherent overlap. failure: bash `lsof -i :<port>` after cleanup returns no listener; if listener remains, kill QA PID and recheck. Evidence `.omo/evidence/afiliados-front-plan/final-browser.md`, `final-check.txt`, `final-cleanup.txt`, `final-handoff.md`.
  Commit: Y | `chore(afiliados): verify affiliate prototype`.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit
  Scope: Verify every todo in this plan is completed, every evidence file exists, all Must have/NOT have items are satisfied, and every final screen link works. Agent: `lazycodex-gate-reviewer` or equivalent high-capability reviewer. Evidence `.omo/evidence/afiliados-front-plan/f1-plan-compliance.md`.
- [x] F2. Code quality review
  Scope: Review changed files for type safety, oversized new modules, accidental backend coupling, broad generated UI edits, visible "mock" copy, icon violations, and unhandled worker conflicts. Agent: `lazycodex-code-reviewer` or high-capability reviewer. Evidence `.omo/evidence/afiliados-front-plan/f2-code-quality.md`.
- [x] F3. Real manual QA
  Scope: Independently replay the final browser QA using the handoff links and interaction checklist, including mobile and desktop. Agent: `lazycodex-qa-executor` or browser-capable QA worker. Evidence `.omo/evidence/afiliados-front-plan/f3-real-qa.md`.
- [x] F4. Scope fidelity
  Scope: Compare final implementation against `CLAUDE.md`, `.claude/rules/agenda-fidelity.md`, `Specdrivenafiliados.md`, `DESIGN.md`, `AGENTS.md`, and `.claude/rules/afiliados.md`; confirm blocked specs stayed out and executable specs landed. Agent: `metis`/`momus` style high-capability reviewer. Evidence `.omo/evidence/afiliados-front-plan/f4-scope-fidelity.md`.

## Commit strategy
- Commit after each logical wave or task when checks for that task are green.
- Use Conventional Commits:
  - `docs(design): codify prototype visual system`
  - `docs(codex): add affiliate execution guardrails`
  - `test(routes): cover affiliate hash screens`
  - `refactor(afiliados): add mock service boundary`
  - `refactor(afiliados): add shared UI primitives`
  - `feat(afiliados): refine affiliate dashboard`
  - `feat(afiliados): refine indications screen`
  - `feat(afiliados): refine earnings screen`
  - `feat(afiliados): refine product links`
  - `feat(afiliados): implement receiving destination changes`
  - `feat(afiliados): refine help screen`
  - `fix(afiliados): integrate affiliate navigation`
  - `chore(afiliados): verify affiliate prototype`
- Every commit that follows this plan should include footer `Plan: .omo/plans/afiliados-front-plan.md`.
- Do not auto-commit if user has not authorized commits in the execution run; stage and provide draft messages instead.
- Never include temporary worktree directories, QA screenshots outside `.omo/evidence/**`, or unrelated user changes.

## Success criteria
- `DESIGN.md`, `AGENTS.md`, and `.claude/rules/afiliados.md` exist and contain the project-specific constraints named in this plan.
- All six affiliate routes are covered by tests and render directly by hash.
- `src/modules/afiliados` has maintained service/component boundaries and no new backend coupling.
- The executable affiliate specs from `Specdrivenafiliados.md` are implemented or explicitly recorded as accepted debt only where the spec itself says A VALIDAR.
- Blocked specs from `Specdrivenafiliados.md` remain unimplemented and documented as out of scope.
- `npm run check` passes.
- Browser QA evidence exists for desktop and mobile:
  - `http://127.0.0.1:<port>/#afiliados`
  - `http://127.0.0.1:<port>/#indicacoes`
  - `http://127.0.0.1:<port>/#ganhos`
  - `http://127.0.0.1:<port>/#produtosLinks`
  - `http://127.0.0.1:<port>/#configuracoes`
  - `http://127.0.0.1:<port>/#ajuda`
- Final handoff links to every screen and names the evidence files.
- All temporary worktrees, dev servers, browser contexts, bound ports, and temp files created by execution are cleaned up with receipts.
