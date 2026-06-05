import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CalendarSummaryCard,
  DayActivityShell,
  UpdatesParticipantRow,
} from "./agenda-route-primitives";

describe("agenda month day primitives", () => {
  it("renders calendar summaries with empty and holiday states", () => {
    render(<CalendarSummaryCard title="05/06/2026" count={0} holidayName="Corpus Christi" />);

    expect(screen.getByText("05/06/2026")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma atividade")).toBeInTheDocument();
    expect(screen.getByText("Corpus Christi")).toBeInTheDocument();
  });

  it("renders day activity shell states", () => {
    render(
      <DayActivityShell
        title="Trilha Pico do Itacolomi"
        timeRange="08:00 - 11:00"
        statusLabel="Em andamento"
      />
    );

    expect(screen.getByText("Trilha Pico do Itacolomi")).toBeInTheDocument();
    expect(screen.getByText("08:00 - 11:00")).toBeInTheDocument();
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
  });
});

describe("agenda updates participant primitives", () => {
  it("renders participant rows with status and selection state", () => {
    render(
      <UpdatesParticipantRow
        checked
        participantName="João Silva"
        reservationLabel="#RE-9920"
        statusLabel="Aguardando check-in"
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("#RE-9920")).toBeInTheDocument();
    expect(screen.getByText("Aguardando check-in")).toBeInTheDocument();
  });
});
