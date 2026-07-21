# Todo 14 final browser QA

Date: 2026-07-20. Surface: real browser UI, Vite-served application. The browser was Chrome headless with CDP pointer/keyboard actions and screenshots; no DOM-only inference was used for interaction verdicts.

## Exact invocations

```sh
npm run dev -- --host 127.0.0.1 --port 51654 --strictPort
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=51655 --user-data-dir=/tmp/retrilhar-todo14-gate-fix.Tyoa3f --no-first-run --no-default-browser-check about:blank
node .omo/evidence/afiliados-front-plan/final-browser/qa-driver.mjs 51655 51654 .omo/evidence/afiliados-front-plan/final-browser
```

Actual app port: `51654`. CDP port: `51655`. Browser: Chrome `150.0.7871.128`. Final driver exit status: `0`. Machine result timestamp: `2026-07-20T23:53:40.709Z`.

## Direct-link matrix

Each row was navigated directly to the exact hash at the stated viewport. The driver audited nonblank expected text, current hash, horizontal overflow, unnamed/clipped/offscreen controls, PNG signature, and exact screenshot dimensions. All 12 rows passed; `results.json` reports `routeChecks: 12`, `failures: []`.

| scenario | invocation | verdict | artifact |
| --- | --- | --- | --- |
| `#afiliados` desktop | `http://127.0.0.1:51654/#afiliados`, 1280x800 | PASS | `screenshots/route-afiliados-1280x800.png` |
| `#indicacoes` desktop | `http://127.0.0.1:51654/#indicacoes`, 1280x800 | PASS | `screenshots/route-indicacoes-1280x800.png` |
| `#ganhos` desktop | `http://127.0.0.1:51654/#ganhos`, 1280x800 | PASS | `screenshots/route-ganhos-1280x800.png` |
| `#produtosLinks` desktop | `http://127.0.0.1:51654/#produtosLinks`, 1280x800 | PASS | `screenshots/route-produtosLinks-1280x800.png` |
| `#configuracoes` desktop | `http://127.0.0.1:51654/#configuracoes`, 1280x800 | PASS | `screenshots/route-configuracoes-1280x800.png` |
| `#ajuda` desktop | `http://127.0.0.1:51654/#ajuda`, 1280x800 | PASS | `screenshots/route-ajuda-1280x800.png` |
| `#afiliados` mobile | same hash, 390x844 | PASS | `screenshots/route-afiliados-390x844.png` |
| `#indicacoes` mobile | same hash, 390x844 | PASS | `screenshots/route-indicacoes-390x844.png` |
| `#ganhos` mobile | same hash, 390x844 | PASS | `screenshots/route-ganhos-390x844.png` |
| `#produtosLinks` mobile | same hash, 390x844 | PASS | `screenshots/route-produtosLinks-390x844.png` |
| `#configuracoes` mobile | same hash, 390x844 | PASS | `screenshots/route-configuracoes-390x844.png` |
| `#ajuda` mobile | same hash, 390x844 | PASS | `screenshots/route-ajuda-390x844.png` |

Observed for every row: expected screen text present, `documentWidth === viewportWidth`, no horizontal overflow, no unnamed controls, no clipped controls, valid non-empty PNG with matching dimensions.

## Required interaction matrix

