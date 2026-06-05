import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  InformationCircleIcon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardStatsTrend = {
  readonly value: number | string;
  readonly label: string;
  readonly direction: "up" | "down" | "neutral";
};

type CardStatsProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly value: number | string;
  readonly trend?: CardStatsTrend;
  readonly icon?: ReactNode;
  readonly className?: string;
};

const trendIcon = {
  down: ArrowDown01Icon,
  neutral: MinusSignIcon,
  up: ArrowUp01Icon,
} as const;

const trendClassName = {
  down: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400",
  neutral: "border-border bg-muted text-muted-foreground",
  up: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400",
} as const;

function CardStats({
  title,
  subtitle,
  value,
  trend,
  icon = <HugeiconsIcon icon={InformationCircleIcon} size={16} />,
  className,
}: CardStatsProps) {
  return (
    <Card className={cn("border-border gap-4 rounded-xl border p-5 shadow-sm", className)}>
      <div className="flex w-full flex-row items-start justify-between gap-2">
        <div className="flex flex-col justify-center gap-px">
          <span className="text-foreground text-sm font-normal">{title}</span>
          {subtitle ? (
            <span className="text-muted-foreground text-xs font-normal">{subtitle}</span>
          ) : null}
        </div>
        {icon ? <div className="text-muted-foreground size-4 shrink-0">{icon}</div> : null}
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-foreground text-2xl font-normal">{value}</span>

        {trend ? (
          <div className="flex h-6 flex-row items-center gap-2">
            <div
              className={cn(
                "flex flex-row items-center gap-px rounded-lg border px-2 py-1 text-xs",
                trendClassName[trend.direction]
              )}
            >
              <HugeiconsIcon icon={trendIcon[trend.direction]} size={16} />
              <span>{trend.value}</span>
            </div>
            <span className="text-muted-foreground text-xs font-normal">{trend.label}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export { CardStats };
export type { CardStatsProps, CardStatsTrend };
