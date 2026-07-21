---
tipo: modulo
modulo: produtos
status: curadoria-inicial
owner: bibliotecario
atualizado: 2026-07-21
fontes:
  - ../Sources/Bloco_4_Catalogo_Produtos.md.html
  - ../Sources/RFP%20001%20Produto.docx.html
---

# Modulo Catalogo de Produtos

## Fontes principais

- [Bloco 4 - Catalogo de Produtos](../Sources/Bloco_4_Catalogo_Produtos.md.html)
- [RFP 001 Produto](../Sources/RFP%20001%20Produto.docx.html)

## Fatos confirmados

- **FATO**: O Bloco 4 cobre Lista de Produtos e Cadastro/Edicao de Produto.
- **FATO**: Produtos sao base para venda, agenda e comunicacao operacional.
- **ATENCAO**: Ha trabalho recente no checkout principal relacionado a comunicacao de produto que ainda precisa de gate antes de ser considerado consolidado.

## Pendencias abertas

- **PENDENTE**: Extrair requisitos completos do Bloco 4.
- **PENDENTE**: Mapear abas do editor de produto contra o codigo atual.
- **PENDENTE**: Validar regras de comunicacao pre-evento, voucher e pos-evento contra fonte canônica antes de consolidar.

## Relacao com codigo atual

- Modulo principal observado no checkout principal: `src/modules/produtos/ProdutosPage.tsx`
- **ATENCAO**: nao usar alteracoes locais de produto como verdade documentada ate passarem por QA e commit atomico.
