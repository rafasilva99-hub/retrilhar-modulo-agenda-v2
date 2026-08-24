import { type TemplateVariable, templateVariableById } from "@/types/api/template-variables";

const templateTokenPattern = /\{\{([a-z0-9_]+)\}\}/g;
const templateChipSelector = "span[data-var]";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function createTemplateVariableChipHtml(variable: TemplateVariable) {
  return `<span contenteditable="false" data-var="${escapeHtml(variable.id)}" class="communication-template-token"><span aria-hidden="true" class="communication-template-token-prefix">{}</span>${escapeHtml(variable.label)}</span>`;
}

export function deserializeTemplate(text: string) {
  return text.replace(templateTokenPattern, (token, id: string) => {
    const variable = templateVariableById.get(id);
    return variable ? createTemplateVariableChipHtml(variable) : token;
  });
}

export function serializeTemplate(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll<HTMLSpanElement>(templateChipSelector).forEach((chip) => {
    const id = chip.dataset.var;
    if (!id || !templateVariableById.has(id)) return;

    chip.replaceWith(document.createTextNode(`{{${id}}}`));
  });

  template.content
    .querySelectorAll<HTMLSpanElement>(".communication-template-token")
    .forEach((chip) => {
      const textContent = (chip.textContent ?? "").trim();
      const oldToken = /^\{([a-z0-9_]+)\}$/.exec(textContent);
      if (!oldToken) return;

      const [, id] = oldToken;
      if (!id || !templateVariableById.has(id)) return;

      chip.replaceWith(document.createTextNode(`{{${id}}}`));
    });

  return template.innerHTML;
}

export function getTemplateVariableLabel(id: string) {
  return templateVariableById.get(id)?.label ?? id;
}
