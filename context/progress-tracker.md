# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 03: Auth — complete

## Current Goal

- Start Feature 04: Project Dialogs (`context/features/04-project-dialogs.md`).

## Completed

- **01 — Design System**: `shadcn/ui` initialized (Nova preset, Lucide icons, CSS variables). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea to `components/ui/`. Installed `lucide-react`. `lib/utils.ts` created with `cn()`. `app/globals.css` rewritten with the dark-only palette from `context/ui-context.md`: raw tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) plus a `@theme inline` mapping to both shadcn's standard tokens (`--background`, `--primary`, `--border`, ...) and project-specific Tailwind utilities (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.). `<html>` in `app/layout.tsx` carries a permanent `dark` class (no light mode toggle). Verified via `tsc --noEmit` and `npm run build`.
- **02 — Editor Chrome**: Added `components/editor-navbar.tsx` — fixed-height (`h-14`) top navbar with left/center/right sections; left holds a sidebar toggle `Button` swapping `PanelLeftOpen`/`PanelLeftClose` off an `isSidebarOpen` prop; `onToggleSidebar` callback passed in; dark `bg-surface` background with `border-b border-surface-border`. Added `components/sidebar.tsx` — `isOpen`/`onClose`-controlled overlay sidebar, `absolute` positioned (floats over the canvas, does not push layout) and slides in via `translate-x` transition; header with "Projects" title + close button; shadcn `Tabs` for "My Projects" / "Shared", both rendering an empty placeholder state; full-width "New Project" button with `Plus` icon pinned to the bottom. Added `components/base-dialog.tsx` — reusable dialog pattern wrapping shadcn `Dialog` with `title`/`description`/`footer`/`children` props, styled `rounded-3xl` per the modal radius scale; no concrete dialogs built on top of it yet (that's later feature work). All three components are client components (event handlers, Radix `Tabs`/`Dialog`) and live flat in `components/`. Added `components/editor-shell.tsx` — client component that owns the `isSidebarOpen` state and composes `EditorNavbar` + `ProjectSidebar` + a `children` slot for canvas content, wiring the navbar toggle and the sidebar's close button to the same state. Verified via `tsc --noEmit`, `npm run lint`, and `npm run build`.
- **03 — Auth**: Installed `@clerk/ui` for the theme package (Core 3 SDK; `@clerk/nextjs` was already present). Added `proxy.ts` at the project root (Next.js 16 renamed `middleware.ts` → `proxy.ts`) using `clerkMiddleware` + `createRouteMatcher` in a protected-first pattern: everything is protected by `auth.protect()` except `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`NEXT_PUBLIC_CLERK_SIGN_UP_URL` (added to `.env.local`/`.env.example` as `/sign-in` and `/sign-up`, since no sign-in/sign-up env vars previously existed in the repo). `app/layout.tsx` wraps `{children}` in `ClerkProvider` inside `<body>` (Core 3 requirement — provider cannot wrap `<html>`), themed with `dark` from `@clerk/ui/themes` and an `appearance.variables` object that maps every color to the app's existing CSS custom properties (`var(--accent-primary)`, `var(--bg-elevated)`, `var(--border-default)`, etc. — no hardcoded colors) plus `borderRadius: "var(--radius)"`. Added `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` (catch-all routes, required by Clerk for internal sub-steps like SSO callback/verification), both wrapped in a new `components/auth-layout.tsx` — a server component with a 50/50 two-panel layout on large screens (left panel: `bg-surface` for a gray-ish differentiation from the `bg-base` right side, logo, headline, short paragraph, and a plain text-only feature list with no icons/cards/gradients per spec; right panel: centered `<SignIn>`/`<SignUp>` capped at `max-w-sm` to prevent overflow) and form-only on small screens (`hidden lg:flex` on the left panel). `app/page.tsx` is now a pure `redirect("/editor")` — unauthenticated visitors never reach it because `proxy.ts` redirects them to `/sign-in` first; the canvas placeholder that used to live at `/` moved to the new `app/editor/page.tsx`. Added Clerk's `<UserButton />` to the right section of `components/editor-navbar.tsx`. Verified via `tsc --noEmit`, `npm run lint`, `npm run build`, and headless-browser screenshots of `/sign-in` and `/sign-up` at desktop (1600px, confirming 50/50 split + gray left panel) and mobile (430px, confirming no horizontal overflow via a Puppeteer layout inspection — `.cl-card` measured 392px wide inside a 430px viewport).

## In Progress

- None.

## Next Up

- Feature 04: Project Dialogs.

## Open Questions

- None currently.

## Architecture Decisions

- Theme is dark-only: both `:root` and `.dark` in `globals.css` hold identical dark values, and `<html>` always carries the `dark` class — this satisfies the `dark:` variant classes baked into generated `components/ui/*` files without needing a toggle.
- shadcn `radix-nova` style/preset chosen (Lucide icons, Geist font) to match `ui-context.md`'s icon and typography requirements.
- `--radius` set to `0.75rem` so button/input corners land near the `rounded-xl` scale from `ui-context.md`; note that Card and Dialog hardcode literal `rounded-xl` classes in the generated components rather than deriving from `--radius`, so they don't reach `rounded-2xl`/`rounded-3xl` — accepted as-is since `components/ui/*` must not be modified.

## Session Notes

- `components/ui/*` must not be edited (per `AGENTS.md` and `ai-workflow-rules.md`); any future project-specific styling goes in app-level components instead.
- To add more shadcn components later, run `npx shadcn@latest add <name> -y`.
- Clerk's SDK logs a deprecation warning for `createRouteMatcher`/middleware-based route protection, recommending per-page resource-based `auth()` checks instead. `proxy.ts` still uses `createRouteMatcher` because `03-auth.md` explicitly specifies "protect everything else by default" at the proxy layer — kept as-is since it's a deprecation warning, not a removal, and matches the spec.
