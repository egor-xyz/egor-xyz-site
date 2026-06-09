import { motion } from 'motion/react';
import { FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import cover from 'src/assets/digest-cover.jpg';
import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation';
import { Papers } from 'src/components/Papers/Papers';
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

export const Digest = () => (
  <EnterAnimation>
    <Papers />

    <div className='relative'>
      <Card title='Frontend Weekly News Digest'>
        <motion.img
          {...a(fadeInVariants)}
          alt='Digest cover'
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
            rel='noopener noreferrer'
            target='_blank'
          >
            <FaLinkedin
              aria-hidden='true'
              className='text-blue-600'
            />

            <span className='drop-shadow-sm'>LinkedIn</span>
          </a>

          <a
            className='flex items-center gap-1'
            href='https://t.me/frontend_weekly_news_digest'
            rel='noopener noreferrer'
            target='_blank'
          >
            <FaTelegramPlane
              aria-hidden='true'
              className='text-blue-600'
            />

            <span className='drop-shadow-sm'>Telegram</span>
          </a>
        </motion.div>
      </Card>
    </div>
  </EnterAnimation>
);
