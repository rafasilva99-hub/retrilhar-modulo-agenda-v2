import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [cdpPort, appPort, evidenceDir] = process.argv.slice(2);

if (!cdpPort || !appPort || !evidenceDir) {
  throw new Error("Usage: node qa-pointer-driver.mjs <cdp-port> <app-port> <evidence-dir>");
}

const appUrl = `http://127.0.0.1:${appPort}/`;
const cdpUrl = `http://127.0.0.1:${cdpPort}`;
const result = {
  generatedAt: new Date().toISOString(),
  appUrl,
  scenarios: [],
  consoleMessages: [],
  failures: [],
};

await mkdir(evidenceDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const targets = await fetch(`${cdpUrl}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) {
  throw new Error("Chrome exposed no page target");
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();

socket.addEventListener("message", (message) => {
  const payload = JSON.parse(message.data);

  if (payload.id) {
    const request = pending.get(payload.id);
    pending.delete(payload.id);
    if (!request) return;

    if (payload.error) {
      request.reject(new Error(`${request.method}: ${payload.error.message}`));
    } else {
      request.resolve(payload.result);
    }
    return;
  }

  if (payload.method === "Runtime.consoleAPICalled" || payload.method === "Log.entryAdded") {
    result.consoleMessages.push(payload);
  }
});

function send(method, params = {}) {
  const id = ++requestId;
  return new Promise((resolve, reject) => {
    pending.set(id, { method, resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description ?? "Runtime evaluation failed");
  }
  return response.result.value;
}

async function waitFor(expression, label, timeout = 12_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(60);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function settle() {
  await evaluate("new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
}

async function screenshot(name) {
  await settle();
  const response = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const file = path.join(evidenceDir, `${name}.png`);
  await writeFile(file, Buffer.from(response.data, "base64"));
  return file;
}

async function point(expression, label) {
  const value = await evaluate(`(() => {
    const element = ${expression};
    if (!element) return null;
    element.scrollIntoView({ block: "center", inline: "center" });
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!value) throw new Error(`Could not locate ${label}`);
  return value;
}

async function click(expression, label) {
  const { x, y } = await point(expression, label);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
  await settle();
}

function buttonByText(text) {
  return `([...document.querySelectorAll("button")].find((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== "hidden" &&
      (element.innerText || "").replace(/\\s+/g, " ").trim() === ${JSON.stringify(text)};
  }))`;
}

const routeCardsExpression = `([...document.querySelectorAll('[data-route-day-card="true"]')].map((element) => (element.innerText || "").replace(/\\s+/g, " ").trim()))`;

async function getRouteCards() {
  return evaluate(routeCardsExpression);
}

async function assertRouteOrder(label, expectedFirstHasTitle, expectedSecondHasTitle) {
  const cards = await getRouteCards();
  const first = cards[0] ?? "";
  const second = cards[1] ?? "";
  const title = "Trilha Pico do Itacolomi";
  const separatorAppearsOnlyWithTitle = first.includes(title)
    ? first.includes("Dia 1 ·")
    : second.includes("Dia 2 ·");
  const pass =
    cards.length === 2 &&
    first.includes("Dia 1") &&
    second.includes("Dia 2") &&
    first.includes(title) === expectedFirstHasTitle &&
    second.includes(title) === expectedSecondHasTitle &&
    separatorAppearsOnlyWithTitle;

  if (!pass) {
    throw new Error(`${label}: unexpected route cards ${JSON.stringify(cards)}`);
  }

  return cards;
}

async function openRouteSection() {
  await send("Page.navigate", { url: `${appUrl}?routeReorderQa=${Date.now()}#produtos` });
  await waitFor("document.readyState === 'complete'", "document ready");
  await waitFor("document.body.innerText.includes('Produtos')", "products page");
  await evaluate(`localStorage.removeItem("retrilhar:produtos:new-product-form:v1");
    localStorage.removeItem("retrilhar:produtos:new-product-flow:v1");`);
  await send("Page.navigate", { url: `${appUrl}?routeReorderQa=${Date.now()}#produtos` });
  await waitFor("document.body.innerText.includes('Novo produto')", "new product button");
  await click(buttonByText("Novo produto"), "Novo produto");
  await waitFor("document.body.innerText.includes('Informações do produto')", "new product flow");
  await evaluate(`document.getElementById("produto-schedule")?.scrollIntoView({ block: "start" })`);
  await waitFor("!!document.getElementById('produto-schedule')", "schedule section");
  await waitFor("document.body.innerText.includes('Adicionar roteiro')", "route section").catch(
    async (error) => {
      const debug = await evaluate(`(() => ({
        text: document.body.innerText.slice(0, 4000),
        buttons: [...document.querySelectorAll("button")].map((button) => ({
          text: (button.innerText || "").replace(/\\s+/g, " ").trim(),
          aria: button.getAttribute("aria-label"),
          visible: button.getBoundingClientRect().width > 0 && button.getBoundingClientRect().height > 0
        })).filter((button) => button.visible).slice(0, 80),
        sections: [...document.querySelectorAll("section[id]")].map((section) => section.id)
      }))()`);
      await writeFile(
        path.join(evidenceDir, `route-section-debug-${Date.now()}.json`),
        JSON.stringify(debug, null, 2)
      );
      throw error;
    }
  );
  await click(buttonByText("Adicionar roteiro"), "Adicionar roteiro");
  await waitFor("document.querySelectorAll('[data-route-day-card=\"true\"]').length === 2", "two route cards");
}

async function dragFirstHandle({ cancel }) {
  await evaluate(`(() => {
    if (window.__routePointerCapturePatched) return;
    window.__routePointerCapturePatched = true;
    Element.prototype.setPointerCapture = function(pointerId) {
      this.__routeCapturedPointerId = pointerId;
    };
    Element.prototype.releasePointerCapture = function(pointerId) {
      if (this.__routeCapturedPointerId === pointerId) {
        this.__routeCapturedPointerId = null;
      }
    };
    Element.prototype.hasPointerCapture = function(pointerId) {
      return this.__routeCapturedPointerId === pointerId;
    };
  })()`);
  const start = await point(
    `document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0]`,
    "first route reorder handle"
  );
  const targetY = start.y + 92;
  await evaluate(`(() => {
    const handle = document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0];
    handle.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerId: 41,
      pointerType: "mouse",
      buttons: 1,
      clientX: ${start.x},
      clientY: ${start.y}
    }));
  })()`);
  await settle();
  await evaluate(`(() => {
    const handle = document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0];
    handle.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      pointerId: 41,
      pointerType: "mouse",
      buttons: 1,
      clientX: ${start.x},
      clientY: ${targetY}
    }));
  })()`);
  await sleep(120);
  const previewCards = await getRouteCards();
  const previewTransforms = await evaluate(`([...document.querySelectorAll('[data-route-day-card="true"]')].map((element) => getComputedStyle(element).transform))`);

  if (cancel) {
    await evaluate(`(() => {
      const handle = document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0];
      handle.dispatchEvent(new PointerEvent("pointercancel", {
        bubbles: true,
        cancelable: true,
        pointerId: 41,
        pointerType: "mouse",
        buttons: 0,
        clientX: ${start.x},
        clientY: ${targetY}
      }));
    })()`);
  } else {
    await evaluate(`(() => {
      const handle = document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0];
      handle.dispatchEvent(new PointerEvent("pointerup", {
        bubbles: true,
        cancelable: true,
        pointerId: 41,
        pointerType: "mouse",
        buttons: 0,
        clientX: ${start.x},
        clientY: ${targetY}
      }));
    })()`);
  }
  await sleep(250);

  return { previewCards, previewTransforms };
}

async function dragFirstHandleWithMouse() {
  const start = await point(
    `document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0]`,
    "first route reorder handle"
  );
  const targetY = start.y + 92;

  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: start.x, y: start.y });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: start.x,
    y: start.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await sleep(80);
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: start.x,
    y: targetY,
    button: "left",
    buttons: 1,
  });
  await sleep(120);

  const previewCards = await getRouteCards();
  const previewTransforms = await evaluate(`([...document.querySelectorAll('[data-route-day-card="true"]')].map((element) => getComputedStyle(element).transform))`);

  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: start.x,
    y: targetY,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
  await sleep(250);

  return { previewCards, previewTransforms };
}

