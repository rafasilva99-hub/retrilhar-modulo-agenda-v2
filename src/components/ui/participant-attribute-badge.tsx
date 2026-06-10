import { cn } from "@/lib/utils";

import { BadgeTooltip } from "./badge-tooltip";

export type AttributeBadgeCategory =
  | "image-term"
  | "health-alert"
  | "insurance"
  | "additional-items"
  | "health-plan"
  | "special-needs"
  | "dietary-restriction"
  // Extended categories per Cati 27/05 spec
  | "allergy"
  | "medication"
  | "mobility"
  | "payment"
  | "status";

export type AttributeBadgeVariant =
  | "authorized"
  | "refused"
  | "pending"
  | "alert"
  | "optional-missing"
  | "mandatory-missing"
  | "contracted"
  | "present"
  // Extended variants per Cati 27/05 spec
  | "insurance-pending" // Seguro pendente
  | "insurance-rejected" // Seguro recusado
  | "awaiting-payment" // Aguardando pagamento
  | "partial-payment" // Pagamento parcial
  | "refunded" // Reembolsado
  | "check-in-done" // Check-in OK
  | "no-show" // Não compareceu
  | "cancelled" // Cancelada
  | "rescheduled" // Reagendada
  | "paid"; // Pago

interface ParticipantAttributeBadgeProps {
  category: AttributeBadgeCategory;
  variant: AttributeBadgeVariant;
  tooltipLabel: string;
  showLabel?: boolean;
}

// Simple, clean icon paths
const iconPaths = {
  camera:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20z M12 6v6l4 2",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "shield-check": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  "shield-x": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M10 10l4 4 M14 10l-4 4",
  "shield-clock": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4l2 2",
  "shopping-bag": "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 11-8 0",
  "medical-cross": "M9 3h6v6h6v6h-6v6H9v-6H3v-6h6V3z",
  wheelchair:
    "M12 6a2 2 0 100-4 2 2 0 000 4z M8 22a4 4 0 110-8 4 4 0 010 8z M8 14h4l2-4h-6 M14 10l4 12",
  utensils: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2 M7 2v20 M17 2v7a3 3 0 006 0V2 M20 9v13",
  // New icons for extended badges
  "alert-circle": "M12 2a10 10 0 100 20 10 10 0 000-20z M12 8v4 M12 16h.01",
  pill: "M10.5 4.5l9 9a4.95 4.95 0 01-7 7l-9-9a4.95 4.95 0 017-7z M10.5 13.5l3-3",
  "user-x":
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M17 8l5 5 M22 8l-5 5",
  "user-check":
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M16 11l2 2 4-4",
  "credit-card": "M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z M1 10h22",
  "dollar-02": [
    "M18.4167 8.14815C18.4167 5.85719 15.5438 4 12 4C8.45617 4 5.58333 5.85719 5.58333 8.14815C5.58333 10.4391 7.33333 11.7037 12 11.7037C16.6667 11.7037 19 12.8889 19 15.8519C19 18.8148 15.866 20 12 20C8.13401 20 5 18.1428 5 15.8519",
    "M12 2V22",
  ],
  "calendar-x":
    "M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z M16 2v4 M8 2v4 M3 10h18 M10 14l4 4 M14 14l-4 4",
  "calendar-check":
    "M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z M16 2v4 M8 2v4 M3 10h18 M9 16l2 2 4-4",
  "refresh-cw":
    "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  walking: "M12 4a2 2 0 100-4 2 2 0 000 4z M14 10l4 4v6 M10 10l-4 4v6 M12 10v6 M8 10h8",
  stethoscope: [
    "M13.0014 2C14.1053 2 15.0003 2.93126 15.0003 4.08003C15.0003 5.02915 15.0362 5.87375 14.2692 6.57196C11.7587 8.85732 10.5034 10 9.00027 10C7.49714 10 6.24187 8.85732 3.73133 6.57196C2.96426 5.87369 3.00027 5.029 3.00027 4.07981C3.00027 2.93116 3.8951 2 4.99893 2",
    "M9 14V17.4998C9 19.9852 11.0149 22.0001 13.5003 22.0001C15.9858 22.0001 18.0007 19.9852 18.0007 17.4998V16",
    "M14 7L12.6978 10.2556C12.3516 11.121 12.1785 11.5537 11.8887 11.9092C11.5988 12.2648 11.2098 12.5215 10.4319 13.0349L8.9696 14L7.53283 13.0323C6.77221 12.5201 6.39189 12.2639 6.10821 11.9126C5.82452 11.5613 5.65423 11.1356 5.31365 10.2841L4 7",
    "M21 13C21 14.6569 19.6569 16 18 16C16.3431 16 15 14.6569 15 13C15 11.3431 16.3431 10 18 10C19.6569 10 21 11.3431 21 13Z",
    "M18.008 13L17.999 13",
  ],
};

