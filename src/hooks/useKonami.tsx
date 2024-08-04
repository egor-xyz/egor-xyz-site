import { useCallback, useEffect, useRef, useState } from 'react';
import clippy, { Agent } from 'clippyts';

const konami = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

export const useKonami = (selector: string) => {
  const keys = useRef<string>('');
  const [isKonami, setIsKonami] = useState(false);

  const clippyAgent = useRef<Agent>();

  const loadClippy = () => {
    if (clippyAgent.current) {
      return;
    }

    clippy.load({
      failCb: (e) => {
        console.log('Clippy failed to load', e);
      },
      name: 'Links',
      selector,
      successCb: (agent) => {
        if (clippyAgent.current) return;
        clippyAgent.current = agent;

        agent.show(false);
        agent.speak('Hi Konami fan!', false);
        agent.speak('You found me!', false);
        agent.play('Congratulate');

        document.body.addEventListener('click', () => {
          agent.animate();
        });
      }
    });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        keys.current = '';
        setIsKonami(false);
        clippyAgent.current?.hide(false, () => {});
        return;
      }

      keys.current = keys.current + e.key;

      if (keys.current.length > konami.length) {
        keys.current = '';
        return;
      }

      if (keys.current === konami) {
        loadClippy();
        keys.current = '';
      }
    },
    [keys, isKonami]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
