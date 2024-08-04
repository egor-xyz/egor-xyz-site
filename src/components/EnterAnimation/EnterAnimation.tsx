import { A, a } from 'src/utils/a';
import { motion } from 'framer-motion';
import { FC } from 'react';

const slide: A = {
  enter: {
    opacity: 0.3,
    top: '100vh'
  },
  exit: {
    opacity: 0,
    top: '0',
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.7, 1]
    }
  },
  initial: {
    top: '100vh'
  }
};

const perspective: A = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1]
    },
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    transition: {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1]
    },
    y: -200
  },
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 250
  }
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EnterAnimation: FC<Props> = ({ children }) => {
  return (
    <>
      <motion.div
        {...a(perspective)}
        className='y-[100px] opacity-0'
      >
        {children}
      </motion.div>

      <motion.div
        {...a(slide)}
        className='text-100px fixed left-0 flex h-[100vh] min-h-[100svh] w-[100vw] items-center justify-center bg-white text-lg text-white opacity-10'
      />
    </>
  );
};
