import { useEffect, useState } from "react";
import {
  ArrowLeft01Icon,
  Copy02Icon,
  MoneyBag02Icon,
  Search01Icon,
  ShoppingBag01Icon,
  Ticket02Icon,
  UserStar01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  affiliateGeneralLink,
  affiliateOrgLinks,
  affiliateReferrals,
  getIndicacoesKpis,
  organizationMap,
  originLabels,
} from "@/mocks/afiliados";

import {
  filterReferrals,
  getReferralCartItems,
  listAffiliateOrganizations,
} from "./services/afiliados-mock-service";
import {
  AffiliateEmptyState,
  AffiliateLinkCard,
  AffiliateStatCard,
  CommissionStatusBadge,
  OrderStatusBadge,
  OrganizationFilter,
} from "./components";
import type {
  AfiliadoPeriod,
  AfiliadoReferral,
  IndicacoesTab,
  ReferralFilters,
  ReferralOrigin,
} from "./types";

const organizations = listAffiliateOrganizations();

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias", internalPeriod: "semana" },
  { value: "30d", label: "Últimos 30 dias", internalPeriod: "mes" },
  { value: "month", label: "Este mês", internalPeriod: "mes" },
  { value: "12m", label: "Últimos 12 meses", internalPeriod: "ano" },
  { value: "all", label: "Todo o período", internalPeriod: "ano" },
] as const satisfies readonly { value: string; label: string; internalPeriod: AfiliadoPeriod }[];

const tabOptions = [
  { value: "todas", label: "Todas" },
  { value: "pagas", label: "Pagas" },
  { value: "nao-pagas", label: "Não pagas" },
  { value: "carrinhos-abandonados", label: "Carrinhos abandonados" },
] as const satisfies readonly { value: IndicacoesTab; label: string }[];

const originOptions = [
  { value: "all", label: "Todas as origens" },
  { value: "link-geral", label: "Link geral" },
  { value: "link-org", label: "Link da organização" },
  { value: "link-produto", label: "Link de produto" },
  { value: "cupom", label: "Cupom" },
] as const satisfies readonly { value: "all" | ReferralOrigin; label: string }[];

type PeriodValue = (typeof periodOptions)[number]["value"];
type OriginFilter = (typeof originOptions)[number]["value"];

function isPeriodValue(value: string): value is PeriodValue {
  return periodOptions.some((option) => option.value === value);
}

function isOriginFilter(value: string): value is OriginFilter {
  return originOptions.some((option) => option.value === value);
}

function isIndicacoesTab(value: string): value is IndicacoesTab {
  return tabOptions.some((option) => option.value === value);
}

function getInternalPeriod(value: PeriodValue): AfiliadoPeriod {
  return periodOptions.find((option) => option.value === value)?.internalPeriod ?? "mes";
}

function shiftDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function shiftMonths(isoDate: string, months: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

function latestReferralDate(): string {
  return affiliateReferrals.reduce(
    (latest, referral) => (referral.purchaseDate > latest ? referral.purchaseDate : latest),
    ""
  );
}

function isReferralInPeriod(purchaseDate: string, period: PeriodValue): boolean {
  if (period === "all") return true;

  const referenceDate = latestReferralDate();
  const startDate = (() => {
    switch (period) {
      case "7d":
        return shiftDate(referenceDate, -6);
      case "30d":
        return shiftDate(referenceDate, -29);
      case "month":
        return `${referenceDate.slice(0, 7)}-01`;
      case "12m":
        return shiftMonths(referenceDate, -12);
    }
  })();

  return purchaseDate >= startDate && purchaseDate <= referenceDate;
}

function formatDate(iso: string, time?: string): string {
  const date = new Intl.DateTimeFormat("pt-BR").format(new Date(`${iso}T00:00:00`));
  return time ? `${date} às ${time}` : date;
}

function linkForOrganization(organizationId: string): string {
  return organizationId === "all"
    ? affiliateGeneralLink
    : (affiliateOrgLinks[organizationId] ?? affiliateGeneralLink);
}

function cartCount(referral: AfiliadoReferral): string {
  const count = getReferralCartItems(referral).length;
  return `${count} ${count === 1 ? "item" : "itens"}`;
}

function ReferralDetailDrawer({
  referral,
  onClose,
}: {
  readonly referral: AfiliadoReferral | null;
  readonly onClose: () => void;
}) {
  const cartItems = referral ? getReferralCartItems(referral) : [];
  const organization = referral ? organizationMap[referral.organizationId] : undefined;
  const commission = referral?.orderStatus === "Abandonado" ? "R$ 0,00" : referral?.commission;

  return (
    <Sheet open={Boolean(referral)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-border border-b">
          <SheetTitle>Detalhe da indicação</SheetTitle>
          <SheetDescription>Informações do pedido e dos itens indicados.</SheetDescription>
        </SheetHeader>
        {referral ? (
          <div className="flex flex-col gap-5 px-6 pb-6">
            <div>
              <p className="text-foreground text-base font-medium">{referral.customer}</p>
              <p className="text-muted-foreground mt-1 text-xs">{referral.orderId}</p>
            </div>
            <DataList orientation="horizontal" size="sm" className="gap-3">
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Organização</DataListLabel>
                <DataListValue className="text-right font-medium">
                  {organization?.name}
                </DataListValue>
              </DataListItem>
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Origem</DataListLabel>
                <DataListValue>
                  <Badge variant="secondary">{originLabels[referral.origin]}</Badge>
                </DataListValue>
              </DataListItem>
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Data da compra</DataListLabel>
                <DataListValue className="text-right font-medium">
                  {formatDate(referral.purchaseDate, referral.time)}
                </DataListValue>
              </DataListItem>
            </DataList>
            <div className="bg-muted/30 rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-foreground text-sm font-medium">Itens do carrinho</h3>
                <span className="text-muted-foreground text-xs">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-3">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 items-start justify-between gap-4 text-sm"
                  >
                    <span className="min-w-0 font-medium">{item.product}</span>
                    <span className="text-muted-foreground shrink-0 text-right text-xs">
                      {formatDate(item.activityDate)}
                      {item.quantity
                        ? ` · ${item.quantity} ${item.quantity === 1 ? "pessoa" : "pessoas"}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <DataList orientation="horizontal" size="sm" className="gap-3">
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Valor da venda</DataListLabel>
                <DataListValue className="text-right font-medium">
                  {referral.purchaseValue}
                </DataListValue>
              </DataListItem>
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Status do pedido</DataListLabel>
                <DataListValue>
                  <OrderStatusBadge status={referral.orderStatus} />
                </DataListValue>
              </DataListItem>
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Comissão</DataListLabel>
                <DataListValue className="text-right font-medium">{commission}</DataListValue>
              </DataListItem>
              <DataListItem className="justify-between gap-4">
                <DataListLabel>Status da comissão</DataListLabel>
                <DataListValue>
                  <CommissionStatusBadge status={referral.commissionStatus} />
                </DataListValue>
              </DataListItem>
              {referral.commissionRule ? (
                <DataListItem className="justify-between gap-4">
                  <DataListLabel>Regra de comissão</DataListLabel>
                  <DataListValue className="max-w-[15rem] text-right font-medium">
                    {referral.commissionRule}
                  </DataListValue>
                </DataListItem>
              ) : null}
            </DataList>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ReferralList({
  referrals,
  onSelect,
}: {
  readonly referrals: readonly AfiliadoReferral[];
  readonly onSelect: (referral: AfiliadoReferral) => void;
}) {
  return (
    <>
      <div className="bg-card hidden overflow-hidden rounded-2xl border shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Comprador / pedido</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow
                key={referral.id}
                tabIndex={0}
                aria-label={`Abrir detalhe da indicação de ${referral.customer}`}
                className={cn(
                  "focus-visible:bg-muted/60 focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
                  referral.orderStatus === "Abandonado" && "opacity-60"
                )}
                onClick={() => onSelect(referral)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(referral);
                  }
                }}
              >
                <TableCell>
                  <div className="flex min-w-40 flex-col gap-0.5">
                    <span className="text-foreground truncate text-sm font-medium">
                      {referral.customer}
                    </span>
                    <span className="text-muted-foreground text-xs">{referral.orderId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {organizationMap[referral.organizationId]?.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {originLabels[referral.origin]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(referral.purchaseDate, referral.time)}
                </TableCell>
                <TableCell className="text-sm">{cartCount(referral)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">{referral.purchaseValue}</span>
                    <OrderStatusBadge status={referral.orderStatus} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">
                      {referral.orderStatus === "Abandonado" ? "R$ 0,00" : referral.commission}
                    </span>
                    <CommissionStatusBadge status={referral.commissionStatus} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-2 md:hidden">
        {referrals.map((referral) => (
          <button
            key={referral.id}
            type="button"
            className={cn(
              "bg-card hover:bg-muted/40 focus-visible:ring-ring w-full min-w-0 rounded-2xl border p-4 text-left shadow-sm transition-colors focus-visible:ring-3",
              referral.orderStatus === "Abandonado" && "opacity-60"
            )}
            onClick={() => onSelect(referral)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{referral.customer}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {referral.orderId} · {organizationMap[referral.organizationId]?.name}
                </p>
              </div>
              <OrderStatusBadge status={referral.orderStatus} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">
                  {originLabels[referral.origin]} · {cartCount(referral)}
                </p>
                <p className="mt-1 truncate text-sm">{referral.product}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{referral.purchaseValue}</p>
                <p className="text-muted-foreground mt-1 text-xs">{referral.commission}</p>
                <CommissionStatusBadge status={referral.commissionStatus} className="mt-1" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export function IndicacoesPage() {
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("30d");
  const [selectedOrigin, setSelectedOrigin] = useState<OriginFilter>("all");
  const [activeTab, setActiveTab] = useState<IndicacoesTab>("todas");
  const [selectedReferral, setSelectedReferral] = useState<AfiliadoReferral | null>(null);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const collapseButton = document.querySelector<HTMLButtonElement>(
      'aside button[title="Encolher menu"]'
    );
    collapseButton?.click();
  }, []);

  const kpis = getIndicacoesKpis(getInternalPeriod(selectedPeriod), selectedOrg);
  const referralsInPeriod = filterReferrals(affiliateReferrals).filter((referral) =>
    isReferralInPeriod(referral.purchaseDate, selectedPeriod)
  );
  const filters: Omit<ReferralFilters, "tab"> = {
    organizationId: selectedOrg,
    search,
    origin: selectedOrigin,
  };
  const referrals = filterReferrals(referralsInPeriod, { ...filters, tab: activeTab });
  const getCount = (tab: IndicacoesTab) =>
    filterReferrals(referralsInPeriod, { ...filters, tab }).length;
  const hasActiveFilters =
    Boolean(search.trim()) ||
    selectedOrg !== "all" ||
    selectedOrigin !== "all" ||
    selectedPeriod !== "30d";
  const selectedLink = linkForOrganization(selectedOrg);

  const clearFilters = () => {
    setSearch("");
    setSelectedOrg("all");
    setSelectedOrigin("all");
    setSelectedPeriod("30d");
    setActiveTab("todas");
  };

  const goBack = () => {
    window.location.hash = "#afiliados";
  };

  return (
    <AppPage
      title="Indicações"
      description="Acompanhe pedidos, carrinhos e comissões gerados pelos seus links."
      actions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Voltar para afiliados"
          onClick={goBack}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          <span className="md:hidden">Voltar</span>
          <span className="hidden md:inline">Voltar para afiliados</span>
        </Button>
      }
      breadcrumb={[{ title: "Afiliados", onClick: goBack }]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <AffiliateStatCard
            title="Indicações originadas"
            value={kpis.indicacoesOriginadasQtd}
            detail={`${kpis.indicacoesOriginadasValor} em valor`}
            icon={<HugeiconsIcon icon={UserStar01Icon} size={16} />}
          />
          <AffiliateStatCard
            title="Vendas pagas"
            value={kpis.vendasPagasQtd}
            detail={`${kpis.vendasPagasValor} em valor`}
            icon={<HugeiconsIcon icon={MoneyBag02Icon} size={16} />}
          />
          <AffiliateStatCard
            title="Carrinhos abandonados"
            value={kpis.carrinhosAbandonadosQtd}
            detail={`${kpis.carrinhosAbandonadosValor} em valor`}
            icon={<HugeiconsIcon icon={ShoppingBag01Icon} size={16} />}
          />
          <AffiliateStatCard
            title="Via cupom"
            value={kpis.viaCupomQtd}
            detail={`${kpis.viaCupomValor} em valor`}
            icon={<HugeiconsIcon icon={Ticket02Icon} size={16} />}
          />
          <AffiliateStatCard
            title="Comissão gerada"
            value={kpis.comissaoGerada}
            detail={periodOptions.find((option) => option.value === selectedPeriod)?.label}
            icon={<HugeiconsIcon icon={Wallet02Icon} size={16} />}
          />
        </div>

        <AffiliateLinkCard
          title="Link de afiliado"
          description={
            selectedOrg === "all"
              ? "Compartilhe seu link geral entre as organizações."
              : "Link geral desta organização."
          }
          links={[
            {
              id: selectedOrg,
              label: selectedOrg === "all" ? "Link geral" : "Link da organização",
              value: selectedLink,
            },
          ]}
        />

        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[14rem] flex-1">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  aria-label="Pesquisar indicações"
                  placeholder="Pesquisar por comprador ou produto"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
              <OrganizationFilter
                organizations={organizations}
                value={selectedOrg}
                onValueChange={setSelectedOrg}
              />
              <Select
                value={selectedPeriod}
                onValueChange={(value) => {
                  if (isPeriodValue(value)) setSelectedPeriod(value);
                }}
              >
                <SelectTrigger className="h-8 w-[180px] text-xs" aria-label="Período">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedOrigin}
                onValueChange={(value) => {
                  if (isOriginFilter(value)) setSelectedOrigin(value);
                }}
              >
                <SelectTrigger className="h-8 w-[180px] text-xs" aria-label="Origem">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {originOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters ? (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : null}
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (isIndicacoesTab(value)) setActiveTab(value);
              }}
            >
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto rounded-none border-b p-0"
              >
                {tabOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                    <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[11px]">
                      {getCount(option.value)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab} className="mt-4">
                <ReferralList referrals={referrals} onSelect={setSelectedReferral} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {referrals.length === 0 ? (
          <AffiliateEmptyState
            title="Nenhuma indicação encontrada"
            description="Ajuste os filtros ou compartilhe seu link para começar a receber indicações."
            icon={Copy02Icon}
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : null
            }
          />
        ) : null}
      </div>
      <ReferralDetailDrawer referral={selectedReferral} onClose={() => setSelectedReferral(null)} />
    </AppPage>
  );
}
