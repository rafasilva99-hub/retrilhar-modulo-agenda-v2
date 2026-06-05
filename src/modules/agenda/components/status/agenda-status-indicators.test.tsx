import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  getInsuranceStatusIndicator,
  getPaymentStatusIndicator,
  getReservationStatusIndicator,
} from "./agenda-status-config";
import { AgendaStatusIndicator, ReservationTypeIndicator } from "./agenda-status-indicators";

describe("agenda status indicators", () => {
  it("maps success, warning, destructive, and neutral status tones", () => {
    expect(getPaymentStatusIndicator("Paid").tone).toBe("success");
    expect(getPaymentStatusIndicator("Pending").tone).toBe("warning");
    expect(getPaymentStatusIndicator("Failed").tone).toBe("destructive");
    expect(getInsuranceStatusIndicator("Contracted").tone).toBe("success");
    expect(getInsuranceStatusIndicator("Pending").tone).toBe("warning");
    expect(getInsuranceStatusIndicator("Declined").tone).toBe("destructive");
    expect(getReservationStatusIndicator("Cancelled").tone).toBe("neutral");
  });

  it("renders reservation type counts with neutral token classes", () => {
    render(<ReservationTypeIndicator type="group" count={4} />);

    const indicator = screen.getByText("4").closest("[data-tone]");

    expect(indicator).toHaveAttribute("data-tone", "neutral");
    expect(indicator?.className).toContain("bg-muted");
    expect(indicator?.className).not.toContain("bg-emerald");
    expect(indicator?.className).not.toContain("bg-amber");
    expect(indicator?.className).not.toContain("bg-destructive");
  });

  it("renders custom labels through the maintained indicator component", () => {
    render(<AgendaStatusIndicator label="Autorizado" tone="success" />);

    expect(screen.getByText("Autorizado")).toBeInTheDocument();
    expect(screen.getByText("Autorizado").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "success"
    );
  });
});
