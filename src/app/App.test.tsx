import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";

const supportedHashes = ["home", "agenda", "agendaDia", "atualizacoes", "novaAtividade"] as const;
const affiliateRoutes = [
  { hash: "afiliados", expectedText: "Oi Katiely," },
  { hash: "indicacoes", expectedText: "Indicações originadas" },
  { hash: "ganhos", expectedText: "Extrato de comissões" },
  { hash: "produtosLinks", expectedText: "Link geral (nível 1)" },
  { hash: "configuracoes", expectedText: "Meu Perfil" },
  { hash: "ajuda", expectedText: "Como podemos ajudar?" },
] as const;
const managerAffiliateRoutes = [
  { hash: "gestorAfiliados", expectedText: "Últimas vendas realizadas" },
  { hash: "gestorAfiliadosCentral", expectedText: "Candidaturas e pedidos solicitados" },
  { hash: "gestorAfiliadosLista", expectedText: "ANA-2201" },
  { hash: "gestorAfiliadosFicha", expectedText: "Vendas realizadas" },
  { hash: "gestorAfiliadosPropostas", expectedText: "Contraproposta" },
  { hash: "gestorAfiliadosSolicitacoes", expectedText: "Rapel Cachoeira" },
  { hash: "gestorAfiliadosPagamentos", expectedText: "Registrar pagamento" },
  { hash: "gestorAfiliadosTermo", expectedText: "Termo de afiliação" },
] as const;
const managerProductRoutes = [
  { hash: "produtos", expectedText: "Gerencie seu catálogo de atividades" },
  { hash: "produtosRecursos", expectedText: "Cadastre os insumos da organização" },
] as const;
const managerSalesRoutes = [
  { hash: "vendasPedidos", expectedText: "Gerencie todas as vendas e transações." },
  { hash: "vendasDesistencias", expectedText: "Configurar Remarketing" },
  { hash: "vendasCupons", expectedText: "Gerencie códigos promocionais" },
] as const;
const affiliatePreviewRoutes = affiliateRoutes.map(({ hash, expectedText }) => ({
  hash: `preview/${hash}`,
  expectedText,
}));
const managerAffiliatePreviewRoutes = managerAffiliateRoutes.map(({ hash, expectedText }) => ({
  hash: `preview/${hash}`,
  expectedText,
}));

function renderHashRoute(hash: string) {
  window.history.replaceState(null, "", `#${hash}`);
  return render(<App />);
}

function getLastElement<T>(items: T[]): T {
  const item = items.at(-1);
  if (!item) throw new Error("Expected at least one element");
  return item;
}

function getFirstElement<T>(items: T[]): T {
  const [item] = items;
  if (!item) throw new Error("Expected at least one element");
  return item;
}

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function openMenu(trigger: HTMLElement) {
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
}

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

