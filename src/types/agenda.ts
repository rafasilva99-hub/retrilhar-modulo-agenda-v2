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
export type ActivityStatus = "confirmed" | "pending" | "blocked" | "full";

/**
 * Lifecycle status of an activity (for the Day Panel cards).
 * Different from the calendar chip status above.
 */
export type ActivityLifecycleStatus = "NaoIniciada" | "EmAndamento" | "Realizada" | "Cancelada";

export type ActivityType = "comum" | "multi-dias";

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
  | "Draft"
  | "Scheduled"
  | "Confirmed"
  | "CheckedIn"
  | "Performed"
  | "Cancelled"
  | "Expired";

export type PaymentStatus = "Pending" | "Partial" | "Paid" | "Refunded" | "Failed";

export type InsuranceStatus =
  | "NotRequired"
  | "Required" // activity requires it but customer hasn't contracted yet
  | "Pending" // waiting for provider response
  | "Contracted" // insurance confirmed and active
  | "Declined"; // customer explicitly declined (not applicable when required)

export type ImageTermStatus = "Authorized" | "Refused" | "Pending";

export type TariffType =
  | "Adulto Meia-Entrada Estudante com Transporte e Seguro Incluso"
  | "Criança até 12 anos acompanhada"
  | "Cortesia Operacional / Convidado"
  | "Excursão Escolar Educativa (turma)"
  | (string & {});

export type CheckInStatus = "Pending" | "Done" | "Absent" | "Cancelled" | "Scheduled" | "Rescheduled";

export type ReservationType = "individual" | "group";

export type ReservationOrigin = "Site" | "B2B" | "Manual" | "Importada" | "API parceiro";

export type PaymentMethod = "PIX" | "Cartão" | "Dinheiro" | "Transferência" | "Boleto";

// ─────────────────────────────────────────────────────────────────────────────
// Participant — drawer detail types
// ─────────────────────────────────────────────────────────────────────────────

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthDetails {
  allergies?: string[];
  medications?: string[];
  chronicConditions?: string[];
  bloodType?: string;
  healthPlanProvider?: string;
  healthPlanNumber?: string;
}

export interface AccessibilityInfo {
  type: string;
  equipment?: string[];
  requiresCompanion: boolean;
  companionName?: string;
  adaptations?: string[];
  communicationPreference?: string;
}

export interface ReservationHistoryEvent {
  id: string;
  /** ISO datetime */
  timestamp: string;
  action: string;
  actor: string;
  detail?: string;
}

export interface AdditionalItem {
  name: string;
  price: number;
}

export interface CouponInfo {
  code: string;
  type: "percentual" | "fixo";
  value: number;
  appliedBy: string;
}

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

  // ── Badge attributes ──
  /** Image term authorization status */
  imageTermStatus?: ImageTermStatus;
  /** Insurance status for this participant */
  insuranceStatus?: InsuranceStatus;
  /** Has additional items requested (extra equipment, services) */
  hasAdditionalItems?: boolean;
  /** Has health plan coverage */
  hasHealthPlan?: boolean;
  /** Has special needs (accessibility, mobility) */
  hasSpecialNeeds?: boolean;
  /** Has dietary restrictions */
  hasDietaryRestriction?: boolean;

  // ── Drawer detail fields ──
  phone?: string;
  email?: string;
  /** CPF, RG or passport */
  document?: string;
  emergencyContact?: EmergencyContact;
  guardian?: Guardian;
  healthDetails?: HealthDetails;
  dietaryRestrictions?: string[];
  accessibility?: AccessibilityInfo;
  /** ISO datetime of check-in */
  checkInAt?: string;
  checkInBy?: string;
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

  // ── Drawer detail fields ──
  origin?: ReservationOrigin;
  /** Base price per participant */
  basePrice?: number;
  insurancePrice?: number;
  serviceFeePercent?: number;
  additionalItems?: AdditionalItem[];
  coupon?: CouponInfo;
  paymentMethod?: PaymentMethod;
  /** ISO datetime of payment */
  paidAt?: string;
  /** Card last 4 digits */
  cardLast4?: string;
  /** Number of installments */
  installments?: number;
  /** Insurance policy number */
  insurancePolicyNumber?: string;
  history?: ReservationHistoryEvent[];
  /** Whether this reservation was rescheduled from another activity/date */
  isRescheduled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk Actions
// ─────────────────────────────────────────────────────────────────────────────

export type BulkAction =
  | "check-in"
  | "undo-check-in"
  | "confirm"
  | "undo-confirm"
  | "mark-performed"
  | "add-insurance"
  | "resend-voucher"
  | "reschedule"
  | "no-show"
  | "cancel";

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

export type GuideRole = "Guia Líder" | "Guia de Apoio";
export type GuideStatus = "available" | "conflict";

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