| scenario | exact browser actions | observable result | verdict | artifacts |
| --- | --- | --- | --- | --- |
| Dashboard copy/detail/close | Open `#afiliados`; click `Copiar`; click detail card; close detail | Copy feedback exposed, detail opened, close returned to page | PASS | `interaction-dashboard-copied-1280x800.png`, `interaction-dashboard-detail-1280x800.png` |
| Indicações search/tab/detail/copy/back | Open `#indicacoes`; search `João`; click `Pagas`; open detail; click exposed copy; click back | Search result, paid tab, detail, copy feedback, and `#afiliados` back hash observed | PASS | `interaction-indicacoes-search-1280x800.png`, `interaction-indicacoes-pagas-1280x800.png`, `interaction-indicacoes-detail-1280x800.png`, `results.json` |
| Ganhos organization/detail/related link | Open `#ganhos`; select `Cerrado Experience`; open detail; follow related link | Organization filter and detail work; related navigation reached `#indicacoes` | PASS | `interaction-ganhos-org-filter-1280x800.png`, `interaction-ganhos-detail-1280x800.png` |
| Produtos/Links copy/request/unavailable | Open `#produtosLinks`; copy general, organization, and product links; request `Trilheiras de Brasília`; inspect `Cerrado Experience` unavailable item | All three copy feedbacks, `Solicitação enviada`, and disabled unavailable action observed | PASS | `interaction-produtos-organization-1280x800.png`, `interaction-produtos-product-copied-1280x800.png`, `results.json` |
| Configurações destination/cash/count | Open `#configuracoes`; open receiving forms; click `Alterar destino`; choose company account; confirm; inspect usage; attempt cash option | Destination changed; type remained read-only; usage count remained 2; cash action was a no-op | PASS | `interaction-configuracoes-updated-1280x800.png`, `results.json` |
| Ajuda search hit/no-result/Fechar | Open `#ajuda`; search a known term; search `zzzz-sem-resultado`; click `Fechar` | Hit and no-result states rendered; close returned to `#afiliados` | PASS | `interaction-ajuda-search-hit-390x844.png`, `interaction-ajuda-no-result-390x844.png` |

## Console and visual review

The final driver captured and retained 14 console events. Its machine-readable `consoleClassification` classifies all 14 as known shared-primitive React/Radix warnings:

- 9 `breadcrumb-dom-nesting` events rooted at `BreadcrumbSeparator` in `src/components/ui/breadcrumb.tsx`.
- 4 `sheet-overlay-ref` events rooted at `SheetOverlay` in `src/components/ui/sheet.tsx`.
- 1 `dialog-description` event emitted by the shared Radix `DialogContent` path.

Thirteen events use the browser's `error` console level, but all 13 matched an exact known shared-primitive signature. The final result has zero unexpected error-level events, zero unclassified retained events, zero `Runtime.exceptionThrown` events, zero `Network.loadingFailed` events, and no affiliate route or interaction failure. These retained warnings are classified as shared-primitive technical debt, not affiliate behavior failures. They are not suppressed: the raw events remain in `results.json`, and any unmatched `error`/`assert`, runtime exception, or network failure is promoted into `failures` and makes the driver exit nonzero.

Enforcement was proven adversarially before the clean final run. While the same 12 direct routes and 6 interactions ran, a separate CDP client invoked `Runtime.evaluate` with `console.error("TODO14_UNEXPECTED_CONSOLE_PROBE")`. The driver exited `1`, reported `pass: false`, and recorded exactly one unexpected error-level event. Artifact: `console-policy-red/results.json`. The clean rerun then exited `0` with `pass: true`, 12/12 route checks, 6/6 interactions, and the zero-failure counters above.

The route audit at both viewports found no horizontal overflow, unnamed controls, clipped controls, or offscreen controls. Every screenshot is a non-empty PNG with the requested dimensions. The first earlier run exposed mobile expanded-sidebar clipping and an organization selector edge case; those are retained as pre-fix evidence and were corrected before this final rerun.

QA-triggered source changes, with source refs:

- `src/modules/afiliados/AfiliadosPage.tsx:747-753`: collapse shell on mobile mount.
- `src/modules/afiliados/GanhosPage.tsx:199-205`: collapse shell on mobile mount.
- `src/modules/afiliados/ProdutosLinksPage.tsx:241-247`: collapse shell on mobile mount.
- `src/modules/afiliados/components/organization-filter.tsx:37-41`: wrap and constrain organization selector on narrow screens.

These were the only product-source edits made by QA; all prior dirty-worktree changes were preserved. Pre-fix artifacts: `pre-fix/results.json` and its three mobile screenshots.

Ownership handback for these four changes is recorded in `task-14-handback.md`: dashboard collapse to Todo 7, earnings collapse to Todo 9, products/links collapse to Todo 10, and responsive organization selector sizing to Todo 6.

## Cleanup

The Vite and Chrome QA sessions were terminated after the final run. Fresh checks found no listener on ports `51654` or `51655`, no process using `/tmp/retrilhar-todo14-gate-fix.Tyoa3f`, and the exact temporary Chrome profile was moved to Trash. No server, browser context, or bound QA port remains.

Full machine-readable evidence: `results.json`, `console-policy-red/results.json`, `qa-driver.mjs`, and `screenshots/`.
