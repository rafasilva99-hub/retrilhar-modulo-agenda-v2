import AgendaAtividadesDoDia from "@/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia";

// Legacy Figma export containment: keep direct imports from src/imports behind agenda adapters.
interface AgendaDayPageProps {
  day: number;
  onBackToAgenda: () => void;
  onGoToCheckIn: (activityId?: string) => void;
  onViewDetails: (activityId?: string) => void;
}

export function AgendaDayPage({
  day,
  onBackToAgenda,
  onGoToCheckIn,
  onViewDetails,
}: AgendaDayPageProps) {
  return (
    <AgendaAtividadesDoDia
      day={day}
      onBackToAgenda={onBackToAgenda}
      onViewDetails={onViewDetails}
      onGoToCheckIn={onGoToCheckIn}
    />
  );
}
