# Prototype Admin Alignment Detailed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Vite agenda prototype into a high-quality, Admin-compatible frontend prototype without adding backend, Next.js, auth, OpenAPI SDK, or changing the prototype's hash-based test surface.

**Architecture:** Treat the Retrilhar Admin as the frontend quality reference, not as something to copy blindly. Keep the prototype standalone, mocked, and Vite-based; align shadcn preset/config, theme tokens, layout primitives, component boundaries, naming, linting, and module structure. Keep `src/imports/**` as legacy Figma-export code behind adapters and progressively replace repeated UI units with maintained components.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 4, shadcn/ui v4 `radix-luma`, HugeIcons, local typed mock services.

---

## Hard Constraints

- No backend in this prototype.
- No OpenAPI SDK, `better-auth`, `next-intl`, Next.js App Router, API integration, or MSW server.
- Preserve hash navigation: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade`.
- Do not make a broad visual rewrite before structural alignment is stable.
- Do not edit `src/components/ui/**` casually. Treat it as managed shadcn base. If a behavior is needed, prefer wrappers in `src/components/custom/**`.
- Do not add new icon libraries. Existing `lucide-react` dependency should become unused and later removable after audit.
- Keep mocks in `src/mocks/**` and mock access behind `src/modules/*/services/**`.
- Refactor in small commits. Each commit must leave the prototype runnable.

## Source Of Truth Comparison

### Admin Config To Mirror

Admin `components.json`:

```json
{
  "style": "radix-luma",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "hugeicons",
  "rtl": false,
  "menuColor": "inverted-translucent",
  "menuAccent": "subtle",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Prototype equivalent must keep Vite-specific differences:

```json
{
  "style": "radix-luma",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "hugeicons",
  "rtl": false,
  "menuColor": "inverted-translucent",
  "menuAccent": "subtle",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Admin CSS Behaviors To Mirror

- `@import "tailwindcss";`
- `@import "tw-animate-css";`
- `@import "shadcn/tailwind.css";`
- `@custom-variant dark (&:is(html.dark *));`
- semantic variables for `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-*`, `sidebar-*`
- brand-specific token comments and values from Admin `app/globals.css`

Prototype must keep:

- `src/styles/fonts.css` instead of Next localFont.
- `#root` base sizing.
- Vite CSS entry through `src/styles/index.css`.

## Phase 0: Baseline And Safety

**Files:**
- Read only: all files listed below
- Modify only if missing: `.claude/rules/agenda-fidelity.md`

**Purpose:** Ensure every later commit can be compared against a known working baseline.

- [ ] **Step 1: Record current git state**

Run:

```bash
git status --short --branch
```

Expected known state right now:

```text
## main...origin/main
 M package-lock.json
?? docs/
```

`package-lock.json` was changed by `npm i`. Do not hide that change.

- [ ] **Step 2: Run baseline checks**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both pass before structural refactor. If either fails, stop and document the failure before editing.

- [ ] **Step 3: Manual baseline through actual prototype surface**

With Vite running:

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

Open:

```text
http://127.0.0.1:5174/#agenda
http://127.0.0.1:5174/#agendaDia
http://127.0.0.1:5174/#atualizacoes
```

Expected:

```text
Agenda monthly/list screen renders.
Agenda day screen renders.
Updates/details screen renders.
Hash navigation still works.
```

- [ ] **Step 4: Commit plan/rules only**

```bash
git add docs/superpowers/plans .claude/rules/agenda-fidelity.md
git commit -m "[front] [ADD] prototipo — planeja alinhamento detalhado ao admin"
```

## Phase 1: shadcn Preset And Config Parity

**Files:**
- Modify: `components.json`
- Modify: `src/styles/index.css`
- Modify: `src/styles/theme.css`
- Review: `default_shadcn_theme.css`
- Review: Admin `components.json`
- Review: Admin `app/globals.css`

**Purpose:** Make the prototype use the same shadcn preset contract as Admin before touching UI structure.

- [ ] **Step 1: Confirm `components.json` parity**

Check that prototype `components.json` contains:

```json
"style": "radix-luma",
"rsc": false,
"iconLibrary": "hugeicons",
"menuColor": "inverted-translucent",
"menuAccent": "subtle"
```

Expected action: no change if already present. If changed, commit only this config.

- [ ] **Step 2: Add shadcn Tailwind preset import**

Update `src/styles/index.css` to include the Admin shadcn import path in the Vite CSS entry:

```css
@import "./fonts.css";
@import "./tailwind.css";
@import "shadcn/tailwind.css";
@import "./theme.css";
@import "./globals.css";
```

If this changes visual output unexpectedly, test whether `src/styles/tailwind.css` already imports Tailwind and avoid duplicate Tailwind base imports. The goal is to include shadcn preset utilities, not duplicate global resets.

- [ ] **Step 3: Retire `default_shadcn_theme.css` from the active path**

Verify whether `default_shadcn_theme.css` is imported anywhere:

```bash
rg -n "default_shadcn_theme" .
```

Expected: no active imports. Keep the file for now if it is unused; delete only after explicit approval or a dedicated cleanup commit.

- [ ] **Step 4: Align theme tokens with Admin**

Update `src/styles/theme.css` using Admin `app/globals.css` as reference:

```css
@custom-variant dark (&:is(html.dark *));

:root {
  --font-sans: "Helvetica Neue", ui-sans-serif, system-ui, sans-serif;
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --ring: oklch(0.558 0.191 259);
}
```

Do not paste only this partial block. Use the full semantic token set from Admin, adapted to Vite font loading and `#root`.

- [ ] **Step 5: Check token regressions**

Run:

```bash
rg -n "#030213|#ececf0|#717182|\\.dark \\{" src/styles default_shadcn_theme.css
```

Expected:

```text
Old Figmake default values may remain in default_shadcn_theme.css only.
Active src/styles should use Admin-aligned tokens and html.dark.
```

- [ ] **Step 6: Verify**

Run:

```bash
npm run typecheck
npm run build
```

Manual check:

```text
#agenda still renders.
Sidebar/topbar colors still look Retrilhar, not generic Figmake black/purple.
Dropdown/select content is not forced into wrong dark mode.
```

- [ ] **Step 7: Commit**

```bash
git add components.json src/styles
git commit -m "[front] [UP] shadcn — alinha preset e tokens ao admin"
```

## Phase 2: Managed UI Component Audit

**Files:**
- Review: `src/components/ui/**`
- Review: Admin `components/ui/**`
- Create: `docs/audits/shadcn-ui-parity.md`

**Purpose:** Decide which `components/ui` files must be left alone, added, replaced, or wrapped. This phase should mostly produce an audit, not churn.

- [ ] **Step 1: Generate component file inventory**

Run:

```bash
find src/components/ui -maxdepth 1 -type f -print | sort > /tmp/proto-ui.txt
find "/Users/luana/Documents/Code Projects/UXNaut - Clientes/Retrilhar Projs/Retrilhar Admin/components/ui" -maxdepth 1 -type f -print | sed 's#.*/components/ui/#src/components/ui/#' | sort > /tmp/admin-ui.txt
comm -3 /tmp/admin-ui.txt /tmp/proto-ui.txt
```

- [ ] **Step 2: Write parity audit**

Create `docs/audits/shadcn-ui-parity.md`:

```markdown
# shadcn/ui Parity Audit

