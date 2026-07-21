import { UserStar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AffiliateEmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly icon?: IconSvgElement;
  readonly action?: ReactNode;
  readonly className?: string;
};

function AffiliateEmptyState({
  title,
  description,
  icon = UserStar01Icon,
  action,
  className,
}: AffiliateEmptyStateProps) {
  return (
    <Card
      className={cn(
        "border-border bg-muted/30 rounded-2xl border border-dashed shadow-none",
        className
      )}
    >
      <CardContent className="flex min-h-52 flex-col items-center justify-center gap-2 p-8 text-center">
        <HugeiconsIcon
          icon={icon}
          size={40}
          className="text-muted-foreground/50 mb-2"
          aria-hidden="true"
        />
        <h3 className="text-foreground text-base font-medium">{title}</h3>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

const EmptyState = AffiliateEmptyState;

export { AffiliateEmptyState, EmptyState };
export type { AffiliateEmptyStateProps };
