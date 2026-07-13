// ---------------------------------------------------------------------------
// Mock data — Painel do Afiliado (v2)
// Fonte de verdade do protótipo: PRD Afiliados, Central de Vendas, Escopo.
// ---------------------------------------------------------------------------

export type OrderStatus = "Pago" | "Aguardando pagamento" | "Cancelado" | "Abandonado";
export type CommissionStatus = "nao-gerada" | "a-receber" | "quitada";
export type ReferralOrigin = "link-geral" | "link-org" | "link-produto" | "cupom";
export type AfiliadoPeriod = "semana" | "mes" | "ano";
export type IndicacoesTab = "todas" | "pagas" | "nao-pagas" | "carrinhos-abandonados";
export type GanhosTab = "todas" | "pendentes" | "quitadas";
export type AffiliateScopeType = "todos" | "especificos";

export interface AfiliadoOrganization {
  id: string;
  name: string;
  code: string;
}

export interface AfiliadoReferral {
  id: string;
  customer: string;
  product: string;
  organizationId: string;
  orderStatus: OrderStatus;
  commissionStatus: CommissionStatus;
  purchaseValue: string;
  commission: string;
  origin: ReferralOrigin;
  date: string;
  time?: string;
  commissionRule?: string;
  orderId: string;
  purchaseDate: string;
  activityDate: string;
}

export interface AfiliadoKpis {
  indicacoesQtd: number;
  indicacoesValor: string;
  indicacoesPagas: number;
  carrinhosQtd: number;
  carrinhosValor: string;
  comissaoRecebida: string;
  comissaoReceber: string;
}

export interface IndicacoesKpis {
  indicacoesOriginadasQtd: number;
  indicacoesOriginadasValor: string;
  vendasPagasQtd: number;
  vendasPagasValor: string;
  carrinhosAbandonadosQtd: number;
  carrinhosAbandonadosValor: string;
  viaCupomQtd: number;
  viaCupomValor: string;
  comissaoGerada: string;
}

export interface GanhosKpis {
  comissaoAReceber: string;
  comissaoRecebida: string;
  comissaoGerada: string;
}

export interface OrgBreakdown {
  organizationId: string;
  geradaNoPeriodo: string;
  recebidaNoPeriodo: string;
  aReceber: string;
}

export interface ComissaoLancamento {
  id: string;
  dataGeracao: string;
  organizationId: string;
  product: string;
  referralId: string;
  customerName: string;
  valor: string;
  status: CommissionStatus;
  dataQuitacao?: string;
  regraComissao: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  organizationId: string;
  comissao: string;
  comissaoOrigem: "afiliação" | "produto";
  link: string;
  vendasNoPeriodo: number;
  isNew?: boolean;
  indisponivel?: boolean;
}

export interface AffiliateProductRequest {
  id: string;
  name: string;
  organizationId: string;
  solicitado?: boolean;
}

export interface AffiliateOrgScope {
  organizationId: string;
  scopeType: AffiliateScopeType;
  orgLink: string;
  products: AffiliateProduct[];
  availableToRequest: AffiliateProductRequest[];
}

// ---------------------------------------------------------------------------
// Organizações com as quais a afiliada (Katiely) tem vínculo ativo
// FATO (Transcrição 25/03: Katiely afiliada de três clientes)
// ---------------------------------------------------------------------------

export const affiliateOrganizations: AfiliadoOrganization[] = [
  { id: "org-cerrado", name: "Cerrado Experience", code: "cerrado" },
  { id: "org-vertaco", name: "Vertaco Aventuras", code: "vertaco" },
  { id: "org-trilheiras", name: "Trilheiras de Brasília", code: "trilheiras" },
];

export const organizationMap: Record<string, AfiliadoOrganization> = Object.fromEntries(
  affiliateOrganizations.map((o) => [o.id, o])
);

// ---------------------------------------------------------------------------
// Código global do afiliado
// FATO (Escopo 13.1; Cristiano, Transcrição 25/03)
// ---------------------------------------------------------------------------

export const affiliateCode = "KAT-2931";

// ---------------------------------------------------------------------------
// Links — hierarquia de 3 níveis (resolução P4, DECISÃO FIRME Katiely)
// ---------------------------------------------------------------------------

export const affiliateGeneralLink = "https://retrilhar.com.br/ref/katiely-pinheiro";

export const affiliateOrgLinks: Record<string, string> = {
  "org-cerrado": "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado",
  "org-vertaco": "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco",
  "org-trilheiras": "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras",
};

// ---------------------------------------------------------------------------
// Indicações (referrals) — dados variados conforme seção 5 do refinamento
// ---------------------------------------------------------------------------

