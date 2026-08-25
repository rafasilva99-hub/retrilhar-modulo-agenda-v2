import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RecursosPage } from "./RecursosPage";

function openMenu(trigger: HTMLElement) {
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
}

afterEach(() => {
  cleanup();
});

describe("RecursosPage", () => {
  it("renders the resources catalog layout from the product area", () => {
    render(<RecursosPage />);

    expect(screen.getByRole("heading", { name: "Recursos" })).toBeInTheDocument();
    expect(
      screen.getByText("Gerencie seu catálogo de atividades, experiências e pacotes.")
    ).toBeInTheDocument();
    expect(screen.getByText("Total de itens")).toBeInTheDocument();
    expect(screen.getByText("Catálogo completo")).toBeInTheDocument();
    expect(screen.getByText("Recursos disponíveis")).toBeInTheDocument();
    expect(screen.getByText("Recursos desativados")).toBeInTheDocument();

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Cobrança")).toBeInTheDocument();
    expect(screen.getByText("Preço")).toBeInTheDocument();
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Vínculos")).toBeInTheDocument();
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Almoço na pousada" }).parentElement).toHaveClass(
      "h-[61px]"
    );
    expect(
      screen.queryByText("Refeição completa servida no encerramento da atividade.")
    ).not.toBeInTheDocument();
  });

  it("selects resources and filters by status", () => {
    render(<RecursosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Selecionar Alimentação" }));

    expect(screen.getByText("1 recurso selecionado")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: "Filtrar recursos por status" }), {
      target: { value: "Inativo" },
    });

    expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
    expect(screen.queryByText("Almoço na pousada")).not.toBeInTheDocument();
    expect(screen.getByText("Kit primeiros socorros")).toBeInTheDocument();
  });

  it("creates and deletes product resources", async () => {
    render(<RecursosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo recurso" }));

    const dialog = screen.getByRole("dialog", { name: "Novo recurso" });
    fireEvent.change(within(dialog).getByLabelText("Nome do recurso"), {
      target: { value: "Bastão de caminhada" },
    });
    fireEvent.change(within(dialog).getByLabelText("Cobrança"), {
      target: { value: "Por pessoa" },
    });
    fireEvent.change(within(dialog).getByLabelText("Preço (R$)"), {
      target: { value: "14,50" },
    });
    fireEvent.change(within(dialog).getByLabelText("Quantidade"), {
      target: { value: "24" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Novo recurso" })).not.toBeInTheDocument();
      expect(screen.getByText("Bastão de caminhada")).toBeInTheDocument();
    });

    openMenu(screen.getByRole("button", { name: "Ações de Bastão de caminhada" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Excluir recurso" }));

    await waitFor(() => {
      expect(screen.queryByText("Bastão de caminhada")).not.toBeInTheDocument();
    });
  });
});
