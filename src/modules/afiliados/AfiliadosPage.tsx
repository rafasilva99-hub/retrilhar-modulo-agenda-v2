import { useState } from "react";
import {
  AddSquareIcon,
  AsteriskIcon,
  Calendar03Icon,
  Copy02Icon,
  FilterHorizontalIcon,
  HelpCircleIcon,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  affiliateCode,
  type AfiliadoKpis,
  type AfiliadoPeriod,
  type AfiliadoReferral,
  type CommissionStatus,
  getFilteredReferrals,
  getKpis,
  type OrderStatus,
  organizationMap,
  originLabels,
  type ReferralOrigin,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Status styling (with dark-mode variants, matching CardStats pattern)
// ---------------------------------------------------------------------------

const orderStatusClassName: Record<OrderStatus, string> = {
  Pago: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400",
  Pendente:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-400",
};

const commissionStatusLabel: Record<CommissionStatus, string> = {
  pendente: "Pendente",
  quitado: "Quitado",
};

const commissionStatusClassName: Record<CommissionStatus, string> = {
  pendente: "text-amber-600 dark:text-amber-400",
  quitado: "text-emerald-600 dark:text-emerald-400",
};

const originClassName: Record<ReferralOrigin, string> = {
  "link-geral": "border-border bg-muted text-muted-foreground",
  "link-org":
    "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-400",
  "link-produto":
    "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/50 dark:text-violet-400",
  cupom:
    "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-400",
};

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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeading({
  icon,
  title,
  description,
  action,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-[10px]">
        <HugeiconsIcon icon={icon} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-foreground truncate text-sm font-normal">{title}</h2>
        <p className="text-muted-foreground truncate text-xs">{description}</p>
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Organization filter (tabs for ≤ 4 options)
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// KPI cards (aligned with CardStats visual pattern)
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
            <span className="text-muted-foreground text-xs font-medium leading-tight">
              {title}
            </span>
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
              <span className="text-muted-foreground mt-[0.25em] block text-xs">
                {detail}
              </span>
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

function KpiRow({ kpis }: { kpis: AfiliadoKpis; period: AfiliadoPeriod }) {
  return (
    <div className="grid grid-cols-1 gap-[1em] sm:grid-cols-2 md:grid-cols-4">
      <KpiCard
        title="Indicações no período"
        value={String(kpis.indicacoesQtd)}
        icon={UserStar01Icon}
        detail={`${kpis.indicacoesValor} originados · ${kpis.indicacoesPagas} pagas`}
      />
      <KpiCard
        title="Carrinhos abandonados"
        value={String(kpis.carrinhosQtd)}
        icon={ShoppingBag01Icon}
        detail={`${kpis.carrinhosValor} em valor`}
      />
      <KpiCard
        title="Comissão recebida"
        value={kpis.comissaoRecebida}
        icon={Wallet02Icon}
        badge={{ label: "Pago", color: "#079455" }}
      />
      <KpiCard
        title="Comissão a receber"
        value={kpis.comissaoReceber}
        icon={Calendar03Icon}
        badge={{ label: "Pendente", color: "#d97706" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referral row
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function ReferralRow({
  referral,
  onClick,
}: {
  referral: AfiliadoReferral;
  showOrg?: boolean;
  onClick: () => void;
}) {
  const commissionSettled = referral.commissionStatus === "quitado";

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
          <p className="min-w-0 truncate text-[14px] text-[#0a0a0a]">
            {referral.customer}
          </p>
          <p className="text-[12px] text-[#a1a1aa] whitespace-nowrap">
            {originLabels[referral.origin]}
          </p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Atividade + data */}
      <div
        className="flex shrink-0 items-center min-w-0"
        style={{ width: 280, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex min-w-0 items-center gap-[4px]">
            <p className="truncate text-[13px] text-[#252b37]">{referral.product}</p>
            <span className="shrink-0 text-[#a1a1aa]">·</span>
            <p className="shrink-0 text-[13px] text-[#252b37]">{formatDate(referral.date)}</p>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">
            Atividade / Data de compra
          </p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Valor + Status do pedido */}
      <div
        className="flex shrink-0 items-center min-w-0"
        style={{ width: 220, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex items-center gap-[6px]">
            <p className="truncate text-[13px] whitespace-nowrap text-[#252b37]">
              {referral.purchaseValue}
            </p>
            <span className="text-[#a1a1aa]">·</span>
            <div
              className="flex w-fit items-center gap-[4px]"
              style={{ color: referral.orderStatus === "Pago" ? "rgb(7, 148, 85)" : "rgb(220, 104, 3)" }}
            >
              <p className="text-[13px] truncate">
                {referral.orderStatus === "Pago" ? "Quitado" : referral.orderStatus}
              </p>
              {referral.orderStatus === "Pago" ? (
                <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 14 14">
                  <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7 4.5v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">
            Valor / Status do pedido
          </p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Comissão + Status da comissão */}
      <div
        className="flex shrink-0 items-center min-w-0"
        style={{ width: 220, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex items-center gap-[6px]">
            <p className="truncate text-[13px] whitespace-nowrap text-[#252b37]">
              {referral.commission}
            </p>
            <span className="text-[#a1a1aa]">·</span>
            <div
              className="flex w-fit items-center gap-[4px]"
              style={{ color: commissionSettled ? "rgb(7, 148, 85)" : "rgb(220, 104, 3)" }}
            >
              <p className="text-[13px] truncate">
                {commissionStatusLabel[referral.commissionStatus]}
              </p>
              {commissionSettled ? (
                <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 14 14">
                  <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="shrink-0 size-[12px]" fill="none" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7 4.5v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">
            Comissão / Status da comissão
          </p>
        </div>
      </div>

    </button>
  );
}

// ---------------------------------------------------------------------------
// Referrals card
// ---------------------------------------------------------------------------

function ReferralsCard({
  referrals,
  showOrg,
  onSelect,
}: {
  referrals: AfiliadoReferral[];
  showOrg: boolean;
  onSelect: (r: AfiliadoReferral) => void;
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
      <SectionHeading
        icon={MoneyBag02Icon}
        title="Minhas Indicações"
        description="Últimas indicações realizadas"
        action={
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            Ver todas as indicações
          </Button>
        }
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        {referrals.map((referral) => (
          <ReferralRow
            key={referral.id}
            referral={referral}
            showOrg={showOrg}
            onClick={() => onSelect(referral)}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Referral detail sheet (drawer)
// ---------------------------------------------------------------------------

function ReferralDetailSheet({
  referral,
  onClose,
  showOrg,
}: {
  referral: AfiliadoReferral | null;
  onClose: () => void;
  showOrg: boolean;
}) {
  const org = referral ? organizationMap[referral.organizationId] : null;

  return (
    <Sheet open={!!referral} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalhe da Indicação</SheetTitle>
        </SheetHeader>

        {referral && (
          <div className="mt-6 flex flex-col gap-6 px-6 pb-6">
            <DataList orientation="vertical" size="sm" className="gap-4">
              <DataListItem className="gap-1">
                <DataListLabel>Cliente</DataListLabel>
                <DataListValue className="font-medium">{referral.customer}</DataListValue>
              </DataListItem>

              <DataListItem className="gap-1">
                <DataListLabel>Produto</DataListLabel>
                <DataListValue>{referral.product}</DataListValue>
              </DataListItem>

              {showOrg && org && (
                <DataListItem className="gap-1">
                  <DataListLabel>Organização</DataListLabel>
                  <DataListValue>{org.name}</DataListValue>
                </DataListItem>
              )}

              <DataListItem className="gap-1">
                <DataListLabel>Data</DataListLabel>
                <DataListValue>{referral.date.split("-").reverse().join("/")}</DataListValue>
              </DataListItem>

              <DataListItem className="gap-1">
                <DataListLabel>Origem</DataListLabel>
                <DataListValue>
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-1.5 py-0.5 text-xs",
                      originClassName[referral.origin]
                    )}
                  >
                    {originLabels[referral.origin]}
                  </span>
                </DataListValue>
              </DataListItem>

              <div className="border-border border-t" />

              <DataListItem className="gap-1">
                <DataListLabel>Valor da compra</DataListLabel>
                <DataListValue className="text-lg font-medium">
                  {referral.purchaseValue}
                </DataListValue>
              </DataListItem>

              <DataListItem className="gap-1">
                <DataListLabel>Status do pedido</DataListLabel>
                <DataListValue>
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs",
                      orderStatusClassName[referral.orderStatus]
                    )}
                  >
                    {referral.orderStatus}
                  </span>
                </DataListValue>
              </DataListItem>

              <div className="border-border border-t" />

              <DataListItem className="gap-1">
                <DataListLabel>Comissão</DataListLabel>
                <DataListValue className="text-lg font-medium">{referral.commission}</DataListValue>
              </DataListItem>

              <DataListItem className="gap-1">
                <DataListLabel>Status da comissão</DataListLabel>
                <DataListValue>
                  <span
                    className={cn(
                      "text-sm font-medium capitalize",
                      commissionStatusClassName[referral.commissionStatus]
                    )}
                  >
                    {commissionStatusLabel[referral.commissionStatus]}
                  </span>
                </DataListValue>
              </DataListItem>
            </DataList>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Affiliate code banner
// ---------------------------------------------------------------------------

function AffiliateCodeBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border border-blue-400/30 px-5 py-4 shadow-sm" style={{ background: "linear-gradient(135deg, #0b5ed7 0%, #084fb7 100%)" }}>
      {/* Topographic pattern SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none rounded-xl overflow-hidden" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="topo-pattern-affiliate" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M0,50 Q50,40 100,50 T200,50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
            <path d="M0,80 Q50,70 100,80 T200,80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
            <path d="M0,110 Q50,100 100,110 T200,110" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
            <path d="M0,140 Q50,130 100,140 T200,140" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2"/>
            <circle cx="60" cy="60" r="3" fill="white" opacity="0.3"/>
            <circle cx="140" cy="90" r="2" fill="white" opacity="0.3"/>
            <circle cx="180" cy="130" r="2.5" fill="white" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-pattern-affiliate)"/>
      </svg>

      {/* Mountain silhouette decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] opacity-[0.12] pointer-events-none rounded-b-xl overflow-hidden">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <path d="M0,60 L0,40 L150,15 L300,35 L450,10 L600,30 L750,20 L900,40 L1050,25 L1200,45 L1200,60 Z" fill="white"/>
        </svg>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[16px]">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white shadow-sm">
          <HugeiconsIcon icon={Ticket02Icon} size={18} />
        </span>
        <div className="flex min-w-0 flex-col gap-[6px]">
          <span className="text-xs text-white/75">Seu código de afiliado</span>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <code className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 font-mono text-sm font-medium text-white ring-1 ring-white/20">
              <span className="truncate">{affiliateCode}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="grid size-4 shrink-0 cursor-help place-items-center rounded-full text-white/75 transition-colors hover:text-white"
                      aria-label="Ajuda sobre o código de afiliado"
                    >
                      <HugeiconsIcon icon={HelpCircleIcon} size={14} />
                    </span>
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

      <div className="relative z-10 flex w-full shrink-0 items-center gap-4 self-stretch md:w-auto md:self-center">
        <div className="relative z-20 flex-1 md:flex-none">
          <button
            type="button"
            className="relative h-10 w-full shrink-0 cursor-pointer rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 md:w-auto"
          >
            <div className="flex size-full items-center justify-center px-4 py-2.5">
              <p className="text-sm font-medium whitespace-nowrap text-white">
                Ver links por organização
              </p>
            </div>
          </button>
        </div>
        <div className="group/copiar relative flex-1 md:flex-none">
          <button
            type="button"
            className="relative h-10 w-full shrink-0 cursor-pointer rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-white/95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] md:w-auto"
            onClick={handleCopy}
          >
            <div className="flex size-full items-center justify-center gap-2 px-4">
              <HugeiconsIcon icon={Copy02Icon} size={16} className="text-[#0b5ed7]" />
              <p className="text-sm font-medium whitespace-nowrap text-[#0b5ed7]">
                {copied ? "Copiado" : "Copiar"}
              </p>
            </div>
          </button>
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
        icon={AsteriskIcon}
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

function EmptyState({ selectedOrg }: { selectedOrg: string }) {
  const isAll = selectedOrg === "all";
  return (
    <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
      <section className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
        <HugeiconsIcon icon={UserStar01Icon} size={48} className="text-muted-foreground/40 mb-4" />
        <p className="text-foreground text-base font-medium">
          Nenhuma indicação{isAll ? "" : " nesta organização"} ainda
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Compartilhe seu link para começar a receber comissões
        </p>
      </section>
      <div className="flex flex-col gap-5">
        <StepsCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function AfiliadosPage() {
  const selectedOrg = "all";
  const period: AfiliadoPeriod = "mes";
  const [selectedReferral, setSelectedReferral] = useState<AfiliadoReferral | null>(null);

  const kpis = getKpis(period, selectedOrg);
  const referrals = getFilteredReferrals(selectedOrg);
  const isEmpty = referrals.length === 0;
  const showOrg = selectedOrg === "all";

  return (
    <AppPage>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="flex flex-wrap items-baseline gap-1.5 text-2xl tracking-tight">
            <span className="text-foreground font-medium">Oi Katiely,</span>
            <span className="text-muted-foreground font-normal">bem-vinda de volta!</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Confira o resumo das suas indicações e valores • Atualizado agora há pouco
          </p>
        </header>

        <AffiliateCodeBanner />

        {/* KPIs */}
        <KpiRow kpis={kpis} period={period} />

        {/* Filters */}
        <div className="flex items-center gap-[0.75em]">
          <div className="relative flex-1 md:max-w-[20em]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground absolute left-[0.75em] top-1/2 -translate-y-1/2"
            />
            <Input placeholder="Pesquisar..." className="pl-[2.25em]" />
          </div>
          <div className="hidden md:block">
            <Button variant="outline" size="default">
              <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
              Filtros
            </Button>
          </div>
          <Button className="hidden md:inline-flex ml-auto">
            <HugeiconsIcon icon={AddSquareIcon} size={16} />
            Solicitar filiação
          </Button>
        </div>

        {/* Content */}
        {isEmpty ? (
          <EmptyState selectedOrg={selectedOrg} />
        ) : (
          <ReferralsCard referrals={referrals} showOrg={showOrg} onSelect={setSelectedReferral} />
        )}
      </div>

      {/* Detail drawer */}
      <ReferralDetailSheet
        referral={selectedReferral}
        onClose={() => setSelectedReferral(null)}
        showOrg={showOrg}
      />
    </AppPage>
  );
}
