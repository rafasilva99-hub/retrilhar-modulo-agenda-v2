// allow: SIZE_OK - the task write set isolates this screen; its cohesive view fragments stay local.
import { useEffect, useState } from "react";
import {
  AddSquareIcon,
  ArrowRight01Icon,
  InformationCircleIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppPage } from "@/components/layout/app-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  affiliateCode,
  affiliateGeneralLink,
  affiliateOrganizations,
  organizationMap,
} from "@/mocks/afiliados";

import {
  createProductRequestState,
  getProductScope,
  isProductRequested,
  requestProduct,
} from "./services/afiliados-mock-service";
import {
  AffiliateEmptyState,
  AffiliateLinkCard,
  CopyButton,
  OrganizationFilter,
  SectionHeading,
} from "./components";
import type { AffiliateOrgScope, AffiliateProductRequest, ProductRequestState } from "./types";
import { ALL_ORGANIZATIONS } from "./types";

type AffiliateProduct = AffiliateOrgScope["products"][number];

const affiliateProductScopes: readonly AffiliateOrgScope[] = affiliateOrganizations.flatMap(
  (organization) => {
    const scope = getProductScope(organization.id);
    return scope ? [scope] : [];
  }
);

function organizationName(organizationId: string): string {
  return organizationMap[organizationId]?.name ?? organizationId;
}

function ProductCard({ product }: { readonly product: AffiliateProduct }) {
  const isAvailable = !product.indisponivel;
  const commissionSource =
    product.comissaoOrigem === "afiliação" ? "da afiliação" : "deste produto";

  return (
    <Card className="flex h-full flex-col gap-4 rounded-2xl p-4 shadow-none transition-shadow hover:shadow-sm">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Produto</p>
            <p className="mt-1 truncate text-sm font-medium">{product.name}</p>
          </div>
          <span
            className={cn(
              "bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl",
              !isAvailable && "bg-muted text-muted-foreground"
            )}
          >
            <HugeiconsIcon icon={PackageIcon} size={18} aria-hidden="true" />
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs">Comissão</p>
            <p className="mt-1 text-lg leading-none font-semibold">{product.comissao}</p>
            <p className="text-muted-foreground mt-1 text-xs">{commissionSource}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {product.isNew ? (
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Novo</Badge>
            ) : null}
            {!isAvailable ? <Badge variant="outline">Indisponível</Badge> : null}
          </div>
        </div>
        <a href="#indicacoes" className="text-primary mt-4 block text-xs hover:underline">
          {product.vendasNoPeriodo} vendas no período
        </a>
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Link do produto (nível 3)</p>
        <CopyButton
          value={product.link}
          copyLabel={isAvailable ? "Copiar link do produto" : "Indisponível"}
          disabled={!isAvailable}
          size="sm"
          className="h-auto min-h-8 w-full px-2 py-2 text-center leading-tight break-words whitespace-normal"
        />
      </div>
    </Card>
  );
}

function ScopeMessage({ scope }: { readonly scope: AffiliateOrgScope }) {
  const allProducts = scope.scopeType === "todos";
  return (
    <div className="bg-muted/50 text-muted-foreground mt-4 flex items-start gap-2 rounded-xl p-3 text-xs">
      <HugeiconsIcon
        icon={InformationCircleIcon}
        size={16}
        className="text-primary mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <p>
        {allProducts
          ? "Você pode vender todos os produtos desta organização. Novos produtos entram automaticamente."
          : "Esta afiliação inclui apenas produtos específicos. Produtos fora da lista precisam ser solicitados."}
      </p>
    </div>
  );
}

function ProductRequestRow({
  item,
  requestedIds,
  onRequest,
}: {
  readonly item: AffiliateProductRequest;
  readonly requestedIds: ProductRequestState;
  readonly onRequest: (productId: string) => void;
}) {
  const requested = isProductRequested(item, requestedIds);
  return (
    <div className="border-border flex min-h-14 items-center justify-between gap-3 border-t px-4 first:border-t-0">
      <span className="min-w-0 truncate text-sm">{item.name}</span>
      {requested ? (
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          Solicitação enviada
        </Badge>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRequest(item.id)}
          aria-label={`Solicitar ${item.name}`}
        >
          Solicitar
        </Button>
      )}
    </div>
  );
}

