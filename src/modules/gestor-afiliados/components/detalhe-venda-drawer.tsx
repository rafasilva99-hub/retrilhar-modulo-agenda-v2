import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Building02Icon,
  CalendarClockIcon,
  CircleDashedIcon,
  Copy01Icon,
  HashtagIcon,
  PackageIcon,
  PaymentSuccess01Icon,
  User02Icon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { toast } from "sonner";

import { CodigoCopiavel, TimelineAtividade } from "@/components/blocos";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatarDataHora, formatarMoeda } from "@/lib/formatadores";
import { cn } from "@/lib/utils";
import type { DetalheVenda, ItemPedidoVenda } from "@/types/api/afiliados";

import { FaixaSecao } from "./faixa-secao";

interface DetalheVendaDrawerProps {
  readonly detalhe: DetalheVenda | null;
  readonly aberto: boolean;
  readonly aoFechar: () => void;
  readonly aoVerAfiliado: () => void;
}

export function DetalheVendaDrawer({
  detalhe,
  aberto,
  aoFechar,
  aoVerAfiliado,
}: DetalheVendaDrawerProps) {
  return (
    <Sheet open={aberto} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
      {/* Largura fixa de 720px do overlay AFI-01.a no Figma; divergência
          documentada do limite de valores arbitrários (não há token de 45rem).
          Os prefixos data-[side=right] precisam bater com os do SheetContent
          base para o tailwind-merge substituir w-3/4 e max-w-sm. */}
      <SheetContent
        side="right"
        className="gap-0 overflow-y-auto rounded-l-xl p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[720px]"
      >
        <SheetHeader className="px-6 py-4">
          <SheetTitle className="text-lg font-semibold">Detalhes da venda</SheetTitle>
          <SheetDescription className="sr-only">
            Dados do pedido, itens, valores e histórico da venda indicada.
          </SheetDescription>
        </SheetHeader>

        {detalhe ? (
          <div className="flex flex-1 flex-col">
            <FaixaSecao>
              Afiliado responsável
              <button
                type="button"
                className="text-primary flex items-center gap-1 text-sm font-medium tracking-normal normal-case hover:underline"
                onClick={aoVerAfiliado}
              >
                Ver detalhes do afiliado
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" />
              </button>
            </FaixaSecao>

            <div className="flex items-center gap-4 px-6 py-5">
              <Avatar className="size-12">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {iniciais(detalhe.afiliado.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1">
                <p className="truncate text-lg font-semibold tracking-tight">
                  {detalhe.afiliado.nome}
                </p>
                <CodigoCopiavel codigo={detalhe.afiliado.codigo} />
              </div>
            </div>

            <FaixaSecao>Dados do pedido</FaixaSecao>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-5 sm:grid-cols-2">
              <CampoPedido rotulo="ID do pedido" icone={HashtagIcon}>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{detalhe.pedido.numero}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Copiar ID do pedido ${detalhe.pedido.numero}`}
                    onClick={() => {
                      void navigator.clipboard
                        ?.writeText(detalhe.pedido.numero)
                        .catch(() => undefined);
                      toast.success("ID do pedido copiado", {
                        description: detalhe.pedido.numero,
                      });
                    }}
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={16} aria-hidden="true" />
                  </button>
                </span>
              </CampoPedido>
              <CampoPedido rotulo="Método de pagamento" icone={PaymentSuccess01Icon} alinharDireita>
                <span className="text-sm">{detalhe.pedido.metodoPagamento}</span>
              </CampoPedido>
              <CampoPedido rotulo="Comprador" icone={User02Icon}>
                <span className="text-sm">{detalhe.pedido.comprador}</span>
              </CampoPedido>
              <CampoPedido rotulo="Data / hora da compra" icone={CalendarClockIcon} alinharDireita>
                <span className="text-sm">{formatarDataHora(detalhe.pedido.dataHora)}</span>
              </CampoPedido>
              <CampoPedido rotulo="Organização" icone={Building02Icon}>
                <span className="text-sm">{detalhe.pedido.organizacao}</span>
              </CampoPedido>
              <CampoPedido rotulo="Origem da indicação" icone={UserSearch01Icon} alinharDireita>
                <span className="text-sm">{detalhe.pedido.origemIndicacao}</span>
              </CampoPedido>
              <CampoPedido rotulo="Status" icone={CircleDashedIcon}>
                <span className="flex flex-wrap gap-2">
                  {detalhe.pedido.status.map((status) => (
                    <Badge
                      key={status}
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      {status}
                    </Badge>
                  ))}
                </span>
              </CampoPedido>
            </div>

            <FaixaSecao>Itens do pedido</FaixaSecao>
            <div className="space-y-3 px-6 py-5">
              {detalhe.itens.map((item) => (
                <ItemPedidoCard key={item.id} item={item} />
              ))}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-3 text-sm">
                  <span className="text-muted-foreground">Total comissão</span>
                  <span className="font-medium text-emerald-600">
                    {formatarMoeda(detalhe.totalComissao)}
                  </span>
                </div>
                <div className="border-border flex items-center justify-between border-t border-dashed pt-3">
                  <span className="text-sm font-medium">Total do pedido</span>
                  <span className="text-lg font-semibold tracking-tight">
                    {formatarMoeda(detalhe.totalPedido)}
                  </span>
                </div>
              </div>
            </div>

            <FaixaSecao>Histórico</FaixaSecao>
            <div className="px-6 py-5">
              <TimelineAtividade eventos={detalhe.historico} />
            </div>

            <div className="border-border mt-auto flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={aoFechar}>
                Fechar aba
              </Button>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={aoVerAfiliado}>
                  Ver detalhes do afiliado
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button type="button" disabled>
                          Ver pedido completo
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Disponível em breve</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// Card de item do pedido com as tarifas num dropdown (frame 16208:151590).
function ItemPedidoCard({ item }: { readonly item: ItemPedidoVenda }) {
  return (
    <Collapsible className="border-border rounded-xl border">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-4 p-4 text-left"
          aria-label={`Ver tarifas de ${item.nome}`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-muted text-muted-foreground grid size-10 shrink-0 place-items-center rounded-lg">
              <HugeiconsIcon icon={PackageIcon} size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{item.nome}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {item.quantidadeRotulo} · {item.tarifas.length} tarifas ·{" "}
                {formatarMoeda(item.valorItem)}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="text-right">
              <span className="block text-sm">
                <span className="font-medium text-emerald-600">
                  {formatarMoeda(item.comissaoValor)}
                </span>{" "}
                <span className="text-muted-foreground text-xs">({item.comissaoRotulo})</span>
              </span>
              <span className="text-muted-foreground block text-xs">Total da comissão</span>
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={18}
              className="text-foreground/70 transition-transform group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-muted/40 divide-border/70 mx-4 mb-4 divide-y rounded-xl px-4">
          {item.tarifas.map((tarifa) => (
            <div key={tarifa.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tarifa.nome}</p>
                <p className="text-muted-foreground text-xs">{tarifa.unidades} unidade(s)</p>
              </div>
              <ColunaTarifa rotulo="Valor unitário" valor={formatarMoeda(tarifa.valorUnitario)} />
              <ColunaTarifa rotulo="Valor total" valor={formatarMoeda(tarifa.valorTotal)} />
              <ColunaTarifa
                rotulo="Valor da comissão"
                valor={formatarMoeda(tarifa.valorComissao)}
                destaque
                larga
              />
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ColunaTarifa({
  rotulo,
  valor,
  destaque,
  larga,
}: {
  readonly rotulo: string;
  readonly valor: string;
  readonly destaque?: boolean;
  readonly larga?: boolean;
}) {
  return (
    <div className={cn("hidden shrink-0 text-right sm:block", larga ? "w-28" : "w-24")}>
      <p className={cn("text-sm font-medium", destaque && "text-emerald-600")}>{valor}</p>
      <p className="text-muted-foreground text-xs">{rotulo}</p>
    </div>
  );
}

function CampoPedido({
  rotulo,
  icone,
  alinharDireita,
  children,
}: {
  readonly rotulo: string;
  readonly icone: IconSvgElement;
  readonly alinharDireita?: boolean;
  readonly children: React.ReactNode;
}) {
  // Conforme o frame AFI-01.a: ícone num quadrado cinza ao lado do campo.
  // Na coluna da direita o quadrado fica na extremidade, com texto alinhado
  // à direita; no empilhamento mobile tudo volta ao alinhamento à esquerda.
  return (
    <div className={cn("flex items-center gap-3", alinharDireita && "sm:flex-row-reverse")}>
      <span className="border-border/60 bg-muted/60 text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl border">
        <HugeiconsIcon icon={icone} size={20} aria-hidden="true" />
      </span>
      <div className={cn("min-w-0 flex-1 space-y-0.5", alinharDireita && "sm:text-right")}>
        <p className="text-muted-foreground text-xs">{rotulo}</p>
        <div className={alinharDireita ? "sm:flex sm:justify-end" : undefined}>{children}</div>
      </div>
    </div>
  );
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.charAt(0) ?? "") : "";
  return `${primeira}${ultima}`.toUpperCase();
}
