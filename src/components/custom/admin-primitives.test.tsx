import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkeletonCard } from "../skeleton/card";
import { SkeletonTable } from "../skeleton/table";

import { CardStats } from "./cards/stats";
import { DataList, DataListItem, DataListLabel, DataListValue } from "./data-list";
import { SaveButton } from "./save-button";

describe("Admin compatible primitives", () => {
  it("renders SaveButton with prototype Button loading support", () => {
    render(
      <SaveButton loading requireDirty={false}>
        Salvar agenda
      </SaveButton>
    );

    const button = screen.getByRole("button", { name: /salvar agenda/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("renders DataList semantics and CardStats content", () => {
    render(
      <>
        <DataList>
          <DataListItem>
            <DataListLabel>Equipe</DataListLabel>
            <DataListValue>3 guias</DataListValue>
          </DataListItem>
        </DataList>
        <CardStats
          title="Reservas"
          value={12}
          trend={{ value: "+2", label: "hoje", direction: "up" }}
        />
      </>
    );

    expect(screen.getByText("Equipe").tagName).toBe("DT");
    expect(screen.getByText("3 guias").tagName).toBe("DD");
    expect(screen.getByText("Reservas")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders skeleton card and table placeholders", () => {
    render(
      <>
        <SkeletonCard contentHeight="h-12" />
        <SkeletonTable rows={2} columns={3} />
      </>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});
