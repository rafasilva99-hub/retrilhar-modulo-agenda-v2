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
    render(<GestorAfiliadosPage section="afiliados" />);

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

  it("renders the AFI-01 home with KPIs and an enabled invite CTA", () => {
    render(<GestorAfiliadosPage section="visao" />);

    expect(screen.getByRole("heading", { name: "Visão geral" })).toBeInTheDocument();
    expect(screen.getByText("Total de vendas dos afiliados")).toBeInTheDocument();
    expect(screen.getByText("Valor das comissões")).toBeInTheDocument();
    expect(screen.getByText("Afiliados ativos na plataforma")).toBeInTheDocument();
    expect(document.body.textContent).toContain("675.274,67");
    expect(screen.getByRole("button", { name: /Convidar afiliado/ })).toBeEnabled();
  });

  it("sends an affiliate invite through the AFI-01.b drawer", () => {
    render(<GestorAfiliadosPage section="visao" />);

    fireEvent.click(screen.getByRole("button", { name: /Convidar afiliado/ }));
    expect(screen.getByRole("heading", { name: "Convidar afiliado" })).toBeInTheDocument();
    expect(screen.getByText("Todos os produtos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar convite/ })).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox", { name: "Nome do afiliado (a)" }), {
      target: { value: "Paula Costa" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "E-mail do afiliado (a)" }), {
      target: { value: "paula@exemplo.com.br" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Produtos selecionados/ }));
    expect(screen.getByRole("button", { name: /Produtos selecionados/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const enviarButton = screen.getByRole("button", { name: /Enviar convite/ });
    expect(enviarButton).toBeEnabled();
    fireEvent.click(enviarButton);

    expect(screen.queryByRole("heading", { name: "Convidar afiliado" })).not.toBeInTheDocument();
  });

  it("filters pendências between solicitações and propostas", () => {
    render(<GestorAfiliadosPage section="visao" />);

    expect(screen.getAllByText("Solicitação de afiliação à sua organização")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: /Propostas/ }));
    expect(screen.getAllByText("Solicitação de afiliação à sua organização")).toHaveLength(3);
    expect(screen.queryByText(/Solicitação de afiliação em/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Solicitações/ }));
    expect(
      screen.queryByText("Solicitação de afiliação à sua organização")
    ).not.toBeInTheDocument();
    expect(screen.getAllByText(/Solicitação de afiliação em/).length).toBeGreaterThan(0);
  });

  it("switches the AFI-01 system states through the demo scenarios", () => {
    render(<GestorAfiliadosPage section="visao" />);

    fireEvent.click(screen.getByRole("button", { name: "Sem pendências" }));
    expect(screen.getByText("Nenhuma pendência no momento")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sem vendas" }));
    expect(screen.getByText("Nenhuma venda registrada")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Carregando" }));
    expect(screen.queryByText("Total de vendas dos afiliados")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Padrão" }));
    expect(screen.getByText("Total de vendas dos afiliados")).toBeInTheDocument();
  });

  it("opens and closes the sale detail drawer from the sales table", () => {
    render(<GestorAfiliadosPage section="visao" />);

    fireEvent.click(screen.getByRole("button", { name: "Ver detalhes da venda RE-8838" }));

    expect(screen.getByRole("heading", { name: "Detalhes da venda" })).toBeInTheDocument();
    expect(screen.getByText("Trilheiras de Brasília")).toBeInTheDocument();
    expect(screen.getByText("Comissão disponível para saque")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar aba" }));
    expect(screen.queryByRole("heading", { name: "Detalhes da venda" })).not.toBeInTheDocument();
  });

  it("expands an order item card to reveal its tariffs", () => {
    render(<GestorAfiliadosPage section="visao" />);

    fireEvent.click(screen.getByRole("button", { name: "Ver detalhes da venda RE-8838" }));
    expect(
      screen.queryByText("Adulto Meia-Entrada Estudante com Transporte")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver tarifas de Chapada das Mesas" }));

    expect(screen.getByText("Adulto Meia-Entrada Estudante com Transporte")).toBeInTheDocument();
    expect(screen.getAllByText("Valor unitário")).toHaveLength(3);
    expect(screen.getByText("2 unidade(s)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver tarifas de Chapada das Mesas" }));
    expect(
      screen.queryByText("Adulto Meia-Entrada Estudante com Transporte")
    ).not.toBeInTheDocument();
  });

  it("renders the central de filiação grouped by day", () => {
    render(<GestorAfiliadosPage section="central" />);

    expect(screen.getByRole("heading", { name: "Central de filiação" })).toBeInTheDocument();
    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.getByText(/^Ontem, /)).toBeInTheDocument();
    expect(screen.getAllByText("Solicitação de afiliação à sua organização")).toHaveLength(3);
    expect(screen.getAllByText(/Solicitação de afiliação em/).length).toBeGreaterThan(3);
  });

  it("filters and searches solicitações in the central de filiação", () => {
    render(<GestorAfiliadosPage section="central" />);

    fireEvent.click(screen.getByRole("button", { name: /^Propostas/ }));
    expect(screen.queryByText(/Solicitação de afiliação em/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Todas/ }));
    fireEvent.change(screen.getByRole("textbox", { name: "Pesquisar pendências" }), {
      target: { value: "Cavalgada" },
    });
    expect(screen.getAllByText(/Cavalgada ao pôr do sol/).length).toBeGreaterThan(0);
    expect(
      screen.queryByText("Solicitação de afiliação à sua organização")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Pesquisar pendências" }), {
      target: { value: "termo sem resultado algum" },
    });
    expect(screen.getByText("Nenhum resultado para a busca")).toBeInTheDocument();
  });

  it("switches the central de filiação system states", () => {
    render(<GestorAfiliadosPage section="central" />);

    fireEvent.click(screen.getByRole("button", { name: "Sem pendências" }));
    expect(screen.getByText("Nenhuma pendência no momento")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Carregando" }));
    expect(screen.queryByText("Hoje")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Padrão" }));
    expect(screen.getByText("Hoje")).toBeInTheDocument();
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
