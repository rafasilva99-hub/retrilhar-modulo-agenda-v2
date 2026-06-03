import { AppShell } from "../components/layout/app-shell";
import { shellNavItems, shellOrganization, shellProfile } from "../mocks/shell";
import {
  AgendaDayPage,
  AgendaMonthPage,
  AgendaNovaAtividade,
  AgendaUpdatesPage,
  useAgendaPrototypeNavigation,
} from "../modules/agenda";

export default function App() {
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
