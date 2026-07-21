# F3 final re-audit manual QA

verdict: APPROVE

The warning-fix replay used real headless Google Chrome through CDP because the browser connector and Playwright package were unavailable. Canonical evidence below is fresh from the current source after the claimed React warning fixes.

## manualQa

### surfaceEvidence

| scenario id | criterion reference | surface | exact invocation | verdict | artifactRefs |
|---|---|---|---|---|---|
| F3-R-01-D | routes / dashboard | browser UI, desktop 1280x800 | CDP `Emulation.setDeviceMetricsOverride(1280,800)`; `Page.navigate(http://127.0.0.1:4173/#afiliados)`; assert non-empty content, no overflow, screenshot dimensions | PASS | art-r01d, art-route-results |
| F3-R-01-M | routes / dashboard | browser UI, mobile 390x844 | CDP `Emulation.setDeviceMetricsOverride(390,844)`; `Page.navigate(http://127.0.0.1:4173/#afiliados)`; assert non-empty content, no overflow, screenshot dimensions | PASS | art-r01m, art-route-results |
| F3-R-02-D | routes / indications | browser UI, desktop 1280x800 | CDP `Page.navigate(http://127.0.0.1:4173/#indicacoes)`; assert `Indicações`, no overflow, screenshot dimensions | PASS | art-r02d, art-route-results |
| F3-R-02-M | routes / indications | browser UI, mobile 390x844 | CDP `Page.navigate(http://127.0.0.1:4173/#indicacoes)`; assert `Indicações`, no overflow, screenshot dimensions | PASS | art-r02m, art-route-results |
| F3-R-03-D | routes / earnings | browser UI, desktop 1280x800 | CDP `Page.navigate(http://127.0.0.1:4173/#ganhos)`; assert `Ganhos`, no overflow, screenshot dimensions | PASS | art-r03d, art-route-results |
| F3-R-03-M | routes / earnings | browser UI, mobile 390x844 | CDP `Page.navigate(http://127.0.0.1:4173/#ganhos)`; assert `Ganhos`, no overflow, screenshot dimensions | PASS | art-r03m, art-route-results |
| F3-R-04-D | routes / products and links | browser UI, desktop 1280x800 | CDP `Page.navigate(http://127.0.0.1:4173/#produtosLinks)`; assert `Produtos e Links`, no overflow, screenshot dimensions | PASS | art-r04d, art-route-results |
| F3-R-04-M | routes / products and links | browser UI, mobile 390x844 | CDP `Page.navigate(http://127.0.0.1:4173/#produtosLinks)`; assert `Produtos e Links`, no overflow, screenshot dimensions | PASS | art-r04m, art-route-results |
| F3-R-05-D | routes / settings | browser UI, desktop 1280x800 | CDP `Page.navigate(http://127.0.0.1:4173/#configuracoes)`; assert `Meu Perfil`, no overflow, screenshot dimensions | PASS | art-r05d, art-route-results |
| F3-R-05-M | routes / settings | browser UI, mobile 390x844 | CDP `Page.navigate(http://127.0.0.1:4173/#configuracoes)`; assert `Configurações`, no overflow, screenshot dimensions | PASS | art-r05m, art-route-results |
| F3-R-06-D | routes / help | browser UI, desktop 1280x800 | CDP `Page.navigate(http://127.0.0.1:4173/#ajuda)`; assert `Como podemos ajudar?`, no overflow, screenshot dimensions | PASS | art-r06d, art-route-results |
| F3-R-06-M | routes / help | browser UI, mobile 390x844 | CDP `Page.navigate(http://127.0.0.1:4173/#ajuda)`; assert `Como podemos ajudar?`, no overflow, screenshot dimensions | PASS | art-r06m, art-route-results |
| F3-I-01-D | dashboard copy/detail/close | browser UI, desktop 1280x800 | Fresh CDP page at `#afiliados`; click `Copiar`; open João detail; assert `Rapel Cachoeira` and `Tirolesa Radical`; click `Fechar aba` | PASS | art-i01d, art-desktop-results |
| F3-I-01-M | dashboard copy/detail/close | browser UI, mobile 390x844 | Fresh CDP page at `#afiliados`; click `Copiar`; open João detail; assert cart items; click `Fechar aba` | PASS | art-i01m, art-mobile-final |
| F3-I-02-D | indications search/tab/detail/back | browser UI, desktop 1280x800 | Fresh CDP page at `#indicacoes`; search `João`; select `Pagas`; open detail; close; click `Voltar para afiliados` | PASS | art-i02d, art-desktop-results |
| F3-I-02-M | indications search/tab/detail/copy/back | browser UI, mobile 390x844 | Fresh CDP page at `#indicacoes`; click `Copiar`; search `Juliana`; select `Pagas`; open Juliana row; click `Close`; click back | PASS | art-i02m, art-mobile-final |
| F3-I-03-D | earnings filter/detail/related link | browser UI, desktop 1280x800 | Fresh CDP page at `#ganhos`; select `Cerrado Experience`; open commission detail; click `Ver indicação relacionada` | PASS | art-i03d, art-desktop-results |
| F3-I-03-M | earnings filter/detail/related link | browser UI, mobile 390x844 | Fresh CDP page at `#ganhos`; select `Vertaco Aventuras`; open João commission; click related indication | PASS | art-i03m, art-mobile-final |
| F3-I-04-D | products and links copy/request/disabled | browser UI, desktop 1280x800 | Fresh CDP page at `#produtosLinks`; copy levels 1/2/3; request `Boia Cross Radical`; verify `Rafting Rio das Velhas` disabled | PASS | art-i04d, art-desktop-results |
| F3-I-04-M | products and links copy/request/disabled | browser UI, mobile 390x844 | Fresh CDP page at `#produtosLinks`; copy levels 1/2/3; request `Boia Cross Radical`; verify disabled `Rafting Rio das Velhas` | PASS | art-i04m, art-mobile-final |
| F3-I-05-D | settings destination/cash/count update | browser UI, desktop 1280x800 | Fresh CDP page at `#configuracoes`; open `Formas de recebimento`; verify cash no action; change destination; confirm | PASS | art-i05d, art-desktop-results |
| F3-I-05-M | settings destination/cash/count update | browser UI, mobile 390x844 | Fresh CDP page at `#configuracoes`; open `Formas de recebimento`; verify cash no action; change destination; confirm | PASS | art-i05m, art-mobile-final |
| F3-I-06-D | help search hit/no-result/close | browser UI, desktop 1280x800 | Fresh CDP page at `#ajuda`; search `comissões`; expand hit; search `semresultadozz`; click `Fechar` | PASS | art-i06d, art-desktop-results |
| F3-I-06-M | help search hit/no-result/close | browser UI, mobile 390x844 | Fresh CDP page at `#ajuda`; search `comissões`; expand hit; search `semresultadozz`; click `Fechar` | PASS | art-i06m, art-mobile-final |

