# G005 C003 Browser QA

Vite server: `http://127.0.0.1:5174/`
Tool: Playwright MCP browser.

Desktop viewport: 1366x768.
Mobile viewport: 375x812.

Routes covered:
- `#agenda`
- `#agendaDia`
- `#atualizacoes`
- `#novaAtividade`
- `#doesNotExist` fallback to `#agenda`

Pass criteria:
- Every supported route rendered nonblank text.
- Unknown hash normalized to `#agenda`.
- `scrollWidth <= clientWidth` for every route/viewport after responsive fix.
- Resource failures count was 0 after adding the favicon link.

Structured route evidence: `.omo/ulw-loop/evidence/G005-browser-routes.json`.
