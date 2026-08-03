import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface LadoComparativo {
  readonly rotulo: string;
  readonly valor: string;
  readonly subtitulo?: string;
}

interface ComparativoCondicaoProps {
  readonly antes: LadoComparativo;
  readonly depois: LadoComparativo;
}

// Bloco antes/depois com seta (§1.5). [PROPOSTA] Genérico de propósito:
// o mesmo problema de comparar o que vale com o que vai valer aparece no
// drawer AFI-03.n e no ModalAvaliacaoProposta.
export function ComparativoCondicao({ antes, depois }: ComparativoCondicaoProps) {
  return (
    <div className="border-border bg-muted/40 flex items-center gap-4 rounded-xl border p-4">
      <Lado {...antes} />
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        size={20}
        className="text-muted-foreground shrink-0"
        aria-hidden="true"
      />
      <Lado {...depois} destaque />
    </div>
  );
}

function Lado({
  rotulo,
  valor,
  subtitulo,
  destaque,
}: LadoComparativo & { readonly destaque?: boolean }) {
  return (
    <div className="min-w-0 flex-1 space-y-0.5">
      <p className="text-muted-foreground text-xs">{rotulo}</p>
      <p
        className={
          destaque
            ? "text-primary text-xl font-semibold tracking-tight"
            : "text-foreground text-xl font-semibold tracking-tight"
        }
      >
        {valor}
      </p>
      {subtitulo ? <p className="text-muted-foreground truncate text-xs">{subtitulo}</p> : null}
    </div>
  );
}
