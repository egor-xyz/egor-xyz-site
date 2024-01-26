import { useState } from 'react';
import Logo from './assets/logo.svg?react';
import { motion, Variants } from 'framer-motion';

const variants: Variants = {
  start: {
    scale: [0, 1],
    rotate: [0, 360, 0],
    opacity: [0, 1],
    transition: { duration: 2 }
  },
  top: {
    opacity: 1,
    left: '5px',
    top: '5px',
    scale: 0.4,
    transformOrigin: 'top left',
    transition: { duration: 0.7 }
  }
};

export const App = () => {
  const [logoVariant, setLogoVariant] = useState<'start' | 'top'>('start');
  const toggleLogo = () => setLogoVariant('top');

  return (
    <div className='text-100px relative flex min-h-[100svh] items-center justify-center bg-black bg-gradient-to-t from-blue-600 to-red-500 text-white'>
      <motion.div
        className='absolute opacity-0'
        animate={logoVariant}
        variants={variants}
        onClick={toggleLogo}
      >
        <Logo />
      </motion.div>
    </div>
  );
};
