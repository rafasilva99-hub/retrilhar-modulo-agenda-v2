import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProdutosLinksPage } from "./ProdutosLinksPage";

Element.prototype.scrollIntoView = vi.fn();

function installClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

function selectOrganization(name: string) {
  fireEvent.click(screen.getByRole("combobox", { name: "Organização" }));
  fireEvent.click(screen.getByRole("option", { name }));
}

function getProductCard(name: string): HTMLElement {
  const card = screen.getByText(name).closest<HTMLElement>('[data-slot="card"]');
  if (!card) throw new Error(`Card não encontrado para ${name}`);
  return card;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: undefined,
  });
  window.history.replaceState(null, "", "/");
});

describe("ProdutosLinksPage", () => {
  it("exposes the three link levels and the organization drilldown", () => {
    render(<ProdutosLinksPage />);

    expect(screen.getByText("Link geral (nível 1)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver links por organização" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você pode vender todos os produtos desta organização. Novos produtos entram automaticamente."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver links por organização" }));

    expect(screen.getByRole("heading", { name: "Links por organização" })).toBeInTheDocument();
    expect(screen.getByText(/Link da organização \(nível 2\)/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Ver produtos e links de Trilheiras de Brasília" })
    );

    expect(
      screen.getByText(/Esta afiliação inclui apenas produtos específicos/)
    ).toBeInTheDocument();
    expect(screen.getAllByText("Link do produto (nível 3)").length).toBeGreaterThan(0);
  });

  it("copies general, organization, and product links, then requests an available product", async () => {
    const writeText = installClipboard();
    render(<ProdutosLinksPage />);

    const generalCopy = screen.getAllByRole("button", { name: "Copiar" })[0];
    if (!generalCopy) throw new Error("Botão de cópia geral não encontrado");
    fireEvent.click(generalCopy);
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("https://retrilhar.com.br/ref/katiely-pinheiro");
      expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
    });

    selectOrganization("Trilheiras de Brasília");
    const organizationCard = screen
      .getByRole("heading", { name: "Link da organização (nível 2)" })
      .closest<HTMLElement>('[data-slot="card"]');
    if (!organizationCard) throw new Error("Card de organização não encontrado");
    const organizationCopy = within(organizationCard).getByRole("button", { name: "Copiar" });
    fireEvent.click(organizationCopy);
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras"
      );
      expect(organizationCopy).toHaveTextContent("Copiado");
    });

    const productCard = getProductCard("Passeio de Barco");
    const productCopy = within(productCard).getByRole("button", { name: "Copiar link do produto" });
    fireEvent.click(productCopy);
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "https://retrilhar.com.br/ref/katiely-pinheiro/trilheiras/passeio-barco"
      );
      expect(productCard).toHaveTextContent("Copiado");
    });

    const requestButton = screen.getByRole("button", { name: "Solicitar Boia Cross Radical" });
    fireEvent.click(requestButton);
    expect(screen.getAllByText("Solicitação enviada")).toHaveLength(2);
  });

  it("keeps an unavailable product copy control disabled", () => {
    const writeText = installClipboard();
    render(<ProdutosLinksPage />);
    selectOrganization("Cerrado Experience");

    const unavailableCard = getProductCard("Rafting Rio das Velhas");
    const unavailableCopy = within(unavailableCard).getByRole("button", { name: "Indisponível" });

    expect(unavailableCopy).toBeDisabled();
    fireEvent.click(unavailableCopy);
    expect(writeText).not.toHaveBeenCalledWith(
      "https://retrilhar.com.br/ref/katiely-pinheiro/cerrado/rafting-rio-velhas"
    );
    expect(unavailableCard).not.toHaveTextContent("Copiado");
  });
});