async function runScenario(label, fn) {
  try {
    const details = await fn();
    result.scenarios.push({ label, verdict: "PASS", ...details });
  } catch (error) {
    result.scenarios.push({ label, verdict: "FAIL", error: String(error?.stack ?? error) });
    result.failures.push(`${label}: ${String(error?.message ?? error)}`);
  }
}

await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);
await evaluate(`(() => {
  if (window.__routePointerCapturePatched) return;
  window.__routePointerCapturePatched = true;
  Element.prototype.setPointerCapture = function(pointerId) {
    this.__routeCapturedPointerId = pointerId;
  };
  Element.prototype.releasePointerCapture = function(pointerId) {
    if (this.__routeCapturedPointerId === pointerId) {
      this.__routeCapturedPointerId = null;
    }
  };
  Element.prototype.hasPointerCapture = function(pointerId) {
    return this.__routeCapturedPointerId === pointerId;
  };
})()`);
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
  screenWidth: 1280,
  screenHeight: 900,
});

await runScenario("pointercancel keeps original route order", async () => {
  await openRouteSection();
  const before = await assertRouteOrder("before cancel", true, false);
  const drag = await dragFirstHandle({ cancel: true });
  const afterCancel = await assertRouteOrder("after cancel", true, false);
  const image = await screenshot("route-day-pointercancel-kept-order");
  return { before, afterCancel, ...drag, screenshot: image };
});

