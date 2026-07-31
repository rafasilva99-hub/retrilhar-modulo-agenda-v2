import { ArrowDownRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TendenciaKpi {
  readonly rotulo: string;
  readonly direcao: "alta" | "baixa";
}

interface KpiCardProps {
  readonly titulo: string;
  readonly valor: string;
  readonly complemento?: string;
  readonly icone: IconSvgElement;
  // Opcional por decisão da Etapa 01: em telas como a AFI-03 desativada o
  // complemento é contexto, não tendência.
  readonly tendencia?: TendenciaKpi;
  readonly carregando?: boolean;
}

export function KpiCard({
  titulo,
  valor,
  complemento,
  icone,
  tendencia,
  carregando,
}: KpiCardProps) {
  if (carregando) {
    return (
      <Card className="rounded-2xl p-5 shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="size-6 shrink-0 rounded-md" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl p-5 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{titulo}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{valor}</p>
          {tendencia ? (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                tendencia.direcao === "alta" ? "text-emerald-600" : "text-red-600"
              )}
            >
              <HugeiconsIcon
                icon={tendencia.direcao === "alta" ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                size={14}
                aria-hidden="true"
              />
              {tendencia.rotulo}
            </p>
          ) : complemento ? (
            <p className="text-muted-foreground mt-1 text-xs">{complemento}</p>
          ) : null}
        </div>
        <HugeiconsIcon
          icon={icone}
          size={22}
          className="text-primary shrink-0"
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}
