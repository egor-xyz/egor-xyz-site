import { MotionProps, Variants, motion } from 'framer-motion';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';

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

type Props = {
  children: JSX.Element;
};

export const EnterAnimation: FC<Props> = ({ children }) => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      {children}

      <motion.div
        {...a(slide)}
        className='fixed left-0 flex h-[100vh] w-[100vw] items-center justify-center bg-black text-lg text-white'
      >
        Redirecting
      </motion.div>
    </>
  );
};
