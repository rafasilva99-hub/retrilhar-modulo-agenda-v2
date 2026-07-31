# [RETRILHAR] [AFILIADOS] Spec-driven do painel do afiliado

Fontes desta versão: PRD do Módulo de Afiliados (com resoluções P1 a P6 confirmadas pela Katiely), transcrição de 15/07 e os prints do que já foi construído em código. Nada aqui foi inventado. Onde uma afirmação não tem fonte, ela vai marcada como PROPOSTA, INFERÊNCIA ou A VALIDAR.

## 0. Legenda epistêmica

FATO (fonte citada), DECISÃO FIRME (cliente confirmou), INFERÊNCIA (raciocínio nosso), PROPOSTA (design a validar), PENDENTE (falta confirmar), ATENÇÃO (conflito ou risco).

---

## 1. Guardrail do módulo (vai em .claude/rules/afiliados.md)

Camada por módulo, abaixo da constituição do projeto. Serve dois papéis ao mesmo tempo: é a restrição do executor e é metade da rubrica do gate.

Invariantes que o executor obedece (todos DECISÃO FIRME salvo indicação):

1. Afiliado é entidade global: uma pessoa (física ou jurídica, pode ser estrangeiro) com código único, ligada a uma ou várias organizações por vínculos independentes. O código atravessa todas as organizações. FATO (Transcrição 25/03).
2. O painel do afiliado NÃO troca de empresa. É um painel próprio consolidado. O recorte por organização é um filtro dentro do painel, não uma troca de aplicação. FATO.
3. Terminologia na interface: o vínculo se chama "afiliação". Não usar "contrato" nem "vínculo" na UI. DECISÃO FIRME (P7).
4. Escopo de produtos por afiliação: "todos os produtos" ou "produtos específicos". O caso "nenhum produto" não existe. Se for "todos", produtos novos entram automaticamente (com alerta no cadastro do produto ou do afiliado). DECISÃO FIRME (P2, P3).
5. Sem produto habilitado não gera comissão. DECISÃO FIRME.
6. Comissão: em porcentagem ou valor fixo; aplicada em lote ou individual por produto; trava de não sobrescrever (checkbox preserva valores já definidos); alterações geram histórico. FATO (Transcrição 25/03).
7. Links do afiliado, três níveis: (1) link geral do afiliado (página com todos os produtos que ele pode vender de todas as organizações), (2) link geral por organização, (3) link por produto. DECISÃO FIRME (P4).
8. Status por afiliação: Ativo, Inativo, Desativado. Além disso existe o Desativado geral (banimento do afiliado na plataforma inteira). DECISÃO FIRME (P5).
9. Forma de recebimento é definida no acordo com cada organização. O afiliado NÃO altera o tipo de recebimento, só o destino (a conta que recebe). FATO (print Formas de recebimento).
10. O afiliado não negocia nem altera condições comerciais. Ele indica via link ou código e é remunerado por venda concluída. FATO (Escopo, Perfil do Afiliado).

Restrições técnicas herdadas da constituição (valem para todo o projeto):

11. Vite mais React, roteado por hash. Não introduzir Next.js, App Router, RSC nem fetch ou cliente HTTP em código mantido.
12. Mock-only: sem backend ou API real. Dados vêm de fixtures em `src/mocks` ou serviços mockados em `src/modules/**/services`.
13. Usar HugeIcons, shadcn/ui, tokens Tailwind semânticos e os componentes de layout do protótipo.
14. Design system: Helvetica Neue no produto, azul primário `#1E40AF`, fills semânticos (verde, vermelho, âmbar, azul, laranja), traços HugeIcons arredondados.
15. Copy: sem travessão nem meia-risca em lugar nenhum, diacríticos corretos, nenhum dado inventado.

---

## 2. Backlog de specs (com prontidão)

Cada linha é uma unidade construível. "Prontidão" diz se pode ir pro executor agora ou se está travada por pendência da seção 3.

