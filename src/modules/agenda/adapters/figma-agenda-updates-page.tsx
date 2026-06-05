import AgendaAtualizacoes from "@/imports/AgendaAtualizacoes/AgendaAtualizacoes";

// Legacy Figma export containment: keep direct imports from src/imports behind agenda adapters.
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
