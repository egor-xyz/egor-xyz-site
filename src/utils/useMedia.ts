import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * Tracks a CSS media query and returns whether it currently matches.
 * Drop-in replacement for react-use's `useMedia`.
 */
export const useMedia = (query: string, defaultState = false) => {
  const mql = useMemo(() => window.matchMedia(query), [query]);

  const subscribe = useCallback(
    (callback: () => void) => {
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [mql]
  );

  return useSyncExternalStore(
    subscribe,
    () => mql.matches,
    () => defaultState
  );
};
