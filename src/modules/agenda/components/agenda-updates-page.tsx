import AgendaAtualizacoes from "@/imports/AgendaAtualizacoes/AgendaAtualizacoes";

interface AgendaUpdatesPageProps {
  activityId: string;
  initialTab: string;
  onBackToActivities: () => void;
}

export function AgendaUpdatesPage({
  activityId,
  initialTab,
  onBackToActivities,
}: AgendaUpdatesPageProps) {
  return (
    <AgendaAtualizacoes
      initialTab={initialTab}
      onBackToActivities={onBackToActivities}
      activityId={activityId}
    />
  );
}
