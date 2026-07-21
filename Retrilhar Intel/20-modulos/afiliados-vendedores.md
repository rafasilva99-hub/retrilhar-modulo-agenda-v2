---
tipo: modulo
modulo: afiliados-vendedores
status: curadoria-inicial
owner: bibliotecario
atualizado: 2026-07-21
fontes:
  - ../Sources/Bloco_3_Vendedores_Afiliados.md.html
  - ../Sources/Mo%CC%81dulo_%20Central%20de%20Vendas.docx.html
---

# Modulo Afiliados e Vendedores

## Fontes principais

- [Bloco 3 - Vendedores e Afiliados](../Sources/Bloco_3_Vendedores_Afiliados.md.html)
- [Modulo Central de Vendas](../Sources/Mo%CC%81dulo_%20Central%20de%20Vendas.docx.html)
- [Alinhamento Retrilhar - 25/03](../Sources/Alinhamento%20Retrilhar%20-%2025_03.docx.html)

## Fatos confirmados

- **FATO**: Vendedores e Afiliados aparecem como modulos separados, mas compartilham logica de listagem, cadastro, performance e comissoes.
- **FATO**: O afiliado e descrito como pessoa fisica que faz contrato com empresas, mantendo o mesmo codigo e enviando para lojas diferentes.
- **FATO**: Essa definicao impacta visualizacoes por empresa/organizacao quando a mesma pessoa atua como afiliada de multiplas empresas.
- **FATO**: O Bloco 3 identifica tarefas de Vendedores: Lista e Novo, Detalhes.
- **FATO**: O Bloco 3 identifica tarefas de Afiliados: Lista e Novo, Detalhes.

## Diferenca operacional

| Perfil | Papel | Implicacao de UI |
| --- | --- | --- |
| Vendedor | Opera vendas internamente ou comercialmente para a empresa. | Gestao de performance, metas, comissoes e pedidos. |
| Afiliado | Pessoa fisica com codigo recorrente usado em diferentes lojas/empresas. | Painel precisa organizar indicacoes, links, ganhos e contexto por organizacao. |

## Relacao com codigo atual

- Worktree de frente: `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar-afiliados-front-worktree`
- Branch: `work/afiliados-front`
- Portal desktop: `Preview front - Afiliados`
- Portal mobile: `Preview front - Afiliados Mobile`
- **ATENCAO**: neste worktree limpo, `src/modules/gestor-afiliados/**` ainda nao existe. Ha indicios de trabalho relacionado no checkout principal, mas ele precisa ser promovido com gate antes de virar base.

## Pendencias abertas

- **PENDENTE**: Extrair detalhadamente as tarefas de Afiliados: Lista e Novo / Detalhes.
- **PENDENTE**: Mapear quais requisitos do painel de afiliado ja estao implementados em `src/modules/afiliados/**`.
- **PENDENTE**: Decidir como promover a gestao de afiliados do checkout principal para `work/afiliados-front`.
- **PENDENTE**: Consolidar nomenclatura de UI: usar `afiliação`; evitar introduzir `contrato` ou `vínculo` na interface sem decisao especifica.

## Fluxo recomendado para melhorias

1. Worker Afiliados le esta nota antes de alterar o painel.
2. Se a tarefa envolver gestao de afiliados ausente no worktree, o Maestro precisa criar um gate de promocao antes da implementacao.
3. Bibliotecario atualiza esta nota apos cada validacao desktop/mobile.
