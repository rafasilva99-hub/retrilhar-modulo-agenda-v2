import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ReservationType } from "../../types";

import type { IndicatorConfig, IndicatorTone } from "./agenda-status-config";

const toneClasses: Record<IndicatorTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  destructive: "border-destructive/20 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

function AgendaStatusIndicator({
  className,
  label,
  tone,
}: IndicatorConfig & { className?: string }) {
  return (
    <Badge
      variant="outline"
      data-tone={tone}
      className={cn("rounded px-2 py-0.5 font-normal", toneClasses[tone], className)}
    >
      {label}
    </Badge>
  );
}

function ReservationTypeIndicator({
  className,
  count,
  type,
}: {
  className?: string;
  count: number;
  type: ReservationType;
}) {
  const label = type === "group" ? "Reserva em grupo" : "Reserva individual";

  return (
    <span
      aria-label={label}
      data-tone="neutral"
      className={cn(
        "border-border bg-muted text-muted-foreground inline-flex h-6 min-w-6 items-center justify-center rounded border px-2 text-xs font-medium",
        className
      )}
    >
      {count}
    </span>
  );
}

export { AgendaStatusIndicator, ReservationTypeIndicator };