export const affiliateReferrals: AfiliadoReferral[] = [
  {
    id: "ref-1",
    customer: "João Pedro da Silva Oliveira",
    product: "Trilha Pico do Itambé",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "quitada",
    purchaseValue: "R$ 5.679,99",
    commission: "R$ 568,00",
    origin: "link-produto",
    date: "2026-07-05",
    time: "14:32",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-001",
    purchaseDate: "2026-07-05",
    activityDate: "2026-07-10",
  },
  {
    id: "ref-2",
    customer: "Maria Eduarda Santos Pereira",
    product: "Rapel Cachoeira",
    organizationId: "org-vertaco",
    orderStatus: "Aguardando pagamento",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 1.890,00",
    commission: "R$ 189,00",
    origin: "cupom",
    date: "2026-07-04",
    time: "09:15",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-002",
    purchaseDate: "2026-07-04",
    activityDate: "2026-07-09",
  },
  {
    id: "ref-3",
    customer: "Carlos Eduardo Ferreira Lima",
    product: "Passeio de Barco",
    organizationId: "org-trilheiras",
    orderStatus: "Pago",
    commissionStatus: "quitada",
    purchaseValue: "R$ 3.250,00",
    commission: "R$ 325,00",
    origin: "link-org",
    date: "2026-07-03",
    time: "16:48",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-003",
    purchaseDate: "2026-07-03",
    activityDate: "2026-07-08",
  },
  {
    id: "ref-4",
    customer: "Juliana Aparecida de Lima",
    product: "Mergulho Noturno",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "a-receber",
    purchaseValue: "R$ 2.450,00",
    commission: "R$ 245,00",
    origin: "link-geral",
    date: "2026-07-02",
    time: "11:20",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-004",
    purchaseDate: "2026-07-02",
    activityDate: "2026-07-06",
  },
  {
    id: "ref-5",
    customer: "Amanda Cristina Miranda Souza",
    product: "Trilha Cachoeira Grande",
    organizationId: "org-vertaco",
    orderStatus: "Pago",
    commissionStatus: "quitada",
    purchaseValue: "R$ 4.120,00",
    commission: "R$ 412,00",
    origin: "link-produto",
    date: "2026-07-01",
    time: "08:05",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-005",
    purchaseDate: "2026-07-01",
    activityDate: "2026-07-05",
  },
  {
    id: "ref-6",
    customer: "Pedro Henrique Barbosa Costa",
    product: "Tirolesa Radical",
    organizationId: "org-cerrado",
    orderStatus: "Aguardando pagamento",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 890,00",
    commission: "R$ 89,00",
    origin: "cupom",
    date: "2026-06-30",
    time: "17:40",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-006",
    purchaseDate: "2026-06-30",
    activityDate: "2026-07-04",
  },
  {
    id: "ref-7",
    customer: "Amauri dos Santos Lopes",
    product: "Canionismo Serra Geral",
    organizationId: "org-trilheiras",
    orderStatus: "Pago",
    commissionStatus: "quitada",
    purchaseValue: "R$ 6.340,00",
    commission: "R$ 634,00",
    origin: "link-org",
    date: "2026-06-29",
    time: "10:12",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-007",
    purchaseDate: "2026-06-29",
    activityDate: "2026-07-03",
  },
  {
    id: "ref-8",
    customer: "Fernanda Beatriz Costa Almeida",
    product: "Escalada Indoor",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "quitada",
    purchaseValue: "R$ 1.230,00",
    commission: "R$ 123,00",
    origin: "link-produto",
    date: "2026-06-28",
    time: "13:55",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-008",
    purchaseDate: "2026-06-28",
    activityDate: "2026-07-02",
  },
  {
    id: "ref-9",
    customer: "Ricardo Augusto Alves Monteiro",
    product: "Stand-Up Paddle",
    organizationId: "org-vertaco",
    orderStatus: "Pago",
    commissionStatus: "a-receber",
    purchaseValue: "R$ 780,00",
    commission: "R$ 78,00",
    origin: "link-geral",
    date: "2026-06-27",
    time: "15:30",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-009",
    purchaseDate: "2026-06-27",
    activityDate: "2026-07-01",
  },
  // --- Cancelados e Abandonados ---
  {
    id: "ref-10",
    customer: "Luciana Martins de Oliveira",
    product: "Trilha Pico do Itambé",
    organizationId: "org-cerrado",
    orderStatus: "Cancelado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 2.340,00",
    commission: "R$ 234,00",
    origin: "link-produto",
    date: "2026-07-06",
    time: "10:45",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-010",
    purchaseDate: "2026-07-06",
    activityDate: "2026-07-12",
  },
  {
    id: "ref-11",
    customer: "Thiago Rezende Souza",
    product: "Rapel Cachoeira",
    organizationId: "org-vertaco",
    orderStatus: "Cancelado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 1.560,00",
    commission: "R$ 156,00",
    origin: "cupom",
    date: "2026-07-05",
    time: "18:20",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-011",
    purchaseDate: "2026-07-05",
    activityDate: "2026-07-11",
  },
  {
    id: "ref-12",
    customer: "Beatriz Helena Campos",
    product: "Passeio de Barco",
    organizationId: "org-trilheiras",
    orderStatus: "Abandonado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 1.890,00",
    commission: "R$ 0,00",
    origin: "link-geral",
    date: "2026-07-04",
    time: "12:10",
    orderId: "PED-2931-012",
    purchaseDate: "2026-07-04",
    activityDate: "2026-07-09",
  },
  {
    id: "ref-13",
    customer: "Gabriel Augusto de Freitas",
    product: "Mergulho Noturno",
    organizationId: "org-cerrado",
    orderStatus: "Abandonado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 3.450,00",
    commission: "R$ 0,00",
    origin: "link-produto",
    date: "2026-07-03",
    time: "20:05",
    orderId: "PED-2931-013",
    purchaseDate: "2026-07-03",
    activityDate: "2026-07-07",
  },
  {
    id: "ref-14",
    customer: "Camila Rodrigues de Almeida",
    product: "Canionismo Serra Geral",
    organizationId: "org-trilheiras",
    orderStatus: "Abandonado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 4.780,00",
    commission: "R$ 0,00",
    origin: "link-org",
    date: "2026-07-01",
    time: "07:30",
    orderId: "PED-2931-014",
    purchaseDate: "2026-07-01",
    activityDate: "2026-07-05",
  },
  {
    id: "ref-15",
    customer: "Felipe Augusto Nascimento",
    product: "Tirolesa Radical",
    organizationId: "org-cerrado",
    orderStatus: "Cancelado",
    commissionStatus: "nao-gerada",
    purchaseValue: "R$ 670,00",
    commission: "R$ 67,00",
    origin: "link-geral",
    date: "2026-06-28",
    time: "14:15",
    commissionRule: "10% sobre o valor da venda",
    orderId: "PED-2931-015",
    purchaseDate: "2026-06-28",
    activityDate: "2026-07-03",
  },
];

