import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CommissionStatusBadge } from "./components";
import { GanhosPage } from "./GanhosPage";

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: () => undefined,
  });
});

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/");
});

describe("GanhosPage", () => {
  it("renders the earnings ledger with the existing commission fixture", () => {
    render(<GanhosPage />);

    expect(screen.getByRole("heading", { name: "Ganhos" })).toBeInTheDocument();
    expect(screen.getByText("João Pedro da Silva Oliveira")).toBeInTheDocument();
    expect(screen.getByText("R$ 568,00")).toBeInTheDocument();
  });

  it("filters the ledger by organization and status tab", () => {
    render(<GanhosPage />);

    fireEvent.click(screen.getByRole("combobox", { name: "Organização" }));
    fireEvent.click(screen.getByRole("option", { name: "Vertaco Aventuras" }));
    fireEvent.click(screen.getByRole("tab", { name: /Quitadas/ }));

    expect(screen.getByText("Amanda Cristina Miranda Souza")).toBeInTheDocument();
    expect(screen.queryByText("Maria Eduarda Santos Pereira")).not.toBeInTheDocument();
    expect(screen.getByText("Quitada")).toBeInTheDocument();
  });

  it("filters displayed commission rows by period alone", () => {
    render(<GanhosPage />);

    expect(screen.queryByText("Pedro Henrique Barbosa Costa")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox", { name: "Período" }));
    fireEvent.click(screen.getByRole("option", { name: "Ano" }));

    expect(screen.getByText("João Pedro da Silva Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Pedro Henrique Barbosa Costa")).toBeInTheDocument();
  });

  it("opens a commission detail and returns to the related indication", () => {
    render(<GanhosPage />);

    fireEvent.click(screen.getByRole("button", { name: /João Pedro da Silva Oliveira/ }));

    expect(screen.getByRole("heading", { name: "Detalhe da comissão" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Ver indicação relacionada/ }));

    expect(window.location.hash).toBe("#indicacoes");
  });

  it("keeps each commission status semantically visible", () => {
    render(
      <>
        <CommissionStatusBadge status="nao-gerada" />
        <CommissionStatusBadge status="a-receber" />
        <CommissionStatusBadge status="quitada" />
      </>
    );

    expect(screen.getByText("Não gerada")).toBeInTheDocument();
    expect(screen.getByText("A receber")).toBeInTheDocument();
    expect(screen.getByText("Quitada")).toBeInTheDocument();
  });

  it("shows an empty state when the ledger search has no matches", () => {
    render(<GanhosPage />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar no extrato" }), {
      target: { value: "produto-inexistente" },
    });

    expect(
      screen.getByRole("heading", { name: "Nenhuma comissão encontrada" })
    ).toBeInTheDocument();
  });
});
