# Agenda Todo 7: pacote de decisões do owner

Status: tranche bloqueada. Este arquivo registra as decisões necessárias antes de qualquer implementação de lista de reservas, CSV, auditoria global ou conclusão do dia. As recomendações abaixo são defaults para aprovação explícita; não são contratos finais.

## Pacote numerado de decisão

### 1. Lista de reservas: localização e rota

Decidir se a lista será uma tela própria dentro do shell da Agenda e qual hash deve ser preservado em links diretos.

- Recomendado: item `Reservas` na navegação da Agenda, rota hash dedicada `#reservas`, acesso também a partir da home `#agenda`.
- A tela deve permanecer fora do detalhe de uma atividade. A rota escolhida precisa funcionar por link direto e manter a navegação hash existente.
- Confirmar: aprovar `#reservas` e essa localização, ou informar a rota e a localização alternativas.

### 2. Lista de reservas: colunas, filtros e seleção

Confirmar o contrato de dados e de consulta. A ordem recomendada das colunas de dados é:

1. checkbox de seleção;
2. `reserva_id`;
3. data;
4. hora;
5. atividade/produto;
6. participante;
7. quantidade;
8. situação operacional;
9. pagamento;
10. seguro.

Filtros recomendados: período/data, atividade/produto, reserva/participante, situação operacional, pagamento e seguro. Recomenda-se combinação por `AND`, limpar filtros em uma ação, paginação com 25 linhas por página e opções de 50 e 100 linhas. A seleção recomendada é por reserva, com contador visível e preservação da seleção enquanto o filtro é ajustado; confirmar se a seleção pode abranger todas as páginas do resultado filtrado ou somente a página visível.

Confirmar: nomes e ordem das colunas, filtros obrigatórios, combinação dos filtros, paginação e alcance da seleção.

### 3. CSV: header, delimitador, encoding, vazios e data

Contrato recomendado, ainda pendente de aprovação:

- header estável, na primeira linha, com esta ordem e grafia técnica: `reserva_id;data;hora;atividade;participante;quantidade;situacao_operacional;pagamento;seguro`;
- delimitador `;`;
- encoding UTF-8 com BOM para compatibilidade com planilhas;
- campos vazios como campo de comprimento zero, isto é, delimitadores consecutivos; não usar `N/A`, hífen ou texto substituto;
- data no formato `YYYY-MM-DD` e hora no formato 24 horas `HH:mm`, no fuso local da Agenda;
- aspas e quebras de linha escapadas conforme a convenção CSV, com aspas duplicadas dentro de campos entre aspas;
- exportar somente reservas selecionadas; com zero selecionadas, não baixar arquivo e mostrar mensagem clara.

Confirmar cada item: header exato, delimitador, UTF-8 com ou sem BOM, representação de vazios, formato de data/hora, fuso e comportamento com zero selecionadas.

### 4. RPP002: disponibilidade da matriz de transição

Decidir onde está a matriz completa e autorizada do RPP002, ou fornecer seu conteúdo. O worktree contém estados, invariantes e algumas transições citadas, mas não contém a tabela completa linha a linha. Portanto, não há base para declarar a matriz disponível.

Registros explícitos já disponíveis, sem equivaler à matriz completa:

- estados operacionais: Rascunho, Aguardando Pagamento, Agendada, Confirmada, Check-in Realizado, Realizada, Cancelada, Expirada e No Show;
- Cancelada pode voltar para Confirmada;
- Realizada pode voltar para Confirmada;
- No Show pode retornar para Confirmada, Cancelada ou Agendada pelas ações previstas;
- concluir em massa move Check-in Realizado para Realizada;
- desfazer check-in é obrigatório, mas o destino e suas guardas precisam constar da matriz autorizada;
- cada transição exige histórico imutável; cancelamento exige motivo.

Formato mínimo recomendado para a fonte a entregar: estado de origem, ação, estado de destino, guardas, autor permitido, motivo obrigatório ou opcional, efeitos em pagamento e seguro, reversibilidade e campos do registro de auditoria.

Default recomendado: manter qualquer controle de transição, conclusão do dia e regra derivada bloqueado até receber a matriz completa e validar que nenhuma transição fora dela será aceita.

### 5. Auditoria global: localização e drawer por reserva

Decidir a localização da auditoria global e aprovar o comportamento do histórico contextual.

- Recomendado: item `Auditoria` na navegação da Agenda, rota hash dedicada `#auditoria`, página global paginada com filtros por data, produto/atividade e reserva.
- Recomendado: o histórico de uma reserva abre em drawer a partir da linha da própria lista de reservas, sem abandonar a rota da lista. O botão contextual da linha abre o drawer.
- O drawer deve mostrar histórico imutável separado por situação operacional, pagamento e seguro, com estado anterior, estado novo, autor, data, hora e motivo quando aplicável.
- Confirmar: rota/localização da auditoria, filtros, paginação, ação que abre o drawer e aprovação do conteúdo dos três eixos.

### 6. P-C: comportamento de conclusão do dia

