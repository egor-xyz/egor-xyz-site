import { motion } from 'motion/react';
import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation/EnterAnimation';
import { type A, a } from 'src/utils/a';

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

export const Articles = () => (
  <EnterAnimation>
    <Card title='Articles'>
      <motion.ul
        {...a(fadeInVariants)}
        className='flex flex-col gap-2'
      >
        <li>
          <a
            className='underline'
            href='#'
          >
            Article 1 (coming soon)
          </a>
        </li>

        <li>
          <a
            className='underline'
            href='#'
          >
            Article 2 (coming soon)
          </a>
        </li>

        <li>
          <a
            className='underline'
            href='#'
          >
            Article 3 (coming soon)
          </a>
        </li>
      </motion.ul>
    </Card>
  </EnterAnimation>
);
