# manualQa

Final Todo 14 matrix. No active `omo ulw-loop` plan was available; evidence is under `.omo/evidence/afiliados-front-plan/`. Every PASS below has a non-empty artifact reference.

## surfaceEvidence

| scenario id | criterion reference | surface | exact invocation | verdict | artifactRefs |
| --- | --- | --- | --- | --- | --- |
| F14-check | Todo 14 final command gate | CLI | `npm run check` | FAIL — exit 2 from pre-existing malformed `.omo/ulw-loop/evidence/G001-quality-review.json`; full output captured and classified | E1 |
| F14-affiliate-tests | Todo 14 affiliate regression gate | CLI | `npm run test -- --run src/app/App.test.tsx src/modules/afiliados` | PASS — 9 files, 39 tests | E2 |
| F14-targeted-source-gates | QA minimal-fix verification | CLI | `npm run typecheck`; targeted `npx prettier --check ...`; targeted `npx eslint --max-warnings=0 ...` | PASS — all three exit 0 | E15, E16, E17 |
| F14-route-matrix | Todo 14 six direct links at 1280x800 and 390x844 | Browser UI | Vite `127.0.0.1:51654`; CDP driver direct navigation to all six exact hashes at both viewports | PASS — 12/12; nonblank, no overflow/clipping, valid screenshots | E3, E4 |
| F14-dashboard | Todo 14 dashboard copy/detail/close | Browser UI | Direct `#afiliados`; pointer click `Copiar`, detail card, close control | PASS | E5 |
| F14-indicacoes | Todo 14 indications search/tab/detail/copy/back | Browser UI | Direct `#indicacoes`; search `João`, click `Pagas`, detail, copy, back | PASS | E6 |
| F14-ganhos | Todo 14 ganhos organization filter/detail/related link | Browser UI | Direct `#ganhos`; select `Cerrado Experience`, detail, related link | PASS | E7 |
| F14-produtos | Todo 14 products/links copy/request/unavailable | Browser UI | Direct `#produtosLinks`; copy general/org/product, request `Trilheiras de Brasília`, inspect unavailable `Cerrado Experience` | PASS | E8 |
| F14-config | Todo 14 configuration destination/cash/count | Browser UI | Direct `#configuracoes`; `Alterar destino`, choose company account, confirm, inspect counts, cash attempt | PASS | E9 |
| F14-ajuda | Todo 14 help search hit/no-result/Fechar | Browser UI | Direct `#ajuda`; known-term search, `zzzz-sem-resultado`, `Fechar` | PASS | E10 |
| F14-cleanup | Todo 14 process cleanup | Terminal/OS | Ctrl-C Vite/Chrome PTYs; `lsof -nP -iTCP:51654 -sTCP:LISTEN` and CDP port 51655; remove exact temp profiles | PASS — both ports unbound; profiles absent | E11 |

## adversarialCases

| scenario id | criterion reference | adversarial class | expected behavior | verdict | artifactRefs |
| --- | --- | --- | --- | --- | --- |
| ADV-mobile-shell | Todo 14 mobile usability | Narrow viewport clipping/overlap | Shell collapses and content/selector remain within 390px without horizontal overflow | PASS | E3, E4, E12 |
| ADV-desktop-layout | Todo 14 desktop usability | Desktop overlap/clipping | Six screens remain coherent at 1280x800 | PASS | E3, E4 |
| ADV-empty-search | Todo 14 indications/help search | Empty/no-result state | Unknown term gives an explicit empty state without crash or overflow | PASS | E6, E10 |
| ADV-filter-state | Todo 14 indications/ganhos filters | State consistency | Search/tab/filter changes update visible state and preserve usable controls | PASS | E6, E7 |
| ADV-unavailable | Todo 14 unavailable product | Disabled unavailable action | Unavailable product cannot be requested as if available; enabled request still gives feedback | PASS | E8 |
| ADV-readonly-noop | Todo 14 configuration | Read-only/no-op boundary | Receiving type stays read-only and cash action does not mutate state | PASS | E9 |
| ADV-clipboard | Todo 14 copy actions | Clipboard feedback boundary | Copy controls expose visible success feedback in browser permission context | PASS | E5, E6, E8 |
| ADV-runtime | Todo 14 browser stability | Console/runtime/network error | No uncaught runtime exception or failed network request during scenarios | PASS | E3, E4, E6-E10 |
| ADV-screenshot | Todo 14 evidence integrity | Artifact integrity | Each route screenshot is non-empty PNG with exact requested dimensions | PASS | E3, E4 |
| ADV-dirty-tree | Repository contract | Dirty worktree preservation | QA records existing dirty files and does not reset or overwrite unrelated changes | PASS | E12 |
| ADV-stale-process | Todo 14 cleanup | Stale listener/temp process | Started listeners and exact QA temp profiles are removed | PASS | E11 |
| ADV-malformed-gate | Todo 14 command gate | Pre-existing unrelated failure | Full check failure is reported verbatim/classified, not silently ignored | PASS — classification evidence; F14-check remains FAIL | E1 |
| ADV-prompt-injection | Todo 14 QA execution | Prompt injection | Not applicable: no external content or instruction-bearing page text was used to direct execution | NOT_APPLICABLE — one-line reason above | E3 |
| ADV-cancel-resume | Todo 14 QA execution | Cancel/resume state | Not applicable: all exercised product actions are synchronous local UI state, with no resumable job | NOT_APPLICABLE — one-line reason above | E5-E10 |

