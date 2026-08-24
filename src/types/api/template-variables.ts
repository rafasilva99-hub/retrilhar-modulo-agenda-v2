export type TemplateVariableCategory = "participante" | "produto" | "evento" | "reserva_pagamento";

export type TemplateVariable = {
  readonly id: string;
  readonly label: string;
  readonly example: string;
  readonly category: TemplateVariableCategory;
  readonly canBeEmpty?: boolean;
};

export const templateVariables = [
  {
    id: "participante_nome",
    label: "Nome do participante",
    example: "Maria Silva",
    category: "participante",
  },
  {
    id: "participante_email",
    label: "E-mail do participante",
    example: "maria.silva@email.com",
    category: "participante",
  },
  {
    id: "participante_telefone",
    label: "Telefone do participante",
    example: "(31) 98888-1234",
    category: "participante",
  },
  {
    id: "produto_nome",
    label: "Nome do produto",
    example: "Trilha Pico do Itacolomi",
    category: "produto",
  },
  {
    id: "ponto_encontro",
    label: "Ponto de encontro",
    example: "Portaria principal do parque",
    category: "produto",
    canBeEmpty: true,
  },
  {
    id: "produto_duracao",
    label: "Duração do produto",
    example: "5 horas",
    category: "produto",
  },
  {
    id: "evento_data",
    label: "Data do evento",
    example: "12/09/2026",
    category: "evento",
  },
  {
    id: "evento_horario",
    label: "Horário do evento",
    example: "07:30",
    category: "evento",
  },
  {
    id: "reserva_codigo",
    label: "Código da reserva",
    example: "RES-48291",
    category: "reserva_pagamento",
  },
  {
    id: "pagamento_valor",
    label: "Valor do pagamento",
    example: "R$ 240,00",
    category: "reserva_pagamento",
  },
  {
    id: "pagamento_parcelas",
    label: "Parcelas do pagamento",
    example: "3x de R$ 80,00",
    category: "reserva_pagamento",
  },
] as const satisfies readonly TemplateVariable[];

export type TemplateVariableId = (typeof templateVariables)[number]["id"];

export const templateVariableById = new Map<string, TemplateVariable>(
  templateVariables.map((variable) => [variable.id, variable])
);

export const templateVariableCategoryLabels: Record<TemplateVariableCategory, string> = {
  participante: "Participante",
  produto: "Produto",
  evento: "Evento",
  reserva_pagamento: "Reserva e pagamento",
};

export const quickTemplateVariableIds = [
  "participante_nome",
  "produto_nome",
  "evento_data",
  "evento_horario",
  "ponto_encontro",
] as const satisfies readonly TemplateVariableId[];

// TODO(Cristiano): comportamento no envio real quando a variável não tem valor (fallback configurável, omitir a frase ou bloquear o save do template)
// TODO(UX): definir se o popover oculta ou apenas desabilita variáveis indisponíveis para o produto atual
