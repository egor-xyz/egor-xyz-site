/* eslint-disable react/jsx-max-depth */
import { motion } from 'framer-motion';
import { FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import { A, a } from 'src/animations/a';
import cover from 'src/assets/digest-cover.jpg';
import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation';
import Drop from 'src/assets/drop-1.svg?react';
import Drop2 from 'src/assets/drop-2.svg?react';
import Drop3 from 'src/assets/drop-3.svg?react';

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

const dropAnimation: A = {
  enter: {
    opacity: 1,
    scale: [0, 2, 1],
    transition: {
      delay: 1.5,
      duration: 1,
      type: 'spring'
    }
  },
  initial: {
    opacity: 0,
    scale: 0.3,
    transformOrigin: 'center center'
  }
};

export const Digest = () => {
  return (
    <EnterAnimation>
      <Card title='Frontend Weekly News Digest'>
        <motion.img
          {...a(fadeInVariants)}
          className='rounded-xl shadow-xl'
          src={cover}
        />

        <motion.div
          className='mt-5 flex flex-col gap-5 md:flex-row'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            href='https://t.me/frontend_weekly_news_digest'
            rel='noreferrer'
            target='_blank'
          >
            <FaTelegramPlane className='text-blue-500' /> Read on Telegram
          </a>
          <a
            className='flex items-center gap-2'
            href='https://www.linkedin.com/newsletters/7153365464419614725/'
            rel='noreferrer'
            target='_blank'
          >
            <FaLinkedin className='text-blue-500' /> Read on LinkedIn
          </a>
        </motion.div>

        <motion.div
          {...a(dropAnimation)}
          className='pointer-events-none absolute bottom-2 right-2'
        >
          <Drop className='h-[90px]' />
        </motion.div>

        <motion.div
          {...a(dropAnimation)}
          className='pointer-events-none absolute bottom-5 left-2'
        >
          <Drop2 className='h-[90px]' />
        </motion.div>

        <motion.div
          {...a(dropAnimation)}
          className='pointer-events-none absolute right-3 top-6'
        >
          <Drop3 className='h-[90px]' />
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
