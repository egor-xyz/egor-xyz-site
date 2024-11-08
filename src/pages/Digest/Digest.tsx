/* eslint-disable react/jsx-max-depth */
import { motion } from 'framer-motion';
import { FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import cover from 'src/assets/digest-cover.jpg';
import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation';
import { a, A } from 'src/utils/a';
import Deer from 'src/assets/deer.svg?react';

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

const deerAnimation: A = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 1,
      duration: 1
    },
    x: 0
  },
  initial: {
    opacity: 0,
    scale: 0.3,
    transformOrigin: 'bottom center',
    x: -10
  }
};

export const Digest = () => {
  return (
    <EnterAnimation>
      <div className='relative'>
        <motion.div
          className='absolute -right-5 bottom-[99.4%] z-10'
          {...a(deerAnimation)}
        >
          <Deer className='h-[150px]' />
        </motion.div>

        <Card title='Frontend Weekly News Digest'>
          <motion.img
            {...a(fadeInVariants)}
            className='rounded-xl shadow-xl'
            src={cover}
          />

          <motion.div
            className='mt-2 flex flex-row gap-6 text-xl'
            {...a(fadeInVariants)}
          >
            <a
              className='flex items-center gap-1'
              href='https://www.linkedin.com/newsletters/7153365464419614725/'
              rel='noreferrer'
              target='_blank'
            >
              <FaLinkedin className='text-blue-600' />
              <span className='drop-shadow'>LinkedIn</span>
            </a>

            <a
              className='flex items-center gap-1'
              href='https://t.me/frontend_weekly_news_digest'
              rel='noreferrer'
              target='_blank'
            >
              <FaTelegramPlane className='text-blue-600' />
              <span className='drop-shadow'>Telegram</span>
            </a>
          </motion.div>
        </Card>
      </div>
    </EnterAnimation>
  );
};
