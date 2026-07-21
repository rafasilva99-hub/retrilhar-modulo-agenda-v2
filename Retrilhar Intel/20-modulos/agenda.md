---
tipo: modulo
modulo: agenda
status: curadoria-inicial
owner: bibliotecario
atualizado: 2026-07-21
fontes:
  - ../Sources/Bloco_1_Agenda.md.html
  - ../Sources/RPP002%20PAINEL%20OPERACIONAL.docx.html
  - ../Sources/Resumo_dos_Testes_de_Usabilidade_-_Modulo_de_Agenda%20(1).docx.html
---

# Modulo Agenda / Operacao

## Fontes principais

- [Bloco 1 - Agenda / Operacao](../Sources/Bloco_1_Agenda.md.html)
- [RPP002 Painel Operacional](../Sources/RPP002%20PAINEL%20OPERACIONAL.docx.html)
- [Resumo dos testes de usabilidade - Agenda](../Sources/Resumo_dos_Testes_de_Usabilidade_-_Modulo_de_Agenda%20(1).docx.html)
- [Achados consolidados de usabilidade](../Sources/achados_testes_usabilidade.md.html)

## Fatos confirmados

- **FATO**: Agenda e o ponto central de planejamento temporal das atividades.
- **FATO**: A fonte do Bloco 1 lista as visualizacoes de calendario como mes, semana, dia e lista, com mencao a visualizacao por produto.
- **FATO**: Nova Atividade e tratada como entrada do fluxo operacional, porque sem atividade cadastrada nao ha reserva, mapa de vagas ou listas.
- **FATO**: O backlog de Agenda inclui adaptacao mobile como item recorrente nos caminhos principais e edge cases.
- **FATO**: Testes de usabilidade citados no Bloco 1 consideraram a visualizacao de vagas clara e a agenda visualmente confortavel para encontrar atividade.

## Tarefas do Bloco 1 ja identificadas

- Calendario.
- Nova Atividade.
- Editar Atividade.
- Cancelar e Excluir Atividade.

## Pendencias abertas

- **PENDENTE**: Extrair todas as tarefas do Bloco 1 alem das quatro primeiras.
- **PENDENTE**: Separar requisitos de calendario que ja estao implementados no worktree `work/agenda-front`.
- **PENDENTE**: Cruzar testes de usabilidade #3, #4 e #5 com a tela atual em `#agenda`.
- **PENDENTE**: Definir o comportamento mobile para calendario mensal quando houver densidade alta de eventos.

## Relacao com codigo atual

- Worktree de frente: `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar-agenda-front-worktree`
- Branch: `work/agenda-front`
- Rotas principais observadas: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`
- Portal desktop: `Preview front - Agenda`
- Portal mobile: `Preview front - Agenda Mobile`

## Fluxo recomendado para melhorias

1. Worker Agenda le esta nota e `00-fontes/catalogo-sources.md`.
2. Implementa apenas dentro do escopo da agenda.
3. Maestro valida desktop e mobile.
4. Bibliotecario atualiza esta nota com o que foi implementado e com novas pendencias.
