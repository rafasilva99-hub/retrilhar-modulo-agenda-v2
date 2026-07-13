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
  type FormaRecebimento,
  notificationPreferences,
  organizationMap,
  type ReceivingDestination,
  receivingDestinations,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsSection =
  | "perfil"
  | "bancarios"
  | "afiliacoes"
  | "seguranca"
  | "notificacoes";

interface SectionDef {
  id: SettingsSection;
  icon: IconSvgElement;
  label: string;
  description: string;
}

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
    description: "Organizações vinculadas",
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

function affiliationStatusClass(status: string): string {
  switch (status) {
    case "Ativa":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Pendente":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Inativa":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "";
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
          <p className="text-sm text-muted-foreground">
            Suas informações pessoais e dados da conta
          </p>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-[0.375em] shrink-0 md:inline-flex"
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
              <Avatar className="size-[4.5em] border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-[1.25em]">
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
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, document: e.target.value }))
                      }
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
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nome completo
                  </span>
                  <p className="text-sm">{affiliateProfileData.name}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    E-mail
                  </span>
                  <p className="text-sm">{affiliateProfileData.email}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Telefone
                  </span>
                  <p className="text-sm">{affiliateProfileData.phone}</p>
                </div>
                <div className="space-y-[0.25em]">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Documento ({affiliateProfileData.documentType})
                  </span>
                  <p className="text-sm">{affiliateProfileData.document}</p>
                </div>
              </div>

              {/* Código de afiliado */}
              <div className="border-t border-[#f5f5f5] pt-[1em] !mb-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
      return { bg: "bg-[#dcfce7]", text: "text-[#166534]", desc: "Comissão liquidada na hora da venda" };
    case "Transferência bancária":
      return { bg: "bg-[#dbeafe]", text: "text-[#1e40af]", desc: "Repasse feito pela organização" };
    case "Dinheiro":
      return { bg: "bg-[#fef3c7]", text: "text-[#92400e]", desc: "Acerto presencial com a organização" };
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
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
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
            <Input
              value={form.titular}
              onChange={(e) => updateField("titular", e.target.value)}
            />
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
            <Label htmlFor="dest-padrao" className="text-sm font-normal cursor-pointer">
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

  const handleAddDestination = () => {
    setEditingDest(undefined);
    setDrawerOpen(true);
  };

  const handleEditDestination = (dest: ReceivingDestination) => {
    setEditingDest(dest);
    setDrawerOpen(true);
  };

  const activeAffiliations = affiliateAffiliations.filter((a) => a.status === "Ativa");

  const destUsageCount = (destId: string) =>
    affiliationReceivings.filter((r) => r.destinoId === destId).length;

  return (
    <div className="space-y-[1.5em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Formas de recebimento</h2>
        <p className="text-sm text-muted-foreground">
          Onde e como você recebe suas comissões de cada organização
        </p>
      </div>

      {/* ── Bloco A: Como você recebe de cada organização ── */}
      <div className="space-y-[0.75em]">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Como você recebe de cada organização
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A forma de recebimento é definida no acordo com cada organização. Para alterá-la, fale com a organização.
          </p>
        </div>

        <Card className="rounded-4xl shadow-none">
          <CardContent>
            <div className="flex flex-col">
              {activeAffiliations.map((affiliation, index) => {
                const org = organizationMap[affiliation.organizationId];
                const receiving = affiliationReceivings.find(
                  (r) => r.organizationId === affiliation.organizationId
                );
                const forma = receiving?.forma ?? "Transferência bancária";
                const badge = formaRecebimentoBadge(forma);
                const linkedDest = receiving?.destinoId
                  ? receivingDestinations.find((d) => d.id === receiving.destinoId)
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
                    <div className="flex flex-col gap-1 min-w-0">
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
                      <span className="text-xs text-muted-foreground">{badge.desc}</span>
                      {linkedDest ? (
                        <span className="text-xs text-muted-foreground">
                          {linkedDest.apelido} - {linkedDest.banco} {linkedDest.contaMascarada}
                        </span>
                      ) : forma !== "Dinheiro" ? (
                        <span className="text-xs text-amber-600">Nenhum destino vinculado</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não se aplica</span>
                      )}
                    </div>
                    {forma !== "Dinheiro" && (
                      <Button variant="outline" size="sm" className="shrink-0 self-start md:self-center">
                        Alterar destino
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── Bloco B: Meus destinos de recebimento ── */}
      <div className="space-y-[0.75em]">
        <div>
          <h3 className="text-sm font-medium text-foreground">Meus destinos de recebimento</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contas onde suas comissões podem ser depositadas. Você pode cadastrar mais de uma.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {receivingDestinations.map((dest) => {
            const usageCount = destUsageCount(dest.id);
            return (
              <Card key={dest.id} className="rounded-2xl shadow-none">
                <CardContent>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[#252b37]">{dest.apelido}</span>
                        {dest.padrao && (
                          <Badge className="bg-primary/10 text-primary border-transparent text-[10px] px-1.5 py-0 h-4">
                            Padrão
                          </Badge>
                        )}
                        {usageCount > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            Em uso por {usageCount}{" "}
                            {usageCount === 1 ? "organização" : "organizações"}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 text-xs text-muted-foreground md:grid-cols-2">
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
                        <Button variant="ghost" size="icon-sm" className="shrink-0">
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
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <HugeiconsIcon icon={Delete01Icon} size={14} />
                          Excluir
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

      <DestinationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        destination={editingDest}
      />
    </div>
  );
}

function AfiliacoesContent() {
  return (
    <div className="space-y-[1em]">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Minhas afiliações</h2>
        <p className="text-sm text-muted-foreground">Organizações vinculadas à sua conta</p>
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent>
          <div className="flex flex-col">
            {affiliateAffiliations.map((affiliation, index) => {
              const org = organizationMap[affiliation.organizationId];
              return (
                <div
                  key={affiliation.organizationId}
                  className={cn(
                    "flex items-center justify-between py-3",
                    index === 0 && "pt-0",
                    index === affiliateAffiliations.length - 1 && "pb-0",
                    index > 0 && "border-t border-[#f5f5f5]"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-[#252b37]">
                      {org?.name ?? affiliation.organizationId}
                    </span>
                    <span className="text-xs text-muted-foreground">
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
        <p className="text-sm text-muted-foreground">Senha e configurações de acesso</p>
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
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, nova: e.target.value }))
                    }
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
                <p className="text-xs text-muted-foreground">Última alteração há 3 meses</p>
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
        <p className="text-sm text-muted-foreground">Gerencie suas preferências de alerta</p>
      </div>

      <Card className="rounded-4xl shadow-none">
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-center justify-between pb-3">
              <div className="space-y-[0.25em]">
                <span className="text-sm text-[#252b37]">Produto novo no escopo</span>
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
                  Receba quando uma comissão for paga
                </p>
              </div>
              <Switch
                checked={notifPrefs.comissaoQuitada}
                onCheckedChange={(checked) =>
                  setNotifPrefs((prev) => ({ ...prev, comissaoQuitada: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between border-t border-[#f5f5f5] pt-3 pb-0">
              <div className="space-y-[0.25em]">
                <span className="text-sm text-[#252b37]">Convite de vínculo</span>
                <p className="text-xs text-muted-foreground">
                  Receba quando uma organização enviar convite
                </p>
              </div>
              <Switch
                checked={notifPrefs.conviteVinculo}
                onCheckedChange={(checked) =>
                  setNotifPrefs((prev) => ({ ...prev, conviteVinculo: checked }))
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
      <header className="shrink-0 border-b bg-background">
        <div className="flex h-[3.5em] items-center px-[0.75em]">
          {/* Mobile back button */}
          <div className="md:hidden">
            {mobileShowContent ? (
              <Button variant="ghost" size="icon-sm" onClick={handleMobileBack}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </Button>
            ) : (
              <Button variant="ghost" size="icon-sm" onClick={handleClose}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </Button>
            )}
          </div>

          {/* Desktop: logo + breadcrumb */}
          <div className="hidden items-center gap-[0.75em] md:flex">
            <a
              className="inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="#afiliados"
            >
              <img
                alt="Retrilhar"
                className="h-8 w-auto object-contain transition-all duration-300"
                src="/src/assets/retrilhar-logo.png"
              />
            </a>
            <div className="h-[1.25em] w-px bg-border" />
            <span className="text-sm text-muted-foreground">Configurações</span>
          </div>

          {/* Mobile breadcrumb */}
          <div className="ml-[0.75em] flex items-center gap-[0.375em] md:hidden">
            {mobileShowContent ? (
              <>
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleMobileBack}
                >
                  Configurações
                </button>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm font-medium text-foreground">{activeDef.label}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-foreground">Configurações</span>
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
              className="flex items-center gap-[0.875em] rounded-xl border border-border/50 bg-card p-[0.875em] text-left transition-colors active:bg-muted/50"
              onClick={() => handleSelectSection(section.id)}
            >
              <div className="flex size-[2.5em] shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <HugeiconsIcon icon={section.icon} size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-muted-foreground/40"
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
          "flex-1 overflow-y-auto bg-muted/30 md:hidden",
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
      <div className="hidden flex-1 min-h-0 md:flex">
        {/* Left nav */}
        <nav className="flex w-[15em] shrink-0 flex-col gap-[0.125em] overflow-y-auto border-r px-[0.75em] py-[1.25em]">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={cn(
                "flex items-center gap-[0.5em] rounded-lg px-[0.75em] py-[0.5em] text-left text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 font-medium text-primary"
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
        <main className="flex-1 overflow-y-auto bg-muted/30">
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
