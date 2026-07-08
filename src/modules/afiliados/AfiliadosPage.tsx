import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
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
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  affiliateCode,
  affiliateOrganizations,
  type AfiliadoKpis,
  type AfiliadoPeriod,
  type AfiliadoReferral,
  type CommissionStatus,
  getFilteredReferrals,
  getKpis,
  organizationMap,
  originLabels,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
const commissionStatusLabel: Record<CommissionStatus, string> = {
  pendente: "Pendente",
  quitado: "Quitado",
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
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
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
  icon: React.ReactNode;
  detail?: string;
  badge?: { label: string; color: string };
}

function IndicacoesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-primary"
    >
      <path
        d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarrinhosAbandonadosIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-primary"
    >
      <path
        d="M10.5 20.25C10.5 20.6642 10.1642 21 9.75 21C9.33579 21 9 20.6642 9 20.25C9 19.8358 9.33579 19.5 9.75 19.5C10.1642 19.5 10.5 19.8358 10.5 20.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 20.25C19 20.6642 18.6642 21 18.25 21C17.8358 21 17.5 20.6642 17.5 20.25C17.5 19.8358 17.8358 19.5 18.25 19.5C18.6642 19.5 19 19.8358 19 20.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3H2.20664C3.53124 3 4.19354 3 4.6255 3.40221C5.05746 3.80441 5.10464 4.46503 5.19902 5.78626L5.45035 9.30496C5.5924 11.2936 5.66342 12.2879 5.96476 13.0961C6.62531 14.8677 8.08229 16.2244 9.89648 16.757C10.7241 17 11.7267 17 13.7317 17C15.8373 17 16.9129 17 17.7646 16.7416C19.6822 16.1599 21.1828 14.6593 21.7645 12.7417C21.9077 12.2695 21.9716 11.7373 22 11M14 6H5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 3L22 8M17 8L22 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ComissaoAReceberIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-primary"
    >
      <path
        d="M14.5 13.9999C14.5 15.3806 13.3807 16.4999 12 16.4999C10.6193 16.4999 9.5 15.3806 9.5 13.9999C9.5 12.6192 10.6193 11.4999 12 11.4999C13.3807 11.4999 14.5 12.6192 14.5 13.9999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7C18.9452 7.08474 20.3228 7.40382 21.1329 7.65487C21.6756 7.82306 22 8.33744 22 8.9056V18.6804C22 19.7955 20.7719 20.6345 19.6762 20.4276C18.7361 20.2501 17.5107 20.1075 16 20.1075C11.2491 20.1075 10.1096 21.9132 3.1448 20.3773C2.47265 20.2291 2 19.6246 2 18.9363V8.91924C2 7.94339 2.92079 7.23174 3.87798 7.42169C5.31598 7.70704 6.49012 7.84057 7.5 7.87661"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 11C3.95133 11 5.70483 9.40507 5.92901 7.75417M18.5005 7.5C18.5005 9.53964 20.2655 11.469 22 11.469M22 17C20.1009 17 18.2601 18.3102 18.102 20.0983M6.00049 20.4961C6.00049 18.287 4.20963 16.4961 2.00049 16.4961"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5L12 3M12 8.5C12.7002 8.5 14.5 6 14.5 6M12 8.5C11.2998 8.5 9.5 6 9.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
            {icon}
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
        icon={<IndicacoesIcon />}
        detail={`${kpis.indicacoesValor} originados · ${kpis.indicacoesPagas} pagas`}
      />
      <KpiCard
        title="Carrinhos abandonados"
        value={String(kpis.carrinhosQtd)}
        icon={<CarrinhosAbandonadosIcon />}
        detail={`${kpis.carrinhosValor} em valor`}
      />
      <KpiCard
        title="Comissão recebida"
        value={kpis.comissaoRecebida}
        icon={<HugeiconsIcon icon={Wallet02Icon} size={20} className="text-primary" />}
        badge={{ label: "Quitado", color: "#079455" }}
      />
      <KpiCard
        title="Comissão a receber"
        value={kpis.comissaoReceber}
        icon={<ComissaoAReceberIcon />}
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
        title="Minhas Indicações"
        description="Últimas indicações realizadas"
        action={
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => { window.location.hash = "#indicacoes"; }}
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

function ReferralDrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon ? (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#f5f5f5] bg-[#fafafa]">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] mb-[2px] text-[12px] text-[#717680]">
          {label}
        </p>
        <div className="font-['Helvetica_Neue:Regular',sans-serif] min-w-0 text-[14px] text-[#181d27]">
          {value}
        </div>
      </div>
    </div>
  );
}

