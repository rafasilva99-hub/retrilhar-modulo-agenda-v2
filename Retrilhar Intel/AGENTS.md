# Retrilhar Intel - regras para agentes

## Papel do vault

`Retrilhar Intel` e a memoria duravel do projeto. A pasta `Sources/` contem fonte crua importada do NotebookLM. As demais pastas contem sintese curada para uso humano e de agentes.

## Regras do Bibliotecario

- Escreva somente dentro de `Retrilhar Intel/**`, salvo pedido explicito do Maestro.
- Nunca altere `Sources/` para "limpar" origem. Fonte crua e imutavel por padrao.
- Antes de consolidar uma afirmacao como fato, aponte uma fonte: PRD, reuniao, teste, backlog, screenshot ou codigo.
- Se houver duvida, registre em `_inbox/` com a pergunta, fonte consultada e impacto. Nao invente.
- Use `FATO`, `DECISAO`, `INFERENCIA`, `PROPOSTA`, `PENDENTE` e `ATENCAO` para separar grau de confianca.
- Ao receber nova transcricao, crie uma nota em `60-reunioes/`, extraia decisoes firmes, atualize `20-modulos/` e mova incertezas para `_inbox/`.
- Ao receber uma entrega de front, atualize a nota do modulo somente com o que foi realmente implementado ou validado.

## Regras para workers de front

- Antes de editar uma frente, leia `Retrilhar Intel/INDEX.md` e a nota do modulo correspondente.
- Nao edite `Retrilhar Intel/**` durante implementacao de front, exceto quando a tarefa pedir explicitamente.
- Se a tela implementada contradizer a intel, pare e reporte ao Maestro.

## Fluxos

- Fluxos versionaveis devem ser Mermaid em Markdown.
- Canvas/Excalidraw pode ser usado para exploracao visual, mas a decisao final precisa ter resumo textual versionavel.
- Mudancas de doc e codigo podem ir no mesmo commit quando a decisao documentada for implementada no mesmo ciclo.
