# Todo 8 follow-up: agenda mobile content clipping

Verdict: PASS.

This follow-up fixes the residual mobile visual issues left after `task-8-fix-mobile-shell.md`. The shared shell was already hidden on mobile; the remaining defects were inside the Figma-exported agenda screens:

- `#agenda`: KPI cards no longer overlap the calendar in the first mobile viewport.
- `#agendaDia`: activity-card metadata and status/attention chips no longer cut off at the right edge.
- `#doesNotExist`: still resolves to `#agenda` and inherits the corrected mobile layout.

## Files changed for this follow-up

- `src/styles/theme.css`

The CSS is scoped to `@media (max-width: 767px)` and `.prototype-shell-surface [data-name^="AGENDA"]`, preserving desktop layout and non-agenda modules.

## Validation

```text
npx prettier --check src/styles/theme.css
# exit 0

npm run test -- --run src/modules/agenda
# exit 0; 7 files passed, 30 tests passed

npm run typecheck
# exit 0

npm run build
# exit 0; Vite build completed, existing large chunk warning only

git diff --check
# exit 0

git diff --name-only -- src/modules/afiliados src/mocks/afiliados src/app/App.test.tsx
# empty output
```

## Browser QA

Vite was started from the agenda worktree on `http://127.0.0.1:5197/`.

Final accepted screenshots:

- `.omo/evidence/agenda-front-plan/task-8-fix-agenda-mobile-content/mobile-agenda-final4.png`
- `.omo/evidence/agenda-front-plan/task-8-fix-agenda-mobile-content/mobile-agendaDia-final4.png`
- `.omo/evidence/agenda-front-plan/task-8-fix-agenda-mobile-content/mobile-doesNotExist-final4.png`

Supplemental screenshots captured before the final CSS pass are retained in the same evidence directory for comparison.

Browser metrics for the accepted mobile routes were previously captured in `metrics.txt`: each route reported `innerWidth: 390`, `bodyScrollWidth: 390`, `documentScrollWidth: 390`, and no active browser sessions remained after capture.

Manual visual inspection of `final4` screenshots:

- `mobile-agenda-final4.png`: no fixed desktop sidebar, no right-edge cut-off KPI cards, no calendar overlap with the KPI grid.
- `mobile-agendaDia-final4.png`: top actions and search do not overlap; activity-card metadata stacks; status and medical-attention chips stay inside the card.
- `mobile-doesNotExist-final4.png`: fallback renders corrected `#agenda`.

## Cleanup

```text
Vite session on port 5197
# stopped with Ctrl-C

lsof -nP -iTCP:5197 -sTCP:LISTEN
# no listener

npm exec --yes agent-browser -- session list
# No active sessions
```

Temporary worker artifacts `.debug-journal.md` and `test-results/` were removed with targeted `find ... -delete` commands. No affiliate source, affiliate mocks, or `src/app/App.test.tsx` changes were introduced.
