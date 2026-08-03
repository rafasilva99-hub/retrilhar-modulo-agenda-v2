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
  it("renders the AFI-02 list with KPIs, badges and pagination", () => {
    render(<GestorAfiliadosPage section="afiliados" />);

    expect(screen.getByRole("heading", { name: "Lista de afiliados" })).toBeInTheDocument();
    expect(screen.getByText("Total de afiliados")).toBeInTheDocument();
    expect(screen.getByText("ANA-2201")).toBeInTheDocument();
    expect(screen.getAllByText("Filiação ativa").length).toBeGreaterThan(0);
    expect(screen.getByText("Nenhum afiliado selecionado.")).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 2/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getByText("Maria Eduarda Costa")).toBeInTheDocument();
    expect(screen.getByText("Convite enviado")).toBeInTheDocument();
  });

  it("pauses and resumes a filiação from the row menu with distinct toasts", () => {
    render(<GestorAfiliadosPage section="afiliados" />);

    openMenu(/Ações de Isabelly Beatriz Lopes/);
    fireEvent.click(screen.getByRole("menuitem", { name: /Filiação ativa/ }));
    expect(screen.getAllByText("Filiação pausada").length).toBeGreaterThan(0);

    openMenu(/Ações de Isabelly Beatriz Lopes/);
    fireEvent.click(screen.getByRole("menuitem", { name: /Filiação pausada/ }));
    expect(screen.getAllByText("Filiação ativa").length).toBeGreaterThan(0);
  });

  it("gates deactivation by profile and requires a motivo before confirming", () => {
    render(<GestorAfiliadosPage section="afiliados" />);

    openMenu(/Ações de Ana Paula Silva/);
    fireEvent.click(screen.getByRole("menuitem", { name: "Desativar filiação" }));
    expect(screen.getByRole("heading", { name: "Desativar filiação" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desativar filiação" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    fireEvent.click(screen.getByRole("button", { name: "Gestor de afiliados" }));
    openMenu(/Ações de Ana Paula Silva/);
    expect(screen.queryByRole("menuitem", { name: "Desativar filiação" })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Solicitar desativação" })).toBeInTheDocument();
  });

  it("renders the AFI-03 ficha and its desativada variant as read only", () => {
    render(<GestorAfiliadosPage section="ficha" />);

    expect(screen.getByRole("heading", { name: "Detalhes do afiliado" })).toBeInTheDocument();
    expect(screen.getAllByText("Ana Paula Silva").length).toBeGreaterThan(0);
    expect(screen.getByText("Vendas realizadas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Vincular produto/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Desativada" }));
    expect(screen.getByRole("button", { name: "Reativar filiação" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Vincular produto/ })).not.toBeInTheDocument();
    expect(screen.getByText("Filiação desativada")).toBeInTheDocument();
    expect(screen.getAllByText("No último mês da filiação").length).toBeGreaterThan(0);
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

    const nomeInput = screen.getByRole("textbox", { name: "Nome do afiliado (a)" });
    fireEvent.focus(nomeInput);
    expect(nomeInput).toHaveValue("Mariana Duarte");

    const emailInput = screen.getByRole("textbox", { name: "E-mail do afiliado (a)" });
    fireEvent.focus(emailInput);
    expect(emailInput).toHaveValue("mariana.duarte@gmail.com");

    const valorInput = screen.getByRole("textbox", { name: "Valor da comissão" });
    fireEvent.focus(valorInput);
    expect(valorInput).toHaveValue("12%");

    // O envio só é liberado após a definição dos produtos do convite.
    expect(screen.getByRole("button", { name: /Enviar convite/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Produtos selecionados/ }));
    expect(screen.getByRole("button", { name: /Produtos selecionados/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Enviar convite/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: /Selecionar Trilha Pico do Itambé/ }));

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

    expect(screen.getByRole("heading", { name: "Pendências" })).toBeInTheDocument();
    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.getByText(/^Ontem, /)).toBeInTheDocument();
    expect(screen.getAllByText("Solicitação de afiliação à sua organização")).toHaveLength(3);
    expect(screen.getAllByText(/Solicitação de afiliação em/).length).toBeGreaterThan(3);
  });

  it("filters and searches solicitações in the central de filiação", () => {
    render(<GestorAfiliadosPage section="central" />);

    fireEvent.click(screen.getByRole("button", { name: /Não visualizadas/ }));
    expect(screen.queryByText(/Rapel Cachoeira do Tabuleiro/)).not.toBeInTheDocument();
    expect(screen.getAllByText("Solicitação de afiliação à sua organização")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Propostas aceitas" }));
    expect(
      screen.queryByText("Solicitação de afiliação à sua organização")
    ).not.toBeInTheDocument();
    expect(screen.getAllByText(/Trilha Pico do Itambé/)).toHaveLength(2);

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

  it("opens the avaliar proposta drawer from a pendência", () => {
    render(<GestorAfiliadosPage section="central" />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Abrir pendência de Ana Beatriz Campos" })[0]!
    );

    expect(screen.getByRole("heading", { name: "Avaliar proposta" })).toBeInTheDocument();
    expect(screen.getByText("Termos de uso de afiliado")).toBeInTheDocument();
    expect(screen.getByText("Comissão solicitada pelo afiliado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Aprovar e definir comissão/ })).toBeInTheDocument();
  });

  it("asks for a justification before refusing a proposta", () => {
    render(<GestorAfiliadosPage section="central" />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Abrir pendência de Ana Beatriz Campos" })[0]!
    );
    fireEvent.click(screen.getByRole("button", { name: /Recusar proposta/ }));

    expect(screen.getByRole("heading", { name: "Recusar proposta" })).toBeInTheDocument();
    expect(screen.getByText("Motivo da recusa (visível para o afiliado)")).toBeInTheDocument();

    // Sem descrição a confirmação fica bloqueada; o foco preenche a sugestão.
    expect(screen.getByRole("button", { name: "Confirmar recusa" })).toBeDisabled();
    const descricaoInput = screen.getByRole("textbox", { name: "Descreva a razão da recusa" });
    fireEvent.focus(descricaoInput);
    expect(descricaoInput).toHaveValue(
      "A comissão solicitada consome quase toda a margem deste produto. Conseguimos aprovar com um percentual menor."
    );
    expect(screen.getByRole("button", { name: "Confirmar recusa" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar recusa" }));
    expect(screen.queryByRole("heading", { name: "Recusar proposta" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Avaliar proposta" })).not.toBeInTheDocument();
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
