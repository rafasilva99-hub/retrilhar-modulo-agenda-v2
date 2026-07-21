# F3 manual QA matrix

verdict: REJECT

Independent replay used a fresh Vite server at `http://127.0.0.1:4173` and Playwright Chromium with viewport `1280x800` (desktop) and `390x844` (mobile). The route and interaction checks passed after replaying each state in a fresh page/context. The final verdict is rejected because affiliate scenarios emitted relevant console errors/warnings.

## manualQa

### surfaceEvidence

| scenario id | criterion reference | surface | exact invocation | verdict | artifactRefs |
|---|---|---|---|---|---|
| F3-R-01 | routes / dashboard | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#afiliados)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d01 |
| F3-R-02 | routes / dashboard | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#afiliados)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m01 |
| F3-R-03 | routes / indications | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#indicacoes)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d02 |
| F3-R-04 | routes / indications | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#indicacoes)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m02 |
| F3-R-05 | routes / earnings | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#ganhos)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d03 |
| F3-R-06 | routes / earnings | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#ganhos)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m03 |
| F3-R-07 | routes / products and links | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#produtosLinks)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d04 |
| F3-R-08 | routes / products and links | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#produtosLinks)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m04 |
| F3-R-09 | routes / settings | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#configuracoes)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d05 |
| F3-R-10 | routes / settings | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#configuracoes)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m05 |
| F3-R-11 | routes / help | browser UI, desktop | `page.goto(http://127.0.0.1:4173/#ajuda)` at 1280x800; inspect body, visible bounds, screenshot | PASS | art-d06 |
| F3-R-12 | routes / help | browser UI, mobile | `page.goto(http://127.0.0.1:4173/#ajuda)` at 390x844; inspect body, visible bounds, screenshot | PASS | art-m06 |
| F3-I-01 | dashboard copy/detail/close | browser UI, desktop | fresh Chromium `#afiliados`; click `Copiar`; open João referral; assert cart items; click `Fechar aba` | PASS | art-i01, art-s01 |
| F3-I-02 | dashboard copy/detail/close | browser UI, mobile | same invocation at 390x844 | PASS | art-i02, art-s02 |
| F3-I-03 | indications search/tab/detail/copy/back | browser UI, desktop | fresh page/context `#indicacoes`; search `Juliana`; select `Pagas`; copy; new page for detail; close; back | PASS | art-i03, art-s03 |
| F3-I-04 | indications search/tab/detail/copy/back | browser UI, mobile | same invocation at 390x844 | PASS | art-i04, art-s04 |
| F3-I-05 | earnings organization filter/detail/related link | browser UI, desktop | fresh page/context `#ganhos`; select `Vertaco Aventuras`; new page for João commission; click `Ver indicação relacionada` | PASS | art-i05, art-s05 |
| F3-I-06 | earnings organization filter/detail/related link | browser UI, mobile | same invocation at 390x844 | PASS | art-i06, art-s06 |
| F3-I-07 | products/links copy general/org/product/request/disabled | browser UI, desktop | fresh `#produtosLinks`; copy general, organization, and product; request Boia Cross Radical; verify disabled Rafting link | PASS | art-i07 |
| F3-I-08 | products/links copy general/org/product/request/disabled | browser UI, mobile | same invocation at 390x844 | PASS | art-i08 |
| F3-I-09 | settings destination/cash/count update | browser UI, desktop | fresh `#configuracoes`; open receiving; verify cash no action; change destination to company account; confirm counts/status | PASS | art-i09 |
| F3-I-10 | settings destination/cash/count update | browser UI, mobile | same invocation at 390x844 | PASS | art-i10 |
| F3-I-11 | help search hit/no-result/close | browser UI, desktop | fresh `#ajuda`; search `comissões`; expand hit; search `semresultadozz`; click `Fechar` | PASS | art-i11 |
| F3-I-12 | help search hit/no-result/close | browser UI, mobile | same invocation at 390x844 | PASS | art-i12 |

### adversarialCases

| scenario id | criterion reference | adversarial class | expected behavior | verdict | artifactRefs |
|---|---|---|---|---|---|
| F3-A-01 | responsive routes | narrow viewport / responsive overflow | both requested viewports render non-empty affiliate surfaces without visible horizontal overflow or incoherent clipping | PASS | art-d01, art-m01, art-d02, art-m02, art-d03, art-m03, art-d04, art-m04, art-d05, art-m05, art-d06, art-m06 |
| F3-A-02 | detail and edit sheets | animated overlay settle | sheet reaches a readable settled state; close/control remains available | PASS | art-s01, art-s02, art-s03, art-s04, art-s05, art-s06 |
| F3-A-03 | unavailable product | disabled action | `Rafting Rio das Velhas` shows `Indisponível`, is disabled, and does not write its link to clipboard | PASS | art-i07 |
| F3-A-04 | empty search states | no-result search | help search `semresultadozz` shows `Nenhum resultado encontrado`; close returns to `#afiliados` | PASS | art-i11, art-i12 |
| F3-A-05 | hash navigation | back/related-link integrity | indications back returns `#afiliados`; earnings related link returns `#indicacoes`; help close returns `#afiliados` | PASS | art-i03, art-i04, art-i05, art-i06, art-i11, art-i12 |
| F3-A-06 | console cleanliness | affiliate runtime warnings | no relevant affiliate console errors or warnings during route and sheet replay | REJECT | art-console |

