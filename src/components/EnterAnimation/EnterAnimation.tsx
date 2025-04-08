import { motion } from 'motion/react';
import { type FC } from 'react';
import { type A, a } from 'src/utils/a';

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
  children: React.ReactNode;
};

export const EnterAnimation: FC<Props> = ({ children }) => (
  <motion.div
    className='relative'
    {...a(perspective)}
  >
    {children}
  </motion.div>
);
