import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  ArrowUp01Icon,
  FilterAddIcon,
  InformationCircleIcon,
  MoneyBag02Icon,
  MoreHorizontalSquare01Icon,
  PlusSignCircleIcon,
  ReceiptDollarIcon,
  Search01Icon,
  ShoppingCartRemove01Icon,
  TargetDollarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type OrderStatus = "Pago" | "Cancelado" | "Pendente";

interface SalesMetric {
  title: string;
  subtitle: string;
  value: string;
  detail: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: IconSvgElement;
}

interface SalesOrder {
  id: string;
  date: string;
  customer: string;
  items: string;
  agent: string;
  agentRole?: string;
  channel: string;
  paymentMethod: string;
  paymentDetail?: string;
  value: string;
  status: OrderStatus;
}

const salesMetrics: SalesMetric[] = [
  {
    title: "Total em Vendas",
    subtitle: "Últimos 30 dias",
    value: "R$ 58.400",
    detail: "(2.500 vendas)",
    trend: "+15%",
    trendDirection: "up",
    icon: MoneyBag02Icon,
  },
  {
    title: "Taxa de conversão",
    subtitle: "Visitantes → Vendas",
    value: "68,5%",
    detail: "",
    trend: "+3,2%",
    trendDirection: "up",
    icon: TargetDollarIcon,
  },
  {
    title: "Ticket médio",
    subtitle: "Por venda",
    value: "R$ 307",
    detail: "",
    trend: "+4%",
    trendDirection: "up",
    icon: ReceiptDollarIcon,
  },
  {
    title: "Carrinhos abandonados",
    subtitle: "Taxa de abandono",
    value: "31,5%",
    detail: "",
    trend: "-0,8%",
    trendDirection: "down",
    icon: ShoppingCartRemove01Icon,
  },
];

