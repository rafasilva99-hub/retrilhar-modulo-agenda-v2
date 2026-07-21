# Todo 9 — browser evidence for `#ganhos`

Date: 2026-07-20

## Environment and invocation

- Started the local Vite app with `npm run dev -- --host 127.0.0.1`. Ports 5173–5175 were already occupied by other workers, so Vite served this attempt at `http://127.0.0.1:5176/`.
- Invocation: `curl -sS -o /tmp/retrilhar-ganhos-vite.html -w 'http_status=%{http_code}\n' 'http://127.0.0.1:5176/#ganhos'`; binary result: HTTP 200.
- Opened the same URL in the installed Chrome binary with headless CDP enabled:
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --disable-gpu --no-first-run --no-default-browser-check --remote-debugging-port=9222 '--remote-allow-origins=*' --user-data-dir=/tmp/retrilhar-ganhos-cdp --window-size=1280,900 'http://127.0.0.1:5176/#ganhos'`.
- Used a Node 25 CDP `Runtime.evaluate` probe over the target page, which is the available browser-control path in this workspace (no Playwright, agent-browser, or browser MCP tool was installed/exposed).

## Scenarios and binary observables

1. Initial route: URL was `http://127.0.0.1:5176/#ganhos`; the DOM contained `Ganhos`, `Extrato de comissões`, and `Comissão por organização`, with 12 commission-detail buttons.
2. Organization filter: clicked the `Organização` combobox, selected `Vertaco Aventuras`, and waited for the state update. The combobox text became `Vertaco Aventuras`; the ledger narrowed to four buttons for Maria Eduarda Santos Pereira, Amanda Cristina Miranda Souza, Ricardo Augusto Alves Monteiro, and Thiago Rezende Souza. João Pedro da Silva Oliveira was absent.
3. Detail drawer: clicked the first visible `Abrir detalhe da comissão...` button. The drawer contained `Detalhe da comissão` and `Ver indicação relacionada`. Clicking that link changed the URL hash to `#indicacoes`, and the destination DOM contained `Indicações originadas`.
4. Absent search: returned to `#ganhos`, set `#ganhos-search` to `produto-inexistente`, and dispatched real `input`/`change` events. The DOM contained `Nenhuma comissão encontrada` and the input retained the query.
5. Overflow: after clearing the search, measured `document.documentElement.scrollWidth` against `clientWidth`. At 1280px: `1280 <= 1280`, `hasOverflow=false`. At 390px: `390 <= 390`, `hasOverflow=false`.

## Visual check

Temporary screenshots were captured and inspected with the visual QA image viewer:

- `/tmp/retrilhar-ganhos-desktop.png`: PNG, 1280×813. The KPI cards, filters, organization breakdown, and ledger section aligned without horizontal overflow.
- `/tmp/retrilhar-ganhos-mobile.png`: PNG, 390×844. The document did not overflow, but the shared fixed affiliate shell leaves a narrow content column at this viewport; this is a layout follow-up outside the allowed GanhosPage-only write set.

The temporary PNGs, Vite HTML, Chrome profile, and both local processes were cleaned after inspection. Final cleanup verification reported no listeners on ports 5176 or 9222.
