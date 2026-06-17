import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FieldGroup } from "./new-activity-sections";

describe("FieldGroup", () => {
  it("renders label and children", () => {
    render(
      <FieldGroup label="Nome do campo">
        <input aria-label="Nome do campo" />
      </FieldGroup>
    );

    expect(screen.getByText("Nome do campo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do campo")).toBeInTheDocument();
  });

  it("renders optional hint text", () => {
    render(
      <FieldGroup label="Campo" hint="Texto de ajuda">
        <input />
      </FieldGroup>
    );

    expect(screen.getByText("Texto de ajuda")).toBeInTheDocument();
  });
});
