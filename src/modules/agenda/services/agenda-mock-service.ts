import { format } from "date-fns";

import {
  allHolidays,
  mockActivities,
  mockDashboardStats,
  mockGuides,
  mockReservations,
  reservationStateMachine,
} from "@/mocks/agenda";

import type { Activity, GuideStatus, Reservation, ReservationStateMachine } from "../types";

type AgendaDashboardStat = (typeof mockDashboardStats)[keyof typeof mockDashboardStats];

export interface AgendaGuideSummary {
  id: string;
  initials: string;
  name: string;
  role: string;
  status: GuideStatus;
  conflictNote?: string;
}

export interface AgendaMonthViewModel {
  activities: Activity[];
  defaultActivityId: string;
  holidays: Record<string, string>;
  stats: AgendaDashboardStat[];
}

export interface AgendaDayViewModel {
  activities: Activity[];
  activityCount: number;
  day: number;
  holidayName?: string;
}

export interface AgendaUpdatesViewModel {
  activity: Activity;
  allowedReservationTransitions: ReservationStateMachine;
  participantCount: number;
  reservations: Reservation[];
  responsibleTeam: AgendaGuideSummary[];
  usedFallbackActivity: boolean;
}

function isoForCurrentMonthDay(day: number): string {
  const today = new Date();
  return format(new Date(today.getFullYear(), today.getMonth(), day), "yyyy-MM-dd");
}

export function listActivities(): Activity[] {
  return [...mockActivities].sort((a, b) =>
    `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
  );
}

export function listActivitiesByDay(day: number): Activity[] {
  const iso = isoForCurrentMonthDay(day);
  return mockActivities
    .filter((activity) => activity.date === iso)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getActivityDetails(activityId: string): Activity | undefined {
  return mockActivities.find((activity) => activity.id === activityId);
}

export function getDefaultActivityId(): string {
  return mockActivities[0]?.id ?? "act-001";
}

export function getHolidayForDay(day: number): string | undefined {
  return allHolidays[isoForCurrentMonthDay(day)];
}

function getRequiredDefaultActivity(): Activity {
  const activity = mockActivities[0];

  if (!activity) {
    throw new Error("Agenda mock activities are empty.");
  }

  return activity;
}

export function getAgendaMonthViewModel(): AgendaMonthViewModel {
  return {
    activities: listActivities(),
    defaultActivityId: getDefaultActivityId(),
    holidays: allHolidays,
    stats: Object.values(mockDashboardStats),
  };
}

export function getAgendaDayViewModel(day: number): AgendaDayViewModel {
  const activities = listActivitiesByDay(day);

  return {
    activities,
    activityCount: activities.length,
    day,
    holidayName: getHolidayForDay(day),
  };
}

export function getResponsibleTeamViewModel(activityId?: string): AgendaGuideSummary[] {
  const activity = activityId ? getActivityDetails(activityId) : undefined;
  const assignedGuideNames = new Set(activity?.assignedGuides ?? []);
  const guides = assignedGuideNames.size
    ? mockGuides.filter((guide) => assignedGuideNames.has(guide.name))
    : mockGuides;

  return guides.map((guide) => ({
    id: guide.id,
    initials: guide.initials,
    name: guide.name,
    role: guide.role,
    status: guide.status,
    conflictNote: guide.conflictNote,
  }));
}

export function getAgendaUpdatesViewModel(activityId?: string): AgendaUpdatesViewModel {
  const fallbackActivity = getRequiredDefaultActivity();
  const requestedActivity = activityId ? getActivityDetails(activityId) : undefined;
  const activity = requestedActivity ?? fallbackActivity;

  return {
    activity,
    allowedReservationTransitions: reservationStateMachine,
    participantCount: mockReservations.reduce(
      (total, reservation) => total + reservation.participants.length,
      0
    ),
    reservations: [...mockReservations],
    responsibleTeam: getResponsibleTeamViewModel(activity.id),
    usedFallbackActivity: !requestedActivity,
  };
}
