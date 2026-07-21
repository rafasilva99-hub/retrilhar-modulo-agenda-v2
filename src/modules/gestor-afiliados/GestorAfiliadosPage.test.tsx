import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { GestorAfiliadosPage } from "./GestorAfiliadosPage";

function openMenu(triggerName: RegExp) {
  fireEvent.pointerDown(screen.getByRole("button", { name: triggerName }), {
    button: 0,
    ctrlKey: false,
  });
}

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

describe("GestorAfiliadosPage", () => {
  it("opens the registration dialog and records a local prepared state", () => {
    render(<GestorAfiliadosPage section="visao" />);

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    expect(screen.getByRole("heading", { name: "Cadastrar afiliado" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Nome" }), {
      target: { value: "Paula Costa" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preparar cadastro" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Paula Costa foi preparado para cadastro de afiliação."
    );
  });

  it("opens the affiliate sheet and records menu actions locally", () => {
    render(<GestorAfiliadosPage section="afiliados" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Ana Beatriz Ramos/ })[0]!);

    expect(screen.getByRole("heading", { name: "Ana Beatriz Ramos" })).toBeInTheDocument();
    expect(screen.getByText("Ficha da afiliação nesta organização")).toBeInTheDocument();
    expect(screen.queryByText("Cerrado Experience")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    openMenu(/Ações de Ana Beatriz Ramos/);
    fireEvent.click(screen.getByRole("menuitem", { name: "Editar afiliação" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Edição de afiliação preparada para Ana Beatriz Ramos."
    );
  });

  it("records product request decisions locally", () => {
    render(<GestorAfiliadosPage section="solicitacoes" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Recusar" })[0]!);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Solicitação de Rapel Cachoeira recusada para Rafael Duarte."
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Aprovar" })[0]!);
    expect(screen.getByRole("heading", { name: "Aprovar solicitação" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Solicitação de Rapel Cachoeira aprovada para Rafael Duarte."
    );
  });

  it("records proposal and payment confirmations locally", () => {
    const { rerender } = render(<GestorAfiliadosPage section="propostas" />);

    fireEvent.click(screen.getByRole("button", { name: "Contrapropor" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Contrapropor registrada no histórico da negociação."
    );

    rerender(<GestorAfiliadosPage section="pagamentos" />);
    fireEvent.click(screen.getByRole("button", { name: "Registrar pagamento" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar pagamento" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Pagamento de R$ 1.120,00 registrado para Ana Beatriz Ramos."
    );
  });
});
