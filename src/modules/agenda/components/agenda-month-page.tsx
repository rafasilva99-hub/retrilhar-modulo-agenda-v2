import AgendaMes from "@/imports/AgendaMes/AgendaMes-13-9535";

import type { AgendaViewMode } from "../types";

interface AgendaMonthPageProps {
  initialView: AgendaViewMode;
  onDayClick: (day: number) => void;
  onViewDetails: (activityId?: string) => void;
  onViewModeChange: (view: AgendaViewMode) => void;
}

export function AgendaMonthPage({
  initialView,
  onDayClick,
  onViewDetails,
  onViewModeChange,
}: AgendaMonthPageProps) {
  return (
    <AgendaMes
      onDayClick={onDayClick}
      onViewDetails={onViewDetails}
      initialView={initialView}
      onViewModeChange={onViewModeChange}
    />
  );
}
