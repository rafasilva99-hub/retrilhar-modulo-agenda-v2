import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  ArrowUp01Icon,
  FilterAddIcon,
  InformationCircleIcon,
  MoreHorizontalSquare01Icon,
  MoreVerticalIcon,
  ReceiptDollarIcon,
  Search01Icon,
  Settings01Icon,
  ShoppingCartCheck01Icon,
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

type Temperature = "Quente" | "Morno" | "Frio";

interface AbandonmentMetric {
  title: string;
  subtitle: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  trendTone: "danger" | "success";
  icon: IconSvgElement;
}

interface AbandonmentLead {
  id: string;
  customer: string;
  access: string;
  product: string;
  value: string;
  abandonedAgo: string;
  lastAction: string;
  temperature: Temperature;
}

const abandonmentMetrics: AbandonmentMetric[] = [
  {
    title: "Carrinhos",
    subtitle: "Lorem ipsum",
    value: "23",
    trend: "+5",
    trendDirection: "up",
    trendTone: "danger",
    icon: ShoppingCartRemove01Icon,
  },
  {
    title: "Valor Perdido",
    subtitle: "Lorem ipsum",
    value: "R$ 8.450",
    trend: "12%",
    trendDirection: "up",
    trendTone: "danger",
    icon: ReceiptDollarIcon,
  },
  {
    title: "Taxa Abandono",
    subtitle: "Lorem ipsum",
    value: "32%",
    trend: "3%",
    trendDirection: "down",
    trendTone: "success",
    icon: TargetDollarIcon,
  },
  {
    title: "Recuperados",
    subtitle: "Lorem ipsum",
    value: "8",
    trend: "+2",
    trendDirection: "down",
    trendTone: "success",
    icon: ShoppingCartCheck01Icon,
  },
];

const abandonmentLeads: AbandonmentLead[] = [
  {
    id: "abandonment-1",
    customer: "João Silva",
    access: "Usuário logado",
    product: "Trilha Pico do Itambé",
    value: "R$ 10.923,59",
    abandonedAgo: "31 minutos",
    lastAction: "Abandonou no pagamento",
    temperature: "Quente",
  },
  {
    id: "abandonment-2",
    customer: "Alberto Gonçalves",
    access: "Usuário não logado",
    product: "Cachoeira Fumaça",
    value: "R$ 450",
    abandonedAgo: "Cerca de cinco horas",
    lastAction: "Cerca de cinco horas",
    temperature: "Morno",
  },
  {
    id: "abandonment-3",
    customer: "Luciana Almeida",
    access: "Usuário logado",
    product: "Cachoeira Fria",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Frio",
  },
  {
    id: "abandonment-4",
    customer: "Alberto Fonseca",
    access: "Usuário logado",
    product: "Trilha Pico do Itambé",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Morno",
  },
  {
    id: "abandonment-5",
    customer: "Augusto Dutra",
    access: "Usuário logado",
    product: "Trilha Verde",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Frio",
  },
  {
    id: "abandonment-6",
    customer: "Mariana Salimeni",
    access: "Usuário logado",
    product: "Chalé da Alegria",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Quente",
  },
  {
    id: "abandonment-7",
    customer: "Maurilio Seixas",
    access: "Usuário logado",
    product: "Expedição Paraíso",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Frio",
  },
  {
    id: "abandonment-8",
    customer: "Dalva Munhoz",
    access: "Usuário logado",
    product: "Trilha Pico do Itambé",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Frio",
  },
  {
    id: "abandonment-9",
    customer: "Mariana Cruz",
    access: "Usuário logado",
    product: "Trilha Pico do Itambé",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Morno",
  },
  {
    id: "abandonment-10",
    customer: "Mario Covas",
    access: "Usuário logado",
    product: "Trilha do Cerrado",
    value: "R$ 450",
    abandonedAgo: "2 dias",
    lastAction: "2 dias",
    temperature: "Morno",
  },
];

const temperatureStyles: Record<Temperature, string> = {
  Quente: "bg-[#ffe2e2] text-[#c10007]",
  Morno: "bg-[#fef3c6] text-[#bb4d00]",
  Frio: "bg-[#dbeafe] text-[#1d4ed8]",
};

