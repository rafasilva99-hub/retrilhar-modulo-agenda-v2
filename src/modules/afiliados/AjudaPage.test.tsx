import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AjudaPage } from "./AjudaPage";

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/");
});

describe("AjudaPage", () => {
  it("filters the FAQ with a matching search term and expands the result", () => {
    render(<AjudaPage />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar nas dúvidas frequentes" }), {
      target: { value: "comissões" },
    });

    const question = screen.getByRole("button", { name: "Quando recebo minhas comissões?" });
    expect(question).toBeInTheDocument();

    fireEvent.click(question);

    expect(
      screen.getByText(/O prazo de pagamento das comissões varia conforme a forma de recebimento/)
    ).toBeInTheDocument();
  });

  it("uses afiliação terminology in FAQ answers", () => {
    render(<AjudaPage />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar nas dúvidas frequentes" }), {
      target: { value: "múltiplas organizações" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Posso me afiliar a mais de uma organização?" })
    );

    expect(screen.getByText(/manter afiliações com múltiplas organizações/)).toBeInTheDocument();
    expect(screen.queryByText(/vínculo/i)).not.toBeInTheDocument();
  });

  it("sanitizes every legacy relationship term in the link-expiration answer", () => {
    // Given
    render(<AjudaPage />);

    // When
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar nas dúvidas frequentes" }), {
      target: { value: "link expirar" },
    });
    fireEvent.click(screen.getByRole("button", { name: "O que acontece se meu link expirar?" }));

    // Then
    expect(screen.getByText(/sua afiliação com a organização estiver ativa/)).toBeInTheDocument();
    expect(screen.getByText(/Caso a afiliação seja encerrada/)).toBeInTheDocument();
    expect(screen.queryByText(/vínculo/i)).not.toBeInTheDocument();
  });

  it("shows a dedicated empty state when the FAQ has no match", () => {
    render(<AjudaPage />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar nas dúvidas frequentes" }), {
      target: { value: "semresultadozz" },
    });

    expect(
      screen.getByRole("heading", { name: "Nenhum resultado encontrado" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tente buscar por outro termo ou consulte uma categoria.")
    ).toBeInTheDocument();
  });

  it("returns to the affiliate panel from both close controls", () => {
    window.history.replaceState(null, "", "#ajuda");
    render(<AjudaPage />);

    fireEvent.click(screen.getByRole("button", { name: "Voltar para Afiliados" }));
    expect(window.location.hash).toBe("#afiliados");

    window.history.replaceState(null, "", "#ajuda");
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(window.location.hash).toBe("#afiliados");
  });
});
