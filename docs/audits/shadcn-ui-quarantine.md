# Shadcn UI Quarantine

## Purpose

This inventory keeps generated UI debt explicit while the prototype moves toward Admin-compatible frontend structure. `src/components/ui/**` remains treated as generated/managed unless a later task names a focused replacement.

## aligned

- `button.tsx`, `card.tsx`, `table.tsx`, `skeleton.tsx`, `badge.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, and other shadcn primitives are usable as the maintained base for new prototype code.
- HugeIcons is the preferred icon system for new maintained components.

## generated exception

- `lucide-react` remains in generated UI files for now:
  - `src/components/ui/carousel.tsx`
  - `src/components/ui/context-menu.tsx`
  - `src/components/ui/menubar.tsx`
  - `src/components/ui/navigation-menu.tsx`
  - `src/components/ui/pagination.tsx`
  - `src/components/ui/resizable.tsx`
- `next-themes` remains isolated to `src/components/ui/sonner.tsx`.
- These exceptions are documented rather than mass-edited in Wave 1 to avoid broad generated-file churn.

## needs wrapper

- App-specific repeated patterns should live in `src/components/custom/**` or module components, not in generated `src/components/ui/**`.
- Skeleton compositions should live in `src/components/skeleton/**`.
- New agenda-specific status/reservation indicators should be extracted in later waves instead of patching imported Figma files directly.

## candidate for later replacement

- `lucide-react` can be removed only after every generated exception has a HugeIcons replacement or an explicit decision to keep the generated file as-is.
- `next-themes` can be revisited when toast/theme behavior is normalized for Vite.
- `@mui/material` and `@mui/icons-material` are package-level debt; no maintained source imports were found in this Wave 1 audit, so removal belongs to a later dependency quarantine task.
