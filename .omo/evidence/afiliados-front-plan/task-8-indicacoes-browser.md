# Todo 8 browser QA: `#indicacoes`

Status: PASS for the indications screen.

## Invocation

- Dev server: Vite at `http://127.0.0.1:5175`.
- Browser: Google Chrome headless, CDP on port `9223`.
- Route: `http://127.0.0.1:5175/#indicacoes`.
- Driver: inline `node` CDP script using `Page.navigate`, `Page.reload`, `Input.dispatchKeyEvent`, `Input.dispatchMouseEvent`, `Runtime.evaluate`, and `Page.captureScreenshot`.

## Scenarios and binary observables

1. Opened the route at 1280x900. The page rendered heading `Indicações`, 15 table rows, the affiliate-link copy control, and tabs `Todas 15`, `Pagas 7`, `Não pagas 5`, and `Carrinhos abandonados 3`. No horizontal overflow was reported.
2. Entered `João` in `Pesquisar indicações`. The result reduced to one row and the counts became `Todas 1`, `Pagas 1`, `Não pagas 0`, and `Carrinhos abandonados 0`.
3. Activated `Pagas` with a real pointer event. `aria-selected` changed to `true`, one row remained, and the row showed João, `Pago`, and `Quitada`.
4. Opened the first row. The detail drawer was visible with `Itens do carrinho`, `Rapel Cachoeira`, and `Tirolesa Radical`.
5. Closed the drawer and activated `Copiar` with a real pointer event. The rendered feedback changed to `Copiado` in a secure browser context.
6. Replaced the search with `zzzz-sem-resultado`. The empty-state copy `Nenhuma indicação encontrada` was visible, rows were `0`, the heading remained present, and no crash signal was found.
7. Activated the rendered `Voltar para afiliados` button after the page was ready. The browser URL changed to `http://127.0.0.1:5175/#afiliados` (`hash: #afiliados`).
8. Reloaded the default route at 768x900 and 375x812. Both rendered the page, link-copy control, four tabs with the default counts, and no horizontal overflow.

## Captured artifacts

- `/tmp/retrilhar-task-8-indicacoes-final-1280.png` — 112,898 bytes.
- `/tmp/retrilhar-task-8-indicacoes-final-detail.png` — 141,930 bytes.
- `/tmp/retrilhar-task-8-indicacoes-final-empty.png` — 100,315 bytes.
- `/tmp/retrilhar-task-8-indicacoes-final-768.png` — 78,087 bytes.
- `/tmp/retrilhar-task-8-indicacoes-final-375.png` — 47,940 bytes.

The final responsive captures were made after an explicit reload so the earlier search/filter state could not carry across a same-URL navigation.

## Final gate re-run: authoritative 390x844 evidence

The earlier 375x812 capture is superseded. A real clipping defect was confirmed at 390x844 before the final fix: the fixed expanded shell sidebar left the page in a narrow strip, and mobile referral cards had an intrinsic 405px width inside a 231px column. The scoped fix was limited to `src/modules/afiliados/IndicacoesPage.tsx`:

- Collapse the existing shell sidebar on sub-768px viewports when this page mounts.
- Constrain mobile referral cards with `w-full min-w-0`.
- Use a compact `Voltar` label on narrow viewports while retaining the full accessible name and desktop label.

Exact browser invocation:

- URL: `http://127.0.0.1:5175/#indicacoes`.
- Browser surface: Google Chrome through CDP target `ws://127.0.0.1:9223/devtools/page/573F6D8679FC1DC7157C1C15475C3D20`.
- Viewport: exactly `390x844` CSS pixels via `Emulation.setDeviceMetricsOverride`.
- Driver: inline Node CDP script using `Page.navigate`, `Input.dispatchMouseEvent`, `Input.insertText`, `Runtime.evaluate`, and `Page.captureScreenshot`.
- Clipboard permission was granted only for the localhost origin so the copy feedback could be observed.
- Full action log: `./task-8-indicacoes-390x844.json`.

Final scenario result: `allPass: true`.

- Open: nonblank page, `Indicações`, affiliate link card, four tabs, collapsed narrow shell, `scrollWidth === 390`, and no offscreen elements.
- Search `João`: input value `João`, one mobile referral card, counts `Todas 1`, `Pagas 1`, `Não pagas 0`, `Carrinhos abandonados 0`.
- Pagas: selected state became `Pagas 1` and one card remained.
- Detail: drawer showed `Itens do carrinho`, `Rapel Cachoeira`, and `Tirolesa Radical`; horizontal overflow was false.
- Copy: visible feedback became `Copiado`.
- Empty query: exact input value `zzzz-sem-resultado`, empty-state copy visible, zero cards, no horizontal overflow.
- Back: URL changed to `http://127.0.0.1:5175/#afiliados`.

Fresh screenshots, all verified as non-empty PNGs with dimensions exactly 390x844:

- `./task-8-indicacoes-390x844.png` — default state.
- `./task-8-indicacoes-390x844-table.png` — filters and mobile referral cards.
- `./task-8-indicacoes-390x844-detail.png` — detail drawer.
- `./task-8-indicacoes-390x844-empty.png` — copied-link and empty state.

Status: COMPLETE. The standalone matrix is [afiliados-front-plan-manual-qa.md](./afiliados-front-plan-manual-qa.md). Cleanup receipt is [task-8-indicacoes-cleanup.txt](./task-8-indicacoes-cleanup.txt).
