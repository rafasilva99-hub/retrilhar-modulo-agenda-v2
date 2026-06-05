import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  NewActivityCapacitySection,
  NewActivityFormActions,
  NewActivityIdentificationSection,
  NewActivityScheduleSection,
  NewActivityVisibilitySection,
} from "./new-activity-sections";

describe("new activity form sections", () => {
  it("renders the first-step identification, capacity, and visibility sections", () => {
    render(
      <>
        <NewActivityIdentificationSection
          titleField={<input aria-label="Título da atividade" />}
          localField={<input aria-label="Local da atividade" />}
          productField={<input aria-label="Produto" />}
        />
        <NewActivityCapacitySection
          slider={<div>Slider</div>}
          minField={<input aria-label="Capacidade mínima" />}
          maxField={<input aria-label="Capacidade máxima" />}
        />
        <NewActivityVisibilitySection
          visibilityField={<div>Pública</div>}
          groupLinkField={<input aria-label="Link de Grupo" />}
          clientGroupField={<input aria-label="Grupo de clientes" />}
        />
      </>
    );

    expect(
      screen.getByText("Insira as informações de identificação da atividade")
    ).toBeInTheDocument();
    expect(screen.getByText("Capacidade da atividade")).toBeInTheDocument();
    expect(
      screen.getByText("Insira as informações de visibilidade da atividade")
    ).toBeInTheDocument();
  });

  it("renders schedule controls and footer actions", () => {
    render(
      <>
        <NewActivityScheduleSection
          startDateField={<input aria-label="Data de início" />}
          startTimeField={<input aria-label="Horário de início" />}
          endDateField={<input aria-label="Data de término" />}
          endTimeField={<input aria-label="Horário de término" />}
          multipleTimesToggle={<button>Múltiplos horários</button>}
          repeatToggle={<button>Essa atividade se repete?</button>}
        />
        <NewActivityFormActions
          currentStep={2}
          onBack={() => undefined}
          onCancel={() => undefined}
          onNext={() => undefined}
        />
      </>
    );

    expect(
      screen.getByText("Insira as informações de data e hora da atividade")
    ).toBeInTheDocument();
    expect(screen.getByText("Voltar ao passo anterior")).toBeInTheDocument();
    expect(screen.getByText("Ir para o próximo passo")).toBeInTheDocument();
  });
});
