import { useCallback, useEffect, useState } from "react";

import type { AppPage } from "@/components/layout/types";

import { getDefaultActivityId } from "../services/agenda-mock-service";
import type { AgendaViewMode } from "../types";

const prototypePages: AppPage[] = [
  "intro",
  "contexto",
  "agenda",
  "agendaDia",
  "atualizacoes",
  "novaAtividade",
];

type AgendaUpdatesInitialTab = "atualizacoes" | "participantes" | "visao-geral";

const previewBases = ["intro", "contexto", "agenda", "agendaDia", "atualizacoes", "novaAtividade"] as const;
type PreviewBase = (typeof previewBases)[number];
type PreviewSelection = { base: PreviewBase; variant: string | null };

function getPreviewSelectionFromHash(): PreviewSelection | null {
  const raw = window.location.hash.replace("#", "");
  if (!raw.startsWith("preview/")) return null;
  const [base, ...variantParts] = raw.slice("preview/".length).split("/");
  if (!base || !(previewBases as readonly string[]).includes(base)) return null;
  const variant = variantParts.length > 0 ? variantParts.join("/") : null;
  return { base: base as PreviewBase, variant };
}

function isBoardHash(): boolean {
  return window.location.hash.replace("#", "") === "board";
}

function getPageFromHash(): AppPage {
  const value = window.location.hash.replace("#", "") as AppPage;
  return prototypePages.includes(value) ? value : "agenda";
}

export function useAgendaPrototypeNavigation() {
  const [currentPage, setCurrentPageRaw] = useState<AppPage>(() => getPageFromHash());
  const [previewSelection, setPreviewSelection] = useState<PreviewSelection | null>(() =>
    getPreviewSelectionFromHash()
  );
  const [isBoardRoute, setIsBoardRoute] = useState<boolean>(() => isBoardHash());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [atualizacoesInitialTab, setAtualizacoesInitialTab] =
    useState<AgendaUpdatesInitialTab>("participantes");
  const [returnTo, setReturnTo] = useState<AppPage>("agendaDia");
  const [calendarView, setCalendarView] = useState<AgendaViewMode>("mes");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(() =>
    getDefaultActivityId()
  );

  const navigateTo = useCallback((page: AppPage, replace = false) => {
    setCurrentPageRaw(page);
    if (replace) {
      window.history.replaceState({ page }, "", `#${page}`);
    } else {
      window.history.pushState({ page }, "", `#${page}`);
    }
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      const board = isBoardHash();
      setIsBoardRoute(board);
      if (board) return;
      const preview = getPreviewSelectionFromHash();
      setPreviewSelection(preview);
      if (preview) return;
      const page = getPageFromHash();
      setCurrentPageRaw(page);
      window.history.replaceState({ page }, "", `#${page}`);
    };

    const onPopState = (event: PopStateEvent) => {
      const board = isBoardHash();
      setIsBoardRoute(board);
      if (board) return;
      const preview = getPreviewSelectionFromHash();
      setPreviewSelection(preview);
      if (preview) return;
      if (event.state?.page) setCurrentPageRaw(event.state.page);
      else syncFromLocation();
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", syncFromLocation);
    syncFromLocation();

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", syncFromLocation);
    };
  }, []);

  const handleDayClick = useCallback(
    (day: number) => {
      setSelectedDay(day);
      navigateTo("agendaDia");
    },
    [navigateTo]
  );

  const handleViewDetails = useCallback(
    (activityId?: string) => {
      if (activityId) setSelectedActivityId(activityId);
      setReturnTo(currentPage === "agenda" ? "agenda" : "agendaDia");
      setAtualizacoesInitialTab("participantes");
      navigateTo("atualizacoes");
    },
    [currentPage, navigateTo]
  );

  const handleGoToCheckIn = useCallback(
    (activityId?: string) => {
      if (activityId) setSelectedActivityId(activityId);
      setReturnTo(currentPage === "agenda" ? "agenda" : "agendaDia");
      setAtualizacoesInitialTab("participantes");
      navigateTo("atualizacoes");
    },
    [currentPage, navigateTo]
  );

  const handleBackToActivities = useCallback(() => {
    navigateTo(returnTo);
  }, [navigateTo, returnTo]);

  const handleBackToAgenda = useCallback(() => {
    navigateTo("agenda");
  }, [navigateTo]);

  const handleNewActivity = useCallback(() => {
    navigateTo("novaAtividade");
  }, [navigateTo]);

  return {
    atualizacoesInitialTab,
    calendarView,
    currentPage,
    handleBackToActivities,
    handleBackToAgenda,
    handleDayClick,
    handleGoToCheckIn,
    handleNewActivity,
    handleViewDetails,
    isBoardRoute,
    navigateTo,
    previewSelection,
    selectedActivityId,
    selectedDay,
    setCalendarView,
  };
}

export type { PreviewBase, PreviewSelection };
