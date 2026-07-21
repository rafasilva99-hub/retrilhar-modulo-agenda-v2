# Agenda Todo 4: contratos executáveis e bloqueados

Fonte de referência: `Specdrivenagenda`, principalmente as seções 2 a 5 e o gate final. Este é um registro de contrato e decisão; nenhum item bloqueado foi implementado.

## 1. Contratos executáveis agora

Estes pontos têm base suficiente para orientar implementação sem inventar comportamento novo:

1. O módulo continua Vite/React, mock-only e navegado por hash. As rotas de teste preservadas são `#agenda`, `#agendaDia`, `#atualizacoes` e `#novaAtividade`.
2. Cada reserva mantém três eixos independentes: situação operacional, financeiro/pagamento e seguro. Nenhuma UI deve colapsá-los em uma única tag.
3. Situação operacional usa somente os estados e transições permitidos pelo RPP002. Transição não listada deve ser bloqueada com erro claro; cancelamento exige motivo.
4. Transições são reversíveis conforme o RPP002, incluindo `No Show` neutro e reversível. Cada transição cria histórico imutável com estado anterior, estado novo, autor, data/hora e motivo quando aplicável.
5. A home da agenda complementa o mapa de vagas. O refinamento visual pode preservar os eventos existentes; qualquer hover com resumo permanece tratado como PROPOSTA até validação.
6. Nos detalhes, a exceção confirmada para execução é atividade cancelada sem participantes. Ela deve renderizar um estado explícito e não travar o fluxo. Outros cenários de exceção ficam em P-B.
7. A responsividade já existente de detalhes pode ser preservada e as funcionalidades restantes podem ser refinadas sem alterar esses contratos de domínio.

## 2. Contratos com lacunas que impedem fechamento

### Lista de reservas: missing route and column/filter contract

Embora a spec classifique a lista como executável, ela não informa uma rota final nem enumera, de modo implementável, as colunas e filtros. Portanto, não deve ser considerada pronta para implementação neste Todo.

- Lacuna de rota: o owner precisa confirmar o hash/localização da lista, sem assumir que uma rota existente deve ser reutilizada.
- Lacuna de colunas: confirmar identificador da reserva, data/hora, atividade/produto, participante, quantidade, situação operacional, pagamento e seguro, além do checkbox de seleção.
- Lacuna de filtros: confirmar data/período, produto/atividade, reserva/participante e os três eixos de estado; confirmar se filtros combinam por AND e se há paginação.
- Melhoria esperada, ainda dependente do contrato: checkbox por reserva para exportação seletiva.

### CSV: missing header/delimiter/encoding contract

O export seletivo é uma intenção de produto, mas faltam os detalhes que tornam o arquivo interoperável:

- cabeçalho: nomes, ordem, acentuação e estabilidade dos campos;
- delimitador: `;` ou `,`;
- encoding: UTF-8, incluindo ou não BOM;
- escopo: somente reservas marcadas, tratamento de zero selecionadas e escaping de separadores/quebras de linha.

Sem esse contrato, não declarar CSV como executável nem escolher formato silenciosamente.

## 3. Estados epistêmicos

### BLOQUEADO

- **Importar dados: BLOQUEADO.** O uso não foi confirmado pelo cliente. O bloqueio é exclusivo da spec de importação; não autoriza criar upload, parser, endpoint ou fixture de importação.
- A conclusão do dia permanece bloqueada no comportamento central enquanto P-C não tiver decisão.
- A lista de reservas e o CSV permanecem bloqueados para implementação final enquanto suas lacunas de rota, colunas, filtros e formato não forem fechadas.

### PROPOSTA

- **Auditoria: PROPOSTA.** Recomendação: log global em página/fluxo dedicado com filtros por data, produto e reserva e paginação; histórico de uma reserva em drawer aberto a partir da linha, exibindo os três eixos. O botão azul da linha abriria esse drawer e manteria o operador no contexto.
- Escopo da conclusão do dia apenas para atividades não concluídas, resumo agregado e intercorrência registrada por atividade são PROPOSTA.
- Sucesso parcial por atividade é PROPOSTA e deve ter erro localizado, sem abortar o dia inteiro.
- Hover com resumo na home é PROPOSTA de design, não contrato de domínio.

