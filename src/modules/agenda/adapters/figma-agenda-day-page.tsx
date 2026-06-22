import AgendaAtividadesDoDia from "@/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia";

// Legacy Figma export containment: keep direct imports from src/imports behind agenda adapters.
interface AgendaDayPageProps {
  day: number;
  dateIso?: string | null;
  onBackToAgenda: () => void;
  onGoToCheckIn: (activityId?: string) => void;
  onViewDetails: (activityId?: string) => void;
  toast?: {
    message: string;
    type: "success" | "error";
    description?: string;
  } | null;
  onToastClose?: () => void;
}

export function AgendaDayPage({
  day,
  dateIso,
  onBackToAgenda,
  onGoToCheckIn,
  onViewDetails,
  toast,
  onToastClose,
}: AgendaDayPageProps) {
  return (
    <AgendaAtividadesDoDia
      day={day}
      dateIso={dateIso}
      onBackToAgenda={onBackToAgenda}
      onViewDetails={onViewDetails}
      onGoToCheckIn={onGoToCheckIn}
      toast={toast}
      onToastClose={onToastClose}
    />
  );
}