### adversarialCases

| scenario id | criterion reference | adversarial class | expected behavior | verdict | artifactRefs |
|---|---|---|---|---|---|
| F3-A-01 | responsive routes | narrow viewport / responsive overflow | All six routes render at 390x844 and 1280x800 without global horizontal overflow, off-screen controls, or clipped controls | PASS | art-route-results, art-r01d, art-r01m, art-r06d, art-r06m |
| F3-A-02 | detail and edit sheets | animated overlay settle | Detail/edit sheet reaches a readable state; content and close/confirm controls remain available | PASS | art-i01d, art-i01m, art-i03d, art-i03m, art-i05m |
| F3-A-03 | products and links | unavailable action | `Rafting Rio das Velhas` shows `Indisponível`, is disabled, and does not copy a link | PASS | art-i04d, art-i04m |
| F3-A-04 | help | empty search state | `semresultadozz` shows `Nenhum resultado encontrado`; closing returns to `#afiliados` | PASS | art-i06d, art-i06m |
| F3-A-05 | hash navigation | back/related-link integrity | Indications back and help close return to `#afiliados`; earnings related link returns to `#indicacoes` | PASS | art-i02d, art-i02m, art-i03d, art-i03m, art-i06d, art-i06m |
| F3-A-06 | React warning fixes | console cleanliness | No relevant React warnings/errors, page exceptions, or network failures during all route and interaction replay; specifically no `validateDOMNesting`, `BreadcrumbSeparator`, function-component ref, `SheetOverlay`, or dialog-description warning | PASS | art-console-desktop, art-console-mobile |

