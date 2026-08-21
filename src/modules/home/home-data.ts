import {
  Calendar03Icon,
  CalendarFavorite01Icon,
  CalendarRemove01Icon,
  ChampionIcon,
  CreditCardIcon,
  InformationCircleIcon,
  Invoice02Icon,
  MoneyBag02Icon,
  ReceiptDollarIcon,
  ShoppingBag01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type HomeTrendDirection = "up" | "down";

export type HomeKpi = {
  readonly title: string;
  readonly subtitle: string;
  readonly value: string;
  readonly trend: string;
  readonly trendLabel: string;
  readonly direction: HomeTrendDirection;
  readonly icon: IconSvgElement;
};

export type HomePaymentMethod = {
  readonly name: string;
  readonly share: string;
  readonly amount: string;
  readonly colorClassName: string;
  readonly icon: IconSvgElement;
};

export type HomeReceivableMonth = {
  readonly label: string;
  readonly previsto: number;
  readonly recebido: number;
};

export type HomeSummaryMetric = {
  readonly label: string;
  readonly value: string;
  readonly suffix: string;
  readonly helper: string;
};

export type HomeRecentSale = {
  readonly customer: string;
  readonly status: "Pago" | "Pendente" | "Processando";
  readonly product: string;
  readonly amount: string;
  readonly time: string;
};

export type HomeTopProduct = {
  readonly name: string;
  readonly sales: string;
  readonly revenue: string;
  readonly progress: number;
};

export const homeKpis: readonly HomeKpi[] = [
  {
    title: "Faturamento",
    subtitle: "Últimos 30 dias",
    value: "R$ 48.574",
    trend: "+12%",
    trendLabel: "vs. mês anterior",
    direction: "up",
    icon: MoneyBag02Icon,
  },
  {
    title: "Ticket médio",
    subtitle: "Por venda",
    value: "R$ 342",
    trend: "+4%",
    trendLabel: "vs. mês anterior",
    direction: "up",
    icon: ReceiptDollarIcon,
  },
  {
    title: "Taxa de Ocupação",
    subtitle: "Próximos 30 dias",
    value: "78%",
    trend: "+8%",
    trendLabel: "vs. mês anterior",
    direction: "up",
    icon: CalendarFavorite01Icon,
  },
  {
    title: "Taxa de Cancelamento",
    subtitle: "Últimos 30 dias",
    value: "2,4%",
    trend: "+8%",
    trendLabel: "vs. mês anterior",
    direction: "down",
    icon: CalendarRemove01Icon,
  },
] as const;

export const paymentMethods: readonly HomePaymentMethod[] = [
  {
    name: "Cartão",
    share: "61.5% do total",
    amount: "R$ 175 mil",
    colorClassName: "bg-[#0b5ed7]",
    icon: CreditCardIcon,
  },
  {
    name: "PIX",
    share: "38.5% do total",
    amount: "R$ 110 mil",
    colorClassName: "bg-[#78b7ff]",
    icon: Wallet02Icon,
  },
] as const;

export const receivableMonths: readonly HomeReceivableMonth[] = [
  { label: "Mar", previsto: 64, recebido: 56 },
  { label: "Abr", previsto: 78, recebido: 73 },
  { label: "Mai", previsto: 58, recebido: 54 },
  { label: "Jun", previsto: 86, recebido: 81 },
  { label: "Jul", previsto: 70, recebido: 66 },
  { label: "Ago", previsto: 52, recebido: 47 },
] as const;

export const receivableSummary: readonly HomeSummaryMetric[] = [
  { label: "Previsto", value: "R$ 308 mil", suffix: "total", helper: "R$ 51.3 mil/mês" },
  { label: "Recebido", value: "R$300 mil", suffix: "total", helper: "97.4% realizado" },
  { label: "Pendente", value: "R$ 8 mil", suffix: "restante", helper: "97.4% a receber" },
  { label: "Atraso Médio", value: "8", suffix: "dias", helper: "+8% vs mês anterior" },
] as const;

export const opportunitySummary: readonly HomeSummaryMetric[] = [
  { label: "Possível", value: "R$ 1286 mil", suffix: "total", helper: "R$ 321.5 mil/semana" },
  { label: "Vendido", value: "R$ 986 mil", suffix: "total", helper: "76.6% conversão" },
  { label: "Saldo", value: "R$ 301 mil", suffix: "perdido", helper: "23.4% não convertido" },
  {
    label: "Ticket Médio",
    value: "R$ 246.4 mil",
    suffix: "por semana",
    helper: "+8% vs mês anterior",
  },
] as const;

export const recentSales: readonly HomeRecentSale[] = [
  {
    customer: "João Silva",
    status: "Pago",
    product: "Trilha Pico do Itambé",
    amount: "R$ 290",
    time: "há 5 min.",
  },
  {
    customer: "Maria Santos",
    status: "Pendente",
    product: "Rapel Cachoeira",
    amount: "R$ 1.600",
    time: "há 18 min.",
  },
  {
    customer: "João Silva",
    status: "Pago",
    product: "Mergulho Noturno",
    amount: "R$ 140",
    time: "há 25 min.",
  },
  {
    customer: "Carlos Ferreira",
    status: "Processando",
    product: "Passeio de Barco",
    amount: "R$ 320",
    time: "há 31 min.",
  },
  {
    customer: "Juliana Lima",
    status: "Pago",
    product: "Trilha Cachoeira Grande",
    amount: "R$ 180",
    time: "há 45 min.",
  },
] as const;

export const topProducts: readonly HomeTopProduct[] = [
  { name: "Trilha Pico do Itambé", sales: "45 vendas", revenue: "R$ 13.1 mil", progress: 100 },
  { name: "Casa Verde Weekend", sales: "38 vendas", revenue: "R$ 60.8 mil", progress: 84 },
  { name: "Rapel Cachoeira Alta", sales: "32 vendas", revenue: "R$ 4.5 mil", progress: 71 },
  { name: "Mergulho Noturno", sales: "25 vendas", revenue: "R$ 8.0 mil", progress: 56 },
  { name: "Passeio de Barco", sales: "16 vendas", revenue: "R$ 3.2 mil", progress: 36 },
] as const;

export const homeHeaderIcons = {
  calendar: Calendar03Icon,
  champion: ChampionIcon,
  information: InformationCircleIcon,
  invoice: Invoice02Icon,
  shoppingBag: ShoppingBag01Icon,
  wallet: Wallet02Icon,
} as const;
