import { Card } from 'src/components/Card';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';
import cover from 'src/assets/devkitty-cover.jpg';

const fadeInVariants: Variants = {
  initial: {
    y: 100,
    opacity: 0,
    scale: 0.4
  },
  enter: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.5
    }
  }
};
export const Devkitty = () => {
  return (
    <EnterAnimation>
      <Card title='Devkitty'>
        <motion.img
          {...a(fadeInVariants)}
          src={cover}
          className='rounded-xl shadow-xl'
        />

        <motion.div
          className='mt-5 flex'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            target='_blank'
            href='https://devkitty.app/'
          >
            Devkitty - Swiss army knife for developers
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
