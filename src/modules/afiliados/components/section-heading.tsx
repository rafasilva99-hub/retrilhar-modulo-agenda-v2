import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  readonly title: string;
  readonly description?: string;
  readonly icon?: IconSvgElement;
  readonly action?: ReactNode;
  readonly className?: string;
};

function SectionHeading({ title, description, icon, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      {icon ? (
        <span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-[10px]">
          <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
        </span>
      ) : null}
      <div className={cn("min-w-0", action && "flex-1")}>
        <h2 className="text-foreground truncate text-sm font-normal">{title}</h2>
        {description ? (
          <p className="text-muted-foreground truncate text-xs">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