### artifactRefs

| id | kind | description | path |
|---|---|---|---|
| art-d01 | screenshot | desktop `#afiliados` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-afiliados-base.png` |
| art-m01 | screenshot | mobile `#afiliados` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-afiliados-base.png` |
| art-d02 | screenshot | desktop `#indicacoes` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-indicacoes-base.png` |
| art-m02 | screenshot | mobile `#indicacoes` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-indicacoes-base.png` |
| art-d03 | screenshot | desktop `#ganhos` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-ganhos-base.png` |
| art-m03 | screenshot | mobile `#ganhos` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-ganhos-base.png` |
| art-d04 | screenshot | desktop `#produtosLinks` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-produtosLinks-base.png` |
| art-m04 | screenshot | mobile `#produtosLinks` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-produtosLinks-base.png` |
| art-d05 | screenshot | desktop `#configuracoes` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-configuracoes-base.png` |
| art-m05 | screenshot | mobile `#configuracoes` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-configuracoes-base.png` |
| art-d06 | screenshot | desktop `#ajuda` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/desktop-ajuda-base.png` |
| art-m06 | screenshot | mobile `#ajuda` base | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/mobile-ajuda-base.png` |
| art-i01 | action log + screenshots | dashboard desktop copy/detail/close | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-actions.jsonl` and `desktop-afiliados-*.png` |
| art-i02 | action log + screenshots | dashboard mobile copy/detail/close | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-actions.jsonl` and `mobile-afiliados-*.png` |
| art-i03 | action log + screenshots | indications desktop replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run6/qa-results.json` and `desktop-indicacoes-*.png` |
| art-i04 | action log + screenshots | indications mobile replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run6/qa-results.json` and `mobile-indicacoes-*.png` |
| art-i05 | action log + screenshots | earnings desktop replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run6/qa-results.json` and `desktop-ganhos-*.png` |
| art-i06 | action log + screenshots | earnings mobile replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run6/qa-results.json` and `mobile-ganhos-*.png` |
| art-i07 | action log + screenshots | products desktop replay, including disabled product | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-results.json` and `desktop-produtos-*.png` |
| art-i08 | action log + screenshots | products mobile replay, including disabled product | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-results.json` and `mobile-produtos-*.png` |
| art-i09 | action log + screenshots | settings desktop replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run5/qa-results.json` and `desktop-config-receiving-*.png` |
| art-i10 | action log + screenshots | settings mobile replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run5/qa-results.json` and `mobile-config-receiving-*.png` |
| art-i11 | action log + screenshots | help desktop replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-results.json` and `desktop-ajuda-*.png` |
| art-i12 | action log + screenshots | help mobile replay | `.omo/evidence/afiliados-front-plan/f3-real-qa/run3/qa-results.json` and `mobile-ajuda-*.png` |
| art-s01 | settled screenshots | dashboard detail, desktop | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/desktop-afiliados-detail-settled.png` |
| art-s02 | settled screenshots | dashboard detail, mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/mobile-afiliados-detail-settled.png` |
| art-s03 | settled screenshots | indications detail, desktop/mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/desktop-indicacoes-detail-settled.png` and `mobile-indicacoes-detail-settled.png` |
| art-s04 | settled screenshots | indications detail, mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/mobile-indicacoes-detail-settled.png` |
| art-s05 | settled screenshots | earnings detail, desktop/mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/desktop-ganhos-detail-settled.png` and `mobile-ganhos-detail-settled.png` |
| art-s06 | settled screenshots | settings edit sheet, desktop/mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run7-settled/desktop-config-destination-edit-settled.png` and `mobile-config-destination-edit-settled.png` |
| art-console | console log | relevant affiliate console errors captured on desktop and mobile | `.omo/evidence/afiliados-front-plan/f3-real-qa/run5/qa-results.json` |
| art-cleanup | cleanup log | server stopped; curl exit 7 and no listener on port 4173 | `.omo/evidence/afiliados-front-plan/f3-real-qa/cleanup.log` |

## Findings

1. `IndicacoesPage` replay emits a React `validateDOMNesting` console error: `BreadcrumbSeparator` renders an invalid `<li>` descendant in `src/components/ui/breadcrumb.tsx:116`. Reproduced on desktop and mobile.
2. Affiliate sheet interactions emit a React ref warning: `Function components cannot be given refs` from `SheetOverlay` in `src/components/ui/sheet.tsx:56`. Reproduced while opening affiliate detail/settings sheets on desktop and mobile.

## Cleanup result

The Vite session was stopped with Ctrl-C. A post-stop curl returned exit 7 and `lsof` found no listener on port 4173; see `art-cleanup`.

## Residual risk

No persistent visual overlap, blank route, or functional interaction failure was observed. The console warnings remain unresolved and block approval until the invalid breadcrumb nesting and sheet overlay ref handling are corrected and replayed.