## Config

- Admin style: radix-luma
- Prototype style: radix-luma
- Admin iconLibrary: hugeicons
- Prototype iconLibrary: hugeicons

## Admin Components Missing In Prototype

- None expected after audit, or list exact filenames.

## Prototype Extra Components

- `aspect-ratio.tsx`
- `carousel.tsx`
- `chart.tsx`
- `collapsible.tsx`
- `context-menu.tsx`
- `drawer.tsx`
- `hover-card.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `participant-attribute-badge.tsx`
- `participant-count-badge.tsx`
- `resizable.tsx`
- `slider.tsx`
- `toggle.tsx`
- `toggle-group.tsx`
- `use-mobile.ts`
- `utils.ts`

## Decision

- Do not delete extra prototype components during alignment.
- Do not edit base shadcn components without explicit approval.
- Move project-specific participant badges out of `src/components/ui` in a later dedicated phase.
```

- [ ] **Step 3: Identify project-specific components incorrectly placed in `ui`**

Run:

```bash
rg -n "participant|Retrilhar|agenda|reservation|reserva" src/components/ui
```

Expected:

```text
participant-attribute-badge.tsx and participant-count-badge.tsx are project-specific.
```

Do not move them in this phase. Record the future move to `src/components/custom` or `src/modules/agenda/components`.

