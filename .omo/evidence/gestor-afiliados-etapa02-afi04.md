# Evidência · Etapa 02 · Central de filiação (AFI-04)

Data: 2026-07-31
Escopo executado: Fases 1 (blocos) e 2 (rota) do documento
`Etapa 02 · Central de filiação (AFI-04)`. A Fase 3 (ModalAvaliacaoProposta e
overlays AFI-04.a/.b/.c) permanece bloqueada pelas pendências P1 (regra de
comissão percentual vs fixa) e P2 (comportamento do botão primário), conforme
a regra dura do documento.

## Referências visuais

Capturas via figma-console MCP dos nodes `15998:133301` (rota) e
`16152:171669` (modal, origem dos blocos HeaderEntidade e ResumoNegociacao).

## Entregas

- Tipos (§5) acrescentados a `src/types/api/afiliados.ts`: EstadoNegociacao,
  OrigemEvento, EventoNegociacao, Solicitacao, MetodoRecebimento, EscopoMotivo,
  MotivoRecusa, com as pendências P3/P7 anotadas.
- Mocks (§16): `src/mocks/gestor-afiliados/solicitacoes.ts` cobre candidatura à
  organização rodada 1, solicitação de produto rodada 1, contraproposta rodada 3
  com histórico de 5 eventos (descrições prontas, não montadas no front), nomes
  longos, lista vazia e itens em três dias distintos. `motivos.ts` com escopos.
- Serviço: listarSolicitacoes (filtro + busca), contarSolicitacoes,
  pendenciaDaSolicitacao (adaptador para o ItemPendencia da Etapa 01) e
  listarMotivos(escopo).
- Blocos Fase 1 em `src/components/blocos/` e no `#devBlocos`:
  - `HeaderEntidade` (avatar, nome, descrição/handle, termos aceitos, data de
    filiação; estados completo e mínimo).
  - `ResumoNegociacao` (lista dirigida por dados; 4 e 5 linhas sem mudança de
    código, checklist atendido).
  - `DialogCapturaMotivo` (select nasce vazio com "Selecione um motivo",
    botão desabilitado até haver motivo, copy do §10 corrigida, tons
    destrutivo/neutro, motivos via props, sem fork por escopo).
  - `ModalAvaliacaoProposta` NÃO construído (P1/P2).
- Rota `#gestorAfiliadosCentral` (seção `central` do módulo): busca de largura
  total, FiltroSegmentado com contadores reais (P9 anotada), lista agrupada por
  dia ("Hoje", "Ontem, dd/mm/aaaa", data) com o MESMO ItemPendencia da AFI-01,
  estados z1 (sem pendências), z2 (busca sem resultado) e z3 (carregando) via
  barra de cenários. Clique no item leva às filas existentes com
  `TODO [P1][P2]` até o modal ser liberado.
- Navegação: submenu da sidebar e subnav ganham "Central de filiação";
  "Ver todas as pendências" e o clique de pendência da AFI-01 apontam para a
  central; entrada na busca global.

## Decisões e adaptações

- [PROPOSTA P10] adotado "Central de filiação" como nome único (sidebar,
  título, breadcrumb), no lugar de Pendências/Propostas.
- [PENDENTE P8] abas seguem o mapeamento por tipo da AFI-01 (Solicitações =
  produto, Propostas = organização) até decisão; comentado no serviço.
- CTA "Convidar afiliado" habilitada (o doc pedia desabilitada, mas o
  AFI-01.b foi liberado por decisão de produto em 31/07/2026 nesta sessão).
- Sidebar mantém "Relatórios" (P11 segue pendente).

## Invocações e status

- `npx vitest run` -> exit 0, `20 files / 85 tests passed` (5 novos: grupos por
  dia, filtro + busca + busca sem resultado, estados z1/z3, rota direta).
- `npm run typecheck` -> exit 0. `npm run lint` -> exit 0 (após lint:fix).
- `npm run build` -> exit 0 (aviso pré-existente de chunk).
- Prettier aplicado aos arquivos tocados.

## Pendências que permanecem

P1 a P12 do §12 do documento. P1/P2 seguem travando a Fase 3; quando fecharem,
criar `lib/afiliados/acaoPrimaria.ts` (§9) antes do ModalAvaliacaoProposta.
