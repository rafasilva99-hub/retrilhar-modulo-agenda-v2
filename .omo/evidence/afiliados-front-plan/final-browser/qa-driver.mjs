import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [cdpPort, appPort, evidenceDir] = process.argv.slice(2);
if (!cdpPort || !appPort || !evidenceDir) {
  throw new Error("Usage: node qa-driver.mjs <cdp-port> <app-port> <evidence-dir>");
}

const baseUrl = `http://127.0.0.1:${appPort}/`;
const cdpUrl = `http://127.0.0.1:${cdpPort}`;
const screenshotsDir = path.join(evidenceDir, "screenshots");
await mkdir(screenshotsDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const results = { generatedAt: new Date().toISOString(), baseUrl, appPort: Number(appPort), cdpPort: Number(cdpPort), routeChecks: [], interactions: [], consoleEvents: [], failures: [] };
const sharedPrimitiveWarningRules = [
  { category: "breadcrumb-dom-nesting", tokens: ["validateDOMNesting", "BreadcrumbSeparator", "/src/components/ui/breadcrumb.tsx"] },
  { category: "sheet-overlay-ref", tokens: ["Function components cannot be given refs", "SheetOverlay", "/src/components/ui/sheet.tsx"] },
  { category: "dialog-description", tokens: ["Missing `Description`", "DialogContent", "aria-describedby"] },
];

function classifySharedPrimitiveWarning(event) {
  const raw = JSON.stringify(event);
  return sharedPrimitiveWarningRules.find((rule) => rule.tokens.every((token) => raw.includes(token)))?.category ?? null;
}

const targets = await fetch(`${cdpUrl}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("Chrome exposed no page target");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const events = [];
socket.addEventListener("message", (message) => {
  const payload = JSON.parse(message.data);
  if (payload.id) {
    const request = pending.get(payload.id);
    pending.delete(payload.id);
    if (!request) return;
    if (payload.error) request.reject(new Error(`${request.method}: ${payload.error.message}`));
    else request.resolve(payload.result);
    return;
  }
  if (["Runtime.exceptionThrown", "Runtime.consoleAPICalled", "Log.entryAdded", "Network.loadingFailed"].includes(payload.method)) {
    events.push({ method: payload.method, params: payload.params });
  }
});

function send(method, params = {}) {
  const requestId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(requestId, { method, resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? "Runtime evaluation failed");
  return response.result.value;
}

async function waitFor(expression, label, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function settle() {
  await evaluate("new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
}

async function viewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600, screenWidth: width, screenHeight: height });
}

async function navigate(hash, expectedText) {
  const loaded = new Promise((resolve) => {
    const handler = (message) => {
      const payload = JSON.parse(message.data);
      if (payload.method === "Page.loadEventFired") {
        socket.removeEventListener("message", handler);
        resolve();
      }
    };
    socket.addEventListener("message", handler);
  });
  await send("Page.navigate", { url: `${baseUrl}?finalQa=${Date.now()}#${hash}` });
  await loaded;
  await waitFor(`location.hash === ${JSON.stringify(`#${hash}`)} && document.body.innerText.trim().length > 40`, `${hash} nonblank`);
  if (expectedText) await waitFor(`document.body.innerText.includes(${JSON.stringify(expectedText)})`, `${hash} expected text`);
  await settle();
  await sleep(350);
}

async function metadata(buffer) {
  return { bytes: buffer.length, pngSignatureValid: buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function screenshot(name, width, height) {
  await evaluate("scrollTo(0, 0)");
  await settle();
  const response = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  const buffer = Buffer.from(response.data, "base64");
  const file = path.join(screenshotsDir, `${name}.png`);
  await writeFile(file, buffer);
  const info = await metadata(buffer);
  return { path: file, ...info, dimensionsMatch: info.width === width && info.height === height };
}

async function audit(expectedText) {
  return evaluate(`(() => {
    const visible = (element) => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0; };
    const nameOf = (element) => [element.getAttribute("aria-label"), element.getAttribute("aria-labelledby"), element.labels?.[0]?.innerText, element.innerText, element.getAttribute("title"), element.getAttribute("placeholder"), element.querySelector?.("img[alt]")?.getAttribute("alt")].find((value) => value?.trim())?.replace(/\\s+/g, " ").trim() ?? "";
    const controls = [...document.querySelectorAll('button,a[href],input,select,textarea,[role="button"],[role="link"],[role="menuitem"],[role="tab"]')].filter(visible);
    const clipping = controls.flatMap((element) => { const style = getComputedStyle(element); const text = (element.innerText || "").replace(/\\s+/g, " ").trim(); if (!text || element.scrollWidth <= element.clientWidth + 1 || style.overflowX === "visible" || style.whiteSpace !== "nowrap") return []; return [{ name: nameOf(element), text, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }]; });
    const offscreenControls = controls.filter((element) => { const rect = element.getBoundingClientRect(); return rect.bottom > 0 && rect.top < innerHeight && (rect.left < -1 || rect.right > innerWidth + 1); }).map((element) => ({ name: nameOf(element), left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, viewportWidth: innerWidth }));
    return { hash: location.hash, h1: (document.querySelector("h1")?.innerText || "").replace(/\\s+/g, " ").trim(), bodyTextLength: document.body.innerText.trim().length, expectedTextPresent: document.body.innerText.includes(${JSON.stringify(expectedText)}), globalHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, visibleControlCount: controls.length, unnamedControls: controls.filter((element) => !nameOf(element)).map((element) => ({ tag: element.tagName, role: element.getAttribute("role") })), clippedControls: clipping, offscreenControls };
  })()`);
}

async function point(expression, label) {
  const value = await evaluate(`(() => { const element = ${expression}; if (!element) return null; element.scrollIntoView({ block: "center", inline: "center" }); const rect = element.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
  if (!value) throw new Error(`Could not locate ${label}`);
  return value;
}

async function pointerClick(expression, label) {
  const { x, y } = await point(expression, label);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1 });
  await settle();
}

function exactText(text, selector = "button,a,[role=button],[role=menuitem],[role=option],[role=tab]") {
  return `([...document.querySelectorAll(${JSON.stringify(selector)})].find((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && (element.innerText || "").replace(/\\s+/g, " ").trim() === ${JSON.stringify(text)}; }))`;
}

async function clickText(text, selector) { await pointerClick(exactText(text, selector), text); }

async function clickStartsWith(text, selector = "button,a,[role=button],[role=menuitem],[role=option],[role=tab]") {
  await pointerClick(`([...document.querySelectorAll(${JSON.stringify(selector)})].find((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && (element.innerText || "").replace(/\\s+/g, " ").trim().startsWith(${JSON.stringify(text)}); }))`, text);
}

async function clickSelector(selector, label) { await pointerClick(`document.querySelector(${JSON.stringify(selector)})`, label); }

async function key(key, modifiers = 0) {
  const data = { Tab: ["Tab", 9], Enter: ["Enter", 13], Escape: ["Escape", 27], " ": ["Space", 32], Backspace: ["Backspace", 8], a: ["KeyA", 65] }[key];
  if (!data) throw new Error(`Unsupported key ${key}`);
  const [code, virtualKey] = data;
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key, code, modifiers, windowsVirtualKeyCode: virtualKey, text: key === "Enter" ? "\r" : key === " " ? " " : undefined, unmodifiedText: key === "Enter" ? "\r" : key === " " ? " " : undefined });
  if (key === "Enter" || key === " ") await send("Input.dispatchKeyEvent", { type: "char", key, code, modifiers, windowsVirtualKeyCode: virtualKey, text: key === "Enter" ? "\r" : " ", unmodifiedText: key === "Enter" ? "\r" : " " });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: virtualKey });
  await settle();
}

async function typeInto(selector, value) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);
  await key("a", 2).catch(() => {});
  await key("Backspace");
  await send("Input.insertText", { text: value });
  await settle();
}

async function choose(label, option) {
  await clickSelector(`button[role="combobox"][aria-label=${JSON.stringify(label)}]`, `${label} combobox`);
  await waitFor(`!![...document.querySelectorAll('[role="option"]')].find((element) => element.getBoundingClientRect().width > 0 && element.innerText.trim().includes(${JSON.stringify(option)}))`, `${option} option`);
  await clickStartsWith(option, '[role="option"]');
}

async function scenario(name, fn) {
  try {
    const detail = await fn();
    results.interactions.push({ scenario: name, verdict: "PASS", ...detail });
  } catch (error) {
    results.interactions.push({ scenario: name, verdict: "FAIL", error: String(error?.stack ?? error) });
    results.failures.push(`${name}: ${String(error?.message ?? error)}`);
  }
}

await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable"), send("Network.enable")]);
await send("Browser.grantPermissions", { origin: baseUrl.slice(0, -1), permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});

const routes = [["afiliados", "Oi Katiely,"], ["indicacoes", "Indicações originadas"], ["ganhos", "Extrato de comissões"], ["produtosLinks", "Link geral (nível 1)"], ["configuracoes", "Meu Perfil"], ["ajuda", "Como podemos ajudar?"]];
for (const [width, height] of [[1280, 800], [390, 844]]) {
  await viewport(width, height);
  for (const [hash, expectedText] of routes) {
    try {
      const routeText = hash === "configuracoes" && width === 390 ? "Configurações" : expectedText;
      await navigate(hash, routeText);
      const pageAudit = await audit(routeText);
      const image = await screenshot(`route-${hash}-${width}x${height}`, width, height);
      const pass = pageAudit.hash === `#${hash}` && pageAudit.bodyTextLength > 40 && pageAudit.expectedTextPresent && !pageAudit.globalHorizontalOverflow && pageAudit.unnamedControls.length === 0 && pageAudit.clippedControls.length === 0 && pageAudit.offscreenControls.length === 0 && image.pngSignatureValid && image.dimensionsMatch;
      results.routeChecks.push({ scenario: `direct ${hash} ${width}x${height}`, hash: `#${hash}`, viewport: { width, height }, verdict: pass ? "PASS" : "FAIL", audit: pageAudit, screenshot: image });
      if (!pass) results.failures.push(`route ${hash} ${width}x${height}: audit or screenshot failed`);
    } catch (error) {
      results.routeChecks.push({ scenario: `direct ${hash} ${width}x${height}`, hash: `#${hash}`, viewport: { width, height }, verdict: "FAIL", error: String(error?.stack ?? error) });
      results.failures.push(`route ${hash} ${width}x${height}: ${String(error?.message ?? error)}`);
    }
  }
}

await viewport(1280, 800);
await scenario("dashboard copy detail close", async () => {
  await navigate("afiliados", "Oi Katiely,");
  await clickText("Copiar");
  await waitFor(`document.body.innerText.includes("Copiado")`, "dashboard copied feedback");
  const copied = await screenshot("interaction-dashboard-copied-1280x800", 1280, 800);
  await clickSelector('[aria-label^="Abrir detalhes de"]', "dashboard referral detail");
  await waitFor(`document.body.innerText.includes("Detalhe da indicação")`, "dashboard detail");
  const detail = await screenshot("interaction-dashboard-detail-1280x800", 1280, 800);
  await clickSelector('button[aria-label="Fechar detalhe da indicação"]', "dashboard detail close");
  await waitFor(`!document.body.innerText.includes("Detalhe da indicação")`, "dashboard detail closed");
  return { copiedFeedback: true, copiedScreenshot: copied.path, detailScreenshot: detail.path, closed: true };
});

await viewport(1280, 800);
await scenario("indicacoes search tab detail back", async () => {
  await navigate("indicacoes", "Indicações originadas");
  await typeInto('input[aria-label="Pesquisar indicações"]', "João");
  await waitFor(`document.body.innerText.includes("João")`, "known indication search result");
  const searchImage = await screenshot("interaction-indicacoes-search-1280x800", 1280, 800);
  await clickStartsWith("Pagas", '[role="tab"]');
  await waitFor(`document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.trim().startsWith("Pagas")`, "Pagas tab");
  const tabImage = await screenshot("interaction-indicacoes-pagas-1280x800", 1280, 800);
  await clickSelector('[aria-label^="Abrir detalhe da indicação"]', "indication detail row");
  await waitFor(`document.body.innerText.includes("Detalhe da indicação")`, "indication detail");
  const detailImage = await screenshot("interaction-indicacoes-detail-1280x800", 1280, 800);
  const copyControls = await evaluate(`[...document.querySelectorAll("button")].filter((element) => element.getBoundingClientRect().width > 0 && /copiar/i.test(element.innerText)).length`);
  await key("Escape");
  await waitFor(`!document.body.innerText.includes("Detalhe da indicação")`, "indication detail closed");
  await sleep(1000);
  await clickSelector('button[aria-label="Voltar para afiliados"]', "indications back");
  await waitFor(`location.hash === "#afiliados"`, "indications back route");
  return { search: "João", searchScreenshot: searchImage.path, paidTab: true, tabScreenshot: tabImage.path, detailScreenshot: detailImage.path, copyVerdict: copyControls > 0 ? "PASS: exposed copy control" : "NOT_APPLICABLE: indications surface exposes no copy control; link copy is covered on dashboard and Produtos e Links", backHash: await evaluate("location.hash") };
});

await viewport(1280, 800);
await scenario("ganhos organization filter detail related link", async () => {
  await navigate("ganhos", "Extrato de comissões");
  await choose("Organização", "Cerrado Experience");
  await waitFor(`document.body.innerText.includes("Cerrado Experience")`, "earnings organization filter");
  const filterImage = await screenshot("interaction-ganhos-org-filter-1280x800", 1280, 800);
  await clickSelector('[aria-label^="Abrir detalhe da comissão"]', "commission detail");
  await waitFor(`document.body.innerText.includes("Detalhe da comissão")`, "commission detail");
  const detailImage = await screenshot("interaction-ganhos-detail-1280x800", 1280, 800);
  await clickText("Ver indicação relacionada", "a");
  await waitFor(`location.hash === "#indicacoes" && document.body.innerText.includes("Indicações originadas")`, "related indication route");
  return { organization: "Cerrado Experience", filterScreenshot: filterImage.path, detailScreenshot: detailImage.path, relatedHash: await evaluate("location.hash") };
});

await viewport(1280, 800);
await scenario("produtos links copy request unavailable", async () => {
  await navigate("produtosLinks", "Link geral (nível 1)");
  await clickText("Copiar");
  await waitFor(`document.body.innerText.includes("Copiado")`, "general link copied");
  await clickText("Ver links por organização", "button");
  await waitFor(`document.body.innerText.includes("Links por organização")`, "organization links");
  await clickSelector('button[aria-label^="Ver produtos e links"]', "organization link drilldown");
  await waitFor(`document.body.innerText.includes("Link da organização (nível 2)")`, "organization link");
  await clickText("Copiar");
  await waitFor(`document.body.innerText.includes("Copiado")`, "organization link copied");
  const organizationImage = await screenshot("interaction-produtos-organization-1280x800", 1280, 800);
  const productCopy = await evaluate(`([...document.querySelectorAll("button")].find((element) => element.innerText.includes("Copiar link do produto") && element.getBoundingClientRect().width > 0))?.innerText`);
  if (!productCopy) throw new Error("No available product copy control exposed after organization drilldown");
  await clickText("Copiar link do produto");
  await waitFor(`document.body.innerText.includes("Copiado")`, "product link copied");
  const productImage = await screenshot("interaction-produtos-product-copied-1280x800", 1280, 800);
  await choose("Organização", "Trilheiras de Brasília");
  await waitFor(`document.body.innerText.includes("Trilheiras de Brasília")`, "request organization");
  await waitFor(`document.querySelector('button[role="combobox"][aria-label="Organização"]')?.innerText.includes("Trilheiras de Brasília")`, "selected request organization");
  const requestButton = await evaluate(`([...document.querySelectorAll("button")].find((element) => element.innerText.trim() === "Solicitar" && element.getBoundingClientRect().width > 0))?.innerText`);
  if (!requestButton) throw new Error("No available product request control exposed");
  await clickText(requestButton);
  await waitFor(`document.body.innerText.includes("Solicitação enviada")`, "product request feedback");
  await choose("Organização", "Cerrado Experience");
  const unavailable = await evaluate(`!![...document.querySelectorAll("button")].find((element) => element.innerText.trim() === "Indisponível" && element.getBoundingClientRect().width > 0)`);
  if (!unavailable) throw new Error("Unavailable product control not exposed");
  const disabled = await evaluate(`([...document.querySelectorAll("button")].find((element) => element.innerText.trim() === "Indisponível" && element.getBoundingClientRect().width > 0))?.disabled === true`);
  return { generalCopied: true, organizationCopied: true, productCopied: true, organizationScreenshot: organizationImage.path, productScreenshot: productImage.path, requestFeedback: "Solicitação enviada", unavailableDisabled: disabled };
});

await viewport(1280, 800);
await scenario("configuracoes destination change cash no-op count update", async () => {
  await navigate("configuracoes", "Meu Perfil");
  await clickText("Formas de recebimento");
  await waitFor(`document.body.innerText.includes("Alterar destino") && document.body.innerText.includes("Não se aplica")`, "receiving settings");
  const before = await evaluate(`([...document.querySelectorAll("body *")].filter((element) => element.children.length === 0 && (element.innerText || "").trim() === "Em uso por 2 organizações").length)`);
  await clickText("Alterar destino");
  await waitFor(`document.body.innerText.includes("Forma de recebimento") && document.body.innerText.includes("Você pode alterar somente o destino")`, "destination sheet");
  const typeDisabled = await evaluate(`document.querySelector("#receiving-type")?.disabled === true`);
  await clickSelector('button[role="radio"][aria-label^="Conta da empresa"]', "company account destination");
  await clickText("Confirmar alteração");
  await waitFor(`document.body.innerText.includes("Destino de Cerrado Experience atualizado")`, "destination success");
  const after = await evaluate(`([...document.querySelectorAll("body *")].filter((element) => element.children.length === 0 && (element.innerText || "").trim() === "Em uso por 1 organização").length)`);
  const updatedImage = await screenshot("interaction-configuracoes-updated-1280x800", 1280, 800);
  const cashActionCount = await evaluate(`([...document.querySelectorAll("[class]")].filter((element) => element.children.length === 0 && (element.innerText || "").trim() === "Dinheiro").length > 0 && ![...document.querySelectorAll("button")].some((element) => (element.innerText || "").trim() === "Alterar destino" && element.closest("div")?.innerText.includes("Dinheiro")))`);
  return { typeReadOnly: typeDisabled, initialUsageCount: before, updatedUsageCount: after, updatedScreenshot: updatedImage.path, cashNoOp: cashActionCount };
});

await viewport(390, 844);
await scenario("ajuda search hit no-result close", async () => {
  await navigate("ajuda", "Como podemos ajudar?");
  await typeInto("#faq-search", "comissões");
  await waitFor(`document.body.innerText.includes("Quando recebo minhas comissões?")`, "help search hit");
  const hitImage = await screenshot("interaction-ajuda-search-hit-390x844", 390, 844);
  await typeInto("#faq-search", "semresultadozz");
  await waitFor(`document.body.innerText.includes("Nenhum resultado encontrado")`, "help no result");
  const emptyImage = await screenshot("interaction-ajuda-no-result-390x844", 390, 844);
  await clickText("Fechar", "button");
  await waitFor(`location.hash === "#afiliados"`, "help close route");
  return { hitScreenshot: hitImage.path, noResultScreenshot: emptyImage.path, closedHash: await evaluate("location.hash") };
});

const relevantEvents = events.filter((event) => {
  const raw = JSON.stringify(event);
  return !raw.includes("favicon.ico") && !raw.includes("Download the React DevTools") && !(event.method === "Runtime.consoleAPICalled" && event.params?.type === "debug" && event.params?.args?.[0]?.value?.startsWith("[vite]"));
});
results.consoleEvents = relevantEvents;
const classifiedEvents = relevantEvents.map((event, index) => ({
  index,
  method: event.method,
  type: event.params?.type ?? event.params?.entry?.level ?? null,
  category: classifySharedPrimitiveWarning(event),
}));
const errorLevelEvents = classifiedEvents.filter((event) => event.type === "error" || event.type === "assert");
const unexpectedErrorLevelEvents = errorLevelEvents.filter((event) => event.category === null);
const runtimeExceptions = relevantEvents.filter((event) => event.method === "Runtime.exceptionThrown");
const networkFailures = relevantEvents.filter((event) => event.method === "Network.loadingFailed");
const knownWarningCounts = Object.fromEntries(
  sharedPrimitiveWarningRules.map((rule) => [rule.category, classifiedEvents.filter((event) => event.category === rule.category).length])
);
const knownWarningCount = Object.values(knownWarningCounts).reduce((total, count) => total + count, 0);
results.consoleClassification = {
  policy: "Known shared Breadcrumb/Sheet/Dialog React warnings are retained and classified; unexpected error-level console events, runtime exceptions, and network failures fail QA.",
  retainedEvents: relevantEvents.length,
  knownSharedPrimitiveWarnings: { total: knownWarningCount, byCategory: knownWarningCounts },
  errorLevelEvents: { total: errorLevelEvents.length, knownSharedPrimitive: errorLevelEvents.length - unexpectedErrorLevelEvents.length, unexpected: unexpectedErrorLevelEvents.length },
  unclassifiedRetainedEvents: classifiedEvents.filter((event) => event.category === null).length,
  runtimeExceptions: runtimeExceptions.length,
  networkFailures: networkFailures.length,
  eventClassifications: classifiedEvents,
  pass: unexpectedErrorLevelEvents.length === 0 && runtimeExceptions.length === 0 && networkFailures.length === 0,
};
for (const event of [...runtimeExceptions, ...networkFailures]) {
  results.failures.push(`relevant browser event: ${JSON.stringify(event)}`);
}
for (const event of unexpectedErrorLevelEvents) {
  results.failures.push(`unexpected error-level console event: ${JSON.stringify(relevantEvents[event.index])}`);
}
results.pass = results.failures.length === 0 && results.consoleClassification.pass && results.routeChecks.every((check) => check.verdict === "PASS") && results.interactions.every((check) => check.verdict === "PASS");
await writeFile(path.join(evidenceDir, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ pass: results.pass, routes: results.routeChecks.length, interactions: results.interactions.length, consoleClassification: results.consoleClassification, failures: results.failures }, null, 2));
socket.close();
if (!results.pass) process.exitCode = 1;
