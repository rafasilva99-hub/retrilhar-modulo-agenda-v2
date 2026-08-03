import { useEffect, useState } from "react";
import {
  ArrowDown01Icon,
  Calendar04Icon,
  Cancel01Icon,
  DocumentValidationIcon,
  Tick01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { FiltroSegmentado, TimelineAtividade } from "@/components/blocos";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { formatarDataExtensa, formatarMoeda } from "@/lib/formatadores";
import type { MetodoRecebimento, OrigemEvento, Solicitacao } from "@/types/api/afiliados";

import { obterTermoOrganizacao } from "../services/afiliados-service";

import { FaixaSecao } from "./faixa-secao";
import { RecusarPropostaDialog } from "./recusar-proposta-dialog";

interface AvaliarPropostaDrawerProps {
  readonly solicitacao: Solicitacao | null;
  readonly aberto: boolean;
  readonly aoFechar: () => void;
}

type ModoComissao = "percentual" | "valor";

const rotulosMetodo: Record<MetodoRecebimento, string> = {
  split: "Split de pagamento",
  pix: "Pix",
  conta_bancaria: "Conta bancária",
};

// Origem do evento vira o subtítulo da timeline, como no AFI-04.a.
const rotulosOrigem: Record<OrigemEvento, string> = {
  sistema: "Sistema",
  afiliado: "Painel de afiliado",
  organizacao: "Painel da organização",
};

function iniciaisDoNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? "";
  const segunda = partes[1]?.charAt(0) ?? "";
  return `${primeira}${segunda}`.toUpperCase();
}

