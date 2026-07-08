import { useState } from "react";
import {
  AnalyticsUpIcon,
  BankIcon,
  Calendar03Icon,
  FilterHorizontalIcon,
  MoneyBag02Icon,
  Search01Icon,
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
import { cn } from "@/lib/utils";
import {
  affiliateOrganizations,
  type ComissaoLancamento,
  type CommissionStatus,
  dadosBancarios,
  getFilteredLancamentos,
  getGanhosKpis,
  getOrgBreakdown,
  organizationMap,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Status visual helpers
// ---------------------------------------------------------------------------

function commissionStatusColor(status: CommissionStatus): string {
  return status === "quitado" ? "rgb(7, 148, 85)" : "rgb(220, 104, 3)";
}

function commissionStatusLabel(status: CommissionStatus): string {
  return status === "quitado" ? "Quitado" : "Pendente";
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

function CommissionStatusIcon({ status }: { status: CommissionStatus }) {
  const color = commissionStatusColor(status);
  return status === "quitado" ? (
    <StatusIconCheck color={color} />
  ) : (
    <StatusIconAlert color={color} />
  );
}

// ---------------------------------------------------------------------------
// KPI Card (same visual as IndicacoesPage)
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
// Section heading (same as AfiliadosPage)
// ---------------------------------------------------------------------------

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function formatDateFull(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ---------------------------------------------------------------------------
// Lancamento row
// ---------------------------------------------------------------------------

function LancamentoRow({
  lancamento,
  onClick,
}: {
  lancamento: ComissaoLancamento;
  onClick: () => void;
}) {
  const statusColor = commissionStatusColor(lancamento.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[52px] w-full cursor-pointer items-center border-t border-[#f5f5f5] text-left transition-colors first:border-t-0 hover:bg-[#f8fafc]"
      style={{ paddingLeft: 16 }}
    >
      {/* Customer name + origin label */}
      <div
        className="flex shrink-0 items-center gap-[12px] overflow-hidden"
        style={{ width: 280, padding: "8px 16px" }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <p className="min-w-0 truncate text-[14px] text-[#0a0a0a]">{lancamento.customerName}</p>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">Venda de origem</p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Product + date */}
      <div
        className="flex min-w-0 shrink-0 items-center"
        style={{ width: 280, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex min-w-0 items-center gap-[4px]">
            <p className="truncate text-[13px] text-[#252b37]">{lancamento.product}</p>
            <span className="shrink-0 text-[#a1a1aa]">&middot;</span>
            <p className="shrink-0 text-[13px] text-[#252b37]">
              {formatDate(lancamento.dataGeracao)}
            </p>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">Produto / Data</p>
        </div>
      </div>

      <div className="h-[32px] w-[1px] shrink-0 bg-[#e9eaeb]" />

      {/* Value + status */}
      <div
        className="flex min-w-0 shrink-0 items-center"
        style={{ width: 220, padding: "8px 12px" }}
      >
        <div className="flex min-w-0 flex-col gap-[1px]">
          <div className="flex items-center gap-[6px]">
            <p className="truncate text-[13px] whitespace-nowrap text-[#252b37]">
              {lancamento.valor}
            </p>
            <span className="text-[#a1a1aa]">&middot;</span>
            <div className="flex w-fit items-center gap-[4px]" style={{ color: statusColor }}>
              <p className="truncate text-[13px]">{commissionStatusLabel(lancamento.status)}</p>
              <CommissionStatusIcon status={lancamento.status} />
            </div>
          </div>
          <p className="text-[12px] whitespace-nowrap text-[#a1a1aa]">Valor / Status</p>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Detail drawer
// ---------------------------------------------------------------------------

function LancamentoDetailDrawer({
  lancamento,
  onClose,
}: {
  lancamento: ComissaoLancamento | null;
  onClose: () => void;
}) {
  const org = lancamento ? organizationMap[lancamento.organizationId] : null;

  return (
    <Sheet open={!!lancamento} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detalhe da comissao</SheetTitle>
        </SheetHeader>

        {lancamento && (
          <div className="flex flex-col gap-0 px-6 pb-6">
            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Data de geracao</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {formatDateFull(lancamento.dataGeracao)}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Organizacao</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {org?.name ?? "-"}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Produto</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {lancamento.product}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Venda de origem</DataListLabel>
                <DataListValue className="flex items-center gap-2 text-right text-sm font-medium">
                  <span>{lancamento.customerName}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => {
                      window.location.hash = "#indicacoes";
                    }}
                  >
                    Ver indicacao
                  </Button>
                </DataListValue>
              </DataListItem>
            </DataList>

            <Separator className="my-4" />

            <DataList orientation="horizontal" size="sm" className="gap-4">
              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Valor da comissao</DataListLabel>
                <DataListValue className="text-right text-base font-semibold">
                  {lancamento.valor}
                </DataListValue>
              </DataListItem>

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Status</DataListLabel>
                <DataListValue>
                  <Badge
                    variant="outline"
                    className={cn(
                      lancamento.status === "quitado"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    )}
                  >
                    {commissionStatusLabel(lancamento.status)}
                  </Badge>
                </DataListValue>
              </DataListItem>

              {lancamento.status === "quitado" && lancamento.dataQuitacao && (
                <DataListItem className="justify-between py-2">
                  <DataListLabel className="text-sm">Data de quitacao</DataListLabel>
                  <DataListValue className="text-right text-sm font-medium">
                    {formatDateFull(lancamento.dataQuitacao)}
                  </DataListValue>
                </DataListItem>
              )}

              <DataListItem className="justify-between py-2">
                <DataListLabel className="text-sm">Regra de comissao aplicada</DataListLabel>
                <DataListValue className="text-right text-sm font-medium">
                  {lancamento.regraComissao}
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
// GanhosPage
// ---------------------------------------------------------------------------

export function GanhosPage() {
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLancamento, setSelectedLancamento] = useState<ComissaoLancamento | null>(null);

  const period = "mes";
  const kpis = getGanhosKpis(period, selectedOrg);
  const breakdown = getOrgBreakdown(period);
  const lancamentos = getFilteredLancamentos(selectedOrg, "todas", search);

  return (
    <AppPage
      title="Ganhos"
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
        <div className="grid grid-cols-1 gap-[1em] md:grid-cols-3">
          <KpiCard
            title="Comissao a receber"
            value={kpis.comissaoAReceber}
            icon={Calendar03Icon}
            badge={{ label: "Pendente", color: "rgb(220, 104, 3)" }}
          />
          <KpiCard
            title="Comissao recebida"
            value={kpis.comissaoRecebida}
            icon={Wallet02Icon}
            badge={{ label: "Pago", color: "rgb(7, 148, 85)" }}
          />
          <KpiCard
            title="Comissao gerada"
            value={kpis.comissaoGerada}
            icon={MoneyBag02Icon}
            detail="pendente + quitada"
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

        {/* Breakdown por organizacao (only when "all" is selected) */}
        {selectedOrg === "all" && (
          <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
            <SectionHeading
              icon={AnalyticsUpIcon}
              title="Comissao por organizacao"
              description="Comparativo entre contratos"
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-[#EEF0F4]">
              {/* Header row */}
              <div className="flex items-center bg-[#f9fafb] px-4 py-2.5 text-[12px] text-[#a1a1aa]">
                <div style={{ width: 240 }} className="px-3">
                  Organizacao
                </div>
                <div style={{ width: 180 }} className="px-3 text-right">
                  Gerada
                </div>
                <div style={{ width: 180 }} className="px-3 text-right">
                  Recebida
                </div>
                <div style={{ width: 180 }} className="px-3 text-right">
                  A receber
                </div>
              </div>
              {/* Data rows */}
              {breakdown.map((row) => {
                const org = organizationMap[row.organizationId];
                return (
                  <div
                    key={row.organizationId}
                    className="flex items-center border-t border-[#f5f5f5] px-4 py-3 hover:bg-[#f8fafc]"
                  >
                    <div style={{ width: 240 }} className="px-3 text-[13px] text-[#252b37]">
                      {org?.name ?? row.organizationId}
                    </div>
                    <div
                      style={{ width: 180 }}
                      className="px-3 text-right text-[13px] text-[#252b37]"
                    >
                      {row.geradaNoPeriodo}
                    </div>
                    <div
                      style={{ width: 180 }}
                      className="px-3 text-right text-[13px] text-[#252b37]"
                    >
                      {row.recebidaNoPeriodo}
                    </div>
                    <div
                      style={{ width: 180 }}
                      className="px-3 text-right text-[13px] font-medium text-[#252b37]"
                    >
                      {row.aReceber}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Extrato de comissoes */}
        <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
          <SectionHeading
            icon={MoneyBag02Icon}
            title="Extrato de comissoes"
            description="Historico de comissoes geradas"
          />

          {/* Lancamento list */}
          {lancamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HugeiconsIcon
                icon={MoneyBag02Icon}
                size={48}
                className="text-muted-foreground/40 mb-4"
              />
              <p className="text-foreground text-base font-medium">Nenhuma comissao encontrada</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Tente ajustar os filtros ou o periodo selecionado
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#EEF0F4]">
              {lancamentos.map((lancamento) => (
                <LancamentoRow
                  key={lancamento.id}
                  lancamento={lancamento}
                  onClick={() => setSelectedLancamento(lancamento)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Card "Recebendo em" (bank details) */}
        <Card className="rounded-3xl py-0 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={BankIcon} size={16} className="text-primary" />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-foreground text-sm font-medium">Recebendo em</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {dadosBancarios.banco} ({dadosBancarios.codigoBanco}) &middot; Ag{" "}
                    {dadosBancarios.agencia} &middot; Cc {dadosBancarios.conta} &middot;{" "}
                    {dadosBancarios.tipo}
                  </p>
                  <p className="text-muted-foreground text-xs">Titular: {dadosBancarios.titular}</p>
                </div>
                <Button variant="outline" size="sm" className="w-fit shrink-0">
                  Editar dados bancarios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail drawer */}
      <LancamentoDetailDrawer
        lancamento={selectedLancamento}
        onClose={() => setSelectedLancamento(null)}
      />
    </AppPage>
  );
}