| Spec                                               | Origem / estado                      | Prontidão            | Observação                                                                                                      |
| -------------------------------------------------- | ------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Alterar destino de repasse (Formas de recebimento) | Construído, refinar ação             | EXECUTAVEL           | Totalmente FATO. Spec exemplar na seção 4.                                                                      |
| Solicitar filiação de produtos (F5)                | A construir                          | EXECUTAVEL           | P6 resolvido: versão leve, afiliado solicita no painel, admin aprova. Toca o painel admin no lado da aprovação. |
| Interna de "ver links por organização"             | A construir                          | EXECUTAVEL           | Hierarquia de links resolvida (P4). Design é PROPOSTA.                                                          |
| Refinamento de Produtos e Links                    | Construído, refinar                  | EXECUTAVEL (parcial) | Escopo "todos / específicos" resolvido. Confirmar o "definido com o cliente" que motivou o refino.              |
| Refinamento de Minhas afiliações                   | Construído, refinar                  | EXECUTAVEL           | Status por afiliação resolvido (P5).                                                                            |
| Refinamento de Ajuda e suporte                     | Construído, refinar                  | EXECUTAVEL           | Baixo risco, conteudo estatico.                                                                                 |
| Home de primeiro acesso (estado vazio)             | Construído em outro projeto, refinar | BLOQUEADO            | Trava na direção do vínculo (P-A) e no split de projeto (P-C).                                                  |
| Sala de negócios V1 (landing e cadastro)           | Construído, validar                  | BLOQUEADO            | Congelada pelo Cristiano em 15/07 (P-B).                                                                        |

---

## 3. Pendências que bloqueiam execução

Antes de mandar as specs BLOQUEADAS pro executor, estas precisam sair de aberto. As três primeiras são para a sessão de validação com o Cristiano e a Katiely.

P-A · Direção do vínculo inicial. ATENÇÃO, alta prioridade.
Existe conflito entre fontes. O PRD (RESOLUÇÃO confirmada pela Katiely, seção 9) diz que a organização vê o pool de afiliados e envia o convite para o afiliado aceitar (organização convida). A Home de primeiro acesso já construída (print 11) implementa o afiliado se candidatando à agência (afiliado candidata). O Cristiano, na 15/07, disse que a proposta pode ser iniciada pela organização ou pelo afiliado (bidirecional). Trava: Home de primeiro acesso, sala de negócios, texto do CTA "Candidatar-se" versus "aguardar convite", e o toggle "Convite de vínculo" nas notificações.

P-B · Sala de negócios e landing page. ATENÇÃO.
Congelada pelo Cristiano na 15/07 ("vou congelar isso, deixa eu conversar com a Cátia, ela responde ainda hoje"). Decide se a landing page e o isolamento da sala de negócios como site ou subdomínio separado entram no escopo agora. Confirmar se a resposta da Cátia já chegou. FATO (Transcrição 15/07).

P-C · Split de projeto do primeiro acesso. ATENÇÃO.
O código do estado vazio está atribuído a outro projeto. Isso quebra o invariante de "um projeto só" da constituição e muda o escopo do executor, porque codebase diferente não paraleliza com o resto e exige um executor próprio. Decisão: consolidar no projeto principal ou manter separado. INFERÊNCIA sobre impacto, a partir do que a Luana informou.

P-D · Canal de divulgação. A VALIDAR, menor.
Na 15/07 ficou que o campo é referencial (o Instagram ou handle do afiliado), sem integração de backend, e o input fechado vira aberto. Falta confirmar se vira uma área nas configurações para listar vários canais, já que a Katiely notou que "principal canal" limita. FATO parcial (Transcrição 15/07).

---

## 4. Spec exemplar completa

# [RETRILHAR] [AFILIADOS] Alterar destino de repasse (Formas de recebimento)

## Objetivo

Permitir que o afiliado troque a conta (destino) que recebe a comissão de uma organização, escolhendo entre os destinos que ele já cadastrou. O afiliado não altera o tipo de recebimento, apenas para onde o valor vai.

