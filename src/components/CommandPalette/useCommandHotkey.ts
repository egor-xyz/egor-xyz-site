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