## artifactRefs

| id | kind | description | path |
| --- | --- | --- | --- |
| E1 | TXT command log | Full `npm run check` output and exit status 2; malformed pre-existing evidence artifact identified | `.omo/evidence/afiliados-front-plan/final-check.txt` |
| E2 | TXT command log | Affiliate/App test command; 9 files and 39 tests passed | `.omo/evidence/afiliados-front-plan/final-affiliate-tests.txt` |
| E3 | JSON browser log | Machine-readable 12-route and 6-interaction final results, zero failures | `.omo/evidence/afiliados-front-plan/final-browser/results.json` |
| E4 | PNG screenshot set | Desktop/mobile direct route screenshots under exact viewport sizes | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/` |
| E5 | PNG screenshot set | Dashboard copy/detail/close evidence | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/interaction-dashboard-copied-1280x800.png` |
| E6 | PNG/JSON interaction evidence | Indications search, Pagas, detail, copy, and back | `.omo/evidence/afiliados-front-plan/final-browser/` |
| E7 | PNG interaction evidence | Ganhos organization filter, detail, related navigation | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/interaction-ganhos-detail-1280x800.png` |
| E8 | PNG/JSON interaction evidence | Products/links copy, request feedback, unavailable disabled state | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/interaction-produtos-product-copied-1280x800.png` |
| E9 | PNG/JSON interaction evidence | Configuration destination/count/read-only/no-op state | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/interaction-configuracoes-updated-1280x800.png` |
| E10 | PNG interaction evidence | Help search hit, no-result, and close | `.omo/evidence/afiliados-front-plan/final-browser/screenshots/interaction-ajuda-no-result-390x844.png` |
| E11 | TXT cleanup receipt | PTY shutdown, both `lsof` receipts exit 1/no listener, exact temp profile removal | `.omo/evidence/afiliados-front-plan/final-cleanup.txt` |
| E12 | TXT source/worktree receipt | `git status --short --branch`, `git diff --check`, QA source refs, LOC note | `.omo/evidence/afiliados-front-plan/final-source-status.txt` |
| E13 | MD action log | Exact browser invocations, route/interaction matrix, console classification, source refs | `.omo/evidence/afiliados-front-plan/final-browser.md` |
| E14 | MD handoff | Six direct links on actual port and restart note | `.omo/evidence/afiliados-front-plan/final-handoff.md` |
| E15 | TXT command log | TypeScript typecheck after QA source edits, exit 0 | `.omo/evidence/afiliados-front-plan/final-typecheck.txt` |
| E16 | TXT command log | Targeted Prettier check for QA-touched source, exit 0 | `.omo/evidence/afiliados-front-plan/final-targeted-format.txt` |
| E17 | TXT command log | Targeted ESLint check for QA-touched source, exit 0 | `.omo/evidence/afiliados-front-plan/final-targeted-lint.txt` |

## DoneClaim

Todo 14 execution evidence is complete with one pre-existing full-check blocker: the affiliate regression gate, browser route/interactions, visual QA, cleanup, and handoff all pass. QA source edits are limited to four minimal mobile-layout fixes listed in `final-browser.md`; prior dirty-worktree files were preserved. Full-check status is explicitly not green until the malformed unrelated `.omo/ulw-loop/evidence/G001-quality-review.json` artifact is corrected outside this QA scope.
