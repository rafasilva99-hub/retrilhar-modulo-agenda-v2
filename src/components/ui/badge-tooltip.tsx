import { cn } from "@/lib/utils";

/**
 * Tooltip position relative to the trigger element.
 *
 * - top / bottom / left / right → centered on that edge
 * - top-start / top-end → top edge, aligned to start (left) or end (right)
 * - bottom-start / bottom-end → bottom edge, aligned to start or end
 */
export type TooltipPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

interface BadgeTooltipProps {
  /** Tooltip title (bold white) */
  title: string;
  /** Optional subtitle (dimmed white/60) */
  subtitle?: string;
  /** Arrow + body position relative to trigger. Default: "top" */
  position?: TooltipPosition;
  className?: string;
}

const positionStyles: Record<
  TooltipPosition,
  { container: string; arrow: string }
> = {
  top: {
    container: "bottom-full left-1/2 -translate-x-1/2 mb-[8px]",
    arrow:
      "top-full left-1/2 -translate-x-1/2 border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent",
  },
  "top-start": {
    container: "bottom-full left-0 mb-[8px]",
    arrow:
      "top-full left-[12px] border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent",
  },
  "top-end": {
    container: "bottom-full right-0 mb-[8px]",
    arrow:
      "top-full right-[12px] border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent",
  },
  bottom: {
    container: "top-full left-1/2 -translate-x-1/2 mt-[8px]",
    arrow:
      "bottom-full left-1/2 -translate-x-1/2 border-b-[5px] border-r-[5px] border-l-[5px] border-b-[#181d27] border-r-transparent border-l-transparent",
  },
  "bottom-start": {
    container: "top-full left-0 mt-[8px]",
    arrow:
      "bottom-full left-[12px] border-b-[5px] border-r-[5px] border-l-[5px] border-b-[#181d27] border-r-transparent border-l-transparent",
  },
  "bottom-end": {
    container: "top-full right-0 mt-[8px]",
    arrow:
      "bottom-full right-[12px] border-b-[5px] border-r-[5px] border-l-[5px] border-b-[#181d27] border-r-transparent border-l-transparent",
  },
  left: {
    container: "right-full top-1/2 -translate-y-1/2 mr-[8px]",
    arrow:
      "left-full top-1/2 -translate-y-1/2 border-l-[5px] border-t-[5px] border-b-[5px] border-l-[#181d27] border-t-transparent border-b-transparent",
  },
  right: {
    container: "left-full top-1/2 -translate-y-1/2 ml-[8px]",
    arrow:
      "right-full top-1/2 -translate-y-1/2 border-r-[5px] border-t-[5px] border-b-[5px] border-r-[#181d27] border-t-transparent border-b-transparent",
  },
};

export function BadgeTooltip({
  title,
  subtitle,
  position = "top",
  className,
}: BadgeTooltipProps) {
  const pos = positionStyles[position];

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-50 rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]",
        pos.container,
        className
      )}
    >
      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16px] text-white not-italic">
        {title}
      </p>
      {subtitle && (
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-[14px] text-white/60 not-italic">
          {subtitle}
        </p>
      )}
      <div className={cn("absolute size-0", pos.arrow)} />
    </div>
  );
}
