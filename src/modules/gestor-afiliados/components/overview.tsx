import {
  AnalyticsUpIcon,
  CheckmarkCircle01Icon,
  Money01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  gestorAffiliates,
  gestorPayments,
  gestorProductRequests,
  gestorProposals,
  gestorTerm,
} from "@/mocks/gestor-afiliados";

import { GestorStatCard, StatusBadge } from "./shared";

export function GestorOverview() {
  const activeCount = gestorAffiliates.filter((item) => item.status === "Ativo").length;
  const pendingPayments = gestorPayments.filter((item) => item.status === "a-pagar");
  const pendingRequests = gestorProductRequests.filter((item) => item.status === "Pendente");
  const pendingProposals = gestorProposals.filter(
    (item) => item.status === "Pendente" || item.status === "Contraproposta"
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GestorStatCard
          icon={UserGroupIcon}
          label="Afiliados ativos"
          value={String(activeCount)}
          helper="3 afiliações acompanhadas"
        />
        <GestorStatCard
          icon={AnalyticsUpIcon}
          label="Vendas no mês"
          value="33"
          helper="R$ 8.420,00 gerados"
        />
        <GestorStatCard
          icon={Money01Icon}
          label="Comissões geradas"
          value="R$ 8.420"
          helper="Considera vendas confirmadas"
        />
        <GestorStatCard
          icon={CheckmarkCircle01Icon}
          label="A pagar"
          value="R$ 1.120"
          helper="1 pendência de repasse"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-2xl p-5 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Pendências</h2>
              <p className="text-muted-foreground text-sm">
                Propostas, solicitações e pagamentos aguardando ação
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.hash = "#gestorAfiliadosPropostas";
              }}
            >
              Ver propostas
            </Button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <PendingCard label="Propostas" count={pendingProposals.length} href="propostas" />
            <PendingCard label="Solicitações" count={pendingRequests.length} href="solicitacoes" />
            <PendingCard label="Pagamentos" count={pendingPayments.length} href="pagamentos" />
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-none">
          <h2 className="text-lg font-semibold tracking-tight">Termo de afiliação</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {gestorTerm.version} atualizado em {gestorTerm.updatedAt}
          </p>
          <p className="mt-4 line-clamp-3 text-sm">{gestorTerm.text}</p>
          <Button
            className="mt-5 w-full"
            variant="outline"
            onClick={() => {
              window.location.hash = "#gestorAfiliadosTermo";
            }}
          >
            Editar termo
          </Button>
        </Card>
      </div>

      <Card className="rounded-2xl p-5 shadow-none">
        <h2 className="text-lg font-semibold tracking-tight">Ranking de afiliados</h2>
        <div className="mt-4 divide-y">
          {gestorAffiliates.map((affiliate) => (
            <button
              key={affiliate.id}
              type="button"
              className="hover:bg-muted/50 flex w-full items-center justify-between gap-4 rounded-xl px-2 py-3 text-left"
              onClick={() => {
                window.location.hash = "#gestorAfiliadosLista";
              }}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{affiliate.name}</p>
                <p className="text-muted-foreground text-xs">
                  {affiliate.sales} vendas · {affiliate.generated}
                </p>
              </div>
              <StatusBadge status={affiliate.status} />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PendingCard({
  label,
  count,
  href,
}: {
  readonly label: string;
  readonly count: number;
  readonly href: "propostas" | "solicitacoes" | "pagamentos";
}) {
  const page = {
    propostas: "gestorAfiliadosPropostas",
    solicitacoes: "gestorAfiliadosSolicitacoes",
    pagamentos: "gestorAfiliadosPagamentos",
  }[href];

  return (
    <button
      type="button"
      className="border-border hover:bg-muted/50 rounded-xl border p-4 text-left transition-colors"
      onClick={() => {
        window.location.hash = `#${page}`;
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="bg-primary/10 text-primary grid min-w-7 place-items-center rounded-full px-2 text-sm">
          {count}
        </span>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">Abrir fila operacional</p>
      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-primary mt-3" />
    </button>
  );
}
