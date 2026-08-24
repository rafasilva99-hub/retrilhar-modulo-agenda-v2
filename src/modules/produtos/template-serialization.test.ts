import { describe, expect, it } from "vitest";

import { templateVariableById } from "@/types/api/template-variables";

import {
  createTemplateVariableChipHtml,
  deserializeTemplate,
  serializeTemplate,
} from "./template-serialization";

describe("template serialization", () => {
  it("serializes atomic variable chips to backend tokens", () => {
    const variable = templateVariableById.get("participante_nome");
    if (!variable) throw new Error("Variável participante_nome não encontrada");

    expect(serializeTemplate(`Olá ${createTemplateVariableChipHtml(variable)}!`)).toBe(
      "Olá {{participante_nome}}!"
    );
  });

  it("deserializes backend tokens to atomic variable chips", () => {
    expect(deserializeTemplate("Olá {{participante_nome}}!")).toContain(
      'contenteditable="false" data-var="participante_nome"'
    );
    expect(deserializeTemplate("Olá {{participante_nome}}!")).toContain("Nome do participante");
  });

  it("keeps unknown tokens unchanged", () => {
    expect(deserializeTemplate("Olá {{variavel_futura}}!")).toBe("Olá {{variavel_futura}}!");
  });
});
