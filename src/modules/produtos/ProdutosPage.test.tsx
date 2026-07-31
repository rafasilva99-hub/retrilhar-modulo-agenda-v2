import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProdutosPage } from "./ProdutosPage";

function getProductEditorButton(name: string): HTMLElement {
  const button = screen.getByText(name).closest("button");
  if (!button) throw new Error(`Botão de edição não encontrado para ${name}`);
  return button;
}

afterEach(() => {
  cleanup();
});

describe("ProdutosPage", () => {
  it("configures product communication messages locally", () => {
    render(<ProdutosPage />);

    fireEvent.click(getProductEditorButton("Trilha Pico do Itacolomi"));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    expect(screen.getByRole("heading", { name: "Mensagens automáticas" })).toBeInTheDocument();
    expect(screen.queryByText("Em desenvolvimento")).not.toBeInTheDocument();

    const smsButton = screen.getByRole("button", { name: "SMS" });
    expect(smsButton).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(smsButton);
    expect(smsButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(screen.getByLabelText("Horas antes para lembrete pré-evento"), {
      target: { value: "48" },
    });
    fireEvent.change(screen.getByLabelText("Horas antes para reforço no dia"), {
      target: { value: "6" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Escreva a mensagem enviada antes da experiência"),
      {
        target: { value: "Chegue 30 minutos antes para conferência do grupo." },
      }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Informe documentos, itens recomendados e ponto de encontro"),
      {
        target: { value: "Leve documento com foto, água e calçado fechado." },
      }
    );

    expect(screen.getByText("E-mail, WhatsApp, SMS")).toBeInTheDocument();
    expect(screen.getByText("Pré-evento configurado")).toBeInTheDocument();
    expect(screen.getAllByText("Leve documento com foto, água e calçado fechado.")).toHaveLength(2);
    expect(screen.getAllByText("Chegue 30 minutos antes para conferência do grupo.")).toHaveLength(
      2
    );
  });
});
