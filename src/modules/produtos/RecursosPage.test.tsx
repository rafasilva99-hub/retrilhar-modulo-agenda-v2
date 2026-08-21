import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecursosPage } from "./RecursosPage";

function openMenu(trigger: HTMLElement) {
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
}

describe("RecursosPage", () => {
  it("creates and deletes organization resources", async () => {
    render(<RecursosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo recurso" }));

    const dialog = screen.getByRole("dialog", { name: "Novo recurso" });
    fireEvent.change(within(dialog).getByLabelText("Nome do recurso"), {
      target: { value: "Bastão de caminhada" },
    });
    fireEvent.change(within(dialog).getByLabelText("Unidade"), {
      target: { value: "par" },
    });
    fireEvent.change(within(dialog).getByLabelText("Custo (R$)"), {
      target: { value: "14,50" },
    });
    fireEvent.change(within(dialog).getByLabelText("Estoque"), {
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
