import { useEffect, useState } from "react";
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  HelpCircleIcon,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  affiliateCode,
  type AfiliadoKpis,
  type AfiliadoPeriod,
  type AfiliadoReferral,
  getKpis,
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
  AffiliateStatCard,
  CommissionStatusBadge,
  CopyButton,
  OrderStatusBadge,
  OrganizationFilter,
  SectionHeading,
} from "./components";

// ---------------------------------------------------------------------------
// Period options — maps UI labels to internal AfiliadoPeriod values
// ---------------------------------------------------------------------------

type PeriodOption = {
  readonly value: string;
  readonly label: string;
  readonly internalPeriod: AfiliadoPeriod;
};

const periodOptions: readonly PeriodOption[] = [
  { value: "7d", label: "Últimos 7 dias", internalPeriod: "semana" },
  { value: "30d", label: "Últimos 30 dias", internalPeriod: "mes" },
  { value: "month", label: "Este mês", internalPeriod: "mes" },
  { value: "12m", label: "Últimos 12 meses", internalPeriod: "ano" },
  { value: "all", label: "Todo o período", internalPeriod: "ano" },
];

const dashboardOrderStatuses = ["Pago", "Aguardando pagamento"] as const;

const dashboardLinks = [
  { href: "#indicacoes", label: "Indicações" },
  { href: "#ganhos", label: "Ganhos" },
  { href: "#produtosLinks", label: "Produtos e links" },
  { href: "#configuracoes", label: "Configurações" },
  { href: "#ajuda", label: "Ajuda" },
] as const;

function getPeriodLabel(value: string): string {
  return periodOptions.find((p) => p.value === value)?.label ?? "Últimos 30 dias";
}

function getInternalPeriod(value: string): AfiliadoPeriod {
  return periodOptions.find((p) => p.value === value)?.internalPeriod ?? "mes";
}

// ---------------------------------------------------------------------------
// Passo a Passo (onboarding — só exibido no estado vazio)
// ---------------------------------------------------------------------------

const steps = [
  {
    title: "Compartilhe seu Link",
    description: "Use seu link exclusivo para indicar os passeios para seus contatos.",
  },
  {
    title: "Venda Paga",
    description:
      "Cada compra efetivamente concluída pelo seu link gera uma indicação registrada aqui no painel.",
  },
  {
    title: "Receba sua Comissão",
    description: "Sua comissão fica disponível para recebimento após a confirmação do pagamento.",
  },
];

function KpiRow({ kpis, periodLabel }: { kpis: AfiliadoKpis; periodLabel: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AffiliateStatCard
        title="Indicações"
        value={String(kpis.indicacoesQtd)}
        icon={<HugeiconsIcon icon={UserStar01Icon} size={20} className="text-primary" />}
        detail={`${kpis.indicacoesValor} originados · ${kpis.indicacoesPagas} pagas`}
      />
      <AffiliateStatCard
        title="Carrinhos abandonados"
        value={String(kpis.carrinhosQtd)}
        icon={<HugeiconsIcon icon={ShoppingBag01Icon} size={20} className="text-primary" />}
        detail={`${kpis.carrinhosValor} em valor`}
      />
      <AffiliateStatCard
        title="Comissão recebida"
        value={kpis.comissaoRecebida}
        icon={<HugeiconsIcon icon={Wallet02Icon} size={20} className="text-primary" />}
        detail={periodLabel}
      />
      <AffiliateStatCard
        title="Comissão a receber"
        value={kpis.comissaoReceber}
        icon={<HugeiconsIcon icon={MoneyBag02Icon} size={20} className="text-primary" />}
        detail="Saldo total"
      />
    </div>
  );
}

function formatDateWithTime(iso: string, time?: string): string {
  const [, m, d] = iso.split("-");
  return time ? `${d}/${m} às ${time}` : `${d}/${m}`;
}

