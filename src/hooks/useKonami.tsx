import { useCallback, useEffect, useRef, useState } from 'react';

const konami = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

export const useKonami = () => {
  const keys = useRef<string[]>([]);
  const [isKonami, setIsKonami] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log(e.key);
        keys.current = [];
        setIsKonami(false);
        return;
      }

      keys.current.push(e.key);

      const key = keys.current.join('');

      console.log(key);
      console.log(konami);

      if (key.length > konami.length) {
        keys.current = [];
        return;
      }

      if (key === konami) {
        setIsKonami(true);
        keys.current = [];
      }
    },
    [keys, isKonami]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return isKonami;
};
