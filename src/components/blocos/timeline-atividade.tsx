import { formatarData, formatarHora } from "@/lib/formatadores";
import { cn } from "@/lib/utils";

export interface EventoTimeline {
  readonly id: string;
  readonly titulo: string;
  readonly descricao?: string;
  readonly dataHora?: string; // ISO 8601
  readonly tom?: "neutro" | "alerta" | "info";
}

interface TimelineAtividadeProps {
  readonly eventos: readonly EventoTimeline[];
}

const corDoTom: Record<NonNullable<EventoTimeline["tom"]>, string> = {
  neutro: "bg-muted-foreground/40",
  alerta: "bg-amber-500",
  info: "bg-primary",
};

// Renderização pura: exibe os eventos na ordem recebida, sem derivar estado.
export function TimelineAtividade({ eventos }: TimelineAtividadeProps) {
  return (
    <ul className="space-y-0">
      {eventos.map((evento, indice) => (
        <li key={evento.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mt-1.5 size-2.5 shrink-0 rounded-full",
                corDoTom[evento.tom ?? "neutro"]
              )}
              aria-hidden="true"
            />
            {indice < eventos.length - 1 ? <span className="bg-border w-px flex-1" /> : null}
          </div>
          <div className="flex min-w-0 flex-1 items-start justify-between gap-4 pb-5">
            <div className="min-w-0">
              <p className="text-sm font-medium">{evento.titulo}</p>
              {evento.descricao ? (
                <p className="text-muted-foreground text-xs">{evento.descricao}</p>
              ) : null}
            </div>
            {evento.dataHora ? (
              <p className="text-muted-foreground shrink-0 text-xs">
                {formatarData(evento.dataHora)}, {formatarHora(evento.dataHora)}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
