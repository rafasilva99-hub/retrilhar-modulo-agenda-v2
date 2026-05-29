import AgendaAtividadesDoDia from "@/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia";

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