// Drawer AFI-04.a/.b do Figma: avaliação da proposta (ou contraproposta) de
// afiliação com definição de comissão. Ações apenas registram o desfecho
// localmente via toast; o protótipo não altera os mocks.
export function AvaliarPropostaDrawer({
  solicitacao,
  aberto,
  aoFechar,
}: AvaliarPropostaDrawerProps) {
  const comissaoProposta = solicitacao
    ? (solicitacao.comissaoContrapropostaPercentual ?? solicitacao.comissaoSolicitadaPercentual)
    : 0;

  const [modo, setModo] = useState<ModoComissao>("percentual");
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState<MetodoRecebimento>("split");
  // Modal de justificativa da recusa (AFI-04.c).
  const [recusaAberta, setRecusaAberta] = useState(false);

  // Reinicia o formulário a cada solicitação aberta.
  useEffect(() => {
    if (!solicitacao) return;
    setModo("percentual");
    setValor(comissaoProposta > 0 ? String(comissaoProposta) : "");
    setMetodo(solicitacao.metodoRecebimento);
    setRecusaAberta(false);
  }, [solicitacao, comissaoProposta]);

  if (!solicitacao) return null;

  const ehContraproposta = solicitacao.comissaoContrapropostaPercentual !== undefined;
  const produto = solicitacao.produto;
  const primeiroNome = solicitacao.afiliado.nome.split(/\s+/)[0] ?? solicitacao.afiliado.nome;
  const valorNumerico = Number(valor.replace(",", "."));
  const valorValido = valor.trim() !== "" && Number.isFinite(valorNumerico) && valorNumerico > 0;

  const ajudaComissao =
    produto && valorValido
      ? modo === "percentual"
        ? `Com ${valorNumerico}%, cada venda de ${formatarMoeda(produto.precoPorPessoa)} gera ${formatarMoeda((produto.precoPorPessoa * valorNumerico) / 100)} de comissão para ${primeiroNome}.`
        : `Cada venda de ${formatarMoeda(produto.precoPorPessoa)} gera ${formatarMoeda(valorNumerico)} de comissão para ${primeiroNome}.`
      : null;

  const aprovar = () => {
    toast.success("A solicitação foi aprovada", {
      description:
        "O afiliado será notificado e já pode divulgar o produto com a comissão aprovada.",
      action: { label: "Entendido", onClick: () => undefined },
    });
    aoFechar();
  };

  // A recusa exige justificativa (AFI-04.c): o motivo escolhido no modal é
  // visível para o afiliado; no protótipo apenas registramos o desfecho.
  const confirmarRecusa = () => {
    setRecusaAberta(false);
    toast("A solicitação foi recusada", {
      description: "O afiliado será notificado do motivo. Você pode reabrir esta proposta depois.",
      action: { label: "Entendido", onClick: () => undefined },
    });
    aoFechar();
  };

  return (
    <>
      <RecusarPropostaDialog
        aberto={recusaAberta}
        ehContraproposta={ehContraproposta}
        aoFechar={() => setRecusaAberta(false)}
        aoConfirmar={confirmarRecusa}
      />
      <Sheet open={aberto} onOpenChange={(abrir) => (abrir ? undefined : aoFechar())}>
        {/* Mesma largura de 720px do drawer AFI-01.a; ver nota no
          DetalheVendaDrawer sobre a divergência do limite de arbitrários. */}
        <SheetContent
          side="right"
          className="flex flex-col gap-0 rounded-l-xl p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[720px]"
        >
          <SheetHeader className="border-border/60 border-b px-6 py-4">
            <SheetTitle className="text-base font-medium">
              {ehContraproposta ? "Avaliar contraproposta" : "Avaliar proposta"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Dados do afiliado, proposta em análise, definição de comissão e histórico da
              negociação.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/10 text-primary border-primary/20 border text-base font-medium">
                    {iniciaisDoNome(solicitacao.afiliado.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{solicitacao.afiliado.nome}</p>
                  {solicitacao.afiliado.descricao || solicitacao.afiliado.handle ? (
                    <p className="text-muted-foreground truncate text-sm">
                      {[solicitacao.afiliado.descricao, solicitacao.afiliado.handle]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <span className="border-border/60 bg-muted/40 text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg border">
                  <HugeiconsIcon icon={DocumentValidationIcon} size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs">Termos de uso de afiliado</p>
                  <p className="flex items-center gap-1.5 text-sm">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={16}
                      className="text-emerald-600"
                      aria-hidden="true"
                    />
                    {solicitacao.afiliado.termosAceitosEm
                      ? "Aceito pelo afiliado"
                      : "Aguardando aceite"}
                  </p>
                </div>
                {solicitacao.afiliado.afiliadoDesde ? (
                  <>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Afiliado(a) ativo(a) desde</p>
                      <p className="text-sm">
                        {formatarDataExtensa(solicitacao.afiliado.afiliadoDesde)}
                      </p>
                    </div>
                    <span className="border-border/60 bg-muted/40 text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg border">
                      <HugeiconsIcon icon={Calendar04Icon} size={18} aria-hidden="true" />
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <FaixaSecao>
              {ehContraproposta ? "Contraproposta em análise" : "Proposta em análise"}
            </FaixaSecao>
            <dl className="divide-border/60 divide-y px-6">
              {produto ? (
                <>
                  <LinhaProposta rotulo="O afiliado busca divulgar" valor={produto.nome} />
                  <LinhaProposta
                    rotulo="Preço por pessoa"
                    valor={formatarMoeda(produto.precoPorPessoa)}
                  />
                  <LinhaProposta
                    rotulo="Comissão média do produto"
                    valor={`${produto.comissaoMediaPercentual}%`}
                  />
                </>
              ) : (
                <LinhaProposta rotulo="O afiliado busca se afiliar" valor="À sua organização" />
              )}
              <LinhaProposta
                rotulo="Comissão solicitada pelo afiliado"
                valor={
                  comissaoProposta > 0
                    ? `${comissaoProposta}%`
                    : `Padrão do termo (${obterTermoOrganizacao().comissaoPadraoPercentual}%)`
                }
                destaque
              />
            </dl>

            <FaixaSecao>
              {produto ? "Comissão para este produto" : "Comissão para esta afiliação"}
            </FaixaSecao>
            <div className="space-y-4 px-6 py-5">
              <FiltroSegmentado
                opcoes={[
                  { id: "percentual", rotulo: "Porcentagem (%)" },
                  { id: "valor", rotulo: "Valor (R$)" },
                ]}
                valor={modo}
                aoMudar={(id) => setModo(id as ModoComissao)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="avaliar-valor-comissao">Valor de comissão</Label>
                  <Input
                    id="avaliar-valor-comissao"
                    inputMode="decimal"
                    placeholder={modo === "percentual" ? "Ex.: 10" : "Ex.: 45,00"}
                    value={valor}
                    onChange={(event) => setValor(event.target.value)}
                  />
                  {ajudaComissao ? (
                    <p className="text-muted-foreground text-xs">{ajudaComissao}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="avaliar-metodo-recebimento">
                    Método de recebimento da comissão
                  </Label>
                  <Select
                    value={metodo}
                    onValueChange={(novo) => setMetodo(novo as MetodoRecebimento)}
                  >
                    <SelectTrigger id="avaliar-metodo-recebimento" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(rotulosMetodo).map(([id, rotulo]) => (
                        <SelectItem key={id} value={id}>
                          {rotulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {solicitacao.historico.length > 0 ? (
              <>
                <FaixaSecao>Histórico de solicitação / proposta</FaixaSecao>
                <div className="px-6 py-5">
                  <TimelineAtividade
                    eventos={solicitacao.historico.map((evento) => ({
                      id: evento.id,
                      titulo: evento.descricao,
                      descricao: rotulosOrigem[evento.origem],
                      dataHora: evento.criadoEm,
                      tom: "info",
                    }))}
                  />
                </div>
              </>
            ) : null}

            {solicitacao.anexosQtde ? (
              <FaixaSecao>
                {`Anexos (${solicitacao.anexosQtde})`}
                <button
                  type="button"
                  className="text-primary flex items-center gap-1 text-sm font-medium tracking-normal normal-case hover:underline"
                  onClick={() => toast("Download dos anexos iniciado")}
                >
                  Baixar todos
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} aria-hidden="true" />
                </button>
              </FaixaSecao>
            ) : null}
          </div>

          <div className="border-border/60 flex items-center justify-between gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-2"
                onClick={() => setRecusaAberta(true)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} aria-hidden="true" />
                {ehContraproposta ? "Recusar contraproposta" : "Recusar proposta"}
              </Button>
              <Button className="gap-2" onClick={aprovar} disabled={!valorValido}>
                <HugeiconsIcon icon={Tick02Icon} size={16} aria-hidden="true" />
                Aprovar e definir comissão
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function LinhaProposta({
  rotulo,
  valor,
  destaque = false,
}: {
  readonly rotulo: string;
  readonly valor: string;
  readonly destaque?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <dt className="text-muted-foreground text-sm">{rotulo}</dt>
      <dd className={destaque ? "text-primary text-sm font-medium" : "text-sm font-medium"}>
        {valor}
      </dd>
    </div>
  );
}