function OrganizationScope({
  scope,
  requestedIds,
  onRequest,
}: {
  readonly scope: AffiliateOrgScope;
  readonly requestedIds: ProductRequestState;
  readonly onRequest: (productId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <SectionHeading
          icon={PackageIcon}
          title={organizationName(scope.organizationId)}
          description="Produtos que você pode vender nesta organização"
        />
        <ScopeMessage scope={scope} />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scope.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {scope.scopeType === "especificos" && scope.availableToRequest.length > 0 ? (
        <section className="border-border bg-card rounded-2xl border p-5">
          <SectionHeading
            icon={AddSquareIcon}
            title="Disponíveis para solicitar"
            description="Produtos fora da sua afiliação atual"
          />
          <p className="text-muted-foreground mt-3 text-xs">
            Envie uma solicitação para a organização avaliar a inclusão do produto.
          </p>
          <div className="border-border mt-3 rounded-xl border">
            {scope.availableToRequest.map((item) => (
              <ProductRequestRow
                key={item.id}
                item={item}
                requestedIds={requestedIds}
                onRequest={onRequest}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function OrganizationLinksCard({
  scopes,
  onSelect,
}: {
  readonly scopes: readonly AffiliateOrgScope[];
  readonly onSelect: (organizationId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <AffiliateLinkCard
        title="Links por organização"
        description="Link da organização (nível 2): uma página com seus produtos"
        links={scopes.map((scope) => ({
          id: scope.organizationId,
          label: organizationName(scope.organizationId),
          value: scope.orgLink,
        }))}
      />
      <div className="flex flex-wrap justify-end gap-2">
        {scopes.map((scope) => (
          <Button
            key={scope.organizationId}
            variant="outline"
            size="sm"
            onClick={() => onSelect(scope.organizationId)}
            aria-label={`Ver produtos e links de ${organizationName(scope.organizationId)}`}
          >
            Ver produtos e links
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ProdutosLinksPage() {
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const collapseButton = document.querySelector<HTMLButtonElement>(
      'aside button[title="Encolher menu"]'
    );
    collapseButton?.click();
  }, []);

  const [selectedOrg, setSelectedOrg] = useState<string>(ALL_ORGANIZATIONS);
  const [showOrganizationLinks, setShowOrganizationLinks] = useState(false);
  const [requestedIds, setRequestedIds] = useState<ProductRequestState>(() =>
    createProductRequestState()
  );
  const selectedScope = affiliateProductScopes.find(
    (scope) => scope.organizationId === selectedOrg
  );
  const visibleScopes =
    selectedOrg === ALL_ORGANIZATIONS
      ? affiliateProductScopes
      : affiliateProductScopes.filter((scope) => scope.organizationId === selectedOrg);

  return (
    <AppPage
      title="Produtos e Links"
      description="Compartilhe o link certo para cada organização, produto ou canal."
      breadcrumb={[
        {
          title: "Início",
          onClick: () => {
            window.location.hash = "#afiliados";
          },
        },
      ]}
    >
      <div className="flex flex-col gap-5">
        <OrganizationFilter
          organizations={affiliateOrganizations}
          value={selectedOrg}
          onValueChange={setSelectedOrg}
          label="Organização"
        />
        <div className="space-y-3">
          <AffiliateLinkCard
            title="Links e código"
            description="Escolha o nível de link que combina com a sua divulgação"
            links={[
              {
                id: "general",
                label: "Link geral (nível 1)",
                value: affiliateGeneralLink,
                description: "Página com os produtos elegíveis de todas as organizações",
              },
              {
                id: "code",
                label: "Código de afiliado",
                value: affiliateCode,
                description: "Use o código quando o canal não aceitar um link",
              },
            ]}
          />
          <div className="flex items-center justify-end">
            <Button
              variant="link"
              size="sm"
              className="gap-1 px-0"
              onClick={() => setShowOrganizationLinks(true)}
            >
              Ver links por organização
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
        {showOrganizationLinks ? (
          <OrganizationLinksCard
            scopes={affiliateProductScopes}
            onSelect={(organizationId) => {
              setSelectedOrg(organizationId);
              setShowOrganizationLinks(false);
            }}
          />
        ) : null}
        {selectedScope ? (
          <AffiliateLinkCard
            title="Link da organização (nível 2)"
            description={`${organizationName(selectedScope.organizationId)} e seus produtos habilitados`}
            links={[
              {
                id: selectedScope.organizationId,
                label: organizationName(selectedScope.organizationId),
                value: selectedScope.orgLink,
              },
            ]}
          />
        ) : null}
        {visibleScopes.length > 0 ? (
          visibleScopes.map((scope) => (
            <OrganizationScope
              key={scope.organizationId}
              scope={scope}
              requestedIds={requestedIds}
              onRequest={(productId) =>
                setRequestedIds((state) => requestProduct(state, productId))
              }
            />
          ))
        ) : (
          <AffiliateEmptyState
            title="Nenhuma organização encontrada"
            description="Selecione outra organização para ver seus produtos e links."
          />
        )}
      </div>
    </AppPage>
  );
}
