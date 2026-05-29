import { useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  ArrowUp,
  BarChart3,
  Bell,
  Calendar,
  CalendarHeart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Leaf,
  Map,
  Package,
  PlusCircle,
  Search,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { mockActivities, mockDashboardStats } from "../../mocks/agenda";
import type { Activity, ActivityStatus } from "../../types/agenda";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fixed "today" for the usability test */
const MOCK_TODAY = new Date(2026, 4, 11); // 2026-05-11

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const MONTH_NAMES_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Maximum activity chips shown per cell before "+N mais" overflow */
const MAX_CHIPS = 2;

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function buildCalendarWeeks(viewDate: Date): Date[][] {
  const firstOfMonth = startOfMonth(viewDate);
  const startDate = startOfWeek(firstOfMonth); // Sunday-first
  const weeks: Date[][] = [];
  let cur = startDate;
  for (let row = 0; row < 6; row++) {
    const week: Date[] = [];
    for (let col = 0; col < 7; col++) {
      week.push(cur);
      cur = addDays(cur, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function activitiesForDate(date: Date): Activity[] {
  const s = format(date, "yyyy-MM-dd");
  return mockActivities.filter((a) => a.date === s);
}

function chipLabel(activity: Activity): string {
  const words = activity.name.split(" ");
  const sn = words.length > 2 ? `${words[0]} ${words[1]}` : activity.name;
  const day = activity.dayNumber ? ` D${activity.dayNumber}` : "";
  if (activity.status === "full") return `${sn} (Lotado)`;
  if (activity.status === "blocked") return sn;
  return `${sn}${day} (${activity.occupancy}/${activity.capacity})`;
}

function chipSubtitle(activity: Activity): string {
  if (activity.status === "pending") {
    return activity.requiresInsurance ? "Seguro pendente" : "Sem guia atribuído";
  }
  return "Bloqueio";
}

// ─── Activity chip ────────────────────────────────────────────────────────────

const CHIP_COLORS: Record<
  ActivityStatus,
  { bg: string; border: string; dot: string; text: string }
> = {
  confirmed: { bg: "#eff6ff", border: "#dbeafe", dot: "#2b7fff", text: "#1447e6" },
  pending: { bg: "#fff2d3", border: "#fde68a", dot: "#ff992b", text: "#e0850f" },
  full: { bg: "#fef2f2", border: "#fecaca", dot: "#fb2c36", text: "#c10007" },
  blocked: { bg: "#fafafa", border: "#f2f2f2", dot: "#d5d7da", text: "#919191" },
};

function ActivityChip({ activity }: { activity: Activity }) {
  const c = CHIP_COLORS[activity.status];
  const twoLine = activity.status === "pending" || activity.status === "blocked";

  return (
    <div
      className="flex w-full items-start gap-1 rounded-[4px]"
      style={{
        backgroundColor: c.bg,
        border: `0.556px solid ${c.border}`,
        padding: twoLine ? "4px 5px" : "3px 5px",
      }}
    >
      <span
        className="shrink-0 rounded-full"
        style={{
          width: 6,
          height: 6,
          minWidth: 6,
          backgroundColor: c.dot,
          marginTop: twoLine ? 3 : 2,
        }}
      />
      {twoLine ? (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[12px] leading-[1.3]" style={{ color: c.text }}>
            {chipLabel(activity)}
          </span>
          <span
            className="truncate text-[10px] leading-[1.3]"
            style={{ color: c.text, opacity: 0.8 }}
          >
            {chipSubtitle(activity)}
          </span>
        </div>
      ) : (
        <span className="truncate text-[12px] leading-[1.3]" style={{ color: c.text }}>
          {chipLabel(activity)}
        </span>
      )}
    </div>
  );
}

// ─── Calendar cell ────────────────────────────────────────────────────────────

function CalendarCell({
  date,
  viewDate,
  colIndex,
  isLastRow,
  onClick,
}: {
  date: Date;
  viewDate: Date;
  colIndex: number;
  isLastRow: boolean;
  onClick: () => void;
}) {
  const inMonth = isSameMonth(date, viewDate);
  const isToday = isSameDay(date, MOCK_TODAY);
  const activities = inMonth ? activitiesForDate(date) : [];
  const visible = activities.slice(0, MAX_CHIPS);
  const overflow = activities.length - visible.length;

  return (
    <div
      onClick={inMonth ? onClick : undefined}
      className={[
        "flex flex-col gap-1 p-2",
        inMonth
          ? "cursor-pointer bg-white transition-colors hover:bg-[#f8fafc]"
          : "cursor-default bg-[#fafafa]",
        colIndex < 6 ? "border-r border-[#e9eaeb]" : "",
        !isLastRow ? "border-b border-[#e9eaeb]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ minHeight: 112 }}
    >
      {/* Day number */}
      <div className="flex items-center">
        {isToday ? (
          <span
            className="flex items-center justify-center rounded-full text-[12px] leading-none font-medium text-white"
            style={{ width: 24, height: 24, backgroundColor: "#155dfc" }}
          >
            {date.getDate()}
          </span>
        ) : (
          <span
            className="text-[12px] leading-none"
            style={{ color: inMonth ? "#414651" : "#cbd5e1" }}
          >
            {date.getDate()}
          </span>
        )}
      </div>
      {/* Chips */}
      <div className="flex min-w-0 flex-col gap-[3px]">
        {visible.map((a) => (
          <ActivityChip key={a.id} activity={a} />
        ))}
        {overflow > 0 && (
          <span className="px-[5px] text-[12px] text-[#717680]">Mais {overflow}...</span>
        )}
      </div>
    </div>
  );
}

// ─── View switch ──────────────────────────────────────────────────────────────

function ViewSwitch() {
  return (
    <div
      className="flex items-center gap-[3px] rounded-[10px]"
      style={{ backgroundColor: "#f1f5f9", padding: 4 }}
    >
      {["Mês", "Semana", "Dia"].map((v) => {
        const active = v === "Mês";
        return (
          <button
            key={v}
            className={`rounded-[6px] px-3 py-[5px] text-[12px] transition-colors ${
              active
                ? "border border-[#e2e8f0] bg-white text-[#084fb7] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]"
                : "text-[#62748e]"
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

// ─── Calendar section ─────────────────────────────────────────────────────────

function CalendarSection({ onDayClick }: { onDayClick?: (day: number) => void }) {
  const [viewDate, setViewDate] = useState(MOCK_TODAY);
  const weeks = buildCalendarWeeks(viewDate);
  const monthLabel = `${MONTH_NAMES_PT[viewDate.getMonth()]} de ${viewDate.getFullYear()}`;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08),0px_1px_2px_0px_rgba(10,13,18,0.06)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="flex size-8 items-center justify-center rounded-[8px] border border-[#e2e8f0] text-[#62748e] transition-colors hover:bg-[#f8fafc]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div
            className="min-w-[148px] rounded-[10px] border border-[#e2e8f0] px-4 py-[6px] text-center text-[14px]"
            style={{ color: "#314158" }}
          >
            {monthLabel}
          </div>
          <button
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="flex size-8 items-center justify-center rounded-[8px] border border-[#e2e8f0] text-[#62748e] transition-colors hover:bg-[#f8fafc]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <ViewSwitch />
      </div>

      {/* Weekday headers */}
      <div
        className="grid grid-cols-7 border-t border-[#e9eaeb]"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`border-b border-[#e9eaeb] px-2 py-2 text-[12px] text-[#90a1b9] ${
              i < 6 ? "border-r border-[#e9eaeb]" : ""
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {weeks.flat().map((date, idx) => {
          const colIdx = idx % 7;
          const rowIdx = Math.floor(idx / 7);
          const isLastRow = rowIdx === weeks.length - 1;
          return (
            <CalendarCell
              key={idx}
              date={date}
              viewDate={viewDate}
              colIndex={colIdx}
              isLastRow={isLastRow}
              onClick={() => onDayClick?.(date.getDate())}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  subtitle,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  value: string;
  trend: string;
  trendLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[24px] border border-[#e2e8f0] bg-white px-5 pt-5 pb-4 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08),0px_1px_2px_0px_rgba(10,13,18,0.06)]">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(190,219,255,0.5)] bg-[rgba(239,246,255,0.4)] text-[#0b5ed7]">
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[14px] leading-[1.2] text-[#314158]">{label}</p>
          <p className="truncate text-[12px] leading-[1.3] text-[#62748e]">{subtitle}</p>
        </div>
      </div>
      <p className="text-[24px] leading-none text-[#0f172b]">{value}</p>
      <div className="flex h-6 items-center gap-2">
        <span className="inline-flex items-center gap-0.5 rounded-[8px] border border-[#b9f8cf] bg-[#f0fdf4] px-[7px] py-[4px] text-[12px] leading-none text-[#008236]">
          <ArrowUp className="size-3" strokeWidth={2.5} />
          {trend}
        </span>
        <span className="text-[12px] text-[#62748e]">{trendLabel}</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { label: "Início", icon: <Home className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Agenda", icon: <Calendar className="size-[18px]" strokeWidth={1.6} />, active: true },
  {
    label: "Vendas",
    icon: <ShoppingCart className="size-[18px]" strokeWidth={1.6} />,
    chevron: true,
  },
  { label: "Clientes", icon: <Users className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Produtos", icon: <Package className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Vendedores", icon: <UserCheck className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Afiliados", icon: <UserPlus className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Indicadores", icon: <BarChart3 className="size-[18px]" strokeWidth={1.6} /> },
];

function Sidebar() {
  return (
    <aside className="hidden w-[200px] shrink-0 flex-col gap-4 rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.06)] lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] text-white shadow-sm">
          <Leaf className="size-4" strokeWidth={2.2} />
        </div>
        <span className="font-['Sora:SemiBold',sans-serif] text-[18px] text-[#0f172b]">
          Retrilhar
        </span>
      </div>
      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex cursor-default items-center gap-2.5 rounded-[8px] px-3 py-2 text-[14px] select-none ${
              item.active ? "bg-[#eff6ff] text-[#084fb7]" : "text-[#475569]"
            }`}
          >
            <span className={item.active ? "text-[#084fb7]" : "text-[#64748b]"}>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.chevron && <ChevronDown className="size-3.5 text-[#94a3b8]" />}
          </div>
        ))}
      </nav>
      {/* User */}
      <div className="flex items-center gap-2.5 border-t border-[#f1f5f9] px-1 pt-3">
        <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#ec4899] to-[#f472b6]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-[#0f172b]">Katiely Pinheiro</p>
          <p className="truncate text-[11px] text-[#64748b]">Gestor Comercial</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)]">
        <Search className="size-4 text-[#94a3b8]" />
        <input
          placeholder="Buscar..."
          className="flex-1 bg-transparent text-[14px] text-[#334155] outline-none placeholder:text-[#94a3b8]"
        />
      </div>
      <div className="hidden items-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white py-1.5 pr-3 pl-2 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)] sm:flex">
        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#60a5fa] to-[#1d4ed8] text-[10px] text-white">
          E
        </div>
        <div className="leading-tight">
          <p className="text-[13px] text-[#0f172b]">EliasTurismo</p>
          <p className="text-[11px] text-[#64748b]">Empresa Vinculada</p>
        </div>
      </div>
      <button className="relative flex size-10 items-center justify-center rounded-[12px] border border-[#e2e8f0] bg-white text-[#475569] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)] transition-colors hover:text-[#0f172b]">
        <Bell className="size-4" />
        <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-red-500" />
      </button>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AgendaMes({ onDayClick }: { onDayClick?: (day: number) => void }) {
  const s = mockDashboardStats;
  return (
    <div className="size-full overflow-auto bg-[#f1f5f9]">
      <div className="flex min-h-full gap-4 p-4">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar />

          {/* Page header */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-['Sora:SemiBold',sans-serif] text-[22px] leading-tight text-[#0f172b]">
                Agenda
              </h1>
              <p className="text-[13px] text-[#62748e]">
                Visualize e gerencie suas atividades agendadas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-white px-3.5 py-2 text-[13px] text-[#334155] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors hover:bg-[#f8fafc]">
                <Map className="size-4" strokeWidth={1.8} />
                Mapa de Vagas
              </button>
              <button className="flex items-center gap-2 rounded-[10px] border-2 border-[rgba(255,255,255,0.12)] bg-[#175cd3] px-3.5 py-2 text-[13px] text-white shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#1a66e8] active:scale-[0.98]">
                <PlusCircle className="size-4" strokeWidth={2} />
                Nova Atividade
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CalendarHeart className="size-4" strokeWidth={1.8} />}
              label={s.agendamentosHoje.label}
              subtitle={s.agendamentosHoje.subtitle}
              value={String(s.agendamentosHoje.value)}
              trend={s.agendamentosHoje.trend}
              trendLabel={s.agendamentosHoje.trendLabel}
            />
            <StatCard
              icon={<Calendar className="size-4" strokeWidth={1.8} />}
              label={s.agendamentosUltimaHora.label}
              subtitle={s.agendamentosUltimaHora.subtitle}
              value={String(s.agendamentosUltimaHora.value)}
              trend={s.agendamentosUltimaHora.trend}
              trendLabel={s.agendamentosUltimaHora.trendLabel}
            />
            <StatCard
              icon={<Wallet className="size-4" strokeWidth={1.8} />}
              label={s.receitaEstimadaHoje.label}
              subtitle={s.receitaEstimadaHoje.subtitle}
              value={String(s.receitaEstimadaHoje.value)}
              trend={s.receitaEstimadaHoje.trend}
              trendLabel={s.receitaEstimadaHoje.trendLabel}
            />
            <StatCard
              icon={<TrendingUp className="size-4" strokeWidth={1.8} />}
              label={s.ocupacaoMedia.label}
              subtitle={s.ocupacaoMedia.subtitle}
              value={String(s.ocupacaoMedia.value)}
              trend={s.ocupacaoMedia.trend}
              trendLabel={s.ocupacaoMedia.trendLabel}
            />
          </div>

          {/* Calendar */}
          <CalendarSection onDayClick={onDayClick} />
        </main>
      </div>
    </div>
  );
}
