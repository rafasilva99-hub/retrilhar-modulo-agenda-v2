import { AppShell } from "@/components/layout/app-shell";
import { shellNavItems, shellOrganization, shellProfile } from "@/mocks/shell";

import { AgendaDayPage } from "../adapters/figma-agenda-day-page";
import { AgendaMonthPage } from "../adapters/figma-agenda-month-page";
import { AgendaUpdatesPage } from "../adapters/figma-agenda-updates-page";
import { useAgendaPrototypeNavigation } from "../hooks/use-agenda-prototype-navigation";

import { AgendaNovaAtividade } from "./AgendaNovaAtividade";

function AgendaPrototypeApp() {
  const agenda = useAgendaPrototypeNavigation();

  if (agenda.currentPage === "novaAtividade") {
    return <AgendaNovaAtividade onBack={agenda.handleBackToAgenda} />;
  }

  if (agenda.currentPage === "atualizacoes") {
    return (
      <AgendaUpdatesPage
        initialTab={agenda.atualizacoesInitialTab}
        onBackToActivities={agenda.handleBackToActivities}
        activityId={agenda.selectedActivityId}
      />
    );
  }

  if (agenda.currentPage === "agendaDia") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <AgendaDayPage
          day={agenda.selectedDay}
          onBackToAgenda={agenda.handleBackToAgenda}
          onViewDetails={agenda.handleViewDetails}
          onGoToCheckIn={agenda.handleGoToCheckIn}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      activePage={agenda.currentPage}
      navItems={shellNavItems}
      organization={shellOrganization}
      profile={shellProfile}
      onNavigate={agenda.navigateTo}
    >
      <AgendaMonthPage
        onDayClick={agenda.handleDayClick}
        onNewActivity={agenda.handleNewActivity}
        onViewDetails={agenda.handleViewDetails}
        initialView={agenda.calendarView}
        onViewModeChange={agenda.setCalendarView}
      />
    </AppShell>
  );
}

export { AgendaPrototypeApp };
