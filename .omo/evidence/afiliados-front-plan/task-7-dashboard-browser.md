# Todo 7 — browser evidence for `#afiliados`

## Runtime and invocation

- Server command: `npm run dev -- --host 127.0.0.1`
- Actual Vite URL: `http://127.0.0.1:5178/` (ports 5173–5177 were occupied).
- Browser tool: Playwright 1.52.0, launched from the ephemeral `npx` cache without changing `package.json` or the lockfile.
- The Vite process, browser contexts, and pages were closed after capture. The server was stopped with Ctrl-C.

## Happy path — desktop

Invocation: Playwright against `http://127.0.0.1:5178/#afiliados`, viewport `1440x1000`.

Steps:

1. Open `#afiliados` and wait for `Oi Katiely`.
2. Click `Copiar`; wait for `Copiado`; read the clipboard.
3. Click the first referral row for `João Pedro da Silva Oliveira`.
4. Confirm `Detalhe da indicação`, `Rapel Cachoeira`, and `Tirolesa Radical`.
5. Capture the drawer, click `Fechar aba`, and wait for the drawer to disappear.
6. Read the dashboard link destinations and capture the closed dashboard.

Result, process exit `0`:

```json
{
  "initialUrl": "http://127.0.0.1:5178/#afiliados",
  "copiedText": "KAT-2931",
  "copiedFeedback": "Copiado",
  "cartItemsVisible": true,
  "detailClosed": true,
  "links": [
    { "text": "Indicações", "href": "#indicacoes" },
    { "text": "Ganhos", "href": "#ganhos" },
    { "text": "Produtos e links", "href": "#produtosLinks" },
    { "text": "Configurações", "href": "#configuracoes" },
    { "text": "Ajuda", "href": "#ajuda" }
  ]
}
```

Artifacts:

- `.omo/evidence/afiliados-front-plan/task-7-dashboard.png`
- `.omo/evidence/afiliados-front-plan/task-7-dashboard-detail.png`

## Failure path — empty state and narrow viewport

Invocation: Playwright against `http://127.0.0.1:5178/#afiliados`, viewport `375x900`.

Steps:

1. Open `#afiliados`.
2. Use the existing shell control `Encolher menu` so the shared sidebar does not cover the feature viewport.
3. Fill `Pesquisar indicações` with `sem-resultado`.
4. Confirm `Nenhuma indicação encontrada` and `Passo a Passo`; capture the state after vertical scrolling only.

Result, process exit `0`:

```json
{
  "url": "http://127.0.0.1:5178/#afiliados",
  "viewport": "375x900",
  "emptyState": "Nenhuma indicação encontrada",
  "stepsVisible": true,
  "scrollWidth": 375,
  "innerWidth": 375,
  "shellScrollLeft": 0
}
```

Artifact: `.omo/evidence/afiliados-front-plan/task-7-dashboard-empty.png`.

Additional responsive smoke at `768x900` and `1280x900` reported `scrollWidth === innerWidth`, dashboard content visible, and 2 KPI columns at 768px. Artifacts: `task-7-dashboard-768.png` and `task-7-dashboard-1280.png`. The 375px shell-expanded state still inherits the shared layout's fixed 200px sidebar; making that shell auto-collapse would require files outside the authorized write set. The feature itself was verified in the supported collapsed-shell mobile state without overflow.

## Visual QA record

Fresh screenshots were inspected directly after the last source change:

- Dashboard: KPI cards, affiliate code banner, filters, referral table, and five route links are legible at desktop.
- Detail: the Sheet has a clear title, customer/order context, cart items, order/commission statuses, and a visible close action.
- Empty state: the title and description wrap inside the narrow card; the clear action and step-by-step card remain visible.

No pixel reference image was supplied; visual comparison used `DESIGN.md` and the rendered browser artifacts. The active tool surface did not provide independent oracle/subagent workers, so the record intentionally claims manual visual inspection plus deterministic browser assertions, not an independent-oracle pass.
