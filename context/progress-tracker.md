# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 01: Design System — complete

## Current Goal

- Start Feature 02: Editor Chrome (`context/features/02-editor-chrome.md`).

## Completed

- **01 — Design System**: `shadcn/ui` initialized (Nova preset, Lucide icons, CSS variables). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea to `components/ui/`. Installed `lucide-react`. `lib/utils.ts` created with `cn()`. `app/globals.css` rewritten with the dark-only palette from `context/ui-context.md`: raw tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) plus a `@theme inline` mapping to both shadcn's standard tokens (`--background`, `--primary`, `--border`, ...) and project-specific Tailwind utilities (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.). `<html>` in `app/layout.tsx` carries a permanent `dark` class (no light mode toggle). Verified via `tsc --noEmit` and `npm run build`.

## In Progress

- None.

## Next Up

- Feature 02: Editor Chrome.

## Open Questions

- None currently.

## Architecture Decisions

- Theme is dark-only: both `:root` and `.dark` in `globals.css` hold identical dark values, and `<html>` always carries the `dark` class — this satisfies the `dark:` variant classes baked into generated `components/ui/*` files without needing a toggle.
- shadcn `radix-nova` style/preset chosen (Lucide icons, Geist font) to match `ui-context.md`'s icon and typography requirements.
- `--radius` set to `0.75rem` so button/input corners land near the `rounded-xl` scale from `ui-context.md`; note that Card and Dialog hardcode literal `rounded-xl` classes in the generated components rather than deriving from `--radius`, so they don't reach `rounded-2xl`/`rounded-3xl` — accepted as-is since `components/ui/*` must not be modified.

## Session Notes

- `components/ui/*` must not be edited (per `AGENTS.md` and `ai-workflow-rules.md`); any future project-specific styling goes in app-level components instead.
- To add more shadcn components later, run `npx shadcn@latest add <name> -y`.