// Short support text for each category + variant combination
const getShortLabel = (
  category: AttributeBadgeCategory,
  variant: AttributeBadgeVariant
): string => {
  switch (category) {
    case "image-term":
      if (variant === "authorized") return "Autorizado";
      if (variant === "refused") return "Recusado";
      return "Pendente";

    case "health-alert":
      return "Atenção";

    case "insurance":
      if (variant === "contracted") return "Segurado";
      if (variant === "mandatory-missing") return "Sem seguro";
      if (variant === "insurance-pending") return "Seguro pendente";
      if (variant === "insurance-rejected") return "Seguro recusado";
      return "Opcional";

    case "additional-items":
      return "Itens";

    case "health-plan":
      return "Plano";

    case "special-needs":
      return "PcD";

    case "dietary-restriction":
      return "Dieta";

    case "allergy":
      return "Alergia";

    case "medication":
      return "Medicamento";

    case "mobility":
      return "Mobilidade";

    case "payment":
      if (variant === "paid") return "Pago";
      if (variant === "awaiting-payment") return "Aguardando pagamento";
      if (variant === "partial-payment") return "Pagamento parcial";
      if (variant === "refunded") return "Reembolsado";
      if (variant === "alert") return "Falha no pagamento";
      return "";

    case "status":
      if (variant === "check-in-done") return "Check-in OK";
      if (variant === "no-show") return "Não compareceu";
      if (variant === "cancelled") return "Cancelada";
      if (variant === "rescheduled") return "Reagendada";
      if (variant === "pending") return "Confirmada";
      if (variant === "awaiting-payment") return "Agendada";
      if (variant === "alert") return "Expirada";
      return "";

    default:
      return "";
  }
};

const getIconConfig = (category: AttributeBadgeCategory, variant: AttributeBadgeVariant) => {
  let color = "#717680";
  const bgColor = "bg-white";
  let textColor = "text-[#717680]";
  let iconPath = "";
  let iconPaths_multi: string[] | null = null;
  const customViewBox: string | null = null;

  switch (category) {
    case "image-term":
      if (variant === "authorized") {
        color = "#079455";
        textColor = "text-[#079455]";
        iconPath = iconPaths["camera"];
      } else if (variant === "refused") {
        color = "#D92D20";
        textColor = "text-[#D92D20]";
        iconPath = iconPaths["camera"];
      } else {
        color = "#F79009";
        textColor = "text-[#F79009]";
        iconPath = iconPaths["camera"];
      }
      break;

    case "health-alert":
      color = "#6941C6";
      textColor = "text-[#6941C6]";
      iconPaths_multi = iconPaths["stethoscope"];
      break;

    case "insurance":
      if (variant === "contracted") {
        color = "#079455";
        textColor = "text-[#079455]";
        iconPath = iconPaths["shield-check"];
      } else if (variant === "mandatory-missing") {
        color = "#D92D20";
        textColor = "text-[#D92D20]";
        iconPath = iconPaths["shield-x"];
      } else if (variant === "insurance-pending") {
        color = "#F79009";
        textColor = "text-[#F79009]";
        iconPath = iconPaths["shield-clock"];
      } else if (variant === "insurance-rejected") {
        color = "#D92D20";
        textColor = "text-[#D92D20]";
        iconPath = iconPaths["shield-x"];
      } else {
        color = "#717680";
        textColor = "text-[#717680]";
        iconPath = iconPaths["shield"];
      }
      break;

    case "additional-items":
      color = "#7F56D9";
      textColor = "text-[#7F56D9]";
      iconPath = iconPaths["shopping-bag"];
      break;

    case "health-plan":
      color = "#0891B2";
      textColor = "text-[#0891B2]";
      iconPath = iconPaths["medical-cross"];
      break;

    case "special-needs":
      color = "#4F46E5";
      textColor = "text-[#4F46E5]";
      iconPath = iconPaths["wheelchair"];
      break;

    case "dietary-restriction":
      color = "#F79009";
      textColor = "text-[#F79009]";
      iconPath = iconPaths["utensils"];
      break;

    case "allergy":
      color = "#D92D20";
      textColor = "text-[#D92D20]";
      iconPath = iconPaths["alert-circle"];
      break;

    case "medication":
      color = "#7F56D9";
      textColor = "text-[#7F56D9]";
      iconPath = iconPaths["pill"];
      break;

    case "mobility":
      color = "#4F46E5";
      textColor = "text-[#4F46E5]";
      iconPath = iconPaths["walking"];
      break;

    case "payment":
      if (variant === "paid") {
        color = "#079455";
        textColor = "text-[#079455]";
        iconPaths_multi = iconPaths["dollar-02"];
      } else if (variant === "awaiting-payment") {
        color = "#F79009";
        textColor = "text-[#F79009]";
        iconPaths_multi = iconPaths["dollar-02"];
      } else if (variant === "partial-payment") {
        color = "#F79009";
        textColor = "text-[#F79009]";
        iconPaths_multi = iconPaths["dollar-02"];
      } else if (variant === "refunded") {
        color = "#717680";
        textColor = "text-[#717680]";
        iconPath = iconPaths["refresh-cw"];
      } else if (variant === "alert") {
        color = "#D92D20";
        textColor = "text-[#D92D20]";
        iconPaths_multi = iconPaths["dollar-02"];
      }
      break;

    case "status":
      if (variant === "check-in-done") {
        color = "#079455";
        textColor = "text-[#079455]";
        iconPath = iconPaths["user-check"];
      } else if (variant === "no-show") {
        color = "#717680";
        textColor = "text-[#717680]";
        iconPath = iconPaths["user-x"];
      } else if (variant === "cancelled") {
        color = "#D92D20";
        textColor = "text-[#D92D20]";
        iconPath = iconPaths["calendar-x"];
      } else if (variant === "rescheduled") {
        color = "#0b5ed7";
        textColor = "text-[#0b5ed7]";
        iconPath = iconPaths["calendar-check"];
      } else if (variant === "pending") {
        color = "#0b5ed7";
        textColor = "text-[#0b5ed7]";
        iconPath = iconPaths["check"];
      } else if (variant === "awaiting-payment") {
        color = "#F79009";
        textColor = "text-[#F79009]";
        iconPath = iconPaths["clock"];
      } else if (variant === "alert") {
        color = "#717680";
        textColor = "text-[#717680]";
        iconPath = iconPaths["clock"];
      }
      break;
  }

  return { color, bgColor, textColor, iconPath, iconPaths_multi, customViewBox };
};

