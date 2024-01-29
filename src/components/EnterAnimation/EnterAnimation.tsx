import { MotionProps, Variants, motion } from 'framer-motion';
import { FC } from 'react';

const a = (variants: Variants): MotionProps => ({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants
});

const slide: Variants = {
  initial: {
    top: '100vh'
  },
  enter: {
    top: '100vh'
  },
  exit: {
    top: '0',
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

const perspective: Variants = {
  initial: {
    y: 0,
    scale: 1,
    opacity: 1
  },
  enter: {
    y: 0,
    scale: 1,
    opacity: 1
  },
  exit: {
    y: -100,
    scale: 0.9,
    opacity: 0.5,
    transition: {
      duration: 1.3,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

type Props = {
  children: JSX.Element;
};

export const EnterAnimation: FC<Props> = ({ children }) => {
  return (
    <>
      <motion.div {...a(perspective)}>{children}</motion.div>

      <motion.div
        {...a(slide)}
        className='text-100px fixed  left-0 flex  h-[100vh] min-h-[100svh] w-[100vw] items-center  justify-center  bg-black  bg-gradient-to-t from-blue-600 to-red-500 text-lg text-white '
      ></motion.div>
    </>
  );
};
