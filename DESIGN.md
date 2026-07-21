# Retrilhar Admin Design System

This document extracts the visual system already present in the Vite/React prototype. It is an implementation contract for the agenda and affiliate surfaces, not a redesign brief. The prototype is mock-only, hash-routed, and should keep its existing visual language. Source anchors include `CLAUDE.md:125-148`, `.claude/rules/agenda-fidelity.md:3-12`, `Specdrivenafiliados.md:28-34`, and the files cited in each section below.

## 1. Atmosphere & Identity

Retrilhar Admin feels like a calm, operational workspace: light, precise, and readable under frequent scanning. The signature is a blue semantic action color carried through compact controls, quiet white cards, a floating rounded navigation rail, and a top bar that recedes until the page scrolls. Hierarchy comes from whitespace, restrained borders, and small tonal changes rather than decorative branding. Preserve this direction-specific prototype language; do not replace it with a different product aesthetic.

The product is a mock-only Vite/React prototype with hash routes, not a connected application. Interface copy should remain precise and Portuguese, with correct diacritics and the domain term “afiliação” where applicable (`.claude/rules/agenda-fidelity.md:3-12`, `Specdrivenafiliados.md:18-34`).

Prototype data must remain an implementation detail: never surface `fake`, `mock`, or test labels as visible UI copy.

## 2. Color & Tokens

### Semantic palette

Product code uses Tailwind v4 semantic tokens from `src/styles/tailwind.css:1-5` and `src/styles/theme.css:3-45`, rather than introducing local color literals. The current light and dark runtime values are defined in `src/styles/theme.css:47-120`.

| Role                    | Token                                              | Current source value                                                  | Usage                                                           |
| ----------------------- | -------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| Page background         | `--background` / `bg-background`                   | light `oklch(1 0 0)`; dark `oklch(0.145 0 0)`                         | App canvas and shell base                                       |
| Main text               | `--foreground` / `text-foreground`                 | light `oklch(0.145 0 0)`; dark `oklch(0.985 0 0)`                     | Titles, body copy, values                                       |
| Card surface            | `--card` / `bg-card`                               | light `oklch(1 0 0)`; dark `oklch(0.205 0 0)`                         | Cards and contained panels                                      |
| Muted surface           | `--muted` / `bg-muted`                             | light `oklch(0.97 0 0)`; dark `oklch(0.269 0 0)`                      | Quiet controls, secondary regions                               |
| Secondary text          | `--muted-foreground` / `text-muted-foreground`     | light `oklch(0.556 0 0)`; dark `oklch(0.708 0 0)`                     | Descriptions, metadata, hints                                   |
| Primary action          | `--primary` / `bg-primary` and `text-primary`      | light `oklch(0.488 0.243 264.376)`; dark `oklch(0.424 0.199 265.638)` | Primary actions, links, selected states                         |
| Primary brand reference | `#1E40AF`                                          | Affiliate specification anchor (`Specdrivenafiliados.md:33`)          | Reference color only; map implementation to `--primary`         |
| Primary-on-color        | `--primary-foreground` / `text-primary-foreground` | light and dark `oklch(0.97 0.014 254.604)`                            | Text and icons on primary fills                                 |
| Border and input        | `--border`, `--input` / `border-border`            | light `oklch(0.922 0 0)`; dark `oklch(1 0 0 / 10%)`                   | Card outlines, dividers, fields                                 |
| Focus ring              | `--ring` / `ring-ring`                             | `oklch(0.558 0.191 259)`                                              | Keyboard focus and validation affordance                        |
| Destructive             | `--destructive` / `text-destructive`               | light `oklch(0.577 0.245 27.325)`; dark `oklch(0.704 0.191 22.216)`   | Destructive actions and errors                                  |
| Status fills            | semantic status classes                            | existing emerald, red, amber, blue, and orange fills                  | Trends, statuses, notices; use semantic meaning, not decoration |
| Sidebar                 | `--sidebar-*` / `bg-sidebar-*`                     | `src/styles/theme.css:77-84,113-120`                                  | Navigation surface, active item, divider                        |

Rules:

