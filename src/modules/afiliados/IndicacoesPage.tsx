import { useState } from "react";
import {
  Copy02Icon,
  FilterHorizontalIcon,
  MoneyBag02Icon,
  Search01Icon,
  ShoppingBag01Icon,
  Ticket02Icon,
  UserStar01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@/components/custom/data-list";
import { AppPage } from "@/components/layout/app-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  affiliateGeneralLink,
  affiliateOrganizations,
  type AfiliadoPeriod,
  type AfiliadoReferral,
  type CommissionStatus,
  getFilteredIndicacoes,
  getIndicacoesKpis,
  getReferralCartItems,
  type OrderStatus,
  organizationMap,
  originLabels,
  type ReferralOrigin,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Period options — maps UI labels to internal AfiliadoPeriod values
// ---------------------------------------------------------------------------

type PeriodOption = {
  value: string;
  label: string;
  internalPeriod: AfiliadoPeriod;
};

const periodOptions: PeriodOption[] = [
  { value: "7d", label: "Últimos 7 dias", internalPeriod: "semana" },
  { value: "30d", label: "Últimos 30 dias", internalPeriod: "mes" },
  { value: "month", label: "Este mês", internalPeriod: "mes" },
  { value: "12m", label: "Últimos 12 meses", internalPeriod: "ano" },
  { value: "all", label: "Todo o período", internalPeriod: "ano" },
];

function getPeriodLabel(value: string): string {
  return periodOptions.find((p) => p.value === value)?.label ?? "Últimos 30 dias";
}

function getInternalPeriod(value: string): AfiliadoPeriod {
  return periodOptions.find((p) => p.value === value)?.internalPeriod ?? "mes";
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

const commissionStatusLabel: Record<CommissionStatus, string> = {
  "nao-gerada": "Não gerada",
  "a-receber": "A receber",
  quitada: "Quitada",
};

const orderStatusLabel: Record<OrderStatus, string> = {
  Pago: "Pago",
  "Aguardando pagamento": "Aguardando pagamento",
  Cancelado: "Cancelado",
  Abandonado: "Abandonado",
};

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

function orderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "Pago":
      return "bg-[#dcfce7] text-[#166534] border-transparent";
    case "Aguardando pagamento":
      return "bg-[#ffedd5] text-[#9a3412] border-transparent";
    case "Cancelado":
      return "bg-[#fee2e2] text-[#991b1b] border-transparent";
    case "Abandonado":
      return "bg-[#fef3c7] text-[#92400e] border-transparent";
  }
}

function commissionStatusBadgeClass(status: CommissionStatus): string {
  switch (status) {
    case "quitada":
      return "bg-[#dcfce7] text-[#166534] border-transparent";
    case "a-receber":
      return "bg-[#ffedd5] text-[#9a3412] border-transparent";
    case "nao-gerada":
      return "bg-gray-100 text-gray-500 border-transparent";
  }
}

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

interface KpiCardProps {
  title: string;
  value: string;
  icon: IconSvgElement;
  detail?: string;
  periodLabel?: string;
}

