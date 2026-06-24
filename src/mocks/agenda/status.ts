/**
 * Reservation status transition and bulk-action helpers for Agenda mocks.
 */

import type {
  BulkAction,
  BulkActionResult,
  Reservation,
  ReservationStateMachine,
} from "../../types/agenda";

// 3. reservationStateMachine
//
// Maps each status to the list of statuses it can legally transition into.
// An empty array means the status is terminal.
// ─────────────────────────────────────────────────────────────────────────────

export const reservationStateMachine: ReservationStateMachine = {
  Draft: ["Scheduled", "Confirmed", "Cancelled"],
  Scheduled: ["Confirmed", "Cancelled"],
  Confirmed: ["CheckedIn", "Cancelled", "Scheduled"],
  CheckedIn: ["Confirmed"],
  Performed: ["Confirmed"],
  Cancelled: ["Confirmed"],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. isEligibleForBulkAction
//
// Returns which of the provided reservations are eligible for a given action
// and which are not, along with a human-readable reason.
// ─────────────────────────────────────────────────────────────────────────────

type EligibilityRule = {
  test: (r: Reservation) => boolean;
  reason: string;
};

const ELIGIBILITY_RULES: Record<BulkAction, EligibilityRule> = {
  "check-in": {
    test: (r) => r.status === "Confirmed",
    reason: "Somente reservas com status Confirmada podem realizar check-in.",
  },
  "undo-check-in": {
    test: (r) => r.status === "CheckedIn",
    reason: "Somente reservas com check-in realizado podem desfazer o check-in.",
  },
  confirm: {
    test: (r) => r.status === "Scheduled" || r.status === "Draft",
    reason: "Somente reservas agendadas ou em rascunho podem ser confirmadas.",
  },
  "undo-confirm": {
    test: (r) => r.status === "Confirmed",
    reason: "Somente reservas confirmadas podem ter a confirmação desfeita.",
  },
  "mark-performed": {
    test: (r) => r.status === "CheckedIn" || (r.status === "Confirmed" && r.participants.some((p) => p.checkInStatus === "Done")),
    reason: "Somente reservas com check-in realizado podem ser marcadas como realizadas.",
  },
  "add-insurance": {
    test: (r) =>
      (r.status === "Confirmed" || r.status === "CheckedIn") && r.insuranceStatus !== "Contracted",
    reason:
      "Somente reservas confirmadas ou com check-in realizado que ainda não possuem seguro contratado podem adicionar seguro.",
  },
  "resend-voucher": {
    test: (r) => r.status === "Confirmed" || r.status === "CheckedIn",
    reason: "Somente reservas confirmadas ou com check-in realizado podem ter o voucher reenviado.",
  },
  reschedule: {
    test: (r) => r.status === "Scheduled" || r.status === "Confirmed",
    reason: "Somente reservas agendadas ou confirmadas podem ser reagendadas.",
  },
  "no-show": {
    test: (r) => r.status === "Confirmed",
    reason: "Somente reservas confirmadas podem ser marcadas como não comparecimento.",
  },
  cancel: {
    test: (r) =>
      r.status !== "Performed" &&
      r.status !== "Cancelled",
    reason:
      "Reservas realizadas ou canceladas não podem ser canceladas.",
  },
};

export function isEligibleForBulkAction(
  reservations: Reservation[],
  action: BulkAction
): BulkActionResult {
  const rule = ELIGIBILITY_RULES[action];
  const eligible = reservations.filter((r) => rule.test(r));
  const ineligible = reservations.filter((r) => !rule.test(r));
  return { eligible, ineligible, reason: rule.reason };
}
