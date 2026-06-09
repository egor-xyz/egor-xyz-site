import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCommandStore } from 'src/store/commandStore';
import { menuItems } from 'src/utils/menuItems';

// Cross-site page order for ←/→ navigation: Home, then the main menu items.
const order = ['/', ...menuItems.map((item) => item.href)];

const isTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || !!el?.isContentEditable;
};

/**
 * Left / Right arrow keys step through the pages in main-menu order, looping at
 * the ends (…About → Home → Digest…). Ignored while the command palette is open,
 * while typing in a field, or when a modifier key is held.
 */
export const usePageArrows = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (useCommandStore.getState().open || isTyping()) return;

      const current = order.indexOf(pathname);
      const from = current === -1 ? 0 : current;
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = (from + step + order.length) % order.length;

      event.preventDefault();
      navigate(order[next]);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, pathname]);
};
