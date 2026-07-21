# Todo 11 — Configurações browser QA

Status: **PASS** for the requested `#configuracoes` interaction and responsive visual checks.

Persistent evidence artifact: `.omo/evidence/afiliados-front-plan/task-11-configuracoes-browser.md`.

## Runtime and invocation

- Application command: `npm run dev -- --host 127.0.0.1 --port 5173`.
- Vite selected `http://127.0.0.1:5177/` because ports 5173–5176 were already occupied by other workers.
- URL under test: `http://127.0.0.1:5177/#configuracoes`.
- Browser command: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/retrilhar-task11-chrome.zJ1LOK --no-first-run --no-default-browser-check about:blank`.
- Browser: Google Chrome 150.0.7871.128.
- Interaction driver: two direct Chrome DevTools Protocol scripts invoked with `node --input-type=module <<'NODE' ... NODE`:
  - desktop functional scenario at 1280×900; process exit `0`;
  - tablet/mobile responsive scenario at 768×900 and 390×844; process exit `0`.
- Every assertion read the live DOM from a fresh browser target; the JSON reports were not trusted as input.

## Desktop functional scenario

Exact steps and binary observables:

1. Open `#configuracoes` and select **Formas de recebimento**.
   - Two visible `Alterar destino` buttons: `true`.
   - Cerrado Experience: `Split de pagamento`, current `Conta principal - Itaú *****-8`.
   - Vertaco Aventuras: `Transferência bancária`, current `Conta principal - Itaú *****-8`.
   - Trilheiras de Brasília: `Dinheiro`, destination `Não se aplica`, row action count `0`.
   - Initial usage badge: `Em uso por 2 organizações`.
2. Click the first **Alterar destino**.
   - Sheet title: `Alterar destino`.
   - `Forma de recebimento`: `Split de pagamento` and DOM `disabled === true`.
   - Copy says the affiliate can alter only the destination: `true`.
   - Existing destination `Conta principal, Itaú, conta *****-8` is preselected.
3. Select **Conta da empresa** and click **Confirmar alteração**.
   - Cerrado row becomes `Conta da empresa - Nubank *****-3`.
   - Live status: `Destino de Cerrado Experience atualizado para Conta da empresa.`
   - Usage badges become exactly two instances of `Em uso por 1 organização`.
   - Cash row remains `Não se aplica` with no action.
4. Open the Vertaco sheet, select the alternate destination, and click **Cancelar**.
   - Vertaco remains `Conta principal - Itaú *****-8`.
   - Cerrado remains on `Conta da empresa`.
   - Usage remains `1` and `1`; cancel produced no mutation.
5. Open **Ações de Conta principal**.
   - `Excluir: destino em uso` exists with `aria-disabled="true"` and `data-disabled` present.
6. Select **Minhas afiliações**.
   - Copy `Afiliações da sua conta por organização` is present.
   - Exactly three visible `Ativo` labels are present.

Desktop driver result: `PASS`, exit `0`.

## Responsive and visual scenario

- Tablet 768×900:
  - two non-cash actions, cash row without action, initial usage `2`, and `documentElement.scrollWidth <= innerWidth`;
  - visual inspection: no overlap, clipping, or horizontal overflow; receiving cards and destination cards remain aligned.
- Mobile 390×844:
  - section navigation opens the receiving content;
  - two non-cash actions and cash `Não se aplica` render without horizontal overflow;
  - sheet keeps `Split de pagamento` disabled, both destination choices and both footer actions visible;
  - confirming `Conta da empresa` updates Cerrado and produces `1`/`1` usage badges;
  - visual inspection: breadcrumb wraps without clipping, cards remain readable, success message fits, and the sheet actions remain on-screen.

Responsive driver result: `PASS`, exit `0`.

## Captured image metadata

The screenshots were generated and inspected at original resolution with the local image viewer. They were intentionally transient because the caller limited the write set to the two text evidence artifacts. Their hashes and dimensions are retained here as the captured observables:

| Capture | Dimensions | SHA-256 |
| --- | ---: | --- |
| `desktop-rest.png` | 1280×900 | `91f355756dbc4b92915241a2878a22168211dd7458060fcbf31cd9c1ffc0ac42` |
| `desktop-sheet.png` | 1280×900 | `f8012a7f1a6caaec415fe27612d1397f2bba819420982b6f38b61954e118172b` |
| `desktop-updated.png` | 1280×900 | `129e9ff573e0bffa36082f82bdc98fc343f0954145c8e69c88b503b530ec4b92` |
| `desktop-affiliations.png` | 1280×900 | `6ef5f3a8d00ef951beacb1e37a24154ae1272a9c4740178b1f14e677c4351bb2` |
| `tablet-receiving.png` | 768×900 | `1dd826397255c510c277b7cfb82c0a897c4f096716103704a4dd20fd29968beb` |
| `mobile-rest.png` | 390×844 | `574b830c606e459a62d59aec189606ecc20c2ae694e7fea16aaeae30a556d7a3` |
| `mobile-sheet.png` | 390×844 | `23817e7d3a7803325bfec487bca1bc0169a39de7d3fb8ce6fbaebe221cdd2bc3` |
| `mobile-updated.png` | 390×844 | `ac81486836afef36585b007da7f195fc60236066a5fb3b473efe6ff1d5d91f8a` |

Visual verdict: **GOOD**. The requested behavior is usable and visually coherent at all three inspected widths. The tool surface exposed no subagent/reviewer API, so the visual review was performed directly in the main session rather than by the two optional reviewer passes from the visual-QA skill.

## Console classification

- Runtime exceptions: `0`.
- One React warning appears whenever the repository's shared Sheet primitive opens: `Function components cannot be given refs`, rooted at `src/components/ui/sheet.tsx` (`SheetOverlay`). The same warning is emitted by other existing affiliate sheets and by the focused test. It is outside the caller's allowed write set and did not affect interaction, focus, rendering, or assertions.

## Cleanup

- The Vite process started for this task and the Chrome process on port 9333 were stopped.
- Ports 5177 and 9333 were verified with no listener afterward.
- The dedicated Chrome profile and all `retrilhar-task11-*` screenshot/report directories were removed after their dimensions, hashes, and DOM observables were transcribed above.
- No server, browser, screenshot, or report artifact remains outside the allowed write set.
