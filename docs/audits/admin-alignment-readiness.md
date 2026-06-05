# Admin Alignment Readiness

## Status

The agenda prototype is more Admin-compatible, but it is not migrated into Retrilhar Admin. The writable project remains a Vite/React mock-only prototype using hash routes.

## Admin-compatible

- `components.json` now mirrors the important Admin shadcn preset choices that are safe for Vite: `radix-luma`, HugeIcons, inverted translucent menu, subtle accent, and `rsc: false`.
- Shell contracts are separated from mock data in `src/components/layout/types.ts`.
- `src/app/App.tsx` delegates agenda rendering to `src/modules/agenda/components/AgendaPrototypeApp.tsx`.
- Agenda view-model helpers live in `src/modules/agenda/services/agenda-mock-service.ts`, keeping mock-only data out of page orchestration.
- Maintained agenda pieces now exist under `src/modules/agenda/components/**`: status indicators, reservation type indicators, new activity sections, and route primitives.
- Custom/skeleton primitives exist under `src/components/custom/**` and `src/components/skeleton/**`, matching the Admin pattern of named reusable primitives outside generated shadcn files.

## legacy/Figma-contained

- `src/imports/AgendaMes/AgendaMes-13-9535.tsx`
- `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`
- `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`

These legacy exports are contained behind `src/modules/agenda/adapters/**`. New maintained agenda code should not import `src/imports/**` directly.

## Ready to port

- Shell/page type contracts from `src/components/layout/types.ts`.
- Admin-compatible `components.json` decisions, excluding any Vite-only values that do not apply to Next.
- Agenda service/view-model shapes as a frontend contract for later integration.
- Maintained agenda components under `src/modules/agenda/components/status/**`, `new-activity/**`, and `primitives/**`.
- Documentation in `docs/audits/**` that explains what is aligned, quarantined, and intentionally prototype-only.

## Must not migrate

- Mock-only data under `src/mocks/**` as production data source.
- Hash-route bootstrap behavior as an Admin routing strategy.
- Vite-only app entrypoints and dev-server assumptions.
- Figma-generated `src/imports/**` files as long-term Admin source.
- Evidence files under `.omo/**`.
- Any fake backend/API/auth/OpenAPI/fetch behavior; backend delivery is explicitly out of scope.

## Migration approach for Retrilhar Admin

1. Copy only maintained contracts/components, not the prototype shell wholesale.
2. Recreate route wiring inside the existing Admin Shell/App Router patterns.
3. Replace mock services with Admin data boundaries when backend/API contracts exist.
4. Port agenda components incrementally, starting with status/reservation indicators and new activity sections.
5. Keep the Figma adapters as reference only until equivalent Admin-native screens are implemented.

## Remaining risks

- The month/day/update pages still render mostly through legacy/Figma-contained exports.
- The prototype has no backend contract, permissions model, real loading states, or production error handling.
- Generated `src/components/ui/**` still keeps `lucide-react` and `next-themes` as documented exceptions.
- The Admin repository currently has unrelated existing changes; this work used it as read-only reference only.

## Evidence

- Config/theme parity: `.omo/ulw-loop/evidence/G001-C001-green.txt`
- Shell route policy: `.omo/ulw-loop/evidence/G002-C002-green.txt`
- Figma containment: `.omo/ulw-loop/evidence/G003-C002-green.txt`
- Component extraction: `.omo/ulw-loop/evidence/G004-C001-green.txt`, `.omo/ulw-loop/evidence/G004-C002-green.txt`
- Dependency quarantine: `.omo/ulw-loop/evidence/G005-C001-verification.txt`
- Final route QA: `.omo/ulw-loop/evidence/G005-C003-browser.md`
