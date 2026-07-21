# Todo 8 mobile shell fix evidence

## Verdict

PASS for the narrowed Todo 8 follow-up: the shared desktop shell no longer occupies the 390px agenda viewport, the unknown-route fallback remains `#agenda`, and the targeted checks pass. The Todo 8 checkbox in `.omo/plans/agenda-front-plan.md` remains checked; this report records the follow-up verification without changing the plan.

`omo ulw-loop status --json` was unavailable (`omo: command not found`), so evidence is stored under `.omo/evidence/`.

Ledger event appended to `.omo/start-work/ledger.jsonl` with task `8-fix-mobile-shell` and this artifact path.

## Scope and source observables

Changed for this follow-up:

- `src/components/layout/app-layout.tsx`: keeps the existing `collapsed ? "124px" : "260px"` values under `--shell-desktop-offset`.
- `src/components/layout/app-sidebar.tsx`: shared fixed sidebar is `hidden ... md:flex`.
- `src/components/layout/top-bar.tsx`: keeps the existing `collapsed ? "112px" : "248px"` values under `--shell-desktop-offset`.
- `src/styles/theme.css`: maps the desktop variable to `--shell-offset`; at `max-width: 767px`, sets `--shell-offset: 0px` and top-bar padding to `0`.

`src/components/layout/app-page.tsx` was not changed; its existing `paddingLeft: var(--shell-offset, 248px)` therefore consumes the responsive zero offset on mobile. `src/modules/agenda/components/AgendaNovaAtividade.tsx` was restored exactly from `HEAD` after the first formatting attempt; no Todo 5 content was changed by this follow-up.

## Focused command gates

| Scenario | Exact invocation | Exit | Binary observable |
| --- | --- | ---: | --- |
| Remove formatting-only churn | `git restore --source=HEAD -- src/modules/agenda/components/AgendaNovaAtividade.tsx` | 0 | `git diff --stat` has no `AgendaNovaAtividade.tsx` entry. |
| Diff-size guard | `git diff --stat` | 0 | `77 insertions(+), 36 deletions(-)` across six existing product files; no thousands-line file churn. |
| Targeted formatting | `npx prettier --check src/components/layout/app-layout.tsx src/components/layout/app-sidebar.tsx src/components/layout/top-bar.tsx src/styles/theme.css src/modules/agenda/adapters/agenda-detail-state.ts src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.test.ts src/modules/agenda/agenda-route-smoke.test.tsx` | 0 | `All matched files use Prettier code style!` |
| Targeted lint | `npx eslint --no-warn-ignored src/components/layout/app-layout.tsx src/components/layout/app-sidebar.tsx src/components/layout/top-bar.tsx src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.ts src/modules/agenda/adapters/agenda-detail-state.test.ts src/modules/agenda/agenda-route-smoke.test.tsx --max-warnings=0 --report-unused-disable-directives` | 0 | No diagnostics. |
| Agenda route/detail tests | `npm run test -- --run src/modules/agenda/agenda-route-smoke.test.tsx src/modules/agenda/adapters/agenda-detail-state.test.ts` | 0 | `2 passed` test files, `16 passed` tests. |
| Typecheck | `npm run typecheck` | 0 | `tsc --noEmit` completed with no output. |

## Browser QA

Vite invocation: `npm run dev -- --host 127.0.0.1 --port 5193`.

Browser invocation for each route used the same isolated session and viewport:

