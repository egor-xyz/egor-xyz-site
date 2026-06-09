# ⌘K Command Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ⌘K / Ctrl+K command palette that navigates to any page, toggles the theme, and (on Home) opens/closes the 3D MacBook lid — fully keyboard- and screen-reader-accessible.

**Architecture:** A single globally-mounted `<CommandPalette />` (inside the existing `HashRouter`) renders cmdk's headless `Command` inside a `motion`-powered overlay. Two tiny zustand stores hold palette visibility and the (newly lifted) MacBook lid state. A small fixed trigger button opens the palette for non-keyboard users.

**Tech Stack:** React 19, TypeScript (strict), Vite, Tailwind v4, `motion`, `zustand`, `react-router-dom` (HashRouter), **`cmdk`** (new), Biome (lint/format).

**Reference spec:** `docs/superpowers/specs/2026-06-09-command-palette-design.md`

**Conventions to honour (Biome):** single quotes, single JSX quotes, no trailing commas, 2-space indent, 120 line width, multiline JSX attributes. `src/...` is an absolute import alias (`baseUrl: "."`). `useSortedClasses` (className ordering) is a warning auto-fixed by `pnpm lint:fix` — always run it before committing. There is **no test runner**; verification is `pnpm lint`, `pnpm build`, and manual browser checks.

---

## File Structure

**Create:**
- `src/store/macbookStore.ts` — lid open/closed state (lifted out of `Macbook`).
- `src/store/commandStore.ts` — palette open/closed visibility state.
- `src/components/CommandPalette/CommandPalette.tsx` — the palette UI.
- `src/components/CommandPalette/CommandPaletteTrigger.tsx` — the visible ⌘K button.
- `src/components/CommandPalette/useCommandHotkey.ts` — global ⌘K / Ctrl+K key binding.
- `src/components/CommandPalette/index.ts` — barrel export.

**Modify:**
- `src/components/Macbook/Macbook.tsx` — read `mode` from `useMacbookStore` instead of local `useState`.
- `src/App.tsx` — mount `<CommandPalette />` and `<CommandPaletteTrigger />`.
- `package.json` / `pnpm-lock.yaml` — add `cmdk`.

---

## Task 0: Branch

- [ ] **Step 1: Create a feature branch**

The repo is on the default branch `main`. Branch before doing any work.

Run:
```bash
git checkout -b feat/command-palette
```
Expected: `Switched to a new branch 'feat/command-palette'`

---

## Task 1: Add cmdk + create the stores

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml` (via pnpm)
- Create: `src/store/macbookStore.ts`
- Create: `src/store/commandStore.ts`

- [ ] **Step 1: Install cmdk**

Run:
```bash
pnpm add cmdk
```
Expected: cmdk is added to `dependencies` in `package.json`; lockfile updates; no peer-dependency errors against React 19.

- [ ] **Step 2: Create the MacBook lid store**

Create `src/store/macbookStore.ts`:
```ts
import { create } from 'zustand';

type Mode = 'open' | 'closed';

type MacbookState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
};

export const useMacbookStore = create<MacbookState>((set) => ({
  mode: 'open',
  setMode: (mode) => set({ mode }),
  toggle: () => set((state) => ({ mode: state.mode === 'open' ? 'closed' : 'open' }))
}));
```

- [ ] **Step 3: Create the command-palette visibility store**

Create `src/store/commandStore.ts`:
```ts
import { create } from 'zustand';

type CommandState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export const useCommandStore = create<CommandState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open }))
}));
```

- [ ] **Step 4: Lint + build**

Run:
```bash
pnpm lint:fix && pnpm build
```
Expected: Biome reports no errors; `tsc && vite build` completes with no type errors.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/store/macbookStore.ts src/store/commandStore.ts
git commit -m "feat: add cmdk dependency and command/macbook stores"
```

---

## Task 2: Lift the MacBook lid state into the store

The `mode` state currently lives as `useState` inside the `Macbook` component (only rendered on Home). Move it to `useMacbookStore` so the palette can drive it. Behaviour is otherwise unchanged.

**Files:**
- Modify: `src/components/Macbook/Macbook.tsx` (the outer `Macbook` component near lines 352–372)

