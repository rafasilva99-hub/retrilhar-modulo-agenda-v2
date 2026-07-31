import { useEffect, useState } from "react";
import { Add01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
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
import type { GestorAffiliateSection } from "@/mocks/gestor-afiliados";

import { GestorAffiliatesList } from "./components/affiliates-list";
import { GestorCentralFiliacao } from "./components/central-filiacao";
import { ConvidarAfiliadoDrawer } from "./components/convidar-afiliado-drawer";
import { GestorPaymentsPage } from "./components/payments";
import { GestorProposalsPage } from "./components/proposals";
import { GestorRequestsPage } from "./components/requests";
import { GestorSubnav } from "./components/shared";
import { GestorTermPage } from "./components/term";
import { GestorVisaoGeral } from "./components/visao-geral";

interface GestorAfiliadosPageProps {
  readonly section: GestorAffiliateSection;
}

export function GestorAfiliadosPage({ section }: GestorAfiliadosPageProps) {
  const [newAffiliateOpen, setNewAffiliateOpen] = useState(false);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);
  const [conviteAberto, setConviteAberto] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const collapseButton = document.querySelector<HTMLButtonElement>(
      'aside button[title="Encolher menu"]'
    );
    collapseButton?.click();
  }, []);

  const ehVisaoGeral = section === "visao";

  if (section === "central") {
    // [PROPOSTA P10] "Central de filiação" adotado como nome único da tela
    // (sidebar, título e breadcrumb), no lugar de "Pendências"/"Propostas".
    return (
      <AppPage
        title="Central de filiação"
        description="Candidaturas e pedidos solicitados por afiliados."
        breadcrumb={[
          {
            title: "Início",
            onClick: () => {
              window.location.hash = "#contexto";
            },
          },
          { title: "Afiliados" },
        ]}
        actions={
          <Button className="gap-2" onClick={() => setConviteAberto(true)}>
            <HugeiconsIcon icon={UserAdd01Icon} size={16} aria-hidden="true" />
            Convidar afiliado
          </Button>
        }
      >
        <GestorCentralFiliacao />
        <ConvidarAfiliadoDrawer aberto={conviteAberto} aoFechar={() => setConviteAberto(false)} />
      </AppPage>
    );
  }

  if (ehVisaoGeral) {
    return (
      <AppPage
        title="Visão geral"
        description="Visão geral do programa: pendências, desempenho e configuração num só lugar."
        breadcrumb={[
          {
            title: "Início",
            onClick: () => {
              window.location.hash = "#contexto";
            },
          },
          { title: "Afiliados" },
        ]}
        actions={
          // Drawer AFI-01.b habilitado por decisão de produto em 31/07/2026,
          // antecipando o fechamento das pendências P4 e P6.
          <Button className="gap-2" onClick={() => setConviteAberto(true)}>
            <HugeiconsIcon icon={UserAdd01Icon} size={16} aria-hidden="true" />
            Convidar afiliado
          </Button>
        }
      >
        <GestorVisaoGeral />
        <ConvidarAfiliadoDrawer aberto={conviteAberto} aoFechar={() => setConviteAberto(false)} />
      </AppPage>
    );
  }

  return (
    <AppPage
      title="Gestão de afiliados"
      description="Acompanhe afiliações, propostas, solicitações, pagamentos e termo da organização."
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 md:inline-flex"
            onClick={() => {
              window.location.hash = "#gestorAfiliadosPropostas";
            }}
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={16} aria-hidden="true" />
            Convidar
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setNewAffiliateOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} size={16} aria-hidden="true" />
            Cadastrar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {createdMessage ? (
          <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {createdMessage}
          </p>
        ) : null}
        <GestorSubnav active={section} />
        {renderSection(section)}
      </div>
      <NewAffiliateDialog
        open={newAffiliateOpen}
        onOpenChange={setNewAffiliateOpen}
        onConfirm={(name) => {
          setCreatedMessage(`${name} foi preparado para cadastro de afiliação.`);
          setNewAffiliateOpen(false);
        }}
      />
    </AppPage>
  );
}

function NewAffiliateDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState("Nova afiliada");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Cadastrar afiliado</DialogTitle>
          <DialogDescription>
            Registre uma afiliação direta para esta organização, mantendo o aceite do termo como
            etapa pendente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="new-affiliate-name">Nome</Label>
            <Input
              id="new-affiliate-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-affiliate-code">Código sugerido</Label>
            <Input id="new-affiliate-code" defaultValue="NOV-0001" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(name.trim() || "Nova afiliada")}>
            Preparar cadastro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function renderSection(section: GestorAffiliateSection) {
  switch (section) {
    case "visao":
      return <GestorVisaoGeral />;
    case "central":
      return <GestorCentralFiliacao />;
    case "afiliados":
      return <GestorAffiliatesList />;
    case "propostas":
      return <GestorProposalsPage />;
    case "solicitacoes":
      return <GestorRequestsPage />;
    case "pagamentos":
      return <GestorPaymentsPage />;
    case "termo":
      return <GestorTermPage />;
  }
}