- Use semantic Tailwind tokens first. If a new semantic role is genuinely needed, add it here and to the theme before using it.
- `#1E40AF` is the documented primary color reference; components consume `--primary` so light/dark behavior remains centralized.
- Accent color is reserved for actions, links, selection, focus, and status communication. Keep the page mostly white, muted, and neutral.
- Do not copy raw colors from generated exports into maintained components. The project instruction to keep values token-aware is in `CLAUDE.md:125-131`.

## 3. Typography

### Font stack

- Primary: `"Helvetica Neue:Regular", "Helvetica Neue", ui-sans-serif, system-ui, sans-serif` (`src/styles/theme.css:47-50`).
- Medium emphasis: `"Helvetica Neue:Medium"` for buttons, compact headings, and selected labels (`src/styles/fonts.css:5-19`).
- Mono: the existing system monospace stack for technical values only (`src/styles/theme.css:49-50`).
- The `src/styles/fonts.css` fallback faces preserve Helvetica Neue on non-macOS systems; do not change the product primary family.

### Observed scale and rules

| Intent                | Size                 | Weight  | Usage                                        |
| --------------------- | -------------------- | ------- | -------------------------------------------- |
| Page title            | `20px` / `text-xl`   | 400     | `AppPage` title (`app-page.tsx:72-78`)       |
| Card or section title | `16px` / `text-base` | 400-500 | Card headings and labels                     |
| Body                  | `14px` / `text-sm`   | 400     | Descriptions, navigation, control text       |
| Compact metadata      | `12px` / `text-xs`   | 400-500 | Hints, counts, status labels                 |
| KPI value             | `24px` / `text-2xl`  | 400     | `CardStats` values (`cards/stats.tsx:60-74`) |
| Micro label           | `10-11px`            | 400-500 | Notification/status metadata only            |

Keep body copy at or above `14px` where it carries a task. Use Helvetica Neue on all text-bearing controls, keep line length readable, and use weight before size to establish hierarchy. Avoid decorative display typography.

## 4. Spacing & Layout

### Spacing tokens

The recurring rhythm is a 4px base with 8px, 12px, 16px, 24px, and 32px steps. Common observed values are `gap-1`/4px, `gap-2`/8px, `gap-3`/12px, `gap-4`/16px, `gap-6`/24px, and `p-6`/24px. Preserve one-off browser mechanics when they express shell geometry, but do not add arbitrary spacing to maintained primitives.

| Token      | Value | Typical use                                |
| ---------- | ----- | ------------------------------------------ |
| `space-1`  | 4px   | Icon and label separation, compact stacks  |
| `space-2`  | 8px   | Inline controls, list gaps                 |
| `space-3`  | 12px  | Button padding, topbar compact rhythm      |
| `space-4`  | 16px  | Field/control padding, standard group gaps |
| `space-6`  | 24px  | Card padding, page gutters, major groups   |
| `space-8`  | 32px  | Separation between content groups          |
| `space-12` | 48px  | Shell and section breathing room           |

### App shell geometry

- `AppShell` is the public shell primitive and delegates to `AppLayout` (`src/components/layout/app-shell.tsx:6-16`).
- `AppLayout` owns the full-height, overflow-hidden frame and the scrolling `.prototype-shell-surface` (`app-layout.tsx:36-61`). The scroll owner is the shell surface, not the page document.
- The sidebar is fixed at 24px from the top and left, 24px from the bottom, with a 200px expanded width or 64px collapsed width, `rounded-2xl`, a border, and a subtle shadow (`app-sidebar.tsx:27-35`).
- The topbar is fixed, full width, and reserves the shell offset. At rest it is transparent; after scroll it gains a white surface, bottom border, and subtle shadow (`top-bar.tsx:21-43`).
- `AppPage` supplies the page content contract: top padding for the topbar, right and bottom 24px gutters, shell-offset left padding, title/breadcrumb/actions, and a full-width main region (`app-page.tsx:51-85`).
- Use flex and grid for responsive composition. Preserve a readable single-column flow at narrow widths; the topbar switches to its compact mobile row at the `md` boundary.

## 5. Components & Primitives

The Primitive Showcase must be built and reviewed before any new product screen work. It must render every maintained primitive at mobile, tablet, and desktop widths and exercise default, hover, active, focus-visible, disabled, loading, empty, and error states. Product screens may compose these primitives only after the showcase establishes the contract.

### AppShell, sidebar, and topbar

