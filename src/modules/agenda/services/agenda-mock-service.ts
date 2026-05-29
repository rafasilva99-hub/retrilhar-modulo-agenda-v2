import { format } from "date-fns";

import { allHolidays, mockActivities } from "@/mocks/agenda";

import type { Activity } from "../types";

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
