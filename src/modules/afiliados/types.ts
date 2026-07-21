import type { GanhosTab, IndicacoesTab, OrderStatus, ReferralOrigin } from "@/mocks/afiliados";

export type {
  AffiliateAffiliation,
  AffiliateOrgScope,
  AffiliateProduct,
  AffiliateProductRequest,
  AffiliateProfileData,
  AffiliateScopeType,
  AffiliationReceiving,
  AfiliadoKpis,
  AfiliadoOrganization,
  AfiliadoPeriod,
  AfiliadoReferral,
  AfiliadoReferralCartItem,
  ComissaoLancamento,
  CommissionStatus,
  FaqItem,
  FormaRecebimento,
  GanhosKpis,
  GanhosTab,
  IndicacoesKpis,
  IndicacoesTab,
  OrderStatus,
  OrgBreakdown,
  ReceivingDestination,
  ReferralOrigin,
} from "@/mocks/afiliados";

export const ALL_ORGANIZATIONS = "all" as const;

export type OrganizationFilter = string;

export type ReferralFilters = {
  readonly organizationId?: OrganizationFilter;
  readonly tab?: IndicacoesTab;
  readonly search?: string;
  readonly origin?: ReferralOrigin | typeof ALL_ORGANIZATIONS;
  readonly orderStatuses?: readonly OrderStatus[];
};

export type CommissionFilters = {
  readonly organizationId?: OrganizationFilter;
  readonly tab?: GanhosTab;
  readonly search?: string;
};

export type ProductRequestState = ReadonlySet<string>;
