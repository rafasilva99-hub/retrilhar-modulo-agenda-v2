import { describe, expect, it } from "vitest";

import {
  affiliateOrganizations,
  affiliateOrgScopes,
  affiliateReferrals,
  affiliationReceivings,
  comissaoLancamentos,
} from "@/mocks/afiliados";

import {
  assignReceivingDestination,
  countDestinationUsage,
  createProductRequestState,
  filterCommissions,
  filterOrganizations,
  filterReferrals,
  getProductScope,
  isProductRequested,
  requestProduct,
} from "./afiliados-mock-service";

describe("afiliados mock service", () => {
  it("filters organizations by a case-insensitive name query", () => {
    const filtered = filterOrganizations("VERTACO");

    expect(filtered.map((organization) => organization.id)).toEqual(["org-vertaco"]);
    expect(affiliateOrganizations).toHaveLength(3);
  });

  it("filters referrals by organization, tab, search, and origin", () => {
    const filtered = filterReferrals(affiliateReferrals, {
      organizationId: "org-cerrado",
      tab: "pagas",
      search: "juliana",
      origin: "link-geral",
    });

    expect(filtered.map((referral) => referral.id)).toEqual(["ref-4"]);
  });

  it("filters commissions by pending status and product search", () => {
    const filtered = filterCommissions(comissaoLancamentos, {
      organizationId: "org-cerrado",
      tab: "pendentes",
      search: "tirolesa",
    });

    expect(filtered.map((commission) => commission.id)).toEqual(["lnc-6", "lnc-11"]);
  });

  it("looks up a product scope without changing fixture data", () => {
    const scope = getProductScope("org-cerrado");

    expect(scope?.scopeType).toBe("todos");
    expect(scope?.products.map((product) => product.id)).toEqual([
      "prod-c1",
      "prod-c2",
      "prod-c3",
      "prod-c4",
      "prod-c5",
      "prod-c6",
    ]);
    expect(getProductScope("org-missing")).toBeUndefined();
  });

  it("assigns a destination immutably and keeps cash assignments inapplicable", () => {
    const updated = assignReceivingDestination(affiliationReceivings, "org-vertaco", "dest-2");
    const cashUpdated = assignReceivingDestination(updated, "org-trilheiras", "dest-2");

    expect(
      affiliationReceivings.find((receiving) => receiving.organizationId === "org-vertaco")
        ?.destinoId
    ).toBe("dest-1");
    expect(updated.find((receiving) => receiving.organizationId === "org-vertaco")?.destinoId).toBe(
      "dest-2"
    );
    expect(
      cashUpdated.find((receiving) => receiving.organizationId === "org-trilheiras")?.destinoId
    ).toBeNull();
  });

  it("counts destination usage from the current local assignments", () => {
    const updated = assignReceivingDestination(affiliationReceivings, "org-vertaco", "dest-2");

    expect(countDestinationUsage(updated)).toEqual({ "dest-1": 1, "dest-2": 1 });
  });

  it("tracks product requests in a new local state without mutating the fixture", () => {
    const initialState = createProductRequestState(affiliateOrgScopes);
    const updatedState = requestProduct(initialState, "req-v1");
    const request = affiliateOrgScopes[2]?.availableToRequest[0];

    expect(initialState.has("req-v1")).toBe(false);
    expect(updatedState.has("req-v1")).toBe(true);
    expect(request).toBeDefined();
    expect(request ? isProductRequested(request, updatedState) : false).toBe(true);
    expect(affiliateOrgScopes[2]?.availableToRequest[0]?.solicitado).toBeUndefined();
  });
});
