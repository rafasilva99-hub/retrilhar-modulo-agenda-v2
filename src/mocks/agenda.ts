/**
 * Public compatibility barrel for Agenda mock data.
 *
 * Keep this file stable: maintained services and legacy Figma exports both import
 * from "@/mocks/agenda" or "../../mocks/agenda". Domain data lives under
 * `src/mocks/agenda/**` so future extraction can depend on focused modules
 * without breaking the prototype's existing public mock contract.
 */

export { mockActivities } from "./agenda/activities";
export type { Guide, WeatherDay } from "./agenda/guides";
export { mockActivityDetail, mockDashboardStats, mockGuides, mockWeather } from "./agenda/guides";
export { allHolidays, getBrazilianHolidays } from "./agenda/holidays";
export { mockReservations } from "./agenda/reservations";
export { isEligibleForBulkAction, reservationStateMachine } from "./agenda/status";