function KpiCard({ title, value, icon, detail, periodLabel }: KpiCardProps) {
  return (
    <Card className="h-[114px] gap-0 py-0 shadow-none">
      <CardContent className="h-full p-[1.25em]">
        <div className="flex h-full items-start justify-between gap-[0.75em]">
          <div className="flex h-full flex-col justify-between">
            <span className="text-muted-foreground text-xs leading-tight font-medium">{title}</span>
            <p className="mt-[0.25em] text-2xl leading-none tracking-tight">{value}</p>
            {detail ? (
              <span className="text-muted-foreground mt-[0.25em] block text-xs">{detail}</span>
            ) : periodLabel ? (
              <span className="text-muted-foreground mt-[0.25em] block text-xs">{periodLabel}</span>
            ) : null}
          </div>
          <div className="bg-primary/10 flex size-[2.5em] shrink-0 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={icon} size={20} className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

function formatDateFull(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateWithTime(iso: string, time?: string): string {
  const formatted = formatDateFull(iso);
  return time ? `${formatted} às ${time}` : formatted;
}

function CartItemsPreview({ referral }: { referral: AfiliadoReferral }) {
  const cartItems = getReferralCartItems(referral);
  const itemCount = cartItems.length;

  return (
    <span className="text-foreground text-sm">
      {itemCount} {itemCount === 1 ? "item" : "itens"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Detail drawer (Sheet-based)
// ---------------------------------------------------------------------------

function originBadgeVariant(
  origin: ReferralOrigin
): "default" | "secondary" | "outline" | "destructive" {
  switch (origin) {
    case "cupom":
      return "secondary";
    case "link-geral":
      return "outline";
    case "link-org":
    case "link-produto":
      return "default";
  }
}

function ReferralDetailDrawer({
  referral,
  onClose,
}: {
  referral: AfiliadoReferral | null;
  onClose: () => void;
}) {
  const org = referral ? organizationMap[referral.organizationId] : null;
  const cartItems = referral ? getReferralCartItems(referral) : [];

  return (
    <Sheet open={!!referral} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detalhe da indicação</SheetTitle>
        </SheetHeader>

        {referral && (
          <div className="flex flex-col gap-0 px-6 pb-6">
            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Comprador</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.customer}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Organização</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {org?.name ?? "-"}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Origem</DataListLabel>
                <DataListValue>
                  <Badge variant={originBadgeVariant(referral.origin)}>
                    {originLabels[referral.origin]}
                  </Badge>
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Pedido</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.orderId}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Data da compra</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {formatDateWithTime(referral.purchaseDate, referral.time)}
                </DataListValue>
              </DataListItem>

              <DataListItem className="items-start justify-between gap-4 py-2">
                <DataListLabel className="text-sm">Itens do carrinho</DataListLabel>
                <DataListValue className="flex min-w-0 flex-col gap-2 text-right text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="min-w-0">
                      <p className="truncate font-medium">{item.product}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateFull(item.activityDate)}
                        {item.quantity
                          ? ` · ${item.quantity} ${item.quantity === 1 ? "pessoa" : "pessoas"}`
                          : ""}
                      </p>
                    </div>
                  ))}
                </DataListValue>
              </DataListItem>
            </DataList>

            <Separator className="my-4" />

            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Valor da venda</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.purchaseValue}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Status do pedido</DataListLabel>
                <DataListValue>
                  <Badge variant="outline" className={orderStatusBadgeClass(referral.orderStatus)}>
                    {orderStatusLabel[referral.orderStatus]}
                  </Badge>
                </DataListValue>
              </DataListItem>
            </DataList>

            <Separator className="my-4" />

            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Comissão</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.orderStatus === "Abandonado" ? "R$ 0,00" : referral.commission}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Status da comissão</DataListLabel>
                <DataListValue>
                  <Badge
                    variant="outline"
                    className={commissionStatusBadgeClass(referral.commissionStatus)}
                  >
                    {commissionStatusLabel[referral.commissionStatus]}
                  </Badge>
                </DataListValue>
              </DataListItem>

              {referral.commissionRule && (
                <DataListItem className="justify-between py-2">
                  <DataListLabel className="text-sm">Regra de comissão</DataListLabel>
                  <DataListValue className="text-right text-sm font-medium">
                    {referral.commissionRule}
                  </DataListValue>
                </DataListItem>
              )}
            </DataList>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Indicacoes Page
// ---------------------------------------------------------------------------

export function IndicacoesPage() {
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedReferral, setSelectedReferral] = useState<AfiliadoReferral | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const internalPeriod = getInternalPeriod(selectedPeriod);
  const periodLabel = getPeriodLabel(selectedPeriod);
  const activeTab = "todas";
  const kpis = getIndicacoesKpis(internalPeriod, selectedOrg);
  const referrals = getFilteredIndicacoes(selectedOrg, activeTab, search, "all");

  const hasActiveFilters = search !== "" || selectedOrg !== "all";

  function clearFilters() {
    setSearch("");
    setSelectedOrg("all");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(affiliateGeneralLink);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <AppPage
      title="Indicações"
      breadcrumb={[
        {
          title: "Inicio",
          onClick: () => {
            window.location.hash = "#afiliados";
          },
        },
      ]}
      onBack={() => {
        window.location.hash = "#afiliados";
      }}
    >
      <div className="flex flex-col gap-6">
        {/* KPI row */}
        <div className="grid grid-cols-1 gap-[1em] sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Indicações originadas"
            value={String(kpis.indicacoesOriginadasQtd)}
            icon={UserStar01Icon}
            detail={`${kpis.indicacoesOriginadasValor} em valor`}
            periodLabel={periodLabel}
          />
          <KpiCard
            title="Vendas pagas"
            value={String(kpis.vendasPagasQtd)}
            icon={MoneyBag02Icon}
            detail={`${kpis.vendasPagasValor} em valor`}
            periodLabel={periodLabel}
          />
          <KpiCard
            title="Carrinhos abandonados"
            value={String(kpis.carrinhosAbandonadosQtd)}
            icon={ShoppingBag01Icon}
            detail={`${kpis.carrinhosAbandonadosValor} em valor`}
            periodLabel={periodLabel}
          />
          <KpiCard
            title="Via cupom"
            value={String(kpis.viaCupomQtd)}
            icon={Ticket02Icon}
            detail={`${kpis.viaCupomValor} em valor`}
            periodLabel={periodLabel}
          />
          <KpiCard
            title="Comissão gerada"
            value={kpis.comissaoGerada}
            icon={Wallet02Icon}
            periodLabel={periodLabel}
          />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-[0.75em]">
          <div className="relative flex-1 md:max-w-[20em]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground absolute top-1/2 left-[0.75em] -translate-y-1/2"
            />
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-[2.25em]"
            />
          </div>

          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue placeholder="Todas as organizações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as organizações</SelectItem>
              {affiliateOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto hidden md:block">
            <Button variant="outline">
              <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
              Filtros
            </Button>
          </div>
        </div>

        {/* Referral table */}
        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HugeiconsIcon
              icon={UserStar01Icon}
              size={48}
              className="text-muted-foreground/40 mb-4"
            />
            <p className="text-foreground text-base font-medium">
              Nenhuma indicação neste período
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Compartilhe seu link para começar a receber comissões
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleCopyLink}
            >
              <HugeiconsIcon icon={Copy02Icon} size={14} />
              {linkCopied ? "Link copiado!" : "Copiar meu link de afiliado"}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <section className="rounded-2xl border border-[#EEF0F4] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    Comprador / ID do pedido
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">Organização</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    Data do pedido
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    Itens (Qtde.)
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">Valor</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">Comissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => {
                  const org = organizationMap[referral.organizationId];
                  const isAbandoned = referral.orderStatus === "Abandonado";
                  const displayCommission = isAbandoned ? "R$ 0,00" : referral.commission;

                  return (
                    <TableRow
                      key={referral.id}
                      className={cn(
                        "cursor-pointer",
                        isAbandoned && "opacity-60"
                      )}
                      onClick={() => setSelectedReferral(referral)}
                    >
                      {/* Comprador */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground truncate text-sm font-medium">
                            {referral.customer}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {referral.orderId}
                          </span>
                        </div>
                      </TableCell>

                      {/* Organização */}
                      <TableCell>
                        <span className="text-foreground text-sm">
                          {org?.name ?? "-"}
                        </span>
                      </TableCell>

                      {/* Pedido */}
                      <TableCell>
                        <span className="text-foreground text-sm">
                          {formatDateWithTime(referral.purchaseDate, referral.time)}
                        </span>
                      </TableCell>

                      {/* Atividade */}
                      <TableCell>
                        <CartItemsPreview referral={referral} />
                      </TableCell>

                      {/* Valor */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-foreground text-sm font-medium">
                            {referral.purchaseValue}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("w-fit text-[11px]", orderStatusBadgeClass(referral.orderStatus))}
                          >
                            {orderStatusLabel[referral.orderStatus]}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Comissão */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-foreground text-sm font-medium">
                            {displayCommission}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("w-fit text-[11px]", commissionStatusBadgeClass(referral.commissionStatus))}
                          >
                            {commissionStatusLabel[referral.commissionStatus]}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>
        )}
      </div>

      {/* Detail drawer */}
      <ReferralDetailDrawer referral={selectedReferral} onClose={() => setSelectedReferral(null)} />
    </AppPage>
  );
}
