import { A, a } from 'src/utils/a';
import { motion } from 'framer-motion';
import { FC } from 'react';

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
    <motion.div
      className='relative'
      {...a(perspective)}
    >
      {children}
    </motion.div>
  );
};