describe("App hash routing", () => {
  it("renders each supported hash route directly", async () => {
    for (const hash of supportedHashes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent?.trim().length ?? 0).toBeGreaterThan(20);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each affiliate screen for its direct hash route", async () => {
    for (const { hash, expectedText } of affiliateRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each affiliate screen for its preview hash route", async () => {
    for (const { hash, expectedText } of affiliatePreviewRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each manager affiliate screen for its direct hash route", async () => {
    for (const { hash, expectedText } of managerAffiliateRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each manager product screen for its direct hash route", async () => {
    for (const { hash, expectedText } of managerProductRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each manager sales screen for its direct hash route", async () => {
    for (const { hash, expectedText } of managerSalesRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("renders each manager affiliate screen for its preview hash route", async () => {
    for (const { hash, expectedText } of managerAffiliatePreviewRoutes) {
      const { unmount } = renderHashRoute(hash);

      await waitFor(() => {
        expect(window.location.hash).toBe(`#${hash}`);
        expect(document.body.textContent).toContain(expectedText);
      });

      unmount();
      window.history.replaceState(null, "", "/");
    }
  });

  it("navigates from the manager sidebar to the affiliate management dashboard", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Afiliados" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#gestorAfiliados");
      expect(document.body.textContent).toContain("Visão geral do programa");
    });
  });

  it("opens product subitems and navigates to organization resources", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Produtos" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#produtos");
      expect(screen.getByRole("button", { name: "Catálogo" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Recursos" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Recursos" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#produtosRecursos");
      expect(document.body.textContent).toContain("Cadastre os insumos da organização");
    });
  });

  it("opens sales subitems and navigates to orders", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Vendas" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#vendasPedidos");
      expect(screen.getByRole("button", { name: "Pedidos" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Desistências" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cupons" })).toBeInTheDocument();
      expect(document.body.textContent).toContain("Total em Vendas");
      expect(document.body.textContent).toContain("VEN-0001");
    });
  });

  it("renders the abandonments sales screen from the sales menu", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Vendas" }));
    fireEvent.click(screen.getByRole("button", { name: "Desistências" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#vendasDesistencias");
      expect(screen.getByRole("heading", { name: "Desistências" })).toBeInTheDocument();
      expect(screen.getByText("Gerencie todas as vendas e transações.")).toBeInTheDocument();
      expect(screen.getByText("Carrinhos")).toBeInTheDocument();
      expect(screen.getByText("Valor Perdido")).toBeInTheDocument();
      expect(screen.getByText("Taxa Abandono")).toBeInTheDocument();
      expect(screen.getByText("Recuperados")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Configurar Remarketing" })).toBeInTheDocument();
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Abandonou no pagamento")).toBeInTheDocument();
      expect(screen.getAllByText("Quente").length).toBeGreaterThan(0);
      expect(screen.getByText("Página 1 de 10")).toBeInTheDocument();
    });
  });

  it("navigates from the manager sidebar to the home dashboard", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Início" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#home");
      expect(document.body.textContent).toContain("bem-vinda de volta");
      expect(document.body.textContent).toContain("Faturamento");
    });
  });

  it("navigates from global search to the affiliate dashboard", async () => {
    if (!window.ResizeObserver) {
      Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        value: ResizeObserverStub,
      });
    }
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: () => undefined,
    });
    renderHashRoute("agenda");

    fireEvent.click(getLastElement(screen.getAllByText("Buscar...")));
    const searchInput = getLastElement(screen.getAllByPlaceholderText("Buscar..."));
    fireEvent.change(searchInput, {
      target: { value: "Afiliados" },
    });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    await waitFor(() => {
      expect(window.location.hash).toBe("#gestorAfiliados");
      expect(document.body.textContent).toContain("Visão geral do programa");
    });
  });

  it("keeps topbar profile settings and help as direct full-screen affiliate routes", async () => {
    renderHashRoute("afiliados");

    openMenu(getFirstElement(screen.getAllByRole("button", { name: "Perfil" })));
    fireEvent.click(screen.getByRole("menuitem", { name: "Configurações" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#configuracoes");
      expect(document.body.textContent).toContain("Meu Perfil");
    });

    cleanup();
    renderHashRoute("afiliados");

    openMenu(getFirstElement(screen.getAllByRole("button", { name: "Perfil" })));
    fireEvent.click(screen.getByRole("menuitem", { name: "Ajuda e Suporte" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#ajuda");
      expect(document.body.textContent).toContain("Como podemos ajudar?");
    });
  });

  it("navigates from the manager organization control to the affiliate dashboard", async () => {
    renderHashRoute("agenda");

    openMenu(getFirstElement(screen.getAllByRole("button", { name: /EliasTurismo/ })));
    fireEvent.click(screen.getByRole("menuitem", { name: /Painel de Afiliado/ }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#afiliados");
      expect(document.body.textContent).toContain("Oi Katiely,");
    });
  });

  it("falls back to home for unknown hash", async () => {
    renderHashRoute("doesNotExist");

    await waitFor(() => {
      expect(window.location.hash).toBe("#home");
      expect(document.body.textContent).toContain("bem-vinda de volta");
    });
  });

  it("normalizes to home when the hash changes to an unknown route", async () => {
    renderHashRoute("agenda");

    window.history.pushState(null, "", "#doesNotExist");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(window.location.hash).toBe("#home");
      expect(document.body.textContent).toContain("bem-vinda de volta");
    });
  });
});
