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
    rotate: 0,
    scale: 1,
    transition: {
      delay: 1,
      duration: 1
    }
  },
  initial: {
    opacity: 0,
    rotate: -45,
    scale: 0.3,
    transformOrigin: 'bottom center'
  }
};

export const Digest = () => {
  return (
    <EnterAnimation>
      <div className='relative'>
        <motion.div
          className='absolute -right-5 bottom-[99.4%]'
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
            className='mt-5 flex flex-col gap-5 md:flex-row'
            {...a(fadeInVariants)}
          >
            <a
              className='flex items-center gap-2'
              href='https://t.me/frontend_weekly_news_digest'
              rel='noreferrer'
              target='_blank'
            >
              <FaTelegramPlane className='text-blue-600 drop-shadow' /> Read on Telegram
            </a>
            <a
              className='flex items-center gap-2'
              href='https://www.linkedin.com/newsletters/7153365464419614725/'
              rel='noreferrer'
              target='_blank'
            >
              <FaLinkedin className='text-blue-600 drop-shadow' /> Read on LinkedIn
            </a>
          </motion.div>
        </Card>
      </div>
    </EnterAnimation>
  );
};
