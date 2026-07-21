import { useState } from "react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  Camera01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Delete01Icon,
  MoneyReceiveSquareIcon,
  MoreVerticalCircle01Icon,
  Notification01Icon,
  PencilEdit01Icon,
  SecurityLockIcon,
  Tick02Icon,
  UserAccountIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  affiliateAffiliations,
  affiliateCode,
  affiliateProfileData,
  affiliationReceivings,
  notificationPreferences,
  organizationMap,
  receivingDestinations,
} from "@/mocks/afiliados";

import {
  assignReceivingDestination,
  countDestinationUsage,
} from "./services/afiliados-mock-service";
import type { AffiliationReceiving, FormaRecebimento, ReceivingDestination } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsSection = "perfil" | "bancarios" | "afiliacoes" | "seguranca" | "notificacoes";

interface SectionDef {
  id: SettingsSection;
  icon: IconSvgElement;
  label: string;
  description: string;
}

type DestinationChange = {
  readonly organizationId: string;
  readonly destinationId: string;
};

const affiliationStatusTaxonomy = ["Ativo", "Inativo", "Desativado"] as const;
type AffiliationStatus = (typeof affiliationStatusTaxonomy)[number];

const sections: SectionDef[] = [
  {
    id: "perfil",
    icon: UserAccountIcon,
    label: "Perfil",
    description: "Informações pessoais da conta",
  },
  {
    id: "bancarios",
    icon: MoneyReceiveSquareIcon,
    label: "Formas de recebimento",
    description: "Destinos e formas de pagamento",
  },
  {
    id: "afiliacoes",
    icon: UserGroupIcon,
    label: "Minhas afiliações",
    description: "Organizações e status da afiliação",
  },
  {
    id: "seguranca",
    icon: SecurityLockIcon,
    label: "Segurança",
    description: "Senha e acesso",
  },
  {
    id: "notificacoes",
    icon: Notification01Icon,
    label: "Notificações",
    description: "Preferências de alerta",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function affiliationStatusClass(status: AffiliationStatus): string {
  switch (status) {
    case "Ativo":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Inativo":
      return "bg-gray-100 text-gray-500 border-gray-200";
    case "Desativado":
      return "bg-red-50 text-red-700 border-red-200";
  }
}

function toConfirmedAffiliationStatus(
  status: (typeof affiliateAffiliations)[number]["status"]
): AffiliationStatus | null {
  switch (status) {
    case "Ativa":
      return "Ativo";
    case "Pendente":
      return null;
    case "Inativa":
      return "Inativo";
  }
}

// ---------------------------------------------------------------------------
// Section content renderers
// ---------------------------------------------------------------------------

function PerfilContent() {
  const [editing, setEditing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [form, setForm] = useState({
    name: affiliateProfileData.name,
    email: affiliateProfileData.email,
    phone: affiliateProfileData.phone,
    documentType: affiliateProfileData.documentType as string,
    document: affiliateProfileData.document,
  });

  const initials = affiliateProfileData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(affiliateCode);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleCancel = () => {
    setForm({
      name: affiliateProfileData.name,
      email: affiliateProfileData.email,
      phone: affiliateProfileData.phone,
      documentType: affiliateProfileData.documentType,
      document: affiliateProfileData.document,
    });
    setEditing(false);
  };

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-[1em]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground text-sm">
            Suas informações pessoais e dados da conta
          </p>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            className="hidden shrink-0 gap-[0.375em] md:inline-flex"
            onClick={() => setEditing(true)}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
            Editar
          </Button>
        )}
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent className="space-y-[1em]">
          <div className="flex items-center gap-[1.25em]">
            <div className="group relative cursor-not-allowed">
              <Avatar className="border-border size-[4.5em] border">
                <AvatarFallback className="bg-primary/10 text-primary text-[1.25em] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon icon={Camera01Icon} size={20} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-[0.25em]">
              <span className="text-base font-semibold tracking-tight">
                {affiliateProfileData.name}
              </span>
              <Badge variant="secondary" className="w-fit">
                Afiliado desde {formatDate(affiliateAffiliations[0]?.since ?? "")}
              </Badge>
            </div>
          </div>

          {editing ? (
            <>
              <div className="grid grid-cols-1 gap-[1.25em] md:grid-cols-2">
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">Nome completo</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">E-mail</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">Telefone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">Documento</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.documentType}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, documentType: value }))
                      }
                    >
                      <SelectTrigger className="w-[120px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                        <SelectItem value="Passaporte">Passaporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="flex-1"
                      value={form.document}
                      onChange={(e) => setForm((prev) => ({ ...prev, document: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-[0.5em]">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                  Salvar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-[1.25em] md:grid-cols-2">
                <div className="space-y-[0.25em]">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Nome completo
                  </span>
                  <p className="text-sm">{affiliateProfileData.name}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    E-mail
                  </span>
                  <p className="text-sm">{affiliateProfileData.email}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Telefone
                  </span>
                  <p className="text-sm">{affiliateProfileData.phone}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Documento ({affiliateProfileData.documentType})
                  </span>
                  <p className="text-sm">{affiliateProfileData.document}</p>
                </div>
              </div>

              {/* Código de afiliado */}
              <div className="!mb-0 border-t border-[#f5f5f5] pt-[1em]">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Código de afiliado
                </span>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="bg-muted/50 flex-1 rounded-lg px-4 py-2.5">
                    <span className="font-mono text-sm text-[#252b37]">{affiliateCode}</span>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={handleCopyCode}>
                    <HugeiconsIcon icon={Copy01Icon} size={14} />
                    {copiedCode ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
                <p className="text-muted-foreground mt-1.5 text-xs">
                  Código gerado pelo sistema. Não é possível alterar.
                </p>
              </div>

              <div className="flex justify-end md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-[0.375em]"
                  onClick={() => setEditing(true)}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                  Editar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formas de recebimento helpers
// ---------------------------------------------------------------------------

function formaRecebimentoBadge(forma: FormaRecebimento) {
  switch (forma) {
    case "Split de pagamento":
      return {
        bg: "bg-[#dcfce7]",
        text: "text-[#166534]",
        desc: "Comissão liquidada na hora da venda",
      };
    case "Transferência bancária":
      return { bg: "bg-[#dbeafe]", text: "text-[#1e40af]", desc: "Repasse feito pela organização" };
    case "Dinheiro":
      return {
        bg: "bg-[#fef3c7]",
        text: "text-[#92400e]",
        desc: "Acerto presencial com a organização",
      };
  }
}

const emptyDestinationForm = {
  apelido: "",
  banco: "",
  codigoBanco: "",
  agencia: "",
  conta: "",
  tipoConta: "Conta corrente" as const,
  titular: "",
  documentoTitular: "",
  tipoDocumento: "CPF" as const,
  padrao: false,
};

// ---------------------------------------------------------------------------
// Destination drawer
// ---------------------------------------------------------------------------

function DestinationDrawer({
  open,
  onOpenChange,
  destination,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination?: ReceivingDestination;
}) {
  const isEdit = !!destination;
  const [form, setForm] = useState(
    destination
      ? {
          apelido: destination.apelido,
          banco: destination.banco,
          codigoBanco: destination.codigoBanco,
          agencia: destination.agencia,
          conta: destination.conta,
          tipoConta: destination.tipoConta,
          titular: destination.titular,
          documentoTitular: destination.documentoTitular,
          tipoDocumento: destination.tipoDocumento,
          padrao: destination.padrao,
        }
      : emptyDestinationForm
  );

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar destino" : "Adicionar destino"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize os dados desta conta de recebimento."
              : "Cadastre uma nova conta para receber suas comissões."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-[1.25em] px-6 py-6">
          <div className="space-y-[0.5em]">
            <Label className="text-muted-foreground">Apelido</Label>
            <Input
              placeholder="Ex: Conta principal"
              value={form.apelido}
              onChange={(e) => updateField("apelido", e.target.value)}
            />
          </div>

          <div className="space-y-[0.5em]">
            <Label className="text-muted-foreground">Tipo de destino</Label>
            <Input value="Conta bancária" disabled className="bg-muted/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-[0.5em]">
              <Label className="text-muted-foreground">Banco</Label>
              <Input
                placeholder="Nome do banco"
                value={form.banco}
                onChange={(e) => updateField("banco", e.target.value)}
              />
            </div>
            <div className="space-y-[0.5em]">
              <Label className="text-muted-foreground">Código</Label>
              <Input
                placeholder="Ex: 341"
                value={form.codigoBanco}
                onChange={(e) => updateField("codigoBanco", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-[0.5em]">
              <Label className="text-muted-foreground">Agência</Label>
              <Input
                placeholder="0000"
                value={form.agencia}
                onChange={(e) => updateField("agencia", e.target.value)}
              />
            </div>
            <div className="space-y-[0.5em]">
              <Label className="text-muted-foreground">Conta e dígito</Label>
              <Input
                placeholder="00000-0"
                value={form.conta}
                onChange={(e) => updateField("conta", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-[0.5em]">
            <Label className="text-muted-foreground">Tipo de conta</Label>
            <Select
              value={form.tipoConta}
              onValueChange={(v) => updateField("tipoConta", v as typeof form.tipoConta)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conta corrente">Conta corrente</SelectItem>
                <SelectItem value="Conta poupança">Conta poupança</SelectItem>
                <SelectItem value="Conta pagamento">Conta pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-[0.5em]">
            <Label className="text-muted-foreground">Nome do titular</Label>
            <Input value={form.titular} onChange={(e) => updateField("titular", e.target.value)} />
          </div>

          <div className="space-y-[0.5em]">
            <Label className="text-muted-foreground">Documento do titular</Label>
            <div className="flex gap-2">
              <Select
                value={form.tipoDocumento}
                onValueChange={(v) => updateField("tipoDocumento", v as typeof form.tipoDocumento)}
              >
                <SelectTrigger className="w-[120px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="Passaporte">Passaporte</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="flex-1"
                value={form.documentoTitular}
                onChange={(e) => updateField("documentoTitular", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="dest-padrao"
              checked={form.padrao}
              onCheckedChange={(checked) => updateField("padrao", checked === true)}
            />
            <Label htmlFor="dest-padrao" className="cursor-pointer text-sm font-normal">
              Definir como destino padrão
            </Label>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 px-6 pb-6">
          <Button variant="outline" className="min-w-[6em]" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="min-w-[6em]" onClick={() => onOpenChange(false)}>
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// FormasRecebimentoContent (replaces BancariosContent)
// ---------------------------------------------------------------------------

function FormasRecebimentoContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<ReceivingDestination | undefined>();
  const [destinations, setDestinations] = useState<ReceivingDestination[]>(() =>
    receivingDestinations.map((destination) => ({ ...destination }))
  );
  const [receivings, setReceivings] = useState<AffiliationReceiving[]>(() =>
    affiliationReceivings.map((receiving) => ({ ...receiving }))
  );
  const [destinationChange, setDestinationChange] = useState<DestinationChange | null>(null);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeAffiliations = affiliateAffiliations.filter(
    (affiliation) => affiliation.status === "Ativa"
  );
  const usageCounts = countDestinationUsage(receivings);
  const selectedReceiving = destinationChange
    ? receivings.find((receiving) => receiving.organizationId === destinationChange.organizationId)
    : undefined;
  const selectedOrganization = destinationChange
    ? organizationMap[destinationChange.organizationId]
    : undefined;

  const handleAddDestination = () => {
    setEditingDest(undefined);
    setDrawerOpen(true);
  };

  const handleEditDestination = (dest: ReceivingDestination) => {
    setEditingDest(dest);
    setDrawerOpen(true);
  };

  const handleOpenDestinationChange = (receiving: AffiliationReceiving) => {
    const destinationId =
      receiving.destinoId ??
      destinations.find((destination) => destination.padrao)?.id ??
      destinations.at(0)?.id ??
      "";

    setDestinationChange({ organizationId: receiving.organizationId, destinationId });
    setDestinationError(null);
    setSuccessMessage(null);
  };

  const handleConfirmDestinationChange = () => {
    if (!destinationChange) return;

    const destination = destinations.find((item) => item.id === destinationChange.destinationId);
    if (!destination) {
      setDestinationError("Selecione um destino para continuar.");
      return;
    }

    setReceivings((current) =>
      assignReceivingDestination(
        current,
        destinationChange.organizationId,
        destinationChange.destinationId
      )
    );
    setSuccessMessage(
      `Destino de ${organizationMap[destinationChange.organizationId]?.name ?? destinationChange.organizationId} atualizado para ${destination.apelido}.`
    );
    setDestinationError(null);
    setDestinationChange(null);
  };

  const handleDeleteDestination = (destination: ReceivingDestination) => {
    const usageCount = usageCounts[destination.id] ?? 0;
    if (usageCount > 0 || destination.padrao) return;

    setDestinations((current) => current.filter((item) => item.id !== destination.id));
  };

  return (
    <div className="space-y-[1.5em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Formas de recebimento</h2>
        <p className="text-muted-foreground text-sm">
          Onde e como você recebe suas comissões de cada organização
        </p>
      </div>

      {/* ── Bloco A: Como você recebe de cada organização ── */}
      <div className="space-y-[0.75em]">
        <div>
          <h3 className="text-foreground text-sm font-medium">
            Como você recebe de cada organização
          </h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            A forma de recebimento é definida no acordo com cada organização. Para alterá-la, fale
            com a organização.
          </p>
        </div>

        <Card className="rounded-4xl shadow-none">
          <CardContent>
            <div className="flex flex-col">
              {activeAffiliations.map((affiliation, index) => {
                const org = organizationMap[affiliation.organizationId];
                const receiving = receivings.find(
                  (r) => r.organizationId === affiliation.organizationId
                );
                const forma = receiving?.forma ?? "Transferência bancária";
                const badge = formaRecebimentoBadge(forma);
                const linkedDest = receiving?.destinoId
                  ? destinations.find((d) => d.id === receiving.destinoId)
                  : null;

                return (
                  <div
                    key={affiliation.organizationId}
                    className={cn(
                      "flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between",
                      index === 0 && "pt-0",
                      index === activeAffiliations.length - 1 && "pb-0",
                      index > 0 && "border-t border-[#f5f5f5]"
                    )}
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#252b37]">
                          {org?.name ?? affiliation.organizationId}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            badge.bg,
                            badge.text
                          )}
                        >
                          {forma}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">{badge.desc}</span>
                      {linkedDest ? (
                        <span className="text-muted-foreground text-xs">
                          {linkedDest.apelido} - {linkedDest.banco} {linkedDest.contaMascarada}
                        </span>
                      ) : forma !== "Dinheiro" ? (
                        <span className="text-xs text-amber-600">Nenhum destino selecionado</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Não se aplica</span>
                      )}
                    </div>
                    {forma !== "Dinheiro" && receiving && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 self-start md:self-center"
                        onClick={() => handleOpenDestinationChange(receiving)}
                      >
                        Alterar destino
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {successMessage ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} aria-hidden="true" />
            {successMessage}
          </p>
        ) : null}
      </div>

      {/* ── Bloco B: Meus destinos de recebimento ── */}
      <div className="space-y-[0.75em]">
        <div>
          <h3 className="text-foreground text-sm font-medium">Meus destinos de recebimento</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Contas onde suas comissões podem ser depositadas. Você pode cadastrar mais de uma.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {destinations.map((dest) => {
            const usageCount = usageCounts[dest.id] ?? 0;
            const removalDisabled = usageCount > 0 || dest.padrao;
            const removalLabel =
              usageCount > 0
                ? "Excluir: destino em uso"
                : dest.padrao
                  ? "Excluir: destino padrão"
                  : "Excluir";
            return (
              <Card key={dest.id} className="rounded-2xl shadow-none">
                <CardContent>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-[#252b37]">{dest.apelido}</span>
                        {dest.padrao && (
                          <Badge className="bg-primary/10 text-primary h-4 border-transparent px-1.5 py-0 text-[10px]">
                            Padrão
                          </Badge>
                        )}
                        {usageCount > 0 && (
                          <Badge variant="outline" className="h-4 px-1.5 py-0 text-[10px]">
                            Em uso por {usageCount}{" "}
                            {usageCount === 1 ? "organização" : "organizações"}
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground grid grid-cols-1 gap-x-6 gap-y-0.5 text-xs md:grid-cols-2">
                        <span>
                          {dest.banco} ({dest.codigoBanco})
                        </span>
                        <span>{dest.tipoConta}</span>
                        <span>
                          Ag. {dest.agenciaMascarada} / Conta {dest.contaMascarada}
                        </span>
                        <span>{dest.titular}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0"
                          aria-label={`Ações de ${dest.apelido}`}
                        >
                          <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDestination(dest)}>
                          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                          Editar
                        </DropdownMenuItem>
                        {!dest.padrao && (
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={Tick02Icon} size={14} />
                            Definir como padrão
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          disabled={removalDisabled}
                          aria-label={removalLabel}
                          className="text-destructive focus:text-destructive"
                          onSelect={() => handleDeleteDestination(dest)}
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={14} />
                          {removalLabel}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={handleAddDestination}>
          <HugeiconsIcon icon={Add01Icon} size={14} />
          Adicionar destino
        </Button>
      </div>

      <Sheet
        open={destinationChange !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDestinationChange(null);
            setDestinationError(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Alterar destino</SheetTitle>
            <SheetDescription>
              Escolha uma conta cadastrada para receber as comissões de {selectedOrganization?.name}
              .
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="receiving-type" className="text-muted-foreground">
                Forma de recebimento
              </Label>
              <Input
                id="receiving-type"
                value={selectedReceiving?.forma ?? ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-muted-foreground text-xs">
                Definida pela organização. Você pode alterar somente o destino.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Destino de recebimento</Label>
              <RadioGroup
                aria-label="Destino de recebimento"
                value={destinationChange?.destinationId ?? ""}
                onValueChange={(destinationId) => {
                  setDestinationChange((current) =>
                    current ? { ...current, destinationId } : current
                  );
                  setDestinationError(null);
                }}
              >
                {destinations.map((destination) => {
                  const optionId = `receiving-destination-${destination.id}`;
                  return (
                    <Label
                      key={destination.id}
                      htmlFor={optionId}
                      className="border-border has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors"
                    >
                      <RadioGroupItem
                        id={optionId}
                        value={destination.id}
                        aria-label={`${destination.apelido}, ${destination.banco}, conta ${destination.contaMascarada}`}
                        className="mt-0.5"
                      />
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="flex items-center gap-2">
                          <span className="text-foreground text-sm font-medium">
                            {destination.apelido}
                          </span>
                          {destination.padrao ? (
                            <Badge className="bg-primary/10 text-primary h-4 border-transparent px-1.5 py-0 text-[10px]">
                              Padrão
                            </Badge>
                          ) : null}
                        </span>
                        <span className="text-muted-foreground block text-xs">
                          {destination.banco} · {destination.tipoConta} · Conta{" "}
                          {destination.contaMascarada}
                        </span>
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
              {destinationError ? (
                <p role="alert" className="text-destructive text-xs">
                  {destinationError}
                </p>
              ) : null}
            </div>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => {
                setDestinationChange(null);
                setDestinationError(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmDestinationChange}>Confirmar alteração</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DestinationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} destination={editingDest} />
    </div>
  );
}

function AfiliacoesContent() {
  const confirmedAffiliations = affiliateAffiliations.flatMap((affiliation) => {
    const status = toConfirmedAffiliationStatus(affiliation.status);
    return status ? [{ ...affiliation, status }] : [];
  });

  return (
    <div className="space-y-[1em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Minhas afiliações</h2>
        <p className="text-muted-foreground text-sm">Afiliações da sua conta por organização</p>
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent>
          <div className="flex flex-col">
            {confirmedAffiliations.map((affiliation, index) => {
              const org = organizationMap[affiliation.organizationId];
              return (
                <div
                  key={affiliation.organizationId}
                  className={cn(
                    "flex items-center justify-between py-3",
                    index === 0 && "pt-0",
                    index === confirmedAffiliations.length - 1 && "pb-0",
                    index > 0 && "border-t border-[#f5f5f5]"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-[#252b37]">
                      {org?.name ?? affiliation.organizationId}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Desde {formatDate(affiliation.since)}
                    </span>
                  </div>
                  <Badge variant="outline" className={affiliationStatusClass(affiliation.status)}>
                    {affiliation.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-4xl shadow-none">
        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="text-foreground text-sm font-medium">Status de afiliação</h3>
              <p className="text-muted-foreground text-xs">
                Desativado representa a afiliação desativada; bloqueios globais do afiliado são
                tratados separadamente.
              </p>
            </div>
            <ul aria-label="Status de afiliação" className="flex flex-wrap gap-2">
              {affiliationStatusTaxonomy.map((status) => (
                <li key={status}>
                  <Badge
                    data-status={status}
                    variant="outline"
                    className={affiliationStatusClass(status)}
                  >
                    {status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SegurancaContent() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ nova: "", confirmar: "" });

  const handleCancel = () => {
    setPasswordForm({ nova: "", confirmar: "" });
    setChangingPassword(false);
  };

  const handleSave = () => {
    setPasswordForm({ nova: "", confirmar: "" });
    setChangingPassword(false);
  };

  return (
    <div className="space-y-[1em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Segurança</h2>
        <p className="text-muted-foreground text-sm">Senha e configurações de acesso</p>
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent className="space-y-[1em]">
          {changingPassword ? (
            <>
              <div className="grid grid-cols-1 gap-[1.25em] md:grid-cols-2">
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">Nova senha</Label>
                  <Input
                    type="password"
                    placeholder="Digite a nova senha"
                    value={passwordForm.nova}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, nova: e.target.value }))}
                  />
                </div>
                <div className="space-y-[0.5em]">
                  <Label className="text-muted-foreground">Confirmar nova senha</Label>
                  <Input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={passwordForm.confirmar}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmar: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-[0.5em]">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                  Salvar
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-[0.25em]">
                <span className="text-sm text-[#252b37]">Senha</span>
                <p className="text-muted-foreground text-xs">Última alteração há 3 meses</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangingPassword(true)}>
                Alterar senha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificacoesContent() {
  const [notifPrefs, setNotifPrefs] = useState(notificationPreferences);

  return (
    <div className="space-y-[1em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Notificações</h2>
        <p className="text-muted-foreground text-sm">Gerencie suas preferências de alerta</p>
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-center justify-between pb-3">
              <div className="space-y-[0.25em]">
                <span className="text-sm text-[#252b37]">Produto novo no escopo</span>
                <p className="text-muted-foreground text-xs">
                  Receba quando houver novo produto disponível
                </p>
              </div>
              <Switch
                checked={notifPrefs.produtoNovo}
                onCheckedChange={(checked) =>
                  setNotifPrefs((prev) => ({ ...prev, produtoNovo: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between border-t border-[#f5f5f5] py-3">
              <div className="space-y-[0.25em]">
                <span className="text-sm text-[#252b37]">Comissão quitada</span>
                <p className="text-muted-foreground text-xs">Receba quando uma comissão for paga</p>
              </div>
              <Switch
                checked={notifPrefs.comissaoQuitada}
                onCheckedChange={(checked) =>
                  setNotifPrefs((prev) => ({ ...prev, comissaoQuitada: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section content map
// ---------------------------------------------------------------------------

const sectionContentMap: Record<SettingsSection, () => React.JSX.Element> = {
  perfil: PerfilContent,
  bancarios: FormasRecebimentoContent,
  afiliacoes: AfiliacoesContent,
  seguranca: SegurancaContent,
  notificacoes: NotificacoesContent,
};

// ---------------------------------------------------------------------------
// ConfiguracoesPage — full-page overlay layout
// ---------------------------------------------------------------------------

export function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("perfil");
  const [mobileShowContent, setMobileShowContent] = useState(false);

  const handleClose = () => {
    window.location.hash = "#afiliados";
  };

  const handleSelectSection = (id: SettingsSection) => {
    setActiveSection(id);
    setMobileShowContent(true);
  };

  const handleMobileBack = () => {
    setMobileShowContent(false);
  };

  const ActiveContent = sectionContentMap[activeSection];
  const activeDef = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="bg-background fixed inset-0 z-50 flex min-h-dvh flex-col">
      {/* ── Header ── */}
      <header className="bg-background shrink-0 border-b">
        <div className="flex h-[3.5em] items-center px-[0.75em]">
          {/* Mobile back button */}
          <div className="md:hidden">
            {mobileShowContent ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Voltar para a lista de configurações"
                onClick={handleMobileBack}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Voltar para Afiliados"
                onClick={handleClose}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </Button>
            )}
          </div>

          {/* Desktop: logo + breadcrumb */}
          <div className="hidden items-center gap-[0.75em] md:flex">
            <a
              className="focus-visible:ring-primary inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              href="#afiliados"
            >
              <img
                alt="Retrilhar"
                className="h-8 w-auto object-contain transition-all duration-300"
                src="/src/assets/retrilhar-logo.png"
              />
            </a>
            <div className="bg-border h-[1.25em] w-px" />
            <span className="text-muted-foreground text-sm">Configurações</span>
          </div>

          {/* Mobile breadcrumb */}
          <div className="ml-[0.75em] flex items-center gap-[0.375em] md:hidden">
            {mobileShowContent ? (
              <>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onClick={handleMobileBack}
                >
                  Configurações
                </button>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-foreground text-sm font-medium">{activeDef.label}</span>
              </>
            ) : (
              <span className="text-foreground text-sm font-medium">Configurações</span>
            )}
          </div>

          {/* Close button */}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto shrink-0 gap-[0.375em]"
            onClick={handleClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Fechar
          </Button>
        </div>
      </header>

      {/* ── Mobile: section list ── */}
      <div className={cn("flex-1 overflow-y-auto md:hidden", mobileShowContent && "hidden")}>
        <div className="flex flex-col gap-[0.5em] p-[1em]">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="border-border/50 bg-card active:bg-muted/50 focus-visible:ring-ring flex items-center gap-[0.875em] rounded-xl border p-[0.875em] text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => handleSelectSection(section.id)}
            >
              <div className="bg-primary/10 flex size-[2.5em] shrink-0 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={section.icon} size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">{section.label}</p>
                <p className="text-muted-foreground text-xs">{section.description}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-muted-foreground/40 shrink-0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile: section content ── */}
      <div
        className={cn(
          "bg-muted/30 flex-1 overflow-y-auto md:hidden",
          !mobileShowContent && "hidden"
        )}
      >
        <main className="px-[1em] py-[1.25em]">
          <div className="max-w-3xl">
            <ActiveContent />
          </div>
        </main>
      </div>

      {/* ── Desktop: sidebar nav + content ── */}
      <div className="hidden min-h-0 flex-1 md:flex">
        {/* Left nav */}
        <nav className="flex w-[15em] shrink-0 flex-col gap-[0.125em] overflow-y-auto border-r px-[0.75em] py-[1.25em]">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={cn(
                "focus-visible:ring-ring flex items-center gap-[0.5em] rounded-lg px-[0.75em] py-[0.5em] text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <HugeiconsIcon icon={section.icon} size={16} />
              {section.label}
            </button>
          ))}
        </nav>

        {/* Right content */}
        <main className="bg-muted/30 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-[2.5em] py-[2em]">
            <div className="max-w-3xl">
              <ActiveContent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
