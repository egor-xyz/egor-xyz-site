import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tracks a CSS media query and returns whether it currently matches.
 * Drop-in replacement for react-use's `useMedia`.
 */
export const useMedia = (query: string, defaultState = false) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => defaultState, [defaultState]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
