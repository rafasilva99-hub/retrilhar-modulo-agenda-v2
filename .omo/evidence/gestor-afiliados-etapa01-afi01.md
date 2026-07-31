# Evidência · Etapa 01 · Fundação + Home de Afiliados (AFI-01)

Data: 2026-07-31
Escopo: refatoração da UI do módulo Gestão de Afiliados (Admin), começando pela home,
conforme o documento `Etapa 01 · Fundação + Home de Afiliados (AFI-01)` adaptado ao
protótipo Vite + hash routing (regras de `.claude/rules/agenda-fidelity.md`).

## Cenário exato

O protótipo já tinha o módulo `src/modules/gestor-afiliados` com fluxos (lista, propostas,
solicitações, pagamentos, termo). A home (`#gestorAfiliados`, seção `visao`) foi refeita
segundo o frame AFI-01 do Figma, com fundação reutilizável para as etapas AFI-02/AFI-03.

## Adaptações declaradas (spec Next.js -> protótipo Vite)

- Rotas: `/afiliados/visao-geral` -> hash `#gestorAfiliados`; `/dev/blocos` -> `#devBlocos`.
- Estrutura: `src/components/blocos/`, `src/mocks/gestor-afiliados/`, `src/types/api/afiliados.ts`,
  `src/modules/gestor-afiliados/services/afiliados-service.ts` (padrão de módulos do protótipo).
- Ícones via `@hugeicons/react` (padrão do repositório) em vez de sprite SVG.
- Tokens: coleção de variáveis do Figma contém apenas a escala Brand (pendência P2);
  extrato cru em `design/tokens.json`; UI usa os tokens semânticos do tema shadcn do
  projeto, conforme CLAUDE.md ("preferir tokens do projeto").
- Shell: sidebar ganhou suporte a submenu (Afiliados > Visão geral / Lista de afiliados /
  Comissões) com estado ativo-pai; "Comissões" aponta para a fila de pagamentos existente.
  O seletor de organização não foi alterado (pendência P3, shell não congelado).
- ItemAfiliado: rótulo da 2ª métrica é "Maior venda" seguindo o contrato (`maiorVenda`),
  divergindo do placeholder do frame ("Valor vendido (Total)"); comentário no código.
- `text-[11px]` usado em 3 pontos, idioma já presente no repositório (ex.: shared.tsx).

## Invocações e status

- `npx vitest run` -> exit 0, `Test Files 20 passed (20) · Tests 80 passed (80)`.
- `npm run lint` -> exit 0 (após `lint:fix` para ordenação de imports).
- `npm run typecheck` -> exit 0.
- `npm run build` -> exit 0 (aviso pré-existente de chunk > 500 kB).
- `npm run format:check` -> falha apenas em arquivos pré-existentes do vault
  `Retrilhar Intel/**` (não formatados por serem notas do usuário); todos os arquivos
  de código desta etapa formatados com Prettier.
- Greps do checklist: sem travessão/meia-risca no código novo; a palavra "mock" não
  aparece em copy visível; sem hex hardcodado no código novo.

## Observáveis binários

- `#gestorAfiliados` renderiza a home AFI-01: 3 KpiCard, painel Pendências com
  FiltroSegmentado (Todas 7 / Solicitações 4 / Propostas 3), Top afiliados com ranking e
  CodigoCopiavel, tabela Últimas vendas (8 linhas) com ação de detalhe.
- CTA "Convidar afiliado" desabilitada com tooltip "Disponível em breve" (AFI-01.b
  bloqueado, §8; pendências P4/P6).
- Estados z1/z2/z3 alternáveis pela barra "Cenários de demonstração" (teste automatizado
  cobre os três + retorno ao padrão).
- Drawer AFI-01.a abre pela tabela, fecha por ESC/clique fora/"Fechar aba" (Radix Sheet)
  e devolve o foco ao gatilho; histórico renderizado como veio do mock (P5, zero lógica).
- `#devBlocos` exibe os 7 blocos + TimelineAtividade em todos os estados.
- Toaster (sonner) montado uma única vez em `src/app/App.tsx`; cópia de código dispara toast.

## Testes automatizados novos

`src/modules/gestor-afiliados/GestorAfiliadosPage.test.tsx`: home com KPIs e CTA
desabilitada; filtro de pendências (propostas x solicitações); cenários z1/z2/z3;
abertura/fechamento do drawer de venda. `src/app/App.test.tsx` atualizado para o novo
conteúdo da home. Correção de teste pré-existente dependente de data em
`src/modules/agenda/services/agenda-mock-service.test.ts` (falhava em dia 31).

## Pendências que permanecem

- P1/HP16 (tipo de candidatura), P3 (seletor de organização), P4 (comissão percentual x
  fixa), P5 (parâmetros de liberação), P6 (convite pela organização), P7/P8 (backend).
- Comparação visual final via Chrome DevTools MCP não executada nesta sessão: a extensão
  do navegador não estava conectada. Referências do Figma (nodes 16208:150364 e
  16208:150935) capturadas via figma-console MCP e usadas como base da implementação.
  Dev server ativo em http://localhost:5174/#gestorAfiliados para conferência manual.
