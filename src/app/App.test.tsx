import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";

const supportedHashes = ["agenda", "agendaDia", "atualizacoes", "novaAtividade"] as const;
const affiliateRoutes = [
  { hash: "afiliados", expectedText: "Oi Katiely," },
  { hash: "indicacoes", expectedText: "Indicações originadas" },
  { hash: "ganhos", expectedText: "Extrato de comissões" },
  { hash: "produtosLinks", expectedText: "Link geral (nível 1)" },
  { hash: "configuracoes", expectedText: "Meu Perfil" },
  { hash: "ajuda", expectedText: "Como podemos ajudar?" },
] as const;
const affiliatePreviewRoutes = affiliateRoutes.map(({ hash, expectedText }) => ({
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

  it("navigates from the manager sidebar to the affiliate dashboard", async () => {
    renderHashRoute("agenda");

    fireEvent.click(screen.getByRole("button", { name: "Afiliados" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#afiliados");
      expect(document.body.textContent).toContain("Oi Katiely,");
    });
  });

  it("navigates from global search to the affiliate dashboard", async () => {
    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverStub,
    });
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
      expect(window.location.hash).toBe("#afiliados");
      expect(document.body.textContent).toContain("Oi Katiely,");
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

  it("falls back to agenda for unknown hash", async () => {
    renderHashRoute("doesNotExist");

    await waitFor(() => {
      expect(window.location.hash).toBe("#agenda");
      expect(document.body.textContent).toContain("Agenda");
    });
  });

  it("normalizes to agenda when the hash changes to an unknown route", async () => {
    renderHashRoute("agenda");

    window.history.pushState(null, "", "#doesNotExist");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(window.location.hash).toBe("#agenda");
      expect(document.body.textContent).toContain("Agenda");
    });
  });
});
