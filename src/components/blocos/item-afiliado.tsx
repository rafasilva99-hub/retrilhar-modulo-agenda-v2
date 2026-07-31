import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { formatarMoeda } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type { AfiliadoResumido } from "@/types/api/afiliados";

import { CodigoCopiavel } from "./codigo-copiavel";

interface ItemAfiliadoProps {
  readonly afiliado: AfiliadoResumido;
  readonly posicao: number;
  readonly onAbrir?: (id: string) => void;
}

const coresPosicao: Record<number, string> = {
  1: "border-amber-300 bg-amber-50 text-amber-700",
  2: "border-slate-300 bg-slate-50 text-slate-600",
  3: "border-orange-300 bg-orange-50 text-orange-700",
};

export function ItemAfiliado({ afiliado, posicao, onAbrir }: ItemAfiliadoProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex items-center gap-3 px-4 py-3">
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
            coresPosicao[posicao] ?? "border-border text-muted-foreground bg-card"
          )}
        >
          {posicao}
        </span>
        <p className="min-w-0 truncate text-sm font-medium">{afiliado.nome}</p>
        <CodigoCopiavel codigo={afiliado.codigo} />
        {onAbrir ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground ml-auto shrink-0 transition-colors"
            aria-label={`Abrir detalhes de ${afiliado.nome}`}
            onClick={() => onAbrir(afiliado.id)}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-3 px-4 py-3">
        <Metrica rotulo="Vendas (Quantidade)" valor={`${afiliado.vendasQtde} vendas`} />
        {/* Divergência intencional do frame: o contrato define maiorVenda,
            então o rótulo reflete o dado real em vez do placeholder. */}
        <Metrica
          rotulo="Maior venda"
          valor={formatarMoeda(afiliado.maiorVenda)}
          alinhamento="centro"
        />
        <Metrica
          rotulo="Valor de comissão"
          valor={formatarMoeda(afiliado.valorComissao)}
          alinhamento="direita"
          destaque
        />
      </div>
    </div>
  );
}

function Metrica({
  rotulo,
  valor,
  alinhamento = "esquerda",
  destaque,
}: {
  readonly rotulo: string;
  readonly valor: string;
  readonly alinhamento?: "esquerda" | "centro" | "direita";
  readonly destaque?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        alinhamento === "centro" && "text-center",
        alinhamento === "direita" && "text-right"
      )}
    >
      <p className="text-muted-foreground truncate text-xs">{rotulo}</p>
      <p className={cn("mt-0.5 truncate text-sm font-medium", destaque && "text-emerald-600")}>
        {valor}
      </p>
    </div>
  );
}
