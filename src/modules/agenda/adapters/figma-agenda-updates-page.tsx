import AgendaAtualizacoes from "@/imports/AgendaAtualizacoes/AgendaAtualizacoes";

// Legacy Figma export containment: keep direct imports from src/imports behind agenda adapters.
interface AgendaUpdatesPageProps {
  activityId: string;
  initialTab: string;
  onBackToActivities: () => void;
  initialOverlay?: string;
}

export function AgendaUpdatesPage({
  activityId,
  initialTab,
  onBackToActivities,
  initialOverlay,
}: AgendaUpdatesPageProps) {
  return (
    <AgendaAtualizacoes
      initialTab={initialTab}
      onBackToActivities={onBackToActivities}
      activityId={activityId}
      initialOverlay={initialOverlay}
    />
  );
}
