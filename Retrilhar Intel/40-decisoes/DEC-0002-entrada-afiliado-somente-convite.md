---
tipo: decisao
id: DEC-0002
status: aprovada
owner: Cristiano
data: 2026-07-22
modulo: afiliados-vendedores
fontes:
  - Confirmação de Cristiano em 2026-07-22
  - ../_inbox/drift-cadastro-afiliado-pelo-gestor.md
  - ../20-modulos/afiliados-vendedores.md
  - ../Sources/Bloco_3_Vendedores_Afiliados.md.html
---

# DEC-0002 - Entrada de afiliado por convite; cadastro preenchido pelo próprio afiliado

## Decisao

Na V1, a entrada de afiliado acontece **apenas pelo fluxo de convite**. O gestor **não** cadastra o afiliado preenchendo os dados dele. O convite é enviado por e-mail e:

1. O **próprio afiliado** preenche os seus dados ao acessar o link do convite (nome, CPF/CNPJ/passaporte, telefone, e-mail e demais dados de perfil).
2. A **habilitação de produtos não entra no ato do convite**. O objetivo é que o afiliado **se candidate aos produtos depois de concluir o cadastro, já dentro do painel do afiliado**.

O modal "Novo Afiliado" com cadastro completo pelo gestor (nome, documento, telefone, e-mail, código, produtos e comissão) fica **fora de escopo na V1**.

## Fontes

- **DECISÃO** confirmada por Cristiano em 2026-07-22.
- Consolida o modelo já indicado na conversa de 08/07 (_"o afiliado se candidatando à agência, e não a agência convidando o afiliado"_; _"a pessoa vira usuária do sistema antes de virar afiliada"_).
- Substitui o modelo de 25/03 do Bloco 3 (_"a empresa cadastra o afiliado e fala quais produtos... ele pode representar"_), que o próprio Bloco 3 já tratava como caminho a evoluir para autocandidatura.

## Motivo

Alinhar a V1 ao fluxo de autocandidatura: o gestor apenas convida; o afiliado assume o preenchimento do próprio perfil e escolhe os produtos que quer representar de dentro do painel, em vez de o gestor pré-definir tudo no cadastro.

## Impacto

- **Gestão de afiliados**: manter somente o envio de convite por e-mail. Remover/rebaixar o modal "Novo Afiliado" que preenchia dados do afiliado e habilitava produtos no ato do cadastro.
- **Cadastro via convite**: os dados de perfil passam a ser responsabilidade do afiliado no onboarding pelo link.
- **Painel do afiliado**: a habilitação/candidatura a produtos ocorre pós-cadastro, dentro do painel (reforça a User Story de _"solicitar filiação para um produto"_ e a área "Produtos e Links" já entregue).
- **Copy e edge cases**: revisar mensagens do fluxo de convite (e-mail inválido, convite pendente, já cadastrado em outra empresa) e descontinuar edge cases exclusivos do cadastro direto pelo gestor.

## Pendencias

- **PENDENTE (HP16, dono: Cristiano)**: a candidatura pós-cadastro é à agência inteira ou a produtos específicos? Segue aberta e agora é o ponto central do fluxo de habilitação.
- **PENDENTE**: definir se a comissão é proposta no convite, no aceite da candidatura de produto ou definida pelo gestor por produto após a candidatura.
- **ATENÇÃO**: verificar no worktree de front se o modal "Novo Afiliado" já implementado precisa ser removido ou reaproveitado como tela de onboarding do afiliado.
