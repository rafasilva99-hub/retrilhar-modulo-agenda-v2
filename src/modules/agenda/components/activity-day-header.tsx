interface ActivityDayHeaderProps {
  activityName: string;
  occupancy: number;
  capacity: number;
  date: string;
  timeRange: string;
}

export function ActivityDayHeader({
  activityName,
  occupancy,
  capacity,
  date,
  timeRange,
}: ActivityDayHeaderProps) {
  const isOverCapacity = occupancy > capacity;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 shadow-lg">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] opacity-60" />

      {/* Content */}
      <div className="relative px-8 py-6">
        {/* Title + occupancy row */}
        <div className="mb-3 flex items-baseline gap-3">
          <h1 className="font-['Helvetica_Neue:Light',sans-serif] text-2xl text-white">
            {activityName}
          </h1>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-['Helvetica_Neue:Regular',sans-serif] text-lg ${
                isOverCapacity ? "text-amber-200" : "text-indigo-100"
              }`}
            >
              {occupancy}
            </span>
            <span className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-indigo-200">
              /
            </span>
            <span className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-indigo-200">
              {capacity}
            </span>
          </div>
        </div>

        {/* Date + time row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="size-4 text-indigo-200" fill="none" viewBox="0 0 16 16">
              <rect
                x="2"
                y="3"
                width="12"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M5 1v3M11 1v3M2 6h12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-white">{date}</p>
          </div>

          <span className="text-indigo-300">·</span>

          <div className="flex items-center gap-2">
            <svg className="size-4 text-indigo-200" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-sm text-white">
              {timeRange}
            </p>
          </div>
        </div>

        {/* Capacity warning */}
        {isOverCapacity && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-300/30 bg-amber-400/20 px-2.5 py-1 backdrop-blur-sm">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 14 14">
              <path
                d="M7 4.5v3M7 9.5h.005"
                stroke="#FCD34D"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z"
                stroke="#FCD34D"
                strokeWidth="1.3"
              />
            </svg>
            <p className="font-['Helvetica_Neue:Light',sans-serif] text-xs text-amber-100">
              Capacidade excedida em {occupancy - capacity} vagas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
