import { useState } from "react";
import {
  AddSquareIcon,
  Copy02Icon,
  Link04Icon,
  PackageIcon,
  Ticket02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  affiliateCode,
  affiliateGeneralLink,
  affiliateOrganizations,
  type AffiliateOrgScope,
  getAffiliateScopes,
  organizationMap,
} from "@/mocks/afiliados";

// ---------------------------------------------------------------------------
// SectionHeading (shared pattern across afiliados pages)
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
    <div className="flex items-center gap-3 mb-4">
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
// Product card
// ---------------------------------------------------------------------------

function ProductCard({
  product,
  copiedId,
  onCopy,
}: {
  product: AffiliateOrgScope["products"][number];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const isCopied = copiedId === product.id;
  const commissionSource =
    product.comissaoOrigem === "afiliação" ? "da afiliação" : "deste produto";
  const imageInitial = product.name.slice(0, 1).toUpperCase();

  return (
    <Card className="h-[250px] rounded-xl border border-[#EEF0F4] bg-white p-4 shadow-none ring-0 transition hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] leading-[14px] text-[#717680]">Produto</p>
            <p className="mt-1 truncate text-[14px] font-medium text-[#0a0a0a]">
              {product.name}
            </p>
          </div>
          <div className="relative size-12 shrink-0 overflow-hidden rounded-[10px] border border-[#EEF0F4] bg-[#f8f9fc]">
            <div
              className={cn(
                "grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_34%),linear-gradient(135deg,#dff4e8_0%,#edf7ff_100%)]",
                product.indisponivel &&
                  "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_34%),linear-gradient(135deg,#f1f1f1_0%,#e5e7eb_100%)]"
              )}
            >
              <span
                className={cn(
                  "text-[13px] font-medium text-[#079455]",
                  product.indisponivel && "text-[#717680]"
                )}
              >
                {imageInitial}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] leading-[14px] text-[#717680]">Comissão</p>
            <p className="mt-1 text-[18px] font-semibold leading-none text-[#181d27]">
              {product.comissao}
            </p>
            <p className="mt-1 text-[12px] leading-[14px] text-[#717680]">{commissionSource}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {product.isNew && (
              <Badge
                variant="outline"
                className="h-5 border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
              >
                Novo
              </Badge>
            )}
            {product.indisponivel && (
              <Badge
                variant="outline"
                className="h-5 border-gray-200 bg-gray-100 text-xs text-gray-500"
              >
                Indisponível
              </Badge>
            )}
          </div>
        </div>

        <button
          type="button"
          className="mt-3 cursor-pointer text-left text-xs text-primary hover:underline"
          onClick={() => {
            window.location.hash = "#indicacoes";
          }}
        >
          {product.vendasNoPeriodo} vendas no período
        </button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-auto h-10 w-full gap-2 px-4 py-0"
        disabled={product.indisponivel}
        onClick={() => onCopy(product.link, product.id)}
      >
        <HugeiconsIcon icon={Copy02Icon} size={14} />
        {isCopied ? "Copiado!" : "Copiar link"}
      </Button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Available-to-request list
// ---------------------------------------------------------------------------

function RequestList({
  items,
  requestedIds,
  onRequest,
}: {
  items: AffiliateOrgScope["availableToRequest"];
  requestedIds: Set<string>;
  onRequest: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#EEF0F4] bg-white">
      {items.map((item, index) => {
        const wasSolicitado = item.solicitado || requestedIds.has(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "flex h-14 items-center justify-between gap-3 px-4",
              index > 0 && "border-t border-[#f5f5f5]"
            )}
          >
            <span className="min-w-0 truncate text-[14px] text-[#0a0a0a]">{item.name}</span>
            {wasSolicitado ? (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700 text-xs"
              >
                Solicitação enviada
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRequest(item.id)}
              >
                Solicitar
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Org scope section
// ---------------------------------------------------------------------------

function OrgScopeSection({
  scope,
  copiedId,
  requestedIds,
  onCopy,
  onRequest,
}: {
  scope: AffiliateOrgScope;
  copiedId: string | null;
  requestedIds: Set<string>;
  onCopy: (text: string, id: string) => void;
  onRequest: (id: string) => void;
}) {
  const org = organizationMap[scope.organizationId];
  const orgName = org?.name ?? scope.organizationId;

  return (
    <div className="flex flex-col gap-6">
      {/* Enabled products section */}
      <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
        <SectionHeading
          icon={PackageIcon}
          title={orgName}
          description="Produtos que você pode vender nesta organização"
        />

        {scope.scopeType === "todos" && (
          <div className="mb-4 flex items-center gap-[10px] rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-3 py-2">
            <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
              <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
              <path
                d="M12 16v-4M12 8h.01"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[12px] leading-[14px] text-[#414651]">
              Você pode vender todos os produtos desta organização. Novos produtos entram
              automaticamente.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scope.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              copiedId={copiedId}
              onCopy={onCopy}
            />
          ))}
        </div>
      </section>

      {/* Available to request (only for "especificos" scope with items) */}
      {scope.scopeType === "especificos" && scope.availableToRequest.length > 0 && (
        <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.03)]">
          <SectionHeading
            icon={AddSquareIcon}
            title="Disponíveis para solicitar"
            description="Produtos que você pode solicitar filiação"
          />
          <RequestList
            items={scope.availableToRequest}
            requestedIds={requestedIds}
            onRequest={onRequest}
          />
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProdutosLinksPage
// ---------------------------------------------------------------------------

export function ProdutosLinksPage() {
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  const scopes = getAffiliateScopes(selectedOrg);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleRequest = (id: string) => {
    setRequestedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Determine which link to show in the card
  const displayLink =
    selectedOrg === "all"
      ? affiliateGeneralLink
      : scopes[0]?.orgLink ?? affiliateGeneralLink;

  const displayLinkLabel =
    selectedOrg === "all" ? "Link geral (nível 1)" : "Link da organização (nível 2)";

  return (
    <AppPage
      title="Produtos e Links"
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
        {/* Org selector */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue placeholder="Todas as organizações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as organizações</SelectItem>
              {affiliateOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Links & Code Card */}
        <Card className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-none">
          <div className="flex flex-col gap-3">
            {/* Affiliate code */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <HugeiconsIcon icon={Ticket02Icon} size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground shrink-0">Código de afiliado</span>
                <span className="rounded bg-muted/50 px-2 py-1 font-mono text-sm truncate">
                  {affiliateCode}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => handleCopy(affiliateCode, "affiliate-code")}
              >
                <HugeiconsIcon icon={Copy02Icon} size={14} />
                {copiedId === "affiliate-code" ? "Copiado!" : "Copiar"}
              </Button>
            </div>

            {/* Link row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <HugeiconsIcon icon={Link04Icon} size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground shrink-0">{displayLinkLabel}</span>
                <span className="rounded bg-muted/50 px-2 py-1 font-mono text-xs truncate max-w-[320px]">
                  {displayLink}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => handleCopy(displayLink, "main-link")}
              >
                <HugeiconsIcon icon={Copy02Icon} size={14} />
                {copiedId === "main-link" ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Org scope sections */}
        {scopes.map((scope) => (
          <OrgScopeSection
            key={scope.organizationId}
            scope={scope}
            copiedId={copiedId}
            requestedIds={requestedIds}
            onCopy={handleCopy}
            onRequest={handleRequest}
          />
        ))}
      </div>
    </AppPage>
  );
}
