import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  homeHeaderIcons,
  type HomeKpi,
  type HomeRecentSale,
  type HomeTopProduct,
} from "./home-data";

const statusClassName: Record<HomeRecentSale["status"], string> = {
  Pago: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Pendente: "border-amber-200 bg-amber-50 text-amber-700",
  Processando: "border-blue-200 bg-blue-50 text-blue-700",
};

export function SectionIcon({ icon }: { readonly icon: IconSvgElement }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-[10px] border border-[#bfdbfe]/50 bg-[#eff6ff]/40 text-[#0b5ed7]">
      <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
    </span>
  );
}

export function SectionHeader({
  icon,
  title,
  description,
  accessory,
}: {
  readonly icon: IconSvgElement;
  readonly title: string;
  readonly description: string;
  readonly accessory?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <SectionIcon icon={icon} />
        <div className="min-w-0">
          <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[17px] text-[#0f172b]">
            {title}
          </h2>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px] text-[#62748e]">
            {description}
          </p>
        </div>
      </div>
      {accessory ? <div className="shrink-0">{accessory}</div> : null}
    </div>
  );
}

export function PeriodPill({ label }: { readonly label: string }) {
  return (
    <span className="flex h-[30px] items-center gap-1.5 rounded-[10px] border border-[#e2e8f0] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#314158]">
      <HugeiconsIcon
        icon={Calendar03Icon}
        size={16}
        className="text-[#62748e]"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export function DashboardCard({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <Card
      className={cn(
        "bg-card ring-foreground/5 dark:ring-foreground/10 rounded-3xl border border-transparent p-6 shadow-none",
        className
      )}
    >
      {children}
    </Card>
  );
}

export function HomeHero({ onNovaReserva }: { readonly onNovaReserva?: () => void }) {
  return (
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-baseline gap-x-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-[29px] tracking-[-0.6px]">
          <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[#0f172b]">
            Oi Katiely,
          </span>
          <span className="text-[#a4a7ae]">bem-vinda de volta!</span>
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-1 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[17px] text-[#62748e]">
          <span>Confira o resumo das suas vendas e operações</span>
          <span aria-hidden="true">•</span>
          <span>Atualizado agora há pouco</span>
        </p>
      </div>

      <Button
        type="button"
        className="h-[37px] rounded-[8px] bg-gradient-to-b from-[#0b5ed7] to-[#084fb7] px-3 font-['Helvetica_Neue:Medium',sans-serif] text-sm text-white shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_rgba(10,13,18,0.05)] hover:from-[#0a58ca] hover:to-[#084fb7]"
        onClick={onNovaReserva}
      >
        <HugeiconsIcon icon={PlusSignCircleIcon} size={16} aria-hidden="true" />
        Nova Reserva
      </Button>
    </header>
  );
}

export function KpiCard({ item }: { readonly item: HomeKpi }) {
  const trendTone =
    item.direction === "up"
      ? "border-[#b9f8cf] bg-[#f0fdf4] text-[#008236]"
      : "border-[#ffc9c9] bg-[#fef2f2] text-[#c10007]";
  return (
    <DashboardCard className="min-h-[140px] justify-between gap-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <SectionIcon icon={item.icon} />
          <div className="min-w-0">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[17px] text-[#314158]">
              {item.title}
            </p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px] text-[#62748e]">
              {item.subtitle}
            </p>
          </div>
        </div>
        <HugeiconsIcon
          icon={homeHeaderIcons.information}
          size={16}
          className="shrink-0 text-[#a4a7ae]"
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-[30px] tracking-[-0.6px] text-[#0f172b]">
          {item.value}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex h-6 items-center gap-px rounded-lg border px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs",
              trendTone
            )}
          >
            <HugeiconsIcon
              icon={item.direction === "up" ? ArrowUp01Icon : ArrowDown01Icon}
              size={16}
              aria-hidden="true"
            />
            {item.trend}
          </span>
          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
            {item.trendLabel}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}

export function SegmentedControl() {
  return (
    <div className="grid h-9 grid-cols-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-1">
      <button
        type="button"
        className="rounded-[8px] bg-white font-['Helvetica_Neue:Medium',sans-serif] text-xs text-[#0f172b] shadow-[0px_1px_2px_rgba(10,13,18,0.06)]"
      >
        Receita
      </button>
      <button
        type="button"
        className="rounded-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e] transition-colors hover:bg-white/70"
      >
        Quantidade
      </button>
    </div>
  );
}

export function RecentSaleRow({ sale }: { readonly sale: HomeRecentSale }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 hover:bg-[#f8fafc]">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172b]">
            {sale.customer}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-[7px] border px-1.5 py-0.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px]",
              statusClassName[sale.status]
            )}
          >
            {sale.status}
          </span>
        </div>
        <p className="mt-0.5 truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
          {sale.product}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-sm text-[#0f172b]">
          {sale.amount}
        </p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
          {sale.time}
        </p>
      </div>
    </div>
  );
}

export function TopProductRow({
  product,
  index,
}: {
  readonly product: HomeTopProduct;
  readonly index: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-[#f1f5f9] font-['Helvetica_Neue:Medium',sans-serif] text-xs text-[#62748e]">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172b]">
          {product.name}
        </p>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
          {product.sales} <span aria-hidden="true">•</span> {product.revenue}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]">
          <span
            className="block h-full rounded-full bg-[#0b5ed7]"
            style={{ width: `${product.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function ListFooter({ children }: { readonly children: ReactNode }) {
  return (
    <div className="mt-0 flex justify-center">
      <button
        type="button"
        className="group/button hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-transparent bg-clip-padding px-3 pr-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm font-normal whitespace-nowrap text-[#0b5ed7] transition-all outline-none select-none hover:text-[#0b5ed7] focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3"
      >
        {children}
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
