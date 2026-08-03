import {
  File02Icon,
  Home01Icon,
  Money01Icon,
  PackageIcon,
  UserGroupIcon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons";

import type { AppPage, ShellNavItem } from "@/components/layout/types";

export * from "./convite";
export * from "./ficha";
export * from "./lista";
export * from "./motivos";
export * from "./pendencias";
export * from "./produtos";
export * from "./produtos-vinculados";
export * from "./resumo";
export * from "./solicitacoes";
export * from "./solicitacoes-autorizacao";
export * from "./top-afiliados";
export * from "./venda-detalhe";
export * from "./vendas";

export type GestorAffiliateSection =
  | "visao"
  | "central"
  | "afiliados"
  | "propostas"
  | "solicitacoes"
  | "pagamentos"
  | "termo";

export type GestorAffiliateStatus = "Ativo" | "Inativo" | "Desativado";
export type GestorProposalStatus = "Pendente" | "Contraproposta" | "Aceita" | "Rejeitada";
export type GestorPaymentStatus = "a-pagar" | "auto" | "pago";

export interface GestorAffiliate {
  id: string;
  name: string;
  code: string;
  origin: string;
  products: string;
  sales: number;
  generated: string;
  payable: string;
  receiving: "Split de pagamento" | "Transferência bancária" | "Dinheiro";
  status: GestorAffiliateStatus;
  acceptedTerm: string;
}

export interface GestorProposal {
  id: string;
  name: string;
  channel: string;
  product: string;
  commission: string;
  status: GestorProposalStatus;
  direction: "recebida" | "enviada";
  updatedAt: string;
  termAccepted: boolean;
}

export interface GestorProductRequest {
  id: string;
  affiliate: string;
  code: string;
  product: string;
  requestedAt: string;
  status: "Pendente" | "Aprovada" | "Recusada";
}

export interface GestorPayment {
  id: string;
  affiliate: string;
  code: string;
  reference: string;
  value: string;
  method: GestorAffiliate["receiving"];
  status: GestorPaymentStatus;
  paidAt?: string;
}

interface GestorNavItem {
  label: string;
  section: GestorAffiliateSection;
  page: AppPage;
  badge?: number;
}

export const gestorAffiliateSubnav: readonly GestorNavItem[] = [
  { label: "Visão geral", section: "visao", page: "gestorAfiliados" },
  { label: "Central de filiação", section: "central", page: "gestorAfiliadosCentral" },
  { label: "Afiliados", section: "afiliados", page: "gestorAfiliadosLista" },
  { label: "Propostas", section: "propostas", page: "gestorAfiliadosPropostas", badge: 2 },
  {
    label: "Solicitações",
    section: "solicitacoes",
    page: "gestorAfiliadosSolicitacoes",
    badge: 2,
  },
  { label: "Pagamentos", section: "pagamentos", page: "gestorAfiliadosPagamentos", badge: 2 },
  { label: "Termo", section: "termo", page: "gestorAfiliadosTermo" },
];

export const gestorAffiliateNavItems: ShellNavItem[] = [
  { title: "Visão geral", page: "gestorAfiliados", icon: Home01Icon },
  { title: "Central de filiação", page: "gestorAfiliadosCentral", icon: UserGroupIcon },
  { title: "Afiliados", page: "gestorAfiliadosLista", icon: UserStar01Icon },
  { title: "Propostas", page: "gestorAfiliadosPropostas", icon: File02Icon, badge: 2 },
  { title: "Solicitações", page: "gestorAfiliadosSolicitacoes", icon: PackageIcon, badge: 2 },
  { title: "Pagamentos", page: "gestorAfiliadosPagamentos", icon: Money01Icon, badge: 2 },
  { title: "Termo", page: "gestorAfiliadosTermo", icon: UserGroupIcon },
];

export const gestorAffiliates: readonly GestorAffiliate[] = [
  {
    id: "ana",
    name: "Ana Beatriz Ramos",
    code: "ANA-4510",
    origin: "Instagram",
    products: "Todos os produtos",
    sales: 18,
    generated: "R$ 4.860,00",
    payable: "R$ 1.120,00",
    receiving: "Transferência bancária",
    status: "Ativo",
    acceptedTerm: "v1.4 em 18/07/2026",
  },
  {
    id: "rafael",
    name: "Rafael Duarte",
    code: "RAF-2031",
    origin: "Guia credenciado",
    products: "Produtos específicos",
    sales: 11,
    generated: "R$ 2.740,00",
    payable: "R$ 640,00",
    receiving: "Split de pagamento",
    status: "Ativo",
    acceptedTerm: "v1.4 em 12/07/2026",
  },
  {
    id: "carla",
    name: "Carla Menezes",
    code: "CAR-8832",
    origin: "Blog",
    products: "Produtos específicos",
    sales: 4,
    generated: "R$ 820,00",
    payable: "R$ 0,00",
    receiving: "Dinheiro",
    status: "Inativo",
    acceptedTerm: "v1.3 em 02/06/2026",
  },
];

export const gestorProposals: readonly GestorProposal[] = [
  {
    id: "prop-ana",
    name: "Ana Beatriz Ramos",
    channel: "Instagram",
    product: "Trilha Cachoeira Grande",
    commission: "12%",
    status: "Contraproposta",
    direction: "recebida",
    updatedAt: "Hoje, 10:32",
    termAccepted: true,
  },
  {
    id: "prop-carla",
    name: "Carla Menezes",
    channel: "Blog",
    product: "Passeio de Barco",
    commission: "10%",
    status: "Pendente",
    direction: "enviada",
    updatedAt: "Ontem, 16:15",
    termAccepted: false,
  },
];

export const gestorProductRequests: readonly GestorProductRequest[] = [
  {
    id: "req-1",
    affiliate: "Rafael Duarte",
    code: "RAF-2031",
    product: "Rapel Cachoeira",
    requestedAt: "Hoje",
    status: "Pendente",
  },
  {
    id: "req-2",
    affiliate: "Ana Beatriz Ramos",
    code: "ANA-4510",
    product: "Canionismo Serra Geral",
    requestedAt: "Ontem",
    status: "Pendente",
  },
];

export const gestorPayments: readonly GestorPayment[] = [
  {
    id: "pay-1",
    affiliate: "Ana Beatriz Ramos",
    code: "ANA-4510",
    reference: "Comissões julho/2026",
    value: "R$ 1.120,00",
    method: "Transferência bancária",
    status: "a-pagar",
  },
  {
    id: "pay-2",
    affiliate: "Rafael Duarte",
    code: "RAF-2031",
    reference: "Venda PED-2931-104",
    value: "R$ 340,00",
    method: "Split de pagamento",
    status: "auto",
  },
  {
    id: "pay-3",
    affiliate: "Carla Menezes",
    code: "CAR-8832",
    reference: "Comissões junho/2026",
    value: "R$ 280,00",
    method: "Dinheiro",
    status: "pago",
    paidAt: "05/07/2026",
  },
];

export const gestorTerm = {
  version: "v1.4",
  updatedAt: "18/07/2026",
  customized: true,
  text: "O afiliado se compromete a divulgar os produtos da organização com informações corretas, respeitar as políticas comerciais vigentes e aceitar que comissões sejam calculadas somente sobre vendas confirmadas.",
};