function AbandonmentMetricCard({ metric }: { metric: AbandonmentMetric }) {
  const TrendIcon = metric.trendDirection === "up" ? ArrowUp01Icon : ArrowDown01Icon;

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
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-8 whitespace-nowrap text-[#0f172b]">
          {metric.value}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-[8px] border px-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4",
              metric.trendTone === "success"
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

function DesistenciasToolbar() {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="focus-within:border-primary focus-within:ring-primary/20 flex h-10 w-full overflow-hidden rounded-[8px] border border-[#cbd5e1] bg-white transition-colors focus-within:ring-3 sm:w-[371px]">
          <input
            className="min-w-0 flex-1 bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#414651] outline-none placeholder:text-[#94a3b8]"
            placeholder="Pesquisar"
            aria-label="Pesquisar desistências"
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
          className="flex h-[37px] items-center justify-center gap-2 rounded-[8px] border border-[#e2e8f0] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
        >
          Ações em lote
          <HugeiconsIcon icon={MoreVerticalIcon} size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="flex h-[37px] items-center justify-center gap-2 rounded-[8px] bg-linear-to-b from-[#0b5ed7] to-[#084fb7] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-white shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition-colors hover:from-[#084fb7] hover:to-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/30 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={1.5} />
          Configurar Remarketing
        </button>
      </div>
    </div>
  );
}

function TemperatureBadge({ temperature }: { temperature: Temperature }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4",
        temperatureStyles[temperature]
      )}
    >
      {temperature}
    </span>
  );
}

function DesistenciasTable() {
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
    <div className="overflow-hidden rounded-[14px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_rgba(10,13,18,0.04)]">
      <div className="overflow-x-auto">
        <Table className="min-w-[980px] table-fixed">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="h-10 border-b-[0.5px] border-black/10 bg-[#f8fafc] hover:bg-[#f8fafc]">
              <TableHead className="w-10 px-3">
                <Checkbox
                  aria-label="Selecionar todas as desistências"
                  className="border-[#d0d5dd] bg-white"
                />
              </TableHead>
              <TableHead className="w-[182px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Cliente
              </TableHead>
              <TableHead className="w-[178px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Produto
              </TableHead>
              <TableHead className="w-[124px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Valor
              </TableHead>
              <TableHead className="w-[148px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Abandonado há
              </TableHead>
              <TableHead className="w-[178px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Última ação
              </TableHead>
              <TableHead className="w-[112px] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0a0a0a]">
                Temperatura
              </TableHead>
              <TableHead className="w-12 px-2">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abandonmentLeads.map((lead) => (
              <TableRow
                key={lead.id}
                className="h-14 border-b-[0.5px] border-black/10 hover:bg-[#f8fafc]"
              >
                <TableCell className="px-3 py-0">
                  <Checkbox
                    aria-label={`Selecionar desistência de ${lead.customer}`}
                    className="border-[#d0d5dd] bg-white"
                  />
                </TableCell>
                <TableCell className="px-3 py-0">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                      {lead.customer}
                    </span>
                    <span className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                      {lead.access}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {lead.product}
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {lead.value}
                </TableCell>
                <TableCell className="px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {lead.abandonedAgo}
                </TableCell>
                <TableCell className="truncate px-3 py-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                  {lead.lastAction}
                </TableCell>
                <TableCell className="px-3 py-0">
                  <TemperatureBadge temperature={lead.temperature} />
                </TableCell>
                <TableCell className="px-2 py-0 text-center">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#535862] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
                    aria-label={`Ações da desistência de ${lead.customer}`}
                  >
                    <HugeiconsIcon icon={MoreHorizontalSquare01Icon} size={16} strokeWidth={1.5} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
    </div>
  );
}

export function DesistenciasPage() {
  return (
    <AppPage title="Desistências" description="Gerencie todas as vendas e transações.">
      <div className="flex flex-col gap-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {abandonmentMetrics.map((metric) => (
            <AbandonmentMetricCard key={metric.title} metric={metric} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <DesistenciasToolbar />
          <DesistenciasTable />
        </section>
      </div>
    </AppPage>
  );
}
