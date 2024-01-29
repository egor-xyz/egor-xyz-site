import { MotionProps, Variants, motion } from 'framer-motion';
import { FC, Fragment } from 'react';

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
      duration: 2
    }
  }
};

export const EnterAnimation: FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <Fragment>
      <motion.div
        {...a(slide)}
        className='fixed left-0 h-[100vh] w-[100vw] bg-red-700'
      ></motion.div>

      {children}
    </Fragment>
  );
};
