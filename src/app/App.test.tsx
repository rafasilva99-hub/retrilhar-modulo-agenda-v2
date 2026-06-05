import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";

const supportedHashes = ["agenda", "agendaDia", "atualizacoes", "novaAtividade"] as const;

function renderHashRoute(hash: string) {
  window.history.replaceState(null, "", `#${hash}`);
  return render(<App />);
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
