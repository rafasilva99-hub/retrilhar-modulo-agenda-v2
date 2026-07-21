import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AffiliateEmptyState,
  AffiliateLinkCard,
  AffiliateStatCard,
  AffiliateStatusBadge,
  CommissionStatusBadge,
  CopyButton,
  OrderStatusBadge,
  OrganizationFilter,
  SectionHeading,
} from ".";

describe("affiliate shared primitives", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the shared section, stat, status, filter, empty, and link surfaces", () => {
    render(
      <>
        <SectionHeading title="Resumo" description="Indicadores do período" />
        <AffiliateStatCard title="Comissão recebida" value="R$ 568,00" detail="Este mês" />
        <AffiliateStatusBadge status="Ativo" />
        <CommissionStatusBadge status="a-receber" />
        <OrderStatusBadge status="Pago" />
        <OrganizationFilter
          organizations={[{ id: "org-cerrado", name: "Cerrado Experience" }]}
          value="all"
          onValueChange={vi.fn()}
        />
        <AffiliateEmptyState
          title="Nenhuma indicação encontrada"
          description="Compartilhe seu link para começar."
        />
        <AffiliateLinkCard
          title="Links do afiliado"
          description="Acesse seus links compartilháveis"
          links={[
            {
              id: "global",
              label: "Link geral",
              value: "https://retrilhar.com.br/ref/katiely-pinheiro",
            },
          ]}
        />
      </>
    );

    expect(screen.getByRole("heading", { name: "Resumo" })).toBeInTheDocument();
    expect(screen.getByText("R$ 568,00")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("A receber")).toBeInTheDocument();
    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Organização" })).toBeInTheDocument();
    expect(screen.getByText("Nenhuma indicação encontrada")).toBeInTheDocument();
    expect(screen.getByText("https://retrilhar.com.br/ref/katiely-pinheiro")).toBeInTheDocument();
    expect(screen.getByText("Link geral").tagName).toBe("DT");
  });

  it("shows copied feedback when the browser clipboard resolves", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<CopyButton value="KAT-2931" copyLabel="Copiar código" />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("KAT-2931");
      expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
    });
  });
});
