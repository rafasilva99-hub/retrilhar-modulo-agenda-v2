# Todo 14 QA source-change handback

Date: 2026-07-20. Status: COMPLETE.

Todo 14 remains the verification owner. The four product-source corrections discovered during its browser QA are explicitly returned to the implementation todos that own those surfaces. This records ownership without changing the orchestrator-owned plan or ledger.

## Ownership return

| QA-triggered source change | Owning todo | Handback rationale | Fresh observable evidence |
| --- | ---: | --- | --- |
| `src/modules/afiliados/AfiliadosPage.tsx:747-754` mobile shell collapse | Todo 7 | Todo 7 owns the `#afiliados` dashboard and its responsive browser behavior. | `AfiliadosPage.test.tsx` passes in the focused suite; final `#afiliados` 390x844 route and dashboard copy/detail/close scenario pass. |
| `src/modules/afiliados/GanhosPage.tsx:199-206` mobile shell collapse | Todo 9 | Todo 9 owns the `#ganhos` screen and its responsive browser behavior. | `GanhosPage.test.tsx` passes; final `#ganhos` 390x844 route and organization/detail/related-link scenario pass. |
| `src/modules/afiliados/ProdutosLinksPage.tsx:241-248` mobile shell collapse | Todo 10 | Todo 10 owns the `#produtosLinks` screen and its responsive browser behavior. | `ProdutosLinksPage.test.tsx` passes; final `#produtosLinks` 390x844 route and copy/request/unavailable scenario pass. |
| `src/modules/afiliados/components/organization-filter.tsx:37-42` responsive selector sizing | Todo 6 | Todo 6 owns shared affiliate UI primitives, including the organization filter. | `affiliate-primitives.test.tsx` passes; the Ganhos and Produtos/Links route audits report no horizontal overflow, clipping, or offscreen controls at 390x844. |

## Owning-surface command evidence

Exact regression command:

```sh
npm run test -- --run src/app/App.test.tsx src/modules/afiliados
```

Exit: `0`. Observable: `9 passed` test files and `39 passed` tests. This includes `src/app/App.test.tsx`, the three owning page test files, and `src/modules/afiliados/components/affiliate-primitives.test.tsx`.

Exact maintained-source format command:

```sh
npx prettier eslint.config.js src/app/App.test.tsx src/components/layout/topbar/search-pages.ts src/components/layout/topbar/topbar-organization.tsx src/mocks/shell.ts src/mocks/afiliados/index.ts src/modules/afiliados src/modules/agenda/components/AgendaPrototypeApp.tsx --check
```

Exit: `0`. Observable: `All matched files use Prettier code style!`.

Exact maintained-source lint command:

```sh
npx eslint src/app/App.test.tsx src/components/layout/topbar/search-pages.ts src/components/layout/topbar/topbar-organization.tsx src/mocks/shell.ts src/mocks/afiliados/index.ts src/modules/afiliados src/modules/agenda/components/AgendaPrototypeApp.tsx --max-warnings=0 --report-unused-disable-directives
```

Exit: `0`. Observable: empty output, meaning zero errors and zero warnings.

Exact real-browser machine gate:

```sh
jq -e '{pass,routeChecks:(.routeChecks|length),routePass:all(.routeChecks[];.verdict=="PASS"),interactions:(.interactions|length),interactionPass:all(.interactions[];.verdict=="PASS"),failures,consoleClassification} | select(.pass==true and .routeChecks==12 and .routePass==true and .interactions==6 and .interactionPass==true and (.failures|length)==0 and .consoleClassification.pass==true)' .omo/evidence/afiliados-front-plan/final-browser/results.json
```

Exit: `0`. Observable: 12/12 direct desktop/mobile routes and 6/6 core interactions pass; zero behavior failures; console policy passes with zero unexpected error-level events, runtime exceptions, or network failures.

## Artifact links

- Command and policy evidence: `task-14-gate-fix.txt`
- Final browser narrative: `final-browser.md`
- Final machine result: `final-browser/results.json`
- Adversarial console-policy result: `final-browser/console-policy-red/results.json`
- Final screenshots: `final-browser/screenshots/`

## Residual ownership note

The three page-level mobile collapse effects duplicate a shell DOM query and synthetic click. That is maintenance debt on Todos 7, 9, and 10, not a Todo 14 verification change. This gate fix does not refactor those pre-existing QA corrections because the user requested the smallest handback/evidence repair and no shared-shell product rewrite.
