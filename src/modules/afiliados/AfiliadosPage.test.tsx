import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AfiliadosPage } from "./AfiliadosPage";

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/");
});

describe("AfiliadosPage", () => {
  it("keeps KPI filters, code copy feedback, and affiliate navigation available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });

    render(<AfiliadosPage />);

    expect(screen.getByRole("heading", { name: /Oi Katiely/ })).toBeInTheDocument();
    expect(screen.getByText("145")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ganhos" })).toHaveAttribute("href", "#ganhos");
    expect(screen.getByRole("link", { name: "Configurações" })).toHaveAttribute(
      "href",
      "#configuracoes"
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Período" }));
    fireEvent.click(screen.getByRole("option", { name: "Últimos 12 meses" }));
    fireEvent.click(screen.getByRole("combobox", { name: "Organização" }));
    fireEvent.click(screen.getByRole("option", { name: "Vertaco Aventuras" }));

    expect(screen.getByText("R$ 29.480")).toBeInTheDocument();
    expect(screen.getByText("Maria Eduarda Santos Pereira")).toBeInTheDocument();
    expect(screen.queryByText("João Pedro da Silva Oliveira")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copiar" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("KAT-2931");
      expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
    });
  });

  it("opens the first referral cart detail, closes it, and renders the empty state", async () => {
    render(<AfiliadosPage />);

    fireEvent.click(screen.getByRole("row", { name: /João Pedro da Silva Oliveira/ }));

    expect(screen.getByRole("heading", { name: "Detalhe da indicação" })).toBeInTheDocument();
    expect(screen.getByText("Rapel Cachoeira")).toBeInTheDocument();
    expect(screen.getByText("Tirolesa Radical")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar aba" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Detalhe da indicação" })
      ).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("searchbox", { name: "Pesquisar indicações" }), {
      target: { value: "sem-resultado" },
    });

    expect(
      screen.getByRole("heading", { name: "Nenhuma indicação encontrada" })
    ).toBeInTheDocument();
    expect(screen.getByText("Passo a Passo")).toBeInTheDocument();
  });
});