function formatDateFull(iso: string): string {
  return iso.split("-").reverse().join("/");
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

function CartItemsDetailValue({ referral }: { referral: AfiliadoReferral }) {
  const cartItems = getReferralCartItems(referral);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {cartItems.map((item) => (
        <div key={item.id} className="min-w-0">
          <p className="text-foreground truncate text-sm">{item.product}</p>
          <p className="text-muted-foreground text-xs">
            {formatDateFull(item.activityDate)}
            {item.quantity
              ? ` · ${item.quantity} ${item.quantity === 1 ? "pessoa" : "pessoas"}`
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referrals card (table-based, aligned with IndicacoesPage)
// ---------------------------------------------------------------------------

function ReferralsCard({
  referrals,
  onSelect,
}: {
  referrals: AfiliadoReferral[];
  onSelect: (r: AfiliadoReferral) => void;
}) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="p-5">
        <SectionHeading
          title="Minhas Indicações"
          description="Últimas indicações realizadas"
          action={
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                window.location.hash = "#indicacoes";
              }}
            >
              Ver todas as indicações
            </Button>
          }
        />

        <div className="border-border bg-card mt-4 overflow-x-auto rounded-xl border">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Comprador / ID do pedido
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Organização
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Data do pedido
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Itens (Qtde.)
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">Valor</TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Comissão
                </TableHead>
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
                    tabIndex={0}
                    aria-label={`Abrir detalhes de ${referral.customer}`}
                    className={cn(
                      "focus-visible:bg-muted/50 cursor-pointer",
                      isAbandoned && "opacity-60"
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
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground truncate text-sm font-medium">
                          {referral.customer}
                        </span>
                        <span className="text-muted-foreground text-xs">{referral.orderId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground text-sm">{org?.name ?? "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground text-sm">
                        {formatDateWithTime(referral.purchaseDate, referral.time)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <CartItemsPreview referral={referral} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-foreground text-sm font-medium">
                          {referral.purchaseValue}
                        </span>
                        <OrderStatusBadge status={referral.orderStatus} className="text-[11px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-foreground text-sm font-medium">
                          {displayCommission}
                        </span>
                        <CommissionStatusBadge
                          status={referral.commissionStatus}
                          className="text-[11px]"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Referral detail sheet (drawer)
// ---------------------------------------------------------------------------

function ReferralDrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-[32px] w-full items-center border-y border-[#f0f1f3] bg-[#f9fafb] px-6">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] tracking-[0.8px] text-[#a4a7ae] uppercase">
          {title}
        </p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function ReferralDetailField({
  icon,
  label,
  value,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon ? (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#f5f5f5] bg-[#fafafa]">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="mb-[2px] font-['Helvetica_Neue:Regular',sans-serif] text-[12px] text-[#717680]">
          {label}
        </p>
        <div className="min-w-0 font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-[#181d27]">
          {value}
        </div>
      </div>
    </div>
  );
}

function referralInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ReferralDetailSheet({
  referral,
  onClose,
}: {
  referral: AfiliadoReferral | null;
  onClose: () => void;
}) {
  const org = referral ? organizationMap[referral.organizationId] : null;
  return (
    <Sheet open={referral !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-hidden sm:max-w-lg"
      >
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle>Detalhe da indicação</SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes da indicação, do pedido e dos itens comprados.
          </SheetDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fechar detalhe da indicação"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} aria-hidden="true" />
          </Button>
        </SheetHeader>

        {referral ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-full">
                    <span className="font-medium">{referralInitials(referral.customer)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {referral.customer}
                    </p>
                    <div className="text-muted-foreground mt-1 flex min-w-0 items-center gap-1.5">
                      <HugeiconsIcon icon={Ticket02Icon} size={16} aria-hidden="true" />
                      <p className="truncate text-xs">
                        {org?.name ?? "-"} · {referral.orderId}
                      </p>
                    </div>
                  </div>
                </div>

                <DataList orientation="horizontal" size="sm" className="mt-5 gap-4">
                  <DataListItem className="justify-between py-2">
                    <DataListLabel>Pedido</DataListLabel>
                    <DataListValue className="text-right font-medium">
                      {formatDateWithTime(referral.purchaseDate, referral.time)}
                    </DataListValue>
                  </DataListItem>
                  <DataListItem className="justify-between py-2">
                    <DataListLabel>Origem</DataListLabel>
                    <DataListValue>
                      <Badge variant="outline">{originLabels[referral.origin]}</Badge>
                    </DataListValue>
                  </DataListItem>
                </DataList>
              </div>

              <ReferralDrawerSection title="Dados da compra">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ReferralDetailField
                    className="items-start sm:col-span-2"
                    icon={
                      <HugeiconsIcon
                        icon={ShoppingBag01Icon}
                        size={18}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                    label="Itens do carrinho"
                    value={<CartItemsDetailValue referral={referral} />}
                  />
                  <ReferralDetailField
                    icon={
                      <HugeiconsIcon
                        icon={MoneyBag02Icon}
                        size={18}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                    label="Valor da venda"
                    value={<span className="text-base font-medium">{referral.purchaseValue}</span>}
                  />
                  <ReferralDetailField
                    label="Status do pedido"
                    value={<OrderStatusBadge status={referral.orderStatus} />}
                  />
                </div>
              </ReferralDrawerSection>

              <ReferralDrawerSection title="Dados da comissão">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ReferralDetailField
                    icon={
                      <HugeiconsIcon
                        icon={Wallet02Icon}
                        size={18}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                    label="Comissão"
                    value={
                      <span className="text-base font-medium">
                        {referral.orderStatus === "Abandonado" ? "R$ 0,00" : referral.commission}
                      </span>
                    }
                  />
                  <ReferralDetailField
                    label="Status da comissão"
                    value={<CommissionStatusBadge status={referral.commissionStatus} />}
                  />
                  {referral.commissionRule ? (
                    <ReferralDetailField
                      className="sm:col-span-2"
                      label="Regra de comissão"
                      value={referral.commissionRule}
                    />
                  ) : null}
                </div>
              </ReferralDrawerSection>
            </div>

            <SheetFooter className="bg-card border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Fechar aba
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Affiliate code banner
// ---------------------------------------------------------------------------

function AffiliateCodeBanner() {
  return (
    <div className="bg-primary border-primary-foreground/30 relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border px-5 py-4 shadow-sm">
      {/* Topographic pattern SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden rounded-xl opacity-[0.08]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="topo-pattern-affiliate"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,50 Q50,40 100,50 T200,50"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d="M0,80 Q50,70 100,80 T200,80"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <path
              d="M0,110 Q50,100 100,110 T200,110"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <path
              d="M0,140 Q50,130 100,140 T200,140"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.2"
            />
            <circle cx="60" cy="60" r="3" fill="white" opacity="0.3" />
            <circle cx="140" cy="90" r="2" fill="white" opacity="0.3" />
            <circle cx="180" cy="130" r="2.5" fill="white" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-pattern-affiliate)" />
      </svg>

      {/* Mountain silhouette decoration */}
      <div className="pointer-events-none absolute right-0 bottom-[-30px] left-0 h-[60px] overflow-hidden rounded-b-xl opacity-[0.12]">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <path
            d="M0,60 L0,42 C55,40 92,26 150,15 C207,4 248,27 300,35 C358,44 391,18 450,10 C509,2 544,22 600,30 C655,38 693,25 750,20 C808,15 848,32 900,40 C956,48 994,29 1050,25 C1108,21 1150,39 1200,45 L1200,60 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[16px]">
        <span className="bg-foreground text-background grid size-10 shrink-0 place-items-center rounded-full shadow-sm">
          <HugeiconsIcon icon={Ticket02Icon} size={18} />
        </span>
        <div className="flex min-w-0 flex-col gap-[6px]">
          <span className="text-primary-foreground/75 text-xs">Seu código de afiliado</span>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <code className="bg-primary-foreground/15 text-primary-foreground ring-primary-foreground/20 inline-flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-sm font-medium ring-1">
              <span className="truncate">{affiliateCode}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-primary-foreground/75 hover:text-primary-foreground grid size-4 shrink-0 cursor-help place-items-center rounded-full transition-colors"
                      aria-label="Ajuda sobre o código de afiliado"
                    >
                      <HugeiconsIcon icon={HelpCircleIcon} size={14} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>
                    Use este código nas suas indicações diretas
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </code>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full min-w-0 shrink-0 flex-col items-stretch gap-2 self-stretch sm:flex-row sm:items-center sm:gap-4 md:w-auto md:self-center">
        <div className="relative z-20 min-w-0 flex-1 md:flex-none">
          <Button
            type="button"
            variant="ghost"
            className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground border-primary-foreground/20 bg-primary-foreground/10 relative h-auto min-h-10 w-full min-w-0 shrink-0 border px-2 py-2 text-center leading-tight whitespace-normal md:h-10 md:w-auto md:px-4 md:whitespace-nowrap"
            onClick={() => {
              window.location.hash = "#produtosLinks";
            }}
          >
            Ver links por organização
          </Button>
        </div>
        <div className="relative min-w-0 flex-1 md:flex-none">
          <CopyButton
            value={affiliateCode}
            copyLabel="Copiar"
            copiedLabel="Copiado"
            errorLabel="Tentar novamente"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-10 w-full min-w-0 shadow-sm md:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps card (empty state / onboarding)
// ---------------------------------------------------------------------------

function StepsCard() {
  return (
    <section className="border-border bg-card flex flex-1 flex-col rounded-2xl border p-5 shadow-sm">
      <SectionHeading
        title="Passo a Passo"
        description="Confira como funciona e como você ganha suas comissões"
      />

      <div className="relative mt-6 flex flex-1 flex-col justify-between gap-5">
        <span className="bg-border absolute top-9 left-4 h-[calc(100%-72px)] w-px" />
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex gap-3">
            <span className="border-border bg-muted text-primary z-10 grid size-8 shrink-0 place-items-center rounded-lg border text-sm">
              {index + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-foreground text-sm">{step.title}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Empty state (zero indicações no recorte)
// ---------------------------------------------------------------------------

function EmptyState({
  selectedOrg,
  search,
  onClear,
}: {
  selectedOrg: string;
  search: string;
  onClear: () => void;
}) {
  const isAll = selectedOrg === "all";
  const hasFilters = selectedOrg !== "all" || search.trim().length > 0;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
      <AffiliateEmptyState
        title={
          search.trim().length > 0
            ? "Nenhuma indicação encontrada"
            : `Nenhuma indicação${isAll ? "" : " nesta organização"} ainda`
        }
        description={
          search.trim().length > 0
            ? "Ajuste a busca ou limpe os filtros para ver outras indicações."
            : "Compartilhe seu link para começar a receber comissões"
        }
        className="h-full min-h-64 min-w-0 [&>div]:min-w-0 [&>div>h3]:w-full [&>div>h3]:max-w-full [&>div>h3]:break-words [&>div>p]:w-full [&>div>p]:max-w-full [&>div>p]:break-words"
        action={
          hasFilters ? (
            <Button type="button" variant="outline" size="sm" onClick={onClear}>
              Limpar filtros
            </Button>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-5">
        <StepsCard />
      </div>
    </div>
  );
}

function DashboardNavigation() {
  return (
    <nav
      aria-label="Atalhos do painel"
      className="border-border bg-card grid grid-cols-1 gap-2 rounded-xl border p-3 sm:grid-cols-2 lg:grid-cols-5"
    >
      {dashboardLinks.map((link) => (
        <Button
          key={link.href}
          asChild
          variant="outline"
          size="sm"
          className="h-auto min-h-8 w-full px-2 py-2 text-center leading-tight whitespace-normal sm:h-8 sm:whitespace-nowrap"
        >
          <a href={link.href}>{link.label}</a>
        </Button>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function AfiliadosPage() {
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const collapseButton = document.querySelector<HTMLButtonElement>(
      'aside button[title="Encolher menu"]'
    );
    collapseButton?.click();
  }, []);

  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedReferral, setSelectedReferral] = useState<AfiliadoReferral | null>(null);
  const organizations = listAffiliateOrganizations();

  const internalPeriod = getInternalPeriod(selectedPeriod);
  const periodLabel = getPeriodLabel(selectedPeriod);

  const kpis = getKpis(internalPeriod, selectedOrg);
  const referrals = filterReferrals(undefined, {
    organizationId: selectedOrg,
    orderStatuses: dashboardOrderStatuses,
    search,
  });
  const isEmpty = referrals.length === 0;

  const hasActiveFilters =
    search.trim().length > 0 || selectedOrg !== "all" || selectedPeriod !== "30d";

  const clearFilters = () => {
    setSearch("");
    setSelectedOrg("all");
    setSelectedPeriod("30d");
  };

  return (
    <AppPage>
      <div className="flex min-w-0 flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="flex flex-wrap items-baseline gap-1.5 text-2xl tracking-tight">
            <span className="text-foreground font-medium">Oi Katiely,</span>
            <span className="text-muted-foreground font-normal">bem-vinda de volta!</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Confira o resumo das suas indicações e valores
          </p>
        </header>

        <AffiliateCodeBanner />

        {/* KPIs */}
        <KpiRow kpis={kpis} periodLabel={periodLabel} />

        <DashboardNavigation />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[min(100%,20rem)] flex-1 md:max-w-[20em]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Pesquisar indicações"
              placeholder="Pesquisar indicações"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <OrganizationFilter
            organizations={organizations}
            value={selectedOrg}
            onValueChange={setSelectedOrg}
            className="w-full sm:w-auto"
          />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-8 w-full text-xs sm:w-[220px]" aria-label="Período">
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
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Content */}
        {isEmpty ? (
          <EmptyState selectedOrg={selectedOrg} search={search} onClear={clearFilters} />
        ) : (
          <ReferralsCard referrals={referrals} onSelect={setSelectedReferral} />
        )}
      </div>

      {/* Detail drawer */}
      <ReferralDetailSheet referral={selectedReferral} onClose={() => setSelectedReferral(null)} />
    </AppPage>
  );
}
