import { useRouter } from '@tanstack/react-router';
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
    top: '0',
    transition: {
      duration: 0.5
    }
  },
  enter: {
    top: '100vh',
    transition: {
      duration: 0.5
    }
  },
  exit: {
    top: '0',
    transition: {
      duration: 0.5
    }
  }
};

export const EnterAnimation: FC<{ children: JSX.Element }> = ({ children }) => {
  const { state } = useRouter();
  return (
    <Fragment key={state.location.href}>
      <motion.div
        {...a(slide)}
        className='fixed left-0 h-[100vh] w-[100vw] bg-red-700'
      ></motion.div>

      {children}
    </Fragment>
  );
};
