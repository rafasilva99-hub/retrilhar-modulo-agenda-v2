// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Visual state of an activity slot in the calendar.
 * - confirmed  → Saída Confirmada  (blue)
 * - pending    → Saída Pendente    (orange)
 * - blocked    → Bloqueio          (gray)
 * - full       → Lotada            (red)
 */
export type ActivityStatus = 'confirmed' | 'pending' | 'blocked' | 'full';

export interface Activity {
  id: string;
  name: string;
  /** ISO date string — YYYY-MM-DD */
  date: string;
  /** 24-hour format — HH:mm */
  startTime: string;
  /** 24-hour format — HH:mm */
  endTime: string;
  capacity: number;
  occupancy: number;
  /** Name of the assigned guide; empty string when unassigned */
  guideName: string;
  status: ActivityStatus;
  requiresInsurance: boolean;
  /** 1-based day index within a multi-day activity */
  dayNumber?: number;
  /** Total number of days for a multi-day activity */
  totalDays?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reservation — state machine statuses
// ─────────────────────────────────────────────────────────────────────────────

export type ReservationStatus =
  | 'Draft'
  | 'AwaitingPayment'
  | 'Confirmed'
  | 'CheckedIn'
  | 'Performed'
  | 'Cancelled'
  | 'NoShow'
  | 'Expired';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Failed';

export type InsuranceStatus =
  | 'NotRequired'
  | 'Required'      // activity requires it but customer hasn't contracted yet
  | 'Contracted'    // insurance confirmed and active
  | 'Declined';     // customer explicitly declined (not applicable when required)

export type TariffType = 'Adulto' | 'Infantil' | 'Cortesia';

export type CheckInStatus = 'Pending' | 'Done' | 'Absent';

export type ReservationType = 'individual' | 'group';

// ─────────────────────────────────────────────────────────────────────────────
// Participant
// ─────────────────────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  name: string;
  tariffType: TariffType;
  checkInStatus: CheckInStatus;
  hasHealthIssue: boolean;
  /** Whether the participant authorized the use of their image */
  hasImageAuth: boolean;
  isMinor: boolean;
  boardingPoint: string;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reservation
// ─────────────────────────────────────────────────────────────────────────────

export interface Reservation {
  id: string;
  /** Human-readable order identifier — format: #RE-XXXX */
  orderId: string;
  type: ReservationType;
  buyerName: string;
  participants: Participant[];
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  insuranceStatus: InsuranceStatus;
  /** ISO datetime string */
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk Actions
// ─────────────────────────────────────────────────────────────────────────────

export type BulkAction =
  | 'check-in'
  | 'undo-check-in'
  | 'confirm'
  | 'undo-confirm'
  | 'mark-performed'
  | 'add-insurance'
  | 'resend-voucher'
  | 'reschedule'
  | 'no-show'
  | 'cancel';

export interface BulkActionResult {
  eligible: Reservation[];
  ineligible: Reservation[];
  /** Human-readable explanation of the eligibility rule */
  reason: string;
}

export type ReservationStateMachine = Record<ReservationStatus, ReservationStatus[]>;

// ─────────────────────────────────────────────────────────────────────────────
// Guide
// ─────────────────────────────────────────────────────────────────────────────

export type GuideRole = 'Guia Líder' | 'Guia de Apoio';
export type GuideStatus = 'available' | 'conflict';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard stats (metric cards)
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  subtitle: string;
  value: number | string;
  trend: string;
  trendLabel: string;
}
