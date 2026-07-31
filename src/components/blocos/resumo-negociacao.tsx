import { cn } from "@/lib/utils";

export interface LinhaResumoNegociacao {
  readonly id: string;
  readonly rotulo: string;
  readonly valor: string;
  readonly enfase?: "padrao" | "primario";
}

interface ResumoNegociacaoProps {
  readonly linhas: readonly LinhaResumoNegociacao[];
}

// Bloco "Proposta em análise" dos modais AFI-04.a/.b. [FATO] A quantidade de
// linhas varia por cenário (4 no .a, 5 no .b): lista dirigida por dados,
// nunca layout fixo.
export function ResumoNegociacao({ linhas }: ResumoNegociacaoProps) {
  return (
    <dl className="divide-border divide-y">
      {linhas.map((linha) => (
        <div key={linha.id} className="flex items-center justify-between gap-4 py-3">
          <dt className="text-sm">{linha.rotulo}</dt>
          <dd
            className={cn(
              "text-right text-sm font-semibold",
              linha.enfase === "primario" && "text-primary"
            )}
          >
            {linha.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}
