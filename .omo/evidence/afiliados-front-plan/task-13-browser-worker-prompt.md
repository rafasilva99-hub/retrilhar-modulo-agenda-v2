# Todo 13 live browser QA worker

You own verification artifacts only. Do not edit product code, tests, fixtures, services, types, configuration, dependency manifests, plans, Boulder state, or managed UI files. If you discover a defect, capture it precisely, clean up, and return `NEEDS-FIX`; do not patch it. Existing dirty work belongs to other workers and must be preserved.

Read `CLAUDE.md`, `AGENTS.md`, `.claude/rules/agenda-fidelity.md`, `.claude/rules/afiliados.md`, `DESIGN.md`, Todo 13 in `.omo/plans/afiliados-front-plan.md`, and the full visual-QA skill at `/Users/rafaelsilva/.codex/plugins/cache/sisyphuslabs/omo/4.19.0/skills/visual-qa/SKILL.md` before starting.

Browser route: use the installed `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` in headless-new mode through Chrome DevTools Protocol. Do not install packages or use the network. Node in this workspace has a built-in WebSocket; create any reusable QA driver only under `.omo/evidence/afiliados-front-plan/task-13-browser/`. Start a dedicated Vite process on a verified free `127.0.0.1` port with `--strictPort`, and a dedicated Chrome CDP process on a verified free port with a `mktemp -d` profile. Record exact commands and actual ports. Capture process IDs and use cleanup guards so cleanup happens on pass or failure.

Artifacts you may create:

- `.omo/evidence/afiliados-front-plan/task-13-integration-browser.md` (authoritative report)
- `.omo/evidence/afiliados-front-plan/task-13-browser/**` (driver, raw JSON/action/console log, Vite/Chrome logs, and PNG screenshots)

Before QA, capture `git status --short` and SHA-256 hashes of these task files: `src/app/App.test.tsx`, `src/mocks/shell.ts`, `src/components/layout/topbar/search-pages.ts`, `src/components/layout/topbar/topbar-organization.tsx`, `src/modules/afiliados/AfiliadosPage.tsx`, `src/modules/afiliados/IndicacoesPage.tsx`, `src/modules/afiliados/GanhosPage.tsx`, `src/modules/afiliados/ProdutosLinksPage.tsx`, `src/modules/afiliados/ConfiguracoesPage.tsx`, `src/modules/afiliados/AjudaPage.tsx`. Recheck them after cleanup and fail if source/status drift is attributable to you.

Use fresh browser navigation and DOM assertions. Dispatch real mouse and keyboard events with CDP `Input.dispatchMouseEvent` and `Input.dispatchKeyEvent`; do not count direct DOM `.click()` as interaction evidence. `Runtime.evaluate` is allowed for locating elements, reading state/geometry/accessibility labels, and setting up probes. For route setup, `Page.navigate` is allowed.

Functional happy path, in this order:

1. Open `#afiliados` at 1280x900; assert route-specific heading/nonblank content.
2. Use rendered affiliate sidebar items with real pointer events to navigate to `#indicacoes`, then `#ganhos`, then `#produtosLinks`. At each step assert exact hash, expected route-specific text, and a nonblank document.
3. Return to `#afiliados` using a rendered back/home control, not direct hash mutation.
4. Open the rendered profile menu. Use its `Configurações` item to reach direct full-screen `#configuracoes`; assert `Meu Perfil`, no underlying shell header visible as an active page, then activate rendered `Fechar`/back control to return to `#afiliados`.
5. Repeat with profile `Ajuda e Suporte`; assert `Como podemos ajudar?`, then use rendered `Fechar`/back to return to `#afiliados`.
6. Open `#agenda`, use the rendered organization switcher to select `Painel de Afiliado`; assert `#afiliados`. From there use the organization switcher to select `EliasTurismo`; assert the existing agenda context hash `#agendaDia` and nonblank agenda page.
7. Open `#agenda`, use the rendered global search, enter `Afiliados`, activate the result with Enter, and assert `#afiliados` plus dashboard text.

Keyboard/accessibility checks:

- Use real Tab/Shift+Tab traversal and Enter/Space activation on representative sidebar, profile, affiliate row, and settings-section controls. Record the focused element’s role/name and computed `outline`, `box-shadow`, and background/border state proving a visible focus treatment. On an indication table row, Space must prevent page scrolling and open the detail surface; close it through the rendered close control.
- Enumerate visible buttons/links/inputs on each direct screen and report any missing accessible name. Inspect rendered long button labels at 390/768/1280 and report any text whose rendered box clips (`scrollWidth > clientWidth` without an intentional scroll container/wrap). Check global horizontal overflow.
- Confirm exact Portuguese strings with diacritics at least for `Indicações`, `Configurações`, `Afiliações`, `Comissão`, and `Organização` where the applicable screen renders them. Classify absent strings only when the screen does not contain that concept.

Route/preview/failure checks:

- Fresh-open every direct route `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`, `#configuracoes`, `#ajuda` at 390x844, 768x900, and 1280x900. Capture one PNG per route/viewport (18 images), assert exact hash, route-specific expected text, nonblank body, no global horizontal overflow, and no text-clipped buttons.
- Fresh-open every preview route `#preview/afiliados`, `#preview/indicacoes`, `#preview/ganhos`, `#preview/produtosLinks`, `#preview/configuracoes`, `#preview/ajuda` at 390x844 and 1280x900. Capture one PNG per route/viewport (12 images), assert the preview hash remains exact, route-specific expected text is visible, and body is nonblank.
- Open `#doesNotExist`; assert the final hash normalizes exactly to `#agenda`, agenda content is nonblank, and capture a screenshot.
- Capture extra screenshots for the sidebar flow, both profile routes, global search, organization switching, and visible keyboard focus where useful.

Console/runtime evidence:

- Subscribe before navigation to `Runtime.exceptionThrown`, `Runtime.consoleAPICalled`, `Log.entryAdded`, and failed network loads. Report counts and full messages relevant to affiliate code. Classify Vite favicon/noise separately. Existing shared Sheet ref warnings may be reported as pre-existing only if directly observed and source-attributed; do not hide them.

Artifact integrity:

- Validate every expected PNG exists, is nonempty, has a PNG signature, and matches its requested dimensions. Record byte size and SHA-256 in the report or raw JSON.
- The raw JSON must contain every scenario with `pass: true/false`, start/final URL/hash, expected text, body-text length, viewport, overflow/clipping/label findings, focus samples, console events, and screenshot path.
- Read back the report and raw JSON before concluding.

Cleanup is mandatory:

- Stop only the dedicated Vite and Chrome processes you started.
- Verify the selected Vite and CDP ports have no listener after cleanup.
- Remove the temporary Chrome profile directory.
- Preserve all screenshots and logs under the evidence directory.
- Record cleanup commands/results and any residual process/port risk in the report.

Return a single verdict heading `PASS` or `NEEDS-FIX`, followed by exact binary observables, screenshot/log paths, cleanup receipt, source hash/status comparison, and residual risks. A blank page, missing screenshot, clipped control, unlabeled control, failed route, relevant console exception, or incomplete cleanup is `NEEDS-FIX`.
