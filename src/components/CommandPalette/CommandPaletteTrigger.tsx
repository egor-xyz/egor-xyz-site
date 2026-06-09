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
