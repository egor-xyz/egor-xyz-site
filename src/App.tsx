import { Variants, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Router } from './Router';
import Logo from './assets/logo.svg?react';
import { TopMenu } from './components/TopMenu';
import { useStore } from './useStore';

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

    await animate(scope.current, variants.start, { duration: 1.3 });
    await animate(scope.current, variants.header, { duration: 0.7 });
  };

  useEffect(() => {
    !loaded && animateLogo(location.pathname === '/');
  }, []);

  return (
    <div className='relative flex min-h-[100svh] items-center justify-center bg-black bg-gradient-to-t from-blue-600 to-red-500 text-white'>
      <Router />

      <TopMenu />

      <Link
        className='fixed mt-[27px] cursor-pointer opacity-0 md:mt-0'
        ref={scope}
        to='/'
      >
        <Logo className='h-auto w-[200px] md:w-auto' />
      </Link>
    </div>
  );
};
