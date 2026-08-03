import { cn } from "@/lib/utils";

export interface OpcaoFiltroSegmentado {
  readonly id: string;
  readonly rotulo: string;
  readonly contador?: number;
}

interface FiltroSegmentadoProps {
  readonly opcoes: readonly OpcaoFiltroSegmentado[];
  readonly valor: string;
  readonly aoMudar: (id: string) => void;
}

export function FiltroSegmentado({ opcoes, valor, aoMudar }: FiltroSegmentadoProps) {
  return (
    <div className="border-border/60 bg-muted/50 flex rounded-full border p-1">
      {opcoes.map((opcao) => {
        const ativa = opcao.id === valor;
        return (
          <button
            key={opcao.id}
            type="button"
            aria-pressed={ativa}
            className={cn(
              "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm whitespace-nowrap transition-colors",
              ativa
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => aoMudar(opcao.id)}
          >
            {opcao.rotulo}
            {opcao.contador !== undefined && opcao.contador > 0 ? (
              <span className="bg-destructive grid h-6 min-w-6 shrink-0 place-items-center rounded-full px-1.5 text-xs font-medium text-white">
                {opcao.contador}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
