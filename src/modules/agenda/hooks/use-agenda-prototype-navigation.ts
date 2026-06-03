import { useCallback, useEffect, useState } from "react";

import type { AppPage } from "@/mocks/shell";

import { getDefaultActivityId } from "../services/agenda-mock-service";
import type { AgendaViewMode } from "../types";

const prototypePages: AppPage[] = ["intro", "contexto", "agenda", "agendaDia", "atualizacoes", "novaAtividade"];

type AgendaUpdatesInitialTab = "atualizacoes" | "participantes" | "visao-geral";

function getPageFromHash(): AppPage {
  const value = window.location.hash.replace("#", "") as AppPage;
  return prototypePages.includes(value) ? value : "agenda";
}

export function useAgendaPrototypeNavigation() {
  const [currentPage, setCurrentPageRaw] = useState<AppPage>(() => getPageFromHash());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [atualizacoesInitialTab, setAtualizacoesInitialTab] =
    useState<AgendaUpdatesInitialTab>("atualizacoes");
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
    const onPopState = (event: PopStateEvent) => {
      if (event.state?.page) setCurrentPageRaw(event.state.page);
      else setCurrentPageRaw(getPageFromHash());
    };

    window.addEventListener("popstate", onPopState);

    const initialPage = getPageFromHash();
    setCurrentPageRaw(initialPage);
    window.history.replaceState({ page: initialPage }, "", `#${initialPage}`);

    return () => window.removeEventListener("popstate", onPopState);
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
    navigateTo,
    selectedActivityId,
    selectedDay,
    setCalendarView,
  };
}
