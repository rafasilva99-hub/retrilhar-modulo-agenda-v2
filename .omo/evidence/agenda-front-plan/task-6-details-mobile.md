# Todo 6 evidence: detail exception and mobile responsiveness

Result: PASS

Scope was limited to the confirmed `atividade cancelada sem participantes` exception and responsive detail filters/list/conclusion affordances. No P-B candidate was implemented.

## Confirmed canceled/no-participants exception

Scenario: fixture `act-003` (`Bike Tour Vale Verde`) has `lifecycleStatus: "Cancelada"`, `occupancy: 0`, and an activity-scoped reservation list with zero participants.

Invocation:

```sh
npm run test -- --run src/modules/agenda/adapters/agenda-detail-state.test.ts
```

Binary observable: exit `0`; `1` test file and `2` tests passed. The focused test asserts the fixture resolves to `{ kind: "cancelled-without-participants" }` and that a canceled activity with participants remains in the normal participant state.

Captured artifact: `src/modules/agenda/adapters/agenda-detail-state.test.ts`, `src/modules/agenda/adapters/agenda-detail-state.ts`, and the live render screenshot [`task-6-cancelled-no-participants.png`](./task-6-cancelled-no-participants.png).

Live scenario: Playwright opened `http://127.0.0.1:5174/#agendaDia` at viewport `390x844`, activated the accessible link `Abrir atividade Bike Tour Vale Verde`, and observed the detail route `#atualizacoes`.

Live binary observables:

```json
{
  "route": "http://127.0.0.1:5174/#atualizacoes",
  "exceptionText": "Atividade cancelada sem participantes\n\nNão há participantes ou reservas para exibir nesta atividade.\n\nMotivo: Condições climáticas adversas — previsão de chuva forte e ventos acima de 60 km/h",
  "exceptionRect": { "left": 16, "right": 374, "width": 358 },
  "bodyScrollWidth": 390,
  "documentScrollWidth": 390
}
```

## Mobile filters/list/conclusion responsiveness

Scenario: Playwright used the installed Chrome binary `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` at viewport `390x844` against `#atualizacoes`; it checked the initial participant list and conclusion action, opened the participant filter drawer, checked the long tariff chip, then selected `A fazer check-in`.

Invocation:

```sh
npm run dev -- --host 127.0.0.1 --port 5174
node --input-type=module -
```

The stdin Playwright scenario used `chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" })`, opened `#atualizacoes` and `#agendaDia`, clicked the real filter/list affordances, and captured the screenshots listed below.

Binary observables from the captured Playwright run:

```json
{
  "viewport": { "width": 390, "height": 844 },
  "base": {
    "bodyScrollWidth": 390,
    "documentScrollWidth": 390,
    "conclusionRect": { "left": 199, "right": 374, "width": 175 },
    "participantRect": { "left": 78, "right": 346, "width": 268 }
  },
  "filterDrawer": {
    "bodyScrollWidth": 390,
    "documentScrollWidth": 390,
    "drawerRect": { "left": 24, "right": 390, "width": 366 },
    "longTariffChipRect": { "left": 70, "right": 344, "width": 274 }
  },
  "filtered": {
    "bodyScrollWidth": 390,
    "documentScrollWidth": 390,
    "selectedFilter": "A fazer check-in\n59"
  }
}
```

Captured screenshots:

- [`task-6-mobile-atualizacoes.png`](./task-6-mobile-atualizacoes.png)
- [`task-6-mobile-atualizacoes-filters.png`](./task-6-mobile-atualizacoes-filters.png)
- [`task-6-mobile-atualizacoes-filtered.png`](./task-6-mobile-atualizacoes-filtered.png)
- [`task-6-cancelled-no-participants.png`](./task-6-cancelled-no-participants.png)

## Final checks

```sh
npm run test -- --run src/modules/agenda
# exit 0 — Test Files 7 passed; Tests 30 passed

npx eslint --no-warn-ignored src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.ts src/modules/agenda/adapters/agenda-detail-state.test.ts src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx --max-warnings=0
# exit 0

npm run typecheck
# exit 0

npm run build
# exit 0 — 2082 modules transformed; Vite build completed

git diff --check -- src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx src/mocks/agenda.ts src/mocks/agenda/activity-reservations.ts src/modules/agenda/adapters/agenda-detail-state.ts src/modules/agenda/adapters/agenda-detail-state.test.ts
# exit 0
```

## Cleanup and worktree audit

The Vite server was started only for QA with `npm run dev -- --host 127.0.0.1 --port 5174`, then stopped with Ctrl-C. The final listener check was:

```sh
lsof -nP -iTCP:5174 -sTCP:LISTEN
# exit 1 — no listener
```

Final targeted `git status --short` is recorded below after evidence, plan, and ledger updates:

```text
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
```
