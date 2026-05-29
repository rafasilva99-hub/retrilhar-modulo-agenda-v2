/**
 * Pure helper functions that derive display data from an Activity object.
 * Used by the DiaActivityCard component to keep rendering logic out of JSX.
 */

import type { Activity, ActivityLifecycleStatus } from "../../types/agenda";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StatusBadgeConfig {
  label: string;
  bg: string;
  border: string;
  text: string;
  icon: "check-circle" | "activity" | "timer" | "cancel-circle";
}

export interface OccupancyDisplay {
  counter: string;
  hasExceededCapacity: boolean;
}

export type ContextualBadgeType = "insurance" | "medical" | "team" | "cancellation";
export type ContextualBadgeColor = "red" | "gray" | "green" | "purple" | "orange";

export interface ContextualBadge {
  type: ContextualBadgeType;
  label: string;
  color: ContextualBadgeColor;
  icon: string;
}

export interface TeamDisplay {
  label: string;
  color: string;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ActivityLifecycleStatus, StatusBadgeConfig> = {
  Realizada: {
    label: "Atividade Realizada",
    bg: "#ecfdf3",
    border: "#dcfae6",
    text: "#079455",
    icon: "check-circle",
  },
  EmAndamento: {
    label: "Atividade em Andamento",
    bg: "#fffaeb",
    border: "#fef0c7",
    text: "#dc6803",
    icon: "activity",
  },
  NaoIniciada: {
    label: "Atividade Não Iniciada",
    bg: "#fafafa",
    border: "#f5f5f5",
    text: "#535862",
    icon: "timer",
  },
  Cancelada: {
    label: "Atividade Cancelada",
    bg: "#fef3f2",
    border: "#fee4e2",
    text: "#d92d20",
    icon: "cancel-circle",
  },
};

export function getActivityStatusBadge(activity: Activity): StatusBadgeConfig {
  return STATUS_CONFIG[activity.lifecycleStatus];
}

// ─── Occupancy ───────────────────────────────────────────────────────────────

export function getOccupancyDisplay(activity: Activity): OccupancyDisplay {
  return {
    counter: `(${activity.occupancy}/${activity.capacity})`,
    hasExceededCapacity: activity.occupancy > activity.capacity,
  };
}

// ─── Contextual Badges ───────────────────────────────────────────────────────

function formatShortDate(isoDate: string): string {
  const [, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

export function getContextualBadges(activity: Activity): ContextualBadge[] {
  if (activity.lifecycleStatus === "Cancelada") {
    return [
      {
        type: "cancellation",
        label: `Atividade cancelada por razões de: "${activity.cancellationReason || "Motivo não informado"}"`,
        color: "orange",
        icon: "alert-circle",
      },
    ];
  }

  const badges: ContextualBadge[] = [];

  // 1. Insurance (always present)
  if (!activity.requiresInsurance) {
    badges.push({ type: "insurance", label: "Seguro opcional", color: "gray", icon: "shield" });
  } else if (activity.allParticipantsInsured) {
    badges.push({
      type: "insurance",
      label: "Todos os participantes estão assegurados",
      color: "green",
      icon: "shield-check",
    });
  } else {
    badges.push({
      type: "insurance",
      label: "Seguro obrigatório",
      color: "red",
      icon: "shield-alert",
    });
  }

  // 2. Medical attention (conditional)
  if (activity.participantsNeedingMedicalAttention > 0) {
    badges.push({
      type: "medical",
      label: `${activity.participantsNeedingMedicalAttention} participantes precisam de atenção médica`,
      color: "purple",
      icon: "stethoscope",
    });
  }

  // 3. Team not assigned (conditional)
  if (activity.assignedGuides.length === 0 && activity.teamAssignmentDeadline) {
    badges.push({
      type: "team",
      label: `Equipe responsável deve ser atribuída até ${formatShortDate(activity.teamAssignmentDeadline)}`,
      color: "orange",
      icon: "alert-circle",
    });
  }

  return badges;
}

// ─── Team Display ────────────────────────────────────────────────────────────

export function getTeamDisplay(activity: Activity): TeamDisplay {
  if (activity.assignedGuides.length > 0) {
    return {
      label: `${activity.assignedGuides.length} guia(s) atribuído(s)`,
      color: "#252b37",
    };
  }
  return {
    label: "Sem equipe atribuída",
    color: "#dc6803",
  };
}

// ─── Date Display ────────────────────────────────────────────────────────────

export function getDateDisplay(activity: Activity): string {
  const [y, m, d] = activity.date.split("-");
  const dateStr = `${d}/${m}/${y}`;
  if (activity.activityType === "multi-dias" && activity.dayNumber && activity.totalDays) {
    return `${dateStr} (Dia ${activity.dayNumber} de ${activity.totalDays})`;
  }
  return dateStr;
}

export function getMultiDayRange(activity: Activity): string | null {
  if (
    activity.activityType !== "multi-dias" ||
    !activity.startDate ||
    !activity.endDate ||
    !activity.totalDays
  ) {
    return null;
  }
  const [sy, sm, sd] = activity.startDate.split("-");
  const [ey, em, ed] = activity.endDate.split("-");
  return `${sd}/${sm}/${sy} - ${ed}/${em}/${ey} (${activity.totalDays} dias)`;
}
