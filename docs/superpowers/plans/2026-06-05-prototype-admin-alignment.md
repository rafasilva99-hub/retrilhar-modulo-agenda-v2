# Prototype Admin Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the agenda prototype so it remains a standalone mocked Vite prototype while matching the Retrilhar Admin frontend architecture, theme, shell, and component discipline closely enough to make a future migration low-friction.

**Architecture:** Keep Vite, hash navigation, local mocks, and no backend/auth/OpenAPI SDK. Move the prototype toward the Admin's structure: layout primitives in `src/components/layout`, custom reusable project components in `src/components/custom`, skeletons in `src/components/skeleton`, feature code in `src/modules/agenda`, and Figma exports isolated under `src/imports` as temporary legacy adapters. Replace Figma-export hardcoded visual decisions gradually with shadcn/HugeIcons/Tailwind semantic tokens.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 4, shadcn/ui v4, HugeIcons, local mock services.

---

## Non-Goals

- Do not add backend integration.
- Do not add Next.js, App Router, `next-intl`, `better-auth`, OpenAPI SDK, MSW, or real organization/session APIs.
- Do not remove hash routes yet: `#agenda`, `#agendaDia`, `#atualizacoes`, `#novaAtividade` remain the prototype navigation surface.
- Do not rewrite all Figma exports in one pass. The first goal is compatibility and boundaries, not visual churn.

## Target Structure

```text
src/
  app/
    App.tsx
  components/
    custom/
      save-button.tsx
    layout/
      app-layout.tsx
      app-page.tsx
      app-shell.tsx
      app-sidebar.tsx
      mobile/
        mobile-tab-bar.tsx
      sidebar/
        sidebar-nav-item.tsx
      topbar/
        global-search.tsx
        notification-dropdown.tsx
        topbar-organization.tsx
        topbar-profile.tsx
    skeleton/
      card.tsx
      table.tsx
    ui/
      ...
  imports/
    AgendaMes/
    AgendaAtividadesDoDia/
    AgendaAtualizacoes/
    AgendaVisaoGeral/
  mocks/
    agenda.ts
    shell.ts
  modules/
    agenda/
      adapters/
        figma-agenda-day-page.tsx
        figma-agenda-month-page.tsx
        figma-agenda-updates-page.tsx
      components/
        agenda-page-shell.tsx
        agenda-loading-state.tsx
      hooks/
        use-agenda-prototype-navigation.ts
      services/
        agenda-mock-service.ts
      types.ts
      index.ts
  styles/
    fonts.css
    globals.css
    index.css
    tailwind.css
    theme.css
```

## Phase 1: Project Rules And Tooling Baseline

**Files:**

- Modify: `CLAUDE.md`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `.claude/rules/agenda-fidelity.md`
- Create: `docs/superpowers/plans/2026-06-05-prototype-admin-alignment.md`

- [ ] **Step 1: Move the active project rules into Claude-readable rules**

Create `.claude/rules/agenda-fidelity.md` with the architecture and fidelity rules that already exist in `CLAUDE.md`, keeping the same decisions:

