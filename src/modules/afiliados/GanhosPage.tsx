import { type ReactNode, useEffect, useState } from "react";
import {
  AnalyticsUpIcon,
  Calendar03Icon,
  MoneyBag02Icon,
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
import { Button } from "@/components/ui/button";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ganhosTabLabels,
  getGanhosKpis,
  getOrgBreakdown,
  organizationMap,
  periodLabels,
} from "@/mocks/afiliados";
import {
  AffiliateEmptyState,
  AffiliateKpiCard,
  CommissionStatusBadge,
  OrganizationFilter,
  SectionHeading,
} from "@/modules/afiliados/components";
import {
  filterCommissions,
  listAffiliateOrganizations,
} from "@/modules/afiliados/services/afiliados-mock-service";
import type {
  AfiliadoPeriod,
  ComissaoLancamento,
  CommissionFilters,
  GanhosTab,
} from "@/modules/afiliados/types";

// allow: SIZE_OK — this screen owns its private ledger and detail sheet; extraction is outside the requested write set.
const periodOptions: readonly { value: AfiliadoPeriod; label: string }[] = [
  { value: "semana", label: periodLabels.semana },
  { value: "mes", label: periodLabels.mes },
  { value: "ano", label: periodLabels.ano },
];
const tabOptions: readonly { value: GanhosTab; label: string }[] = [
  { value: "todas", label: ganhosTabLabels.todas },
  { value: "pendentes", label: ganhosTabLabels.pendentes },
  { value: "quitadas", label: ganhosTabLabels.quitadas },
];

function formatDate(value: string, withYear = false): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(new Date(`${value}T12:00:00`));
}

function shiftDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function latestCommissionDate(entries: readonly ComissaoLancamento[]): string {
  return entries.reduce(
    (latest, entry) => (entry.dataGeracao > latest ? entry.dataGeracao : latest),
    ""
  );
}

function isCommissionInPeriod(
  dataGeracao: string,
  period: AfiliadoPeriod,
  referenceDate: string
): boolean {
  const startDate = (() => {
    switch (period) {
      case "semana":
        return shiftDate(referenceDate, -6);
      case "mes":
        return `${referenceDate.slice(0, 7)}-01`;
      case "ano":
        return `${referenceDate.slice(0, 4)}-01-01`;
    }
  })();

  return dataGeracao >= startDate && dataGeracao <= referenceDate;
}

