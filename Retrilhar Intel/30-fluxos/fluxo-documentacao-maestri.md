---
tipo: fluxo
status: ativo
owner: bibliotecario
atualizado: 2026-07-21
relacionado:
  - ../INDEX.md
  - ../40-decisoes/DEC-0001-obsidian-como-memoria.md
---

# Fluxo de documentacao viva com Maestri

## Objetivo

Manter documentacao, planejamento e codigo sincronizados sem depender de memoria de chat. O vault Obsidian e a fonte navegavel; Git e a trilha de versao; Maestri coordena agentes e portais.

## Fluxo principal

```mermaid
flowchart TD
    A[Nova fonte: PRD, transcricao, teste ou decisao] --> B[Salvar em Sources/ ou 60-reunioes/]
    B --> C[Bibliotecario faz leitura e classifica]
    C --> D{Ha fonte suficiente?}
    D -- Sim --> E[Atualiza notas curadas em 10-prd/ e 20-modulos/]
    D -- Nao --> F[Registra duvida ou proposta em _inbox/]
    E --> G[Maestro define tarefa de front]
    F --> G
    G --> H[Worker Agenda ou Afiliados implementa no worktree isolado]
    H --> I[Maestro valida desktop e mobile]
    I --> J{Mudou entendimento do produto?}
    J -- Sim --> K[Bibliotecario atualiza intel e decisoes]
    J -- Nao --> L[Registrar evidencia/gate se aplicavel]
    K --> M[Commit atomico doc + codigo quando fizer sentido]
    L --> M
    M --> N[Merge controlado para integration/front]
```

## Responsabilidades

| Papel | Responsabilidade | Write set |
| --- | --- | --- |
| Maestro | Orquestracao, gates, conflitos, merges e decisao de escopo. | Qualquer area quando necessario, com cuidado de worktree. |
| Bibliotecario | Curadoria, ingestao de fontes, decisoes, mapas de modulo e pendencias. | `Retrilhar Intel/**` |
| Agenda Worker | Melhorias da agenda/admin. | Worktree `work/agenda-front`, escopo Agenda. |
| Afiliados Worker | Melhorias de afiliados. | Worktree `work/afiliados-front`, escopo Afiliados. |

## Gate de atualizacao da intel

Uma nota curada so deve ser alterada quando houver:

- fonte local;
- decisao do usuario;
- evidencia de codigo validada;
- ou registro explicito como `INFERENCIA`, `PROPOSTA` ou `PENDENTE`.

## Fluxograma de ingestao de reuniao

```mermaid
flowchart LR
    T[Transcricao nova] --> R[Nota em 60-reunioes/]
    R --> X[Extrair decisoes firmes]
    R --> P[Extrair pendencias e perguntas]
    R --> I[Extrair impactos por modulo]
    X --> D[40-decisoes/]
    P --> B[_inbox/]
    I --> M[20-modulos/]
    D --> IDX[INDEX.md]
    M --> IDX
```

## Regras contra drift

- Se o codigo implementado divergir da nota do modulo, abrir pendencia antes de seguir.
- Se uma transcricao contradisser PRD anterior, criar nota em `_inbox/` com as duas fontes.
- Se o modulo ainda nao existir no worktree limpo, nao documentar como implementado.
