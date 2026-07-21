# Todo 8 final browser and gate evidence

## Verdict

**FAIL / incomplete safe-tranche gate.** Agenda tests, typecheck, build, and targeted agenda lint passed. Full format and lint remain non-passing on pre-existing repository files; targeted Prettier also flags two existing agenda files. Fresh browser QA passed desktop routes, mobile #atualizacoes, and mobile #novaAtividade, but exposed visible mobile clipping on #agenda, #agendaDia, and the mobile unknown-route fallback. No product code was changed in Todo 8.

The omo executable was not available (command not found), so the caller-provided .omo/evidence/agenda-front-plan/ directory was used. No browser-control MCP or independent subagent tool was exposed in this session; therefore the required visual-qa independent reviewer passes could not be dispatched and are recorded as a verification limitation, not inferred as passes.

## Command gates

| Gate | Exact invocation | Exit | Observable result |
| --- | --- | ---: | --- |
| Agenda tests | npm run test -- --run src/modules/agenda | 0 | 7 test files passed, 30 tests passed. |
| Format | npm run format:check | 2 | Prettier reports many pre-existing warnings and a syntax error in .omo/ulw-loop/evidence/G001-quality-review.json; it also reports existing project/agenda warnings. |
| Lint | npm run lint | 1 | 10 errors and 1 warning, all in pre-existing unrelated src/components/custom/time-input.tsx, src/modules/board/**, and src/modules/produtos/ProdutosPage.tsx. |
| Typecheck | npm run typecheck | 0 | tsc --noEmit completed. |
| Build | npm run build | 0 | Vite transformed 2082 modules and completed the production build; only the existing large-chunk warning was emitted. |

Targeted changed-agenda checks:

~~~text
npx eslint --no-warn-ignored src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.ts src/modules/agenda/adapters/agenda-detail-state.test.ts src/modules/agenda/agenda-route-smoke.test.tsx src/modules/agenda/components/AgendaNovaAtividade.tsx src/modules/agenda/services/agenda-new-activity-service.ts src/modules/agenda/services/agenda-new-activity-service.test.ts src/modules/agenda/services/agenda-mock-service.test.ts --max-warnings=0 --report-unused-disable-directives
# exit 0, no diagnostics

npx prettier --check src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.ts src/modules/agenda/adapters/agenda-detail-state.test.ts src/modules/agenda/agenda-route-smoke.test.tsx src/modules/agenda/components/AgendaNovaAtividade.tsx src/modules/agenda/services/agenda-new-activity-service.ts src/modules/agenda/services/agenda-new-activity-service.test.ts src/modules/agenda/services/agenda-mock-service.test.ts
# exit 1; warnings: src/modules/agenda/adapters/agenda-detail-state.ts and src/modules/agenda/components/AgendaNovaAtividade.tsx
~~~

The required guardrail scans were also run exactly:

~~~text
rg -n "fetch\\(|axios|better-auth|next/link|next/image|next-intl|OpenAPI|serviceWorker|navigator\\.serviceWorker" src --glob '!src/imports/**'
# exit 0 only because existing src/test/prototype-guardrails.test.ts contains forbidden terms as test data

rg -n "mock" src/modules/agenda src/components src/app --glob '*.{ts,tsx}'
# exit 0 with internal fixture/service/test identifiers only; no visible UI copy was observed
~~~

## Browser invocation and observations

Vite invocation:

~~~text
npm run dev -- --host 127.0.0.1 --port 5187
~~~

Browser invocation used isolated agent-browser session agenda-task8 and namespace retrilhar-agenda-task8:

~~~text
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 set viewport <width> <height>
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 errors --clear
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 open http://127.0.0.1:5187/<hash>
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 wait 700
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 get url
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 eval "JSON.stringify({hash:location.hash,innerWidth:innerWidth,innerHeight:innerHeight,bodyScrollWidth:document.body.scrollWidth,documentScrollWidth:document.documentElement.scrollWidth,bodyScrollHeight:document.body.scrollHeight,documentScrollHeight:document.documentElement.scrollHeight})"
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 screenshot
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 errors
~~~

All requested routes were visited at both 1280x800 and 390x844. Browser-reported route/hash and overflow metrics:

| Scenario | Requested hash | Viewport | Final hash | Body/document scroll width | Console/page errors | Verdict |
| --- | --- | ---: | --- | ---: | --- | --- |
| S8-01 | #agenda | 1280x800 | #agenda | 1280 / 1280 | empty | PASS |
| S8-02 | #agendaDia | 1280x800 | #agendaDia | 1280 / 1280 | empty | PASS |
| S8-03 | #atualizacoes | 1280x800 | #atualizacoes | 1280 / 1280 | empty | PASS |
| S8-04 | #novaAtividade | 1280x800 | #novaAtividade | 1280 / 1280 | empty | PASS |
| S8-05 | #doesNotExist | 1280x800 | #agenda | 1280 / 1280 | empty | PASS, fallback confirmed |
| S8-06 | #agenda | 390x844 | #agenda | 390 / 390 | empty | FAIL, screenshot visibly clips fixed desktop content/sidebar layout |
| S8-07 | #agendaDia | 390x844 | #agendaDia | 390 / 390 | empty | FAIL, screenshot visibly clips day cards/content to the right |
| S8-08 | #atualizacoes | 390x844 | #atualizacoes | 390 / 390 | empty | PASS, responsive detail surface visible within viewport |
| S8-09 | #novaAtividade | 390x844 | #novaAtividade | 390 / 390 | empty | PASS, stacked form visible within viewport |
| S8-10 | #doesNotExist | 390x844 | #agenda | 390 / 390 | empty | FAIL, fallback route is correct but inherits the visible mobile #agenda clipping |

The 390 / 390 metrics do not clear S8-06, S8-07, or S8-10: screenshots show content cut off at the right edge while the application suppresses document overflow. This is a visual viewport defect, not a browser console error.

## Cleanup receipt

~~~text
npm exec --yes agent-browser -- --session agenda-task8 --namespace retrilhar-agenda-task8 close
# exit 0: Browser closed

npm exec --yes agent-browser -- session list
# exit 0: No active sessions

Ctrl-C sent to the Vite process started by npm run dev -- --host 127.0.0.1 --port 5187
# interrupted process stopped

lsof -nP -iTCP:5187 -sTCP:LISTEN
# exit 1 with empty output: no listener
~~~

## Manual QA matrix

### surfaceEvidence

| Scenario ID | Criterion reference | Surface | Exact invocation | Verdict | Artifact refs |
| --- | --- | --- | --- | --- | --- |
| S8-01 | Todo 8 browser QA, #agenda, 1280x800 | Browser UI | agent-browser set viewport 1280 800; open http://127.0.0.1:5187/#agenda; get url; eval width metrics; screenshot | PASS | A01, A11 |
| S8-02 | Todo 8 browser QA, #agendaDia, 1280x800 | Browser UI | agent-browser set viewport 1280 800; open http://127.0.0.1:5187/#agendaDia; get url; eval width metrics; screenshot | PASS | A02, A11 |
| S8-03 | Todo 8 browser QA, #atualizacoes, 1280x800 | Browser UI | agent-browser set viewport 1280 800; open http://127.0.0.1:5187/#atualizacoes; get url; eval width metrics; screenshot | PASS | A03, A11 |
| S8-04 | Todo 8 browser QA, #novaAtividade, 1280x800 | Browser UI | agent-browser set viewport 1280 800; open http://127.0.0.1:5187/#novaAtividade; get url; eval width metrics; screenshot | PASS | A04, A11 |
| S8-05 | Todo 8 failure scenario, unknown route fallback, 1280x800 | Browser UI | agent-browser open http://127.0.0.1:5187/#doesNotExist; get url; eval hash; screenshot | PASS | A05, A11 |
| S8-06 | Todo 8 browser QA, #agenda, 390x844 | Browser UI | agent-browser set viewport 390 844; open http://127.0.0.1:5187/#agenda; eval width metrics; screenshot | FAIL | A06, A11 |
| S8-07 | Todo 8 browser QA, #agendaDia, 390x844 | Browser UI | agent-browser set viewport 390 844; open http://127.0.0.1:5187/#agendaDia; eval width metrics; screenshot | FAIL | A07, A11 |
| S8-08 | Todo 8 browser QA, #atualizacoes, 390x844 | Browser UI | agent-browser set viewport 390 844; open http://127.0.0.1:5187/#atualizacoes; eval width metrics; screenshot | PASS | A08, A11 |
| S8-09 | Todo 8 browser QA, #novaAtividade, 390x844 | Browser UI | agent-browser set viewport 390 844; open http://127.0.0.1:5187/#novaAtividade; eval width metrics; screenshot | PASS | A09, A11 |
| S8-10 | Todo 8 failure scenario, unknown route fallback, 390x844 | Browser UI | agent-browser open http://127.0.0.1:5187/#doesNotExist; get url; eval hash; screenshot | FAIL | A10, A11 |

### adversarialCases

| Scenario ID | Criterion reference | Adversarial class | Expected behavior | Verdict | Artifact refs |
| --- | --- | --- | --- | --- | --- |
| A8-01 | Unknown-route failure scenario | hash fallback | Any unknown hash must resolve to #agenda without a page error | PASS | A05, A10, A11 |
| A8-02 | Mobile route QA / Todo 6 responsive constraint | visual viewport clipping | At 390x844, all rendered content must remain visible and usable inside the viewport | FAIL | A06, A07, A10 |
| A8-03 | Browser QA runtime integrity | console/page errors | Each route load must produce no page errors after errors --clear | PASS | A11 |
| A8-04 | Safe-tranche scope guardrails | blocked-tranche leakage | No import, unapproved P-B exception, final P-C day completion, global list/CSV/audit feature may be claimed or exposed | PASS | A12, A13, A14 |
| A8-05 | Evidence hygiene | stale/invalid capture | Every PASS screenshot must be a fresh non-empty PNG at requested viewport dimensions | PASS | A01-A10, A15 |
| A8-06 | Worktree isolation | affiliate contamination | No src/modules/afiliados/**, src/mocks/afiliados/**, or src/app/App.test.tsx changes may be introduced | PASS | A16 |

### artifactRefs

| ID | Kind | Description | Path |
| --- | --- | --- | --- |
| A01 | screenshot | Fresh desktop #agenda, 1280x800 | .omo/evidence/agenda-front-plan/task-8-final-browser/desktop-agenda.png |
| A02 | screenshot | Fresh desktop #agendaDia, 1280x800 | .omo/evidence/agenda-front-plan/task-8-final-browser/desktop-agendaDia.png |
| A03 | screenshot | Fresh desktop #atualizacoes, 1280x800 | .omo/evidence/agenda-front-plan/task-8-final-browser/desktop-atualizacoes.png |
| A04 | screenshot | Fresh desktop #novaAtividade, 1280x800 | .omo/evidence/agenda-front-plan/task-8-final-browser/desktop-novaAtividade.png |
| A05 | screenshot | Fresh desktop unknown-route fallback to #agenda | .omo/evidence/agenda-front-plan/task-8-final-browser/desktop-fallback.png |
| A06 | screenshot | Fresh mobile #agenda, 390x844, visible clipping | .omo/evidence/agenda-front-plan/task-8-final-browser/mobile-agenda.png |
| A07 | screenshot | Fresh mobile #agendaDia, 390x844, visible clipping | .omo/evidence/agenda-front-plan/task-8-final-browser/mobile-agendaDia.png |
| A08 | screenshot | Fresh mobile #atualizacoes, 390x844 | .omo/evidence/agenda-front-plan/task-8-final-browser/mobile-atualizacoes.png |
| A09 | screenshot | Fresh mobile #novaAtividade, 390x844 | .omo/evidence/agenda-front-plan/task-8-final-browser/mobile-novaAtividade.png |
| A10 | screenshot | Fresh mobile unknown-route fallback to #agenda, with inherited clipping | .omo/evidence/agenda-front-plan/task-8-final-browser/mobile-fallback.png |
| A11 | log | Gate, route, metric, error, and cleanup outputs captured in this report | .omo/evidence/agenda-front-plan/task-8-final-browser.md |
| A12 | prior-evidence | Todo 7 blocked-tranche decision packet | .omo/evidence/agenda-front-plan/task-7-owner-decisions.md |
| A13 | source | Agenda spec and module guardrails read before QA | Specdrivenagenda |
| A14 | plan | Safe/blocked tranche boundaries and Todo 8 acceptance criteria | .omo/plans/agenda-front-plan.md |
| A15 | validation | PNG signature/dimension checks for all ten captures | .omo/evidence/agenda-front-plan/task-8-final-browser.md |
| A16 | log | Final worktree status and denylist audit | .omo/evidence/agenda-front-plan/task-8-final-browser.md |

## Worktree audit

Final git status --short --branch before this evidence/plan update:

~~~text
## work/agenda-front
 M src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx
 M src/mocks/agenda.ts
?? .claude/rules/agenda.md
?? .omo/boulder.json
?? .omo/drafts/
?? .omo/evidence/
?? .omo/plans/agenda-front-plan.md
?? .omo/start-work/
?? AGENTS.md
?? DESIGN.md
?? Specdrivenagenda
?? src/mocks/agenda/activity-reservations.ts
?? src/modules/agenda/adapters/agenda-detail-state.test.ts
?? src/modules/agenda/adapters/agenda-detail-state.ts
?? src/modules/agenda/agenda-route-smoke.test.tsx
~~~

Todo 8 did not edit product source, affiliate source, or src/app/App.test.tsx. Existing Todo 6 product files remain uncommitted for the orchestrator.

