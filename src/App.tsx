import { Variants, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import Logo from './assets/logo.svg?react';
import { BubbleText } from './components/BubbleText';
import { Menu } from './components/Menu';

const variants: Variants = {
  start: {
    scale: [0, 1],
    rotate: [180, 0],
    opacity: [0, 1]
  },
  top: {
    opacity: 1,
    left: 15,
    top: 15,
    scale: 0.4,
    transformOrigin: 'top left'
  }
};

export const App = () => {
  const [scope, animate] = useAnimate();

  const animateLogo = async () => {
    await animate(scope.current, variants.start, { duration: 1.3 });
    await animate(scope.current, variants.top, { duration: 0.7 });
  };

  useEffect(() => {
    animateLogo();
  }, []);

  return (
    <div className='text-100px relative flex min-h-[100svh] items-center justify-center bg-black bg-gradient-to-t from-blue-600 to-red-500 text-white'>
      <Menu />
      <div
        ref={scope}
        className='absolute cursor-pointer opacity-0'
      >
        <Logo />
      </div>
    </div>
  );
};
