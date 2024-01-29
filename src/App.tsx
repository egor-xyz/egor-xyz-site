import { Variants, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import Logo from './assets/logo.svg?react';
import { Router } from './Router';

const variants: Variants = {
  start: {
    scale: [0, 1],
    rotate: [180, 0],
    opacity: [0, 1]
  },
  header: {
    opacity: 1,
    left: 15,
    top: 15,
    scale: 0.4,
    originX: 0,
    originY: 0
  }
};

export const App = () => {
  const [scope, animate] = useAnimate();

  const animateLogo = async (full: boolean) => {
    if (!full) {
      await animate(scope.current, variants.header, { duration: 0 });
      return;
    }
    await animate(scope.current, variants.start, { duration: 1.3 });
    await animate(scope.current, variants.header, { duration: 0.7 });
  };

  useEffect(() => {
    animateLogo(true);
  }, []);

  return (
    <>
      <div className='text-100px relative flex min-h-[100svh] items-center justify-center bg-black bg-gradient-to-t from-blue-600 to-red-500 text-white'>
        <Router />

        <div
          ref={scope}
          className='fixed cursor-pointer opacity-0'
        >
          <Logo />
        </div>
      </div>
    </>
  );
};