function parseBadgeTooltip(label: string): { title: string; subtitle?: string } {
  const parts = label.split(" — ");
  return { title: parts[0] || label, subtitle: parts.length > 1 ? parts[1] : undefined };
}

export function ParticipantAttributeBadge({
  category,
  variant,
  tooltipLabel,
  showLabel = false,
}: ParticipantAttributeBadgeProps) {
  const { color, bgColor, textColor, iconPath, iconPaths_multi, customViewBox } = getIconConfig(
    category,
    variant
  );
  const shortLabel = getShortLabel(category, variant);
  const vb = customViewBox || "0 0 24 24";
  const sw = customViewBox ? "1.2" : "1.5";

  if (showLabel) {
    return (
      <div className="group relative">
        <div
          className={cn(
            "flex items-center gap-[6px] rounded-full border border-[#e4e4e7] px-[8px] py-[4px] whitespace-nowrap",
            bgColor
          )}
        >
          <svg
            className="size-[14px] shrink-0"
            fill="none"
            viewBox={vb}
            strokeWidth={sw}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {iconPaths_multi ? (
              iconPaths_multi.map((d, idx) => <path key={idx} d={d} />)
            ) : (
              <path d={iconPath} />
            )}
          </svg>
          <span
            className={cn(
              "font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-none",
              textColor
            )}
          >
            {shortLabel}
          </span>
        </div>
        <BadgeTooltip {...parseBadgeTooltip(tooltipLabel)} />
      </div>
    );
  }

  return (
    <div className="group relative">
      <div
        className={cn(
          "flex size-[24px] shrink-0 items-center justify-center rounded-full border border-[#e4e4e7]",
          bgColor
        )}
      >
        <svg
          className="size-[14px]"
          fill="none"
          viewBox={vb}
          strokeWidth={sw}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {iconPaths_multi ? (
            iconPaths_multi.map((d, idx) => <path key={idx} d={d} />)
          ) : (
            <path d={iconPath} />
          )}
        </svg>
      </div>
      <BadgeTooltip {...parseBadgeTooltip(tooltipLabel)} />
    </div>
  );
}
