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

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  hasChevron?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "Início", icon: <Home className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Agenda", icon: <Calendar className="size-[18px]" strokeWidth={1.6} />, active: true },
  { label: "Vendas", icon: <ShoppingCart className="size-[18px]" strokeWidth={1.6} />, hasChevron: true },
  { label: "Clientes", icon: <Users className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Produtos", icon: <Package className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Vendedores", icon: <UserCheck className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Afiliados", icon: <UserPlus className="size-[18px]" strokeWidth={1.6} /> },
  { label: "Indicadores", icon: <BarChart3 className="size-[18px]" strokeWidth={1.6} /> },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[200px] shrink-0 bg-white border border-[#e2e8f0] rounded-[20px] p-4 gap-4 shadow-[0px_1px_3px_0px_rgba(10,13,18,0.06)]">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="size-8 rounded-lg bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] flex items-center justify-center text-white shadow-sm">
          <Leaf className="size-4" strokeWidth={2.2} />
        </div>
        <span className="font-['Sora:SemiBold',sans-serif] text-[#0f172b] text-[18px]">Retrilhar</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            aria-disabled="true"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[14px] cursor-default select-none ${
              item.active
                ? "bg-[#eff6ff] text-[#084fb7]"
                : "text-[#475569]"
            }`}
          >
            <span className={item.active ? "text-[#084fb7]" : "text-[#64748b]"}>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.hasChevron && <ChevronDown className="size-3.5 text-[#94a3b8]" />}
          </div>
        ))}
      </nav>

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
        <div className="size-8 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#1d4ed8] flex items-center justify-center text-white text-[10px]">E</div>
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

function StatCard({
  icon,
  title,
  subtitle,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ReactNode;
  title: string;
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
          <p className="text-[14px] text-[#314158] truncate leading-[1.2]">{title}</p>
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

type Event =
  | { type: "blue"; label: string }
  | { type: "red"; label: string }
  | { type: "orange"; title: string; subtitle: string }
  | { type: "gray"; title: string; subtitle: string }
  | { type: "purple"; label: string; full?: boolean }
  | { type: "more"; label: string };

type Day = { day: number; muted?: boolean; today?: boolean; events?: Event[] };

function EventRow({ event }: { event: Event }) {
  if (event.type === "blue") {
    return (
      <div className="flex items-center gap-1 bg-[#eff6ff] border-[0.556px] border-[#dbeafe] rounded-[4px] px-1.5 py-0.5 w-full">
        <span className="size-[6px] rounded-full bg-[#2b7fff] shrink-0" />
        <span className="text-[#1447e6] text-[12px] truncate">{event.label}</span>
      </div>
    );
  }
  if (event.type === "red") {
    return (
      <div className="flex items-center gap-1 bg-[#fef2f2] border-[0.556px] border-[#fecaca] rounded-[4px] px-1.5 py-0.5 w-full">
        <span className="size-[6px] rounded-full bg-[#ef4444] shrink-0" />
        <span className="text-[#c10007] text-[12px] truncate">{event.label}</span>
      </div>
    );
  }
  if (event.type === "orange") {
    return (
      <div className="flex items-start gap-1 bg-[#fffbeb] border-[0.556px] border-[#fef6db] rounded-[4px] px-1.5 py-1 w-full">
        <span className="size-[6px] rounded-full bg-[#f59e0b] shrink-0 mt-1" />
        <div className="flex flex-col min-w-0">
          <span className="text-[#414651] text-[12px] truncate">{event.title}</span>
          <span className="text-[#ba8b4e] text-[10px] truncate">{event.subtitle}</span>
        </div>
      </div>
    );
  }
  if (event.type === "gray") {
    return (
      <div className="flex items-start gap-1 bg-[#fafafa] border-[0.556px] border-[#f2f2f2] rounded-[4px] px-1.5 py-1 w-full">
        <span className="size-[6px] rounded-full bg-[#d5d7da] shrink-0 mt-1" />
        <div className="flex flex-col min-w-0">
          <span className="text-[#414651] text-[12px] truncate">{event.title}</span>
          <span className="text-[#919191] text-[10px] truncate">{event.subtitle}</span>
        </div>
      </div>
    );
  }
  if (event.type === "purple") {
    return (
      <div className={`flex items-center justify-center bg-[#f3e8ff] border-[0.556px] border-[#dab2ff] rounded-[8px] px-2 py-0.5 ${event.full ? "w-full" : "self-start"}`}>
        <span className="text-[#8200db] text-[12px] whitespace-nowrap">{event.label}</span>
      </div>
    );
  }
  return <span className="text-[#717680] text-[11px] px-1">{event.label}</span>;
}

