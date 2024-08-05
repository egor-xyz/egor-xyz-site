import { useCallback, useEffect, useRef, useState } from 'react';
import clippy, { Agent } from 'clippyts';
import { cn } from 'src/utils/cn';
import { motion } from 'framer-motion';
import { a, A } from 'src/utils/a';

const konami = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
const agents = ['Links', 'Clippy', 'Bonzi', 'F1', 'Genie', 'Genius', 'Merlin', 'Peedy', 'Rocky', 'Rover'] as const;
type Agents = (typeof agents)[number];

const actionsFadeIn: A = {
  enter: {
    opacity: 1,
    transition: {
      delay: 1,
      duration: 1,
      type: 'spring'
    },
    x: 0
  },
  initial: {
    opacity: 0,
    x: 100
  }
};

export const Clippy = () => {
  const keys = useRef<string>('');
  const [showActions, setShowActions] = useState(true);
  const [name, setName] = useState<Agents>('Links');

  const clippyAgent = useRef<Agent>();

  const animate = useCallback(() => {
    clippyAgent.current?.animate();
  }, []);

  const loadClippy = useCallback((name: Agents, greeting: boolean = true) => {
    document.body.removeEventListener('click', animate);
    clippyAgent.current?.stop();
    clippyAgent.current?.hide(false, () => {});
    clippyAgent.current = undefined;

    setName(name);

    clippy.load({
      failCb: (e) => {
        console.log('Clippy failed to load', e);
      },
      name,
      selector: '.clippy',
      successCb: (agent) => {
        if (clippyAgent.current) return;
        clippyAgent.current = agent;

        agent.show(false);

        if (greeting) {
          agent.speak('Hi Konami fan!', false);
          agent.speak('You found me!', false);
          agent.play('Congratulate');
        }

        document.body.addEventListener('click', animate);

        setShowActions(true);
      }
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        keys.current = '';
        return;
      }

      keys.current = keys.current + e.key;

      if (keys.current.length > konami.length) {
        keys.current = '';
        return;
      }

      if (keys.current === konami) {
        loadClippy(name);
        keys.current = '';
      }
    },
    [keys]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className='clippy' />

      {showActions && (
        <motion.div
          {...a(actionsFadeIn)}
          className='absolute bottom-3 right-3 flex min-w-[110px] flex-col items-start justify-center gap-1 overflow-hidden rounded-lg border border-white/30 bg-white/20 p-1 text-black shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md'
        >
          {agents.map((agent) => (
            <button
              className={cn(
                'w-full rounded-sm border border-white/30 p-1 text-center drop-shadow hover:border-white/50',
                agent === name && 'bg-white/30'
              )}
              key={agent}
              onClick={() => loadClippy(agent, false)}
            >
              {agent}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
};
