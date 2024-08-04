import { useCallback, useEffect, useRef, useState } from 'react';

const konami = '38384040373937396665';

export const useKonami = () => {
  const keys = useRef<number[]>([]);
  const [isKonami, setIsKonami] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // reset on esc key
      if (e.keyCode === 27) {
        keys.current = [];
        isKonami && setIsKonami(false);
        return;
      }

      keys.current.push(e.keyCode);

      const key = keys.current.join('');

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
