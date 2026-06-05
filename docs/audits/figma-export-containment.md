# Figma Export Containment

This prototype still renders the approved agenda screens through legacy Figma exports. Maintained agenda code must not import those files directly; the owned boundary is `src/modules/agenda/adapters`.

| Legacy export                                                 | Owning adapter                                              | Replacement path                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/imports/AgendaMes/AgendaMes-13-9535.tsx`                 | `src/modules/agenda/adapters/figma-agenda-month-page.tsx`   | Extract month/day primitives under `src/modules/agenda/components` after mock view-models are stable. |
| `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx` | `src/modules/agenda/adapters/figma-agenda-day-page.tsx`     | Extract activity-card, status, reservation-count, and day-header components incrementally.            |
| `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`       | `src/modules/agenda/adapters/figma-agenda-updates-page.tsx` | Extract participant/reservation sections and status actions after shared indicators exist.            |

## Temporary Exceptions

- `src/app/components/ContextoMissao.tsx` imports `src/imports/svg-o3cnx04bbw.ts` for an intro/context asset outside the agenda module.
- `src/app/components/IntroTeste.tsx` imports `src/imports/svg-q5jqh9fwaq.ts` for an intro asset outside the agenda module.

These exceptions are not agenda screen dependencies. Keep them documented until the intro/context flow is either retired or moved behind its own asset adapter.

## Rule

- New maintained agenda code imports from `src/modules/agenda/adapters` or `src/modules/agenda/services`, never directly from `src/imports`.
- Each extraction should remove one repeated UI responsibility from the Figma export while preserving current route behavior.
