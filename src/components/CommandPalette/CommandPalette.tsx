import { Command } from 'cmdk';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { LuLaptop, LuMoon, LuSun } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCommandStore } from 'src/store/commandStore';
import { useMacbookStore } from 'src/store/macbookStore';
import { useThemeStore } from 'src/store/themeStore';
import { menuItems } from 'src/utils/menuItems';
import { useCommandHotkey } from './useCommandHotkey';

const pages = [{ heading: 'Home', href: '/', subheading: 'Back to the start' }, ...menuItems];

const groupClass =
  '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-neutral-400 [&_[cmdk-group-heading]]:text-xs dark:[&_[cmdk-group-heading]]:text-white/40';

const navItemClass =
  'flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 outline-none data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10';

const actionItemClass =
  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 outline-none data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10';

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
      // Only restore focus if the previous element is still in the document —
      // navigation may have unmounted it.
      if (lastFocused.current && document.contains(lastFocused.current)) {
        lastFocused.current.focus();
      }
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
            aria-label='Command menu'
            aria-modal='true'
            className='w-full max-w-lg'
            exit={{ opacity: 0, scale: reduced ? 1 : 0.98, y: reduced ? 0 : -8 }}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.98, y: reduced ? 0 : -8 }}
            onClick={(event) => event.stopPropagation()}
            role='dialog'
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <Command
              className='overflow-hidden rounded-2xl bg-white/70 text-neutral-900 shadow-2xl ring-1 ring-black/10 backdrop-blur-xl backdrop-saturate-150 dark:bg-[#1c1c1e]/70 dark:text-white dark:ring-white/15'
              loop
              onKeyDown={onKeyDown}
            >
              <Command.Input
                className='w-full border-black/5 border-b bg-transparent px-5 py-4 text-base outline-none placeholder:text-neutral-400 dark:border-white/10 dark:placeholder:text-white/40'
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
                  className={groupClass}
                  heading='Actions'
                >
                  <Command.Item
                    className={actionItemClass}
                    onSelect={() => run(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                    value='theme toggle dark light mode appearance'
                  >
                    {theme === 'dark' ? <LuSun className='size-4 shrink-0' /> : <LuMoon className='size-4 shrink-0' />}
                    <span className='font-medium text-sm'>
                      {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    </span>
                  </Command.Item>

                  {pathname === '/' && (
                    <Command.Item
                      className={actionItemClass}
                      onSelect={() => run(toggleLaptop)}
                      value='laptop lid open close macbook'
                    >
                      <LuLaptop className='size-4 shrink-0' />
                      <span className='font-medium text-sm'>{mode === 'open' ? 'Close laptop' : 'Open laptop'}</span>
                    </Command.Item>
                  )}
                </Command.Group>

                <Command.Group
                  className={groupClass}
                  heading='Navigate'
                >
                  {pages.map(({ heading, href, subheading }) => (
                    <Command.Item
                      className={navItemClass}
                      key={href}
                      onSelect={() => run(() => navigate(href))}
                      value={`${heading} ${href} ${subheading}`}
                    >
                      <span className='font-medium text-sm'>{heading}</span>
                      <span className='text-neutral-500 text-xs dark:text-white/50'>{subheading}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
