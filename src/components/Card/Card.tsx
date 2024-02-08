import { FC } from 'react';
import { motion } from 'framer-motion';
import { A, a } from 'src/utils/a';

import { BubbleText } from '../BubbleText';

type Props = {
  children?: React.ReactNode;
  title?: string;
};

const MotionBubble = motion(BubbleText);

const titleAnimation: A = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 1,
      duration: 1,
      type: 'spring'
    },
    x: 0
  },
  initial: {
    opacity: 0,
    scale: 0.1,
    transformOrigin: 'left center',
    x: -100
  }
};

export const Card: FC<Props> = ({ children, title }) => {
  return (
    <div className='relative flex w-[600px] max-w-[90vw] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-white p-4 text-base text-black shadow-xl md:gap-3 md:p-4 md:text-2xl'>
      {title && (
        <MotionBubble
          {...a(titleAnimation)}
          className='w-full text-left text-base md:text-2xl'
          text={title}
        />
      )}
      {children}
    </div>
  );
};
