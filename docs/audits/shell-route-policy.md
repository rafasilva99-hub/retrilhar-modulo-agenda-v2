# Shell Route Policy

## Routes inside AppShell

- `#agenda` renders the month agenda inside `AppShell`.
- `#agendaDia` renders the day operation view inside `AppShell`.

These routes participate in the prototype shell navigation because they represent regular operational pages.

## Routes outside AppShell

- `#atualizacoes` renders the activity detail/update surface outside `AppShell`.
- `#novaAtividade` renders the new activity flow outside `AppShell`.

These exceptions are intentional for the current prototype fidelity: both screens are imported from the agenda module as focused work surfaces and keep their own local navigation affordances.

## Fallback

- Unknown hashes normalize to `#agenda`.
- The fallback must continue to render nonblank agenda content in browser QA.

## Ownership

- `src/app/App.tsx` only mounts `AgendaPrototypeApp`.
- `src/modules/agenda` owns agenda route orchestration for this prototype.
- `src/components/layout/types.ts` owns Shell contracts; `src/mocks/shell.ts` owns mock data only.
