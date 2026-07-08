import { useState } from "react";
import {
  FilterHorizontalIcon,
  MoneyBag02Icon,
  Search01Icon,
  ShoppingBag01Icon,
  Ticket02Icon,
  UserStar01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

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
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@/components/custom/data-list";
import { cn } from "@/lib/utils";
import {
  affiliateOrganizations,
  type AfiliadoReferral,
  type CommissionStatus,
  type OrderStatus,
  type ReferralOrigin,
  getFilteredIndicacoes,
  getIndicacoesKpis,
  organizationMap,
  originLabels,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

const commissionStatusLabel: Record<CommissionStatus, string> = {
  pendente: "Pendente",
  quitado: "Quitado",
};

// ---------------------------------------------------------------------------
// Status visual helpers
// ---------------------------------------------------------------------------

function orderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "Pago":
      return "rgb(7, 148, 85)";
    case "Pendente":
    case "Não paga":
      return "rgb(220, 104, 3)";
    case "Carrinho abandonado":
      return "rgb(113, 118, 128)";
  }
}

function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "Pago":
      return "Pago";
    case "Pendente":
      return "Pendente";
    case "Não paga":
      return "Não paga";
    case "Carrinho abandonado":
      return "Carrinho abandonado";
  }
}

function commissionStatusColor(status: CommissionStatus): string {
  return status === "quitado" ? "rgb(7, 148, 85)" : "rgb(220, 104, 3)";
}

