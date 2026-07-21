---
tipo: decisao
id: DEC-0001
status: adotada
owner: maestro
data: 2026-07-21
fontes:
  - conversa-claude
  - pesquisa-web-2026-07-21
  - Sources/
---

# DEC-0001 - Obsidian como memoria do produto

## Decisao

Usar `Retrilhar Intel` como vault Obsidian local e versionado no mesmo contexto do projeto, com Markdown como fonte de verdade da inteligencia do produto.

Neste primeiro momento, nao adicionar Quartz, Fumadocs, Mintlify ou outro site de documentacao. A prioridade e consolidar memoria, PRD, transcricoes, decisoes e fluxo de trabalho dos agentes.

## Motivo

- Obsidian trabalha sobre arquivos Markdown locais, que Codex, Claude e Maestri conseguem ler e editar no filesystem.
- Git versiona o vault junto do codigo e permite diffs auditaveis.
- Backlinks, grafo e Canvas resolvem navegacao humana.
- Mermaid em Markdown resolve fluxos versionaveis.
- Camadas de publicacao podem entrar depois, se houver necessidade de URL externa para stakeholders.

## Evidencia externa consultada

- A documentacao/comunidade do Obsidian confirma uso de Markdown, backlinks, Canvas e Mermaid como linguagem de bloco para diagramas.
- O plugin Obsidian Git e uma opcao comunitaria para operacoes Git dentro do Obsidian, incluindo commit/sync e diff.
- Projetos de memoria AI com Obsidian convergem para Markdown/Git como infraestrutura simples, com propostas/inbox antes de consolidar fatos.

## Consequencias

- `Sources/` permanece como origem crua.
- `INDEX.md` vira a entrada padrao para humanos e agentes.
- O Bibliotecario fica responsavel por curadoria e ingestao, nao por front.
- Workers de front leem a intel, mas nao editam a intel durante implementacao normal.
- Publicacao web fica fora do escopo inicial.

## Revisao futura

Reavaliar Quartz/Fumadocs somente se:

- Cristiano/Cati precisarem de URL navegavel sem Obsidian;
- a equipe quiser doc publica/externa;
- o canvas do Maestri precisar de visualizacao web persistente independente do Obsidian desktop.
