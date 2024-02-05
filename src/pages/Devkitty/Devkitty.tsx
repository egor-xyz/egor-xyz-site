import { Card } from 'src/components/Card';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';
import cover from 'src/assets/devkitty-cover.jpg';

import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';

const fadeInVariants: Variants = {
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
export const Devkitty = () => {
  return (
    <EnterAnimation>
      <Card title='Devkitty'>
        <motion.img
          {...a(fadeInVariants)}
          className='rounded-xl shadow-xl'
          src={cover}
        />

        <motion.div
          className='mt-5 flex'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            href='https://devkitty.app/'
            rel='noreferrer'
target='_blank'
          >
            <span className='text-blue-500'>Devkitty</span> - Swiss army knife for developers
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
