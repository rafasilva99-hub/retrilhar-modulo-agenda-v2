// ---------------------------------------------------------------------------
// Mock data — Painel do Afiliado (v2)
// Fonte de verdade do protótipo: PRD Afiliados, Central de Vendas, Escopo.
// ---------------------------------------------------------------------------

export type OrderStatus = "Pago" | "Pendente";
export type CommissionStatus = "pendente" | "quitado";
export type ReferralOrigin = "link-geral" | "link-org" | "link-produto" | "cupom";
export type AfiliadoPeriod = "semana" | "mes" | "ano";

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
// Indicações (referrals) — dados variados conforme seção 5.2f do refinamento
// ---------------------------------------------------------------------------

export const affiliateReferrals: AfiliadoReferral[] = [
  {
    id: "ref-1",
    customer: "João Pedro da Silva Oliveira",
    product: "Trilha Pico do Itambé",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "quitado",
    purchaseValue: "R$ 5.679,99",
    commission: "R$ 568,00",
    origin: "link-produto",
    date: "2026-07-05",
  },
  {
    id: "ref-2",
    customer: "Maria Eduarda Santos Pereira",
    product: "Rapel Cachoeira",
    organizationId: "org-vertaco",
    orderStatus: "Pendente",
    commissionStatus: "pendente",
    purchaseValue: "R$ 1.890,00",
    commission: "R$ 189,00",
    origin: "cupom",
    date: "2026-07-04",
  },
  {
    id: "ref-3",
    customer: "Carlos Eduardo Ferreira Lima",
    product: "Passeio de Barco",
    organizationId: "org-trilheiras",
    orderStatus: "Pago",
    commissionStatus: "quitado",
    purchaseValue: "R$ 3.250,00",
    commission: "R$ 325,00",
    origin: "link-org",
    date: "2026-07-03",
  },
  {
    id: "ref-4",
    customer: "Juliana Aparecida de Lima",
    product: "Mergulho Noturno",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "pendente",
    purchaseValue: "R$ 2.450,00",
    commission: "R$ 245,00",
    origin: "link-geral",
    date: "2026-07-02",
  },
  {
    id: "ref-5",
    customer: "Amanda Cristina Miranda Souza",
    product: "Trilha Cachoeira Grande",
    organizationId: "org-vertaco",
    orderStatus: "Pago",
    commissionStatus: "quitado",
    purchaseValue: "R$ 4.120,00",
    commission: "R$ 412,00",
    origin: "link-produto",
    date: "2026-07-01",
  },
  {
    id: "ref-6",
    customer: "Pedro Henrique Barbosa Costa",
    product: "Tirolesa Radical",
    organizationId: "org-cerrado",
    orderStatus: "Pendente",
    commissionStatus: "pendente",
    purchaseValue: "R$ 890,00",
    commission: "R$ 89,00",
    origin: "cupom",
    date: "2026-06-30",
  },
  {
    id: "ref-7",
    customer: "Amauri dos Santos Lopes",
    product: "Canionismo Serra Geral",
    organizationId: "org-trilheiras",
    orderStatus: "Pago",
    commissionStatus: "quitado",
    purchaseValue: "R$ 6.340,00",
    commission: "R$ 634,00",
    origin: "link-org",
    date: "2026-06-29",
  },
  {
    id: "ref-8",
    customer: "Fernanda Beatriz Costa Almeida",
    product: "Escalada Indoor",
    organizationId: "org-cerrado",
    orderStatus: "Pago",
    commissionStatus: "quitado",
    purchaseValue: "R$ 1.230,00",
    commission: "R$ 123,00",
    origin: "link-produto",
    date: "2026-06-28",
  },
  {
    id: "ref-9",
    customer: "Ricardo Augusto Alves Monteiro",
    product: "Stand-Up Paddle",
    organizationId: "org-vertaco",
    orderStatus: "Pago",
    commissionStatus: "pendente",
    purchaseValue: "R$ 780,00",
    commission: "R$ 78,00",
    origin: "link-geral",
    date: "2026-06-27",
  },
];

// ---------------------------------------------------------------------------
// KPIs por período × organização
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
// Helpers
// ---------------------------------------------------------------------------

export function getKpis(period: AfiliadoPeriod, orgId: string): AfiliadoKpis {
  const store = affiliateKpis[period];
  // Both orgId and "all" fallback are guaranteed to exist in the mock data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (store[orgId] ?? store.all)!;
}

export function getFilteredReferrals(orgId: string): AfiliadoReferral[] {
  if (orgId === "all") return affiliateReferrals;
  return affiliateReferrals.filter((r) => r.organizationId === orgId);
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

export const periodLabels: Record<AfiliadoPeriod, string> = {
  semana: "Semana",
  mes: "Mês",
  ano: "Ano",
};