## Estado

- Atual: a seção Formas de recebimento já existe em código, lista o tipo de recebimento por organização e os destinos cadastrados, com o botão "Alterar destino" por organização e "Adicionar destino". Print disponível.
- Alvo: implementar a ação de "Alterar destino" (hoje só o botão existe) e o comportamento de gestão dos destinos.
- Invariantes: o tipo de recebimento é definido no acordo com cada organização e não é editável pelo afiliado (print: "Para alterá-la, fale com a organização"). Para organização com recebimento em dinheiro, destino não se aplica.

## Contrato de dados (mock)

- Fonte: fixture em `src/mocks`, sem backend.
- Destino de recebimento (um afiliado tem N destinos): id, apelido (ex. "Conta principal", "Conta da empresa"), banco, tipo de conta, agência, conta, titular, flag padrão, contagem de organizações em uso. FATO (print: "Você pode cadastrar mais de uma", "Padrão", "Em uso por 2 organizações").
- Forma de recebimento por organização: organização, tipo (split de pagamento, transferência bancária, dinheiro), descrição do tipo, destino atual (referência a um destino, ou "não se aplica" quando dinheiro). FATO (print e Transcrição 15/07).
- Regra: o afiliado altera apenas o campo "destino atual" de uma organização, escolhendo entre seus destinos existentes. INFERÊNCIA de UX a partir do print, A VALIDAR se a ação também permite cadastrar um destino novo inline.

## Referência de design

- Print: Configurações > Formas de recebimento.
- Figma: (node a preencher).

## Critérios de aceite

### Determinístico (checável por máquina)

- [ ] Compila, lint e tipos passam.
- [ ] Todos os estados da ação renderizam: gatilho, seleção, confirmação, sucesso, erro de validação.
- [ ] Nenhum fetch ou cliente HTTP. Dados só do mock.

### Fidelidade (Figma mais render)

- [ ] Tokens do design system aplicados (azul primário, tipografia, fills semânticos, traços HugeIcons).
- [ ] Bate com o node do Figma dentro da tolerância definida na constituição.
- [ ] Estados de badge (Padrão, Em uso por N organizações) idênticos ao print.

### Comportamento (UX)

- [ ] "Alterar destino" abre a seleção entre os destinos existentes do afiliado.
- [ ] O tipo de recebimento nunca é editável nesta ação (só o destino).
- [ ] Organização com recebimento em dinheiro não expõe "Alterar destino" (mostra "não se aplica"). FATO.
- [ ] Ao confirmar, o destino atual da organização é atualizado e a contagem "em uso por N" reflete a mudança.
- [ ] O destino marcado como Padrão é o pré-selecionado quando a organização ainda não tem destino escolhido. INFERÊNCIA, A VALIDAR.

## Bordas e o que precisa de decisão

- Excluir um destino "em uso por N organizações": bloquear ou pedir para reatribuir antes. A VALIDAR.
- Excluir o destino Padrão: exige eleger outro como padrão. A VALIDAR.
- "Alterar destino" permite cadastrar destino novo na hora, ou só escolher entre os existentes. A VALIDAR (o print separa "Adicionar destino").

## Fora de escopo

- Alterar o tipo de recebimento (é acordo com a organização).
- Qualquer integração bancária real (mock-only).

## Status epistêmico

- FATO: tipo por organização não editável pelo afiliado; N destinos; badges Padrão e "em uso por N"; dinheiro não aplica destino.
- PROPOSTA: layout da ação de seleção.
- A VALIDAR: pré-seleção pelo Padrão, exclusão de destino em uso, cadastro inline dentro do "Alterar destino".

---

Nota sobre o gate para este módulo: a camada de fidelidade (Figma MCP mais Chrome DevTools MCP) confere a seção "Fidelidade" contra o print e o node. A camada adversarial deve procurar especificamente pelos itens "A VALIDAR" e pelas bordas, que são onde o executor tende a decidir por conta própria.
