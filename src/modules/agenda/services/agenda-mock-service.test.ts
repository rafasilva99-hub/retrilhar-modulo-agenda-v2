import { describe, expect, it } from "vitest";

import {
  allHolidays,
  isEligibleForBulkAction,
  mockActivities,
  mockReservations,
  reservationStateMachine,
} from "@/mocks/agenda";

import {
  getActivityDetails,
  getAgendaDayViewModel,
  getAgendaMonthViewModel,
  getAgendaUpdatesViewModel,
  getDefaultActivityId,
  listActivities,
  listActivitiesByDay,
} from "./agenda-mock-service";

describe("agenda mock service", () => {
  it("keeps activities sorted by date and start time", () => {
    const activities = listActivities();
    const sortedKeys = activities.map((activity) => `${activity.date} ${activity.startTime}`);

    expect(activities).toHaveLength(mockActivities.length);
    expect(sortedKeys).toEqual([...sortedKeys].sort());
  });

  it("returns empty day models for days without activities", () => {
    const day = 31;
    const activities = listActivitiesByDay(day);
    const viewModel = getAgendaDayViewModel(day);

    expect(activities).toEqual(viewModel.activities);
    expect(viewModel.activities).toHaveLength(0);
    expect(viewModel.activityCount).toBe(0);
    expect(viewModel.holidayName).toBeUndefined();
  });

  it("falls back to the default activity for update view models", () => {
    const defaultActivityId = getDefaultActivityId();
    const viewModel = getAgendaUpdatesViewModel("unknown-activity");

    expect(getActivityDetails("unknown-activity")).toBeUndefined();
    expect(viewModel.activity.id).toBe(defaultActivityId);
    expect(viewModel.usedFallbackActivity).toBe(true);
    expect(viewModel.reservations).toHaveLength(mockReservations.length);
    expect(viewModel.participantCount).toBeGreaterThan(0);
    expect(viewModel.allowedReservationTransitions).toEqual(reservationStateMachine);
    expect(
      isEligibleForBulkAction(viewModel.reservations, "check-in").eligible.length
    ).toBeGreaterThan(0);
  });

  it("builds month and holiday view models from public mock exports", () => {
    const viewModel = getAgendaMonthViewModel();

    expect(viewModel.activities).toEqual(listActivities());
    expect(viewModel.holidays).toEqual(allHolidays);
    expect(viewModel.stats.length).toBeGreaterThanOrEqual(4);
    expect(viewModel.defaultActivityId).toBe(getDefaultActivityId());
  });
});