function ReferralStatusPill({
  label,
  variant,
}: {
  label: string;
  variant: "green" | "amber" | "blue" | "gray";
}) {
  const styles = {
    green: { color: "#17b26a" },
    amber: { color: "#dc6803" },
    blue: { color: "#0b5ed7" },
    gray: { color: "#535862" },
  }[variant];

  return (
    <div className="group relative inline-flex">
      <div className="flex h-6 items-center gap-[6px] rounded-full border border-[#e4e4e7] bg-white px-2 whitespace-nowrap">
        {variant === "green" || variant === "blue" ? (
          <svg
            className="size-[14px] shrink-0"
            fill="none"
            style={{ color: styles.color }}
            viewBox="0 0 14 14"
          >
            <path
              d="M3 7l3 3 5-5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        ) : variant === "amber" ? (
          <svg
            className="size-[14px] shrink-0"
            fill="none"
            style={{ color: styles.color }}
            viewBox="0 0 14 14"
          >
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M7 4.5v3M7 9.5h.01"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
          </svg>
        ) : (
          <svg
            className="size-[14px] shrink-0"
            fill="none"
            style={{ color: styles.color }}
            viewBox="0 0 14 14"
          >
            <path
              d="M7 2.5v9M2.5 7h9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.3"
            />
          </svg>
        )}
        <span
          className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-none"
          style={{ color: styles.color }}
        >
          {label}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-full bg-[#181d27] px-[14px] py-[6px] text-center whitespace-nowrap opacity-0 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] transition-opacity duration-150 group-hover:opacity-100">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-4 text-white">
          {label}
        </p>
        <div className="absolute top-full left-1/2 size-0 -translate-x-1/2 border-t-[5px] border-r-[5px] border-l-[5px] border-t-[#181d27] border-r-transparent border-l-transparent" />
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
  showOrg,
}: {
  referral: AfiliadoReferral | null;
  onClose: () => void;
  showOrg: boolean;
}) {
  const org = referral ? organizationMap[referral.organizationId] : null;
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!referral) return;

    setIsClosing(false);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [referral]);

  if (!referral) return null;

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 200);
  };

  const purchaseDate = referral.date.split("-").reverse().join("/");
  const ticketName = "Ingresso Adulto";
  const orderSettled = referral.orderStatus === "Pago";
  const commissionSettled = referral.commissionStatus === "quitado";
  const originVariant =
    referral.origin === "cupom" ? "amber" : referral.origin === "link-geral" ? "gray" : "blue";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      onKeyDown={(event) => event.key === "Escape" && handleClose()}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-full w-full flex-col overflow-hidden rounded-l-[16px] border border-[#e9eaeb] bg-white shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:w-[720px]",
          isClosing
            ? "animate-out slide-out-to-right fill-mode-forwards duration-200"
            : "animate-in slide-in-from-right duration-200"
        )}
      >
        <div className="shrink-0">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">
              Detalhe da indicação
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[#f5f5f5]"
              aria-label="Fechar detalhe da indicação"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="#717680"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
          <div className="mx-6 h-px bg-[#f0f1f3]" />
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/[0.08] hover:[&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#0b5ed7]">
                  {referralInitials(referral.customer)}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] truncate text-[15px] text-[#181d27]">
                    {referral.customer}
                  </p>
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Ticket02Icon}
                    size={16}
                    className="shrink-0 text-[#535862]"
                  />
                  <p className="font-['Helvetica_Neue:Light',sans-serif] truncate text-[13px] text-[#535862]">
                    {ticketName}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 pb-1 sm:grid-cols-2">
              <ReferralDetailField
                icon={
                  <HugeiconsIcon icon={Calendar03Icon} size={18} className="text-[#535862]" />
                }
                label="Data de compra"
                value={purchaseDate}
              />
              <ReferralDetailField
                icon={
                  <HugeiconsIcon icon={UserStar01Icon} size={18} className="text-[#535862]" />
                }
                label="Origem"
                value={
                  <ReferralStatusPill label={originLabels[referral.origin]} variant={originVariant} />
                }
              />
            </div>
          </div>

          <ReferralDrawerSection title="Dados da compra">
            <div className="grid gap-5 sm:grid-cols-2">
              <ReferralDetailField
                icon={
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={18} className="text-[#535862]" />
                }
                label="Atividade"
                value={<span className="block truncate">{referral.product}</span>}
              />
              {showOrg && org ? (
                <ReferralDetailField
                  icon={
                    <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#535862]" />
                  }
                  label="Organização"
                  value={<span className="block truncate">{org.name}</span>}
                />
              ) : null}
              <ReferralDetailField
                icon={
                  <HugeiconsIcon icon={MoneyBag02Icon} size={18} className="text-[#535862]" />
                }
                label="Valor da compra"
                value={
                  <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px]">
                    {referral.purchaseValue}
                  </span>
                }
              />
              <ReferralDetailField
                label="Status do pedido"
                value={
                  <ReferralStatusPill
                    label={orderSettled ? "Quitado" : "Pendente"}
                    variant={orderSettled ? "green" : "amber"}
                  />
                }
              />
            </div>
          </ReferralDrawerSection>

          <ReferralDrawerSection title="Dados da comissão">
            <div className="grid gap-5 sm:grid-cols-2">
              <ReferralDetailField
                icon={
                  <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#535862]" />
                }
                label="Comissão"
                value={
                  <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px]">
                    {referral.commission}
                  </span>
                }
              />
              <ReferralDetailField
                label="Status da comissão"
                value={
                  <ReferralStatusPill
                    label={commissionStatusLabel[referral.commissionStatus]}
                    variant={commissionSettled ? "green" : "amber"}
                  />
                }
              />
            </div>
          </ReferralDrawerSection>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[#e9eaeb] bg-white px-5 transition-colors hover:bg-[#fafafa]"
          >
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#414651]">
              Fechar aba
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
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
      <div className="absolute bottom-[-30px] left-0 right-0 h-[60px] opacity-[0.12] pointer-events-none rounded-b-xl overflow-hidden">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <path d="M0,60 L0,42 C55,40 92,26 150,15 C207,4 248,27 300,35 C358,44 391,18 450,10 C509,2 544,22 600,30 C655,38 693,25 750,20 C808,15 848,32 900,40 C956,48 994,29 1050,25 C1108,21 1150,39 1200,45 L1200,60 Z" fill="white"/>
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
          <Select defaultValue="all">
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
          <div className="hidden md:block ml-auto">
            <Button variant="outline" size="default">
              <HugeiconsIcon icon={FilterHorizontalIcon} size={16} />
              Filtros
            </Button>
          </div>
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
