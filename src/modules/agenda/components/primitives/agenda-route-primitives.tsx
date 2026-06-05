import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function CalendarSummaryCard({
  count,
  holidayName,
  title,
}: {
  count: number;
  holidayName?: string;
  title: string;
}) {
  return (
    <div className="border-border bg-card text-card-foreground flex min-h-24 flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        <Badge variant="outline">{count > 0 ? `${count} atividades` : "Nenhuma atividade"}</Badge>
      </div>
      {holidayName && (
        <Badge variant="secondary" className="w-fit rounded text-xs">
          {holidayName}
        </Badge>
      )}
    </div>
  );
}

function DayActivityShell({
  className,
  statusLabel,
  timeRange,
  title,
}: {
  className?: string;
  statusLabel: string;
  timeRange: string;
  title: string;
}) {
  return (
    <article
      className={cn("border-border bg-card text-card-foreground rounded-lg border p-4", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground mt-1 text-xs">{timeRange}</p>
        </div>
        <Badge variant="outline" className="rounded text-xs">
          {statusLabel}
        </Badge>
      </div>
    </article>
  );
}

function UpdatesParticipantRow({
  checked = false,
  participantName,
  reservationLabel,
  statusLabel,
}: {
  checked?: boolean;
  participantName: string;
  reservationLabel: string;
  statusLabel: string;
}) {
  return (
    <div className="border-border bg-card text-card-foreground flex items-center gap-3 rounded-lg border p-3">
      <Checkbox checked={checked} aria-label={`Selecionar ${participantName}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{participantName}</p>
        <p className="text-muted-foreground text-xs">{reservationLabel}</p>
      </div>
      <Badge variant="outline" className="rounded text-xs">
        {statusLabel}
      </Badge>
    </div>
  );
}

export { CalendarSummaryCard, DayActivityShell, UpdatesParticipantRow };
