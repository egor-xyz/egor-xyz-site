import { useAnimate, type Variants } from 'motion/react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from './assets/logo.svg?react';
import { Backgrounds } from './components/Backgrounds';
import { Clippy } from './components/Clippy';
import { TopMenu } from './components/TopMenu';
import { Router } from './Router';
import { useStore } from './useStore';

const variants: Variants = {
  enter: {
    opacity: 1,
    scale: 1
  },
  header: {
    left: 15,
    opacity: 1,
    originX: 0,
    originY: 0,
    scale: 0.5,
    top: 15
  },
  initial: {
    opacity: 0,
    scale: 1
  }
};

export const App = () => {
  const [scope, animate] = useAnimate();
  const location = useLocation();
  const { loaded } = useStore();

  const animateLogo = async (full: boolean) => {
    useStore.setState({ loaded: true });

    await animate(scope.current, variants.initial, { duration: 0 });

    if (!full) {
      await animate(scope.current, variants.header, { duration: 0 });
      return;
    }

    await animate(scope.current, variants.enter, { duration: 1 });
    await animate(scope.current, variants.header, { duration: 0.7 });
  };

  useEffect(() => {
    if (!loaded) {
      animateLogo(location.pathname === '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex h-[100svh] items-center justify-center overflow-hidden text-white'>
      <Backgrounds />
      <Router />
      <TopMenu />

      <Link
        className='fixed z-10 mt-[27px] cursor-pointer opacity-0 md:mt-0'
        ref={scope}
        to='/'
      >
        <Logo className='h-auto w-[200px] md:w-[250px]' />
      </Link>

      <Clippy />
    </div>
  );
};
