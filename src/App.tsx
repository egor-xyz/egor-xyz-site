import { Variants, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Router } from './Router';
import Logo from './assets/logo.svg?react';
import { TopMenu } from './components/TopMenu';
import { useStore } from './useStore';
import { Clippy } from './components/Clippy';
// @ts-expect-error - Typings are missing
import Gradient from './utils/gradient';

const variants: Variants = {
  enter: {
    opacity: 1,
    rotate: 0,
    scale: 1
  },
  header: {
    left: 15,
    opacity: 1,
    originX: 0,
    originY: 0,
    scale: 0.4,
    top: 15
  },
  initial: {
    opacity: 0,
    rotate: 180,
    scale: 0.3
  }
};

const gradient = new Gradient();

export const App = () => {
  const [scope, animate] = useAnimate();
  const location = useLocation();
  const { loaded } = useStore();

  const animateLogo = async (full: boolean) => {
    useStore.setState({ loaded: true });

    if (!full) {
      await animate(scope.current, variants.header, { duration: 0 });
      return;
    }

    await animate(scope.current, variants.initial);
    await animate(scope.current, variants.enter, { duration: 1.3 });
    await animate(scope.current, variants.header, { duration: 0.7 });
  };

  useEffect(() => {
    gradient.initGradient('#gradient-canvas');

    !loaded && animateLogo(location.pathname === '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex h-[100svh] items-center justify-center overflow-hidden text-white'>
      <canvas
        data-transition-in
        id='gradient-canvas'
      />

      <Router />

      <TopMenu />

      <Link
        className='fixed z-10 mt-[27px] scale-[.1] cursor-pointer opacity-0 md:mt-0'
        ref={scope}
        to='/'
      >
        <Logo className='h-auto w-[200px] md:w-auto' />
      </Link>

      <Clippy />
    </div>
  );
};
