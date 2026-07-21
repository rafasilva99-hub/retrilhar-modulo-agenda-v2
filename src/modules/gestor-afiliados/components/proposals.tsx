import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GestorProposal } from "@/mocks/gestor-afiliados";
import { gestorProposals } from "@/mocks/gestor-afiliados";

import { StatusBadge } from "./shared";

type ProposalTab = "recebidas" | "enviadas";
type ProposalAction = "Aceitar e criar afiliação" | "Rejeitar" | "Contrapropor" | "Convidar";

export function GestorProposalsPage() {
  const [tab, setTab] = useState<ProposalTab>("recebidas");
  const [action, setAction] = useState<ProposalAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const proposals = useMemo(
    () => gestorProposals.filter((proposal) => proposal.direction === tab.slice(0, -1)),
    [tab]
  );

  return (
    <div className="space-y-5">
      {message ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="border-border bg-card flex w-fit gap-1 rounded-2xl border p-1">
          <Button
            variant={tab === "recebidas" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("recebidas")}
          >
            Recebidas
          </Button>
          <Button
            variant={tab === "enviadas" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("enviadas")}
          >
            Enviadas
          </Button>
        </div>
        <Button onClick={() => setAction("Convidar")}>Convidar afiliado</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} onAction={setAction} />
        ))}
      </div>

      <ProposalDialog
        action={action}
        onOpenChange={(open) => !open && setAction(null)}
        onConfirm={(confirmedAction) => {
          setMessage(`${confirmedAction} registrada no histórico da negociação.`);
          setAction(null);
        }}
      />
    </div>
  );
}

function ProposalCard({
  proposal,
  onAction,
}: {
  readonly proposal: GestorProposal;
  readonly onAction: (action: ProposalAction) => void;
}) {
  return (
    <Card className="rounded-2xl p-5 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{proposal.name}</p>
          <p className="text-muted-foreground text-sm">
            {proposal.channel} · {proposal.product}
          </p>
        </div>
        <StatusBadge status={proposal.status} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Comissão proposta</p>
          <p className="font-medium">{proposal.commission}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Atualização</p>
          <p className="font-medium">{proposal.updatedAt}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={proposal.termAccepted ? "secondary" : "outline"}>
          {proposal.termAccepted ? "Termo aceito" : "Aguardando aceite"}
        </Badge>
        <Badge variant="outline">Histórico preservado</Badge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onAction("Aceitar e criar afiliação")}>
          Aceitar e criar afiliação
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAction("Contrapropor")}>
          Contrapropor
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("Rejeitar")}>
          Rejeitar
        </Button>
      </div>
    </Card>
  );
}

function ProposalDialog({
  action,
  onOpenChange,
  onConfirm,
}: {
  readonly action: ProposalAction | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (action: ProposalAction) => void;
}) {
  const isInvite = action === "Convidar";
  return (
    <Dialog open={action !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{action}</DialogTitle>
          <DialogDescription>
            {isInvite
              ? "Selecione uma pessoa do pool de afiliados e defina o produto inicial."
              : "Registre a decisão para manter o histórico da negociação atualizado."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>{isInvite ? "Afiliado" : "Observação"}</Label>
            <Input placeholder={isInvite ? "Rafael Duarte" : "Motivo ou comentário interno"} />
          </div>
          <div className="space-y-2">
            <Label>{isInvite ? "Produto" : "Comissão"}</Label>
            <Input placeholder={isInvite ? "Passeio de barco" : "12%"} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => action && onConfirm(action)}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
