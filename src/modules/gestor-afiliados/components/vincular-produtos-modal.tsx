import { useState } from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { FiltroSegmentado } from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MetodoRecebimento, ProdutoVinculado } from "@/types/api/afiliados";

import { listarProdutosVinculaveis } from "../services/afiliados-service";

interface VincularProdutosModalProps {
  readonly aberto: boolean;
  readonly nomeAfiliado: string;
  readonly idsJaVinculados: readonly string[];
  readonly aoVincular: (produtos: ProdutoVinculado[]) => void;
  readonly aoFechar: () => void;
}

// Modal AFI-03.m (node 16215:104378): busca, seleção múltipla e tipo de
// recebimento. Autocontido, salva ao confirmar e dispara o próprio toast.
// [PENDENTE P5] O escopo do método de recebimento (lote aqui, por produto
// no AFI-03.n, por proposta na AFI-04) segue em aberto com o Cristiano.
export function VincularProdutosModal({
  aberto,
  nomeAfiliado,
  idsJaVinculados,
  aoVincular,
  aoFechar,
}: VincularProdutosModalProps) {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set());
  const [metodo, setMetodo] = useState<MetodoRecebimento>("split");

  const disponiveis = listarProdutosVinculaveis(busca, idsJaVinculados);
  const todosVinculados = listarProdutosVinculaveis("", idsJaVinculados).length === 0;

  const limparEFechar = () => {
    setBusca("");
    setSelecionados(new Set());
    setMetodo("split");
    aoFechar();
  };

  const alternar = (id: string) => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  const vincular = () => {
    const produtos = listarProdutosVinculaveis("", idsJaVinculados)
      .filter((produto) => selecionados.has(produto.id))
      .map((produto) => ({ ...produto, metodoRecebimento: metodo }));
    aoVincular(produtos);
    // Toast AFI-03.m1 (node 16215:103292).
    toast.success(produtos.length === 1 ? "Produto vinculado" : "Produtos vinculados", {
      description:
        produtos.length === 1
          ? `1 produto foi vinculado a ${nomeAfiliado} e já aparece na listagem de produtos vinculados.`
          : `${produtos.length} produtos foram vinculados a ${nomeAfiliado} e já aparecem na listagem de produtos vinculados.`,
    });
    limparEFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => (abrir ? undefined : limparEFechar())}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Vincular produtos</DialogTitle>
          <DialogDescription>
            Escolha os produtos que {nomeAfiliado} poderá divulgar nesta organização.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={busca}
              placeholder="Buscar produto"
              aria-label="Buscar produto"
              className="pl-9"
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {disponiveis.length === 0 ? (
              <p className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                {todosVinculados
                  ? "Todos os produtos elegíveis já estão vinculados a este afiliado."
                  : "Nenhum produto encontrado para a busca atual."}
              </p>
            ) : (
              disponiveis.map((produto) => (
                <label
                  key={produto.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                    selecionados.has(produto.id)
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={selecionados.has(produto.id)}
                    onCheckedChange={() => alternar(produto.id)}
                    aria-label={`Selecionar ${produto.nome}`}
                  />
                  <img
                    src={produto.thumbnailUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{produto.nome}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {produto.local}
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>

          {/* TODO: [P1] Configurador de comissão (lote ou individual) depende
              da regra percentual vs valor fixo do Matheus. Até lá, os
              produtos entram com a comissão padrão do termo. */}
          <div className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm">
            Configuração de comissão pendente de definição. Os produtos entram com a comissão padrão
            do termo e podem ser ajustados depois, produto a produto.
          </div>

          <div className="space-y-2">
            <p className="text-sm leading-none font-normal">Tipo de recebimento</p>
            <FiltroSegmentado
              opcoes={[
                { id: "split", rotulo: "Split de pagamento" },
                { id: "pix", rotulo: "Via PIX" },
                { id: "conta_bancaria", rotulo: "Conta bancária" },
              ]}
              valor={metodo}
              aoMudar={(id) => setMetodo(id as MetodoRecebimento)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={limparEFechar}>
            Cancelar
          </Button>
          <Button type="button" disabled={selecionados.size === 0} onClick={vincular}>
            Vincular {selecionados.size > 0 ? `(${selecionados.size})` : "produtos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
