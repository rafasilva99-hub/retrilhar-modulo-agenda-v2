---
tipo: indice
status: ativo
owner: bibliotecario
atualizado: 2026-07-21
fontes:
  - Sources/
---

# INDEX - Retrilhar Intel

## Objetivo

Manter uma memoria de produto persistida, versionada e navegavel, alinhada com o codigo em evolucao no front-end. Este arquivo e o ponto de partida para agentes antes de alterar telas, fluxos, copy, estados, mocks ou planejamento.

## Como usar

1. Leia o modulo relacionado em `20-modulos/`.
2. Confira decisoes aplicaveis em `40-decisoes/`.
3. Consulte fontes cruas em `00-fontes/catalogo-sources.md` quando precisar provar um requisito.
4. Se a fonte nao responder, registre a duvida em `_inbox/`.
5. Ao finalizar uma entrega de front, atualize a nota do modulo e o planejamento se a implementacao mudou o entendimento do produto.

## Mapa

| Area | Nota | Uso |
| --- | --- | --- |
| Fontes cruas | [[00-fontes/catalogo-sources]] | Inventario dos exports do NotebookLM, PRDs, reunioes, usabilidade e imagens. |
| PRD | [[10-prd/README]] | Entrada consolidada de escopo e fontes canonicas. |
| Agenda | [[20-modulos/agenda]] | Agenda administrativa, atividades, reservas, mapa de vagas e atualizacoes. |
| Afiliados | [[20-modulos/afiliados-vendedores]] | Painel de afiliados, gestao de afiliados e vendedores. |
| Produtos | [[20-modulos/produtos]] | Catalogo, cadastro/edicao e comunicacao de produto. |
| Vendas | [[20-modulos/vendas]] | Central comercial, pedidos, PDV e detalhes. |
| Fluxo operacional | [[30-fluxos/fluxo-documentacao-maestri]] | Como Maestri, Bibliotecario, workers e Obsidian se conectam. |
| Decisoes | [[40-decisoes/DEC-0001-obsidian-como-memoria]] | Decisoes firmes com fonte e impacto. |
| Planejamento | [[50-planejamento/roadmap-documentacao-viva]] | Fases de consolidacao da intel. |
| Reunioes | [[60-reunioes/README]] | Indice das transcricoes e proximo fluxo de ingestao. |
| Cronologia | [[60-reunioes/cronologia-canonica]] | Linha do tempo reconciliada entre vault local e Claude Project. |
| Inbox | [[_inbox/README]] | Propostas e duvidas antes de virar verdade consolidada. |

## Convenção epistêmica

- **FATO**: afirmacao sustentada por fonte local, codigo ou evidencia visual.
- **DECISAO**: direcao aprovada ou adotada no projeto, com impacto conhecido.
- **INFERENCIA**: leitura provavel a partir das fontes; nao tratar como requisito ate validar.
- **PROPOSTA**: sugestao de melhoria ainda nao aprovada.
- **PENDENTE**: pergunta aberta que bloqueia decisao ou implementacao.
- **ATENCAO**: risco de conflito, drift entre doc/codigo ou lacuna de fonte.

## Status atual do acervo

- `Sources/` possui 85 exports HTML e 85 arquivos de metadata vindos do NotebookLM.
- Existem fontes de PRD/escopo, blocos de backlog, reunioes de alinhamento, testes de usabilidade, regras de UI e imagens de referencia.
- A primeira camada curada foi criada sem mover ou reescrever as fontes cruas.

## Proximo uso recomendado

O Bibliotecario deve fazer ingestao por lotes:

1. Agenda e operacao.
2. Afiliados/vendedores.
3. Produtos.
4. Vendas.
5. Layout, componentes e regras visuais.
6. Reunioes mais recentes, cruzando com pendencias abertas.
