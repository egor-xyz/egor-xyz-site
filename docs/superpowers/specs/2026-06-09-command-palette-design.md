# ⌘K Command Palette — Design

**Date:** 2026-06-09
**Status:** Approved (pending spec review)

## Goal

Add a `⌘K` / `Ctrl+K` command palette that lets a user, from anywhere on the
site:

1. Navigate to any page (Home, Digest, Devkitty, Extensions, About).
2. Toggle the colour theme (dark ↔ light).
3. Open / close the 3D MacBook lid — but only while on the Home page, where the
   laptop is rendered.

A secondary, equally important goal: the site is currently **not keyboard
accessible**. The primary navigation lives inside the 3D MacBook's
`<Html transform>` screen, where Tab focus is unreliable. The palette becomes the
keyboard- and screen-reader-accessible path to every page, reachable without
touching the 3D scene.

## Decisions

- **Build on `cmdk`** (the de-facto command-palette library). It is headless, so
  we style it with Tailwind to match the site. It provides accessible filtering,
  fuzzy search, and arrow-key navigation out of the box. One small dependency.
- **Keyboard nav: Tab + arrows both work.** Arrow keys + Enter are cmdk's native
  behaviour. We additionally map Tab → next item and Shift+Tab → previous item,
  with wrap-around.
- **Laptop toggle command is Home-only.** It appears in the palette only when
  `pathname === '/'`. It does not auto-navigate.

## Architecture

A single `<CommandPalette />` is mounted globally in `App`, inside the existing
`HashRouter`, so it has router context (`useNavigate`, `useLocation`).

To avoid pulling Radix in transitively via cmdk's `CommandDialog`, we render
cmdk's **base `Command`** inside our own `motion`-powered overlay (consistent
with the project's existing `motion` usage).

State lives in two tiny zustand stores, matching the project's existing
`useThemeStore` / `useStore` pattern.

### Component / data-flow diagram

```
App
├── CommandPalette                      (always mounted)
│     reads:  useCommandStore (open?)
│             useThemeStore   (theme, setTheme)
│             useMacbookStore (mode, toggle)   ← only used by laptop command
│             useLocation     (gate laptop command to "/")
│     uses:   useNavigate     (navigation commands)
│     binds:  useCommandHotkey (⌘K / Ctrl+K → toggle)
├── CommandPaletteTrigger (button)      → useCommandStore.setOpen(true)
└── Home → Macbook
              reads/writes: useMacbookStore (mode)   ← was local useState
```

## New files

### `src/store/macbookStore.ts`

Lifts the laptop lid state out of `Macbook`'s local `useState`.

```ts
type MacbookState = {
  mode: 'open' | 'closed';
  setMode: (mode: 'open' | 'closed') => void;
  toggle: () => void;
};
```

Default `mode: 'open'` (matches today's initial `useState('open')`).

### `src/store/commandStore.ts`

Palette visibility, so the hotkey, the trigger button, and command actions can
all drive it.

```ts
type CommandState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};
```

### `src/components/CommandPalette/CommandPalette.tsx`

The palette UI. Responsibilities:

- Subscribe to `useCommandStore` for `open`.
- Render an `AnimatePresence` + `motion.div` backdrop and centred panel
  (top-ish, like Spotlight). Respect `useReducedMotion` (instant, no scale/fade).
- Inside, render cmdk `Command` (controlled `value` for the highlighted item),
  `Command.Input`, `Command.List`, `Command.Empty`, and `Command.Item`s grouped
  with `Command.Group` ("Pages", "Actions").
- Build items:
  - **Pages:** `{ heading: 'Home', href: '/' }` prepended to `menuItems`. On
    select → `navigate(href)` + close.
  - **Toggle theme:** label is `Switch to light mode` / `Switch to dark mode`
    from `useThemeStore().theme`. On select → `setTheme(other)` + close.
  - **Open / Close laptop:** rendered only when `pathname === '/'`. Label
    `Open laptop` / `Close laptop` from `useMacbookStore().mode`. On select →
    `toggle()` + close.
- Dialog-level a11y: `role="dialog"`, `aria-modal="true"`, `aria-label`.
  Focus the input on open; restore the previously-focused element on close.
- Close on: Esc, backdrop click, and after any command runs.
- **Tab / Shift+Tab cycling:** intercept Tab in the `Command`'s `onKeyDown`,
  `preventDefault`, and advance the controlled `value` to the next / previous
  visible, non-disabled item (wrap-around at the ends). Because Tab never
  propagates to the browser, focus cannot leave the open palette — this doubles
  as the focus trap.

### `src/components/CommandPalette/useCommandHotkey.ts`

A hook (used by `CommandPalette`) that binds a global `keydown`:
`(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'` → `preventDefault()` +
`toggle()`. Cleans up on unmount.

### `src/components/CommandPalette/index.ts`

Barrel export for `CommandPalette` (and the trigger, if co-located).

## Modified files

### `src/components/Macbook/Macbook.tsx`

- Remove `const [mode, setMode] = useState<'open' | 'closed'>('open')`.
- Read `mode` + setters from `useMacbookStore`.
- Existing interactions keep working unchanged:
  - `onPointerMissed` → `setMode('closed')`
  - `onClickModel` → `setMode('open')`
  - the `useEffect` that resets drag/zoom on `mode === 'closed'` stays.
- No change to the 3D rendering or animation logic.

### `src/App.tsx`

- Render `<CommandPalette />`.
- Render a small fixed **trigger button** (e.g. bottom-right) showing `⌘K`, with
  an accessible label, calling `useCommandStore.getState().setOpen(true)` (or via
  hook). This makes the palette reachable for touch / mobile / screen-reader
  users who have no keyboard shortcut.

### `package.json`

- Add `cmdk` to `dependencies` (installed with pnpm).

## Styling

Match the macOS-window aesthetic already established in `ScreenMenu`:

- Panel: `rounded-xl bg-[#1c1c1e]/95 ring-1 ring-white/10 backdrop-blur-md
  shadow-2xl` (dark). Honour the `dark` custom variant so light theme gets a
  light panel.
- Backdrop: dimmed, blurred, click-to-close.
- Input: borderless, large, placeholder "Type a command or search…".
- Items: title + optional subheading (reuse `subheading` from `menuItems`),
  hover/selected highlight, consistent with the site's white-on-dark palette.

## Out of scope

- **Not** rewiring or removing the existing 3D `<Html transform>` `ScreenMenu`.
  It stays as-is; the palette is the accessible alternative alongside it.
- No fuzzy-search tuning beyond cmdk defaults.
- No command history / recents.
- No per-command icons (can be a later polish pass).

## Testing / verification

This is a Vite + React SPA with no existing test runner configured. Verification
is manual + lint/build:

- `pnpm lint` (Biome) and `pnpm build` (tsc + vite) pass.
- Manual checks:
  - ⌘K / Ctrl+K opens and closes; Esc closes; backdrop click closes.
  - Trigger button opens it.
  - Typing filters; Enter on a page navigates and closes.
  - Arrow keys move highlight; Tab / Shift+Tab move highlight with wrap.
  - Toggle theme flips dark/light and persists (localStorage).
  - On `/`, "Open/Close laptop" appears and drives the 3D lid; off `/` it is
    absent.
  - Reduced-motion: palette appears without scale/fade animation.
