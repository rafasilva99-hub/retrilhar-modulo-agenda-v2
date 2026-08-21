import { cn } from "@/lib/utils";

import {
  opportunitySummary,
  paymentMethods,
  receivableMonths,
  receivableSummary,
} from "./home-data";

function DividerDots() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-[#e2e8f0]" />
      <span className="size-1 rounded-full bg-[#e2e8f0]" />
      <span className="size-1 rounded-full bg-[#e2e8f0]" />
      <span className="size-1 rounded-full bg-[#e2e8f0]" />
      <span className="h-px flex-1 bg-[#e2e8f0]" />
    </div>
  );
}

function SummaryGrid({ metrics }: { readonly metrics: typeof receivableSummary }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="min-w-0">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
            {metric.label}
          </p>
          <div className="mt-1 flex min-w-0 items-end gap-1">
            <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-2xl leading-[29px] tracking-[-0.6px] text-[#0f172b]">
              {metric.value}
            </p>
            <span className="pb-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
              {metric.suffix}
            </span>
          </div>
          <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
            {metric.helper}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PaymentDonut() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center py-1">
        <div
          className="grid size-52 place-items-center rounded-full"
          style={{
            background: "conic-gradient(#0b5ed7 0deg 221.4deg, #78b7ff 221.4deg 360deg)",
          }}
        >
          <div className="grid size-[136px] place-items-center rounded-full bg-white text-center shadow-[inset_0px_0px_0px_1px_rgba(226,232,240,0.75)]">
            <div className="flex flex-col items-center">
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-4 tracking-[0.8px] text-[#94a3b8] uppercase">
                Total vendas
              </span>
              <span className="font-['Helvetica_Neue:Medium',sans-serif] text-lg leading-6 text-[#0f172b]">
                R$ 285 mil
              </span>
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
                Último período
              </span>
            </div>
          </div>
        </div>
      </div>
      <DividerDots />
      <div className="flex flex-col gap-2">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 hover:bg-[#f8fafc]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("size-2.5 rounded-full", method.colorClassName)} />
              <div className="min-w-0">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172b]">
                  {method.name}
                </p>
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
                  {method.share}
                </p>
              </div>
            </div>
            <span className="shrink-0 font-['Helvetica_Neue:Medium',sans-serif] text-sm text-[#0f172b]">
              {method.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReceivablesChart() {
  const maxValue = Math.max(
    ...receivableMonths.flatMap((month) => [month.previsto, month.recebido])
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid h-[296px] grid-cols-6 items-end gap-4 border-b border-[#e2e8f0] px-2 pt-4">
        {receivableMonths.map((month) => {
          const previstoHeight = `${Math.round((month.previsto / maxValue) * 100)}%`;
          const recebidoHeight = `${Math.round((month.recebido / maxValue) * 100)}%`;
          return (
            <div key={month.label} className="flex h-full min-w-0 flex-col justify-end gap-2">
              <div className="flex min-h-0 flex-1 items-end justify-center gap-1.5">
                <span
                  className="w-4 rounded-t-full bg-[#bfdbfe]"
                  style={{ height: previstoHeight }}
                  aria-label={`${month.label}: previsto ${month.previsto}`}
                />
                <span
                  className="w-4 rounded-t-full bg-[#0b5ed7]"
                  style={{ height: recebidoHeight }}
                  aria-label={`${month.label}: recebido ${month.recebido}`}
                />
              </div>
              <span className="text-center font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#62748e]">
                {month.label}
              </span>
            </div>
          );
        })}
      </div>
      <DividerDots />
      <SummaryGrid metrics={receivableSummary} />
    </div>
  );
}

export function OpportunityChart() {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative h-[296px] overflow-hidden rounded-2xl bg-[#f8fafc]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "100% 74px, 96px 100%",
          }}
        />
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 1100 296"
          fill="none"
          preserveAspectRatio="none"
          role="img"
          aria-label="Comparativo de possibilidade e vendido por semana"
        >
          <path
            d="M0 224 C150 148 250 184 366 122 C520 40 650 112 733 84 C860 40 960 88 1100 52 V296 H0 Z"
            fill="url(#homeOpportunityArea)"
          />
          <path
            d="M0 224 C150 148 250 184 366 122 C520 40 650 112 733 84 C860 40 960 88 1100 52"
            stroke="#0b5ed7"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M0 244 C132 212 225 222 366 168 C525 106 623 168 733 140 C872 104 980 136 1100 104"
            stroke="#78b7ff"
            strokeDasharray="10 10"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="homeOpportunityArea" x1="550" x2="550" y1="40" y2="296">
              <stop stopColor="#0b5ed7" stopOpacity="0.18" />
              <stop offset="1" stopColor="#0b5ed7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <DividerDots />
      <SummaryGrid metrics={opportunitySummary} />
    </div>
  );
}
