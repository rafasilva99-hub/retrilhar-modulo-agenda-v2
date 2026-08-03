import { type CSSProperties, lazy, type ReactNode, Suspense, useCallback, useState } from "react";

import ContextoMissao from "@/app/components/ContextoMissao";
import { DevBlocos } from "@/app/components/DevBlocos";
import { IntroTeste } from "@/app/components/IntroTeste";
import { AppShell } from "@/components/layout/app-shell";
import type { AppPage } from "@/components/layout/types";
import type { GestorAffiliateSection } from "@/mocks/gestor-afiliados";
import {
  affiliateNavItems,
  affiliateOrganization,
  affiliateProfile,
  shellNavItems,
  shellOrganization,
  shellProfile,
} from "@/mocks/shell";
import { AfiliadosPage } from "@/modules/afiliados/AfiliadosPage";
import { AjudaPage } from "@/modules/afiliados/AjudaPage";
import { ConfiguracoesPage } from "@/modules/afiliados/ConfiguracoesPage";
import { GanhosPage } from "@/modules/afiliados/GanhosPage";
import { IndicacoesPage } from "@/modules/afiliados/IndicacoesPage";
import { ProdutosLinksPage } from "@/modules/afiliados/ProdutosLinksPage";
import { GestorAfiliadosPage } from "@/modules/gestor-afiliados/GestorAfiliadosPage";
import { ProdutosPage } from "@/modules/produtos/ProdutosPage";

import { AgendaDayPage } from "../adapters/figma-agenda-day-page";
import { AgendaMonthPage } from "../adapters/figma-agenda-month-page";
import { AgendaUpdatesPage } from "../adapters/figma-agenda-updates-page";
import { useAgendaPrototypeNavigation } from "../hooks/use-agenda-prototype-navigation";
import { listActivities } from "../services/agenda-mock-service";
import type { AgendaViewMode } from "../types";

import { AgendaNovaAtividade } from "./AgendaNovaAtividade";

// Board module is lazy-loaded so its pan/zoom + CSS only ship when actually visited.
const BoardCanvas = lazy(() =>
  import("@/modules/board/BoardCanvas").then((m) => ({ default: m.BoardCanvas }))
);

// Preview helper: pick day in current month with NO activities (empty state preview).
function getEmptyDay(): number {
  const today = new Date();
  const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const used = new Set(
    listActivities()
      .filter((a) => a.date.startsWith(yearMonth))
      .map((a) => Number(a.date.slice(-2)))
  );
  for (let d = 1; d <= 28; d++) if (!used.has(d)) return d;
  return 1;
}

