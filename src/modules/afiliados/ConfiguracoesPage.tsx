import { useState } from "react";
import {
  BankIcon,
  Copy01Icon,
  Notification01Icon,
  SecurityLockIcon,
  Ticket02Icon,
  UserAccountIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  affiliateAffiliations,
  affiliateCode,
  affiliateProfileData,
  dadosBancarios,
  notificationPreferences,
  organizationMap,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// Section heading (same pattern as GanhosPage / IndicacoesPage)
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
    <div className="mb-4 flex items-center gap-3">
      <span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-[10px]">
        <HugeiconsIcon icon={icon} size={16} />
      </span>
      <div className="min-w-0">
        <h2 className="text-foreground truncate text-sm font-normal">{title}</h2>
        <p className="text-muted-foreground truncate text-xs">{description}</p>
      </div>
    </div>
  );
}

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
// Field row
// ---------------------------------------------------------------------------

function FieldRow({
  label,
  value,
  isFirst = false,
}: {
  label: string;
  value: string;
  isFirst?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3",
        !isFirst && "border-t border-[#f5f5f5]"
      )}
    >
      <span className="text-xs font-medium tracking-wide text-[#a1a1aa] uppercase">{label}</span>
      <span className="text-sm text-[#252b37]">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card wrapper (shared card styling)
// ---------------------------------------------------------------------------

const cardClassName =
  "rounded-2xl border border-[#EEF0F4] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]";

// ---------------------------------------------------------------------------
// ConfiguracoesPage
// ---------------------------------------------------------------------------

export function ConfiguracoesPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState(notificationPreferences);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(affiliateCode);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const initials = affiliateProfileData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <AppPage
      title="Configurações"
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
      <div className="flex flex-col gap-6">
        {/* Section 1: Perfil */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={UserAccountIcon}
              title="Perfil"
              description="Dados pessoais da sua conta"
            />

            <div className="mb-4 flex flex-col items-center gap-2">
              <Avatar className="size-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-[#252b37]">{affiliateProfileData.name}</p>
            </div>

            <div className="flex flex-col">
              <FieldRow label="NOME" value={affiliateProfileData.name} isFirst />
              <FieldRow label="E-MAIL" value={affiliateProfileData.email} />
              <FieldRow label="TELEFONE" value={affiliateProfileData.phone} />
              <FieldRow
                label={`DOCUMENTO (${affiliateProfileData.documentType})`}
                value={affiliateProfileData.document}
              />
            </div>

            <div className="mt-4">
              <Button variant="outline" size="sm">
                Editar perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Código de afiliado */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={Ticket02Icon}
              title="Código de afiliado"
              description="Seu identificador único"
            />

            <div className="flex items-center gap-3">
              <div className="bg-muted/50 flex-1 rounded-lg px-4 py-2.5">
                <span className="font-mono text-sm text-[#252b37]">{affiliateCode}</span>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" onClick={handleCopyCode}>
                <HugeiconsIcon icon={Copy01Icon} size={14} />
                {copiedCode ? "Copiado!" : "Copiar"}
              </Button>
            </div>

            <p className="text-muted-foreground mt-2 text-xs">
              Código gerado pelo sistema. Não é possível alterar.
            </p>
          </CardContent>
        </Card>

        {/* Section 3: Dados bancários */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={BankIcon}
              title="Dados bancários"
              description="Conta para recebimento de comissões"
            />

            <div className="flex flex-col">
              <FieldRow
                label="BANCO"
                value={`${dadosBancarios.banco} (${dadosBancarios.codigoBanco})`}
                isFirst
              />
              <FieldRow label="AGÊNCIA" value={dadosBancarios.agencia} />
              <FieldRow label="CONTA" value={dadosBancarios.conta} />
              <FieldRow label="TIPO" value={dadosBancarios.tipo} />
              <FieldRow label="TITULAR" value={dadosBancarios.titular} />
            </div>

            <div className="mt-4">
              <Button variant="outline" size="sm">
                Editar dados bancários
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Minhas afiliações */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={UserGroupIcon}
              title="Minhas afiliações"
              description="Organizações vinculadas"
            />

            <div className="flex flex-col">
              {affiliateAffiliations.map((affiliation, index) => {
                const org = organizationMap[affiliation.organizationId];
                return (
                  <div
                    key={affiliation.organizationId}
                    className={cn(
                      "flex items-center justify-between py-3",
                      index > 0 && "border-t border-[#f5f5f5]"
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-[#252b37]">
                        {org?.name ?? affiliation.organizationId}
                      </span>
                      <span className="text-xs text-[#a1a1aa]">
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

        {/* Section 5: Segurança */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={SecurityLockIcon}
              title="Segurança"
              description="Senha e acesso"
            />

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-[#252b37]">Senha</span>
              <Button variant="outline" size="sm">
                Alterar senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Preferências de notificação */}
        <Card className={cn(cardClassName, "py-0 shadow-none")}>
          <CardContent className="p-5">
            <SectionHeading
              icon={Notification01Icon}
              title="Notificações"
              description="Gerencie suas preferências de notificação"
            />

            <div className="flex flex-col">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-[#252b37]">Produto novo no escopo</span>
                <Switch
                  checked={notifPrefs.produtoNovo}
                  onCheckedChange={(checked) =>
                    setNotifPrefs((prev) => ({ ...prev, produtoNovo: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#f5f5f5] py-3">
                <span className="text-sm text-[#252b37]">Comissão quitada</span>
                <Switch
                  checked={notifPrefs.comissaoQuitada}
                  onCheckedChange={(checked) =>
                    setNotifPrefs((prev) => ({ ...prev, comissaoQuitada: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#f5f5f5] py-3">
                <span className="text-sm text-[#252b37]">Convite de vínculo</span>
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
    </AppPage>
  );
}