await runScenario("pointerup commits route reorder", async () => {
  await openRouteSection();
  const before = await assertRouteOrder("before commit", true, false);
  const drag = await dragFirstHandle({ cancel: false });
  const afterDrop = await assertRouteOrder("after drop", false, true);
  const settledTransforms = await evaluate(`([...document.querySelectorAll('[data-route-day-card="true"]')].map((element) => getComputedStyle(element).transform))`);
  const image = await screenshot("route-day-pointerup-committed-order");
  return { before, afterDrop, settledTransforms, ...drag, screenshot: image };
});

await runScenario("native mouse drag commits route reorder", async () => {
  await openRouteSection();
  const before = await assertRouteOrder("before native drag", true, false);
  const drag = await dragFirstHandleWithMouse();
  const afterDrop = await assertRouteOrder("after native drag", false, true);
  const image = await screenshot("route-day-native-mouse-committed-order");
  return { before, afterDrop, ...drag, screenshot: image };
});

await runScenario("keyboard arrow fallback reorders route card", async () => {
  await openRouteSection();
  await assertRouteOrder("before keyboard", true, false);
  await evaluate(`document.querySelectorAll('[data-route-day-reorder-handle="true"]')[0].focus()`);
  await send("Input.dispatchKeyEvent", {
    type: "rawKeyDown",
    key: "ArrowDown",
    code: "ArrowDown",
    windowsVirtualKeyCode: 40,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowDown",
    code: "ArrowDown",
    windowsVirtualKeyCode: 40,
  });
  await sleep(150);
  const afterKey = await assertRouteOrder("after keyboard", false, true);
  return { afterKey };
});

await writeFile(
  path.join(evidenceDir, "route-day-pointer-reorder-fresh.json"),
  JSON.stringify(result, null, 2)
);

socket.close();

if (result.failures.length > 0) {
  throw new Error(result.failures.join("; "));
}