- [ ] **Step 4: Verify no runtime change**

Run:

```bash
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add docs/audits/shadcn-ui-parity.md
git commit -m "[front] [ADD] shadcn — documenta paridade dos componentes ui"
```

## Phase 3: Layout Shell Parity Without Next.js

**Files:**
- Modify: `src/components/layout/app-layout.tsx`
- Modify: `src/components/layout/app-shell.tsx`
- Modify: `src/components/layout/app-sidebar.tsx`
- Modify: `src/components/layout/top-bar.tsx`
- Modify: `src/components/layout/types.ts`
- Create: `src/components/layout/mobile/mobile-tab-bar.tsx`
- Compare: Admin `components/layout/**`

**Purpose:** Make the prototype shell feel structurally like Admin while keeping prototype navigation and mock organization/profile.

- [ ] **Step 1: Define prototype-only navigation contract**

Update `src/components/layout/types.ts` to keep explicit hash-page navigation:

```ts
export type AppPage = "intro" | "contexto" | "agenda" | "agendaDia" | "atualizacoes" | "novaAtividade";

export interface MenuItem {
  readonly title: string;
  readonly page?: AppPage;
  readonly icon: IconSvgElement;
  readonly badge?: number;
  readonly mobile?: {
    readonly show: boolean;
    readonly order: number;
  };
}
```

Use the actual HugeIcons icon type already present in the file. Do not introduce `any`.

- [ ] **Step 2: Port Admin shell semantics, not Admin dependencies**

Keep out:

```text
Next Link
PWA provider
Service worker
SystemVersionBanner
real Organization type
```

Bring in:

```text
TooltipProvider wrapping shell
SidebarProvider if compatible with existing `src/components/ui/sidebar`
SidebarInset-like content semantics if already available
Mobile tab bar
Admin spacing in em units
Admin collapsed sidebar widths
```

- [ ] **Step 3: Create mobile tab bar**

Create `src/components/layout/mobile/mobile-tab-bar.tsx` using `onNavigate`, not `<Link>`.

- [ ] **Step 4: Remove layout inline style where avoidable**

Current `AppLayout` uses:

```tsx
style={{ "--shell-offset": contentOffset } as React.CSSProperties}
```

This is acceptable only because it is dynamic layout bridging for Figma imports. Keep it documented and do not introduce more inline styles.

- [ ] **Step 5: Verify shell behavior**

Manual QA:

```text
Desktop:
- sidebar visible
- collapse/expand works
- topbar stays aligned
- Figma-export duplicate sidebar/topbar remains hidden

Mobile:
- mobile tab bar visible
- agenda tab can navigate to #agenda
- no content hidden behind mobile nav
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/layout
git commit -m "[front] [UP] shell — aproxima navegacao do prototipo ao admin"
```

## Phase 4: Shared Custom Components And Skeletons

**Files:**
- Create: `src/components/custom/save-button.tsx`
- Create: `src/components/skeleton/card.tsx`
- Create: `src/components/skeleton/table.tsx`
- Create: `src/components/custom/status-badge.tsx`
- Move later: project-specific `src/components/ui/participant-*.tsx`

**Purpose:** Build the same reuse vocabulary as Admin before extracting UI from Figma exports.

