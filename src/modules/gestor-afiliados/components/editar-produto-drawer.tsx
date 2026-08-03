import { useState } from "react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { ComparativoCondicao, FiltroSegmentado } from "@/components/blocos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { rotuloDaComissao, rotuloDoMetodo } from "@/lib/afiliados/rotulos";
import type { MetodoRecebimento, ProdutoVinculado } from "@/types/api/afiliados";

import { FaixaSecao } from "./faixa-secao";

interface EditarProdutoDrawerProps {
  readonly produto: ProdutoVinculado | null;
  readonly nomeAfiliado: string;
  readonly aoSalvar: (produto: ProdutoVinculado) => void;
  readonly aoFechar: () => void;
}

// Drawer AFI-03.n (node 16224:109484). Autocontido: estado local próprio,
// salva ao confirmar e dispara o próprio toast (§4 sem modo edição).
export function EditarProdutoDrawer({
  produto,
  nomeAfiliado,
  aoSalvar,
  aoFechar,
}: EditarProdutoDrawerProps) {
  return (
    <Sheet open={produto !== null} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
      <SheetContent
        side="right"
        className="gap-0 overflow-y-auto rounded-l-xl p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        {produto ? (
          <ConteudoEdicao
            key={produto.id}
            produto={produto}
            nomeAfiliado={nomeAfiliado}
            aoSalvar={aoSalvar}
            aoFechar={aoFechar}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

const frasesRecebimento: Record<MetodoRecebimento, string> = {
  split: "por split de pagamento",
  pix: "via PIX",
  conta_bancaria: "em conta bancária",
};

function ConteudoEdicao({
  produto,
  nomeAfiliado,
  aoSalvar,
  aoFechar,
}: {
  readonly produto: ProdutoVinculado;
  readonly nomeAfiliado: string;
  readonly aoSalvar: (produto: ProdutoVinculado) => void;
  readonly aoFechar: () => void;
}) {
  const [formato, setFormato] = useState(produto.comissao.formato);
  const [valor, setValor] = useState(String(produto.comissao.valor));
  const [metodo, setMetodo] = useState(produto.metodoRecebimento);

  const valorNumerico = Number(valor.replace(",", "."));
  const valorValido = Number.isFinite(valorNumerico) && valorNumerico > 0;

  const comissaoNova = { formato, valor: valorValido ? valorNumerico : 0 };
  const comissaoMudou =
    formato !== produto.comissao.formato || valorNumerico !== produto.comissao.valor;
  const metodoMudou = metodo !== produto.metodoRecebimento;
  // [PROPOSTA §5.2] Salvar alterações nasce desabilitado até mudança real.
  const podeSalvar = valorValido && (comissaoMudou || metodoMudou);

  const salvar = () => {
    aoSalvar({ ...produto, comissao: comissaoNova, metodoRecebimento: metodo });
    // Toast AFI-03.n1 (node 16226:111585), com a variante de recebimento.
    const trocaComissao = `A comissão de ${produto.nome} passou de ${rotuloDaComissao(produto.comissao)} para ${rotuloDaComissao(comissaoNova)}`;
    const descricao = comissaoMudou
      ? metodoMudou
        ? `${trocaComissao} e o recebimento agora é ${frasesRecebimento[metodo]}. Vale para as próximas vendas de ${nomeAfiliado}.`
        : `${trocaComissao}. Vale para as próximas vendas de ${nomeAfiliado}.`
      : `O recebimento de ${produto.nome} agora é ${frasesRecebimento[metodo]}. Vale para as próximas vendas de ${nomeAfiliado}.`;
    toast.success(comissaoMudou ? "Comissão atualizada" : "Recebimento atualizado", {
      description: descricao,
    });
    aoFechar();
  };

  return (
    <>
      <SheetHeader className="px-6 py-4">
        <SheetTitle className="text-lg font-semibold">Editar produto vinculado</SheetTitle>
        <SheetDescription className="sr-only">
          Ajuste a comissão e o recebimento deste produto. As mudanças valem ao salvar.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col">
        <FaixaSecao>Dados do produto</FaixaSecao>
        <div className="flex items-center gap-4 px-6 py-5">
          <img
            src={produto.thumbnailUrl}
            alt=""
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{produto.nome}</p>
            <p className="text-muted-foreground truncate text-xs">{produto.local}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Abrir página de ${produto.nome}`}
            className="text-muted-foreground"
          >
            <HugeiconsIcon icon={LinkSquare02Icon} size={17} aria-hidden="true" />
          </Button>
        </div>

        <FaixaSecao>Comissão</FaixaSecao>
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="editar-tipo-comissao">Tipo de comissão</Label>
              <Select
                value={formato}
                onValueChange={(novo) =>
                  setFormato(novo as ProdutoVinculado["comissao"]["formato"])
                }
              >
                <SelectTrigger id="editar-tipo-comissao" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual">Percentual (%)</SelectItem>
                  <SelectItem value="valor">Valor fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editar-valor-comissao">Valor da comissão</Label>
              <Input
                id="editar-valor-comissao"
                value={valor}
                inputMode="decimal"
                placeholder="Insira o valor"
                onChange={(event) => setValor(event.target.value)}
              />
            </div>
          </div>
          <ComparativoCondicao
            antes={{
              rotulo: "Comissão atual",
              valor: rotuloDaComissao(produto.comissao),
              subtitulo: rotuloDoMetodo(produto.metodoRecebimento),
            }}
            depois={{
              rotulo: "Nova comissão",
              valor: rotuloDaComissao(comissaoNova),
              subtitulo: rotuloDoMetodo(metodo),
            }}
          />
        </div>

        <FaixaSecao>Tipo de recebimento</FaixaSecao>
        <div className="px-6 py-5">
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

        <div className="border-border mt-auto flex flex-wrap justify-end gap-3 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button type="button" disabled={!podeSalvar} onClick={salvar}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </>
  );
}
