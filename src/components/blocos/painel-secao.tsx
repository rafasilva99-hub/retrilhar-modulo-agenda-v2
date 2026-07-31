import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RodapePainel {
  readonly rotulo: string;
  readonly onClick?: () => void;
}

interface PainelSecaoProps {
  readonly titulo: string;
  readonly descricao?: string;
  readonly acao?: ReactNode;
  readonly rodape?: RodapePainel;
  readonly children: ReactNode;
  readonly className?: string;
}

export function PainelSecao({
  titulo,
  descricao,
  acao,
  rodape,
  children,
  className,
}: PainelSecaoProps) {
  return (
    <Card className={cn("flex flex-col gap-0 rounded-2xl p-5 shadow-none", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{titulo}</h2>
          {descricao ? <p className="text-muted-foreground text-sm">{descricao}</p> : null}
        </div>
        {acao ? <div className="shrink-0">{acao}</div> : null}
      </div>
      <div className="mt-4 flex-1">{children}</div>
      {rodape ? (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary gap-1"
            onClick={rodape.onClick}
          >
            {rodape.rotulo}
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
