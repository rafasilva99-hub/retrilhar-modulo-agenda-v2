import AgendaMes from "@/imports/AgendaMes/AgendaMes-13-9535";

import type { AgendaViewMode } from "../types";

// Legacy Figma export containment: keep direct imports from src/imports behind agenda adapters.
interface AgendaMonthPageProps {
  initialView: AgendaViewMode;
  onDayClick: (day: number) => void;
  onNewActivity?: () => void;
  onViewDetails: (activityId?: string) => void;
  onViewModeChange: (view: AgendaViewMode) => void;
}

export function AgendaMonthPage({
  initialView,
  onDayClick,
  onNewActivity,
  onViewDetails,
  onViewModeChange,
}: AgendaMonthPageProps) {
  return (
    <AgendaMes
      onDayClick={onDayClick}
      onNewActivity={onNewActivity}
      onViewDetails={onViewDetails}
      initialView={initialView}
      onViewModeChange={onViewModeChange}
    />
  );
}
