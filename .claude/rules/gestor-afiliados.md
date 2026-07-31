# Regras do módulo Gestão de Afiliados (Admin)

Estas regras valem para `src/modules/gestor-afiliados/**`, `src/components/blocos/**`,
`src/mocks/gestor-afiliados/**` e `src/types/api/afiliados.ts`. O módulo do painel do
afiliado tem regras próprias em `.claude/rules/afiliados.md`.

- Estado da filiação é enum único de 5 valores (convidada, expirada, ativa,
  inativa, desativada). NÃO existe campo booleano "ativo" separado.
  Não criar booleano paralelo em nenhuma hipótese.
- Toda ação de linha ou de ficha passa por um guarda declarativo.
  Nunca condicional de permissão inline no JSX.
- Dado sempre de src/mocks/gestor-afiliados/, tipado por src/types/api/afiliados.ts,
  consumido via src/modules/gestor-afiliados/services/. Proibido literal
  inventado dentro de componente.
- Bloco marcado PENDENTE no inventário não é implementado.
  Renderizar placeholder com TODO e o ID da pendência.
- Nomenclatura: o sujeito é a FILIAÇÃO, não o afiliado.
  Badge e copy usam "Filiação ativa", "Filiação pausada", "Filiação desativada".
  Concordância no feminino.
- "Pausar" e "retomar" são reversíveis e neutros.
  "Desativar" e "reativar" são a ação destrutiva e seu retorno.
  Nunca usar os pares de forma intercambiável.
- Telas AFI compõem blocos de src/components/blocos/. Se faltar bloco,
  parar e avisar em vez de criar um novo dentro do arquivo de rota.
- Proibido travessão e meia-risca em copy. Todo copy em pt-BR com
  diacríticos corretos e nenhum texto em inglês na UI.
