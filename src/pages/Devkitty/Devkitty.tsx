import { motion } from 'motion/react';
import { Card } from 'src/components/Card';
import { type A, a } from 'src/utils/a';

import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';

const fadeInVariants: A = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 1
    },
    y: 0
  },
  initial: {
    opacity: 0,
    scale: 0.4,
    y: 100
  }
};
export const Devkitty = () => (
  <EnterAnimation>
    <Card
      title='Devkitty'
      wide
    >
      <motion.div
        className='glass-scroll max-h-[calc(100svh-12rem)] min-h-0 w-full overflow-y-auto pb-2 text-left'
        {...a(fadeInVariants)}
      >
        <div className='rounded-2xl border border-white/20 bg-white/5 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-lg'>
          <img
            alt='Devkitty app showing repositories and GitHub activity'
            className='w-full rounded-xl shadow-xl'
            src='https://devkitty.app/images/demo-main.png'
          />
        </div>

        <h2 className='mt-5 font-bold text-2xl'>All your repos. One calm window.</h2>
        <p className='mt-2 text-base text-black/75 dark:text-white/80'>
          Devkitty puts your daily GitHub work in one macOS app.
        </p>

        <div className='mt-6 flex justify-center pb-2'>
          <a
            className='devkitty-cta inline-flex min-h-14 items-center rounded-xl px-8 font-semibold text-[15px] text-white transition-[filter,box-shadow] duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-white'
            href='https://devkitty.app/'
            rel='noopener noreferrer'
            target='_blank'
          >
            Visit Devkitty website
          </a>
        </div>
      </motion.div>
    </Card>
  </EnterAnimation>
);