```markdown
# Agenda Prototype Fidelity

- This project is a standalone usability prototype.
- Do not add backend, Next.js routing, OpenAPI SDK, better-auth, or real auth/session state.
- Use local typed mocks as the source of truth.
- Preserve hash navigation while usability tests depend on it.
- Keep Figma exports under `src/imports` as legacy implementation details.
- New maintained code must live in `src/modules/*`, `src/components/layout`, `src/components/custom`, or `src/components/skeleton`.
- Use HugeIcons only.
- Prefer shadcn/ui primitives and semantic Tailwind tokens.
- Run `npm run check` before considering a refactor slice complete.
```

- [ ] **Step 2: Remove accidental production artifacts from future work**

Do not delete files in this task unless explicitly approved. Record that `dist/` exists and should not be touched by feature commits unless the team wants built artifacts committed.

- [ ] **Step 3: Verify the baseline**

Run:

```bash
npm run check
```

Expected: either PASS, or known existing failures documented before any refactor. Do not begin structural moves until the baseline is understood.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md .claude/rules/agenda-fidelity.md docs/superpowers/plans/2026-06-05-prototype-admin-alignment.md
git commit -m "[front] [ADD] prototipo — documenta alinhamento com admin"
```

## Phase 2: Bring Admin-Compatible Shell Pieces Into The Prototype

**Files:**

- Modify: `src/components/layout/app-layout.tsx`
- Modify: `src/components/layout/app-shell.tsx`
- Modify: `src/components/layout/app-sidebar.tsx`
- Modify: `src/components/layout/top-bar.tsx`
- Modify: `src/components/layout/types.ts`
- Create: `src/components/layout/mobile/mobile-tab-bar.tsx`
- Create: `src/components/skeleton/card.tsx`
- Create: `src/components/skeleton/table.tsx`
- Create: `src/components/custom/save-button.tsx`

- [ ] **Step 1: Compare Admin and prototype shell props**

Use Admin as reference:

```text
components/layout/app-layout.tsx
components/layout/app-sidebar.tsx
components/layout/top-bar.tsx
components/layout/mobile/mobile-tab-bar.tsx
```

Keep prototype-only differences explicit:

```ts
type PrototypeNavigationHandler = (page: AppPage) => void;
```

The prototype shell must still call `onNavigate("agenda")` rather than Next `<Link>`.

- [ ] **Step 2: Add prototype mobile tab bar**

Create `src/components/layout/mobile/mobile-tab-bar.tsx` using the same shape as Admin, but route through `onNavigate`.

```tsx
import { HugeiconsIcon } from "@hugeicons/react";

import type { AppPage, MenuItem } from "@/components/layout/types";
import { cn } from "@/lib/utils";

interface MobileTabBarProps {
  activePage: AppPage;
  navItems: readonly MenuItem[];
  onNavigate: (page: AppPage) => void;
}

export function MobileTabBar({ activePage, navItems, onNavigate }: MobileTabBarProps) {
  const mobileItems = navItems
    .filter((item) => item.mobile?.show && item.page)
    .sort((left, right) => (left.mobile?.order ?? 99) - (right.mobile?.order ?? 99));

  return (
    <div className="bg-background border-border grid grid-cols-4 border-t px-[0.5em] py-[0.5em]">
      {mobileItems.map((item) => {
        const isActive =
          item.page === activePage || (activePage === "agendaDia" && item.page === "agenda");
        return (
          <button
            key={item.title}
            type="button"
            className={cn(
              "text-muted-foreground flex flex-col items-center gap-[0.25em] rounded-md px-[0.5em] py-[0.5em] text-xs",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => item.page && onNavigate(item.page)}
          >
            <HugeiconsIcon icon={item.icon} size={20} />
            <span>{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Add Admin-compatible skeleton primitives**

Create `src/components/skeleton/card.tsx` and `src/components/skeleton/table.tsx` based on Admin, with `src/` aliases.

- [ ] **Step 4: Add `SaveButton` wrapper**

Create `src/components/custom/save-button.tsx` so prototype forms can follow the Admin pattern without modifying `src/components/ui/button.tsx`.

- [ ] **Step 5: Verify**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout src/components/skeleton src/components/custom
git commit -m "[front] [ADD] layout — alinha shell do prototipo ao admin"
```

## Phase 3: Theme And Token Alignment

**Files:**

- Modify: `components.json`
- Modify: `src/styles/globals.css`
- Modify: `src/styles/theme.css`
- Modify: `src/styles/index.css`
- Compare only: Admin `app/globals.css`

- [ ] **Step 1: Align `components.json` with Admin where compatible**

Keep Vite-specific paths, but match the intent:

```json
{
  "style": "radix-luma",
  "tsx": true,
  "tailwind": {
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "hugeicons",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 2: Bring Admin token comments and values into prototype theme**

Update `src/styles/theme.css` so the semantic CSS variables match Admin `app/globals.css` as closely as Vite allows.

Do not add Next localFont. Keep prototype font loading in `src/styles/fonts.css`.

- [ ] **Step 3: Preserve the dark-mode invariant**

Ensure this exact variant remains:

```css
@custom-variant dark (&:is(html.dark *));
```

- [ ] **Step 4: Audit hardcoded prototype colors**

Run:

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgb\\(|rgba\\(" src --glob "*.tsx" --glob "*.ts" --glob "*.css"
```

Expected: most matches remain inside `src/imports` legacy files. New maintained files should not introduce hardcoded colors.

- [ ] **Step 5: Verify**

Run:

```bash
npm run check
```

- [ ] **Step 6: Commit**

```bash
git add components.json src/styles
git commit -m "[front] [UP] tema — aproxima tokens do prototipo ao admin"
```

## Phase 4: Make Agenda Module The Boundary Around Figma Exports

**Files:**

- Modify: `src/app/App.tsx`
- Modify: `src/modules/agenda/index.ts`
- Modify: `src/modules/agenda/types.ts`
- Modify: `src/modules/agenda/services/agenda-mock-service.ts`
- Create: `src/modules/agenda/components/agenda-page-shell.tsx`
- Create: `src/modules/agenda/components/agenda-loading-state.tsx`

- [ ] **Step 1: Keep `App.tsx` thin**

Target responsibility:

```tsx
import { AgendaPrototype } from "@/modules/agenda";

export default function App() {
  return <AgendaPrototype />;
}
```

- [ ] **Step 2: Create `AgendaPrototype` as the feature entry**

Move current branching from `src/app/App.tsx` into `src/modules/agenda/components/agenda-prototype.tsx`.

The component still renders the same screens:

```tsx
export function AgendaPrototype() {
  const agenda = useAgendaPrototypeNavigation();

  if (agenda.currentPage === "novaAtividade") {
    return <AgendaNovaAtividade onBack={agenda.handleBackToAgenda} />;
  }

  if (agenda.currentPage === "atualizacoes") {
    return (
      <AgendaUpdatesPage
        initialTab={agenda.atualizacoesInitialTab}
        onBackToActivities={agenda.handleBackToActivities}
        activityId={agenda.selectedActivityId}
      />
    );
  }

  return <AgendaPageShell agenda={agenda} />;
}
```

- [ ] **Step 3: Add loading primitives but keep mocks synchronous for now**

Create `AgendaLoadingState` using `SkeletonCard`/`SkeletonTable`, even if it is not heavily used yet. This gives future prototype screens the same loading vocabulary as Admin.

- [ ] **Step 4: Verify behavior**

Run:

```bash
npm run typecheck
npm run build
```

Then manually check:

```text
http://127.0.0.1:5174/#agenda
http://127.0.0.1:5174/#agendaDia
http://127.0.0.1:5174/#atualizacoes
```

Expected: same visible behavior as before.

- [ ] **Step 5: Commit**

```bash
git add src/app/App.tsx src/modules/agenda
git commit -m "[front] [UP] agenda — centraliza entrada do modulo"
```

## Phase 5: Extract Maintained Components From Figma Imports Gradually

**Files:**

- Modify gradually: `src/imports/AgendaMes/AgendaMes-13-9535.tsx`
- Modify gradually: `src/imports/AgendaAtividadesDoDia/AgendaAtividadesDoDia.tsx`
- Modify gradually: `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`
- Create gradually: `src/modules/agenda/components/*`
- Create gradually: `src/modules/agenda/utils/*`

- [ ] **Step 1: Choose one visible component per slice**

Recommended order:

```text
1. Status badges and participant count badges
2. Metric cards
3. Calendar/day header
4. Activity cards
5. Day empty state
6. Updates tabs
7. Participant list rows
8. Team/insurance tooltip controls
```

- [ ] **Step 2: Extract without changing behavior**

For each extracted component:

```text
Given the current screen renders from a Figma import
When one repeated UI unit is moved into `src/modules/agenda/components`
Then the screen remains visually and behaviorally equivalent
```

- [ ] **Step 3: Replace hardcoded visual semantics**

Use the meeting decision:

```text
Status badges:
- success/ok: green semantic badge
- attention: yellow/orange semantic badge
- disabled/problem: red/destructive semantic badge

Reservation type indicators:
- neutral, not badge-status colors
- do not compete visually with real status badges
```

- [ ] **Step 4: Verify each slice**

Run after each extraction:

```bash
npm run typecheck
npm run build
```

Manual QA:

```text
#agenda renders month/list screen
#agendaDia renders day operations screen
#atualizacoes renders updates/details screen
Interactions still navigate correctly
```

- [ ] **Step 5: Commit each extracted component separately**

Example:

```bash
git add src/modules/agenda/components/status-badge.tsx src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx
git commit -m "[front] [UP] agenda — extrai badges de status"
```

## Phase 6: Final Prototype Migration Readiness Audit

**Files:**

- Review: `src/imports/**`
- Review: `src/modules/agenda/**`
- Review: `src/components/layout/**`
- Review: `src/styles/**`

- [ ] **Step 1: Run structural audit**

```bash
find src/modules/agenda -type f | sort
rg -n "lucide-react|@mui|style=\\{\\{|#[0-9a-fA-F]{3,8}|rgb\\(|rgba\\(" src/modules src/components
```

Expected:

```text
No lucide-react in maintained code
No MUI in maintained code
No inline style except unavoidable dynamic CSS variables in layout bridge
Hardcoded colors mostly confined to `src/imports`
```

- [ ] **Step 2: Run full verification**

```bash
npm run check
```

- [ ] **Step 3: Manual QA through prototype surface**

```text
Open #agenda
Click a day to reach #agendaDia
Open activity details/check-in path to reach #atualizacoes
Go back to agenda/day
Open #novaAtividade if still in scope
Check desktop and mobile width
```

- [ ] **Step 4: Commit final audit cleanups**

```bash
git add src
git commit -m "[front] [UP] prototipo — remove divergencias de padrao do admin"
```

## Execution Notes

- Refactor from stable boundaries inward. Do not start by editing 3000-line Figma import files.
- Keep every commit behavior-preserving unless the commit explicitly changes UI semantics.
- The safest first implementation is shell/theme/skeleton/custom components, because it improves migration readiness without touching the core usability-test flow.
- Figma-import files above 250 LOC are accepted as legacy only. New maintained files should stay focused and small.
- The server should remain Vite. The prototype URL remains `http://127.0.0.1:<port>/#agenda`.

## Recommended First Work Session

Start with Phases 1 and 2 only:

```text
1. Save Claude/project rules.
2. Add Admin-compatible skeleton and custom component folders.
3. Align AppShell/AppLayout enough to include mobile tab bar and Admin-like shell semantics.
4. Verify `#agenda`, `#agendaDia`, `#atualizacoes`.
```

This gives immediate migration value without risking the tested agenda screens.
