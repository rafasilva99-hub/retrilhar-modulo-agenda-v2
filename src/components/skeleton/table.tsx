import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SkeletonTableProps = {
  readonly rows?: number;
  readonly columns?: number;
  readonly withHeader?: boolean;
  readonly className?: string;
};

function SkeletonTable({
  rows = 5,
  columns = 4,
  withHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      <Table>
        {withHeader ? (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        ) : null}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { SkeletonTable };
export type { SkeletonTableProps };
