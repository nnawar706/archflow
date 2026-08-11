# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 02: Editor Chrome — complete

## Current Goal

- Start Feature 03: Auth (`context/features/03-auth.md`).

## Completed

- **01 — Design System**: `shadcn/ui` initialized (Nova preset, Lucide icons, CSS variables). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea to `components/ui/`. Installed `lucide-react`. `lib/utils.ts` created with `cn()`. `app/globals.css` rewritten with the dark-only palette from `context/ui-context.md`: raw tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) plus a `@theme inline` mapping to both shadcn's standard tokens (`--background`, `--primary`, `--border`, ...) and project-specific Tailwind utilities (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.). `<html>` in `app/layout.tsx` carries a permanent `dark` class (no light mode toggle). Verified via `tsc --noEmit` and `npm run build`.
- **02 — Editor Chrome**: Added `components/editor-navbar.tsx` — fixed-height (`h-14`) top navbar with left/center/right sections; left holds a sidebar toggle `Button` swapping `PanelLeftOpen`/`PanelLeftClose` off an `isSidebarOpen` prop; `onToggleSidebar` callback passed in; dark `bg-surface` background with `border-b border-surface-border`. Added `components/sidebar.tsx` — `isOpen`/`onClose`-controlled overlay sidebar, `absolute` positioned (floats over the canvas, does not push layout) and slides in via `translate-x` transition; header with "Projects" title + close button; shadcn `Tabs` for "My Projects" / "Shared", both rendering an empty placeholder state; full-width "New Project" button with `Plus` icon pinned to the bottom. Added `components/base-dialog.tsx` — reusable dialog pattern wrapping shadcn `Dialog` with `title`/`description`/`footer`/`children` props, styled `rounded-3xl` per the modal radius scale; no concrete dialogs built on top of it yet (that's later feature work). All three components are client components (event handlers, Radix `Tabs`/`Dialog`) and live flat in `components/`. Added `components/editor-shell.tsx` — client component that owns the `isSidebarOpen` state and composes `EditorNavbar` + `ProjectSidebar` + a `children` slot for canvas content, wiring the navbar toggle and the sidebar's close button to the same state. `app/page.tsx` renders `EditorShell` with a placeholder "Canvas placeholder" child as a temporary stand-in until real routing/auth/canvas land in later features. Verified via `tsc --noEmit`, `npm run lint`, and `npm run build`.

## In Progress

- None.

## Next Up

- Feature 03: Auth.

## Open Questions

- None currently.

## Architecture Decisions

- Theme is dark-only: both `:root` and `.dark` in `globals.css` hold identical dark values, and `<html>` always carries the `dark` class — this satisfies the `dark:` variant classes baked into generated `components/ui/*` files without needing a toggle.
- shadcn `radix-nova` style/preset chosen (Lucide icons, Geist font) to match `ui-context.md`'s icon and typography requirements.
- `--radius` set to `0.75rem` so button/input corners land near the `rounded-xl` scale from `ui-context.md`; note that Card and Dialog hardcode literal `rounded-xl` classes in the generated components rather than deriving from `--radius`, so they don't reach `rounded-2xl`/`rounded-3xl` — accepted as-is since `components/ui/*` must not be modified.

## Session Notes

- `components/ui/*` must not be edited (per `AGENTS.md` and `ai-workflow-rules.md`); any future project-specific styling goes in app-level components instead.
- To add more shadcn components later, run `npx shadcn@latest add <name> -y`.