// Preview helper: pick day in current month with most activities, fallback to today.
// Adapter filters by current local month + day, so must find a day whose mock iso
// is in the current month (mocks use UTC ISO, may drift by 1 day vs local).
function getFirstPopulatedDay(): number {
  const today = new Date();
  const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const inMonth = listActivities().filter((a) => a.date.startsWith(yearMonth));
  if (inMonth.length === 0) return today.getDate();
  // Count per day and pick the most populated
  const counts = new Map<number, number>();
  for (const a of inMonth) {
    const d = Number(a.date.slice(-2));
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  let bestDay = today.getDate();
  let bestCount = 0;
  for (const [d, c] of counts) {
    if (c > bestCount) {
      bestCount = c;
      bestDay = d;
    }
  }
  return bestDay;
}

type AtualizacoesTab = "atualizacoes" | "participantes" | "visao-geral";

function isAtualizacoesTab(v: string | null): v is AtualizacoesTab {
  return v === "atualizacoes" || v === "participantes" || v === "visao-geral";
}

function isAgendaViewMode(v: string | null): v is AgendaViewMode {
  return v === "mes" || v === "semana" || v === "dia";
}

function AffiliatePreviewFrame({ children }: { children: ReactNode }) {
  return <div style={{ "--shell-offset": "24px" } as CSSProperties}>{children}</div>;
}

function getGestorAffiliateSection(page: AppPage): GestorAffiliateSection | null {
  switch (page) {
    case "gestorAfiliados":
      return "visao";
    case "gestorAfiliadosCentral":
      return "central";
    case "gestorAfiliadosLista":
      return "afiliados";
    case "gestorAfiliadosFicha":
      return "ficha";
    case "gestorAfiliadosPropostas":
      return "propostas";
    case "gestorAfiliadosSolicitacoes":
      return "solicitacoes";
    case "gestorAfiliadosPagamentos":
      return "pagamentos";
    case "gestorAfiliadosTermo":
      return "termo";
    default:
      return null;
  }
}

function AgendaPrototypeApp() {
  const agenda = useAgendaPrototypeNavigation();
  const navigateAfterActivityCancelled = agenda.handleActivityCancelled;
  const [dayToast, setDayToast] = useState<{
    message: string;
    type: "success" | "error";
    description?: string;
  } | null>(null);

  const handleActivityCancelled = useCallback(
    (activityDate?: string) => {
      setDayToast({
        message: "Atividade cancelada",
        description:
          "A atividade foi enviada para cancelamento e os participantes serão notificados conforme a política definida.",
        type: "error",
      });
      navigateAfterActivityCancelled(activityDate);
    },
    [navigateAfterActivityCancelled]
  );
  const handleDayToastClose = useCallback(() => setDayToast(null), []);

  // Board route: dedicated canvas page (lazy-loaded module).
  if (agenda.isBoardRoute) {
    return (
      <Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#0c0c0e" }} />}>
        <BoardCanvas />
      </Suspense>
    );
  }

  // Vitrine de blocos da Etapa 01 (#devBlocos): página avulsa, sem AppShell.
  if (agenda.currentPage === "devBlocos") {
    return <DevBlocos />;
  }

  // Preview mode: render bare screen without AppShell. Used by board iframes.
  if (agenda.previewSelection) {
    const { base, variant } = agenda.previewSelection;
    switch (base) {
      case "intro":
        return <IntroTeste onStart={() => undefined} />;
      case "contexto":
        return <ContextoMissao onStart={() => undefined} />;
      case "novaAtividade":
        return <AgendaNovaAtividade onBack={() => undefined} />;
      case "atualizacoes": {
        // variant can be "{tab}" or "{tab}/{overlay}"
        const parts = variant?.split("/") ?? [];
        const tab: AtualizacoesTab = isAtualizacoesTab(parts[0] ?? null)
          ? (parts[0] as AtualizacoesTab)
          : "atualizacoes";
        const overlay = parts[1];
        return (
          <AgendaUpdatesPage
            initialTab={tab}
            onBackToActivities={() => undefined}
            activityId={agenda.selectedActivityId}
            initialOverlay={overlay}
          />
        );
      }
      case "agendaDia": {
        // variant "empty" = pick a day with zero activities to show empty state
        const day = variant === "empty" ? getEmptyDay() : getFirstPopulatedDay();
        return (
          <AgendaDayPage
            day={day}
            onBackToAgenda={() => undefined}
            onViewDetails={() => undefined}
            onGoToCheckIn={() => undefined}
          />
        );
      }
      case "afiliados":
        return (
          <AffiliatePreviewFrame>
            <AfiliadosPage />
          </AffiliatePreviewFrame>
        );
      case "indicacoes":
        return (
          <AffiliatePreviewFrame>
            <IndicacoesPage />
          </AffiliatePreviewFrame>
        );
      case "ganhos":
        return (
          <AffiliatePreviewFrame>
            <GanhosPage />
          </AffiliatePreviewFrame>
        );
      case "produtosLinks":
        return (
          <AffiliatePreviewFrame>
            <ProdutosLinksPage />
          </AffiliatePreviewFrame>
        );
      case "gestorAfiliados":
      case "gestorAfiliadosCentral":
      case "gestorAfiliadosLista":
      case "gestorAfiliadosFicha":
      case "gestorAfiliadosPropostas":
      case "gestorAfiliadosSolicitacoes":
      case "gestorAfiliadosPagamentos":
      case "gestorAfiliadosTermo": {
        const section = getGestorAffiliateSection(base);
        return section ? (
          <AffiliatePreviewFrame>
            <GestorAfiliadosPage section={section} />
          </AffiliatePreviewFrame>
        ) : null;
      }
      case "configuracoes":
        return <ConfiguracoesPage />;
      case "ajuda":
        return <AjudaPage />;
      case "agenda":
      default: {
        const initialView: AgendaViewMode = isAgendaViewMode(variant) ? variant : "mes";
        return (
          <AgendaMonthPage
            onDayClick={() => undefined}
            onNewActivity={() => undefined}
            onViewDetails={() => undefined}
            initialView={initialView}
            onViewModeChange={agenda.setCalendarView}
          />
        );
      }
    }
  }

  if (agenda.currentPage === "afiliados") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={affiliateNavItems}
        organization={affiliateOrganization}
        profile={affiliateProfile}
        onNavigate={agenda.navigateTo}
      >
        <AfiliadosPage />
      </AppShell>
    );
  }

  if (agenda.currentPage === "indicacoes") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={affiliateNavItems}
        organization={affiliateOrganization}
        profile={affiliateProfile}
        onNavigate={agenda.navigateTo}
      >
        <IndicacoesPage />
      </AppShell>
    );
  }

  if (agenda.currentPage === "ganhos") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={affiliateNavItems}
        organization={affiliateOrganization}
        profile={affiliateProfile}
        onNavigate={agenda.navigateTo}
      >
        <GanhosPage />
      </AppShell>
    );
  }

  if (agenda.currentPage === "produtosLinks") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={affiliateNavItems}
        organization={affiliateOrganization}
        profile={affiliateProfile}
        onNavigate={agenda.navigateTo}
      >
        <ProdutosLinksPage />
      </AppShell>
    );
  }

  const gestorAffiliateSection = getGestorAffiliateSection(agenda.currentPage);
  if (gestorAffiliateSection) {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <GestorAfiliadosPage section={gestorAffiliateSection} />
      </AppShell>
    );
  }

  if (agenda.currentPage === "configuracoes") {
    return <ConfiguracoesPage />;
  }

  if (agenda.currentPage === "ajuda") {
    return <AjudaPage />;
  }

  if (agenda.currentPage === "produtos") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <ProdutosPage />
      </AppShell>
    );
  }

  if (agenda.currentPage === "novaAtividade") {
    return (
      <AppShell
        activePage={agenda.currentPage}
        navItems={shellNavItems}
        organization={shellOrganization}
        profile={shellProfile}
        onNavigate={agenda.navigateTo}
      >
        <AgendaNovaAtividade onBack={agenda.handleBackToAgenda} />
      </AppShell>
    );
  }

  if (agenda.currentPage === "atualizacoes") {
    return (
      <AgendaUpdatesPage
        initialTab={agenda.atualizacoesInitialTab}
        onBackToActivities={agenda.handleBackToActivities}
        onActivityCancelled={handleActivityCancelled}
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
          dateIso={agenda.selectedDate}
          onBackToAgenda={agenda.handleBackToAgenda}
          onViewDetails={agenda.handleViewDetails}
          onGoToCheckIn={agenda.handleGoToCheckIn}
          toast={dayToast}
          onToastClose={handleDayToastClose}
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
