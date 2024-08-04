import { FC } from 'react';
import { motion } from 'framer-motion';
import { A, a } from 'src/utils/a';

type Props = {
  children?: React.ReactNode;
  title?: string;
};

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
    scale: 0.9,
    transformOrigin: 'left center',
    x: -100
  }
};

export const Card: FC<Props> = ({ children, title }) => {
  return (
    <div className='relative flex w-[600px] max-w-[90vw] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-base text-black shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md md:px-4 md:py-2 md:text-2xl'>
      {title && (
        <>
          <motion.h1
            {...a(titleAnimation)}
            className='w-full text-left text-base drop-shadow md:text-2xl'
          >
            {title}
          </motion.h1>
          <div className='mb-2 h-[1px] w-full bg-white/30' />
        </>
      )}
      {children}
    </div>
  );
};
