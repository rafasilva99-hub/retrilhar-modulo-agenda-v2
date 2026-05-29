interface ActivityHeaderProps {
  activityName: string;
  date: string;
  timeRange: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  countdown?: string;
  alerts: string[];
  location: {
    name: string;
    venue: string;
  };
  weather?: {
    visibility: string;
    temperature: string;
  };
  team: {
    initials: string;
    color: string;
  }[];
  teamNames: string;
  lastUpdate: string;
  stats: {
    totalParticipants: number;
    confirmedReservations: number;
    checkedIn: number;
    waitingCheckIn: number;
    nextParticipant?: string;
    insured: number;
  };
  onComplete?: () => void;
  onViewLists?: () => void;
  onViewMap?: () => void;
  onSync?: () => void;
}

const STATUS_CONFIG = {
  upcoming: {
    label: "Aguarda início",
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  ongoing: {
    label: "Em andamento",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  completed: {
    label: "Concluída",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  cancelled: {
    label: "Cancelada",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export function ActivityHeader({
  activityName,
  date,
  timeRange,
  status,
  countdown,
  alerts,
  location,
  weather,
  team,
  teamNames,
  lastUpdate,
  stats,
  onComplete,
  onViewLists,
  onViewMap,
  onSync,
}: ActivityHeaderProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Hero section — Activity title, time, status */}
      <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-8 py-6">
        {/* Title row */}
        <div className="mb-4 flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 font-['Helvetica_Neue:Medium',sans-serif] text-2xl text-slate-900">
              {activityName}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-600">
                {date}
              </p>
              <span className="text-slate-300">·</span>
              <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-700">
                {timeRange}
              </p>
              {countdown && (
                <>
                  <span className="text-slate-300">·</span>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-indigo-600">
                    {countdown}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`rounded-lg border px-3 py-1.5 ${statusConfig.bg} ${statusConfig.border} shrink-0`}
          >
            <p
              className={`font-['Helvetica_Neue:Regular',sans-serif] text-xs ${statusConfig.text} whitespace-nowrap`}
            >
              {statusConfig.label}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1"
              >
                <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 14 14">
                  <path
                    d="M7 4.5v3M7 9.5h.005"
                    stroke="#D97706"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z"
                    stroke="#D97706"
                    strokeWidth="1.3"
                  />
                </svg>
                <p className="font-['Helvetica_Neue:Light',sans-serif] text-xs text-amber-800">
                  {alert}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onViewLists}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-slate-700">
              Listas e Manifestos
            </p>
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="rounded-lg bg-indigo-600 px-4 py-2 shadow-sm transition-colors hover:bg-indigo-700"
          >
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-white">
              Concluir atividade
            </p>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 lg:grid-cols-4">
        {/* Total participants */}
        <div className="bg-white px-6 py-5">
          <p className="mb-1.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
            Participantes
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-3xl text-slate-900">
              {stats.totalParticipants}
            </p>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-500">
              {stats.confirmedReservations} reservas confirmadas
            </p>
          </div>
        </div>

        {/* Check-ins */}
        <div className="bg-white px-6 py-5">
          <p className="mb-1.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
            Check-ins realizados
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-3xl text-emerald-600">
              {stats.checkedIn}
            </p>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-500">
              de {stats.totalParticipants}
            </p>
          </div>
        </div>

        {/* Waiting check-in */}
        <div className="bg-white px-6 py-5">
          <p className="mb-1.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
            Aguardando check-in
          </p>
          <div className="mb-1 flex items-baseline gap-2">
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-3xl text-amber-600">
              {stats.waitingCheckIn}
            </p>
          </div>
          {stats.nextParticipant && (
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
              Próximo: {stats.nextParticipant}
            </p>
          )}
        </div>

        {/* Insurance */}
        <div className="bg-white px-6 py-5">
          <p className="mb-1.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
            Seguros contratados
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-3xl text-slate-900">
              {stats.insured}
            </p>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-500">
              de {stats.totalParticipants}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom metadata row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-8 py-5">
        {/* Left: Location */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 16 16">
              <path d="M8 8.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 14c2.5-2.5 5-5 5-7.5a5 5 0 10-10 0c0 2.5 2.5 5 5 7.5z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="mb-0.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
              Local de encontro
            </p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-slate-700">
              {location.name} · {location.venue}
            </p>
            <button
              type="button"
              onClick={onViewMap}
              className="mt-1 inline-block font-['Helvetica_Neue:Regular',sans-serif] text-xs text-indigo-600 hover:text-indigo-700"
            >
              Ver no mapa
            </button>
          </div>
        </div>

        {/* Center: Team */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex -space-x-2">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="flex size-8 items-center justify-center rounded-full border-2 border-white font-['Helvetica_Neue:Medium',sans-serif] text-xs text-white shadow-sm"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
            ))}
          </div>
          <div>
            <p className="mb-0.5 font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
              Equipe alocada
            </p>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-slate-700">
              {teamNames}
            </p>
          </div>
        </div>

        {/* Right: Weather & sync */}
        <div className="flex items-center gap-6">
          {weather && (
            <div className="flex items-center gap-2">
              <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M8 1v1M8 14v1M15 8h-1M2 8H1M12.5 3.5l-.7.7M4.2 11.8l-.7.7M12.5 12.5l-.7-.7M4.2 4.2l-.7-.7"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-slate-600">
                {weather.visibility} · {weather.temperature}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-xs text-slate-500">
              {lastUpdate}
            </p>
            <button
              type="button"
              onClick={onSync}
              className="rounded-md p-1.5 transition-colors hover:bg-slate-100"
              aria-label="Sincronizar"
            >
              <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 16 16">
                <path
                  d="M14 8A6 6 0 114 4.5M4 4.5V2M4 4.5h2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
