import { AppShell } from "../components/layout/app-shell";
import { shellNavItems, shellOrganization, shellProfile } from "../mocks/shell";
import {
  AgendaDayPage,
  AgendaMonthPage,
  AgendaUpdatesPage,
  useAgendaPrototypeNavigation,
} from "../modules/agenda";

import ContextoMissao from "./components/ContextoMissao";
import { IntroTeste } from "./components/IntroTeste";

export default function App() {
  const agenda = useAgendaPrototypeNavigation();

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

  if (agenda.currentPage === "agenda") {
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
          onViewDetails={agenda.handleViewDetails}
          initialView={agenda.calendarView}
          onViewModeChange={agenda.setCalendarView}
        />
      </AppShell>
    );
  }

  if (agenda.currentPage === "contexto") {
    return <ContextoMissao onStart={() => agenda.navigateTo("agenda")} />;
  }

  return <IntroTeste onStart={() => agenda.navigateTo("contexto")} />;
}
