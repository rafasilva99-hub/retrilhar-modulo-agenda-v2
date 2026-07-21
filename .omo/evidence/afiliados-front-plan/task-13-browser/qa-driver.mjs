import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [cdpPort, appPort, evidenceDir] = process.argv.slice(2);
if (!cdpPort || !appPort || !evidenceDir) {
  throw new Error("Usage: node qa-driver.mjs <cdp-port> <app-port> <evidence-dir>");
}

const baseUrl = `http://127.0.0.1:${appPort}/`;
const browserUrl = `http://127.0.0.1:${cdpPort}`;
const screenshotsDir = path.join(evidenceDir, "screenshots");
await mkdir(screenshotsDir, { recursive: true });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const normalize = (value) => value.replace(/\s+/g, " ").trim();

const tabs = await fetch(`${browserUrl}/json/list`).then((response) => response.json());
const tab = tabs.find((candidate) => candidate.type === "page");
if (!tab?.webSocketDebuggerUrl) throw new Error("Chrome exposed no page target");

const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const waiters = new Map();
const consoleEvents = [];

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

  const waiting = waiters.get(payload.method);
  if (waiting) {
    waiters.delete(payload.method);
    waiting(payload.params);
  }

  if (
    payload.method === "Runtime.exceptionThrown" ||
    payload.method === "Runtime.consoleAPICalled" ||
    payload.method === "Log.entryAdded" ||
    payload.method === "Network.loadingFailed"
  ) {
    consoleEvents.push({ method: payload.method, params: payload.params });
  }
});

function send(method, params = {}) {
  const id = ++commandId;
  return new Promise((resolve, reject) => {
    pending.set(id, { method, resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitForEvent(method, timeout = 15_000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      waiters.delete(method);
      reject(new Error(`Timed out waiting for ${method}`));
    }, timeout);
    waiters.set(method, (params) => {
      clearTimeout(timer);
      resolve(params);
    });
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(
      response.exceptionDetails.exception?.description ?? "Runtime evaluation failed"
    );
  }
  return response.result.value;
}

async function waitFor(expression, label, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function settle() {
  await evaluate(
    `new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))`
  );
}

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
    screenWidth: width,
    screenHeight: height,
  });
}

let navigationSequence = 0;
async function navigate(hash, expectedHash = `#${hash}`, expectedText = "") {
  const loaded = waitForEvent("Page.loadEventFired");
  navigationSequence += 1;
  await send("Page.navigate", { url: `${baseUrl}?qa=${navigationSequence}#${hash}` });
  await loaded;
  await waitFor(
    `location.hash === ${JSON.stringify(expectedHash)} && document.body.innerText.trim().length > 40`,
    `${expectedHash} nonblank`
  );
  if (expectedText) {
    await waitFor(
      `document.body.innerText.includes(${JSON.stringify(expectedText)})`,
      `${expectedHash} text ${expectedText}`
    );
  }
  await settle();
}