const salesOrders: SalesOrder[] = [
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "João Silva",
    items: "4 itens",
    agent: "Luciano Andrade",
    agentRole: "Vendedor",
    channel: "Site",
    paymentMethod: "PIX",
    value: "R$ 10.923,59",
    status: "Pago",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Alberto Gonçalves",
    items: "4 itens",
    agent: "Sem agente",
    channel: "Site",
    paymentMethod: "Cartão (Crédito)",
    paymentDetail: "Parcelado em 2x",
    value: "R$ 450",
    status: "Cancelado",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Luciana Almeida",
    items: "4 itens",
    agent: "André Pena",
    agentRole: "Vendedor",
    channel: "Balcão",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Alberto Fonseca",
    items: "4 itens",
    agent: "Sem agente",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Augusto Dutra",
    items: "4 itens",
    agent: "Sem agente",
    channel: "Balcão",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Mariana Salimeni",
    items: "4 itens",
    agent: "Luciana Mirtes",
    agentRole: "Afiliado",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Maurilio Seixas",
    items: "4 itens",
    agent: "Poliana Cruz",
    agentRole: "Afiliado",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Dalva Munhoz",
    items: "4 itens",
    agent: "Sem agente",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Mariana Cruz",
    items: "4 itens",
    agent: "Julio Bastos",
    agentRole: "Afiliado",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
  {
    id: "VEN-0001",
    date: "12/02/2026 10:29 AM",
    customer: "Mario Covas",
    items: "4 itens",
    agent: "Milton Cunha",
    agentRole: "Afiliado",
    channel: "Site",
    paymentMethod: "Boleto Bancário",
    value: "R$ 450",
    status: "Pendente",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Pago: "bg-[#d0fae5] text-[#007a55]",
  Cancelado: "bg-[#ffe2e2] text-[#c10007]",
  Pendente: "bg-[#fef3c6] text-[#bb4d00]",
};

function SalesMetricCard({ metric }: { metric: SalesMetric }) {
  const TrendIcon = metric.trendDirection === "up" ? ArrowUp01Icon : ArrowDown01Icon;
  const isPositive = metric.trendDirection === "up";

  return (
    <article className="flex min-h-[139px] flex-col justify-between rounded-[24px] border border-[#e2e8f0] bg-white px-5 pt-5 pb-4 shadow-[0px_1px_1.5px_rgba(10,13,18,0.08),0px_1px_1px_rgba(10,13,18,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#bfdbfe]/50 bg-[#eff6ff]/40 text-[#0b5ed7]">
            <HugeiconsIcon icon={metric.icon} size={16} strokeWidth={1.5} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#314158]">
              {metric.title}
            </span>
            <span className="mt-0.5 block truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#62748e]">
              {metric.subtitle}
            </span>
          </span>
        </div>
        <HugeiconsIcon
          icon={InformationCircleIcon}
          size={16}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-[#94a3b8]"
        />
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <div className="flex shrink-0 items-baseline gap-1.5">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-8 whitespace-nowrap text-[#0f172b]">
            {metric.value}
          </p>
          {metric.detail ? (
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 whitespace-nowrap text-[#62748e]">
              {metric.detail}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-[8px] border px-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4",
              isPositive
                ? "border-[#b9f8cf] bg-[#f0fdf4] text-[#008236]"
                : "border-[#ffc9c9] bg-[#fef2f2] text-[#c10007]"
            )}
          >
            <HugeiconsIcon icon={TrendIcon} size={12} strokeWidth={1.5} />
            {metric.trend}
          </span>
          <span className="hidden font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#62748e] xl:inline">
            vs. mês anterior
          </span>
        </div>
      </div>
    </article>
  );
}

function SalesToolbar() {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="focus-within:border-primary focus-within:ring-primary/20 flex h-10 w-full overflow-hidden rounded-[8px] border border-[#cbd5e1] bg-white transition-colors focus-within:ring-3 sm:w-[371px]">
          <input
            className="min-w-0 flex-1 bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#414651] outline-none placeholder:text-[#94a3b8]"
            placeholder="Pesquisar"
            aria-label="Pesquisar pedidos"
          />
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#535862]"
            aria-label="Pesquisar"
          >
            <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} />
          </button>
        </div>
        <button
          type="button"
          className="flex h-[37px] items-center justify-center gap-2 rounded-[8px] border border-[#e2e8f0] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={FilterAddIcon} size={16} strokeWidth={1.5} />
          Filtros
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <button
          type="button"
          className="flex h-[37px] items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
        >
          Ações em lote
        </button>
        <button
          type="button"
          className="flex h-[37px] items-center justify-center gap-2 rounded-[8px] bg-linear-to-b from-[#0b5ed7] to-[#084fb7] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-white shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition-colors hover:from-[#084fb7] hover:to-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/30 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={PlusSignCircleIcon} size={16} strokeWidth={1.5} />
          Novo Pedido
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

function OrdersTable() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_rgba(10,13,18,0.04)]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1080px] table-fixed">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="h-10 border-b-[0.5px] border-black/10 bg-[#f8fafc] hover:bg-[#f8fafc]">
              <TableHead className="w-10 px-3">
                <Checkbox
                  aria-label="Selecionar todos os pedidos"
                  className="border-[#d0d5dd] bg-white"
                />
              </TableHead>
              <TableHead className="w-[88px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                ID
              </TableHead>
              <TableHead className="w-[122px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Data do pedido
              </TableHead>
              <TableHead className="w-[120px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Cliente
              </TableHead>
              <TableHead className="w-24 px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Itens (Qtde.)
              </TableHead>
              <TableHead className="w-[132px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Agente de venda
              </TableHead>
              <TableHead className="w-20 px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Canal
              </TableHead>
              <TableHead className="w-[150px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Método de pagamento
              </TableHead>
              <TableHead className="w-[116px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Valor
              </TableHead>
              <TableHead className="w-[88px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Status
              </TableHead>
              <TableHead className="w-12 px-2">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesOrders.map((order, index) => (
              <TableRow
                key={`${order.id}-${order.customer}-${index}`}
                className="h-14 border-b-[0.5px] border-black/10 hover:bg-[#f8fafc]"
              >
                <TableCell className="px-3 py-0">
                  <Checkbox
                    aria-label={`Selecionar pedido ${order.id} de ${order.customer}`}
                    className="border-[#d0d5dd] bg-white"
                  />
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {order.id}
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-normal text-[#414651]">
                  {order.date}
                </TableCell>
                <TableCell className="truncate px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {order.customer}
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {order.items}
                </TableCell>
                <TableCell className="px-3 py-0">
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={cn(
                        "truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm",
                        order.agent === "Sem agente" ? "text-[#94a3b8]" : "text-[#414651]"
                      )}
                    >
                      {order.agent}
                    </span>
                    {order.agentRole ? (
                      <span className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                        {order.agentRole}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {order.channel}
                </TableCell>
                <TableCell className="px-3 py-0">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                      {order.paymentMethod}
                    </span>
                    {order.paymentDetail ? (
                      <span className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                        {order.paymentDetail}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {order.value}
                </TableCell>
                <TableCell className="px-3 py-0">
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="px-2 py-0 text-center">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#535862] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
                    aria-label={`Ações do pedido ${order.id} de ${order.customer}`}
                  >
                    <HugeiconsIcon icon={MoreHorizontalSquare01Icon} size={16} strokeWidth={1.5} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <OrdersPagination />
    </div>
  );
}

function OrdersPagination() {
  const paginationButtons = [
    { label: "Primeira página", icon: ArrowLeftDoubleIcon, disabled: true },
    { label: "Página anterior", icon: ArrowLeft01Icon, disabled: true },
    { label: "Próxima página", icon: ArrowRight01Icon, disabled: false },
    { label: "Última página", icon: ArrowRightDoubleIcon, disabled: false },
  ] satisfies {
    label: string;
    icon: IconSvgElement;
    disabled: boolean;
  }[];

  return (
    <div className="flex min-h-16 flex-col gap-3 border-t border-[#e9eaeb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680]">
        Nenhum usuário selecionado
      </p>
      <div className="flex items-center gap-8">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
          Página 1 de 10
        </p>
        <div className="flex items-center gap-2">
          {paginationButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              className="flex size-8 items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white text-[#535862] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              aria-label={button.label}
              disabled={button.disabled}
            >
              <HugeiconsIcon icon={button.icon} size={16} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PedidosPage() {
  return (
    <AppPage title="Pedidos" description="Gerencie todas as vendas e transações.">
      <div className="flex flex-col gap-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {salesMetrics.map((metric) => (
            <SalesMetricCard key={metric.title} metric={metric} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <SalesToolbar />
          <OrdersTable />
        </section>
      </div>
    </AppPage>
  );
}

export function VendasPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppPage title={title} description={description}>
      <div className="flex min-h-[360px] items-center justify-center rounded-[16px] border border-dashed border-[#d5d7da] bg-white px-6 py-10 text-center">
        <div className="max-w-[360px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
            Esta área já está disponível na navegação.
          </p>
          <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-5 text-[#717680]">
            O layout detalhado será implementado quando seguirmos para este fluxo.
          </p>
        </div>
      </div>
    </AppPage>
  );
}