Decidir se a escolha para check-ins pendentes é por atividade ou agregada para o dia e fechar as bordas do fluxo.

Default recomendado: decisão por atividade, precedida de resumo do dia. Para cada atividade não concluída, o owner escolhe entre realizar check-in automático dos pendentes e concluir como No Show. Uma ação de conveniência para repetir a escolha só deve existir após confirmação explícita.

Comportamento recomendado para aprovação:

- atividades já concluídas ficam fora da ação;
- atividades Não Iniciadas entram em revisão explícita e, se encerradas, pendentes viram No Show; zero participantes não gera mutação de reserva;
- atividades Em Andamento entram com aviso visível e confirmação explícita antes da conclusão;
- sucesso parcial é permitido: falha fica localizada por atividade, atividades bem-sucedidas permanecem concluídas e o restante pode ser corrigido sem abortar o dia inteiro;
- intercorrência e observação são registradas por atividade; um atalho de “tudo certo no dia” só vale quando nenhuma atividade registra incidente;
- concluir altera apenas a situação operacional. Pagamento e seguro permanecem em seus eixos, salvo gatilho previsto na matriz RPP002;
- cada mudança de reserva gera o histórico obrigatório.

Confirmar: decisão por atividade ou agregada, tratamento de Não Iniciada, tratamento de Em Andamento, exclusão das já concluídas, regra de sucesso parcial e registro de intercorrências.

### 7. Aprovação das PROPOSTA de hover e auditoria no escopo do protótipo

Responder separadamente para evitar que uma aprovação visual seja confundida com contrato de domínio:

- hover da home: recomendado aprovar como resumo visual não destrutivo do evento, sem alterar estado, sem iniciar transição e sem gerar registro de auditoria;
- auditoria: recomendado aprovar como escopo de protótipo a combinação página global mais drawer por reserva descrita na decisão 5, condicionada à confirmação de rota, dados e matriz RPP002.

Confirmar para cada item: aprovado no protótipo, aprovado com alterações ou fora do escopo atual.

## Todos que permanecem bloqueados

Até as respostas acima, permanecem bloqueados:

1. criar a localização e a rota final da Lista de reservas;
2. fechar colunas, filtros, paginação e alcance da seleção da Lista de reservas;
3. implementar exportação CSV;
4. escolher a UX definitiva da Auditoria global e do drawer por reserva;
5. implementar transições ou regras derivadas sem a matriz completa do RPP002;
6. implementar conclusão do dia e seus estados de sucesso, sucesso parcial e erro;
7. promover o hover ou a Auditoria de PROPOSTA a comportamento aprovado sem resposta do owner.

Importar dados continua BLOQUEADO. Os cenários adicionais de P-B continuam A VALIDAR; o único cenário de exceção confirmado para a tranche segura permanece atividade cancelada sem participantes.

## Resposta esperada do owner

Responder pelos números 1 a 7, aprovando o recomendado ou substituindo-o por uma decisão concreta. Para a decisão 4, indicar o arquivo, link ou tabela do RPP002. Para a decisão 6, responder também às bordas Não Iniciada, Em Andamento e sucesso parcial.

## Resumo dos comandos e evidência

- A busca de contrato foi executada com `rg -n "Lista de reservas|CSV|Auditoria|P-C|RPP002|recomendado"` neste arquivo: status 0; os termos exigidos aparecem no pacote.
- A busca negativa das frases de bloqueio solicitadas foi executada neste arquivo: status 1; nenhuma correspondência foi encontrada.
- O estado direcionado do Git foi capturado para este arquivo, `.omo/start-work/ledger.jsonl` e `.omo/plans/agenda-front-plan.md` após as alterações.

### Receipt de validação

1. Cenário feliz, contrato presente. Invocação exata: `rg -n "Lista de reservas|CSV|Auditoria|P-C|RPP002|recomendado" .omo/evidence/agenda-front-plan/task-7-owner-decisions.md`. Observável binário: exit code 0, com ocorrências dos seis termos no próprio pacote. Artefato: `.omo/evidence/agenda-front-plan/task-7-owner-decisions.md`.
2. Cenário negativo, frases proibidas ausentes. Invocação: busca negativa das frases proibidas, registrada integralmente no ledger JSONL por causar auto-correspondência se copiada para este arquivo. Observável binário: exit code 1 e saída vazia. Artefato: `.omo/evidence/agenda-front-plan/task-7-owner-decisions.md` e `.omo/start-work/ledger.jsonl`.
3. Auditoria de escopo. Invocação exata: `git status --short -- .omo/evidence/agenda-front-plan/task-7-owner-decisions.md .omo/start-work/ledger.jsonl .omo/plans/agenda-front-plan.md`. Observável binário: somente os três caminhos permitidos aparecem como não rastreados. O status separado de `src` preserva o arquivo não rastreado preexistente `src/modules/agenda/agenda-route-smoke.test.tsx`; nenhum produto foi editado nesta tarefa. Artefato: `.omo/evidence/agenda-front-plan/task-7-owner-decisions.md`.
