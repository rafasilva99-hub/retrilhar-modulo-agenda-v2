import { useState } from "react";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import {
  Home,
  Calendar,
  ShoppingCart,
  Users,
  Package,
  UserCheck,
  UserPlus,
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Map,
  PlusCircle,
  ArrowUp,
  CalendarHeart,
  Wallet,
  TrendingUp,
  Leaf,
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

const CHIP_COLORS: Record<ActivityStatus, { bg: string; border: string; dot: string; text: string }> = {
  confirmed: { bg: "#eff6ff", border: "#dbeafe", dot: "#2b7fff", text: "#1447e6" },
  pending:   { bg: "#fff2d3", border: "#fde68a", dot: "#ff992b", text: "#e0850f" },
  full:      { bg: "#fef2f2", border: "#fecaca", dot: "#fb2c36", text: "#c10007" },
  blocked:   { bg: "#fafafa", border: "#f2f2f2", dot: "#d5d7da", text: "#919191" },
};

function ActivityChip({ activity }: { activity: Activity }) {
  const c = CHIP_COLORS[activity.status];
  const twoLine = activity.status === "pending" || activity.status === "blocked";

  return (
    <div
      className="flex items-start gap-1 w-full rounded-[4px]"
      style={{
        backgroundColor: c.bg,
        border: `0.556px solid ${c.border}`,
        padding: twoLine ? "4px 5px" : "3px 5px",
      }}
    >
      <span
        className="rounded-full shrink-0"
        style={{
          width: 6,
          height: 6,
          minWidth: 6,
          backgroundColor: c.dot,
          marginTop: twoLine ? 3 : 2,
        }}
      />
      {twoLine ? (
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] leading-[1.3] truncate" style={{ color: c.text }}>
            {chipLabel(activity)}
          </span>
          <span className="text-[10px] leading-[1.3] truncate" style={{ color: c.text, opacity: 0.8 }}>
            {chipSubtitle(activity)}
          </span>
        </div>
      ) : (
        <span className="text-[12px] leading-[1.3] truncate" style={{ color: c.text }}>
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
          ? "bg-white cursor-pointer hover:bg-[#f8fafc] transition-colors"
          : "bg-[#fafafa] cursor-default",
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
            className="flex items-center justify-center text-white text-[12px] font-medium rounded-full leading-none"
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
      <div className="flex flex-col gap-[3px] min-w-0">
        {visible.map((a) => (
          <ActivityChip key={a.id} activity={a} />
        ))}
        {overflow > 0 && (
          <span className="text-[12px] text-[#717680] px-[5px]">
            Mais {overflow}...
          </span>
        )}
      </div>
    </div>
  );
}

// ─── View switch ──────────────────────────────────────────────────────────────

function ViewSwitch() {
  return (
    <div
      className="flex items-center rounded-[10px] gap-[3px]"
      style={{ backgroundColor: "#f1f5f9", padding: 4 }}
    >
      {["Mês", "Semana", "Dia"].map((v) => {
        const active = v === "Mês";
        return (
          <button
            key={v}
            className={`px-3 py-[5px] rounded-[6px] text-[12px] transition-colors ${
              active
                ? "bg-white border border-[#e2e8f0] text-[#084fb7] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.06)]"
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
    <div className="bg-white border border-[#e2e8f0] rounded-[24px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08),0px_1px_2px_0px_rgba(10,13,18,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="size-8 rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#62748e] hover:bg-[#f8fafc] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div
            className="px-4 py-[6px] rounded-[10px] border border-[#e2e8f0] text-[14px] min-w-[148px] text-center"
            style={{ color: "#314158" }}
          >
            {monthLabel}
          </div>
          <button
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="size-8 rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#62748e] hover:bg-[#f8fafc] transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <ViewSwitch />
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-t border-[#e9eaeb]" style={{ backgroundColor: "#f8fafc" }}>
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`py-2 px-2 text-[12px] text-[#90a1b9] border-b border-[#e9eaeb] ${
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
    <div className="bg-white border border-[#e2e8f0] rounded-[24px] pt-5 pb-4 px-5 flex flex-col gap-2.5 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08),0px_1px_2px_0px_rgba(10,13,18,0.06)]">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-[10px] bg-[rgba(239,246,255,0.4)] border border-[rgba(190,219,255,0.5)] flex items-center justify-center text-[#0b5ed7] shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1 flex flex-col">
          <p className="text-[14px] text-[#314158] truncate leading-[1.2]">{label}</p>
          <p className="text-[12px] text-[#62748e] truncate leading-[1.3]">{subtitle}</p>
        </div>
      </div>
      <p className="text-[24px] text-[#0f172b] leading-none">{value}</p>
      <div className="flex items-center gap-2 h-6">
        <span className="inline-flex items-center gap-0.5 bg-[#f0fdf4] border border-[#b9f8cf] text-[#008236] text-[12px] rounded-[8px] px-[7px] py-[4px] leading-none">
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
  { label: "Início",      icon: <Home         className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Agenda",      icon: <Calendar     className="size-[18px]" strokeWidth={1.6} />, active: true },
  { label: "Vendas",      icon: <ShoppingCart className="size-[18px]" strokeWidth={1.6} />, chevron: true },
  { label: "Clientes",    icon: <Users        className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Produtos",    icon: <Package      className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Vendedores",  icon: <UserCheck    className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Afiliados",   icon: <UserPlus     className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Indicadores", icon: <BarChart3    className="size-[18px]" strokeWidth={1.6} /> },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[200px] shrink-0 bg-white border border-[#e2e8f0] rounded-[20px] p-4 gap-4 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.06)]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="size-8 rounded-lg bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] flex items-center justify-center text-white shadow-sm">
          <Leaf className="size-4" strokeWidth={2.2} />
        </div>
        <span className="font-['Sora:SemiBold',sans-serif] text-[#0f172b] text-[18px]">Retrilhar</span>
      </div>
      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[14px] cursor-default select-none ${
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
      <div className="flex items-center gap-2.5 px-1 pt-3 border-t border-[#f1f5f9]">
        <div className="size-10 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#ec4899] to-[#f472b6] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#0f172b] truncate">Katiely Pinheiro</p>
          <p className="text-[11px] text-[#64748b] truncate">Gestor Comercial</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[12px] px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)]">
        <Search className="size-4 text-[#94a3b8]" />
        <input
          placeholder="Buscar..."
          className="bg-transparent outline-none text-[14px] text-[#334155] flex-1 placeholder:text-[#94a3b8]"
        />
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[12px] pl-2 pr-3 py-1.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)]">
        <div className="size-8 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#1d4ed8] flex items-center justify-center text-white text-[10px]">
          E
        </div>
        <div className="leading-tight">
          <p className="text-[13px] text-[#0f172b]">EliasTurismo</p>
          <p className="text-[11px] text-[#64748b]">Empresa Vinculada</p>
        </div>
      </div>
      <button className="relative size-10 rounded-[12px] bg-white border border-[#e2e8f0] flex items-center justify-center text-[#475569] hover:text-[#0f172b] transition-colors shadow-[0px_1px_2px_0px_rgba(10,13,18,0.04)]">
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
    <div className="size-full bg-[#f1f5f9] overflow-auto">
      <div className="flex gap-4 p-4 min-h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <TopBar />

          {/* Page header */}
          <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h1 className="font-['Sora:SemiBold',sans-serif] text-[#0f172b] text-[22px] leading-tight">
                Agenda
              </h1>
              <p className="text-[13px] text-[#62748e]">
                Visualize e gerencie suas atividades agendadas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] px-3.5 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc] transition-colors shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
                <Map className="size-4" strokeWidth={1.8} />
                Mapa de Vagas
              </button>
              <button className="flex items-center gap-2 bg-[#175cd3] text-white rounded-[10px] px-3.5 py-2 text-[13px] border-2 border-[rgba(255,255,255,0.12)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] hover:bg-[#1a66e8] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                <PlusCircle className="size-4" strokeWidth={2} />
                Nova Atividade
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
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
