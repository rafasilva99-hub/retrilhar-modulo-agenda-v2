import { Badge } from "@/components/ui/badge";
import { rotulosFiliacao } from "@/lib/afiliados/rotulos";
import { cn } from "@/lib/utils";
import type { EstadoFiliacao } from "@/types/api/afiliados";

// Badge por estado da filiação (Etapa 03, §1.1). Os rótulos vêm da fonte
// única em lib/afiliados/rotulos.

const tons: Record<EstadoFiliacao, string> = {
  ativa: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inativa: "border-amber-200 bg-amber-50 text-amber-700",
  desativada: "border-border bg-muted text-muted-foreground",
  convidada: "border-blue-200 bg-blue-50 text-blue-700",
  expirada: "border-border bg-muted text-muted-foreground",
};

interface BadgeFiliacaoProps {
  readonly estado: EstadoFiliacao;
  readonly className?: string;
}

export function BadgeFiliacao({ estado, className }: BadgeFiliacaoProps) {
  return (
    <Badge variant="outline" className={cn("rounded-full font-normal", tons[estado], className)}>
      {rotulosFiliacao[estado]}
    </Badge>
  );
}