function CommissionRow({
  entry,
  onSelect,
}: {
  readonly entry: ComissaoLancamento;
  readonly onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Abrir detalhe da comissão de ${entry.customerName}`}
      className="border-border hover:bg-muted/40 focus-visible:ring-ring grid w-full min-w-0 grid-cols-1 gap-3 border-t p-4 text-left transition-colors first:border-t-0 focus-visible:ring-2 focus-visible:outline-none sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center"
    >
      <div className="min-w-0">
        <p className="text-foreground truncate text-sm font-medium">{entry.customerName}</p>
        <p className="text-muted-foreground text-xs">Venda de origem</p>
      </div>
      <div className="min-w-0">
        <p className="text-foreground truncate text-sm">{entry.product}</p>
        <p className="text-muted-foreground text-xs">Gerada em {formatDate(entry.dataGeracao)}</p>
      </div>
      <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
        <span className="text-foreground truncate text-sm font-medium">{entry.valor}</span>
        <CommissionStatusBadge status={entry.status} className="shrink-0" />
      </div>
    </button>
  );
}

type DetailRowProps = {
  readonly label: string;
  readonly value: ReactNode;
  readonly className?: string;
};

function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <DataListItem className="justify-between gap-4 py-2">
      <DataListLabel>{label}</DataListLabel>
      <DataListValue className={cn("text-right font-medium", className)}>{value}</DataListValue>
    </DataListItem>
  );
}

function CommissionDetailSheet({
  entry,
  onClose,
}: {
  readonly entry: ComissaoLancamento | null;
  readonly onClose: () => void;
}) {
  const organizationName = entry
    ? (organizationMap[entry.organizationId]?.name ?? entry.organizationId)
    : "";
  const relatedIndication = entry ? (
    <span className="flex min-w-0 flex-col items-end gap-1">
      <span className="max-w-full truncate">{entry.customerName}</span>
      <a
        className="text-primary text-xs underline-offset-4 hover:underline"
        href="#indicacoes"
        onClick={() => {
          window.location.hash = "#indicacoes";
        }}
      >
        Ver indicação relacionada
      </a>
    </span>
  ) : null;
  const primaryRows: readonly DetailRowProps[] = entry
    ? [
        { label: "Data de geração", value: formatDate(entry.dataGeracao, true) },
        { label: "Organização", value: organizationName },
        { label: "Produto", value: entry.product },
        { label: "Venda de origem", value: relatedIndication },
      ]
    : [];
  const financialRows: readonly DetailRowProps[] = entry
    ? [
        { label: "Valor da comissão", value: entry.valor, className: "text-base font-semibold" },
        { label: "Status", value: <CommissionStatusBadge status={entry.status} /> },
        ...(entry.dataQuitacao
          ? [{ label: "Data de quitação", value: formatDate(entry.dataQuitacao, true) }]
          : []),
        {
          label: "Regra de comissão aplicada",
          value: entry.regraComissao,
          className: "max-w-[13rem]",
        },
      ]
    : [];

  return (
    <Sheet open={entry !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detalhe da comissão</SheetTitle>
          <SheetDescription>Informações da comissão e da venda de origem.</SheetDescription>
        </SheetHeader>
        {entry ? (
          <div className="flex flex-col gap-1 px-6 pb-6">
            <DataList orientation="horizontal" size="sm" className="gap-3">
              {primaryRows.map((row) => (
                <DetailRow key={row.label} {...row} />
              ))}
            </DataList>
            <div className="bg-border my-3 h-px" />
            <DataList orientation="horizontal" size="sm" className="gap-3">
              {financialRows.map((row) => (
                <DetailRow key={row.label} {...row} />
              ))}
            </DataList>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export function GanhosPage() {
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const collapseButton = document.querySelector<HTMLButtonElement>(
      'aside button[title="Encolher menu"]'
    );
    collapseButton?.click();
  }, []);

  const [period, setPeriod] = useState<AfiliadoPeriod>("mes");
  const [organizationId, setOrganizationId] = useState("all");
  const [tab, setTab] = useState<GanhosTab>("todas");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ComissaoLancamento | null>(null);
  const organizations = listAffiliateOrganizations();
  const filters: CommissionFilters = { organizationId, tab, search };
  const kpis = getGanhosKpis(period, organizationId);
  const breakdown = getOrgBreakdown(period).filter(
    (row) => organizationId === "all" || row.organizationId === organizationId
  );
  const allEntries = filterCommissions();
  const referenceDate = latestCommissionDate(allEntries);
  const entries = filterCommissions(
    allEntries.filter((entry) => isCommissionInPeriod(entry.dataGeracao, period, referenceDate)),
    filters
  );
  const kpiCards = [
    {
      title: "Comissão a receber",
      value: kpis.comissaoAReceber,
      detail: "Saldo pendente",
      icon: Calendar03Icon,
    },
    {
      title: "Comissão recebida",
      value: kpis.comissaoRecebida,
      detail: "No período selecionado",
      icon: Wallet02Icon,
    },
    {
      title: "Comissão gerada",
      value: kpis.comissaoGerada,
      detail: "Pendente + quitada",
      icon: MoneyBag02Icon,
    },
  ] as const;

  return (
    <AppPage
      title="Ganhos"
      breadcrumb={[
        {
          title: "Início",
          onClick: () => {
            window.location.hash = "#afiliados";
          },
        },
      ]}
      onBack={() => {
        window.location.hash = "#afiliados";
      }}
    >
      <div className="flex min-w-0 flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {kpiCards.map((card) => (
            <AffiliateKpiCard
              key={card.title}
              {...card}
              icon={<HugeiconsIcon icon={card.icon} size={16} />}
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-80">
            <label htmlFor="ganhos-search" className="sr-only">
              Buscar no extrato
            </label>
            <Input
              id="ganhos-search"
              type="search"
              placeholder="Cliente ou produto"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <OrganizationFilter
            organizations={organizations}
            value={organizationId}
            onValueChange={setOrganizationId}
          />
          <Select
            value={period}
            onValueChange={(value) => {
              const next = periodOptions.find((option) => option.value === value)?.value;
              if (next) setPeriod(next);
            }}
          >
            <SelectTrigger className="h-8 w-full text-xs sm:w-32" aria-label="Período">
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
        </div>

        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm">
          <SectionHeading
            icon={AnalyticsUpIcon}
            title="Comissão por organização"
            description={`Resumo de ${periodLabels[period].toLowerCase()}`}
          />
          <div className="border-border mt-4 overflow-hidden rounded-xl border">
            <div className="bg-muted/40 text-muted-foreground hidden grid-cols-4 gap-3 px-4 py-2 text-xs sm:grid">
              <span>Organização</span>
              <span className="text-right">Gerada</span>
              <span className="text-right">Recebida</span>
              <span className="text-right">A receber</span>
            </div>
            {breakdown.map((row) => {
              const metrics = [
                ["Gerada", row.geradaNoPeriodo],
                ["Recebida", row.recebidaNoPeriodo],
                ["A receber", row.aReceber],
              ] as const;
              return (
                <div
                  key={row.organizationId}
                  className="border-border grid grid-cols-2 gap-3 border-t p-4 text-sm sm:grid-cols-4 sm:py-3"
                >
                  <span className="text-foreground min-w-0 font-medium break-words">
                    <span className="text-muted-foreground sm:hidden">Organização: </span>
                    {organizationMap[row.organizationId]?.name ?? row.organizationId}
                  </span>
                  {metrics.map(([label, value]) => (
                    <span key={label} className="text-foreground text-right">
                      <span className="text-muted-foreground sm:hidden">{label}: </span>
                      {value}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm">
          <SectionHeading
            icon={MoneyBag02Icon}
            title="Extrato de comissões"
            description="Lançamentos por venda concluída"
          />
          <div
            className="bg-muted mt-4 flex min-w-0 flex-wrap gap-1 rounded-xl p-1"
            role="tablist"
            aria-label="Status das comissões"
          >
            {tabOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={tab === option.value ? "secondary" : "ghost"}
                size="sm"
                role="tab"
                aria-selected={tab === option.value}
                onClick={() => setTab(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {entries.length > 0 ? (
            <div className="border-border mt-4 overflow-hidden rounded-xl border">
              {entries.map((entry) => (
                <CommissionRow
                  key={entry.id}
                  entry={entry}
                  onSelect={() => setSelectedEntry(entry)}
                />
              ))}
            </div>
          ) : (
            <AffiliateEmptyState
              className="mt-4"
              icon={MoneyBag02Icon}
              title="Nenhuma comissão encontrada"
              description="Tente ajustar a organização, o período ou a busca."
            />
          )}
        </section>
      </div>
      <CommissionDetailSheet entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </AppPage>
  );
}
