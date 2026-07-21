import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConfiguracoesPage } from "./ConfiguracoesPage";

afterEach(() => {
  cleanup();
});

function openDesktopSection(name: string) {
  const navigation = screen.getByRole("navigation");

  fireEvent.click(within(navigation).getByRole("button", { name }));

  const desktopContent = navigation.parentElement?.querySelector("main");
  if (!(desktopContent instanceof HTMLElement)) {
    throw new Error("Expected the desktop settings content to render");
  }

  return within(desktopContent);
}

describe("ConfiguracoesPage", () => {
  it("shows the configured receiving types and keeps cash without a destination action", () => {
    // Given
    render(<ConfiguracoesPage />);

    // When
    const receivingSection = openDesktopSection("Formas de recebimento");

    // Then
    expect(receivingSection.getByText("Split de pagamento")).toBeInTheDocument();
    expect(receivingSection.getByText("Transferência bancária")).toBeInTheDocument();
    expect(receivingSection.getByText("Dinheiro")).toBeInTheDocument();
    expect(receivingSection.getByText("Não se aplica")).toBeInTheDocument();
    expect(receivingSection.getAllByRole("button", { name: "Alterar destino" })).toHaveLength(2);

    const cashOrganization = receivingSection.getByText("Trilheiras de Brasília");
    const cashRow = cashOrganization.parentElement?.parentElement;
    if (!(cashRow instanceof HTMLElement)) {
      throw new Error("Expected the cash organization row to render");
    }

    expect(within(cashRow).queryByRole("button", { name: "Alterar destino" })).toBeNull();
  });

  it("reassigns a non-cash organization and updates destination usage counts", () => {
    // Given
    render(<ConfiguracoesPage />);
    const receivingSection = openDesktopSection("Formas de recebimento");

    expect(receivingSection.getByText("Em uso por 2 organizações")).toBeInTheDocument();

    // When
    const changeDestinationButton = receivingSection
      .getAllByRole("button", { name: "Alterar destino" })
      .at(0);
    if (!(changeDestinationButton instanceof HTMLElement)) {
      throw new Error("Expected a non-cash destination action to render");
    }

    fireEvent.click(changeDestinationButton);

    const receivingType = screen.getByLabelText("Forma de recebimento");
    expect(receivingType).toBeDisabled();
    expect(receivingType).toHaveValue("Split de pagamento");

    fireEvent.click(screen.getByRole("radio", { name: /Conta da empresa/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar alteração" }));

    // Then
    expect(receivingSection.getByText("Conta da empresa - Nubank *****-3")).toBeInTheDocument();
    expect(receivingSection.getAllByText("Em uso por 1 organização")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Destino de Cerrado Experience atualizado para Conta da empresa."
    );
  });

  it("blocks removal of a destination while organizations use it", () => {
    // Given
    render(<ConfiguracoesPage />);
    const receivingSection = openDesktopSection("Formas de recebimento");
    const destinationCard = receivingSection
      .getByText("Conta principal")
      .closest('[data-slot="card"]');
    if (!(destinationCard instanceof HTMLElement)) {
      throw new Error("Expected the receiving destination card to render");
    }

    // When
    fireEvent.pointerDown(
      within(destinationCard).getByRole("button", { name: "Ações de Conta principal" }),
      { button: 0, ctrlKey: false }
    );

    // Then
    expect(screen.getByRole("menuitem", { name: "Excluir: destino em uso" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("uses affiliation terminology and only exposes the confirmed status taxonomy", () => {
    // Given
    render(<ConfiguracoesPage />);

    // When
    const affiliationsSection = openDesktopSection("Minhas afiliações");

    // Then
    expect(
      affiliationsSection.getByText("Afiliações da sua conta por organização")
    ).toBeInTheDocument();
    expect(affiliationsSection.getAllByText("Ativo")).toHaveLength(4);

    const statusCoverage = affiliationsSection.getByRole("list", {
      name: "Status de afiliação",
    });
    const statusLabels = ["Ativo", "Inativo", "Desativado"];

    for (const statusLabel of statusLabels) {
      expect(within(statusCoverage).getByText(statusLabel)).toBeInTheDocument();
    }

    expect(
      Array.from(statusCoverage.querySelectorAll("[data-status]"), (status) =>
        status.getAttribute("data-status")
      )
    ).toEqual(statusLabels);
    expect(affiliationsSection.queryByText(/pendente/i)).not.toBeInTheDocument();
  });

  it("does not expose the unresolved organization invitation preference", () => {
    // Given
    render(<ConfiguracoesPage />);

    // When
    const notificationsSection = openDesktopSection("Notificações");

    // Then
    expect(notificationsSection.getAllByRole("switch")).toHaveLength(2);
    expect(notificationsSection.queryByText(/convite/i)).not.toBeInTheDocument();
  });
});
