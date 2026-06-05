import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonCardProps = {
  readonly className?: string;
  readonly showHeader?: boolean;
  readonly showFooter?: boolean;
  readonly contentHeight?: string;
};

function SkeletonCard({
  className,
  showHeader = true,
  showFooter = true,
  contentHeight = "h-10",
}: SkeletonCardProps) {
  return (
    <Card className={cn(className)}>
      {showHeader ? (
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
      ) : null}
      <CardContent className={contentHeight} />
      {showFooter ? (
        <CardFooter>
          <Skeleton className="h-8 w-[120px]" />
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { SkeletonCard };
export type { SkeletonCardProps };
