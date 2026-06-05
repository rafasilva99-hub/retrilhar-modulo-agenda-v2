import type { InsuranceStatus, PaymentStatus, ReservationStatus } from "../../types";

type IndicatorTone = "success" | "warning" | "destructive" | "neutral" | "info";

interface IndicatorConfig {
  label: string;
  tone: IndicatorTone;
}

const paymentStatusMap: Record<PaymentStatus, IndicatorConfig> = {
  Paid: { label: "Pago", tone: "success" },
  Partial: { label: "Pagamento parcial", tone: "warning" },
  Pending: { label: "Pagamento pendente", tone: "warning" },
  Refunded: { label: "Reembolsado", tone: "neutral" },
  Failed: { label: "Pagamento falhou", tone: "destructive" },
};

const insuranceStatusMap: Record<InsuranceStatus, IndicatorConfig> = {
  Contracted: { label: "Seguro contratado", tone: "success" },
  NotRequired: { label: "Seguro dispensado", tone: "neutral" },
  Required: { label: "Seguro pendente", tone: "warning" },
  Pending: { label: "Seguro em análise", tone: "warning" },
  Declined: { label: "Seguro recusado", tone: "destructive" },
};

const reservationStatusMap: Record<ReservationStatus, IndicatorConfig> = {
  Draft: { label: "Rascunho", tone: "neutral" },
  AwaitingPayment: { label: "Aguardando pagamento", tone: "warning" },
  Confirmed: { label: "Confirmada", tone: "success" },
  CheckedIn: { label: "Check-in realizado", tone: "success" },
  Performed: { label: "Realizada", tone: "neutral" },
  Cancelled: { label: "Cancelada", tone: "neutral" },
  NoShow: { label: "Não compareceu", tone: "destructive" },
  Expired: { label: "Expirada", tone: "neutral" },
};

function getPaymentStatusIndicator(status: PaymentStatus): IndicatorConfig {
  return paymentStatusMap[status];
}

function getInsuranceStatusIndicator(status: InsuranceStatus): IndicatorConfig {
  return insuranceStatusMap[status];
}

function getReservationStatusIndicator(status: ReservationStatus): IndicatorConfig {
  return reservationStatusMap[status];
}

export { getInsuranceStatusIndicator, getPaymentStatusIndicator, getReservationStatusIndicator };
export type { IndicatorConfig, IndicatorTone };
