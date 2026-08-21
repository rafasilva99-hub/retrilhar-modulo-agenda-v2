import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  countryOptions,
  getBrazilCitiesForState,
  parseBrazilCities,
  parseBrazilStates,
} from "./location-options";
import { ProdutosPage } from "./ProdutosPage";
import { getVirtualWindow } from "./virtual-list";

function getProductEditorButton(name: string): HTMLElement {
  const button = screen.getByText(name).closest("button");
  if (!button) throw new Error(`Botão de edição não encontrado para ${name}`);
  return button;
}

function openActionsMenu(name: string): void {
  fireEvent.pointerDown(screen.getByRole("button", { name: `Ações de ${name}` }), {
    button: 0,
    ctrlKey: false,
  });
}

function openScheduleActionsMenu(scheduleBlock: HTMLElement, name: string): void {
  fireEvent.pointerDown(within(scheduleBlock).getByRole("button", { name: `Ações de ${name}` }), {
    button: 0,
    ctrlKey: false,
  });
}

function getMenuItemIcon(name: string | RegExp): SVGSVGElement {
  const icon = screen.getByRole("menuitem", { name }).querySelector("svg");
  if (!icon) throw new Error(`Ícone não encontrado para ${String(name)}`);
  return icon;
}

function expectGhostButton(button: HTMLElement): void {
  expect(button.className).toContain("border-transparent");
  expect(button.className).toContain("bg-transparent");
  expect(button.className).toContain("hover:bg-[#f8fafc]");
  expect(button.className).not.toContain("px-3");
  expect(button.className).not.toContain("border-[#e9eaeb]");
  expect(button.className).not.toContain("bg-white");
}

function expectReadinessItemDone(label: string, done: boolean): void {
  const item = screen.getByRole("button", { name: label });

  const iconClass = item.querySelector("svg")?.getAttribute("class") ?? "";
  expect(iconClass).toContain(done ? "text-primary" : "text-[#d5d7da]");
}

function expectSummaryValue(label: string, value: string): void {
  const summaryCard = screen.getByText("Resumo").closest("div");
  if (!summaryCard) throw new Error("Resumo do produto não encontrado");

  const row = within(summaryCard).getByText(label).closest("div");
  if (!row) throw new Error(`Linha de resumo não encontrada: ${label}`);

  expect(within(row).getByText(value)).toBeInTheDocument();
}

function getInputByFieldLabel(label: string): HTMLInputElement {
  const field = screen.getByText(label).closest("label");
  const input = field?.querySelector("input");
  if (!input) throw new Error(`Input não encontrado para ${label}`);
  return input;
}

function getNewProductHeaderTitle(text: string): HTMLElement {
  const title = screen
    .getAllByText(text)
    .find((element) => element.tagName === "P" && element.className.includes("truncate"));
  if (!title) throw new Error(`Título do fluxo não encontrado: ${text}`);
  return title;
}

function getInputByDialogFieldLabel(dialog: HTMLElement, label: string): HTMLInputElement {
  const field = within(dialog).getByText(label).closest("label");
  const input = field?.querySelector("input");
  if (!input) throw new Error(`Input não encontrado para ${label}`);
  return input;
}

function mockLocationOptionsFetch(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      const body = url.includes("/estados")
        ? [
            { id: 52, sigla: "GO", nome: "Goiás" },
            { id: 35, sigla: "SP", nome: "São Paulo" },
          ]
        : [
            {
              id: 5219803,
              nome: "São Domingos",
              microrregiao: { mesorregiao: { UF: { sigla: "GO" } } },
            },
            {
              id: 3550308,
              nome: "São Paulo",
              microrregiao: { mesorregiao: { UF: { sigla: "SP" } } },
            },
          ];

      return Promise.resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    })
  );
}

class TestLocalStorage implements Storage {
  private readonly entries = new Map<string, string>();

  get length(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
  }

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.entries.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }
}

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: new TestLocalStorage(),
  });
});

afterEach(() => {
  cleanup();
  if (typeof window.localStorage.removeItem === "function") {
    window.localStorage.removeItem("retrilhar:produtos:new-product-form:v1");
    window.localStorage.removeItem("retrilhar:produtos:new-product-flow:v1");
  }
  vi.unstubAllGlobals();
});

