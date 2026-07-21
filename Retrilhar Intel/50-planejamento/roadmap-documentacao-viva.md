---
tipo: planejamento
status: ativo
owner: bibliotecario
atualizado: 2026-07-21
---

# Roadmap da documentacao viva

## Fase 0 - Estrutura inicial

- [x] Preservar `Sources/` como arquivo bruto.
- [x] Criar `INDEX.md` como entrada dos agentes.
- [x] Criar catalogo de fontes.
- [x] Criar notas iniciais dos modulos ativos: Agenda, Afiliados/Vendedores, Produtos e Vendas.
- [x] Criar decisao sobre Obsidian como memoria.
- [x] Criar fluxo Maestri + Obsidian + Front em Mermaid.

## Fase 1 - Ingestao dos blocos prioritarios

- [ ] Extrair matriz completa do Bloco 1 - Agenda.
- [ ] Extrair matriz completa do Bloco 3 - Afiliados/Vendedores.
- [ ] Extrair matriz completa do Bloco 4 - Produtos.
- [ ] Extrair matriz completa do Bloco 2 - Vendas.
- [ ] Marcar cada requisito como `fonte`, `status`, `modulo`, `rota`, `arquivo de codigo` quando conhecido.

## Fase 2 - Transcricoes e usabilidade

- [ ] Criar uma ficha por reuniao em `60-reunioes/`.
- [ ] Extrair decisoes firmes por data.
- [ ] Extrair pendencias por modulo.
- [ ] Cruzar testes de usabilidade com Agenda e fluxos mobile.
- [ ] Identificar contradicoes entre PRD, reuniao e codigo.

## Fase 3 - Sincronizacao com implementacao

- [ ] Para cada entrega de Agenda, atualizar `20-modulos/agenda.md`.
- [ ] Para cada entrega de Afiliados, atualizar `20-modulos/afiliados-vendedores.md`.
- [ ] Criar notas de decisao quando mudancas de codigo consolidarem uma regra.
- [ ] Fazer gate doc + codigo antes de merge para `integration/front`.

## Fase 4 - Visualizacao e publicacao opcional

- [ ] Validar se Obsidian desktop resolve a visualizacao interna.
- [ ] Avaliar Obsidian Git plugin se o time quiser commits pelo Obsidian.
- [ ] Avaliar Quartz/Fumadocs apenas se houver demanda por site/URL externa.

## Definition of Done para uma fonte nova

- Arquivo bruto salvo ou referenciado.
- Nota de reuniao/fonte criada.
- Decisoes extraidas ou marcadas como ausentes.
- Pendencias registradas em `_inbox/`.
- Modulos impactados atualizados.
- `INDEX.md` atualizado se a nova fonte mudar o mapa geral.
