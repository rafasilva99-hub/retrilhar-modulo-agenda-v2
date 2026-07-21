---
tipo: prd-index
status: ativo
owner: bibliotecario
atualizado: 2026-07-21
---

# PRD e escopo consolidado

Esta area consolida o material de PRD sem substituir as fontes originais. Use este indice para orientar planejamento, priorizacao e implementacao.

## Fontes de partida

- [[00-fontes/catalogo-sources|Catalogo das fontes]]
- [Retrilhar - Escopo, Proposta e Planejamento](../Sources/Retrilhar%20-%20Escopo,%20Proposta%20e%20Planejamento.docx.html)
- [RFP 001 Produto](../Sources/RFP%20001%20Produto.docx.html)
- [RPP002 Painel de Operacoes](../Sources/RPP002%20PAINEL%20DE%20OPERA%C3%87%C3%95ES.docx.html)
- [RPP002 Painel Operacional](../Sources/RPP002%20PAINEL%20OPERACIONAL.docx.html)
- [Modulo Central de Vendas](../Sources/Mo%CC%81dulo_%20Central%20de%20Vendas.docx.html)

## Mapa por modulo

| Modulo | Nota curada | Fonte inicial |
| --- | --- | --- |
| Agenda / Operacao | [[20-modulos/agenda]] | Bloco 1, RPP002, reunioes, testes de usabilidade. |
| Vendas / Central Comercial | [[20-modulos/vendas]] | Bloco 2, Modulo Central de Vendas. |
| Vendedores e Afiliados | [[20-modulos/afiliados-vendedores]] | Bloco 3, Modulo Central de Vendas, reuniao 25/03. |
| Catalogo de Produtos | [[20-modulos/produtos]] | Bloco 4, RFP Produto. |
| Autenticacao e Inicio | pendente | Bloco 5. |
| CRM, Recursos e Equipe | pendente | Bloco 6. |
| Configuracoes e Administrativo | pendente | Bloco 7. |
| Modulos frios | pendente | Bloco 8. |

## Criterios de consolidacao

- Requisito entra em nota de modulo quando existir fonte local.
- Decisao firme entra em `40-decisoes/` quando tiver direcao clara e impacto.
- Item sem fonte suficiente entra em `_inbox/`.
- Mudanca de front validada deve atualizar a nota do modulo com "implementado/validado".

## Proxima rodada de curadoria

1. Extrair matriz de tarefas do Bloco 1 Agenda.
2. Extrair matriz de tarefas do Bloco 3 Afiliados/Vendedores.
3. Cruzar achados de usabilidade com Agenda.
4. Relacionar telas implementadas no codigo com requisitos documentados.