describe("ProdutosPage", () => {
  it("configures product communication messages locally", () => {
    render(<ProdutosPage />);

    fireEvent.click(getProductEditorButton("Trilha Pico do Itacolomi"));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    expect(screen.getByRole("heading", { name: "Comunicação" })).toBeInTheDocument();
    expect(screen.queryByText("Em desenvolvimento")).not.toBeInTheDocument();

    const emailSwitch = screen.getByRole("switch", { name: "Habilitar envio de e-mail" });
    expect(emailSwitch).toHaveAttribute("aria-checked", "true");
    fireEvent.click(emailSwitch);
    expect(emailSwitch).toHaveAttribute("aria-checked", "false");

    expect(
      screen.getByRole("switch", { name: "Habilitar envio de mensagem via WhatsApp" })
    ).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByText("Template de e-mail")).not.toBeInTheDocument();
    expect(screen.getByText("Template de mensagem")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Central de Comunicação" })).toHaveLength(1);

    fireEvent.click(emailSwitch);
    expect(emailSwitch).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Template de e-mail")).toBeInTheDocument();
    expect(screen.getByText("Template de mensagem")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Central de Comunicação" })).toHaveLength(2);
  });

  it("builds the product location options with country and state-city rules", () => {
    const states = parseBrazilStates([
      { id: 52, sigla: "GO", nome: "Goiás" },
      { id: 35, sigla: "SP", nome: "São Paulo" },
    ]);
    const cities = parseBrazilCities([
      {
        id: 5219803,
        nome: "São Domingos",
        microrregiao: { mesorregiao: { UF: { sigla: "GO" } } },
      },
      {
        id: 3550308,
        nome: "São Paulo",
        microrregiao: { mesorregiao: { UF: { sigla: "SP" } } },
      },
    ]);

    expect(countryOptions.length).toBeGreaterThan(200);
    expect(countryOptions).toEqual(
      expect.arrayContaining([
        { code: "BR", name: "Brasil" },
        { code: "PT", name: "Portugal" },
      ])
    );
    expect(states.map((state) => state.name)).toEqual(["Goiás", "São Paulo"]);
    expect(getBrazilCitiesForState(cities, undefined).map((city) => city.name)).toEqual([
      "São Domingos",
      "São Paulo",
    ]);
    expect(getBrazilCitiesForState(cities, "GO").map((city) => city.name)).toEqual([
      "São Domingos",
    ]);
  });

  it("keeps large city dropdowns windowed instead of rendering every city", () => {
    const window = getVirtualWindow({
      itemCount: 5_570,
      itemHeight: 36,
      viewportHeight: 288,
      scrollTop: 3_600,
      overscan: 6,
    });

    expect(window.startIndex).toBe(94);
    expect(window.endIndex).toBe(114);
    expect(window.beforeHeight).toBe(3_384);
    expect(window.afterHeight).toBe(196_416);
  });

  it("syncs the new product header title with the product name field", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const productNameInput = getInputByFieldLabel("Nome do produto");
    const defaultHeaderTitle = getNewProductHeaderTitle("Novo produto");
    expect(defaultHeaderTitle.className).toContain("text-sm");

    fireEvent.change(productNameInput, {
      target: { value: "Trilha Cachoeira do Meio" },
    });

    const namedHeaderTitle = getNewProductHeaderTitle("Trilha Cachoeira do Meio");
    expect(namedHeaderTitle.className).toContain("text-base");

    fireEvent.change(productNameInput, {
      target: { value: "" },
    });

    const restoredHeaderTitle = getNewProductHeaderTitle("Novo produto");
    expect(restoredHeaderTitle.className).toContain("text-sm");
  });

  it("renders the full description as a compact rich text editor with a 600 character limit", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const descriptionEditor = screen.getByRole("textbox", { name: "Descrição completa" });
    const descriptionCounter = screen.getByText("0/600 caracteres");
    const descriptionCounterGroup = descriptionCounter.parentElement;

    if (!descriptionCounterGroup) {
      throw new Error("Description counter should render inside a field group.");
    }

    expect(descriptionEditor).toHaveAttribute("contenteditable", "true");
    expect(descriptionEditor.className).toContain("min-h-[148px]");
    expect(descriptionCounterGroup).toHaveClass("gap-1.5");
    expect(descriptionCounterGroup).toContainElement(descriptionEditor);
    expect(
      screen.getByRole("button", { name: "Tamanho da fonte na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Riscar na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Biblioteca de emojis na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cor do texto na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Alinhar à esquerda na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Alinhar ao centro na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lista com marcadores na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lista enumerada na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Adicionar acordeão na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Adicionar imagem na descrição completa" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Assistente de escrita na descrição completa" })
    ).toBeInTheDocument();

    const fullDescriptionToolbarTooltipCases = [
      "Biblioteca de emojis",
      "Cor do texto",
      "Adicionar link",
    ];

    for (const tooltipLabel of fullDescriptionToolbarTooltipCases) {
      const toolbarButton = screen.getByRole("button", {
        name: `${tooltipLabel} na descrição completa`,
      });
      const toolbarControl = toolbarButton.parentElement;

      if (!toolbarControl) {
        throw new Error(`Controle da toolbar não encontrado: ${tooltipLabel}`);
      }

      expect(within(toolbarControl).getByText(tooltipLabel)).toBeInTheDocument();
      expect(
        within(toolbarControl).queryByText(`${tooltipLabel} na descrição completa`)
      ).not.toBeInTheDocument();
    }

    descriptionEditor.textContent = "a".repeat(620);
    fireEvent.input(descriptionEditor);

    expect(descriptionEditor.textContent?.length).toBe(600);
    expect(screen.getByText("600/600 caracteres")).toBeInTheDocument();
  });

  it("updates the publication readiness checklist from filled product fields", async () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(
      screen.getByText("Complete os passos abaixo e seu produto entra no ar.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você pode salvar como rascunho a qualquer momento. Para publicar, complete os itens acima."
      )
    ).toBeInTheDocument();
    expectReadinessItemDone("Tipo e nome do produto", false);
    expectReadinessItemDone("Configurar horário", false);
    expectReadinessItemDone("Definir o valor do anúncio", false);
    expectReadinessItemDone("Escolher a política de cancelamento", false);
    expectReadinessItemDone("Ao menos 1 canal de venda", true);

    fireEvent.change(getInputByFieldLabel("Nome do produto"), {
      target: { value: "Trilha dinâmica" },
    });
    const advertisedValueLabel = screen.getByText("Valor do anúncio");
    const chargeTypeLabel = screen.getByText("Tipo de cobrança");
    expect(advertisedValueLabel.compareDocumentPosition(chargeTypeLabel)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(chargeTypeLabel).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Preço simplificado/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Preços variáveis \(tarifário\)/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByText("Base da cobrança")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Por pessoa \(padrão\)/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const advertisedPriceInput = getInputByFieldLabel("Preço por pessoa (R$)");
    expect(advertisedPriceInput).toHaveAttribute("placeholder", "0");
    expect(screen.getByText("Valor do anúncio")).toBeInTheDocument();
    const ecommercePriceInput = getInputByFieldLabel("Valor exibido no e-commerce e chamadas");
    expect(ecommercePriceInput).toHaveAttribute("placeholder", "0");
    expect(
      screen.getByText(
        'Com vários eventos de valores diferentes, o "a partir de" usa sempre o menor valor entre os eventos.'
      )
    ).toBeInTheDocument();

    fireEvent.change(advertisedPriceInput, {
      target: { value: "120,00" },
    });
    expect(ecommercePriceInput).toHaveValue("120,00");

    expectReadinessItemDone("Tipo e nome do produto", true);
    expectReadinessItemDone("Definir o valor do anúncio", true);

    const scheduleBlock = screen.getByText("HORÁRIOS").parentElement;
    if (!scheduleBlock) throw new Error("Bloco de horários não encontrado");

    openScheduleActionsMenu(scheduleBlock, "Horário 1");
    fireEvent.click(screen.getByRole("menuitem", { name: "Configurar horário" }));

    const scheduleDrawer = screen.getByRole("dialog", { name: "Configurar horário 1" });
    const scheduleStartInput = getInputByDialogFieldLabel(scheduleDrawer, "Início");
    const scheduleEndInput = getInputByDialogFieldLabel(scheduleDrawer, "Término");

    fireEvent.change(scheduleStartInput, {
      target: { value: "1299" },
    });
    expect(scheduleStartInput).toHaveValue("12:59");
    fireEvent.change(scheduleEndInput, {
      target: { value: "2460" },
    });
    expect(scheduleEndInput).toHaveValue("23:59");

    fireEvent.change(scheduleStartInput, {
      target: { value: "08:00" },
    });
    fireEvent.change(scheduleEndInput, {
      target: { value: "10:30" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Mínima"), {
      target: { value: "12" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Máxima"), {
      target: { value: "28" },
    });
    fireEvent.click(within(scheduleDrawer).getByRole("button", { name: "Salvar" }));

    expectReadinessItemDone("Configurar horário", true);

    fireEvent.click(within(scheduleBlock).getByRole("button", { name: "Adicionar horário" }));
    expectReadinessItemDone("Configurar horário", false);
  });

  it("shows variable pricing rules when variable tariff is selected", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: /Preços variáveis \(tarifário\)/ }));

    expect(screen.getByRole("button", { name: /Preços variáveis \(tarifário\)/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("REGRAS DAS VARIÁVEIS")).toBeInTheDocument();
    expect(screen.getByText("Regra #1")).toBeInTheDocument();
    expect(screen.getByText("Sem regras definidas")).toBeInTheDocument();
    expect(screen.queryByText("Base da cobrança")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar regra" }));
    expect(screen.getByText("Regra #2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Preço simplificado/ }));
    expect(screen.getByText("Base da cobrança")).toBeInTheDocument();
    expect(screen.queryByText("REGRAS DAS VARIÁVEIS")).not.toBeInTheDocument();
  });

  it("opens the variable pricing rule drawer with all configured rule scenarios", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: /Preços variáveis \(tarifário\)/ }));
    fireEvent.click(screen.getByRole("button", { name: "Editar Regra #1" }));

    const drawer = screen.getByRole("dialog", { name: "Configurar regras de tarifa" });
    expect(drawer.className).toContain("sm:!w-[730px]");
    expect(drawer.className).toContain("sm:!max-w-[730px]");
    expect(within(drawer).getByText("REGRAS")).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Por faixa etária/ })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Perfil especial/ })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Por acomodação/ })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Por tipo de dia/ })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Por lote de vagas/ })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: /Personalizada/ })).toBeInTheDocument();

    const ageRangeButton = within(drawer).getByRole("button", { name: /Por faixa etária/ });
    const specialProfileButton = within(drawer).getByRole("button", { name: /Perfil especial/ });
    const accommodationButton = within(drawer).getByRole("button", { name: /Por acomodação/ });
    const ageRangeIconPath = ageRangeButton.querySelector("svg path");
    const specialProfileIconPath = specialProfileButton.querySelector("svg path");
    const accommodationIconPath = accommodationButton.querySelector("svg path");
    const dayTypeIconPath = within(drawer)
      .getByRole("button", { name: /Por tipo de dia/ })
      .querySelector("svg path");

    expect(ageRangeButton).toHaveAttribute("aria-pressed", "true");
    expect(ageRangeButton.className).toContain("text-[#0b5ed7]");
    expect(specialProfileButton).toHaveAttribute("aria-pressed", "false");
    expect(specialProfileButton.className).toContain("text-[#535862]");
    expect(ageRangeIconPath).toHaveAttribute(
      "d",
      "M11.667 2.91699H8.33366C5.19096 2.91699 3.61961 2.91699 2.6433 3.8933C1.66699 4.86961 1.66699 6.44096 1.66699 9.58366V10.417C1.66699 13.5597 1.66699 15.131 2.6433 16.1073C3.61961 17.0837 5.19096 17.0837 8.33365 17.0837H8.33366H11.667H11.667C14.8097 17.0837 16.381 17.0837 17.3573 16.1073C18.3337 15.131 18.3337 13.5597 18.3337 10.417V9.58366C18.3337 6.44096 18.3337 4.86961 17.3573 3.8933C16.381 2.91699 14.8097 2.91699 11.667 2.91699Z"
    );
    expect(ageRangeIconPath).toHaveAttribute("stroke", "currentColor");
    expect(specialProfileIconPath).toHaveAttribute(
      "d",
      "M10.8337 16.9191C10.1274 17.2091 9.31249 17.1161 8.6759 16.6401C6.32484 14.882 1.66699 10.8627 1.66699 7.2457C1.66699 4.85502 3.42138 2.91699 5.83366 2.91699C7.08366 2.91699 8.33366 3.33366 10.0003 5.00033C11.667 3.33366 12.917 2.91699 14.167 2.91699C16.5793 2.91699 18.3337 4.85502 18.3337 7.2457C18.3337 7.60525 18.2876 7.96877 18.2024 8.33366"
    );
    expect(specialProfileIconPath).toHaveAttribute("stroke", "currentColor");
    expect(accommodationIconPath).toHaveAttribute("d", "M18.3337 14.583L1.66699 14.583");
    expect(accommodationIconPath).toHaveAttribute("stroke", "currentColor");
    expect(dayTypeIconPath).toHaveAttribute(
      "d",
      "M13.3333 1.66699V5.00033M6.66667 1.66699V5.00033M10 18.3337H9.16667C6.02417 18.3337 4.4525 18.3337 3.47667 17.357C2.50083 16.3803 2.5 14.8095 2.5 11.667V10.0003C2.5 6.85783 2.5 5.28616 3.47667 4.31033C4.45333 3.33449 6.02417 3.33366 9.16667 3.33366H10.8333C13.9758 3.33366 15.5475 3.33366 16.5233 4.31033C17.41 5.19616 17.4917 6.57199 17.5 9.16699M2.5 8.33366H17.5"
    );
    expect(dayTypeIconPath).toHaveAttribute("stroke", "currentColor");

    const ruleTitleInput = getInputByDialogFieldLabel(drawer, "Título da regra");
    expect(ruleTitleInput.closest("label")?.parentElement?.className).toContain("flex flex-col");
    const startTimeInput = getInputByDialogFieldLabel(drawer, "Horário de início");
    const endTimeInput = getInputByDialogFieldLabel(drawer, "Horário de fim");
    const startTimeIcon = startTimeInput.parentElement?.querySelector("svg");
    const endTimeIcon = endTimeInput.parentElement?.querySelector("svg");
    expect(startTimeIcon).toHaveAttribute("viewBox", "0 0 20 20");
    expect(startTimeIcon).toHaveClass("text-[#717680]");
    expect(startTimeIcon?.querySelector("circle")).toHaveAttribute("stroke", "currentColor");
    expect(startTimeIcon?.querySelector("path")).toHaveAttribute(
      "d",
      "M10 6.66699V10.0003L11.6667 11.667"
    );
    expect(endTimeIcon).toHaveAttribute("viewBox", "0 0 20 20");
    expect(endTimeIcon).toHaveClass("text-[#d5d7da]");
    expect(endTimeIcon?.querySelector("circle")).toHaveAttribute("stroke", "currentColor");
    expect(endTimeIcon?.querySelector("path")).toHaveAttribute(
      "d",
      "M10 6.66699V10.0003L11.6667 11.667"
    );
    const indefiniteValiditySwitch = within(drawer).getByRole("switch", {
      name: "Definir prazo indeterminado",
    });
    const indefiniteValidityRow = indefiniteValiditySwitch.closest("div");
    expect(indefiniteValidityRow?.className).toBe("flex items-center gap-3");
    const linkedRulesEmptyTitle = within(drawer).getByText("Nenhuma regra vinculada");
    const linkedRulesEmptyState = linkedRulesEmptyTitle.closest(".min-h-\\[160px\\]");
    if (!(linkedRulesEmptyState instanceof HTMLElement)) {
      throw new Error("Estado vazio de regras vinculadas não encontrado");
    }
    const linkedRulesEmptyIcon = linkedRulesEmptyState.querySelector("svg");
    const linkedRulesEmptyDescription = within(linkedRulesEmptyState).getByText(
      "As subregras aparecem aqui, dentro da regra principal."
    );
    expect(linkedRulesEmptyState).toHaveClass("min-h-[160px]", "gap-[8px]", "py-[24px]");
    expect(linkedRulesEmptyIcon).toHaveAttribute("width", "32");
    expect(linkedRulesEmptyIcon).toHaveAttribute("height", "32");
    expect(linkedRulesEmptyIcon).toHaveAttribute("viewBox", "0 0 32 32");
    expect(linkedRulesEmptyIcon?.querySelector("path")).toHaveAttribute(
      "d",
      "M15.9998 29.3337C23.3636 29.3337 29.3332 23.3641 29.3332 16.0003C29.3332 8.63653 23.3636 2.66699 15.9998 2.66699C8.63604 2.66699 2.6665 8.63653 2.6665 16.0003C2.6665 23.3641 8.63604 29.3337 15.9998 29.3337Z"
    );
    expect(linkedRulesEmptyIcon?.querySelector("path")).toHaveAttribute("stroke", "#D0D5DD");
    expect(linkedRulesEmptyDescription).toHaveClass("w-[200px]");

    fireEvent.click(within(drawer).getByRole("button", { name: /Por acomodação/ }));
    expect(within(drawer).getByText("Valor por diária (R$)")).toBeInTheDocument();
    const accommodationTypeLabel = within(drawer).getByText("Tipo de acomodação");
    const stockRuleLabel = within(drawer).getByText("Estoque desta regra");
    const productStockButton = within(drawer).getByRole("button", {
      name: /Usar o estoque do produto/,
    });
    const customStockButton = within(drawer).getByRole("button", {
      name: /Definir vagas para esta regra/,
    });
    const singleAccommodationButton = within(drawer).getByRole("button", { name: "Single" });
    const accommodationTabs = singleAccommodationButton.parentElement;
    expect(stockRuleLabel.compareDocumentPosition(accommodationTypeLabel)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(productStockButton).toHaveClass("min-h-[78px]", "rounded-xl", "p-3");
    expect(productStockButton).toHaveTextContent(
      "Esta regra consome as vagas gerais do produto conforme as vendas acontecem."
    );
    expect(customStockButton).toHaveClass("min-h-[78px]", "rounded-xl", "p-3");
    expect(customStockButton).toHaveTextContent(
      "A regra tem uma quantidade própria, sempre limitada ao estoque do produto."
    );
    expect(within(drawer).getByText("Estoque do produto:")).toBeInTheDocument();
    expect(within(drawer).getByText("30 vagas")).toBeInTheDocument();

    fireEvent.click(customStockButton);
    const minimumCustomStockInput = getInputByDialogFieldLabel(
      drawer,
      "Quantidade mínima de vagas"
    );
    const maximumCustomStockInput = getInputByDialogFieldLabel(
      drawer,
      "Quantidade máxima de vagas"
    );
    const stockLimitHint = "Maior que o estoque disponível (30 vagas).";
    expect(within(drawer).queryByText(stockLimitHint)).not.toBeInTheDocument();

    fireEvent.change(minimumCustomStockInput, { target: { value: "31" } });
    expect(within(drawer).getByText(stockLimitHint)).toBeInTheDocument();
    fireEvent.change(maximumCustomStockInput, { target: { value: "45" } });
    expect(within(drawer).getAllByText(stockLimitHint)).toHaveLength(2);

    fireEvent.change(minimumCustomStockInput, { target: { value: "30" } });
    expect(within(drawer).getAllByText(stockLimitHint)).toHaveLength(1);
    fireEvent.change(maximumCustomStockInput, { target: { value: "" } });
    expect(within(drawer).queryByText(stockLimitHint)).not.toBeInTheDocument();
    fireEvent.change(minimumCustomStockInput, { target: { value: "" } });
    fireEvent.click(productStockButton);

    expect(accommodationTypeLabel).toHaveClass("text-[13px]", "text-[#1f2937]");
    expect(accommodationTabs).toHaveClass(
      "h-[48px]",
      "w-full",
      "rounded-full",
      "border-[#f5f5f5]",
      "bg-[#fafafa]",
      "p-1"
    );
    expect(singleAccommodationButton).toHaveAttribute("aria-pressed", "true");
    expect(singleAccommodationButton).toHaveClass(
      "flex-1",
      "rounded-full",
      "bg-white",
      "font-['Helvetica_Neue:Medium',sans-serif]",
      "shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]"
    );

    fireEvent.click(within(drawer).getByRole("button", { name: /Por tipo de dia/ }));
    expect(within(drawer).getByText("Tipo de dia")).toHaveClass("text-sm", "text-[#1f2937]");
    const customDayTypeButton = within(drawer).getByRole("button", { name: "Personalizado" });
    const dayTypeTabs = customDayTypeButton.parentElement;
    expect(dayTypeTabs).toHaveClass(
      "h-[41px]",
      "w-full",
      "gap-1",
      "rounded-[8px]",
      "border-[#e9eaeb]",
      "bg-white",
      "p-1"
    );
    expect(customDayTypeButton).toHaveAttribute("aria-pressed", "true");
    expect(customDayTypeButton).toHaveClass(
      "flex-1",
      "rounded-[6px]",
      "bg-[#0b5ed7]",
      "font-['Helvetica_Neue:Medium',sans-serif]",
      "text-white",
      "shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
    );
    expect(within(drawer).getByText("Dias personalizados para seleção")).toHaveClass(
      "text-sm",
      "text-[#1f2937]"
    );
    const customWednesdayButton = within(drawer).getByRole("button", { name: "Qua" });
    const customWeekdayButtons = customWednesdayButton.parentElement;
    expect(customWeekdayButtons).toHaveClass("h-9", "w-full", "gap-2");
    expect(customWednesdayButton).toHaveAttribute("aria-pressed", "true");
    expect(customWednesdayButton).toHaveClass(
      "h-9",
      "min-w-[44px]",
      "rounded-[8px]",
      "border-[#0b5ed7]",
      "bg-[#0b5ed7]",
      "px-[10px]",
      "font-['Helvetica_Neue:Medium',sans-serif]",
      "text-[13px]",
      "leading-[19.5px]",
      "text-white"
    );
    expect(within(drawer).getByRole("button", { name: "Seg" })).toHaveClass(
      "border-[#e9eaeb]",
      "bg-white",
      "text-[#535862]"
    );

    fireEvent.click(within(drawer).getByRole("button", { name: /Por lote de vagas/ }));
    const batchBasisLabel = within(drawer).getByText("Lote definido por:");
    const peopleQuantityBatchButton = within(drawer).getByRole("button", {
      name: "Quantidade de pessoas",
    });
    const batchBasisTabs = peopleQuantityBatchButton.parentElement;
    const batchBasisBlock = batchBasisLabel.parentElement?.parentElement;
    if (!(batchBasisBlock instanceof HTMLElement)) {
      throw new Error("Bloco de lote definido por não encontrado");
    }
    expect(batchBasisBlock).toHaveClass("mt-5", "gap-4");
    expect(batchBasisLabel).toHaveClass("text-[13px]", "text-[#1f2937]");
    expect(batchBasisTabs).toHaveClass(
      "h-[48px]",
      "w-full",
      "rounded-full",
      "border-[#f5f5f5]",
      "bg-[#fafafa]",
      "p-1"
    );
    expect(peopleQuantityBatchButton).toHaveAttribute("aria-pressed", "true");
    expect(peopleQuantityBatchButton).toHaveClass(
      "flex-1",
      "rounded-full",
      "bg-white",
      "font-['Helvetica_Neue:Medium',sans-serif]",
      "shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]"
    );
    const batchFromPersonInput = getInputByDialogFieldLabel(drawer, "Da pessoa (Nº)");
    const batchUntilPersonInput = getInputByDialogFieldLabel(drawer, "Até a pessoa (Nº)");
    expect(batchFromPersonInput).toHaveAttribute("placeholder", "1");
    expect(batchUntilPersonInput).toHaveAttribute("placeholder", "10");
    expect(batchFromPersonInput).toHaveClass("border-[#cbd5e1]", "bg-white");
    expect(batchUntilPersonInput).toHaveClass("border-[#cbd5e1]", "bg-white");
    const peopleQuantityBatchFields = batchFromPersonInput.closest(".flex.flex-col.gap-1\\.5");
    if (!(peopleQuantityBatchFields instanceof HTMLElement)) {
      throw new Error("Grupo de lote por quantidade não encontrado");
    }
    expect(peopleQuantityBatchFields).toBeInTheDocument();
    expect(
      within(drawer).getByText(
        "Se este lote esgotar, a venda avança automaticamente para o próximo lote (se outro for criado). O teto de todos os lotes é o estoque do produto"
      )
    ).toHaveClass("text-xs", "text-[#64748b]");

    const purchaseDateBatchButton = within(drawer).getByRole("button", {
      name: "Data de compra",
    });
    fireEvent.click(purchaseDateBatchButton);

    expect(peopleQuantityBatchButton).toHaveAttribute("aria-pressed", "false");
    expect(purchaseDateBatchButton).toHaveAttribute("aria-pressed", "true");
    expect(purchaseDateBatchButton).toHaveClass(
      "bg-white",
      "font-['Helvetica_Neue:Medium',sans-serif]",
      "shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]"
    );
    expect(within(drawer).queryByText("Da pessoa (Nº)")).not.toBeInTheDocument();
    expect(within(drawer).queryByText("Até a pessoa (Nº)")).not.toBeInTheDocument();
    const purchaseStartInput = getInputByDialogFieldLabel(drawer, "Comprando de");
    const purchaseEndInput = getInputByDialogFieldLabel(drawer, "Comprando até");
    expect(purchaseStartInput).toHaveAttribute("placeholder", "dd/mm/aaaa");
    expect(purchaseEndInput).toHaveAttribute("placeholder", "dd/mm/aaaa");
    expect(purchaseStartInput).toHaveClass("border-[#cbd5e1]", "bg-white");
    expect(purchaseEndInput).toHaveClass("border-[#cbd5e1]", "bg-white");
    const purchaseDateBatchFields = purchaseStartInput.closest(".flex.flex-col.gap-1\\.5");
    if (!(purchaseDateBatchFields instanceof HTMLElement)) {
      throw new Error("Grupo de lote por data de compra não encontrado");
    }
    expect(purchaseDateBatchFields).toBeInTheDocument();
    fireEvent.change(purchaseStartInput, {
      target: { value: "01012027" },
    });
    fireEvent.change(purchaseEndInput, {
      target: { value: "15012027" },
    });
    expect(purchaseStartInput).toHaveValue("01/01/2027");
    expect(purchaseEndInput).toHaveValue("15/01/2027");
    expect(
      within(drawer).getByText(
        "O valor vale para quem compra dentro destas datas, independente de quantas vagas já saíram. Obs.: não confunda com a vigência abaixo, que se refere à data em que o evento acontece."
      )
    ).toHaveClass("text-xs", "text-[#64748b]");

    fireEvent.click(within(drawer).getByRole("button", { name: /Personalizada/ }));
    fireEvent.change(getInputByDialogFieldLabel(drawer, "Título da regra"), {
      target: { value: "Tarifa cortesia local" },
    });
    fireEvent.change(getInputByDialogFieldLabel(drawer, "Valor (R$)"), {
      target: { value: "25,00" },
    });
    fireEvent.click(within(drawer).getByRole("button", { name: "Salvar" }));

    expect(
      screen.getByText("Personalizada, Tarifa cortesia local, R$ 25,00, estoque do produto.")
    ).toBeInTheDocument();
  });

  it("opens the linked rule modal from the variable pricing rule drawer", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: /Preços variáveis \(tarifário\)/ }));
    fireEvent.click(screen.getByRole("button", { name: "Editar Regra #1" }));

    const drawer = screen.getByRole("dialog", { name: "Configurar regras de tarifa" });
    fireEvent.click(within(drawer).getByRole("button", { name: "Adicionar regra vinculada" }));

    const linkedRuleDialog = screen.getByRole("dialog", { name: "Adicionar regra vinculada" });
    expect(linkedRuleDialog.className).toContain("sm:max-w-[725px]");
    expect(within(linkedRuleDialog).getByText("TIPO DE SUBREGRA")).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByText(
        "Configure uma subregra para refinar a regra principal deste tarifário."
      )
    ).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Por faixa etária/ })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Perfil especial/ })
    ).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Por acomodação/ })
    ).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Por tipo de dia/ })
    ).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Por lote de vagas/ })
    ).toBeInTheDocument();
    expect(
      within(linkedRuleDialog).getByRole("button", { name: /Personalizada/ })
    ).toBeInTheDocument();
    const saveLinkedRuleButton = within(linkedRuleDialog).getByRole("button", {
      name: "Salvar subregra",
    });
    const linkedRuleTitleInput = getInputByDialogFieldLabel(
      linkedRuleDialog,
      "Título da regra vinculada"
    );
    const linkedRuleValueInput = getInputByDialogFieldLabel(linkedRuleDialog, "Valor (R$)");
    expect(saveLinkedRuleButton).toBeDisabled();

    fireEvent.click(within(linkedRuleDialog).getByRole("button", { name: /Perfil especial/ }));
    fireEvent.change(linkedRuleTitleInput, { target: { value: "Criança em quarto duplo" } });
    expect(saveLinkedRuleButton).toBeDisabled();
    fireEvent.change(linkedRuleValueInput, { target: { value: "1000,50" } });
    expect(linkedRuleValueInput).toHaveValue("1.000,50");
    expect(saveLinkedRuleButton).toBeEnabled();
    fireEvent.click(saveLinkedRuleButton);

    expect(within(drawer).queryByText("Nenhuma regra vinculada")).not.toBeInTheDocument();
    const linkedRuleTitle = within(drawer).getByText("Criança em quarto duplo");
    const editLinkedRuleButton = within(drawer).getByRole("button", {
      name: "Editar Criança em quarto duplo",
    });
    const deleteLinkedRuleButton = within(drawer).getByRole("button", {
      name: "Excluir Criança em quarto duplo",
    });
    const linkedRuleCard = editLinkedRuleButton.parentElement?.parentElement;
    const linkedRuleConnector = linkedRuleCard?.previousElementSibling;
    expect(linkedRuleTitle).toBeInTheDocument();
    expect(within(drawer).queryByText("Subregra #1")).not.toBeInTheDocument();
    expect(within(drawer).getByText("Perfil especial · R$ 1.000,50")).toBeInTheDocument();
    expect(linkedRuleConnector).toHaveClass(
      "h-2",
      "w-4",
      "rounded-bl-[8px]",
      "border-b-2",
      "border-l-2",
      "border-[#f6f6f6]"
    );
    expect(linkedRuleCard).toHaveClass(
      "min-h-16",
      "rounded-xl",
      "border-[#e5e5e5]",
      "bg-[#f5f5f5]/40",
      "px-4",
      "py-3"
    );
    expect(linkedRuleCard?.querySelector("svg")).toHaveClass("text-[#a4a7ae]");
    expect(editLinkedRuleButton).toHaveClass("size-8", "rounded-[10px]", "text-primary");
    expect(deleteLinkedRuleButton).toHaveClass("size-8", "rounded-[10px]", "text-destructive");

    fireEvent.click(within(drawer).getByRole("button", { name: "Adicionar regra vinculada" }));
    const secondLinkedRuleDialog = screen.getByRole("dialog", {
      name: "Adicionar regra vinculada",
    });
    fireEvent.change(
      getInputByDialogFieldLabel(secondLinkedRuleDialog, "Título da regra vinculada"),
      {
        target: { value: "Estudante" },
      }
    );
    fireEvent.change(getInputByDialogFieldLabel(secondLinkedRuleDialog, "Valor (R$)"), {
      target: { value: "48,99" },
    });
    fireEvent.click(
      within(secondLinkedRuleDialog).getByRole("button", { name: "Salvar subregra" })
    );

    const linkedRulesList = linkedRuleCard?.parentElement?.parentElement;
    if (!(linkedRulesList instanceof HTMLElement)) {
      throw new Error("Lista de subregras vinculadas não encontrada");
    }
    const linkedRulesVerticalLine = linkedRulesList.firstElementChild;
    if (!(linkedRulesVerticalLine instanceof HTMLElement)) {
      throw new Error("Linha vertical de subregras vinculadas não encontrada");
    }
    expect(linkedRulesList).toHaveClass("relative", "gap-3", "overflow-hidden");
    expect(linkedRulesVerticalLine).toHaveClass(
      "absolute",
      "top-0",
      "bottom-9",
      "left-0",
      "w-0.5",
      "bg-[#f6f6f6]"
    );
    expect(within(drawer).getByText("Estudante")).toBeInTheDocument();
    expect(within(drawer).getByText("Por faixa etária · R$ 48,99")).toBeInTheDocument();

    fireEvent.click(within(drawer).getByRole("button", { name: "Editar Criança em quarto duplo" }));
    const editLinkedRuleDialog = screen.getByRole("dialog", { name: "Adicionar regra vinculada" });
    expect(
      getInputByDialogFieldLabel(editLinkedRuleDialog, "Título da regra vinculada")
    ).toHaveValue("Criança em quarto duplo");
    fireEvent.change(getInputByDialogFieldLabel(editLinkedRuleDialog, "Valor (R$)"), {
      target: { value: "40,00" },
    });
    fireEvent.click(within(editLinkedRuleDialog).getByRole("button", { name: "Salvar subregra" }));

    expect(within(drawer).getByText("Perfil especial · R$ 40,00")).toBeInTheDocument();

    fireEvent.click(
      within(drawer).getByRole("button", { name: "Excluir Criança em quarto duplo" })
    );
    expect(within(drawer).getByText("Estudante")).toBeInTheDocument();

    fireEvent.click(within(drawer).getByRole("button", { name: "Excluir Estudante" }));
    expect(within(drawer).getByText("Nenhuma regra vinculada")).toBeInTheDocument();
  });

  it("shows the closed group tariff disclaimer only after variable tariff configuration", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const closedGroupButton = screen.getByRole("button", { name: /Por grupo fechado/ });
    fireEvent.click(closedGroupButton);

    expect(getInputByFieldLabel("Valor cheio do grupo (R$)")).toHaveAttribute("placeholder", "0");
    expect(screen.queryByText(/tarifário cadastrado/)).not.toBeInTheDocument();

    const variableTariffButton = screen.getByRole("button", {
      name: /Preços variáveis \(tarifário\)/,
    });
    fireEvent.click(variableTariffButton);

    expect(variableTariffButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("REGRAS DAS VARIÁVEIS")).toBeInTheDocument();
    expect(screen.queryByText("Base da cobrança")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Preço simplificado/ }));
    fireEvent.click(screen.getByRole("button", { name: /Por grupo fechado/ }));

    expect(screen.getByText(/tarifário cadastrado/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retornar para preços múltiplos" }));

    expect(variableTariffButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("REGRAS DAS VARIÁVEIS")).toBeInTheDocument();
    expect(screen.queryByText("Base da cobrança")).not.toBeInTheDocument();
    expect(screen.queryByText(/tarifário cadastrado/)).not.toBeInTheDocument();
  });

  it("shows the item sum billing notice and anchors its action to product items", () => {
    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    const originalScrollTo = window.HTMLElement.prototype.scrollTo;
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
    });

    try {
      mockLocationOptionsFetch();
      render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

      const itemSumButton = screen.getByRole("button", { name: /Por soma dos itens/ });
      fireEvent.click(itemSumButton);

      expect(itemSumButton).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByText(
          "O preço deste produto é a soma dos itens escolhidos pelo cliente. Configure os itens e seus valores na área de Itens do produto, logo acima."
        )
      ).toBeInTheDocument();

      const goToItemsButton = screen.getByRole("button", { name: "Ir para Itens do produto" });
      const goToItemsIconPath = goToItemsButton.querySelector("svg path");

      expect(goToItemsIconPath).toHaveAttribute(
        "d",
        "M2 13.3337H4.26667C6.50688 13.3337 7.62698 13.3337 8.48263 12.8977C9.23528 12.5142 9.8472 11.9023 10.2307 11.1496C10.6667 10.294 10.6667 9.17387 10.6667 6.93366L10.6667 2.66699M14 6.00033L10.6667 2.66699L7.33333 6.00033"
      );
      expect(goToItemsIconPath).toHaveAttribute("stroke", "#0B5ED7");

      fireEvent.click(goToItemsButton);

      expect(scrollTo).not.toHaveBeenCalled();
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    } finally {
      Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
        configurable: true,
        writable: true,
        value: originalScrollTo,
      });
      Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
        configurable: true,
        writable: true,
        value: originalScrollIntoView,
      });
      if (originalRequestAnimationFrame) {
        Object.defineProperty(window, "requestAnimationFrame", {
          configurable: true,
          writable: true,
          value: originalRequestAnimationFrame,
        });
      } else {
        Reflect.deleteProperty(window, "requestAnimationFrame");
      }
      cleanup();
    }
  });

  it("updates the product summary from the filled form values", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    expectSummaryValue("Categoria", "Atividade");
    expectSummaryValue("A partir de", "Não preenchido");
    expectSummaryValue("Programação", "Todos os dias");
    expectSummaryValue("Saídas", "Não preenchido");
    expectSummaryValue("Capacidade", "Não preenchida");
    expectSummaryValue("Canais", "Loja online, Marketplace");

    fireEvent.change(getInputByFieldLabel("Preço por pessoa (R$)"), {
      target: { value: "120,00" },
    });
    expectSummaryValue("A partir de", "R$ 120,00 / pessoa");

    fireEvent.click(screen.getByRole("button", { name: /Com períodos específicos/ }));
    expectSummaryValue("Programação", "Períodos específicos");

    const scheduleBlock = screen.getByText("HORÁRIOS").parentElement;
    if (!scheduleBlock) throw new Error("Bloco de horários não encontrado");

    openScheduleActionsMenu(scheduleBlock, "Horário 1");
    fireEvent.click(screen.getByRole("menuitem", { name: "Configurar horário" }));

    const scheduleDrawer = screen.getByRole("dialog", { name: "Configurar horário 1" });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Início"), {
      target: { value: "08:00" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Término"), {
      target: { value: "10:30" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Mínima"), {
      target: { value: "12" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Máxima"), {
      target: { value: "28" },
    });
    fireEvent.click(within(scheduleDrawer).getByRole("button", { name: "Salvar" }));

    expectSummaryValue("Saídas", "1");
    expectSummaryValue("Capacidade", "28 pax / saída");

    fireEvent.change(getInputByFieldLabel("Participantes (máximo)"), {
      target: { value: "1000" },
    });
    expectSummaryValue("Capacidade", "1.000 pax");

    const marketplaceButton = screen.getByText("Marketplace").closest("button");
    if (!marketplaceButton) throw new Error("Canal Marketplace não encontrado");

    fireEvent.click(marketplaceButton);
    expectSummaryValue("Canais", "Loja online");
  });

  it("renders advanced settings with the Figma-defined sales and SEO controls", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Configurações adicionais" }));

    expect(screen.getByText("https://retrilhar.com.br/product/")).toBeInTheDocument();
    expect(screen.getByLabelText("Slug da URL do produto")).toHaveValue("");
    expect(screen.getByLabelText("Slug da URL do produto")).toHaveAttribute(
      "placeholder",
      "nome-do-produto"
    );
    const copyLinkButton = screen.getByRole("button", { name: /Copiar link/ });
    const copyLinkContent = within(copyLinkButton).getByText("Copiar link").closest("span");
    if (!copyLinkContent) throw new Error("Conteúdo do botão Copiar link não encontrado");

    expect(copyLinkButton.className).not.toContain("hover:bg-[#eff6ff]");
    expect(copyLinkContent.className).toContain("hover:bg-[#eff6ff]");

    vi.useFakeTimers();
    try {
      fireEvent.click(copyLinkButton);
      expect(writeText).toHaveBeenCalledWith("https://retrilhar.com.br/product/nome-do-produto");
      expect(screen.getByRole("button", { name: /Link copiado/ })).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2_000);
      });

      expect(screen.getByRole("button", { name: /Copiar link/ })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }

    expect(screen.getByRole("button", { name: /Loja online \(e-commerce\)/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Marketplace/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Balcão PDV/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: /Divulgação por Afiliados/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    expect(screen.getByRole("switch", { name: "Destacar produto na vitrine" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    const suggestedProductsCombobox = screen.getByRole("combobox", {
      name: "Selecionar produtos sugeridos",
    });
    expect(suggestedProductsCombobox).toHaveTextContent("2 selecionado(s)");
    expect(screen.getByText("Cachoeira Fria")).toBeInTheDocument();
    expect(screen.getByText("Trilha Verde")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remover sugestão Cachoeira Fria" }));

    expect(screen.queryByText("Cachoeira Fria")).not.toBeInTheDocument();
    expect(suggestedProductsCombobox).toHaveTextContent("1 selecionado(s)");

    fireEvent.click(suggestedProductsCombobox);

    expect(screen.getByRole("listbox", { name: "Produtos cadastrados" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Cachoeira Fria/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByRole("option", { name: /Trilha Verde/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.click(screen.getByRole("option", { name: /Cachoeira Fria/ }));

    expect(suggestedProductsCombobox).toHaveTextContent("2 selecionado(s)");
    expect(screen.getAllByText("Cachoeira Fria")).not.toHaveLength(0);

    expect(screen.getByRole("button", { name: "Gerar conteúdo com IA" })).toBeInTheDocument();
    expect(getInputByFieldLabel("Título da página")).toHaveAttribute(
      "placeholder",
      "Ex.: Trilha Pico do Itacolomi | Retrilhar"
    );
    expect(screen.getByText("Meta descrição")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Ex.: Trilha guiada de 4 horas até o Pico do Itacolomi, com condutor de aventura, equipamentos de segurança e seguro incluso."
      )
    ).toBeInTheDocument();

    const customJavascriptSwitch = screen.getByRole("switch", {
      name: "Habilitar código JavaScript personalizado",
    });
    expect(customJavascriptSwitch).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Código JavaScript personalizado")).toBeInTheDocument();

    fireEvent.click(customJavascriptSwitch);

    expect(customJavascriptSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByLabelText("Código JavaScript personalizado")).not.toBeInTheDocument();
  });

  it("keeps the product URL slug generated from the product name until it is edited", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Configurações adicionais" }));

    const productNameInput = getInputByFieldLabel("Nome do produto");
    const productSlugInput = screen.getByLabelText("Slug da URL do produto");

    expect(productSlugInput).toHaveValue("");
    expect(productSlugInput).toHaveAttribute("placeholder", "nome-do-produto");
    expect(productSlugInput.className).toContain("placeholder:text-slate-400");

    fireEvent.change(productNameInput, {
      target: { value: "Trilha Cachoeira do Meio" },
    });

    expect(productSlugInput).toHaveValue("trilha-cachoeira-do-meio");

    fireEvent.change(productSlugInput, {
      target: { value: "trilha-personalizada" },
    });
    fireEvent.change(productNameInput, {
      target: { value: "Passeio Novo" },
    });

    expect(productSlugInput).toHaveValue("trilha-personalizada");
  });

  it("keeps the new product header inside the flow shell when navigating by product step", () => {
    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    const originalScrollTo = window.HTMLElement.prototype.scrollTo;
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;

    Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: function getBoundingClientRect(this: HTMLElement) {
        if (this.tagName === "MAIN") return new DOMRect(0, 61, 900, 700);
        if (this.id === "produto-schedule") return new DOMRect(0, 245, 774, 560);

        return originalGetBoundingClientRect.call(this);
      },
    });

    try {
      mockLocationOptionsFetch();
      render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
      fireEvent.click(screen.getByRole("button", { name: "Programação e vagas" }));

      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(scrollTo).toHaveBeenCalledWith({
        behavior: "smooth",
        top: expect.any(Number),
      });
      expect(screen.getByRole("button", { name: "Programação e vagas" })).toHaveAttribute(
        "aria-current",
        "step"
      );
      expect(getNewProductHeaderTitle("Novo produto")).toBeInTheDocument();
    } finally {
      Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
        configurable: true,
        value: originalGetBoundingClientRect,
      });
      if (originalScrollTo) {
        Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
          configurable: true,
          value: originalScrollTo,
        });
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, "scrollTo");
      }
      if (originalScrollIntoView) {
        Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
          configurable: true,
          value: originalScrollIntoView,
        });
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, "scrollIntoView");
      }
    }
  });

  it("configures payment methods with conditional percentage fields", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const creditCardButton = screen.getByRole("button", { name: /Cartão de crédito/ });
    const pixButton = screen.getByRole("button", { name: /PIX \(Pagamento à vista\)/ });

    expect(creditCardButton).toHaveAttribute("aria-pressed", "true");
    expect(pixButton).toHaveAttribute("aria-pressed", "false");
    expect(getInputByFieldLabel("Acréscimo no cartão (%)")).toBeInTheDocument();
    expect(screen.queryByText(/^Pagamento$/)).not.toBeInTheDocument();
    expect(screen.getByText("Configurações de pagamento")).toBeInTheDocument();
    expect(screen.getByText("Parcelas").closest("label")?.parentElement).toBe(
      screen.getByText("Proxy de pagamento").closest("label")?.parentElement
    );
    expect(
      screen.getByText("Repasse da taxa da operadora para o cliente final.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Desconto no PIX (%)")).not.toBeInTheDocument();

    fireEvent.click(pixButton);

    expect(pixButton).toHaveAttribute("aria-pressed", "true");
    expect(getInputByFieldLabel("Desconto no PIX (%)")).toBeInTheDocument();
    expect(screen.getByText("Desconto no PIX (%)").closest("label")?.parentElement).toBe(
      screen.getByText("Acréscimo no cartão (%)").closest("label")?.parentElement
    );
    expect(screen.getByText("Deixe o campo vazio para cobrar o valor cheio.")).toBeInTheDocument();

    fireEvent.change(getInputByFieldLabel("Acréscimo no cartão (%)"), {
      target: { value: "4%" },
    });
    fireEvent.change(getInputByFieldLabel("Desconto no PIX (%)"), {
      target: { value: "10%" },
    });

    expect(getInputByFieldLabel("Acréscimo no cartão (%)")).toHaveValue("4%");
    expect(getInputByFieldLabel("Desconto no PIX (%)")).toHaveValue("10%");

    fireEvent.click(creditCardButton);

    expect(creditCardButton).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Acréscimo no cartão (%)")).not.toBeInTheDocument();
    expect(getInputByFieldLabel("Desconto no PIX (%)")).toBeInTheDocument();
  });

  it("configures promotional pricing with dates and store preview", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const promotionalSwitch = screen.getByRole("switch", {
      name: "Habilitar preço promocional",
    });
    expect(promotionalSwitch).toHaveAttribute("aria-checked", "true");
    expect(getInputByFieldLabel("Valor promocional (R$)")).toHaveValue("0");
    expect(getInputByFieldLabel("Início da vigência")).toHaveAttribute("placeholder", "dd/mm/aaaa");
    expect(getInputByFieldLabel("Fim da vigência")).toHaveAttribute("placeholder", "dd/mm/aaaa");
    expect(screen.getByText("Prévia na loja")).toBeInTheDocument();
    expect(screen.getByText("R$ --")).toBeInTheDocument();
    expect(screen.queryByText("R$ 0")).not.toBeInTheDocument();
    expect(
      screen
        .queryAllByText("R$ 150,00")
        .some((element) => element.classList.contains("line-through"))
    ).toBe(false);

    fireEvent.change(getInputByFieldLabel("Preço por pessoa (R$)"), {
      target: { value: "150,00" },
    });
    fireEvent.change(getInputByFieldLabel("Valor promocional (R$)"), {
      target: { value: "R$ 129,90" },
    });
    fireEvent.change(getInputByFieldLabel("Início da vigência"), {
      target: { value: "11082026" },
    });
    fireEvent.change(getInputByFieldLabel("Fim da vigência"), {
      target: { value: "25082026" },
    });

    expect(getInputByFieldLabel("Valor promocional (R$)")).toHaveValue("129,90");
    expect(getInputByFieldLabel("Início da vigência")).toHaveValue("11/08/2026");
    expect(getInputByFieldLabel("Fim da vigência")).toHaveValue("25/08/2026");
    const originalPricePreview = screen
      .getAllByText("R$ 150,00")
      .find((element) => element.classList.contains("line-through"));
    if (!originalPricePreview) throw new Error("Preço original riscado não encontrado");
    expect(originalPricePreview).toHaveClass("line-through");
    expect(screen.getByText("R$ 129,90")).toBeInTheDocument();

    fireEvent.click(promotionalSwitch);

    expect(screen.queryByText("Prévia na loja")).not.toBeInTheDocument();
    expect(screen.queryByText("Valor promocional (R$)")).not.toBeInTheDocument();
  });

  it("formats capacity and duration fields with thousand separators", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const minimumParticipantsInput = getInputByFieldLabel("Participantes (mínimo)");
    const maximumParticipantsInput = getInputByFieldLabel("Participantes (máximo)");
    const durationDaysInput = getInputByFieldLabel("Quantidade de dias");

    fireEvent.change(minimumParticipantsInput, {
      target: { value: "1000" },
    });
    fireEvent.change(maximumParticipantsInput, {
      target: { value: "12412124" },
    });
    fireEvent.change(durationDaysInput, {
      target: { value: "12a34b56" },
    });

    expect(minimumParticipantsInput).toHaveValue("1.000");
    expect(maximumParticipantsInput).toHaveValue("12.412.124");
    expect(durationDaysInput).toHaveValue("123.456");
  });

  it("hides age fields when the age limit switch is disabled", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Participante e termos" }));

    const ageLimitSwitch = screen.getByRole("switch", { name: "Habilitar limite de idade" });
    expect(ageLimitSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByText("Idade mínima")).not.toBeInTheDocument();
    expect(screen.queryByText("Idade máxima")).not.toBeInTheDocument();

    fireEvent.click(ageLimitSwitch);

    expect(ageLimitSwitch).toHaveAttribute("aria-checked", "true");
    expect(getInputByFieldLabel("Idade mínima")).toHaveAttribute("placeholder", "10");
    expect(getInputByFieldLabel("Idade máxima")).toHaveAttribute("placeholder", "65");

    fireEvent.click(ageLimitSwitch);

    expect(ageLimitSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByText("Idade mínima")).not.toBeInTheDocument();
    expect(screen.queryByText("Idade máxima")).not.toBeInTheDocument();
  });

  it("shows participant data fields only when the complete form is selected", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Participante e termos" }));

    const dataSheetSwitch = screen.getByRole("switch", { name: "Exigir ficha de dados" });
    const noFormButton = screen.getByRole("button", { name: /Sem formulário/ });
    const simplifiedButton = screen.getByRole("button", { name: /Simplificado/ });
    const completeButton = screen.getByRole("button", { name: /Completo/ });

    expect(dataSheetSwitch).toHaveAttribute("aria-checked", "true");
    expect(noFormButton).toHaveAttribute("aria-pressed", "true");
    expect(simplifiedButton).toHaveAttribute("aria-pressed", "false");
    expect(completeButton).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByText(
        "Não coleta dados dos participantes, só do pagador. Jornada de compra mais enxuta."
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Peso" })).not.toBeInTheDocument();

    fireEvent.click(completeButton);

    expect(completeButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Peso" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Altura" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Possui restrição alimentar" })).toBeInTheDocument();

    fireEvent.click(simplifiedButton);

    expect(simplifiedButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Peso" })).not.toBeInTheDocument();

    fireEvent.click(dataSheetSwitch);

    expect(dataSheetSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("button", { name: /Sem formulário/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Completo/ })).not.toBeInTheDocument();
  });

  it("applies bullet and numbered lists in the responsibility term editor", () => {
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => false),
    });

    try {
      mockLocationOptionsFetch();
      render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
      fireEvent.click(screen.getByRole("button", { name: "Participante e termos" }));

      const editor = screen.getByRole("textbox", { name: "Texto do termo" });
      const underlineButton = screen.getByRole("button", { name: "Sublinhado" });
      const strikethroughButton = screen.getByRole("button", { name: "Riscar" });
      const bulletListButton = screen.getByRole("button", { name: "Lista com marcadores" });
      const numberedListButton = screen.getByRole("button", { name: "Lista enumerada" });
      expect(editor.className).toContain("[&_ul]:list-disc");
      expect(editor.className).toContain("[&_ol]:list-decimal");
      expect(editor.className).toContain("[&_ul]:pl-5");
      expect(editor.className).toContain("[&_ol]:pl-5");
      expect(
        underlineButton.compareDocumentPosition(strikethroughButton) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(
        bulletListButton.compareDocumentPosition(numberedListButton) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

      fireEvent.click(strikethroughButton);
      expect(document.execCommand).toHaveBeenCalledWith("strikeThrough", false, undefined);

      fireEvent.click(bulletListButton);
      expect(editor.querySelector("ul li")).toBeInTheDocument();

      editor.innerHTML = "";
      fireEvent.input(editor);
      fireEvent.click(numberedListButton);
      expect(editor.querySelector("ol li")).toBeInTheDocument();
    } finally {
      if (originalExecCommand) {
        Object.defineProperty(document, "execCommand", {
          configurable: true,
          value: originalExecCommand,
        });
      } else {
        Reflect.deleteProperty(document, "execCommand");
      }
    }
  });

  it("restores an unsaved new product draft after the page remounts", async () => {
    mockLocationOptionsFetch();
    const { unmount } = render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.change(getInputByFieldLabel("Nome do produto"), {
      target: { value: "Trilha preservada" },
    });
    fireEvent.change(getInputByFieldLabel("Preço por pessoa (R$)"), {
      target: { value: "180,00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Configurações avançadas de estoque" }));
    fireEvent.change(getInputByFieldLabel("SKU (Unidade de Manutenção de Estoque)"), {
      target: { value: "TRI-PRES-001" },
    });
    fireEvent.change(getInputByFieldLabel("Código de barras"), {
      target: { value: "7890001112223" },
    });
    fireEvent.click(screen.getByRole("switch", { name: "Permitir overbooking" }));

    unmount();
    render(<ProdutosPage />);

    expect(screen.getByRole("button", { name: "Salvar rascunho" })).toBeInTheDocument();
    expect(getInputByFieldLabel("Nome do produto")).toHaveValue("Trilha preservada");
    expect(getInputByFieldLabel("Preço por pessoa (R$)")).toHaveValue("180,00");
    expect(getInputByFieldLabel("SKU (Unidade de Manutenção de Estoque)")).toHaveValue(
      "TRI-PRES-001"
    );
    expect(getInputByFieldLabel("Código de barras")).toHaveValue("7890001112223");
    expect(screen.getByRole("switch", { name: "Permitir overbooking" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("closes a new product directly when no registration field changed", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(
      screen.queryByRole("dialog", { name: "Sair sem salvar rascunho?" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo produto" })).toBeInTheDocument();
  });

  it("asks for confirmation before closing a changed new product without saving", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.change(getInputByFieldLabel("Nome do produto"), {
      target: { value: "Trilha sem rascunho" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    const confirmationDialog = screen.getByRole("dialog", { name: "Sair sem salvar rascunho?" });
    expect(
      within(confirmationDialog).getByText(
        "Você preencheu informações deste produto. Deseja prosseguir sem salvar ou salvar o rascunho antes de sair?"
      )
    ).toBeInTheDocument();

    fireEvent.click(within(confirmationDialog).getByRole("button", { name: "Continuar editando" }));
    expect(
      screen.queryByRole("dialog", { name: "Sair sem salvar rascunho?" })
    ).not.toBeInTheDocument();
    expect(getInputByFieldLabel("Nome do produto")).toHaveValue("Trilha sem rascunho");

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Sair sem salvar rascunho?" })).getByRole(
        "button",
        { name: "Sair sem salvar" }
      )
    );

    expect(screen.getByRole("button", { name: "Novo produto" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    expect(getInputByFieldLabel("Nome do produto")).toHaveValue("");
  });

  it("asks for confirmation after only changing the product schedule type", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: /Apenas com evento/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(screen.getByRole("dialog", { name: "Sair sem salvar rascunho?" })).toBeInTheDocument();
  });

  it("shows the specific periods disclaimer and period rules when selected", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    expect(
      screen.queryByText(
        "Cadastre os períodos e os dias em que o produto funciona. Dentro do período vale a regra cadastrada; depois do fim do período, o produto volta a funcionar todos os dias."
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText("PERÍODOS")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Com períodos específicos/ }));

    expect(
      screen.getByText(
        "Cadastre os períodos e os dias em que o produto funciona. Dentro do período vale a regra cadastrada; depois do fim do período, o produto volta a funcionar todos os dias."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("PERÍODOS")).toBeInTheDocument();
    expect(screen.getByText("Período 1")).toBeInTheDocument();
    expect(
      screen.getByText("Sem períodos definidos, sem dias de funcionamento definidos")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar período" }));

    expect(screen.getByText("Período 2")).toBeInTheDocument();
  });

  it("removes product periods with the same confirmation rules as route days", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: /Com períodos específicos/ }));

    expect(screen.getByText("Período 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir Período 1" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar período" }));

    expect(screen.getByText("Período 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Excluir Período 2" }));

    expect(screen.queryByRole("dialog", { name: "Remover período?" })).not.toBeInTheDocument();
    expect(screen.queryByText("Período 2")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir Período 1" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar período" }));
    fireEvent.click(screen.getByRole("button", { name: "Editar Período 2" }));

    const periodDrawer = screen.getByRole("dialog", { name: "Configurar período" });
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const nonLeapYear =
      currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0)
        ? currentYear + 1
        : currentYear;

    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: "11" },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Início do período")).toHaveValue("11/");
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: "1108" },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Início do período")).toHaveValue("11/08/");
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: "11/08/2026" },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Início do período")).toHaveValue("11/08/2026");
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: `00/00/${previousYear}` },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Início do período")).toHaveValue(
      `01/01/${currentYear}`
    );
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: `31/02/${nonLeapYear}` },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Início do período")).toHaveValue(
      `28/02/${nonLeapYear}`
    );
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Fim do período"), {
      target: { value: "31/12/2026abcd99" },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Fim do período")).toHaveValue("31/12/2026");
    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Fim do período"), {
      target: { value: `32/13/${previousYear}` },
    });
    expect(getInputByDialogFieldLabel(periodDrawer, "Fim do período")).toHaveValue(
      `31/12/${currentYear}`
    );
    expect(
      within(periodDrawer).queryByText("Selecione os dias da semana em que funciona")
    ).not.toBeInTheDocument();
    fireEvent.click(
      within(periodDrawer).getByRole("switch", { name: "Definir prazo indeterminado" })
    );
    fireEvent.click(within(periodDrawer).getByRole("button", { name: "Personalizado" }));
    expect(
      within(periodDrawer).getByText("Selecione os dias da semana em que funciona")
    ).toBeInTheDocument();
    fireEvent.click(within(periodDrawer).getByRole("button", { name: "Qua" }));

    const enabledStartTimeInput = within(periodDrawer)
      .getAllByLabelText("Horário de início")
      .find((input) => input instanceof HTMLInputElement && !input.disabled);
    if (!(enabledStartTimeInput instanceof HTMLInputElement)) {
      throw new Error("Input habilitado de horário de início não encontrado");
    }
    const enabledEndTimeInput = within(periodDrawer)
      .getAllByLabelText("Horário de fim")
      .find((input) => input instanceof HTMLInputElement && !input.disabled);
    if (!(enabledEndTimeInput instanceof HTMLInputElement)) {
      throw new Error("Input habilitado de horário de fim não encontrado");
    }

    expect(enabledStartTimeInput).toHaveValue("00:00");
    expect(enabledStartTimeInput).toHaveAttribute("placeholder", "00:00");
    fireEvent.focus(enabledStartTimeInput);
    expect(enabledStartTimeInput).toHaveValue("");
    expect(enabledStartTimeInput).toHaveAttribute("placeholder", "00:00");
    fireEvent.change(enabledStartTimeInput, { target: { value: "1" } });
    expect(enabledStartTimeInput).toHaveValue("1");
    fireEvent.change(enabledStartTimeInput, { target: { value: "123" } });
    expect(enabledStartTimeInput).toHaveValue("12:3");
    fireEvent.change(enabledStartTimeInput, { target: { value: "126" } });
    expect(enabledStartTimeInput).toHaveValue("12:5");
    fireEvent.change(enabledStartTimeInput, { target: { value: "1234" } });
    expect(enabledStartTimeInput).toHaveValue("12:34");
    fireEvent.change(enabledStartTimeInput, { target: { value: "1299" } });
    expect(enabledStartTimeInput).toHaveValue("12:59");
    expect(enabledEndTimeInput).toHaveValue("00:00");
    expect(enabledEndTimeInput).toHaveAttribute("placeholder", "00:00");
    fireEvent.focus(enabledEndTimeInput);
    expect(enabledEndTimeInput).toHaveValue("");
    expect(enabledEndTimeInput).toHaveAttribute("placeholder", "00:00");
    fireEvent.change(enabledEndTimeInput, { target: { value: "12:345abc" } });
    expect(enabledEndTimeInput).toHaveValue("12:34");
    fireEvent.change(enabledEndTimeInput, { target: { value: "29" } });
    expect(enabledEndTimeInput).toHaveValue("23");
    fireEvent.change(enabledEndTimeInput, { target: { value: "2460" } });
    expect(enabledEndTimeInput).toHaveValue("23:59");

    fireEvent.change(getInputByDialogFieldLabel(periodDrawer, "Início do período"), {
      target: { value: "11/08/2026" },
    });
    fireEvent.click(within(periodDrawer).getByRole("button", { name: "Salvar" }));

    expect(
      screen.getByText("11/08/2026 - prazo indeterminado, Personalizado: Qua.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir Período 2" }));

    expect(screen.getByRole("dialog", { name: "Remover período?" })).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Remover período?" })).getByRole("button", {
        name: "Cancelar",
      })
    );

    expect(
      screen.getByText("11/08/2026 - prazo indeterminado, Personalizado: Qua.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir Período 2" }));
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Remover período?" })).getByRole("button", {
        name: "Excluir",
      })
    );

    expect(
      screen.queryByText("11/08/2026 - prazo indeterminado, Personalizado: Qua.")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Período 2")).not.toBeInTheDocument();
  });

  it("saves the draft before leaving from the close confirmation", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.change(getInputByFieldLabel("Nome do produto"), {
      target: { value: "Trilha salva ao sair" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Sair sem salvar rascunho?" })).getByRole(
        "button",
        { name: "Salvar e sair" }
      )
    );

    expect(screen.getByRole("button", { name: "Novo produto" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    expect(getInputByFieldLabel("Nome do produto")).toHaveValue("Trilha salva ao sair");
  });

  it("shows the empty advanced stock chip fallback for blank SKU and barcode", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Configurações avançadas de estoque" }));
    fireEvent.change(getInputByFieldLabel("SKU (Unidade de Manutenção de Estoque)"), {
      target: { value: "" },
    });
    fireEvent.change(getInputByFieldLabel("Código de barras"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Configurações avançadas de estoque" }));

    const advancedStockCard = screen
      .getByRole("button", { name: "Configurações avançadas de estoque" })
      .closest("div");
    if (!advancedStockCard) throw new Error("Configurações avançadas não encontradas");

    expect(within(advancedStockCard).getAllByText("Não preenchida")).toHaveLength(2);
  });

  it("zeros and disables item fields when their checkboxes are selected", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Editar Almoço p/ 4 pessoas" }));

    const itemDrawer = screen.getByRole("dialog", { name: "Configurar item" });
    const valueInput = getInputByDialogFieldLabel(itemDrawer, "Valor (R$)");
    const dailyLimitInput = getInputByDialogFieldLabel(itemDrawer, "Limite por dia");
    const complimentaryCheckbox = within(itemDrawer).getByRole("checkbox", {
      name: "Item cortesia",
    });
    const itemStockCheckbox = within(itemDrawer).getByRole("checkbox", {
      name: "Usar estoque do item",
    });

    expect(valueInput).toHaveValue("R$ 12,00");
    expect(valueInput).not.toBeDisabled();
    expect(dailyLimitInput).toHaveValue("12");
    expect(dailyLimitInput).not.toBeDisabled();

    fireEvent.click(complimentaryCheckbox);

    expect(valueInput).toHaveValue("R$ 0,00");
    expect(valueInput).toBeDisabled();

    fireEvent.click(complimentaryCheckbox);

    expect(valueInput).toHaveValue("R$ 0,00");
    expect(valueInput).not.toBeDisabled();

    fireEvent.click(complimentaryCheckbox);
    fireEvent.click(itemStockCheckbox);

    expect(valueInput).toHaveValue("R$ 0,00");
    expect(valueInput).toBeDisabled();
    expect(dailyLimitInput).toHaveValue("0");
    expect(dailyLimitInput).toBeDisabled();

    fireEvent.click(within(itemDrawer).getByRole("button", { name: "Salvar" }));

    expect(
      screen.getByText("Item incluso na compra, usa estoque do item, cortesia.")
    ).toBeInTheDocument();
  });

  it("creates an empty item card when adding a product item", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    fireEvent.click(screen.getByRole("button", { name: "Excluir Almoço p/ 4 pessoas" }));

    const removeItemDialog = screen.getByRole("dialog", { name: "Remover item?" });
    fireEvent.click(within(removeItemDialog).getByRole("button", { name: "Excluir" }));

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(
      screen.getByText("Sem item cadastrado, sem valor definido, sem limite por dia.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar Item 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir Item 1" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar item" }));

    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(
      screen.getAllByText("Sem item cadastrado, sem valor definido, sem limite por dia.")
    ).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Excluir Item 2" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Editar Item 2" }));

    const itemDrawer = screen.getByRole("dialog", { name: "Configurar item" });
    expect(getInputByDialogFieldLabel(itemDrawer, "Valor (R$)")).toHaveValue("");
    expect(getInputByDialogFieldLabel(itemDrawer, "Limite por dia")).toHaveValue("");
  });

  it("shows the product collaborators assignment section from the Figma flow", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const itemsLabel = screen.getByText("Itens do produto");
    const collaboratorsLabel = screen.getByText("COLABORADORES");
    expect(
      Boolean(
        itemsLabel.compareDocumentPosition(collaboratorsLabel) & Node.DOCUMENT_POSITION_FOLLOWING
      )
    ).toBe(true);

    expect(screen.getByText("Habilitar atribuição de colaboradores")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Os colaboradores vinculados aqui ficam alocados automaticamente em toda reserva deste produto. Para equipes que variam, deixe desabilitado e escale pela agenda."
      )
    ).toBeInTheDocument();
    const collaboratorCombobox = screen.getByRole("combobox", {
      name: "Buscar ou adicionar membro",
    });
    expect(collaboratorCombobox).toHaveTextContent("Buscar ou adicionar membro");
    expect(collaboratorCombobox).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Nenhum colaborador escalado")).toBeInTheDocument();
    expect(
      screen.getByText("Busque e adicione os colaboradores responsáveis por esta saída.")
    ).toBeInTheDocument();

    fireEvent.click(collaboratorCombobox);

    expect(collaboratorCombobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Carlos Henrique Mendes de Carvalho")).toBeInTheDocument();
    expect(screen.getByText("Ana Carolina Oliveira Vasconcelos")).toBeInTheDocument();
    expect(screen.getAllByText("Alocado em outra atividade no mesmo horário")).toHaveLength(3);
    expect(screen.getAllByText("Disponível para a atividade")).toHaveLength(3);
    expect(screen.getByText("CH")).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Ana Carolina Oliveira Vasconcelos"));

    expect(collaboratorCombobox).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Nenhum colaborador escalado")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Busque e adicione os colaboradores responsáveis por esta saída.")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Ana Carolina Oliveira Vasconcelos")).toBeInTheDocument();
    expect(screen.getByText("Colaborador fixo")).toBeInTheDocument();
    expect(screen.getByText("Seguro contratado")).toBeInTheDocument();
    const collaboratorActionsButton = screen.getByRole("button", {
      name: "Ações de Ana Carolina Oliveira Vasconcelos",
    });
    expect(collaboratorActionsButton.className).toContain("size-8");
    expect(collaboratorActionsButton.querySelector("svg")).toHaveAttribute("width", "16");
    fireEvent.pointerDown(collaboratorActionsButton, {
      button: 0,
      ctrlKey: false,
    });

    fireEvent.click(screen.getByRole("menuitem", { name: "Desfazer seguro" }));

    expect(screen.queryByText("Seguro contratado")).not.toBeInTheDocument();
    expect(screen.getByText("Colaborador fixo")).toBeInTheDocument();
    expect(screen.getByText("Sem seguro")).toHaveClass("text-[#DC6803]");

    fireEvent.pointerDown(collaboratorActionsButton, {
      button: 0,
      ctrlKey: false,
    });

    expect(screen.getByRole("menuitem", { name: "Contratar seguro" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Colab. fixo/ })).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Colaborador fixo Ana Carolina Oliveira Vasconcelos" })
    ).toHaveAttribute("aria-checked", "true");
    fireEvent.click(
      screen.getByRole("switch", { name: "Colaborador fixo Ana Carolina Oliveira Vasconcelos" })
    );

    expect(screen.getByRole("menuitem", { name: /Colab. não fixo/ })).toBeInTheDocument();
    expect(screen.queryByText("Colaborador fixo")).not.toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Colaborador fixo Ana Carolina Oliveira Vasconcelos" })
    ).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByRole("menuitem", { name: "Contratar seguro" }));

    expect(screen.getByText("Seguro contratado")).toBeInTheDocument();
    expect(screen.queryByText("Sem seguro")).not.toBeInTheDocument();

    fireEvent.click(collaboratorCombobox);
    fireEvent.click(screen.getByText("Pedro Augusto Santos de Almeida"));

    expect(screen.getByText("Ana Carolina Oliveira Vasconcelos")).toBeInTheDocument();
    expect(screen.getByText("Pedro Augusto Santos de Almeida")).toBeInTheDocument();
    expect(screen.getAllByText("Seguro contratado")).toHaveLength(2);
    expect(screen.getByText("Colaborador fixo")).toBeInTheDocument();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Ações de Ana Carolina Oliveira Vasconcelos" }),
      {
        button: 0,
        ctrlKey: false,
      }
    );

    expect(screen.getByRole("menuitem", { name: "Ligar via WhatsApp" })).toBeInTheDocument();
    const removeCollaboratorItem = screen.getByRole("menuitem", {
      name: "Remover colaborador",
    });
    expect(removeCollaboratorItem).toBeInTheDocument();
    expect(removeCollaboratorItem).toHaveStyle({ color: "#F04438" });
    for (const path of removeCollaboratorItem.querySelectorAll("svg path")) {
      expect(path).toHaveAttribute("stroke", "#F04438");
    }

    fireEvent.click(removeCollaboratorItem);

    expect(screen.queryByText("Ana Carolina Oliveira Vasconcelos")).not.toBeInTheDocument();
    expect(screen.getByText("Pedro Augusto Santos de Almeida")).toBeInTheDocument();
    expect(screen.queryByText("Nenhum colaborador escalado")).not.toBeInTheDocument();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Ações de Pedro Augusto Santos de Almeida" }),
      {
        button: 0,
        ctrlKey: false,
      }
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Remover colaborador" }));

    expect(screen.queryByText("Pedro Augusto Santos de Almeida")).not.toBeInTheDocument();
    expect(screen.getByText("Nenhum colaborador escalado")).toBeInTheDocument();
    expect(
      screen.getByText("Busque e adicione os colaboradores responsáveis por esta saída.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Habilitar atribuição de colaboradores" }));

    expect(
      screen.queryByRole("combobox", { name: "Buscar ou adicionar membro" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Ana Carolina Oliveira Vasconcelos")).not.toBeInTheDocument();
  });

  it("adds empty route cards and keeps a default route after deleting all configured days", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    expect(screen.getByText("Dia 1")).toBeInTheDocument();
    expect(screen.getByText("Trilha Pico do Itacolomi")).toBeInTheDocument();
    expect(
      screen.getByText("15:45 - 18:30, Carro 3 (produto), obrigatório, R$ 250,00 (por pessoa).")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir Dia 1" }));

    const confirmationDialog = screen.getByRole("dialog", { name: "Remover roteiro?" });
    expect(
      within(confirmationDialog).getByText("Esta ação não poderá ser desfeita.")
    ).toBeInTheDocument();
    fireEvent.click(within(confirmationDialog).getByRole("button", { name: "Excluir" }));

    expect(screen.getByText("Dia 1")).toBeInTheDocument();
    expect(
      screen.getByText("Sem horários definidos, sem produto selecionado, sem capacidade atribuída.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("15:45 - 18:30, Carro 3 (produto), obrigatório, R$ 250,00 (por pessoa).")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar Dia 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir Dia 1" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar roteiro" }));

    expect(screen.getByText("Dia 2")).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Sem horários definidos, sem produto selecionado, sem capacidade atribuída."
      )
    ).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Editar Dia 2" }));

    const routeDrawer = screen.getByRole("dialog", { name: "Configurar roteiro dia 2" });
    const routeStartInput = getInputByDialogFieldLabel(routeDrawer, "Início");
    const routeEndInput = getInputByDialogFieldLabel(routeDrawer, "Fim");

    fireEvent.change(routeStartInput, {
      target: { value: "123" },
    });
    expect(routeStartInput).toHaveValue("12:3");
    fireEvent.change(routeEndInput, {
      target: { value: "2960" },
    });
    expect(routeEndInput).toHaveValue("23:59");
    fireEvent.change(routeStartInput, {
      target: { value: "" },
    });
    fireEvent.change(routeEndInput, {
      target: { value: "" },
    });
    fireEvent.change(getInputByDialogFieldLabel(routeDrawer, "Título"), {
      target: { value: "Passeio da tarde" },
    });
    fireEvent.click(within(routeDrawer).getByRole("button", { name: "Salvar" }));

    expect(screen.getByText("Dia 2")).toBeInTheDocument();
    expect(screen.getByText("Passeio da tarde")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Sem horário, sem produto selecionado (produto), obrigatório, R$ 0,00 (por pessoa)."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir Dia 2" }));

    expect(screen.getByRole("dialog", { name: "Remover roteiro?" })).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Remover roteiro?" })).getByRole("button", {
        name: "Cancelar",
      })
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar Dia 2" }));
    const routeDrawerAfterCancel = screen.getByRole("dialog", { name: "Configurar roteiro dia 2" });
    fireEvent.change(getInputByDialogFieldLabel(routeDrawerAfterCancel, "Título"), {
      target: { value: "" },
    });
    fireEvent.click(within(routeDrawerAfterCancel).getByRole("button", { name: "Salvar" }));

    fireEvent.click(screen.getByRole("button", { name: "Excluir Dia 2" }));

    expect(screen.queryByRole("dialog", { name: "Remover roteiro?" })).not.toBeInTheDocument();
    expect(screen.queryByText("Dia 2")).not.toBeInTheDocument();
    expect(
      screen.getByText("Sem horários definidos, sem produto selecionado, sem capacidade atribuída.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar Dia 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir Dia 1" })).not.toBeInTheDocument();
  });

  it("keeps route cards in the reordered position after dropping them", () => {
    const originalSetPointerCapture = window.HTMLElement.prototype.setPointerCapture;
    const originalHasPointerCapture = window.HTMLElement.prototype.hasPointerCapture;
    const originalReleasePointerCapture = window.HTMLElement.prototype.releasePointerCapture;
    const originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;

    Object.defineProperty(window.HTMLElement.prototype, "setPointerCapture", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window.HTMLElement.prototype, "hasPointerCapture", {
      configurable: true,
      value: vi.fn(() => true),
    });
    Object.defineProperty(window.HTMLElement.prototype, "releasePointerCapture", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: function getBoundingClientRect(this: HTMLElement) {
        const card = this.closest('[data-route-day-card="true"]') ?? this;
        const cardText = card.textContent ?? "";

        if (cardText.includes("Trilha Pico do Itacolomi")) {
          return DOMRect.fromRect({ x: 0, y: 0, width: 600, height: 300 });
        }

        if (cardText.includes("Sem horários definidos")) {
          return DOMRect.fromRect({ x: 0, y: 320, width: 600, height: 40 });
        }

        return originalGetBoundingClientRect.call(this);
      },
    });

    try {
      mockLocationOptionsFetch();
      const { container } = render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
      fireEvent.click(screen.getByRole("button", { name: "Adicionar roteiro" }));

      const getRouteCards = () =>
        Array.from(container.querySelectorAll('[data-route-day-card="true"]')).map(
          (card) => card.textContent?.replace(/\s+/g, " ").trim() ?? ""
        );

      expect(getRouteCards()[0]).toContain("Trilha Pico do Itacolomi");
      expect(getRouteCards()[1]).toContain("Sem horários definidos");

      const reorderButton = screen.getByRole("button", { name: "Reordenar Dia 1" });

      fireEvent.pointerDown(reorderButton, { pointerId: 1, clientY: 150 });
      fireEvent.pointerUp(reorderButton, { pointerId: 1, clientY: 250 });

      expect(getRouteCards()[0]).toContain("Sem horários definidos");
      expect(getRouteCards()[1]).toContain("Trilha Pico do Itacolomi");
    } finally {
      Object.defineProperty(window.HTMLElement.prototype, "setPointerCapture", {
        configurable: true,
        value: originalSetPointerCapture,
      });
      Object.defineProperty(window.HTMLElement.prototype, "hasPointerCapture", {
        configurable: true,
        value: originalHasPointerCapture,
      });
      Object.defineProperty(window.HTMLElement.prototype, "releasePointerCapture", {
        configurable: true,
        value: originalReleasePointerCapture,
      });
      Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
        configurable: true,
        value: originalGetBoundingClientRect,
      });
    }
  });

  it("anchors checklist items to their related form sections", () => {
    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    const originalScrollTo = window.HTMLElement.prototype.scrollTo;
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    try {
      mockLocationOptionsFetch();
      render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

      fireEvent.click(screen.getByRole("button", { name: "Tipo e nome do produto" }));
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "smooth",
        top: expect.any(Number),
      });
      expect(screen.getByRole("button", { name: "Informações do produto" })).toHaveAttribute(
        "aria-current",
        "step"
      );

      fireEvent.click(screen.getByRole("button", { name: "Configurar horário" }));
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "smooth",
        top: expect.any(Number),
      });
      expect(screen.getByRole("button", { name: "Programação e vagas" })).toHaveAttribute(
        "aria-current",
        "step"
      );

      fireEvent.click(screen.getByRole("button", { name: "Ao menos 1 canal de venda" }));
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "smooth",
        top: expect.any(Number),
      });
      expect(screen.getByRole("button", { name: "Configurações adicionais" })).toHaveAttribute(
        "aria-current",
        "step"
      );
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      if (originalScrollTo) {
        Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
          configurable: true,
          value: originalScrollTo,
        });
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, "scrollTo");
      }
      if (originalScrollIntoView) {
        Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
          configurable: true,
          value: originalScrollIntoView,
        });
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, "scrollIntoView");
      }
    }
  });

  it("updates the active product step when the visible section changes", () => {
    const originalGetBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;

    Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: function getBoundingClientRect(this: HTMLElement) {
        if (this.tagName === "MAIN") return new DOMRect(0, 0, 900, 700);

        switch (this.id) {
          case "produto-info":
            return new DOMRect(0, -1_500, 774, 600);
          case "produto-schedule":
            return new DOMRect(0, -620, 774, 560);
          case "produto-pricing":
            return new DOMRect(0, 24, 774, 620);
          case "produto-participant":
            return new DOMRect(0, 720, 774, 420);
          case "produto-communication":
            return new DOMRect(0, 1_180, 774, 360);
          case "produto-settings":
            return new DOMRect(0, 1_580, 774, 360);
          default:
            return originalGetBoundingClientRect.call(this);
        }
      },
    });

    try {
      mockLocationOptionsFetch();
      render(<ProdutosPage />);

      fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
      expect(screen.getByRole("button", { name: "Informações do produto" })).toHaveAttribute(
        "aria-current",
        "step"
      );

      fireEvent.scroll(screen.getByRole("main"));

      expect(screen.getByRole("button", { name: "Preço e pagamento" })).toHaveAttribute(
        "aria-current",
        "step"
      );
      expect(screen.getByRole("button", { name: "Informações do produto" })).not.toHaveAttribute(
        "aria-current"
      );
    } finally {
      Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
        configurable: true,
        value: originalGetBoundingClientRect,
      });
    }
  });

  it("renders the product settings title in the new product stepper", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const stepperTitle = screen.getByRole("heading", {
      name: "Configurações do produto",
    });
    expect(stepperTitle).toHaveClass(
      "font-['Helvetica_Neue:Regular',sans-serif]",
      "text-base",
      "text-[#181d27]"
    );
  });

  it("renders the Figma-defined communication template editors in the new product flow", async () => {
    const user = userEvent.setup();
    const execCommandSpy = vi.fn(() => true);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommandSpy,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    expect(screen.getByRole("heading", { name: "Comunicação" })).toBeInTheDocument();
    expect(
      screen.getByText("Avisos automáticos para o cliente antes e depois da experiência.")
    ).toBeInTheDocument();

    expect(screen.getByRole("switch", { name: "Habilitar envio de e-mail" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByText("Template de e-mail")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmação de reserva após pagamento").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("textbox", { name: "Conteúdo de Template de e-mail" })
    ).toHaveTextContent("Olá");

    expect(
      screen.getByRole("switch", { name: "Habilitar envio de mensagem via WhatsApp" })
    ).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Template de mensagem")).toBeInTheDocument();
    expect(screen.getAllByText("Lembrete curto").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("textbox", { name: "Conteúdo de Template de mensagem" })
    ).toHaveTextContent("Lembrete");

    expect(screen.getAllByRole("button", { name: "Central de Comunicação" })).toHaveLength(2);
    expect(screen.getAllByText("{participante_nome}")).toHaveLength(2);

    const emailEditor = screen.getByRole("textbox", { name: "Conteúdo de Template de e-mail" });
    const emailSourceButton = screen.getByRole("button", {
      name: "Ver código fonte em Template de e-mail",
    });
    const emailAssistantButton = screen.getByRole("button", {
      name: "Assistente de escrita em Template de e-mail",
    });
    expect(
      emailSourceButton.compareDocumentPosition(emailAssistantButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(emailSourceButton).not.toBeDisabled();

    emailEditor.innerHTML = "";
    fireEvent.input(emailEditor);
    expect(emailSourceButton).toBeDisabled();

    emailEditor.innerHTML = "<p>Código <strong>fonte</strong></p>";
    fireEvent.input(emailEditor);
    expect(emailSourceButton).not.toBeDisabled();

    fireEvent.click(emailSourceButton);
    const sourceDialog = screen.getByRole("dialog", {
      name: "Código fonte de Template de e-mail",
    });
    const sourceTextarea = within(sourceDialog).getByLabelText("Código fonte");
    expect(sourceTextarea).toHaveValue("<p>Código <strong>fonte</strong></p>");

    fireEvent.change(sourceTextarea, {
      target: { value: "<p>Conteúdo editado pelo código</p>" },
    });
    expect(emailEditor.innerHTML).toBe("<p>Conteúdo editado pelo código</p>");
    fireEvent.click(within(sourceDialog).getByRole("button", { name: "Copiar código" }));
    expect(writeText).toHaveBeenCalledWith("<p>Conteúdo editado pelo código</p>");
    expect(
      within(sourceDialog).getByRole("button", { name: "Código copiado" })
    ).toBeInTheDocument();
    fireEvent.click(within(sourceDialog).getByRole("button", { name: "Fechar" }));

    fireEvent.click(screen.getByRole("button", { name: "Cor do texto em Template de e-mail" }));

    expect(screen.getByRole("tab", { name: "Texto" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Fundo" })).toBeInTheDocument();
    expect(screen.getByText("Cor personalizada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restaurar padrão" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Selecionar cor muito escuro acinzentado azul" })[0]
    ).toHaveClass("hover:ring-2", "hover:ring-[#d5d7da]");

    await user.click(screen.getByRole("tab", { name: "Fundo" }));

    expect(screen.getByRole("tab", { name: "Fundo" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Cor de fundo personalizada")).toBeInTheDocument();
    const lightYellowBackgroundButton = screen.getByRole("button", {
      name: "Selecionar cor de fundo amarelo claro",
    });
    expect(lightYellowBackgroundButton).toHaveClass(
      "size-5",
      "rounded-full",
      "hover:ring-2",
      "hover:ring-[#d5d7da]"
    );

    await user.click(lightYellowBackgroundButton);

    emailEditor.innerHTML =
      '<span style="background-color: rgb(254, 228, 226);">Texto com fundo</span>';
    fireEvent.input(emailEditor);
    fireEvent.click(screen.getByRole("button", { name: "Cor do texto em Template de e-mail" }));
    await user.click(screen.getByRole("tab", { name: "Fundo" }));

    const highlightedText = emailEditor.querySelector("span")?.firstChild;
    if (!(highlightedText instanceof Text)) {
      throw new Error("Texto com fundo não encontrado no editor de e-mail");
    }
    const highlightedRange = document.createRange();
    highlightedRange.selectNodeContents(highlightedText);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(highlightedRange);
    const focusSpy = vi.spyOn(emailEditor, "focus").mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole("button", { name: "Restaurar padrão" }));
    focusSpy.mockRestore();

    expect(emailEditor.innerHTML).toContain("Texto com fundo");
    expect(emailEditor.innerHTML).not.toContain("background-color");

    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: originalExecCommand,
      });
    } else {
      Reflect.deleteProperty(document, "execCommand");
    }
  });

  it("hides communication template controls when the channel switch is disabled", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    const emailSwitch = screen.getByRole("switch", { name: "Habilitar envio de e-mail" });
    const whatsappSwitch = screen.getByRole("switch", {
      name: "Habilitar envio de mensagem via WhatsApp",
    });

    fireEvent.click(emailSwitch);

    expect(emailSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByText("Template de e-mail")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Conteúdo de Template de e-mail" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Template de mensagem")).toBeInTheDocument();

    fireEvent.click(whatsappSwitch);

    expect(whatsappSwitch).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByText("Template de mensagem")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Conteúdo de Template de mensagem" })
    ).not.toBeInTheDocument();

    fireEvent.click(emailSwitch);

    expect(emailSwitch).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Template de e-mail")).toBeInTheDocument();
  });

  it("inserts communication template links from the toolbar popover", async () => {
    const user = userEvent.setup();
    const execCommandSpy = vi.fn((_commandId: string, _showUI?: boolean, _value?: string) => true);
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommandSpy,
    });

    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));
    fireEvent.click(screen.getByRole("button", { name: "Adicionar link em Template de e-mail" }));

    expect(screen.getByRole("dialog")).toHaveClass("w-[302px]");
    const displayTextInput = screen.getByLabelText("Texto a ser exibido");
    expect(displayTextInput).toBeInTheDocument();
    expect(displayTextInput).not.toHaveFocus();
    expect(screen.getByLabelText("URL de destino")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Abrir em uma nova janela" })).toBeInTheDocument();

    await user.type(displayTextInput, "Ver detalhes");
    await user.type(screen.getByLabelText("URL de destino"), "https://retrilhar.com/produto");
    await user.click(screen.getByRole("checkbox", { name: "Abrir em uma nova janela" }));
    await user.click(screen.getByRole("button", { name: "Inserir link" }));

    const insertHtmlCall = execCommandSpy.mock.calls.find(([command]) => command === "insertHTML");
    expect(insertHtmlCall).toEqual([
      "insertHTML",
      false,
      '<a href="https://retrilhar.com/produto" target="_blank" rel="noopener noreferrer">Ver detalhes</a>',
    ]);
    expect(screen.queryByLabelText("Texto a ser exibido")).not.toBeInTheDocument();

    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: originalExecCommand,
      });
    } else {
      Reflect.deleteProperty(document, "execCommand");
    }
  });

  it("exposes an expanded emoji library in the communication template toolbar", async () => {
    const user = userEvent.setup();
    const execCommandSpy = vi.fn((_commandId: string, _showUI?: boolean, _value?: string) => true);
    const originalExecCommand = document.execCommand;
    const scrollIntoViewSpy = vi.fn();
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommandSpy,
    });
    Element.prototype.scrollIntoView = scrollIntoViewSpy;

    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));
    await user.click(
      screen.getByRole("button", { name: "Biblioteca de emojis em Template de e-mail" })
    );

    expect(screen.getByRole("tablist", { name: "Categorias de emoji" })).toBeInTheDocument();
    expect(screen.getByText("Smileys e pessoas")).toBeInTheDocument();
    expect(screen.getByText("Bandeiras")).toBeInTheDocument();
    expect(screen.getAllByRole("option").length).toBeGreaterThan(1000);
    expect(screen.getAllByRole("option")[0]).toHaveStyle({
      fontFamily:
        '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif',
    });

    await user.click(screen.getByRole("tab", { name: "Bandeiras" }));
    expect(scrollIntoViewSpy).toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Bandeiras" })).toHaveAttribute("aria-selected", "true");

    const emojiLabels = screen
      .getAllByRole("option")
      .map((option) => option.getAttribute("aria-label") ?? "");
    expect(emojiLabels.some((label) => label.includes(String.fromCodePoint(0x1f3fb)))).toBe(false);
    expect(emojiLabels.some((label) => label.includes("🫈"))).toBe(false);

    expect(
      screen.queryByRole("option", {
        name: new RegExp(String.fromCodePoint(0x1f10d), "u"),
      })
    ).not.toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Buscar emoji" }), "brasil");
    await user.click(screen.getByRole("option", { name: /brasil.*🇧🇷/i }));

    expect(execCommandSpy).toHaveBeenCalledWith("insertText", false, "🇧🇷");

    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: originalExecCommand,
      });
    } else {
      Reflect.deleteProperty(document, "execCommand");
    }
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  it("inserts and removes accordion blocks from the rich text editor", () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    const emailEditor = screen.getByRole("textbox", { name: "Conteúdo de Template de e-mail" });
    const orderedListButton = screen.getByRole("button", {
      name: "Lista enumerada em Template de e-mail",
    });
    const accordionButton = screen.getByRole("button", {
      name: "Adicionar acordeão em Template de e-mail",
    });

    expect(
      orderedListButton.compareDocumentPosition(accordionButton) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    fireEvent.click(accordionButton);

    const accordion = emailEditor.querySelector<HTMLElement>("[data-editor-accordion-wrapper]");
    if (!accordion) throw new Error("Acordeão não foi inserido no editor");

    const reorderHandle = accordion.querySelector<HTMLButtonElement>(
      "[data-editor-accordion-reorder-handle]"
    );
    if (!reorderHandle) throw new Error("Ícone de reordenar do acordeão não foi encontrado");

    const deleteAccordionButton = screen.getByRole("button", { name: "Excluir acordeão" });
    expect(accordion).toContainElement(reorderHandle);
    expect(accordion).toContainElement(deleteAccordionButton);
    expect(reorderHandle).toHaveAttribute("aria-label", "Reordenar acordeão");
    expect(reorderHandle).toBeDisabled();
    expect(reorderHandle.style.left).toBe("12px");
    expect(reorderHandle.style.top).toBe("12px");
    expect(deleteAccordionButton).toBeVisible();
    expect(deleteAccordionButton.style.right).toBe("8px");
    expect(deleteAccordionButton.style.top).toBe("8px");
    expect(deleteAccordionButton.style.width).toBe("32px");
    expect(deleteAccordionButton.style.height).toBe("32px");
    expect(deleteAccordionButton.style.borderRadius).toBe("10px");

    const accordionTitle = accordion.querySelector<HTMLElement>("[data-editor-accordion-title]");
    const accordionAnswer = accordion.querySelector<HTMLElement>("[data-editor-accordion-answer]");
    if (!accordionTitle || !accordionAnswer) {
      throw new Error("Campos editáveis do acordeão não foram encontrados");
    }
    expect(accordionTitle).toHaveAttribute("data-placeholder", "Título do acordeão");
    expect(accordionTitle).toHaveAttribute("aria-placeholder", "Título do acordeão");
    expect(accordionTitle.textContent).toBe("");
    expect(accordionAnswer).toHaveAttribute(
      "data-placeholder",
      "Escreva a resposta do acordeão aqui."
    );
    expect(accordionAnswer).toHaveAttribute(
      "aria-placeholder",
      "Escreva a resposta do acordeão aqui."
    );
    expect(accordionAnswer.textContent).toBe("");

    fireEvent.click(accordionTitle);
    expect(accordionTitle.textContent).toBe("");
    fireEvent.click(accordionAnswer);
    expect(accordionAnswer.textContent).toBe("");

    const accordionTitleRange = document.createRange();
    accordionTitleRange.selectNodeContents(accordionTitle);
    accordionTitleRange.collapse(false);
    const accordionSelection = window.getSelection();
    accordionSelection?.removeAllRanges();
    accordionSelection?.addRange(accordionTitleRange);

    fireEvent.click(accordionButton);

    const insertedAccordions = Array.from(
      emailEditor.querySelectorAll<HTMLElement>("[data-editor-accordion-wrapper]")
    );
    expect(insertedAccordions).toHaveLength(2);
    expect(insertedAccordions[0]?.parentElement).toBe(emailEditor);
    expect(insertedAccordions[1]?.parentElement).toBe(emailEditor);
    expect(
      insertedAccordions.every(
        (insertedAccordion) =>
          insertedAccordion.querySelector("[data-editor-accordion-reorder-handle]") &&
          insertedAccordion.querySelector("[data-editor-accordion-delete]")
      )
    ).toBe(true);
    const firstInsertedAccordion = insertedAccordions[0];
    const secondInsertedAccordion = insertedAccordions[1];
    if (!firstInsertedAccordion || !secondInsertedAccordion) {
      throw new Error("Acordeões inseridos não foram encontrados");
    }
    const firstReorderButton = firstInsertedAccordion.querySelector<HTMLButtonElement>(
      "[data-editor-accordion-reorder-handle]"
    );
    const secondReorderButton = secondInsertedAccordion.querySelector<HTMLButtonElement>(
      "[data-editor-accordion-reorder-handle]"
    );
    if (!firstReorderButton || !secondReorderButton) {
      throw new Error("Ações de reordenar dos acordeões não foram encontradas");
    }
    expect(firstReorderButton).not.toBeDisabled();
    expect(secondReorderButton).not.toBeDisabled();

    fireEvent.click(secondReorderButton);

    const reorderedAccordions = Array.from(
      emailEditor.querySelectorAll<HTMLElement>("[data-editor-accordion-wrapper]")
    );
    expect(reorderedAccordions[0]).toBe(secondInsertedAccordion);
    expect(reorderedAccordions[1]).toBe(firstInsertedAccordion);

    const secondAccordionDeleteButton = secondInsertedAccordion.querySelector<HTMLButtonElement>(
      "[data-editor-accordion-delete]"
    );
    if (!secondAccordionDeleteButton) {
      throw new Error("Ação de excluir do segundo acordeão não foi encontrada");
    }
    fireEvent.click(secondAccordionDeleteButton);
    expect(emailEditor.querySelectorAll("[data-editor-accordion-wrapper]")).toHaveLength(1);
    expect(reorderHandle).toBeDisabled();

    accordionTitle.textContent = "O que está incluso?";
    accordionAnswer.textContent = "Transporte, guia e suporte durante a experiência.";
    fireEvent.input(emailEditor);

    const emailSourceButton = screen.getByRole("button", {
      name: "Ver código fonte em Template de e-mail",
    });
    fireEvent.click(emailSourceButton);

    const sourceDialog = screen.getByRole("dialog", {
      name: "Código fonte de Template de e-mail",
    });
    const sourceTextarea = within(sourceDialog).getByLabelText("Código fonte");
    if (!(sourceTextarea instanceof HTMLTextAreaElement)) {
      throw new Error("Textarea do código fonte não foi encontrado");
    }
    expect(sourceTextarea.value).toContain("O que está incluso?");
    expect(sourceTextarea.value).toContain("Transporte, guia e suporte durante a experiência.");
    expect(sourceTextarea.value).not.toContain("data-editor-accordion-delete");
    expect(sourceTextarea.value).not.toContain("data-editor-accordion-reorder-handle");
    fireEvent.click(within(sourceDialog).getByRole("button", { name: "Fechar" }));

    fireEvent.pointerDown(accordion, { button: 0 });
    expect(screen.getByRole("button", { name: "Excluir acordeão" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Excluir acordeão" }));

    expect(emailEditor.querySelector("[data-editor-accordion-wrapper]")).toBeNull();

    fireEvent.click(accordionButton);
    const keyboardAccordion = emailEditor.querySelector<HTMLElement>(
      "[data-editor-accordion-wrapper]"
    );
    if (!keyboardAccordion) throw new Error("Acordeão não foi reinserido no editor");

    fireEvent.pointerDown(keyboardAccordion, { button: 0 });
    expect(screen.getByRole("button", { name: "Excluir acordeão" })).toBeVisible();
    fireEvent.keyDown(emailEditor, { key: "Delete" });

    expect(emailEditor.querySelector("[data-editor-accordion-wrapper]")).toBeNull();
  });

  it("shows toolbar tooltips with standard shortcuts and handles editor shortcuts", async () => {
    const user = userEvent.setup();
    const execCommandSpy = vi.fn((_commandId: string, _showUI?: boolean, _value?: string) => true);
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommandSpy,
    });

    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));
    fireEvent.click(screen.getByRole("button", { name: "Comunicação" }));

    await user.hover(screen.getByRole("button", { name: "Negrito em Template de e-mail" }));
    expect((await screen.findAllByText("Negrito")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ctrl/Cmd + B").length).toBeGreaterThan(0);

    await user.hover(screen.getByRole("button", { name: "Riscar em Template de e-mail" }));
    expect((await screen.findAllByText("Riscar")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ctrl/Cmd + Shift + X").length).toBeGreaterThan(0);

    await user.hover(screen.getByRole("button", { name: "Adicionar link em Template de e-mail" }));
    expect((await screen.findAllByText("Adicionar link")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ctrl/Cmd + K").length).toBeGreaterThan(0);

    const emailEditor = screen.getByRole("textbox", { name: "Conteúdo de Template de e-mail" });
    const emailUnderlineButton = screen.getByRole("button", {
      name: "Sublinhado em Template de e-mail",
    });
    const emailStrikethroughButton = screen.getByRole("button", {
      name: "Riscar em Template de e-mail",
    });
    expect(
      emailUnderlineButton.compareDocumentPosition(emailStrikethroughButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    fireEvent.click(emailStrikethroughButton);
    expect(execCommandSpy).toHaveBeenCalledWith("strikeThrough", false, undefined);

    fireEvent.keyDown(emailEditor, {
      code: "KeyX",
      ctrlKey: true,
      key: "x",
      shiftKey: true,
    });
    expect(execCommandSpy).toHaveBeenCalledWith("strikeThrough", false, undefined);

    fireEvent.keyDown(emailEditor, { code: "KeyB", ctrlKey: true, key: "b" });
    expect(execCommandSpy).toHaveBeenCalledWith("bold", false, undefined);

    fireEvent.keyDown(emailEditor, { code: "KeyK", ctrlKey: true, key: "k" });
    expect(screen.getByLabelText("Texto a ser exibido")).toBeInTheDocument();
    expect(screen.getByLabelText("URL de destino")).toBeInTheDocument();

    const bulletEditor = screen.getByRole("textbox", { name: "Conteúdo de Template de e-mail" });
    expect(bulletEditor.className).toContain("[&_ul]:list-disc");
    expect(bulletEditor.className).toContain("[&_ol]:list-decimal");
    expect(bulletEditor.className).toContain("[&_ul]:pl-5");
    expect(bulletEditor.className).toContain("[&_ol]:pl-5");
    bulletEditor.innerHTML = "<p>Levar documento</p>";
    const bulletRange = document.createRange();
    const bulletText = bulletEditor.querySelector("p")?.firstChild;
    if (!bulletText) throw new Error("Texto para lista com marcadores não encontrado");
    bulletRange.setStart(bulletText, "Levar ".length);
    bulletRange.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(bulletRange);
    fireEvent.click(
      screen.getByRole("button", { name: "Lista com marcadores em Template de e-mail" })
    );
    expect(bulletEditor.innerHTML).toContain("<ul>");
    expect(bulletEditor.innerHTML).toContain("<li>Levar documento</li>");

    bulletEditor.innerHTML = "<p>Chegar cedo</p>";
    const orderedRange = document.createRange();
    const orderedText = bulletEditor.querySelector("p")?.firstChild;
    if (!orderedText) throw new Error("Texto para lista enumerada não encontrado");
    orderedRange.setStart(orderedText, "Chegar ".length);
    orderedRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(orderedRange);
    fireEvent.click(screen.getByRole("button", { name: "Lista enumerada em Template de e-mail" }));
    expect(bulletEditor.innerHTML).toContain("<ol>");
    expect(bulletEditor.innerHTML).toContain("<li>Chegar cedo</li>");

    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: originalExecCommand,
      });
    } else {
      Reflect.deleteProperty(document, "execCommand");
    }
  });

  it("exposes the Figma-defined product actions from the three-dot menu", () => {
    render(<ProdutosPage />);

    openActionsMenu("Trilha Cachoeira do Meio");

    expect(screen.getByRole("menuitem", { name: "Editar produto" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Ver detalhes" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Produto ativo/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Clonar produto" })).toBeInTheDocument();

    for (const actionName of [
      "Editar produto",
      "Ver detalhes",
      /Produto ativo/,
      "Clonar produto",
      "Excluir produto",
    ]) {
      expect(getMenuItemIcon(actionName)).toHaveAttribute("stroke-width", "1.5");
    }

    const deleteItem = screen.getByRole("menuitem", { name: "Excluir produto" });
    expect(deleteItem).toBeInTheDocument();
    expect(deleteItem).toHaveStyle({ color: "#F04438" });

    expect(screen.getAllByText("Inativo")).toHaveLength(2);
    fireEvent.click(screen.getByRole("menuitem", { name: /Produto ativo/ }));
    expect(screen.getAllByText("Inativo")).toHaveLength(3);

    openActionsMenu("Trilha Cachoeira do Meio");
    fireEvent.click(screen.getByRole("menuitem", { name: "Clonar produto" }));
    expect(screen.getByText("Trilha Cachoeira do Meio (cópia)")).toBeInTheDocument();

    openActionsMenu("Trilha Cachoeira do Meio");
    fireEvent.click(screen.getByRole("menuitem", { name: "Excluir produto" }));
    expect(screen.queryByText("Trilha Cachoeira do Meio")).not.toBeInTheDocument();
  });

  it("shows the draft badge with regular text weight in the product flow", async () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const draftBadge = screen.getByText("Rascunho");
    expect(draftBadge.className).toContain("font-['Helvetica_Neue:Regular',sans-serif]");
    expect(draftBadge.className).not.toContain("font-['Helvetica_Neue:Medium',sans-serif]");

    const locationBlock = screen.getByText("Localização").parentElement;
    if (!locationBlock) throw new Error("Bloco de localização não encontrado");

    expect(countryOptions.length).toBeGreaterThan(200);
    expect(within(locationBlock).getByRole("combobox", { name: "País" })).toHaveTextContent(
      "Brasil"
    );
    expect(within(locationBlock).getByText("Estado")).toBeInTheDocument();
    expect(within(locationBlock).getByText("Cidade")).toBeInTheDocument();
    expect(within(locationBlock).queryByText("UF")).not.toBeInTheDocument();
    const mapLinkLabel = within(locationBlock).getByText("Link do mapa (Google Maps)");
    const mapLinkField = mapLinkLabel.parentElement?.parentElement;
    if (!mapLinkField) throw new Error("Campo de link do mapa não encontrado");
    expect(mapLinkLabel.className).toContain("font-['Helvetica_Neue:Regular',sans-serif]");
    expect(mapLinkLabel.className).toContain("text-sm");
    const cityLabel = within(locationBlock).getByText("Cidade");
    expect(cityLabel.compareDocumentPosition(mapLinkField) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    const mapLinkInput = within(locationBlock).getByLabelText("Link do mapa (Google Maps)");
    const mapLinkAction = within(mapLinkField).getByRole("button", { name: "Ver no Maps" });
    expect(mapLinkInput).toHaveAttribute("placeholder", "https://maps.google.com/nomedolocal");
    expect(mapLinkInput.parentElement).toContainElement(mapLinkAction);
    expect(mapLinkAction.className).not.toContain("border-l");
    expect(mapLinkAction.className).toContain("bg-transparent");
    expect(mapLinkAction.className).toContain("font-['Helvetica_Neue:Regular',sans-serif]");
    const mapHelpAction = within(mapLinkField).getByRole("button", { name: "Como funciona" });
    expect(mapHelpAction).toBeInTheDocument();
    expect(mapHelpAction.className).toContain("text-[#414651]");
    expect(mapHelpAction).toHaveTextContent("Como funciona");
    expect(mapHelpAction).not.toHaveTextContent("Como funciona?");
    fireEvent.focus(mapHelpAction);
    const mapTooltipIntros = await screen.findAllByText(
      /Para exibir o mapa da localização, cole aqui o código de incorporação do Google Maps:/
    );
    const mapTooltip = mapTooltipIntros
      .map((intro) => intro.closest("[data-slot='tooltip-content']"))
      .find((tooltip): tooltip is Element => tooltip !== null);
    if (!mapTooltip) throw new Error("Tooltip do link do mapa não encontrado");
    expect(mapTooltip).toHaveAttribute("data-side", "right");
    expect(mapTooltip).toHaveAttribute("data-align", "center");
    expect(mapTooltip.className).toContain("max-w-[264px]");
    expect(mapTooltip.className).toContain("py-2.5");
    expect(mapTooltip.className).toContain("text-[11px]");
    expect(
      screen.getAllByText("Abra o Google Maps e busque o endereço desejado;").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Clique em Compartilhar;").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Selecione a aba Incorporar um mapa;").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Clique em Copiar HTML;").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cole o código copiado neste campo.").length).toBeGreaterThan(0);

    const meetingPointsBlock = screen.getByText("Pontos de encontro").parentElement;
    if (!meetingPointsBlock) throw new Error("Bloco de pontos de encontro não encontrado");

    expect(
      locationBlock.compareDocumentPosition(meetingPointsBlock) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    const meetingPointsSwitch = within(meetingPointsBlock).getByRole("switch", {
      name: "Habilitar pontos de encontro",
    });
    expect(meetingPointsSwitch).toHaveAttribute("aria-checked", "true");
    expect(within(meetingPointsBlock).queryByText("Ponto 1")).not.toBeInTheDocument();
    expect(
      within(meetingPointsBlock).queryByText("Ponto principal do produto.")
    ).not.toBeInTheDocument();
    expect(within(meetingPointsBlock).getByText("Ponto de encontro 1")).toBeInTheDocument();
    const firstMeetingPointRemoveButton = within(meetingPointsBlock).getByRole("button", {
      name: "Excluir Ponto de encontro 1",
    });
    expect(firstMeetingPointRemoveButton).toBeDisabled();
    expect(firstMeetingPointRemoveButton.className).toContain("size-10");
    const firstMeetingPointRemoveIcon = firstMeetingPointRemoveButton.querySelector("svg");
    if (!firstMeetingPointRemoveIcon) throw new Error("Ícone de excluir ponto não encontrado");
    expect(firstMeetingPointRemoveIcon).toHaveAttribute("width", "16");
    expect(firstMeetingPointRemoveIcon).toHaveAttribute("height", "16");
    expect(
      within(meetingPointsBlock).queryByText("Link do mapa (Google Maps)")
    ).not.toBeInTheDocument();
    expect(within(meetingPointsBlock).getByText("Adicionar ponto")).toBeInTheDocument();

    fireEvent.click(within(meetingPointsBlock).getByRole("button", { name: "Adicionar ponto" }));
    expect(within(meetingPointsBlock).getByText("Ponto de encontro 2")).toBeInTheDocument();
    expect(
      within(meetingPointsBlock).getByRole("button", { name: "Excluir Ponto de encontro 1" })
    ).not.toBeDisabled();
    expect(
      within(meetingPointsBlock).getByRole("button", { name: "Excluir Ponto de encontro 2" })
    ).not.toBeDisabled();
    expect(within(meetingPointsBlock).getAllByText(/^Ponto de encontro \d$/)).toHaveLength(2);
    fireEvent.click(
      within(meetingPointsBlock).getByRole("button", { name: "Excluir Ponto de encontro 2" })
    );
    expect(within(meetingPointsBlock).queryByText("Ponto de encontro 2")).not.toBeInTheDocument();
    expect(
      within(meetingPointsBlock).getByRole("button", { name: "Excluir Ponto de encontro 1" })
    ).toBeDisabled();

    const transportLabel = screen.getByText("Transporte", { selector: "p" });
    expect(
      meetingPointsBlock.compareDocumentPosition(transportLabel) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      locationBlock.compareDocumentPosition(transportLabel) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole("switch", { name: "Transporte incluso" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByText("Cidade de origem")).toBeInTheDocument();
    expect(screen.getByText("UF de origem")).toBeInTheDocument();

    fireEvent.click(meetingPointsSwitch);
    expect(meetingPointsSwitch).toHaveAttribute("aria-checked", "false");
    expect(within(meetingPointsBlock).queryByText("Ponto 1")).not.toBeInTheDocument();
    expect(within(meetingPointsBlock).queryByText("Ponto 2")).not.toBeInTheDocument();
    expect(within(meetingPointsBlock).queryByText("Adicionar ponto")).not.toBeInTheDocument();

    const scheduleBlock = screen.getByText("HORÁRIOS").parentElement;
    if (!scheduleBlock) throw new Error("Bloco de horários não encontrado");

    expect(
      transportLabel.compareDocumentPosition(scheduleBlock) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(within(scheduleBlock).getByText("Horário 1")).toBeInTheDocument();
    expect(within(scheduleBlock).queryByText("Horário 2")).not.toBeInTheDocument();
    expect(
      within(scheduleBlock).queryByText(
        "15:45 (início) - 18:30 (fim), 123 vagas (máxima) - 45 vagas (mínima)."
      )
    ).not.toBeInTheDocument();
    expect(
      within(scheduleBlock).getByText("Sem horários definidos, sem capacidade atribuída.")
    ).toBeInTheDocument();
    expect(within(scheduleBlock).getByText("Adicionar horário")).toBeInTheDocument();

    expect(within(scheduleBlock).queryByText("Ativo")).not.toBeInTheDocument();
    expect(within(scheduleBlock).getByText("Inativo").className).toContain("bg-[#f5f5f5]");

    fireEvent.pointerDown(
      within(scheduleBlock).getByRole("button", { name: "Ações de Horário 1" }),
      {
        button: 0,
        ctrlKey: false,
      }
    );

    const configureScheduleItem = screen.getByRole("menuitem", { name: "Configurar horário" });
    expect(configureScheduleItem).toBeInTheDocument();
    expect(screen.getByText("Horário inativo")).toBeInTheDocument();
    const scheduleStatusSwitch = screen.getByRole("switch", {
      name: "Horário inativo de Horário 1",
    });
    expect(scheduleStatusSwitch).toHaveAttribute("aria-checked", "false");
    expect(scheduleStatusSwitch).toBeDisabled();
    expect(scheduleStatusSwitch.className).toContain("data-disabled:opacity-100");
    expect(scheduleStatusSwitch.className).toContain("data-unchecked:bg-[#d5d7da]");
    expect(screen.queryByRole("menuitem", { name: "Remover horário" })).not.toBeInTheDocument();
    fireEvent.pointerMove(screen.getByRole("menuitem", { name: /Horário inativo/ }));
    expect(
      await screen.findAllByText("Configure horário e capacidade antes de ativar este horário.")
    ).not.toHaveLength(0);
    fireEvent.click(configureScheduleItem);
    const scheduleDrawer = screen.getByRole("dialog", { name: "Configurar horário 1" });
    expect(within(scheduleDrawer).getByText("HORÁRIOS")).toBeInTheDocument();
    expect(within(scheduleDrawer).getByText("CAPACIDADE")).toBeInTheDocument();

    fireEvent.change(within(scheduleDrawer).getByLabelText("Início"), {
      target: { value: "08:00" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Término"), {
      target: { value: "10:30" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Mínima"), {
      target: { value: "12" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Máxima"), {
      target: { value: "28" },
    });
    fireEvent.click(within(scheduleDrawer).getByRole("button", { name: "Salvar" }));

    fireEvent.pointerDown(
      within(scheduleBlock).getByRole("button", { name: "Ações de Horário 1" }),
      {
        button: 0,
        ctrlKey: false,
      }
    );

    const configuredScheduleStatusSwitch = screen.getByRole("switch", {
      name: "Horário inativo de Horário 1",
    });
    expect(configuredScheduleStatusSwitch).not.toBeDisabled();
    fireEvent.click(configuredScheduleStatusSwitch);
    expect(screen.getByText("Horário ativo")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Horário ativo de Horário 1" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(within(scheduleBlock).getAllByText("Ativo")).toHaveLength(1);
    const removeScheduleItem = screen.getByRole("menuitem", { name: "Remover horário" });
    expect(removeScheduleItem).toBeInTheDocument();
    expect(removeScheduleItem).toHaveStyle({ color: "#F04438" });
    for (const path of removeScheduleItem.querySelectorAll("svg path")) {
      expect(path).toHaveAttribute("stroke", "#F04438");
    }
    expect(
      within(scheduleBlock).getByText(
        "08:00 (início) - 10:30 (fim), 28 vagas (máxima) - 12 vagas (mínima)."
      )
    ).toBeInTheDocument();

    const historyButton = screen.getByRole("button", { name: "Histórico" });
    const saveDraftButton = screen.getByRole("button", { name: "Salvar rascunho" });

    expectGhostButton(historyButton);
    expect(historyButton.className).toContain("pl-3");
    expect(historyButton.className).toContain("pr-2");

    expectGhostButton(saveDraftButton);
    expect(saveDraftButton.className).toContain("pl-2");
    expect(saveDraftButton.className).toContain("pr-3");

    fireEvent.click(historyButton);

    expect(screen.getByRole("dialog", { name: "Histórico de ações" })).toBeInTheDocument();
    expect(screen.getByText("Adição de tags e categorias")).toBeInTheDocument();
    expect(screen.getByText("20/04/2026, 14:10")).toBeInTheDocument();
    expect(screen.getByText("Produto criado")).toBeInTheDocument();
    expect(screen.getAllByText("Carlos Ferreira Lima")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Fechar histórico de ações" }));

    expect(screen.queryByRole("dialog", { name: "Histórico de ações" })).not.toBeInTheDocument();

    fireEvent.click(historyButton);

    expect(screen.getByRole("dialog", { name: "Histórico de ações" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar aba" }));

    expect(screen.queryByRole("dialog", { name: "Histórico de ações" })).not.toBeInTheDocument();
  });

  it("adds, sorts, and removes schedule cards with the configured deletion rules", async () => {
    mockLocationOptionsFetch();
    render(<ProdutosPage />);

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    const scheduleBlock = screen.getByText("HORÁRIOS").parentElement;
    if (!scheduleBlock) throw new Error("Bloco de horários não encontrado");

    fireEvent.click(within(scheduleBlock).getByRole("button", { name: "Adicionar horário" }));

    expect(within(scheduleBlock).getByText("Horário 2")).toBeInTheDocument();
    expect(
      within(scheduleBlock).getAllByText("Sem horários definidos, sem capacidade atribuída.")
    ).toHaveLength(2);

    openScheduleActionsMenu(scheduleBlock, "Horário 2");
    fireEvent.click(screen.getByRole("menuitem", { name: "Remover horário" }));

    expect(screen.queryByRole("dialog", { name: "Remover horário?" })).not.toBeInTheDocument();
    expect(within(scheduleBlock).queryByText("Horário 2")).not.toBeInTheDocument();
    expect(
      within(scheduleBlock).getByText("Sem horários definidos, sem capacidade atribuída.")
    ).toBeInTheDocument();

    fireEvent.click(within(scheduleBlock).getByRole("button", { name: "Adicionar horário" }));

    expect(within(scheduleBlock).getByText("Horário 2")).toBeInTheDocument();

    openScheduleActionsMenu(scheduleBlock, "Horário 2");
    fireEvent.click(screen.getByRole("menuitem", { name: "Configurar horário" }));

    const scheduleDrawer = screen.getByRole("dialog", { name: "Configurar horário 2" });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Início"), {
      target: { value: "20:00" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Término"), {
      target: { value: "21:00" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Mínima"), {
      target: { value: "5" },
    });
    fireEvent.change(within(scheduleDrawer).getByLabelText("Máxima"), {
      target: { value: "10" },
    });
    fireEvent.click(within(scheduleDrawer).getByRole("button", { name: "Salvar" }));

    const latestSchedule = within(scheduleBlock).getByText(
      "20:00 (início) - 21:00 (fim), 10 vagas (máxima) - 5 vagas (mínima)."
    );
    const emptySchedule = within(scheduleBlock).getByText(
      "Sem horários definidos, sem capacidade atribuída."
    );
    expect(latestSchedule.compareDocumentPosition(emptySchedule)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    openScheduleActionsMenu(scheduleBlock, "Horário 1");
    fireEvent.click(screen.getByRole("menuitem", { name: "Remover horário" }));

    const confirmationDialog = screen.getByRole("dialog", { name: "Remover horário?" });
    expect(
      within(confirmationDialog).getByText("Esta ação não poderá ser desfeita.")
    ).toBeInTheDocument();
    fireEvent.click(within(confirmationDialog).getByRole("button", { name: "Excluir" }));

    expect(
      within(scheduleBlock).queryByText(
        "20:00 (início) - 21:00 (fim), 10 vagas (máxima) - 5 vagas (mínima)."
      )
    ).not.toBeInTheDocument();

    openScheduleActionsMenu(scheduleBlock, "Horário 1");

    expect(screen.queryByRole("menuitem", { name: "Remover horário" })).not.toBeInTheDocument();
    const defaultScheduleStatusSwitch = screen.getByRole("switch", {
      name: "Horário inativo de Horário 1",
    });
    expect(defaultScheduleStatusSwitch).toBeDisabled();
    expect(defaultScheduleStatusSwitch.className).toContain("data-disabled:opacity-100");
    expect(defaultScheduleStatusSwitch.className).toContain("data-unchecked:bg-[#d5d7da]");
    fireEvent.pointerMove(screen.getByRole("menuitem", { name: /Horário inativo/ }));
    expect(
      await screen.findAllByText("Configure horário e capacidade antes de ativar este horário.")
    ).not.toHaveLength(0);
    expect(screen.queryByRole("dialog", { name: "Remover horário?" })).not.toBeInTheDocument();
    expect(within(scheduleBlock).getByText("Horário 1")).toBeInTheDocument();
    expect(within(scheduleBlock).getByText("Inativo")).toBeInTheDocument();
    expect(
      within(scheduleBlock).getByText("Sem horários definidos, sem capacidade atribuída.")
    ).toBeInTheDocument();
    expect(within(scheduleBlock).queryByText("Horário 2")).not.toBeInTheDocument();
    expect(
      within(scheduleBlock).queryByText(
        "15:45 (início) - 18:30 (fim), 123 vagas (máxima) - 45 vagas (mínima)."
      )
    ).not.toBeInTheDocument();
  });
});