- [ ] **Step 1: Add `SaveButton` wrapper**

```tsx
import { Loading01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

interface SaveButtonProps extends ComponentProps<typeof Button> {
  readonly loading?: boolean;
}

export function SaveButton({ children = "Salvar", disabled, loading = false, ...props }: SaveButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" />}
      {children}
    </Button>
  );
}
```

- [ ] **Step 2: Add skeleton primitives from Admin**

Create:

```text
src/components/skeleton/card.tsx
src/components/skeleton/table.tsx
```

Use `Skeleton` from `src/components/ui/skeleton` and `cn` from `@/lib/utils`.

- [ ] **Step 3: Create status badge vocabulary**

Create `src/components/custom/status-badge.tsx` with prototype-safe semantic variants:

```ts
export type StatusTone = "success" | "attention" | "danger" | "neutral" | "info";
```

Meeting decision:

```text
Success/ok: pago, segurado, autorizado.
Attention: needs review, pending, warning.
Danger: disabled, unavailable, blocked, canceled.
Neutral: reservation type indicators such as individual/group; must not compete with status badges.
```

- [ ] **Step 4: Verify no Figma screen changes yet**

These components may be unused immediately. That is acceptable in this phase if they are the foundation for later extractions.

Run:

```bash
npm run typecheck
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/custom src/components/skeleton
git commit -m "[front] [ADD] componentes — adiciona wrappers e skeletons do padrao admin"
```

## Phase 5: Module Boundary Cleanup

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/modules/agenda/index.ts`
- Create: `src/modules/agenda/components/agenda-prototype.tsx`
- Create: `src/modules/agenda/components/agenda-page-shell.tsx`
- Modify: `src/modules/agenda/hooks/use-agenda-prototype-navigation.ts`

**Purpose:** Move orchestration into `src/modules/agenda` so `src/app/App.tsx` is as thin as an Admin route file.

- [ ] **Step 1: Create `AgendaPrototype`**

Move current page branching from `App.tsx` to `src/modules/agenda/components/agenda-prototype.tsx`.

- [ ] **Step 2: Make `App.tsx` thin**

Target:

```tsx
import { AgendaPrototype } from "@/modules/agenda";