function StatusIconCheck({ color }: { color: string }) {
  return (
    <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 14 14">
      <path
        d="M3 7l3 3 5-5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusIconAlert({ color }: { color: string }) {
  return (
    <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2" />
      <path d="M7 4.5v3M7 9.5h.01" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StatusIconSlash({ color }: { color: string }) {
  return (
    <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2" />
      <path d="M4.5 9.5l5-5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function OrderStatusIcon({ status }: { status: OrderStatus }) {
  const color = orderStatusColor(status);
  switch (status) {
    case "Pago":
      return <StatusIconCheck color={color} />;
    case "Pendente":
    case "Não paga":
      return <StatusIconAlert color={color} />;
    case "Carrinho abandonado":
      return <StatusIconSlash color={color} />;
  }
}

function CommissionStatusIcon({ status }: { status: CommissionStatus }) {
  const color = commissionStatusColor(status);
  return status === "quitado" ? (
    <StatusIconCheck color={color} />
  ) : (
    <StatusIconAlert color={color} />
  );
}

// ---------------------------------------------------------------------------
// KPI Card (same visual as AfiliadosPage)
// ---------------------------------------------------------------------------

interface KpiCardProps {
  title: string;
  value: string;
  icon: IconSvgElement;
  detail?: string;
  badge?: { label: string; color: string };
}

function KpiCard({ title, value, icon, detail, badge }: KpiCardProps) {
  return (
    <Card className="h-[114px] gap-0 py-0 shadow-none">
      <CardContent className="h-full p-[1.25em]">
        <div className="flex h-full items-start justify-between gap-[0.75em]">
          <div className="flex h-full flex-col justify-between">
            <span className="text-muted-foreground text-xs leading-tight font-medium">{title}</span>
            <p className="mt-[0.25em] text-2xl leading-none tracking-tight">{value}</p>
            {badge ? (
              <span className="mt-[0.25em] flex items-center gap-1.5 text-xs">
                <span
                  className="size-[6px] shrink-0 rounded-full"
                  style={{ backgroundColor: badge.color }}
                />
                <span style={{ color: badge.color }}>{badge.label}</span>
              </span>
            ) : detail ? (
              <span className="text-muted-foreground mt-[0.25em] block text-xs">{detail}</span>
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

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

// ---------------------------------------------------------------------------
// Referral row
// ---------------------------------------------------------------------------

function ReferralRow({ referral, onClick }: { referral: AfiliadoReferral; onClick: () => void }) {
  const isAbandoned = referral.orderStatus === "Carrinho abandonado";
  const displayCommission = isAbandoned ? "R$ 0,00" : referral.commission;
  const displayCommissionColor = isAbandoned
    ? "rgb(113, 118, 128)"
    : commissionStatusColor(referral.commissionStatus);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[52px] w-full cursor-pointer items-center border-t border-[#f5f5f5] text-left transition-colors first:border-t-0 hover:bg-[#f8fafc]"
      style={{ paddingLeft: 16 }}
    >
      {/* Name + origin */}
      <div
        className="flex shrink-0 items-center gap-[12px] overflow-hidden"
        style={{ width: 280, padding: "8px 16px" }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <p className="min-w-0 truncate text-[14px] text-[#0a0a0a]">{referral.customer}</p>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">
            {originLabels[referral.origin]}
          </p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Activity + date */}
      <div
        className="flex min-w-0 shrink-0 items-center"
        style={{ width: 280, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex min-w-0 items-center gap-[4px]">
            <p className="truncate text-[13px] text-[#252b37]">{referral.product}</p>
            <span className="shrink-0 text-[#a1a1aa]">&middot;</span>
            <p className="shrink-0 text-[13px] text-[#252b37]">{formatDate(referral.date)}</p>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">Atividade / Data de compra</p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Value + order status */}
      <div
        className="flex min-w-0 shrink-0 items-center"
        style={{ width: 220, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex items-center gap-[6px]">
            <p
              className={cn(
                "truncate text-[13px] whitespace-nowrap",
                isAbandoned ? "text-[#717680]" : "text-[#252b37]"
              )}
            >
              {referral.purchaseValue}
            </p>
            <span className="text-[#a1a1aa]">&middot;</span>
            <div
              className="flex w-fit items-center gap-[4px]"
              style={{ color: orderStatusColor(referral.orderStatus) }}
            >
              <p className="truncate text-[13px]">{orderStatusLabel(referral.orderStatus)}</p>
              <OrderStatusIcon status={referral.orderStatus} />
            </div>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">Valor / Status do pedido</p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Commission + commission status */}
      <div
        className="flex min-w-0 shrink-0 items-center"
        style={{ width: 220, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex items-center gap-[6px]">
            <p
              className={cn(
                "truncate text-[13px] whitespace-nowrap",
                isAbandoned ? "text-[#717680]" : "text-[#252b37]"
              )}
            >
              {displayCommission}
            </p>
            <span className="text-[#a1a1aa]">&middot;</span>
            <div
              className="flex w-fit items-center gap-[4px]"
              style={{ color: isAbandoned ? "rgb(113, 118, 128)" : displayCommissionColor }}
            >
              <p className="truncate text-[13px]">
                {isAbandoned ? "N/A" : commissionStatusLabel[referral.commissionStatus]}
              </p>
              {isAbandoned ? (
                <StatusIconSlash color="rgb(113, 118, 128)" />
              ) : (
                <CommissionStatusIcon status={referral.commissionStatus} />
              )}
            </div>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">
            Comissao / Status da comissao
          </p>
        </div>
      </div>
    </button>
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

function orderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "Pago":
      return "border-green-200 bg-green-50 text-green-700";
    case "Pendente":
    case "Não paga":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Carrinho abandonado":
      return "border-gray-200 bg-gray-50 text-gray-500";
  }
}

function commissionStatusBadgeClass(status: CommissionStatus): string {
  return status === "quitado"
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-amber-200 bg-amber-50 text-amber-700";
}

function ReferralDetailDrawer({
  referral,
  onClose,
}: {
  referral: AfiliadoReferral | null;
  onClose: () => void;
}) {
  const org = referral ? organizationMap[referral.organizationId] : null;

  return (
    <Sheet open={!!referral} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detalhe da indicacao</SheetTitle>
        </SheetHeader>

        {referral && (
          <div className="flex flex-col gap-0 px-6 pb-6">
            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Cliente</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.customer}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Produto</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.product}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Organizacao</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {org?.name ?? "-"}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Data / Hora</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.date.split("-").reverse().join("/")}
                  {referral.time ? ` as ${referral.time}` : ""}
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
            </DataList>

            <Separator className="my-4" />

            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Valor da compra</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.purchaseValue}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Status do pedido</DataListLabel>
                <DataListValue>
                  <Badge variant="outline" className={orderStatusBadgeClass(referral.orderStatus)}>
                    {orderStatusLabel(referral.orderStatus)}
                  </Badge>
                </DataListValue>
              </DataListItem>
            </DataList>

            <Separator className="my-4" />

            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Comissao</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {referral.orderStatus === "Carrinho abandonado" ? "R$ 0,00" : referral.commission}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Status da comissao</DataListLabel>
                <DataListValue>
                  {referral.orderStatus === "Carrinho abandonado" ? (
                    <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-500">
                      N/A
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={commissionStatusBadgeClass(referral.commissionStatus)}
                    >
                      {commissionStatusLabel[referral.commissionStatus]}
                    </Badge>
                  )}
                </DataListValue>
              </DataListItem>

              {referral.commissionRule && (
                <DataListItem className="justify-between py-2">
                  <DataListLabel className="text-sm">Regra de comissao aplicada</DataListLabel>
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
  const [selectedReferral, setSelectedReferral] = useState<AfiliadoReferral | null>(null);

  const period = "mes";
  const activeTab = "todas";
  const kpis = getIndicacoesKpis(period, selectedOrg);
  const referrals = getFilteredIndicacoes(selectedOrg, activeTab, search, "all");

  const hasActiveFilters = search !== "" || selectedOrg !== "all";

  function clearFilters() {
    setSearch("");
    setSelectedOrg("all");
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
          />
          <KpiCard
            title="Vendas pagas"
            value={String(kpis.vendasPagasQtd)}
            icon={MoneyBag02Icon}
            detail={`${kpis.vendasPagasValor} em valor`}
          />
          <KpiCard
            title="Carrinhos abandonados"
            value={String(kpis.carrinhosAbandonadosQtd)}
            icon={ShoppingBag01Icon}
            detail={`${kpis.carrinhosAbandonadosValor} em valor`}
          />
          <KpiCard
            title="Via cupom"
            value={String(kpis.viaCupomQtd)}
            icon={Ticket02Icon}
            detail={`${kpis.viaCupomValor} em valor`}
          />
          <KpiCard
            title="Comissao gerada"
            value={kpis.comissaoGerada}
            icon={Wallet02Icon}
            badge={{ label: "No periodo", color: "#079455" }}
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
              <SelectValue placeholder="Todas as organizacoes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as organizacoes</SelectItem>
              {affiliateOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto hidden md:block">
            <Button variant="outline" size="default">
              <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
              Filtros
            </Button>
          </div>
        </div>

        {/* Referral list */}
        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HugeiconsIcon
              icon={UserStar01Icon}
              size={48}
              className="text-muted-foreground/40 mb-4"
            />
            <p className="text-foreground text-base font-medium">Nenhuma indicacao encontrada</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Tente ajustar os filtros ou o periodo selecionado
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <section className="rounded-2xl border border-[#EEF0F4] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
            <div className="overflow-hidden rounded-2xl">
              {referrals.map((referral) => (
                <ReferralRow
                  key={referral.id}
                  referral={referral}
                  onClick={() => setSelectedReferral(referral)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Detail drawer */}
      <ReferralDetailDrawer referral={selectedReferral} onClose={() => setSelectedReferral(null)} />
    </AppPage>
  );
}