async function pngMetadata(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  return {
    bytes: buffer.length,
    pngSignatureValid: signature === "89504e470d0a1a0a",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function capture(name, width, height) {
  await evaluate("scrollTo(0, 0)");
  await settle();
  const response = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const buffer = Buffer.from(response.data, "base64");
  const filePath = path.join(screenshotsDir, `${name}.png`);
  await writeFile(filePath, buffer);
  const metadata = await pngMetadata(buffer);
  return {
    path: filePath,
    ...metadata,
    dimensionsMatch: metadata.width === width && metadata.height === height,
  };
}

async function inspectPage(expectedText) {
  return evaluate(`(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const nameOf = (element) => {
      const labelledBy = element.getAttribute("aria-labelledby");
      const labelledText = labelledBy
        ? labelledBy.split(/\\s+/).map((id) => document.getElementById(id)?.innerText ?? "").join(" ")
        : "";
      const label = element.labels?.[0]?.innerText ?? "";
      const imageAlt = element.querySelector?.("img[alt]")?.getAttribute("alt") ?? "";
      return [
        element.getAttribute("aria-label"), labelledText, label, element.innerText,
        element.getAttribute("title"), element.getAttribute("placeholder"), imageAlt,
      ].find((value) => value?.trim())?.replace(/\\s+/g, " ").trim() ?? "";
    };
    const controls = [...document.querySelectorAll(
      'button,a[href],input,select,textarea,[role="button"],[role="link"],[role="menuitem"],[role="tab"],[tabindex]'
    )].filter((element) => visible(element) && !element.matches('[tabindex="-1"]'));
    const missingNames = controls
      .filter((element) => !nameOf(element))
      .map((element) => ({ tag: element.tagName, role: element.getAttribute("role") }));
    const clippedControls = controls.flatMap((element) => {
      const nestedControl = element.querySelector?.(
        'button,a[href],input,select,textarea,[role="button"],[role="link"],[role="menuitem"],[role="tab"]'
      );
      const style = getComputedStyle(element);
      if (
        element.getAttribute("role") === "tablist" ||
        nestedControl ||
        style.overflowX === "auto" ||
        style.overflowX === "scroll"
      ) return [];
      const text = (element.innerText ?? "").replace(/\\s+/g, " ").trim();
      if (!text || element.scrollWidth <= element.clientWidth + 1) return [];
      if (style.overflowX === "visible" && style.whiteSpace !== "nowrap") return [];
      return [{ name: nameOf(element), text, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }];
    });
    return {
      hash: location.hash,
      title: document.querySelector("h1")?.innerText?.trim() ?? "",
      bodyTextLength: document.body.innerText.trim().length,
      expectedTextPresent: document.body.innerText.includes(${JSON.stringify(expectedText)}),
      globalHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      visibleControlCount: controls.length,
      missingNames,
      clippedControls,
      visibleProfileControls: [...document.querySelectorAll('button[aria-label="Perfil"]')].filter(visible).length,
      diacritics: Object.fromEntries(
        ["Indicações", "Configurações", "Afiliações", "Comissão", "Organização"].map((text) => [text, document.body.innerText.includes(text)])
      ),
    };
  })()`);
}

async function elementPoint(expression, label) {
  const result = await evaluate(`(() => {
    const element = ${expression};
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!result) throw new Error(`Could not locate ${label}`);
  return result;
}

async function clickExpression(expression, label) {
  const point = await elementPoint(expression, label);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: point.x,
    y: point.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: point.x,
    y: point.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
}

function visibleControlByName(name, role = "") {
  return `([...document.querySelectorAll(${JSON.stringify(
    role ? `[role="${role}"]` : "button,a[href],[role=button],[role=menuitem]"
  )})].find((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const value = (element.getAttribute("aria-label") || element.innerText || element.getAttribute("title") || "").replace(/\\s+/g, " ").trim();
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && value === ${JSON.stringify(name)};
  }))`;
}

async function clickNamed(name, role = "") {
  await clickExpression(visibleControlByName(name, role), name);
}

async function pressKey(key, modifiers = 0) {
  const keyData = {
    Tab: { code: "Tab", windowsVirtualKeyCode: 9 },
    Enter: { code: "Enter", windowsVirtualKeyCode: 13 },
    Escape: { code: "Escape", windowsVirtualKeyCode: 27 },
    ArrowDown: { code: "ArrowDown", windowsVirtualKeyCode: 40 },
    " ": { code: "Space", windowsVirtualKeyCode: 32 },
  }[key];
  const text = key === "Enter" ? "\r" : key === " " ? " " : undefined;
  await send("Input.dispatchKeyEvent", {
    type: "rawKeyDown",
    key,
    modifiers,
    text,
    unmodifiedText: text,
    ...keyData,
  });
  if (text) {
    await send("Input.dispatchKeyEvent", {
      type: "char",
      key,
      modifiers,
      text,
      unmodifiedText: text,
      ...keyData,
    });
  }
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, modifiers, ...keyData });
  await settle();
}

async function activeElement() {
  return evaluate(`(() => {
    const element = document.activeElement;
    if (!element) return null;
    const style = getComputedStyle(element);
    const name = (element.getAttribute("aria-label") || element.innerText || element.getAttribute("title") || element.getAttribute("placeholder") || "").replace(/\\s+/g, " ").trim();
    return {
      tag: element.tagName,
      role: element.getAttribute("role") || (element.tagName === "BUTTON" ? "button" : element.tagName === "A" ? "link" : ""),
      name,
      outline: [style.outlineStyle, style.outlineWidth, style.outlineColor].join(" "),
      boxShadow: style.boxShadow,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      visibleFocus: (style.outlineStyle !== "none" && style.outlineWidth !== "0px") || style.boxShadow !== "none",
    };
  })()`);
}

async function tabUntil(nameFragment, maximum = 80) {
  await evaluate("document.activeElement?.blur(); scrollTo(0, 0)");
  for (let index = 0; index < maximum; index += 1) {
    await pressKey("Tab");
    const sample = await activeElement();
    if (sample?.name.includes(nameFragment)) return { tabs: index + 1, ...sample };
  }
  throw new Error(`Tab traversal did not reach ${nameFragment}`);
}

await Promise.all([
  send("Page.enable"),
  send("Runtime.enable"),
  send("Log.enable"),
  send("Network.enable"),
  send("Accessibility.enable"),
]);

const directRoutes = [
  ["afiliados", "Oi Katiely,"],
  ["indicacoes", "Indicações originadas"],
  ["ganhos", "Extrato de comissões"],
  ["produtosLinks", "Link geral (nível 1)"],
  ["configuracoes", "Meu Perfil"],
  ["ajuda", "Como podemos ajudar?"],
];
const directViewports = [
  [390, 844],
  [768, 900],
  [1280, 900],
];
const previewViewports = [
  [390, 844],
  [1280, 900],
];
const routeChecks = [];
const interactionChecks = [];
const focusChecks = [];

for (const [width, height] of directViewports) {
  await setViewport(width, height);
  for (const [hash, expectedText] of directRoutes) {
    const viewportText = hash === "configuracoes" && width < 768 ? "Configurações" : expectedText;
    await navigate(hash, `#${hash}`, viewportText);
    const audit = await inspectPage(viewportText);
    const screenshot = await capture(`direct-${hash}-${width}x${height}`, width, height);
    routeChecks.push({ kind: "direct", hash, viewport: { width, height }, audit, screenshot });
  }
}

for (const [width, height] of previewViewports) {
  await setViewport(width, height);
  for (const [hash, expectedText] of directRoutes) {
    const previewHash = `preview/${hash}`;
    const viewportText = hash === "configuracoes" && width < 768 ? "Configurações" : expectedText;
    await navigate(previewHash, `#${previewHash}`, viewportText);
    const audit = await inspectPage(viewportText);
    const screenshot = await capture(`preview-${hash}-${width}x${height}`, width, height);
    routeChecks.push({
      kind: "preview",
      hash: previewHash,
      viewport: { width, height },
      audit,
      screenshot,
    });
  }
}

await setViewport(1280, 900);
await navigate("afiliados", "#afiliados", "Oi Katiely,");
for (const [name, hash, text] of [
  ["Indicações", "#indicacoes", "Indicações originadas"],
  ["Ganhos", "#ganhos", "Extrato de comissões"],
  ["Produtos e Links", "#produtosLinks", "Link geral (nível 1)"],
  ["Início", "#afiliados", "Oi Katiely,"],
]) {
  await clickNamed(name);
  await waitFor(
    `location.hash === ${JSON.stringify(hash)} && document.body.innerText.includes(${JSON.stringify(text)})`,
    `${name} navigation`
  );
  interactionChecks.push({
    scenario: `sidebar ${name}`,
    pass: true,
    hash: await evaluate("location.hash"),
  });
}

for (const [menuName, expectedHash, expectedText] of [
  ["Configurações", "#configuracoes", "Meu Perfil"],
  ["Ajuda e Suporte", "#ajuda", "Como podemos ajudar?"],
]) {
  await navigate("afiliados", "#afiliados", "Oi Katiely,");
  await clickNamed("Perfil");
  await waitFor(
    `!![...document.querySelectorAll('[role="menuitem"]')].find((element) => element.innerText.includes(${JSON.stringify(menuName)}))`,
    `${menuName} menu item`
  );
  await clickNamed(menuName, "menuitem");
  await waitFor(
    `location.hash === ${JSON.stringify(expectedHash)} && document.body.innerText.includes(${JSON.stringify(expectedText)})`,
    `${menuName} full screen`
  );
  const shellHidden = (await inspectPage(expectedText)).visibleProfileControls === 0;
  await clickNamed("Fechar");
  await waitFor(
    `location.hash === "#afiliados" && document.body.innerText.includes("Oi Katiely,")`,
    `${menuName} close`
  );
  interactionChecks.push({
    scenario: `profile ${menuName}`,
    pass: shellHidden,
    fullScreenShellHidden: shellHidden,
    hash: await evaluate("location.hash"),
  });
}

await navigate("agenda", "#agenda", "Agenda");
await clickExpression(
  `([...document.querySelectorAll('button')].find((element) => element.innerText.includes("EliasTurismo") && element.getBoundingClientRect().width > 0))`,
  "EliasTurismo organization trigger"
);
await waitFor(
  `!![...document.querySelectorAll('[role="menuitem"]')].find((element) => element.innerText.includes("Painel de Afiliado"))`,
  "affiliate organization item"
);
await clickExpression(
  `([...document.querySelectorAll('[role="menuitem"]')].find((element) => element.innerText.includes("Painel de Afiliado") && element.getBoundingClientRect().width > 0))`,
  "Painel de Afiliado"
);
await waitFor(
  `location.hash === "#afiliados" && document.body.innerText.includes("Oi Katiely,")`,
  "organization to affiliate"
);
interactionChecks.push({
  scenario: "organization to affiliate",
  pass: true,
  hash: await evaluate("location.hash"),
});

await clickExpression(
  `([...document.querySelectorAll('button')].find((element) => element.innerText.includes("Painel de Afiliado") && element.getBoundingClientRect().width > 0))`,
  "affiliate organization trigger"
);
await waitFor(
  `!![...document.querySelectorAll('[role="menuitem"]')].find((element) => element.innerText.includes("EliasTurismo"))`,
  "manager organization item"
);
await clickExpression(
  `([...document.querySelectorAll('[role="menuitem"]')].find((element) => element.innerText.includes("EliasTurismo") && element.getBoundingClientRect().width > 0))`,
  "EliasTurismo organization item"
);
await waitFor(
  `location.hash === "#agendaDia" && document.body.innerText.trim().length > 40`,
  "organization back to agenda day"
);
interactionChecks.push({
  scenario: "organization back to agenda",
  pass: true,
  hash: await evaluate("location.hash"),
});

await navigate("agenda", "#agenda", "Agenda");
await clickExpression(
  `([...document.querySelectorAll('div')].find((element) => element.classList.contains("cursor-text") && element.innerText.includes("Buscar...") && element.getBoundingClientRect().width > 0))`,
  "global search"
);
await waitFor(
  `!![...document.querySelectorAll('input[placeholder="Buscar..."]')].find((element) => element.getBoundingClientRect().width > 0)`,
  "global search input"
);
await clickExpression(
  `([...document.querySelectorAll('input[placeholder="Buscar..."]')].find((element) => element.getBoundingClientRect().width > 0))`,
  "global search input"
);
await send("Input.insertText", { text: "Afiliados" });
await pressKey("Enter");
await waitFor(
  `location.hash === "#afiliados" && document.body.innerText.includes("Oi Katiely,")`,
  "global search affiliate result"
);
interactionChecks.push({
  scenario: "global search to affiliate",
  pass: true,
  hash: await evaluate("location.hash"),
});

await navigate("afiliados", "#afiliados", "Oi Katiely,");
const sidebarFocus = await tabUntil("Indicações");
await pressKey("Enter");
await waitFor(`location.hash === "#indicacoes"`, "sidebar keyboard activation");
focusChecks.push({
  scenario: "sidebar keyboard",
  ...sidebarFocus,
  activatedHash: await evaluate("location.hash"),
});

await navigate("afiliados", "#afiliados", "Oi Katiely,");
const profileFocus = await tabUntil("Perfil");
await pressKey("Enter");
await waitFor(`!!document.querySelector('[role="menuitem"]')`, "profile keyboard menu");
focusChecks.push({ scenario: "profile keyboard", ...profileFocus, menuOpened: true });
await pressKey("Escape");

await navigate("indicacoes", "#indicacoes", "Indicações originadas");
const rowFocus = await tabUntil("Abrir detalhe da indicação");
const scrollBefore = await evaluate("scrollY");
await pressKey(" ");
await waitFor(
  `!![...document.querySelectorAll('[role="dialog"]')].find((element) => element.getBoundingClientRect().width > 0)`,
  "indication detail by Space"
);
const scrollAfter = await evaluate("scrollY");
focusChecks.push({
  scenario: "indication row keyboard",
  ...rowFocus,
  spacePreventedScroll: scrollBefore === scrollAfter,
  scrollBefore,
  scrollAfter,
});
const closeName = await evaluate(
  `([...document.querySelectorAll('button')].filter((element) => element.getBoundingClientRect().width > 0).map((element) => element.getAttribute("aria-label") || element.innerText.trim()).find((name) => name?.toLowerCase().includes("fechar")))`
);
if (closeName) await clickNamed(normalize(closeName));

await navigate("configuracoes", "#configuracoes", "Meu Perfil");
const settingsFocus = await tabUntil("Formas de recebimento");
await pressKey("Enter");
await waitFor(
  `document.body.innerText.includes("Meus destinos de recebimento")`,
  "settings section activation"
);
focusChecks.push({ scenario: "settings section keyboard", ...settingsFocus, sectionOpened: true });

await navigate("doesNotExist", "#agenda", "Agenda");
const unknownScreenshot = await capture("unknown-hash-1280x900", 1280, 900);
routeChecks.push({
  kind: "unknown",
  hash: "doesNotExist",
  viewport: { width: 1280, height: 900 },
  audit: await inspectPage("Agenda"),
  screenshot: unknownScreenshot,
});

const relevantConsoleEvents = consoleEvents.filter((event) => {
  const serialized = JSON.stringify(event);
  const firstArgument = event.params?.args?.[0]?.value;
  if (
    event.method === "Runtime.consoleAPICalled" &&
    event.params?.type === "debug" &&
    firstArgument?.startsWith("[vite]")
  )
    return false;
  return !serialized.includes("favicon.ico") && !serialized.includes("Download the React DevTools");
});
const failures = [];
for (const check of routeChecks) {
  if (check.audit.hash !== (check.kind === "unknown" ? "#agenda" : `#${check.hash}`))
    failures.push(`${check.kind} ${check.hash}: wrong hash ${check.audit.hash}`);
  if (!check.audit.expectedTextPresent || check.audit.bodyTextLength <= 40)
    failures.push(`${check.kind} ${check.hash}: blank or missing expected text`);
  if (check.audit.globalHorizontalOverflow)
    failures.push(
      `${check.kind} ${check.hash}: global horizontal overflow at ${check.viewport.width}`
    );
  if (check.kind !== "unknown" && check.audit.missingNames.length > 0)
    failures.push(
      `${check.kind} ${check.hash}: ${check.audit.missingNames.length} unnamed controls`
    );
  if (check.kind !== "unknown" && check.audit.clippedControls.length > 0)
    failures.push(
      `${check.kind} ${check.hash}: clipped controls ${JSON.stringify(check.audit.clippedControls)}`
    );
  if (
    !check.screenshot.pngSignatureValid ||
    !check.screenshot.dimensionsMatch ||
    check.screenshot.bytes === 0
  )
    failures.push(`${check.kind} ${check.hash}: invalid screenshot`);
}
for (const check of interactionChecks) if (!check.pass) failures.push(`${check.scenario}: failed`);
for (const check of focusChecks) {
  if (!check.visibleFocus) failures.push(`${check.scenario}: no visible focus style`);
  if (check.spacePreventedScroll === false) failures.push(`${check.scenario}: Space scrolled page`);
}
for (const event of relevantConsoleEvents) {
  if (event.method === "Runtime.exceptionThrown" || event.method === "Network.loadingFailed")
    failures.push(`browser runtime event: ${JSON.stringify(event)}`);
}

const output = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  cdpPort: Number(cdpPort),
  appPort: Number(appPort),
  routeChecks,
  interactionChecks,
  focusChecks,
  consoleEvents: relevantConsoleEvents,
  failures,
  pass: failures.length === 0,
};
await writeFile(path.join(evidenceDir, "results.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      pass: output.pass,
      routeChecks: routeChecks.length,
      interactions: interactionChecks.length,
      focusChecks: focusChecks.length,
      consoleEvents: relevantConsoleEvents.length,
      failures,
    },
    null,
    2
  )
);

socket.close();
if (failures.length > 0) process.exitCode = 1;
