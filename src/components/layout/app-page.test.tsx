import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppPage } from "./app-page";

describe("AppPage breadcrumb", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders breadcrumb separators as direct list siblings without DOM warnings", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <AppPage title="Indicações" breadcrumb={[{ title: "Início" }, { title: "Afiliados" }]}>
        <p>Conteúdo da página</p>
      </AppPage>
    );

    const breadcrumbList = screen.getByRole("list");
    const directChildren = Array.from(breadcrumbList.children);

    expect(directChildren.every((child) => child.tagName === "LI")).toBe(true);
    expect(
      directChildren.filter((child) => child.getAttribute("data-slot") === "breadcrumb-separator")
    ).toHaveLength(2);
    expect(breadcrumbList.querySelectorAll("li li")).toHaveLength(0);
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain("validateDOMNesting");
  });
});
