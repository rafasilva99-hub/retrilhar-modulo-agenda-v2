# Dependency Quarantine

## Scope

This audit covers package debt that came from the Figma/prototype baseline and the Admin alignment work. The prototype remains Vite/React, hash-routed, mock-only, and without backend/API/auth integrations.

## Decisions

| Package               | Decision                    | Evidence                                                                                                                                                                       | Replacement path                                                                                                                            |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `@mui/material`       | Removed                     | `rg -n "@mui" src package.json` found no maintained source usage outside docs/tests before removal.                                                                            | Use existing shadcn/HugeIcons-compatible primitives under `src/components/ui/**`, `src/components/custom/**`, and agenda module components. |
| `@mui/icons-material` | Removed                     | No maintained source import was found. It was package-level debt from the generated baseline.                                                                                  | Use `@hugeicons/react` for new maintained icon usage.                                                                                       |
| `@emotion/react`      | Removed                     | No maintained source import was found. It was only present as MUI support.                                                                                                     | Keep styling in Tailwind/shadcn CSS tokens and module components.                                                                           |
| `@emotion/styled`     | Removed                     | No maintained source import was found. It was only present as MUI support.                                                                                                     | Keep styling in Tailwind/shadcn CSS tokens and module components.                                                                           |
| `lucide-react`        | Kept as generated exception | Current generated shadcn files import it in `src/components/ui/carousel.tsx`, `context-menu.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, and `resizable.tsx`. | Replace one generated exception at a time with HugeIcons-compatible variants only when the component is actively maintained.                |
| `next-themes`         | Kept as generated exception | `src/components/ui/sonner.tsx` still imports `useTheme` from `next-themes`.                                                                                                    | Revisit when toast/theme behavior is normalized for the Vite prototype or replaced in the Admin migration target.                           |

## Current State

- Removed packages are absent from `package.json` and `package-lock.json`.
- Kept packages are isolated to generated `src/components/ui/**` exceptions.
- New maintained agenda code should not add MUI, Emotion, `next-themes`, or `lucide-react` imports.
- New icons in maintained code should use HugeIcons, matching the Admin `components.json` icon preset.

## Verification

- Dependency scan before cleanup: `.omo/ulw-loop/evidence/G005-C001-audit-before.txt`
- Package state after cleanup: `.omo/ulw-loop/evidence/G005-C001-package-state.txt`
- Verification gate: `.omo/ulw-loop/evidence/G005-C001-verification.txt`
