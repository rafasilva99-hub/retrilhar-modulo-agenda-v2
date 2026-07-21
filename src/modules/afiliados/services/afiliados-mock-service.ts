import {
  affiliateOrganizations,
  affiliateOrgScopes,
  affiliateReferrals,
  affiliationReceivings,
  comissaoLancamentos,
} from "@/mocks/afiliados";

import type {
  AffiliateOrgScope,
  AffiliateProduct,
  AffiliateProductRequest,
  AffiliationReceiving,
  AfiliadoOrganization,
  AfiliadoReferral,
  AfiliadoReferralCartItem,
  ComissaoLancamento,
  CommissionFilters,
  OrganizationFilter,
  ProductRequestState,
  ReferralFilters,
} from "../types";
import { ALL_ORGANIZATIONS } from "../types";

function normalizeSearch(search: string | undefined): string {
  return search?.trim().toLowerCase() ?? "";
}

function cloneReferral(referral: AfiliadoReferral): AfiliadoReferral {
  const cartItems = referral.cartItems?.map((item) => ({ ...item }));

  return cartItems ? { ...referral, cartItems } : { ...referral };
}

function cloneProduct(product: AffiliateProduct): AffiliateProduct {
  return { ...product };
}

function cloneProductRequest(request: AffiliateProductRequest): AffiliateProductRequest {
  return { ...request };
}

function cloneProductScope(scope: AffiliateOrgScope): AffiliateOrgScope {
  return {
    ...scope,
    products: scope.products.map(cloneProduct),
    availableToRequest: scope.availableToRequest.map(cloneProductRequest),
  };
}

function cloneReceiving(receiving: AffiliationReceiving): AffiliationReceiving {
  return { ...receiving };
}

export function filterByOrganization<T extends { organizationId: string }>(
  items: readonly T[],
  organizationId?: OrganizationFilter
): T[] {
  if (!organizationId || organizationId === ALL_ORGANIZATIONS) {
    return [...items];
  }

  return items.filter((item) => item.organizationId === organizationId);
}

export function listAffiliateOrganizations(): AfiliadoOrganization[] {
  return affiliateOrganizations.map((organization) => ({ ...organization }));
}

export function filterOrganizations(search = ""): AfiliadoOrganization[] {
  const query = normalizeSearch(search);

  return listAffiliateOrganizations().filter(
    (organization) =>
      !query ||
      organization.name.toLowerCase().includes(query) ||
      organization.code.toLowerCase().includes(query)
  );
}

export function getReferralCartItems(referral: AfiliadoReferral): AfiliadoReferralCartItem[] {
  if (referral.cartItems?.length) {
    return referral.cartItems.map((item) => ({ ...item }));
  }

  return [
    {
      id: `${referral.id}-item-1`,
      product: referral.product,
      activityDate: referral.activityDate,
    },
  ];
}

export function filterReferrals(
  referrals: readonly AfiliadoReferral[] = affiliateReferrals,
  filters: ReferralFilters = {}
): AfiliadoReferral[] {
  let results = filterByOrganization(referrals, filters.organizationId);

  if (filters.tab && filters.tab !== "todas") {
    results = results.filter((referral) => {
      if (filters.tab === "pagas") return referral.orderStatus === "Pago";
      if (filters.tab === "nao-pagas") {
        return (
          referral.orderStatus === "Aguardando pagamento" || referral.orderStatus === "Cancelado"
        );
      }
      return referral.orderStatus === "Abandonado";
    });
  }

  const query = normalizeSearch(filters.search);
  if (query) {
    results = results.filter(
      (referral) =>
        referral.customer.toLowerCase().includes(query) ||
        getReferralCartItems(referral).some((item) => item.product.toLowerCase().includes(query))
    );
  }

  if (filters.origin && filters.origin !== ALL_ORGANIZATIONS) {
    results = results.filter((referral) => referral.origin === filters.origin);
  }

  if (filters.orderStatuses) {
    results = results.filter((referral) => filters.orderStatuses?.includes(referral.orderStatus));
  }

  return results.map(cloneReferral);
}

export function filterCommissions(
  commissions: readonly ComissaoLancamento[] = comissaoLancamentos,
  filters: CommissionFilters = {}
): ComissaoLancamento[] {
  let results = filterByOrganization(commissions, filters.organizationId);

  if (filters.tab === "pendentes") {
    results = results.filter(
      (commission) => commission.status === "a-receber" || commission.status === "nao-gerada"
    );
  } else if (filters.tab === "quitadas") {
    results = results.filter((commission) => commission.status === "quitada");
  }

  const query = normalizeSearch(filters.search);
  if (query) {
    results = results.filter(
      (commission) =>
        commission.customerName.toLowerCase().includes(query) ||
        commission.product.toLowerCase().includes(query)
    );
  }

  return results.map((commission) => ({ ...commission }));
}

export function getProductScope(organizationId: OrganizationFilter): AffiliateOrgScope | undefined {
  const scope = affiliateOrgScopes.find((item) => item.organizationId === organizationId);
  return scope ? cloneProductScope(scope) : undefined;
}

export function assignReceivingDestination(
  receivings: readonly AffiliationReceiving[],
  organizationId: OrganizationFilter,
  destinationId: string | null
): AffiliationReceiving[] {
  return receivings.map((receiving) => {
    if (receiving.organizationId !== organizationId) return cloneReceiving(receiving);
    if (receiving.forma === "Dinheiro") return { ...receiving, destinoId: null };
    return { ...receiving, destinoId: destinationId };
  });
}

export function countDestinationUsage(
  receivings: readonly AffiliationReceiving[] = affiliationReceivings
): Record<string, number> {
  const usage: Record<string, number> = {};

  for (const receiving of receivings) {
    if (receiving.destinoId) {
      usage[receiving.destinoId] = (usage[receiving.destinoId] ?? 0) + 1;
    }
  }

  return usage;
}

export function getDestinationUsageCount(
  destinationId: string,
  receivings: readonly AffiliationReceiving[] = affiliationReceivings
): number {
  return countDestinationUsage(receivings)[destinationId] ?? 0;
}

export function createProductRequestState(
  scopes: readonly AffiliateOrgScope[] = affiliateOrgScopes
): ProductRequestState {
  return new Set(
    scopes.flatMap((scope) =>
      scope.availableToRequest.filter((request) => request.solicitado).map((request) => request.id)
    )
  );
}

export function requestProduct(state: ProductRequestState, productId: string): ProductRequestState {
  const nextState = new Set(state);
  nextState.add(productId);
  return nextState;
}

export function isProductRequested(
  request: AffiliateProductRequest,
  state: ProductRequestState
): boolean {
  return request.solicitado === true || state.has(request.id);
}
