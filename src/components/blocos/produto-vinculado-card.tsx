import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rotuloDaComissao, rotulosMetodo } from "@/lib/afiliados/rotulos";
import { cn } from "@/lib/utils";
import type { ProdutoVinculado } from "@/types/api/afiliados";

interface ProdutoVinculadoCardProps {
  readonly produto: ProdutoVinculado;
  // [A VALIDAR §1.4] Na filiação desativada nenhum item está ativo: o modo
  // somente leitura neutraliza o badge e oculta as ações.
  readonly somenteLeitura?: boolean;
  readonly aoEditar?: () => void;
  readonly aoRemover?: () => void;
}

export function ProdutoVinculadoCard({
  produto,
  somenteLeitura,
  aoEditar,
  aoRemover,
}: ProdutoVinculadoCardProps) {
  return (
    <div className="border-border bg-card flex items-center gap-4 rounded-xl border p-3">
      <img src={produto.thumbnailUrl} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{produto.nome}</p>
          {somenteLeitura ? null : (
            <Badge
              variant="outline"
              className={cn(
                "rounded-full font-normal",
                produto.itemAtivo
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {produto.itemAtivo ? "Item ativo" : "Item inativo"}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground truncate text-xs">{produto.local}</p>
        <p className="text-muted-foreground text-xs">
          Comissão de{" "}
          <span className="text-foreground font-medium">{rotuloDaComissao(produto.comissao)}</span>{" "}
          · {rotulosMetodo[produto.metodoRecebimento]}
        </p>
      </div>
      {somenteLeitura ? null : (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Editar ${produto.nome}`}
            onClick={aoEditar}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={17} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label={`Remover ${produto.nome}`}
            onClick={aoRemover}
          >
            <HugeiconsIcon icon={Delete02Icon} size={17} aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