export default function App() {
  return <AgendaPrototype />;
}
```

- [ ] **Step 3: Split shell wrapper**

Create `AgendaPageShell` for the shared shell around `agenda` and `agendaDia`.

- [ ] **Step 4: Keep behavior identical**

Manual QA:

```text
Direct load #agenda works.
Direct load #agendaDia works.
Direct load #atualizacoes works.
Browser back/forward keeps current hash behavior.
```

- [ ] **Step 5: Verify**

```bash
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/app/App.tsx src/modules/agenda
git commit -m "[front] [UP] agenda — move orquestracao para modulo"
```

## Phase 6: Mock Service And View Model Discipline

**Files:**
- Modify: `src/types/agenda.ts`
- Modify: `src/mocks/agenda.ts`
- Modify: `src/modules/agenda/services/agenda-mock-service.ts`
- Modify: `src/modules/agenda/types.ts`
- Create: `src/modules/agenda/services/agenda-view-model.ts`

**Purpose:** Make mock data behave like an API adapter without adding backend.

- [ ] **Step 1: Treat `src/mocks/agenda.ts` as raw data only**

No component should import `mockActivities`, `mockReservations`, or `mockGuides` directly except service files.

Audit:

```bash
rg -n "mockActivities|mockReservations|mockGuides|allHolidays" src --glob "*.tsx" --glob "*.ts"
```

Expected after phase:

```text
Only `src/modules/agenda/services/**` and `src/mocks/**` import raw mock arrays.
Legacy `src/imports/**` may still import raw mocks until each section is extracted.
```

- [ ] **Step 2: Add typed service methods**

Expose functions with names similar to real future use cases:

```ts
export function listAgendaActivities(): readonly AgendaActivitySummary[];
export function listAgendaActivitiesByDay(day: number): readonly AgendaActivitySummary[];
export function getAgendaActivityDetails(activityId: string): AgendaActivityDetails | undefined;
export function listAgendaActivityReservations(activityId: string): readonly AgendaReservationSummary[];
```

- [ ] **Step 3: Add view models**

Use module types that are UI-specific and narrower than raw mocks:

```ts
export interface AgendaActivitySummary {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly capacity: number;
  readonly occupancy: number;
  readonly status: AgendaActivityStatus;
}
```

- [ ] **Step 4: Do not wire all screens yet**

This phase establishes the service boundary. Figma exports can continue using raw mocks temporarily.

- [ ] **Step 5: Verify**

```bash
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/modules/agenda/services src/modules/agenda/types.ts
git commit -m "[front] [UP] agenda — cria view models para mocks"
```

## Phase 7: Figma Export Containment

**Files:**
- Modify: `src/modules/agenda/adapters/*.tsx`
- Modify: `src/imports/AgendaMes/AgendaMes-13-9535.tsx`
- Modify: `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`
- Modify: `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`
- Modify: `src/imports/AgendaVisaoGeral/AgendaVisaoGeral.tsx`
- Create: `docs/audits/figma-export-containment.md`

**Purpose:** Make it explicit which parts are legacy and prevent new maintained code from depending on Figma internals.

- [ ] **Step 1: Add audit document**

Create:

```markdown
# Figma Export Containment Audit

## Legacy Imports

- `src/imports/AgendaMes/AgendaMes-13-9535.tsx`
- `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`
- `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`
- `src/imports/AgendaVisaoGeral/AgendaVisaoGeral.tsx`

## Rules

- New code cannot import directly from `src/imports`.
- Only `src/modules/agenda/adapters/*` can import Figma exports.
- Each extraction should remove one repeated UI responsibility from the Figma export.
```

- [ ] **Step 2: Ensure imports are adapter-only**

Run:

```bash
rg -n "@/imports|\\.\\./\\.\\./imports|src/imports" src --glob "*.tsx" --glob "*.ts"
```

Expected:

```text
Only `src/modules/agenda/adapters/**` and existing legacy Figma import cross-imports.
```

- [ ] **Step 3: Add comments at adapter boundary**

Each adapter should state:

```ts
// Legacy Figma export adapter. Do not import this component outside `src/modules/agenda`.
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add docs/audits/figma-export-containment.md src/modules/agenda/adapters
git commit -m "[front] [ADD] agenda — documenta fronteira dos exports figma"
```

## Phase 8: Component Extraction Passes

**Files:**
- Create: `src/modules/agenda/components/status/*`
- Create: `src/modules/agenda/components/activity-card/*`
- Create: `src/modules/agenda/components/day-view/*`
- Create: `src/modules/agenda/components/updates/*`
- Modify: Figma export files only where replacing extracted units

**Purpose:** Replace legacy visual code one responsibility at a time.

### Extraction Order

1. Status and reservation-type badges.
2. Metric cards.
3. Activity cards.
4. Day header/top actions.
5. Team/insurance tooltip area.
6. Participants/reservations list rows.
7. Updates tabs.
8. Empty/loading states.

- [ ] **Step 1: Extract status badges first**

Create:

```text
src/modules/agenda/components/status/agenda-status-badge.tsx
src/modules/agenda/components/status/reservation-type-indicator.tsx
```

Rules:

```text
Status badges use semantic tones.
Reservation type indicators are neutral.
No status color is reused for "individual/group" quantity indicators.
```

- [ ] **Step 2: Replace usages in one screen only**

Start with `AgendaAtualizacoes`, because it has the most badge density and will benefit most from semantic cleanup.

- [ ] **Step 3: Verify before next extraction**

```bash
npm run typecheck
npm run build
```

Manual:

```text
#atualizacoes still renders.
Badges are visually understandable.
Reservation quantity indicators no longer look like status badges.
```

- [ ] **Step 4: Commit**

```bash
git add src/modules/agenda/components/status src/imports/AgendaAtualizacoes
git commit -m "[front] [UP] agenda — padroniza badges de atualizacoes"
```

Repeat the same micro-cycle for each extraction. Do not combine unrelated extractions.

## Phase 9: Code Quality Tightening

**Files:**
- Modify: `eslint.config.js`
- Modify: `tsconfig.json`
- Review: `package.json`

**Purpose:** Raise maintained-code quality without forcing generated Figma exports to pass every rule immediately.

- [ ] **Step 1: Keep generated ignores scoped**

Current ignore includes `src/imports/**`. Keep that until files are extracted.

- [ ] **Step 2: Add stricter maintained-code audits via scripts**

Add scripts:

```json
{
  "scripts": {
    "audit:icons": "rg -n \"lucide-react|@mui/icons-material|@mui/material\" src --glob '!src/imports/**'",
    "audit:colors": "rg -n \"#[0-9a-fA-F]{3,8}|rgb\\\\(|rgba\\\\(\" src --glob '!src/imports/**' --glob '*.{ts,tsx,css}'",
    "audit:inline-style": "rg -n \"style=\\\\{\\\\{\" src --glob '!src/imports/**' --glob '*.{tsx}'"
  }
}
```

Do not fail CI with these until current debt is understood. Use them manually first.

- [ ] **Step 3: Verify**

```bash
npm run check
npm run audit:icons
npm run audit:colors
npm run audit:inline-style
```

Expected:

```text
check passes.
audits either pass or produce documented known debt outside `src/imports`.
```

- [ ] **Step 4: Commit**

```bash
git add package.json eslint.config.js tsconfig.json
git commit -m "[front] [UP] qualidade — adiciona auditorias do padrao admin"
```

## Phase 10: Final Migration-Readiness Gate

**Files:**
- Review all changed files
- Create: `docs/audits/admin-alignment-readiness.md`

**Purpose:** Produce a concrete readiness report before saying the prototype is aligned.

- [ ] **Step 1: Full checks**

```bash
npm run check
```

- [ ] **Step 2: Manual QA**

```text
Desktop 1366px:
- #agenda
- #agendaDia
- #atualizacoes
- #novaAtividade

Mobile 375px:
- #agenda
- #agendaDia
- #atualizacoes
```

- [ ] **Step 3: Audit maintained code**

```bash
npm run audit:icons
npm run audit:colors
npm run audit:inline-style
rg -n "@/imports" src --glob "*.tsx" --glob "*.ts"
```

- [ ] **Step 4: Write readiness report**

Create `docs/audits/admin-alignment-readiness.md`:

```markdown
# Admin Alignment Readiness

## Passed

- shadcn preset config aligned.
- Theme tokens aligned with Admin.
- Shell structure aligned while preserving hash navigation.
- Mocks remain local and typed.
- Figma exports are contained behind adapters.

## Remaining Legacy

- List exact `src/imports/**` files and remaining responsibilities.

## Migration Notes

- Future Admin migration should port maintained `src/modules/agenda/components/**` and service/view-model concepts.
- Do not port `src/imports/**` directly.
```

- [ ] **Step 5: Commit**

```bash
git add docs/audits/admin-alignment-readiness.md
git commit -m "[front] [ADD] prototipo — registra prontidao para migracao"
```

## Recommended Execution Order

Execute in this exact order:

```text
0. Baseline and safety
1. shadcn preset/config parity
2. shadcn UI audit
3. shell parity
4. custom/skeleton primitives
5. module boundary cleanup
6. mock service/view models
7. Figma export containment
8. component extraction passes
9. code quality tightening
10. readiness gate
```

## Why This Order

- Preset/theme first prevents reworking extracted components later.
- Shell before component extraction makes the prototype behave like Admin at the frame level.
- Custom/skeleton primitives before extraction ensures extracted UI lands in the right vocabulary.
- Module boundary before extracting Figma internals prevents new components from depending on `src/imports`.
- Component extraction last reduces the chance of breaking the usability-test screens.
