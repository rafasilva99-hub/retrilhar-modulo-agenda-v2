import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { IndicacoesPage } from "./IndicacoesPage";

describe("IndicacoesPage", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: () => undefined,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("filters a customer, exposes tab counts, and opens the cart detail", () => {
    render(<IndicacoesPage />);

    expect(screen.getByRole("tab", { name: /Todas\s*15/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Pagas\s*7/ })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Pesquisar indicações" }), {
      target: { value: "Juliana" },
    });

    expect(screen.getAllByText("Juliana Aparecida de Lima")).toHaveLength(2);
    expect(screen.queryByText("João Pedro da Silva Oliveira")).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Pagas\s*1/ }), {
      button: 0,
      ctrlKey: false,
    });

    expect(screen.getByRole("tab", { name: /Pagas\s*1/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByText("Juliana Aparecida de Lima")).toHaveLength(2);
  });

  it("filters displayed referral rows by period alone", () => {
    render(<IndicacoesPage />);

    expect(screen.getAllByText("Pedro Henrique Barbosa Costa")).toHaveLength(2);

    fireEvent.click(screen.getByRole("combobox", { name: "Período" }));
    fireEvent.click(screen.getByRole("option", { name: "Este mês" }));

    expect(screen.getAllByText("João Pedro da Silva Oliveira")).toHaveLength(2);
    expect(screen.queryAllByText("Pedro Henrique Barbosa Costa")).toHaveLength(0);
    expect(screen.getByRole("tab", { name: /Todas\s*10/ })).toBeInTheDocument();
  });

  it("opens a referral detail with every cart item and renders the empty state", () => {
    render(<IndicacoesPage />);

    fireEvent.click(screen.getByRole("row", { name: /João Pedro da Silva Oliveira/ }));

    expect(screen.getByRole("heading", { name: "Detalhe da indicação" })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveTextContent("Rapel Cachoeira");
    expect(screen.getByRole("dialog")).toHaveTextContent("Tirolesa Radical");

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Pesquisar indicações" }), {
      target: { value: "zzzz-sem-resultado" },
    });

    expect(screen.getByText("Nenhuma indicação encontrada")).toBeInTheDocument();
  });

  it("keeps order and commission semantics in the abandoned tab", () => {
    render(<IndicacoesPage />);

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Carrinhos abandonados\s*3/ }), {
      button: 0,
      ctrlKey: false,
    });

    expect(screen.getByRole("tab", { name: /Carrinhos abandonados\s*3/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getAllByText("Abandonado")).toHaveLength(6);
    expect(screen.getAllByText("Não gerada")).toHaveLength(6);
    expect(screen.getAllByText("R$ 0,00")).toHaveLength(6);
  });
});
