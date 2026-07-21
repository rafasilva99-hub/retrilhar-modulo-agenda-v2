import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet";

describe("Sheet overlay", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes Radix overlay refs without emitting a function-component ref warning", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <Sheet open onOpenChange={() => undefined}>
        <SheetContent>
          <SheetTitle>Detalhe</SheetTitle>
          <SheetDescription>Informações do detalhe.</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain(
      "Function components cannot be given refs"
    );
  });
});