> Note: `Macbook.tsx` has Biome linting disabled (see `biome.json` override), but `pnpm build` still type-checks it via `tsc`.

- [ ] **Step 1: Import the store**

In `src/components/Macbook/Macbook.tsx`, add this import alongside the other `src/...` imports (e.g. near `import { type A, a } from 'src/utils/a';`):
```ts
import { useMacbookStore } from 'src/store/macbookStore';
```

- [ ] **Step 2: Replace local lid state with the store**

In the `Macbook` component, find:
```tsx
  const [mode, setMode] = useState<'open' | 'closed'>('open');
  const [interactive, setInteractive] = useState(false);
```
Replace with:
```tsx
  const mode = useMacbookStore((state) => state.mode);
  const setMode = useMacbookStore((state) => state.setMode);
  const [interactive, setInteractive] = useState(false);
```

Leave everything else untouched — the existing `useEffect` that resets drag/zoom on `mode === 'closed'`, `onWheel`, `onPointerMissed={() => interactive && !moved.current && setMode('closed')}`, and `onClickModel={() => interactive && !moved.current && setMode('open')}` all keep working because `setMode` now comes from the store. `useState` is still imported (used by `interactive` here and `opened` in `MacbookModel`).

- [ ] **Step 3: Build**

Run:
```bash
pnpm build
```
Expected: no type errors. (`Macbook.tsx` is exempt from Biome, so `pnpm lint` won't cover it — `pnpm build` is the gate here.)

- [ ] **Step 4: Manual check**

Run `pnpm dev`, open the site. On Home, after the intro: click the laptop → it opens (zooms to the screen menu); click empty space → it closes (3/4 view). Confirm behaviour is identical to before the refactor.

- [ ] **Step 5: Commit**

```bash
git add src/components/Macbook/Macbook.tsx
git commit -m "refactor: drive Macbook lid state from useMacbookStore"
```

---

## Task 3: Global ⌘K hotkey hook

**Files:**
- Create: `src/components/CommandPalette/useCommandHotkey.ts`

- [ ] **Step 1: Write the hook**

Create `src/components/CommandPalette/useCommandHotkey.ts`:
```ts
import { useEffect } from 'react';
import { useCommandStore } from 'src/store/commandStore';

/**
 * Binds ⌘K (mac) / Ctrl+K (win/linux) globally to toggle the command palette.
 * The zustand `toggle` reference is stable, so this binds once.
 */
export const useCommandHotkey = () => {
  const toggle = useCommandStore((state) => state.toggle);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);
};
```

- [ ] **Step 2: Lint + build**

Run:
```bash
pnpm lint:fix && pnpm build
```
Expected: no errors. (Hook is unused until Task 4 wires it in — that's fine, it's exported and imported by the palette next.)

- [ ] **Step 3: Commit**

```bash
git add src/components/CommandPalette/useCommandHotkey.ts
git commit -m "feat: add global cmd+k hotkey hook"
```

---

## Task 4: The command palette + trigger button

**Files:**
- Create: `src/components/CommandPalette/CommandPalette.tsx`
- Create: `src/components/CommandPalette/CommandPaletteTrigger.tsx`
- Create: `src/components/CommandPalette/index.ts`

- [ ] **Step 1: Write the palette component**

Create `src/components/CommandPalette/CommandPalette.tsx`:
```tsx
import { Command } from 'cmdk';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCommandStore } from 'src/store/commandStore';
import { useMacbookStore } from 'src/store/macbookStore';
import { useThemeStore } from 'src/store/themeStore';
import { menuItems } from 'src/utils/menuItems';
import { useCommandHotkey } from './useCommandHotkey';

const pages = [{ heading: 'Home', href: '/', subheading: 'Back to the start' }, ...menuItems];

const itemClass =
  'flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 outline-none data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10';

export const CommandPalette = () => {
  useCommandHotkey();

  const open = useCommandStore((state) => state.open);
  const setOpen = useCommandStore((state) => state.setOpen);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const mode = useMacbookStore((state) => state.mode);
  const toggleLaptop = useMacbookStore((state) => state.toggle);

  const reduced = useReducedMotion();

  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [search, setSearch] = useState('');

  // Focus the input when opening; clear the query and restore focus when closing.
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setSearch('');
      lastFocused.current?.focus?.();
    }
  }, [open]);

  const close = () => setOpen(false);

  const run = (action: () => void) => {
    action();
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    // Map Tab / Shift+Tab onto cmdk's own arrow navigation (which wraps via `loop`).
    // cmdk runs this onKeyDown first and bails when defaultPrevented, so it won't
    // also try to handle Tab; the re-dispatched arrow then drives its selection.
    if (event.key === 'Tab') {
      event.preventDefault();
      const arrow = new KeyboardEvent('keydown', {
        bubbles: true,
        key: event.shiftKey ? 'ArrowUp' : 'ArrowDown'
      });
      event.currentTarget.dispatchEvent(arrow);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className='fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[18vh] backdrop-blur-sm'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={close}
          transition={{ duration: reduced ? 0 : 0.15 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className='w-full max-w-lg'
            exit={{ opacity: 0, scale: reduced ? 1 : 0.98, y: reduced ? 0 : -8 }}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.98, y: reduced ? 0 : -8 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <Command
              aria-label='Command menu'
              className='overflow-hidden rounded-xl bg-white/95 text-neutral-900 shadow-2xl ring-1 ring-black/10 backdrop-blur-md dark:bg-[#1c1c1e]/95 dark:text-white dark:ring-white/10'
              loop
              onKeyDown={onKeyDown}
            >
              <Command.Input
                className='w-full border-black/10 border-b bg-transparent px-5 py-4 text-base outline-none placeholder:text-neutral-400 dark:border-white/10 dark:placeholder:text-white/40'
                onValueChange={setSearch}
                placeholder='Type a command or search…'
                ref={inputRef}
                value={search}
              />

              <Command.List className='max-h-[320px] overflow-y-auto p-2'>
                <Command.Empty className='px-3 py-6 text-center text-neutral-400 text-sm dark:text-white/50'>
                  No results found.
                </Command.Empty>

                <Command.Group
                  className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-neutral-400 [&_[cmdk-group-heading]]:text-xs dark:[&_[cmdk-group-heading]]:text-white/40'
                  heading='Pages'
                >
                  {pages.map(({ heading, href, subheading }) => (
                    <Command.Item
                      className={itemClass}
                      key={href}
                      onSelect={() => run(() => navigate(href))}
                      value={`${heading} ${href} ${subheading}`}
                    >
                      <span className='font-medium text-sm'>{heading}</span>
                      <span className='text-neutral-500 text-xs dark:text-white/50'>{subheading}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-neutral-400 [&_[cmdk-group-heading]]:text-xs dark:[&_[cmdk-group-heading]]:text-white/40'
                  heading='Actions'
                >
                  <Command.Item
                    className={itemClass}
                    onSelect={() => run(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                    value={`theme toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    <span className='font-medium text-sm'>
                      {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    </span>
                  </Command.Item>

                  {pathname === '/' && (
                    <Command.Item
                      className={itemClass}
                      onSelect={() => run(toggleLaptop)}
                      value={`laptop lid ${mode === 'open' ? 'close' : 'open'}`}
                    >
                      <span className='font-medium text-sm'>
                        {mode === 'open' ? 'Close laptop' : 'Open laptop'}
                      </span>
                    </Command.Item>
                  )}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

- [ ] **Step 2: Write the trigger button**

Create `src/components/CommandPalette/CommandPaletteTrigger.tsx`:
```tsx
import { useCommandStore } from 'src/store/commandStore';

/**
 * A small fixed affordance so the palette is reachable without the keyboard
 * shortcut (touch / mobile / screen-reader users).
 */
export const CommandPaletteTrigger = () => {
  const setOpen = useCommandStore((state) => state.setOpen);

  return (
    <button
      aria-label='Open command menu'
      className='fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-full bg-black/5 px-3 py-2 text-neutral-600 text-xs ring-1 ring-black/10 backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/15 dark:hover:bg-white/20'
      onClick={() => setOpen(true)}
      type='button'
    >
      <span aria-hidden='true'>⌘K</span>
    </button>
  );
};
```

- [ ] **Step 3: Write the barrel export**

Create `src/components/CommandPalette/index.ts`:
```ts
export { CommandPalette } from './CommandPalette';
export { CommandPaletteTrigger } from './CommandPaletteTrigger';
```

- [ ] **Step 4: Lint + build**

Run:
```bash
pnpm lint:fix && pnpm build
```
Expected: Biome auto-sorts the long className strings and reports no errors; `tsc && vite build` completes with no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/CommandPalette
git commit -m "feat: add command palette component and trigger button"
```

---

## Task 5: Wire the palette into the app + full verification

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Mount the palette and trigger**

Replace the contents of `src/App.tsx` with:
```tsx
import { Link } from 'react-router-dom';

import Logo from './assets/logo.svg?react';
import { Backgrounds } from './components/Backgrounds';
import { CommandPalette, CommandPaletteTrigger } from './components/CommandPalette';
import { TopMenu } from './components/TopMenu';
import { Router } from './Router';

export const App = () => (
  <div className='flex h-[100svh] items-center justify-center overflow-hidden text-white'>
    <Backgrounds />
    <Router />
    <TopMenu />
    <CommandPalette />
    <CommandPaletteTrigger />

    {/* Logo lives permanently in the top-left corner — no intro animation. */}
    <Link
      className='fixed top-4 left-4 z-10 cursor-pointer bg-transparent p-3 dark:rounded-3xl dark:bg-white/20'
      to='/'
    >
      <Logo className='h-auto w-[88px] md:w-[96px] dark:opacity-80' />
    </Link>
  </div>
);
```

- [ ] **Step 2: Lint + build**

Run:
```bash
pnpm lint:fix && pnpm build
```
Expected: no errors.

- [ ] **Step 3: Manual verification (the acceptance checklist)**

Run `pnpm dev` and verify each item:

- [ ] ⌘K (or Ctrl+K) opens the palette; pressing it again (or Esc, or clicking the backdrop) closes it.
- [ ] The bottom-right ⌘K button opens the palette.
- [ ] On open, the search input is focused; typing filters items; "No results found." shows for nonsense queries.
- [ ] **Arrow keys** move the highlight; **Enter** runs the highlighted item.
- [ ] **Tab** moves the highlight down and **Shift+Tab** moves it up, both wrapping at the ends.
- [ ] Selecting a Page navigates to it and closes the palette (Home, Digest, Devkitty, Extensions, About all route correctly under HashRouter).
- [ ] "Switch to light/dark mode" flips the theme, the label updates to the opposite next time you open it, and the choice persists across reload (localStorage).
- [ ] On Home (`/`), an "Open laptop" / "Close laptop" command appears, its label matches the lid state, and selecting it drives the 3D lid. On any other route the command is absent.
- [ ] With OS "reduce motion" enabled, the palette appears/disappears without the scale/slide animation.
- [ ] Palette panel looks correct in both light and dark themes (readable text, visible selection highlight).

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: mount command palette and trigger in App"
```

---

## Self-Review Notes (author)

- **Spec coverage:** navigate any page (Task 4 Pages group) ✓; toggle theme (Task 4 Actions) ✓; open/close laptop Home-only (Task 4 conditional on `pathname === '/'`, backed by Task 2 store lift) ✓; Tab + arrows keyboard nav (Task 4 `onKeyDown` + cmdk `loop`) ✓; accessible/visible trigger (Task 4 trigger + Task 5 mount) ✓; cmdk build approach ✓; macOS-style styling ✓; out-of-scope items (3D `ScreenMenu` untouched) respected — `Macbook.tsx` change is state-source only.
- **Type consistency:** store hook is `useMacbookStore` with `{ mode, setMode, toggle }`; `useCommandStore` with `{ open, setOpen, toggle }`; `useCommandHotkey` exported and consumed by `CommandPalette`; all match across tasks.
- **No placeholders:** every code step contains complete, runnable code.
- **Risk note:** the Tab→arrow re-dispatch relies on cmdk forwarding the consumer `onKeyDown` before its internal handler and honouring `defaultPrevented` (true in cmdk v1). Task 5 Step 3 explicitly verifies Tab/Shift+Tab behaviour; if it regresses in a future cmdk version, the fallback is to control cmdk's selected `value` and compute next/previous from the visible `[cmdk-item]` nodes.