// ---------------------------------------------------------------------------
// KPIs por período × organização (Home)
// FATO: Central de Vendas itens 1, 4, 6; Escopo 13.1
// ---------------------------------------------------------------------------

type KpiStore = Record<AfiliadoPeriod, Record<string, AfiliadoKpis>>;

export const affiliateKpis: KpiStore = {
  semana: {
    all: {
      indicacoesQtd: 34,
      indicacoesValor: "R$ 42.850",
      indicacoesPagas: 28,
      carrinhosQtd: 6,
      carrinhosValor: "R$ 7.190",
      comissaoRecebida: "R$ 3.420",
      comissaoReceber: "R$ 1.280",
    },
    "org-cerrado": {
      indicacoesQtd: 18,
      indicacoesValor: "R$ 23.460",
      indicacoesPagas: 15,
      carrinhosQtd: 3,
      carrinhosValor: "R$ 3.890",
      comissaoRecebida: "R$ 1.870",
      comissaoReceber: "R$ 720",
    },
    "org-vertaco": {
      indicacoesQtd: 10,
      indicacoesValor: "R$ 12.340",
      indicacoesPagas: 8,
      carrinhosQtd: 2,
      carrinhosValor: "R$ 2.120",
      comissaoRecebida: "R$ 990",
      comissaoReceber: "R$ 380",
    },
    "org-trilheiras": {
      indicacoesQtd: 6,
      indicacoesValor: "R$ 7.050",
      indicacoesPagas: 5,
      carrinhosQtd: 1,
      carrinhosValor: "R$ 1.180",
      comissaoRecebida: "R$ 560",
      comissaoReceber: "R$ 180",
    },
  },
  mes: {
    all: {
      indicacoesQtd: 145,
      indicacoesValor: "R$ 189.350",
      indicacoesPagas: 118,
      carrinhosQtd: 23,
      carrinhosValor: "R$ 28.750",
      comissaoRecebida: "R$ 8.450",
      comissaoReceber: "R$ 2.890",
    },
    "org-cerrado": {
      indicacoesQtd: 74,
      indicacoesValor: "R$ 98.200",
      indicacoesPagas: 61,
      carrinhosQtd: 11,
      carrinhosValor: "R$ 14.800",
      comissaoRecebida: "R$ 4.380",
      comissaoReceber: "R$ 1.530",
    },
    "org-vertaco": {
      indicacoesQtd: 43,
      indicacoesValor: "R$ 55.120",
      indicacoesPagas: 35,
      carrinhosQtd: 7,
      carrinhosValor: "R$ 8.450",
      comissaoRecebida: "R$ 2.480",
      comissaoReceber: "R$ 860",
    },
    "org-trilheiras": {
      indicacoesQtd: 28,
      indicacoesValor: "R$ 36.030",
      indicacoesPagas: 22,
      carrinhosQtd: 5,
      carrinhosValor: "R$ 5.500",
      comissaoRecebida: "R$ 1.590",
      comissaoReceber: "R$ 500",
    },
  },
  ano: {
    all: {
      indicacoesQtd: 1247,
      indicacoesValor: "R$ 1.623.100",
      indicacoesPagas: 1089,
      carrinhosQtd: 158,
      carrinhosValor: "R$ 205.400",
      comissaoRecebida: "R$ 97.860",
      comissaoReceber: "R$ 12.340",
    },
    "org-cerrado": {
      indicacoesQtd: 640,
      indicacoesValor: "R$ 837.200",
      indicacoesPagas: 562,
      carrinhosQtd: 78,
      carrinhosValor: "R$ 105.600",
      comissaoRecebida: "R$ 50.430",
      comissaoReceber: "R$ 6.400",
    },
    "org-vertaco": {
      indicacoesQtd: 378,
      indicacoesValor: "R$ 487.900",
      indicacoesPagas: 328,
      carrinhosQtd: 50,
      carrinhosValor: "R$ 62.800",
      comissaoRecebida: "R$ 29.480",
      comissaoReceber: "R$ 3.740",
    },
    "org-trilheiras": {
      indicacoesQtd: 229,
      indicacoesValor: "R$ 298.000",
      indicacoesPagas: 199,
      carrinhosQtd: 30,
      carrinhosValor: "R$ 37.000",
      comissaoRecebida: "R$ 17.950",
      comissaoReceber: "R$ 2.200",
    },
  },
};

// ---------------------------------------------------------------------------
// KPIs da página Indicações (5 totalizadores)
// ---------------------------------------------------------------------------

type IndicacoesKpiStore = Record<AfiliadoPeriod, Record<string, IndicacoesKpis>>;