const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const weeks: Day[][] = [
  [
    { day: 29, muted: true },
    { day: 30, muted: true },
    { day: 31, muted: true },
    { day: 1, events: [{ type: "blue", label: "Trilha Pico (8/12)" }, { type: "red", label: "Rapel (Lotado)" }, { type: "more", label: "Mais 2..." }] },
    { day: 2, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
    { day: 3, events: [{ type: "blue", label: "Trilha Pico (8/12)" }, { type: "purple", label: "Sexta-feira Santa", full: true }] },
    { day: 4, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
  ],
  [
    { day: 5, events: [{ type: "gray", title: "Trilha Pico", subtitle: "Interrompida para Feriado" }, { type: "purple", label: "Páscoa" }] },
    { day: 6, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
    { day: 7 },
    { day: 8, events: [{ type: "blue", label: "Trilha Pico (8/12)" }, { type: "red", label: "Rapel (Lotado)" }] },
    { day: 9, today: true, events: [{ type: "blue", label: "Trilha Pico (8/12)" }, { type: "orange", title: "Trilha Pico (8/12)", subtitle: "Sem equipe atribuída" }] },
    { day: 10 },
    { day: 11 },
  ],
  [
    { day: 12 },
    { day: 13, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
    { day: 18 },
  ],
  [
    { day: 19 },
    { day: 20 },
    { day: 21, events: [{ type: "purple", label: "Tiradentes" }] },
    { day: 22, events: [{ type: "blue", label: "Trilha Pico (8/12)" }, { type: "red", label: "Rapel (Lotado)" }] },
    { day: 23 },
    { day: 24 },
    { day: 25 },
  ],
  [
    { day: 26 },
    { day: 27, events: [{ type: "blue", label: "Trilha Pico (8/12)" }] },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 1, muted: true, events: [{ type: "purple", label: "Dia do trabalho" }] },
    { day: 2, muted: true },
  ],
];

function ViewSwitch() {
  const views = ["Mês", "Semana", "Dia"];
  const active = "Mês";
  return (
    <div className="flex items-center bg-[#f1f5f9] rounded-[12px] p-[6px] gap-[2px]">
      {views.map((v) => {
        const isActive = v === active;
        return (
          <button
            key={v}
            className={`px-3 py-1 text-[12px] rounded-[6px] transition-colors ${
              isActive
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

function CalendarSection({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[24px] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08),0px_1px_2px_0px_rgba(10,13,18,0.06)] overflow-hidden">
      <div className="flex items-center justify-between p-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button className="size-8 rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#62748e] hover:bg-[#f8fafc] transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <div className="px-4 py-[6px] rounded-[10px] border border-[#e2e8f0] text-[14px] text-[#314158] min-w-[140px] text-center">Abril de 2026</div>
          <button className="size-8 rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#62748e] hover:bg-[#f8fafc] transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <ViewSwitch />
      </div>

      <div className="grid grid-cols-7 border-t border-[#e9eaeb] bg-[#f8fafc]">
        {weekdays.map((d, i) => (
          <div
            key={d}
            className={`px-3 py-2 text-[12px] text-[#90a1b9] border-b border-[#e9eaeb] ${
              i < 6 ? "border-r" : ""
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((cell, idx) => {
          const col = idx % 7;
          const row = Math.floor(idx / 7);
          const isLastRow = row === weeks.length - 1;
          return (
            <div
              key={idx}
              onClick={() => !cell.muted && onDayClick?.(cell.day)}
              className={`min-h-[110px] p-1.5 flex flex-col gap-1 ${cell.muted ? "bg-[#fafafa]" : "bg-white"} ${
                col < 6 ? "border-r border-[#e9eaeb]" : ""
              } ${!isLastRow ? "border-b border-[#e9eaeb]" : ""} ${!cell.muted ? "cursor-pointer hover:bg-[#f8fafc] transition-colors" : ""}`}
            >
              <div className="flex justify-start px-1 py-0.5">
                {cell.today ? (
                  <span className="size-[22px] rounded-full bg-[#2b7fff] text-white text-[12px] flex items-center justify-center leading-none">
                    {cell.day}
                  </span>
                ) : (
                  <span className={`text-[12px] ${cell.muted ? "text-[#cbd5e1]" : "text-[#717680]"}`}>
                    {cell.day}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                {cell.events?.map((e, i) => (
                  <EventRow key={i} event={e} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AgendaMes({ onDayClick }: { onDayClick?: (day: number) => void }) {
  return (
    <div className="size-full bg-[#f1f5f9] overflow-auto">
      <div className="flex gap-4 p-4 min-h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <TopBar />

          <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h1 className="font-['Sora:SemiBold',sans-serif] text-[#0f172b] text-[22px] leading-tight">Agenda</h1>
              <p className="text-[13px] text-[#62748e]">Visualize e gerencie suas atividades agendadas.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] px-3.5 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc] transition-colors shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
                <Map className="size-4" strokeWidth={1.8} />
                Mapa de Vagas
              </button>
              <button className="flex items-center gap-2 bg-[#175cd3] text-white rounded-[10px] px-3.5 py-2 text-[13px] border-2 border-[rgba(255,255,255,0.12)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] transition-all duration-200 hover:bg-[#1a66e8] hover:shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05),0px_4px_12px_0px_rgba(23,92,211,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                <PlusCircle className="size-4" strokeWidth={2} />
                Nova Atividade
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
            <StatCard
              icon={<CalendarHeart className="size-4" strokeWidth={1.8} />}
              title="Agendamentos Hoje"
              subtitle="Reservas confirmadas"
              value="23"
              trend="+4 hoje"
              trendLabel="vs. período anterior"
            />
            <StatCard
              icon={<Calendar className="size-4" strokeWidth={1.8} />}
              title="Agendamentos Última Hora"
              subtitle="Reservas recentes"
              value="5"
              trend="+2"
              trendLabel="vs. período anterior"
            />
            <StatCard
              icon={<Wallet className="size-4" strokeWidth={1.8} />}
              title="Receita Estimada Hoje"
              subtitle="Total de vendas"
              value="R$ 4.250"
              trend="+8.4%"
              trendLabel="vs. período anterior"
            />
            <StatCard
              icon={<TrendingUp className="size-4" strokeWidth={1.8} />}
              title="Ocupação Média"
              subtitle="Percentual de ocupação"
              value="85%"
              trend="+12%"
              trendLabel="vs. mês anterior"
            />
          </div>

          <CalendarSection onDayClick={onDayClick} />
        </main>
      </div>
    </div>
  );
}