```text
npm exec --yes agent-browser -- --session ag8final --namespace ag8final set viewport 390 844
npm exec --yes agent-browser -- --session ag8final --namespace ag8final errors --clear
npm exec --yes agent-browser -- --session ag8final --namespace ag8final open http://127.0.0.1:5193/<hash>
npm exec --yes agent-browser -- --session ag8final --namespace ag8final wait --load networkidle
npm exec --yes agent-browser -- --session ag8final --namespace ag8final eval "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))"
npm exec --yes agent-browser -- --session ag8final --namespace ag8final get url
npm exec --yes agent-browser -- --session ag8final --namespace ag8final eval "JSON.stringify({hash:location.hash,innerWidth,innerHeight,bodyScrollWidth:document.body.scrollWidth,documentScrollWidth:document.documentElement.scrollWidth,bodyScrollHeight:document.body.scrollHeight,documentScrollHeight:document.documentElement.scrollHeight,sidebar:[...document.querySelectorAll('aside')].map((e)=>({display:getComputedStyle(e).display,rect:e.getBoundingClientRect().toJSON()})),topbar:[...document.querySelectorAll('.prototype-top-bar')].map((e)=>({paddingLeft:getComputedStyle(e).paddingLeft,rect:e.getBoundingClientRect().toJSON()})),shellOffset:getComputedStyle(document.querySelector('.prototype-shell-surface')).getPropertyValue('--shell-offset'),shellDesktopOffset:getComputedStyle(document.querySelector('.prototype-shell-surface')).getPropertyValue('--shell-desktop-offset')})"
npm exec --yes agent-browser -- --session ag8final --namespace ag8final screenshot '<artifact path>'
npm exec --yes agent-browser -- --session ag8final --namespace ag8final errors
```

| Scenario | Final hash | Viewport | Body/document scroll width | Shared shell observable | Browser errors | Screenshot |
| --- | --- | ---: | --- | --- | --- | --- |
| `#agenda` | `#agenda` | `390x844` | `390 / 390` | shared `aside`: `display:none`, `shellOffset: 0px`, top-bar `paddingLeft: 0px`, top-bar rect `390px` wide | empty | [mobile-agenda](./task-8-fix-mobile-shell-mobile-agenda.png) |
| `#agendaDia` | `#agendaDia` | `390x844` | `390 / 390` | shared `aside`: `display:none`, `shellOffset: 0px`, top-bar `paddingLeft: 0px`, top-bar rect `390px` wide | empty | [mobile-agendaDia](./task-8-fix-mobile-shell-mobile-agendaDia.png) |
| `#doesNotExist` | `#agenda` | `390x844` | `390 / 390` | shared `aside`: `display:none`, `shellOffset: 0px`, top-bar `paddingLeft: 0px`, top-bar rect `390px` wide | empty | [mobile-fallback](./task-8-fix-mobile-shell-mobile-fallback.png) |

The agenda route also renders a feature-local calendar panel `aside` at `x:10`, `width:340`; the `display:none` entry is the shared `AppSidebar`. This distinguishes the intended agenda surface from the removed desktop shell.

Fresh artifact validation:

```text
.omo/evidence/agenda-front-plan/task-8-fix-mobile-shell-mobile-agenda.png:    PNG image data, 390 x 844, 8-bit/color RGB, non-interlaced
.omo/evidence/agenda-front-plan/task-8-fix-mobile-shell-mobile-agendaDia.png: PNG image data, 390 x 844, 8-bit/color RGB, non-interlaced
.omo/evidence/agenda-front-plan/task-8-fix-mobile-shell-mobile-fallback.png:  PNG image data, 390 x 844, 8-bit/color RGB, non-interlaced
```

## Scope and cleanup receipt

```text
git diff --check                         # exit 0
git diff --name-only -- src/modules/afiliados src/mocks/afiliados src/app/App.test.tsx
                                          # empty output
npm exec --yes agent-browser -- session list
                                          # No active sessions
lsof -nP -iTCP:5193 -sTCP:LISTEN         # empty output; no listener
test ! -e .debug-journal.md              # passed; temporary journal absent
red debug screenshots                     # moved to Trash; absent from evidence directory
```

No affiliate source, affiliate mocks, or `src/app/App.test.tsx` changes were introduced. The temporary `.debug-journal.md` and the three pre-fix debug screenshots were cleaned up; the three fresh screenshots above remain as task evidence.
