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

/**
 * Lifecycle status of an activity (for the Day Panel cards).
 * Different from the calendar chip status above.
 */
export type ActivityLifecycleStatus = 'NaoIniciada' | 'EmAndamento' | 'Realizada' | 'Cancelada';

export type ActivityType = 'comum' | 'multi-dias';

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

  // ── Day Panel card fields (Prompt 11) ──────────────────────────────────────

  /** Lifecycle status for Day Panel cards */
  lifecycleStatus: ActivityLifecycleStatus;
  /** Activity type for subtitle display */
  activityType: ActivityType;
  /** Timezone label */
  timezone: string;
  /** Number of assigned guides */
  assignedGuides: string[];
  /** Deadline to assign team (ISO date) */
  teamAssignmentDeadline?: string;
  /** Whether all participants have contracted insurance */
  allParticipantsInsured: boolean;
  /** Number of participants needing medical attention */
  participantsNeedingMedicalAttention: number;
  /** Cancellation reason (when lifecycleStatus === 'Cancelada') */
  cancellationReason?: string;
  /** Multi-day: start date of the range */
  startDate?: string;
  /** Multi-day: end date of the range */
  endDate?: string;
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
  /** Participant age in years */
  age: number;
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