### artifactRefs

| id | kind | description | path |
|---|---|---|---|
| art-route-results | JSON | Fresh CDP route audit: 12 route checks, dimensions, overflow, visible-control audit | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/results.json` |
| art-desktop-results | JSON | Fresh desktop action replay for dashboard, indications, earnings, products, and settings, plus route and console classification | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/results.json` |
| art-console-desktop | console log / JSON | Desktop retained runtime events: zero warnings/errors, exceptions, and network failures | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/results.json` |
| art-mobile-final | JSON | Fresh mobile action replay: six interaction scenarios, including the indication retry, with zero runtime events | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-interactions-final.json` |
| art-console-mobile | console log / JSON | Mobile retained runtime events: zero warnings/errors, exceptions, and network failures | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-interactions-final.json` |
| art-i01d | screenshot | Desktop dashboard detail sheet with cart items | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/interaction-dashboard-detail-1280x800.png` |
| art-i01m | screenshot | Mobile dashboard detail sheet with cart items | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-afiliados-detail.png` |
| art-i02d | screenshot | Desktop indications search/tab/detail states | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/interaction-indicacoes-detail-1280x800.png` |
| art-i02m | screenshot | Mobile indications detail state | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-indicacoes-detail-retry.png` |
| art-i03d | screenshot | Desktop commission detail with related indication link | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/interaction-ganhos-detail-1280x800.png` |
| art-i03m | screenshot | Mobile commission detail with related indication link | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-ganhos-detail.png` |
| art-i04d | screenshot / action log | Desktop products/links copy/request/disabled replay | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/interaction-produtos-product-copied-1280x800.png` |
| art-i04m | screenshot | Mobile products/links copy/request/disabled replay | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-produtosLinks-interaction.png` |
| art-i05d | screenshot | Desktop settings destination update replay | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/interaction-configuracoes-updated-1280x800.png` |
| art-i05m | screenshot | Mobile destination sheet with locked receiving method and selected destination | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-configuracoes-destination-sheet.png` |
| art-i06d | screenshot | Desktop help search hit/no-result replay | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/desktop-help/desktop-ajuda-no-result.png` |
| art-i06m | screenshot | Mobile help expanded FAQ replay | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/mobile-interactions-rerun/mobile-ajuda-expanded.png` |
| art-r01d | screenshot | Desktop `#afiliados`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-afiliados-1280x800.png` |
| art-r01m | screenshot | Mobile `#afiliados`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-afiliados-390x844.png` |
| art-r02d | screenshot | Desktop `#indicacoes`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-indicacoes-1280x800.png` |
| art-r02m | screenshot | Mobile `#indicacoes`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-indicacoes-390x844.png` |
| art-r03d | screenshot | Desktop `#ganhos`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-ganhos-1280x800.png` |
| art-r03m | screenshot | Mobile `#ganhos`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-ganhos-390x844.png` |
| art-r04d | screenshot | Desktop `#produtosLinks`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-produtosLinks-1280x800.png` |
| art-r04m | screenshot | Mobile `#produtosLinks`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-produtosLinks-390x844.png` |
| art-r05d | screenshot | Desktop `#configuracoes`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-configuracoes-1280x800.png` |
| art-r05m | screenshot | Mobile `#configuracoes`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-configuracoes-390x844.png` |
| art-r06d | screenshot | Desktop `#ajuda`, 1280x800 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-ajuda-1280x800.png` |
| art-r06m | screenshot | Mobile `#ajuda`, 390x844 | `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-ajuda-390x844.png` |

## Findings

None. The previously rejected `validateDOMNesting` breadcrumb warning and `SheetOverlay` ref warning were not reproduced in the fresh route or interaction replay. No relevant React console warnings/errors remained.

## Cleanup result

Vite and the isolated Chrome/CDP sessions were stopped. Post-stop `curl` and `lsof` checks passed: no listener remains on ports 4173 or 9222. Scoped git status is recorded in `cleanup.log`; only the requested QA evidence directory and matrix are untracked.

## Residual risk

QA used headless Google Chrome via CDP rather than a headed browser connector; no second browser engine was exercised. The mobile indication scenario required a corrected selector for the rendered `Close` text button; the corrected replay passed with a fresh screenshot and zero runtime events.
