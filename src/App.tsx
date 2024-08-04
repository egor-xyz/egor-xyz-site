import { Variants, useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clippy from 'clippyts';

import { Router } from './Router';
import Logo from './assets/logo.svg?react';
import { TopMenu } from './components/TopMenu';
import { useStore } from './useStore';
// @ts-expect-error - Typings are missing
import Gradient from './utils/gradient';
import { useKonami } from './hooks/useKonami';

const variants: Variants = {
  header: {
    left: 15,
    opacity: 1,
    originX: 0,
    originY: 0,
    scale: 0.4,
    top: 15
  },
  start: {
    opacity: [0, 1],
    rotate: [180, 0],
    scale: [0.3, 1]
  }
};

const gradient = new Gradient();

export const App = () => {
  const isKonami = useKonami();
  const [scope, animate] = useAnimate();
  const location = useLocation();
  const { loaded } = useStore();
  const clippyLoaded = useRef(false);

  const animateLogo = async (full: boolean) => {
    useStore.setState({ loaded: true });

    if (!full) {
      await animate(scope.current, variants.header, { duration: 0 });
      return;
    }

    await animate(scope.current, variants.start, { duration: 1.3 });
    await animate(scope.current, variants.header, { duration: 0.7 });
  };

  const loadClippy = () => {
    if (clippyLoaded.current) {
      return;
    }

    clippy.load({
      failCb: () => {
        console.log('Clippy failed to load');
      },
      name: 'Links',
      selector: '#clippy',
      successCb: (agent) => {
        if (clippyLoaded.current) return;
        clippyLoaded.current = true;

        console.log('Clippy loaded');

        console.log('agent', agent);
        // @ts-expect-error - Typings are missing
        agent.show();
        // agent.speak('Hello, I am Clippy!', false);
        agent.animate();
        console.log(agent.animations());
      }
    });
  };

  useEffect(() => {
    gradient.initGradient('#gradient-canvas');

    !loaded && animateLogo(location.pathname === '/');

    loadClippy();
  }, []);

  isKonami && console.log(isKonami);

  return (
    <div className='relative flex min-h-[100svh] items-center justify-center text-white'>
      <canvas
        data-transition-in
        id='gradient-canvas'
      />

      <Router />

      <TopMenu />

      <Link
        className='fixed mt-[27px] cursor-pointer opacity-0 md:mt-0'
        ref={scope}
        to='/'
      >
        <Logo className='h-auto w-[200px] md:w-auto' />
      </Link>

      <div id='clippy' />
    </div>
  );
};
