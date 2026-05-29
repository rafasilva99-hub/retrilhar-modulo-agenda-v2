import { cn } from "@/lib/utils";

export type AttributeBadgeCategory =
  | "image-term"
  | "health-alert"
  | "insurance"
  | "additional-items"
  | "health-plan"
  | "special-needs"
  | "dietary-restriction";

export type AttributeBadgeVariant =
  | "authorized"
  | "refused"
  | "pending"
  | "alert"
  | "optional-missing"
  | "mandatory-missing"
  | "contracted"
  | "present";

interface ParticipantAttributeBadgeProps {
  category: AttributeBadgeCategory;
  variant: AttributeBadgeVariant;
  tooltipLabel: string;
}

const iconPaths = {
  "image-authorized":
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z M9 5l2 2 4-4",
  "image-refused":
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z M6 6l12 12",
  "image-pending":
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z M12 8v4 M12 15h.01",
  health:
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z M12 6v6 M9 9h6",
  "shield-check": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  "shield-x": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 9l6 6 M15 9l-6 6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  package:
    "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  briefcase:
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z M20 8v12a2 2 0 01-2 2h-1",
  wheelchair: "M12 5a3 3 0 100-6 3 3 0 000 6z M16 21c0-3.866-3.134-7-7-7v4l-3 3",
  utensils:
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2 M7 2v20 M21 15V2v0c-1.1 0-2 .9-2 2v5h2v0c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2z M19 22v-7",
};

const getIconConfig = (category: AttributeBadgeCategory, variant: AttributeBadgeVariant) => {
  // Color mapping
  let color = "#717680"; // default gray
  const bgColor = "bg-white";
  let iconPath = "";

  switch (category) {
    case "image-term":
      if (variant === "authorized") {
        color = "#079455";
        iconPath = iconPaths["image-authorized"];
      } else if (variant === "refused") {
        color = "#D92D20";
        iconPath = iconPaths["image-refused"];
      } else {
        color = "#F79009";
        iconPath = iconPaths["image-pending"];
      }
      break;

    case "health-alert":
      color = "#F79009";
      iconPath = iconPaths["health"];
      break;

    case "insurance":
      if (variant === "contracted") {
        color = "#079455";
        iconPath = iconPaths["shield-check"];
      } else if (variant === "mandatory-missing") {
        color = "#D92D20";
        iconPath = iconPaths["shield-x"];
      } else {
        color = "#717680";
        iconPath = iconPaths["shield"];
      }
      break;

    case "additional-items":
      color = "#7F56D9";
      iconPath = iconPaths["package"];
      break;

    case "health-plan":
      color = "#7F56D9";
      iconPath = iconPaths["briefcase"];
      break;

    case "special-needs":
      color = "#7F56D9";
      iconPath = iconPaths["wheelchair"];
      break;

    case "dietary-restriction":
      color = "#F79009";
      iconPath = iconPaths["utensils"];
      break;
  }

  return { color, bgColor, iconPath };
};

export function ParticipantAttributeBadge({
  category,
  variant,
  tooltipLabel,
}: ParticipantAttributeBadgeProps) {
  const { color, bgColor, iconPath } = getIconConfig(category, variant);

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
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
      </div>
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-[6px] -translate-x-1/2 rounded-[6px] bg-[#181d27] px-[8px] py-[4px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[normal] text-white not-italic">
          {tooltipLabel}
        </p>
        <div className="absolute top-full left-1/2 size-0 -translate-x-1/2 border-t-[4px] border-r-[4px] border-l-[4px] border-t-[#181d27] border-r-transparent border-l-transparent" />
      </div>
    </div>
  );
}