export const indicacoesKpis: IndicacoesKpiStore = {
  semana: {
    all: {
      indicacoesOriginadasQtd: 34,
      indicacoesOriginadasValor: "R$ 42.850",
      vendasPagasQtd: 28,
      vendasPagasValor: "R$ 35.660",
      carrinhosAbandonadosQtd: 6,
      carrinhosAbandonadosValor: "R$ 7.190",
      viaCupomQtd: 8,
      viaCupomValor: "R$ 9.420",
      comissaoGerada: "R$ 4.700",
    },
    "org-cerrado": {
      indicacoesOriginadasQtd: 18,
      indicacoesOriginadasValor: "R$ 23.460",
      vendasPagasQtd: 15,
      vendasPagasValor: "R$ 19.570",
      carrinhosAbandonadosQtd: 3,
      carrinhosAbandonadosValor: "R$ 3.890",
      viaCupomQtd: 4,
      viaCupomValor: "R$ 5.120",
      comissaoGerada: "R$ 2.590",
    },
    "org-vertaco": {
      indicacoesOriginadasQtd: 10,
      indicacoesOriginadasValor: "R$ 12.340",
      vendasPagasQtd: 8,
      vendasPagasValor: "R$ 10.220",
      carrinhosAbandonadosQtd: 2,
      carrinhosAbandonadosValor: "R$ 2.120",
      viaCupomQtd: 3,
      viaCupomValor: "R$ 3.100",
      comissaoGerada: "R$ 1.370",
    },
    "org-trilheiras": {
      indicacoesOriginadasQtd: 6,
      indicacoesOriginadasValor: "R$ 7.050",
      vendasPagasQtd: 5,
      vendasPagasValor: "R$ 5.870",
      carrinhosAbandonadosQtd: 1,
      carrinhosAbandonadosValor: "R$ 1.180",
      viaCupomQtd: 1,
      viaCupomValor: "R$ 1.200",
      comissaoGerada: "R$ 740",
    },
  },
  mes: {
    all: {
      indicacoesOriginadasQtd: 145,
      indicacoesOriginadasValor: "R$ 189.350",
      vendasPagasQtd: 118,
      vendasPagasValor: "R$ 156.890",
      carrinhosAbandonadosQtd: 23,
      carrinhosAbandonadosValor: "R$ 28.750",
      viaCupomQtd: 31,
      viaCupomValor: "R$ 38.640",
      comissaoGerada: "R$ 11.340",
    },
    "org-cerrado": {
      indicacoesOriginadasQtd: 74,
      indicacoesOriginadasValor: "R$ 98.200",
      vendasPagasQtd: 61,
      vendasPagasValor: "R$ 81.400",
      carrinhosAbandonadosQtd: 11,
      carrinhosAbandonadosValor: "R$ 14.800",
      viaCupomQtd: 16,
      viaCupomValor: "R$ 20.100",
      comissaoGerada: "R$ 5.910",
    },
    "org-vertaco": {
      indicacoesOriginadasQtd: 43,
      indicacoesOriginadasValor: "R$ 55.120",
      vendasPagasQtd: 35,
      vendasPagasValor: "R$ 46.670",
      carrinhosAbandonadosQtd: 7,
      carrinhosAbandonadosValor: "R$ 8.450",
      viaCupomQtd: 9,
      viaCupomValor: "R$ 11.240",
      comissaoGerada: "R$ 3.340",
    },
    "org-trilheiras": {
      indicacoesOriginadasQtd: 28,
      indicacoesOriginadasValor: "R$ 36.030",
      vendasPagasQtd: 22,
      vendasPagasValor: "R$ 28.820",
      carrinhosAbandonadosQtd: 5,
      carrinhosAbandonadosValor: "R$ 5.500",
      viaCupomQtd: 6,
      viaCupomValor: "R$ 7.300",
      comissaoGerada: "R$ 2.090",
    },
  },
  ano: {
    all: {
      indicacoesOriginadasQtd: 1247,
      indicacoesOriginadasValor: "R$ 1.623.100",
      vendasPagasQtd: 1089,
      vendasPagasValor: "R$ 1.417.700",
      carrinhosAbandonadosQtd: 158,
      carrinhosAbandonadosValor: "R$ 205.400",
      viaCupomQtd: 267,
      viaCupomValor: "R$ 342.800",
      comissaoGerada: "R$ 110.200",
    },
    "org-cerrado": {
      indicacoesOriginadasQtd: 640,
      indicacoesOriginadasValor: "R$ 837.200",
      vendasPagasQtd: 562,
      vendasPagasValor: "R$ 731.600",
      carrinhosAbandonadosQtd: 78,
      carrinhosAbandonadosValor: "R$ 105.600",
      viaCupomQtd: 138,
      viaCupomValor: "R$ 178.200",
      comissaoGerada: "R$ 56.830",
    },
    "org-vertaco": {
      indicacoesOriginadasQtd: 378,
      indicacoesOriginadasValor: "R$ 487.900",
      vendasPagasQtd: 328,
      vendasPagasValor: "R$ 425.100",
      carrinhosAbandonadosQtd: 50,
      carrinhosAbandonadosValor: "R$ 62.800",
      viaCupomQtd: 79,
      viaCupomValor: "R$ 99.600",
      comissaoGerada: "R$ 33.220",
    },
    "org-trilheiras": {
      indicacoesOriginadasQtd: 229,
      indicacoesOriginadasValor: "R$ 298.000",
      vendasPagasQtd: 199,
      vendasPagasValor: "R$ 261.000",
      carrinhosAbandonadosQtd: 30,
      carrinhosAbandonadosValor: "R$ 37.000",
      viaCupomQtd: 50,
      viaCupomValor: "R$ 65.000",
      comissaoGerada: "R$ 20.150",
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getKpis(period: AfiliadoPeriod, orgId: string): AfiliadoKpis {
  const store = affiliateKpis[period];
  return (store[orgId] ?? store.all)!;
}

export function getIndicacoesKpis(period: AfiliadoPeriod, orgId: string): IndicacoesKpis {
  const store = indicacoesKpis[period];
  return (store[orgId] ?? store.all)!;
}

export function getFilteredReferrals(orgId: string): AfiliadoReferral[] {
  const base = orgId === "all" ? affiliateReferrals : affiliateReferrals.filter((r) => r.organizationId === orgId);
  return base.filter((r) => r.orderStatus === "Pago" || r.orderStatus === "Aguardando pagamento");
}

export function getStatusForTab(status: OrderStatus): IndicacoesTab {
  switch (status) {
    case "Pago": return "pagas";
    case "Aguardando pagamento":
    case "Cancelado": return "nao-pagas";
    case "Abandonado": return "carrinhos-abandonados";
  }
}

export function getFilteredIndicacoes(
  orgId: string,
  tab: IndicacoesTab,
  search?: string,
  originFilter?: ReferralOrigin | "all",
): AfiliadoReferral[] {
  let results = orgId === "all" ? affiliateReferrals : affiliateReferrals.filter((r) => r.organizationId === orgId);

  if (tab !== "todas") {
    results = results.filter((r) => getStatusForTab(r.orderStatus) === tab);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter((r) => r.customer.toLowerCase().includes(q) || r.product.toLowerCase().includes(q));
  }

  if (originFilter && originFilter !== "all") {
    results = results.filter((r) => r.origin === originFilter);
  }

  return results;
}

export function getTabCounts(orgId: string): Record<IndicacoesTab, number> {
  const all = orgId === "all" ? affiliateReferrals : affiliateReferrals.filter((r) => r.organizationId === orgId);
  return {
    todas: all.length,
    pagas: all.filter((r) => getStatusForTab(r.orderStatus) === "pagas").length,
    "nao-pagas": all.filter((r) => getStatusForTab(r.orderStatus) === "nao-pagas").length,
    "carrinhos-abandonados": all.filter((r) => getStatusForTab(r.orderStatus) === "carrinhos-abandonados").length,
  };
}

export function getAffiliateLink(orgId: string): string {
  if (orgId === "all") return affiliateGeneralLink;
  return affiliateOrgLinks[orgId] ?? affiliateGeneralLink;
}

export const originLabels: Record<ReferralOrigin, string> = {
  "link-geral": "Link geral",
  "link-org": "Link da org",
  "link-produto": "Link de produto",
  cupom: "Cupom",
};

export const indicacoesTabLabels: Record<IndicacoesTab, string> = {
  todas: "Todas",
  pagas: "Pagas",
  "nao-pagas": "Não pagas",
  "carrinhos-abandonados": "Carrinhos abandonados",
};

export const periodLabels: Record<AfiliadoPeriod, string> = {
  semana: "Semana",
  mes: "Mês",
  ano: "Ano",
};

export const ganhosTabLabels: Record<GanhosTab, string> = {
  todas: "Todas",
  pendentes: "Pendentes",
  quitadas: "Quitadas",
};

// ---------------------------------------------------------------------------
// Ganhos — saldo "a receber" (independe de período)
// ---------------------------------------------------------------------------

export const ganhosKpisSaldo: Record<string, string> = {
  all: "R$ 2.890",
  "org-cerrado": "R$ 1.530",
  "org-vertaco": "R$ 860",
  "org-trilheiras": "R$ 500",
};

// ---------------------------------------------------------------------------
// Ganhos — KPIs por período × org (recebida e gerada reagem ao período)
// ---------------------------------------------------------------------------

type GanhosKpiStore = Record<AfiliadoPeriod, Record<string, Omit<GanhosKpis, "comissaoAReceber">>>;

export const ganhosKpisStore: GanhosKpiStore = {
  semana: {
    all: { comissaoRecebida: "R$ 3.420", comissaoGerada: "R$ 4.700" },
    "org-cerrado": { comissaoRecebida: "R$ 1.870", comissaoGerada: "R$ 2.590" },
    "org-vertaco": { comissaoRecebida: "R$ 990", comissaoGerada: "R$ 1.370" },
    "org-trilheiras": { comissaoRecebida: "R$ 560", comissaoGerada: "R$ 740" },
  },
  mes: {
    all: { comissaoRecebida: "R$ 8.450", comissaoGerada: "R$ 11.340" },
    "org-cerrado": { comissaoRecebida: "R$ 4.380", comissaoGerada: "R$ 5.910" },
    "org-vertaco": { comissaoRecebida: "R$ 2.480", comissaoGerada: "R$ 3.340" },
    "org-trilheiras": { comissaoRecebida: "R$ 1.590", comissaoGerada: "R$ 2.090" },
  },
  ano: {
    all: { comissaoRecebida: "R$ 97.860", comissaoGerada: "R$ 110.200" },
    "org-cerrado": { comissaoRecebida: "R$ 50.430", comissaoGerada: "R$ 56.830" },
    "org-vertaco": { comissaoRecebida: "R$ 29.480", comissaoGerada: "R$ 33.220" },
    "org-trilheiras": { comissaoRecebida: "R$ 17.950", comissaoGerada: "R$ 20.150" },
  },
};

export function getGanhosKpis(period: AfiliadoPeriod, orgId: string): GanhosKpis {
  const store = ganhosKpisStore[period];
  const flow = (store[orgId] ?? store.all)!;
  const saldo = ganhosKpisSaldo[orgId] ?? ganhosKpisSaldo.all ?? "R$ 0";
  return { comissaoAReceber: saldo, ...flow };
}

// ---------------------------------------------------------------------------
// Ganhos — Breakdown por organização
// ---------------------------------------------------------------------------

type BreakdownStore = Record<AfiliadoPeriod, OrgBreakdown[]>;

export const orgBreakdownStore: BreakdownStore = {
  semana: [
    { organizationId: "org-cerrado", geradaNoPeriodo: "R$ 2.590", recebidaNoPeriodo: "R$ 1.870", aReceber: "R$ 1.530" },
    { organizationId: "org-vertaco", geradaNoPeriodo: "R$ 1.370", recebidaNoPeriodo: "R$ 990", aReceber: "R$ 860" },
    { organizationId: "org-trilheiras", geradaNoPeriodo: "R$ 740", recebidaNoPeriodo: "R$ 560", aReceber: "R$ 500" },
  ],
  mes: [
    { organizationId: "org-cerrado", geradaNoPeriodo: "R$ 5.910", recebidaNoPeriodo: "R$ 4.380", aReceber: "R$ 1.530" },
    { organizationId: "org-vertaco", geradaNoPeriodo: "R$ 3.340", recebidaNoPeriodo: "R$ 2.480", aReceber: "R$ 860" },
    { organizationId: "org-trilheiras", geradaNoPeriodo: "R$ 2.090", recebidaNoPeriodo: "R$ 1.590", aReceber: "R$ 500" },
  ],
  ano: [
    { organizationId: "org-cerrado", geradaNoPeriodo: "R$ 56.830", recebidaNoPeriodo: "R$ 50.430", aReceber: "R$ 1.530" },
    { organizationId: "org-vertaco", geradaNoPeriodo: "R$ 33.220", recebidaNoPeriodo: "R$ 29.480", aReceber: "R$ 860" },
    { organizationId: "org-trilheiras", geradaNoPeriodo: "R$ 20.150", recebidaNoPeriodo: "R$ 17.950", aReceber: "R$ 500" },
  ],
};

export function getOrgBreakdown(period: AfiliadoPeriod): OrgBreakdown[] {
  return orgBreakdownStore[period];
}

// ---------------------------------------------------------------------------
// Ganhos — Extrato de comissões (lançamentos)
// ---------------------------------------------------------------------------

export const comissaoLancamentos: ComissaoLancamento[] = [
  { id: "lnc-1", dataGeracao: "2026-07-05", organizationId: "org-cerrado", product: "Trilha Pico do Itambé", referralId: "ref-1", customerName: "João Pedro da Silva Oliveira", valor: "R$ 568,00", status: "quitada", dataQuitacao: "2026-07-06", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-2", dataGeracao: "2026-07-04", organizationId: "org-vertaco", product: "Rapel Cachoeira", referralId: "ref-2", customerName: "Maria Eduarda Santos Pereira", valor: "R$ 189,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-3", dataGeracao: "2026-07-03", organizationId: "org-trilheiras", product: "Passeio de Barco", referralId: "ref-3", customerName: "Carlos Eduardo Ferreira Lima", valor: "R$ 325,00", status: "quitada", dataQuitacao: "2026-07-05", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-4", dataGeracao: "2026-07-02", organizationId: "org-cerrado", product: "Mergulho Noturno", referralId: "ref-4", customerName: "Juliana Aparecida de Lima", valor: "R$ 245,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-5", dataGeracao: "2026-07-01", organizationId: "org-vertaco", product: "Trilha Cachoeira Grande", referralId: "ref-5", customerName: "Amanda Cristina Miranda Souza", valor: "R$ 412,00", status: "quitada", dataQuitacao: "2026-07-03", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-6", dataGeracao: "2026-06-30", organizationId: "org-cerrado", product: "Tirolesa Radical", referralId: "ref-6", customerName: "Pedro Henrique Barbosa Costa", valor: "R$ 89,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-7", dataGeracao: "2026-06-29", organizationId: "org-trilheiras", product: "Canionismo Serra Geral", referralId: "ref-7", customerName: "Amauri dos Santos Lopes", valor: "R$ 634,00", status: "quitada", dataQuitacao: "2026-07-01", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-8", dataGeracao: "2026-06-28", organizationId: "org-cerrado", product: "Escalada Indoor", referralId: "ref-8", customerName: "Fernanda Beatriz Costa Almeida", valor: "R$ 123,00", status: "quitada", dataQuitacao: "2026-06-30", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-9", dataGeracao: "2026-06-27", organizationId: "org-vertaco", product: "Stand-Up Paddle", referralId: "ref-9", customerName: "Ricardo Augusto Alves Monteiro", valor: "R$ 78,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-10", dataGeracao: "2026-07-06", organizationId: "org-cerrado", product: "Trilha Pico do Itambé", referralId: "ref-10", customerName: "Luciana Martins de Oliveira", valor: "R$ 234,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-11", dataGeracao: "2026-06-28", organizationId: "org-cerrado", product: "Tirolesa Radical", referralId: "ref-15", customerName: "Felipe Augusto Nascimento", valor: "R$ 67,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
  { id: "lnc-12", dataGeracao: "2026-07-05", organizationId: "org-vertaco", product: "Rapel Cachoeira", referralId: "ref-11", customerName: "Thiago Rezende Souza", valor: "R$ 156,00", status: "a-receber", regraComissao: "10% sobre o valor da venda" },
];

export function getFilteredLancamentos(
  orgId: string,
  tab: GanhosTab,
  search?: string,
): ComissaoLancamento[] {
  let results = orgId === "all" ? comissaoLancamentos : comissaoLancamentos.filter((l) => l.organizationId === orgId);

  if (tab === "pendentes") results = results.filter((l) => l.status === "a-receber" || l.status === "nao-gerada");
  else if (tab === "quitadas") results = results.filter((l) => l.status === "quitada");

  if (search) {
    const q = search.toLowerCase();
    results = results.filter((l) => l.customerName.toLowerCase().includes(q) || l.product.toLowerCase().includes(q));
  }

  return results;
}

export function getLancamentoTabCounts(orgId: string): Record<GanhosTab, number> {
  const all = orgId === "all" ? comissaoLancamentos : comissaoLancamentos.filter((l) => l.organizationId === orgId);
  return {
    todas: all.length,
    pendentes: all.filter((l) => l.status === "a-receber" || l.status === "nao-gerada").length,
    quitadas: all.filter((l) => l.status === "quitada").length,
  };
}

// ---------------------------------------------------------------------------
// Dados bancários mock (legado, mantido para compatibilidade)
// ---------------------------------------------------------------------------

export const dadosBancarios = {
  banco: "Itaú",
  codigoBanco: "341",
  agencia: "****-2",
  conta: "*****-8",
  tipo: "Conta Corrente",
  titular: "Katiely Pinheiro",
};

// ---------------------------------------------------------------------------
// Formas de recebimento — destinos e vínculos por afiliação
// FATO: multivalorado (Cristiano, 08/07)
// ---------------------------------------------------------------------------

export interface ReceivingDestination {
  id: string;
  apelido: string;
  tipoDestino: "Conta bancária";
  banco: string;
  codigoBanco: string;
  agencia: string;
  agenciaMascarada: string;
  conta: string;
  contaMascarada: string;
  tipoConta: "Conta corrente" | "Conta poupança" | "Conta pagamento";
  titular: string;
  documentoTitular: string;
  documentoTitularMascarado: string;
  tipoDocumento: "CPF" | "CNPJ" | "Passaporte";
  padrao: boolean;
}

export type FormaRecebimento = "Split de pagamento" | "Transferência bancária" | "Dinheiro";

export interface AffiliationReceiving {
  organizationId: string;
  forma: FormaRecebimento;
  destinoId: string | null;
}

export const receivingDestinations: ReceivingDestination[] = [
  {
    id: "dest-1",
    apelido: "Conta principal",
    tipoDestino: "Conta bancária",
    banco: "Itaú",
    codigoBanco: "341",
    agencia: "0932",
    agenciaMascarada: "****-2",
    conta: "12345-8",
    contaMascarada: "*****-8",
    tipoConta: "Conta corrente",
    titular: "Katiely Pinheiro",
    documentoTitular: "123.456.789-90",
    documentoTitularMascarado: "***.***.***-90",
    tipoDocumento: "CPF",
    padrao: true,
  },
  {
    id: "dest-2",
    apelido: "Conta da empresa",
    tipoDestino: "Conta bancária",
    banco: "Nubank",
    codigoBanco: "260",
    agencia: "0001",
    agenciaMascarada: "****-1",
    conta: "98765-3",
    contaMascarada: "*****-3",
    tipoConta: "Conta pagamento",
    titular: "KP Aventuras LTDA",
    documentoTitular: "12.345.678/0001-90",
    documentoTitularMascarado: "**.***.****/****-90",
    tipoDocumento: "CNPJ",
    padrao: false,
  },
];

export const affiliationReceivings: AffiliationReceiving[] = [
  { organizationId: "org-cerrado", forma: "Split de pagamento", destinoId: "dest-1" },
  { organizationId: "org-vertaco", forma: "Transferência bancária", destinoId: "dest-1" },
  { organizationId: "org-trilheiras", forma: "Dinheiro", destinoId: null },
];

// ---------------------------------------------------------------------------
// Produtos e Links — escopo por organização
// ---------------------------------------------------------------------------

export const affiliateOrgScopes: AffiliateOrgScope[] = [
  {
    organizationId: "org-cerrado",
    scopeType: "todos",
    orgLink: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado",
    products: [
      { id: "prod-c1", name: "Trilha Pico do Itambé", organizationId: "org-cerrado", comissao: "10%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/trilha-pico-itambe", vendasNoPeriodo: 18 },
      { id: "prod-c2", name: "Mergulho Noturno", organizationId: "org-cerrado", comissao: "10%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/mergulho-noturno", vendasNoPeriodo: 12 },
      { id: "prod-c3", name: "Tirolesa Radical", organizationId: "org-cerrado", comissao: "R$ 45", comissaoOrigem: "produto", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/tirolesa-radical", vendasNoPeriodo: 8 },
      { id: "prod-c4", name: "Escalada Indoor", organizationId: "org-cerrado", comissao: "10%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/escalada-indoor", vendasNoPeriodo: 5 },
      { id: "prod-c5", name: "Camping Estrelado", organizationId: "org-cerrado", comissao: "10%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/camping-estrelado", vendasNoPeriodo: 0, isNew: true },
      { id: "prod-c6", name: "Rafting Rio das Velhas", organizationId: "org-cerrado", comissao: "10%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/rafting-rio-velhas", vendasNoPeriodo: 0, indisponivel: true },
    ],
    availableToRequest: [],
  },
  {
    organizationId: "org-vertaco",
    scopeType: "especificos",
    orgLink: "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco",
    products: [
      { id: "prod-v1", name: "Rapel Cachoeira", organizationId: "org-vertaco", comissao: "8%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco/rapel-cachoeira", vendasNoPeriodo: 14 },
      { id: "prod-v2", name: "Trilha Cachoeira Grande", organizationId: "org-vertaco", comissao: "R$ 290", comissaoOrigem: "produto", link: "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco/trilha-cachoeira-grande", vendasNoPeriodo: 9 },
      { id: "prod-v3", name: "Stand-Up Paddle", organizationId: "org-vertaco", comissao: "8%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco/stand-up-paddle", vendasNoPeriodo: 6 },
      { id: "prod-v4", name: "Caiaque Aventura", organizationId: "org-vertaco", comissao: "8%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/vertaco/caiaque-aventura", vendasNoPeriodo: 3 },
    ],
    availableToRequest: [],
  },
  {
    organizationId: "org-trilheiras",
    scopeType: "especificos",
    orgLink: "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras",
    products: [
      { id: "prod-t1", name: "Passeio de Barco", organizationId: "org-trilheiras", comissao: "12%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras/passeio-barco", vendasNoPeriodo: 7 },
      { id: "prod-t2", name: "Canionismo Serra Geral", organizationId: "org-trilheiras", comissao: "R$ 180", comissaoOrigem: "produto", link: "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras/canionismo-serra-geral", vendasNoPeriodo: 4 },
      { id: "prod-t3", name: "Caminhada Histórica", organizationId: "org-trilheiras", comissao: "12%", comissaoOrigem: "afiliação", link: "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras/caminhada-historica", vendasNoPeriodo: 2 },
    ],
    availableToRequest: [
      { id: "req-v1", name: "Boia Cross Radical", organizationId: "org-trilheiras" },
      { id: "req-v2", name: "Arvorismo Circuito Completo", organizationId: "org-trilheiras" },
      { id: "req-v3", name: "Parapente Tandem", organizationId: "org-trilheiras", solicitado: true },
      { id: "req-t1", name: "Trilha do Pôr do Sol", organizationId: "org-trilheiras" },
      { id: "req-t2", name: "Espeleologia Caverna Real", organizationId: "org-trilheiras" },
    ],
  },
];

export function getAffiliateScopes(orgId?: string): AffiliateOrgScope[] {
  if (!orgId || orgId === "all") return affiliateOrgScopes;
  return affiliateOrgScopes.filter((s) => s.organizationId === orgId);
}

// ---------------------------------------------------------------------------
// Configurações — perfil e afiliações
// ---------------------------------------------------------------------------

export interface AffiliateProfileData {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: "CPF" | "CNPJ" | "Passaporte";
}

export interface AffiliateAffiliation {
  organizationId: string;
  status: "Ativa" | "Pendente" | "Inativa";
  since: string;
}

export const affiliateProfileData: AffiliateProfileData = {
  name: "Katiely Pinheiro",
  email: "katiely@retrilhar.com.br",
  phone: "(31) 99876-5432",
  document: "***.***.***-90",
  documentType: "CPF",
};

export const affiliateAffiliations: AffiliateAffiliation[] = [
  { organizationId: "org-cerrado", status: "Ativa", since: "2025-03-15" },
  { organizationId: "org-vertaco", status: "Ativa", since: "2025-06-01" },
  { organizationId: "org-trilheiras", status: "Ativa", since: "2025-09-10" },
];

export const notificationPreferences = {
  produtoNovo: true,
  comissaoQuitada: true,
  conviteVinculo: true,
};

// ---------------------------------------------------------------------------
// FAQ — dúvidas frequentes
// ---------------------------------------------------------------------------

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const affiliateFaqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Como funciona o programa de afiliados?",
    answer:
      "O programa de afiliados permite que você divulgue os produtos das organizações parceiras e receba comissões sobre as vendas realizadas através dos seus links ou códigos. Basta se cadastrar, ser aprovado pela organização e começar a compartilhar.",
  },
  {
    id: "faq-2",
    question: "Quando recebo minhas comissões?",
    answer:
      "O prazo de pagamento das comissões varia conforme a forma de recebimento configurada. No split de pagamento, a comissão é liquidada na hora da venda. Para transferência bancária, o repasse é feito pela organização conforme o ciclo acordado.",
  },
  {
    id: "faq-3",
    question: "Posso me afiliar a mais de uma organização?",
    answer:
      "Sim! Você pode se vincular a múltiplas organizações simultaneamente. Cada vínculo é independente e possui seus próprios produtos, comissões e configurações.",
  },
  {
    id: "faq-4",
    question: "Como altero meus dados bancários?",
    answer:
      "Acesse a seção 'Formas de recebimento' nas configurações. Lá você pode adicionar, editar ou remover destinos de pagamento. É possível ter mais de um destino cadastrado e definir um como padrão.",
  },
  {
    id: "faq-5",
    question: "O que acontece se meu link expirar?",
    answer:
      "Os links de afiliado não expiram enquanto seu vínculo com a organização estiver ativo. Caso o vínculo seja encerrado, os links deixam de rastrear novas vendas, mas comissões pendentes continuam válidas.",
  },
  {
    id: "faq-6",
    question: "Como acompanho minhas indicações e ganhos?",
    answer:
      "No painel principal do afiliado, você tem acesso ao resumo de indicações, ganhos e KPIs. Use os filtros de período para visualizar dados específicos e acompanhe o status de cada comissão na aba de ganhos.",
  },
];