- **Structure:** `AppShell` → `AppLayout` → scrolling shell surface, fixed `AppSidebar`, fixed `TopBar`.
- **Variants:** sidebar expanded/collapsed; topbar scrolled/unscrolled; desktop/mobile topbar.
- **Spacing:** shell offset is 248px/112px for topbar alignment and content becomes 260px/124px when accounting for the 12px inner alignment; sidebar uses 24px outer inset and 16px navigation vertical padding.
- **States:** navigation default, active, hover, collapsed, focus-visible; topbar transparent and scrolled.
- **Accessibility:** semantic `aside`, `header`, `nav`, visible focus, keyboard-reachable collapse and navigation controls, labels/tooltips for collapsed icon-only controls.
- **Motion:** width and topbar state transition over the existing 200ms duration; animate only width, opacity, transform, and color/surface changes where supported.

### AppPage and breadcrumb

- **Structure:** page header with optional breadcrumb, title, description, and actions followed by `main` content.
- **Variants:** title-only, title plus description, breadcrumb, action group, content-only.
- **Spacing:** 24px page rhythm, 12px header stack gap, 4px title/description relationship.
- **States:** breadcrumb link default, hover, focus-visible, current page; actions inherit Button states.
- **Accessibility:** heading hierarchy must remain one clear page heading; breadcrumb uses the existing shadcn primitive and buttons for navigable ancestors.

### Button

- **Source:** `src/components/ui/button.tsx:7-103`.
- **Variants:** default, outline, secondary, ghost, destructive, link; default, xs, sm, lg, and icon sizes.
- **Anatomy:** Helvetica Neue text, 8px radius, semantic fill/border, 32-40px height depending on size, optional HugeIcons icon, and loading spinner.
- **States:** hover, active press, focus-visible ring, disabled, `loading`, and `aria-invalid`.
- **Accessibility:** native button semantics, keyboard operation, visible focus, disabled/loading announcement where needed, and non-color-only distinction for destructive actions.

### Card and CardStats

- **Source:** `src/components/ui/card.tsx:5-89` and `src/components/custom/cards/stats.tsx:40-82`.
- **Anatomy:** white `Card` surface, `rounded-4xl` base primitive or the existing `rounded-xl` stats treatment, `shadow-md`/`shadow-sm`, subtle ring/border, header/content/footer slots.
- **Variants:** default and compact card size; KPI with optional subtitle, icon, and up/down/neutral trend.
- **States:** default, actionable hover/focus when interactive, loading skeleton, empty content, error content, and status trend.
- **Accessibility:** preserve heading and description relationships, keep trend meaning in text, and never rely on color alone.

### Data and feedback primitives

- Reuse shadcn primitives in `src/components/ui/**` for Badge, Input, Select, Tabs, Table, Dialog, Drawer, Sheet, Calendar, Switch, Checkbox, Skeleton, Empty, and Error State.
- Reuse custom `DataList` for label/value relationships and `CardStats` for repeated KPI blocks. App-specific repeated patterns belong in custom/module components, as recorded in `docs/audits/shadcn-ui-quarantine.md:24-34`.
- New maintained icons use HugeIcons with the existing rounded stroke character (`CLAUDE.md:129-138`, `.claude/rules/agenda-fidelity.md:12`). Existing generated exceptions remain quarantined and are not a reason for broad generated-file edits (`docs/audits/shadcn-ui-quarantine.md:12-22`).

## 6. Motion & Interaction

Motion is functional and quiet. Existing examples are `transition-[width] duration-200` on the sidebar, topbar transition groups over 200ms, and `animate-in fade-in ... duration-500` on `AppPage` (`app-sidebar.tsx:27-30`, `top-bar.tsx:21-26`, `app-page.tsx:51-55`).

| Interaction                | Duration    | Easing      | Purpose                            |
| -------------------------- | ----------- | ----------- | ---------------------------------- |
| Button press, hover, focus | 150-200ms   | ease-out    | Confirm an affordance              |
| Sidebar/topbar state       | 200ms       | ease-in-out | Preserve shell continuity          |
| Page entry                 | up to 500ms | ease-out    | Orient the user after route change |

Rules:

- Animate only `transform`, `opacity`, filter, and already-established color/surface transitions. Do not animate layout as a decorative effect.
- Every interactive primitive needs hover, active, and focus-visible feedback. Loading, empty, and error states must communicate state without relying on motion.
- Respect `prefers-reduced-motion`: remove non-essential page-entry and transition movement while preserving state and focus feedback.
- Do not add decorative looping motion or motion to non-interactive elements.

