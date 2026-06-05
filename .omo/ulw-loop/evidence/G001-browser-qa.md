== Browser QA summary ==
Fri Jun  5 09:20:20 -03 2026

Channel: Playwright MCP browser_navigate/browser_evaluate/browser_resize/browser_tabs

== Route JSON files ==

--- .omo/ulw-loop/evidence/G001-browser-agenda-desktop.json ---
{
  "href": "http://127.0.0.1:5174/#agenda",
  "hash": "#agenda",
  "title": "Módulo de Agenda V2",
  "textLength": 1103,
  "textStart": "Agendamentos Hoje\n\nReservas confirmadas\n\n23\n\n+4 hoje\n\nvs. período anterior\n\nAgendamentos Última Hora\n\nReservas recentes\n\n5\n\n+2\n\nvs. período anterior\n\nReceita Estimada Hoje\n\nTotal de vendas\n\nR$ 4.250\n\n+8.4%\n\nvs. período anterior\n\nOcupação Média\n\nPercentual de ocupação\n\n85%\n\n+12%\n\nvs. mês anterior\n\nJu"
}
--- .omo/ulw-loop/evidence/G001-browser-agenda-mobile.json ---
{
  "href": "http://127.0.0.1:5174/#agenda",
  "hash": "#agenda",
  "viewport": {
    "width": 375,
    "height": 812
  },
  "textLength": 1062,
  "textStart": "Agendamentos Hoje\n\nReservas confirmadas\n\n23\n\n+4 hoje\n\nvs. período anterior\n\nAgendamentos Última Hora\n\nReservas recentes\n\n5\n\n+2\n\nvs. período anterior\n\nReceita Estimada Hoje\n\nTotal de vendas\n\nR$ 4.250\n\n+8.4%\n\nvs. período anterior\n\nOcupação Média\n\nPercentual de ocupação\n\n85%\n\n+12%\n\nvs. mês anterior\n\nJu"
}
--- .omo/ulw-loop/evidence/G001-browser-agendaDia-desktop.json ---
{
  "href": "http://127.0.0.1:5174/#agendaDia",
  "hash": "#agendaDia",
  "title": "Módulo de Agenda V2",
  "textLength": 1577,
  "textStart": "JUN\n\n5\n\nAtividades do dia\n\n4\n\n05/06/2026\n\n(Sem feriados)\n\nFicha de Operação\n\nConcluir Atividades do Dia\n\n08:00\n\nTrilha Pico do Itacolomi (220/200)\n\nAtividade em Andamento\n\nAtividade comum\n\n·\n\nVagas excedidas\n\nData da atividade\n\n05/06/2026\n\nHora da atividade\n\n08:00 - 11:00 (BRT)\n\nParticipantes\n\n220 p"
}
--- .omo/ulw-loop/evidence/G001-browser-atualizacoes-desktop.json ---
{
  "href": "http://127.0.0.1:5174/#atualizacoes",
  "hash": "#atualizacoes",
  "title": "Módulo de Agenda V2",
  "textLength": 1088,
  "textStart": "Detalhes da atividade\n\nFechar\n\nExpandir menu\n\nParticipantes\n\nAtualizações\n\nVisão geral\n\nDigite sua mensagem\n\nRegistro de atividades (05)\n\n🛠️\n\nEquipamentos pendentes\n\n•\n\n10:15, 07/04/2026\n\n2 kits de rapel ainda não foram verificados para esta atividade. Confirme a disponibilidade antes da saída.\n\n🩺"
}
--- .omo/ulw-loop/evidence/G001-browser-fallback-desktop.json ---
{
  "href": "http://127.0.0.1:5174/#agenda",
  "hash": "#agenda",
  "title": "Módulo de Agenda V2",
  "textLength": 1103,
  "textStart": "Agendamentos Hoje\n\nReservas confirmadas\n\n23\n\n+4 hoje\n\nvs. período anterior\n\nAgendamentos Última Hora\n\nReservas recentes\n\n5\n\n+2\n\nvs. período anterior\n\nReceita Estimada Hoje\n\nTotal de vendas\n\nR$ 4.250\n\n+8.4%\n\nvs. período anterior\n\nOcupação Média\n\nPercentual de ocupação\n\n85%\n\n+12%\n\nvs. mês anterior\n\nJu"
}
--- .omo/ulw-loop/evidence/G001-browser-novaAtividade-desktop.json ---
{
  "href": "http://127.0.0.1:5174/#novaAtividade",
  "hash": "#novaAtividade",
  "title": "Módulo de Agenda V2",
  "textLength": 935,
  "textStart": "Nova Atividade\n\nPreencha os dados para criar uma nova atividade na sua agenda.\n\nDados da atividade e visibilidade\n\nInforme o título, local, produto vinculado, capacidade e quem pode visualizar a atividade.\n\nDatas e horários da atividade\n\nDefina quando a atividade acontece e se ela se repete em outro"
}
== Console note ==
Only observed console error class was favicon.ico 404 during browser loads.

== Cleanup receipt ==
browser context/tab closed via mcp__playwright.browser_tabs close.
Vite session 5125 stopped with Ctrl-C; fallback retest Vite session 27897 stopped with Ctrl-C.

== Admin status after browser QA ==
 M modules/affiliate/components/affiliate-list.tsx
?? .agents/
?? .claude/
?? .env.local.bak
?? skills-lock.json
