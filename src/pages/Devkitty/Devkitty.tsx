import { motion } from 'motion/react';
import cover from 'src/assets/devkitty-cover.jpg';
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
    <Card title='Devkitty'>
      <a
        className='w-full'
        href='https://devkitty.app/'
        rel='noreferrer'
        target='_blank'
      >
        <motion.img
          {...a(fadeInVariants)}
          className='rounded-xl shadow-xl'
          src={cover}
        />

        <motion.div
          className='mt-5 text-center drop-shadow-sm'
          {...a(fadeInVariants)}
        >
          Swiss army knife for developers
        </motion.div>
      </a>
    </Card>
  </EnterAnimation>
  );
