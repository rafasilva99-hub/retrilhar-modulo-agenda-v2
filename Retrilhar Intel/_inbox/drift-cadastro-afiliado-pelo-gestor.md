---
tipo: inbox
status: resolvido
resolvido-em: 2026-07-22
resolvido-por: Cristiano
resolucao: ../40-decisoes/DEC-0002-entrada-afiliado-somente-convite.md
owner: bibliotecario
dono-decisao: Cristiano
modulo: afiliados-vendedores
prioridade: alta
atualizado: 2026-07-22
fontes:
  - ../Sources/Bloco_3_Vendedores_Afiliados.md.html
  - ../20-modulos/afiliados-vendedores.md
  - Conversa Claude "Avaliação de transcrição Retrilhar 08/07"
---

# Cadastro de afiliado pelo gestor coexiste com a autocandidatura na V1?

> [!success] Resolvido em 2026-07-22 por Cristiano — ver [[../40-decisoes/DEC-0002-entrada-afiliado-somente-convite|DEC-0002]]
> **Só o fluxo de convite na V1.** O gestor não cadastra o afiliado; o próprio afiliado preenche seus dados pelo link do convite. A habilitação de produtos não entra no convite — o afiliado se candidata aos produtos depois do cadastro, dentro do painel. O modal "Novo Afiliado" (cadastro completo pelo gestor) fica fora de escopo na V1.

## Pergunta

Na área de **gestão de afiliados**, além de enviar o convite por e-mail, o gestor **ainda poderá criar diretamente uma nova conta de afiliado** na V1? Ou o cadastro direto pelo gestor saiu de escopo em favor do modelo de autocandidatura definido em 08/07?

## Drift entre fontes (motivo da dúvida)

- **ATENÇÃO**: há contradição direta entre duas camadas da documentação.

| Fonte                                                           | Data  | O que diz                                                                                                                                                                                                                   |
| --------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bloco 3 (Escopo Central de Vendas + reunião, Cristiano)         | 25/03 | _"a empresa cadastra o afiliado e fala quais produtos e quais eventos ele pode representar e quanto ele vai ganhar de comissão."_ Modal "Novo Afiliado" desenhado e marcado como implementado (`[x] Tela "Novo Afiliado"`). |
| Bloco 3 (evolução futura, Cristiano)                            | 25/03 | _"afiliado se cadastra, gestor aprova, e então entra no fluxo padrão. Não é prioridade agora."_ — tratado como visão futura.                                                                                                |
| Nota curada `afiliados-vendedores` / conversa 08/07 (Cristiano) | 08/07 | _"na V1 o modelo de entrada é o afiliado se candidatando à agência, e não a agência convidando o afiliado"_; _"a pessoa vira usuária do sistema antes de virar afiliada."_                                                  |

- **INFERÊNCIA** (a validar): o 08/07 pode ter **promovido a V1** o modelo que o Bloco 3 chamava de "futuro", potencialmente **revogando ou tornando secundário** o cadastro direto pelo gestor. Não tratar como fato até Cristiano confirmar.

## Dados do cadastro direto (caso o caminho permaneça) — fonte: Bloco 3

Campos previstos no modal "Novo Afiliado":

- Nome
- CPF / CNPJ / passaporte (aceita estrangeiro)
- Telefone
- E-mail (também usado no convite)
- Código de indicação — gerado pelo sistema, porém alterável (edge case de colisão previsto)
- Produtos que pode vender (seleção no modal)
- Comissão — % ou R$, com modal "Definir comissão para todos" e trava de não-sobrescrita

## Impacto

- **Alto**: define se o front mantém, remove ou rebaixa o modal "Novo Afiliado" já implementado.
- Afeta copy, onboarding e o fluxo de convite na área de gestão.
- Cruza com a pendência **HP16** (candidatura é à agência inteira ou a produtos específicos?) já registrada em [[../20-modulos/afiliados-vendedores]].
- Relaciona-se com a lacuna de ingestão da conversa `Avaliação de transcrição Retrilhar 08/07`, ainda não sintetizada (ver [[reconciliacao-claude-vs-obsidian]]).

## Encaminhamento

- **PENDENTE (dono: Cristiano)**: confirmar coexistência (gestor cria conta **e** afiliado se candidata) ou substituição (só autocandidatura na V1).
- Não promover para `20-modulos/afiliados-vendedores.md` como fato até a resposta.
