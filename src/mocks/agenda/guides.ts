/**
 * Guide, dashboard, weather, and detail-panel mock data for the Agenda module.
 */

// Values are identical across all Agenda frames — confirmed via Figma MCP.
// ─────────────────────────────────────────────────────────────────────────────

export const mockDashboardStats = {
  agendamentosHoje: {
    label: "Agendamentos Hoje",
    subtitle: "Reservas confirmadas",
    value: 23,
    trend: "+4 hoje",
    trendLabel: "vs. período anterior",
  },
  agendamentosUltimaHora: {
    label: "Agendamentos Última Hora",
    subtitle: "Reservas recentes",
    value: 5,
    trend: "+2",
    trendLabel: "vs. período anterior",
  },
  receitaEstimadaHoje: {
    label: "Receita Estimada Hoje",
    subtitle: "Total de vendas",
    value: "R$ 4.250",
    trend: "+8.4%",
    trendLabel: "vs. período anterior",
  },
  ocupacaoMedia: {
    label: "Ocupação Média",
    subtitle: "Percentual de ocupação",
    value: "85%",
    trend: "+12%",
    trendLabel: "vs. mês anterior",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 6. mockGuides
//
// Guides shown in AGENDA - VISÃO GERAL (15221:23601) — "EQUIPE ESCALADA (3)".
// ─────────────────────────────────────────────────────────────────────────────

export interface Guide {
  id: string;
  name: string;
  initials: string;
  role: "Guia Líder" | "Guia de Apoio";
  status: "available" | "conflict";
  /** Only set when status === 'conflict' */
  conflictNote?: string;
  whatsapp?: string;
}

export const mockGuides: Guide[] = [
  {
    id: "guide-001",
    name: "João Silva",
    initials: "JS",
    role: "Guia Líder",
    status: "available",
    whatsapp: "+5531900000001",
  },
  {
    id: "guide-002",
    name: "Maria Costa",
    initials: "MC",
    role: "Guia de Apoio",
    status: "conflict",
    conflictNote: 'Já escalado em "Rapel Cachoeira Alta", das 09:00 às 12:00.',
    whatsapp: "+5531900000002",
  },
  {
    id: "guide-003",
    name: "Pedro Santos",
    initials: "PS",
    role: "Guia de Apoio",
    status: "available",
    whatsapp: "+5531900000003",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. mockWeatherForecast
//
// Weather data shown in AGENDA - VISÃO GERAL (15221:23601) — "PREVISÃO CLIMÁTICA".
// ─────────────────────────────────────────────────────────────────────────────

export interface WeatherDay {
  dayLabel: string;
  dayNumber: number;
  high: number;
  low: number;
}

export const mockWeather = {
  current: {
    tempC: 26,
    feelsLikeC: 28,
    humidityPct: 65,
    windKmh: 18,
    rainChancePct: 20,
  },
  forecast: [
    { dayLabel: "Seg", dayNumber: 12, high: 28, low: 18 },
    { dayLabel: "Ter", dayNumber: 13, high: 26, low: 17 },
    { dayLabel: "Qua", dayNumber: 14, high: 24, low: 16 },
    { dayLabel: "Qui", dayNumber: 15, high: 29, low: 18 },
    { dayLabel: "Sex", dayNumber: 16, high: 27, low: 18 },
    { dayLabel: "Sáb", dayNumber: 17, high: 30, low: 20 },
    { dayLabel: "Dom", dayNumber: 18, high: 28, low: 19 },
  ] as WeatherDay[],
  source: "Dados de OpenWeather API",
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. mockActivityDetail
//
// Static detail for act-001 (Trilha Pico do Itacolomi) used in VISÃO GERAL tab.
// Extracted from Figma AGENDA - VISÃO GERAL (15221:23601).
// ─────────────────────────────────────────────────────────────────────────────

export const mockActivityDetail = {
  activityId: "act-001",
  name: "Trilha Pico do Itacolomi",
  location: "Parque Municipal, Sabará - Belo Horizonte",
  dateTime: "2026-05-11T08:00:00",
  duration: "08:00 - 11:00 (3h)",
  reservations: {
    total: 12,
    occupied: 8,
    occupiedPct: 85,
    vacantPct: 15,
    byTariff: {
      adultos: 4,
      criancas: 3,
      cortesias: 1,
    },
  },
  guides: mockGuides,
  weather: mockWeather,
};