### A VALIDAR

- **P-B: A VALIDAR.** Confirmar se, além de “atividade cancelada sem participantes”, entram agora vagas excedidas, atenção médica, seguro pendente e atividade não iniciada.
- **P-C: A VALIDAR.** Confirmar se a decisão de check-in dos pendentes na conclusão do dia é uma escolha por atividade ou uma escolha agregada para o dia todo.
- Também validar o destino de atividade não iniciada ao fim do dia, a regra para atividade em andamento e a forma final de sucesso parcial.

## 4. Pacote de decisão do owner

**Pergunta única para decisão:** “Você aprova os defaults recomendados abaixo para fechar os contratos da Agenda, ou quais itens devem ser alterados antes de qualquer implementação?”

1. **Importação (P-A):** manter **Importar dados: BLOQUEADO** até confirmação explícita de uso. Default recomendado: não implementar nem expor a entrada de importação.
2. **P-B:** manter somente “cancelada sem participantes” no escopo executável atual. Default recomendado: deixar vagas excedidas, atenção médica, seguro pendente e atividade não iniciada como A VALIDAR.
3. **P-C:** decidir entre confirmação por atividade e decisão agregada no fechamento do dia. Default recomendado: decisão explícita por atividade, com resumo antes de aplicar, porque a decisão afeta reservas e incidentes de cada atividade.
4. **Lista de reservas:** confirmar a rota e o contrato completo de colunas/filtros. Default recomendado, ainda não aprovado: rota hash dedicada `#reservas`; checkbox, identificador, data/hora, produto/atividade, participante, quantidade, situação, pagamento e seguro; filtros combináveis por período, produto/atividade, reserva/participante e cada eixo de estado.
5. **CSV:** confirmar header, delimiter e encoding. Default recomendado, ainda não aprovado: header estável na primeira linha, delimiter `;`, UTF-8 com BOM, escaping RFC 4180 compatível e exportação somente das reservas selecionadas; zero selecionadas deve impedir o download com mensagem clara.
6. **Auditoria:** aprovar ou rejeitar a recomendação **Auditoria: PROPOSTA**. Default recomendado: página global paginada mais drawer de histórico por reserva, sempre com situação, financeiro e seguro separados.

## 5. Todos explicitamente bloqueados

Não iniciar estes todos sem a decisão correspondente:

- implementar Importar dados;
- criar ou escolher a rota final da Lista de reservas;
- fechar colunas, filtros, combinação de filtros e paginação da Lista de reservas;
- implementar exportação CSV sem header/delimiter/encoding confirmados;
- transformar a recomendação de Auditoria em UX definitiva;
- implementar exceções de P-B além de atividade cancelada sem participantes;
- implementar a conclusão do dia sem decisão de P-C e das bordas de atividade não iniciada/em andamento;
- promover qualquer item pendente a contrato final sem decisão do owner.

## 6. Evidência de validação

Os comandos exigidos foram executados após a gravação deste relatório. Os outputs e status estão anexados abaixo.

### Captura dos comandos exigidos

```text
$ rg -n "BLOQUEADO|A VALIDAR|PROPOSTA|missing route|CSV" .omo/evidence/agenda-front-plan/task-4-contracts.md
19:### Lista de reservas: missing route and column/filter contract
28:### CSV: missing header/delimiter/encoding contract
41:### BLOQUEADO
47:### PROPOSTA
54:### A VALIDAR
56:- **P-B: A VALIDAR.**
57:- **P-C: A VALIDAR.**
43:- **Importar dados: BLOQUEADO.**
49:- **Auditoria: PROPOSTA.**
FIRST_STATUS=0

$ rg -n "<forbidden-pattern-regex>" .omo/evidence/agenda-front-plan/task-4-contracts.md
SECOND_STATUS=1
```

Resultado binário: a busca de guardrails encontrou todos os marcadores exigidos; a busca de termos proibidos não encontrou correspondências e terminou com status 1, como esperado.