## 7. Depth & Surface

The established strategy is mixed but restrained: white or semantic card surfaces, one-pixel borders/rings for separation, and small shadows only where a surface floats above the canvas. The sidebar uses `shadow-sm`; cards use `shadow-md` with a subtle ring; the scrolled topbar uses a one-pixel shadow (`app-sidebar.tsx:27-30`, `card.tsx:11-16`, `top-bar.tsx:23-26`).

- Canvas: `bg-muted/30` around the shell with `bg-background` or `bg-card` content surfaces.
- Elevated surface: white card or popover with border/ring and a small shadow, never a heavy glow.
- Navigation: rounded floating rail with a clear border and low-contrast depth cue.
- Status: semantic fills such as `primary/10`, muted, emerald, red, amber, blue, and orange provide local emphasis.
- Keep corner radii purposeful: 8px controls, 12-14px compact navigation/control surfaces, 16px shell/sidebar, and the existing card radii where the primitive already defines them.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA for maintained UI: minimum 4.5:1 contrast for normal text and 3:1 for large text or UI graphics, with visible focus indicators.
- All actions and navigation must be keyboard reachable in a logical order. Collapsed sidebar controls need an accessible name; icon-only actions must not communicate meaning by icon or color alone.
- Use semantic headings, landmarks, labels, descriptions, table headers, dialog focus management, and status text for loading, empty, error, and copied feedback.
- Preserve Helvetica Neue on text-bearing controls and preserve HugeIcons as the maintained icon system.
- Honor reduced motion, text scaling, narrow widths, high contrast needs, and long Portuguese labels. Primary content must reflow without horizontal scrolling at mobile widths.
- Mock-only behavior must remain local to fixtures/services. Do not imply a network request or live persistence in the UI (`.claude/rules/agenda-fidelity.md:3-12`).

### Accepted Debt

| Item                                                                                                                           | Location                                                                     | Why accepted                                                                                                                                      | Exit                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Generated UI files contain legacy icon/theme exceptions                                                                        | `docs/audits/shadcn-ui-quarantine.md:12-22`                                  | They are isolated generated files; broad churn is out of scope for this contract                                                                  | Replace only when a focused component task names the file                                                  |
| Some existing module markup still contains hardcoded export-era values                                                         | `src/modules/**`                                                             | This task documents the system and does not edit product code; maintained follow-up work should migrate values to semantic tokens                 | Update at component adoption or screen-refinement time                                                     |
| Visual verification is pending for the future Primitive Showcase                                                               | Future showcase surface                                                      | No new product screen is authorized before primitive states are rendered and checked                                                              | Capture mobile/tablet/desktop state evidence before product screens                                        |
| Receiving destination preselection falls back to the default, then first local destination for an affiliate with no assignment | `src/modules/afiliados/ConfiguracoesPage.tsx`, `handleOpenDestinationChange` | Prototype-only behavior affecting affiliates without an assigned destination; this fallback remains A VALIDAR in `Specdrivenafiliados.md:112,126` | Replace with the owner-confirmed selection rule and update the focused settings test when validation lands |

Accepted debt is explicit, located, and bounded. New debt must be added here with an affected user, reason, and exit condition before it is treated as part of the system.

## Source Map

- Global style assembly: `src/styles/index.css:1-4`.
- Tailwind v4 and shadcn imports: `src/styles/tailwind.css:1-5`.
- Font faces and fallbacks: `src/styles/fonts.css:1-43`.
- Semantic theme tokens, base layer, and scrollbar treatment: `src/styles/theme.css:3-120,123-177`.
- Shell geometry: `src/components/layout/app-shell.tsx:6-16`, `app-layout.tsx:36-61`, `app-sidebar.tsx:27-70`, `top-bar.tsx:21-44`, `app-page.tsx:51-87`.
- Maintained primitives and quarantine boundary: `src/components/ui/button.tsx:7-103`, `src/components/ui/card.tsx:5-89`, `src/components/custom/cards/stats.tsx:40-82`, `src/components/custom/data-list.tsx:7-78`, `docs/audits/shadcn-ui-quarantine.md:3-34`.
