import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation';
import cover from 'src/assets/digest-cover.jpg';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';

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

export const Digest = () => {
  return (
    <EnterAnimation>
      <Card title='Frontend Weekly News Digest'>
        <motion.img
          {...a(fadeInVariants)}
          src={cover}
          className='rounded-xl shadow-xl'
        />

        <motion.div
          className='mt-5 flex flex-col gap-5 md:flex-row'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            target='_blank'
            href='https://t.me/frontend_weekly_news_digest'
          >
            <FaTelegramPlane className='text-blue-500' /> Read on Telegram
          </a>
          <a
            className='flex items-center gap-2'
            target='_blank'
            href='https://www.linkedin.com/newsletters/7153365464419614725/'
          >
            <FaLinkedin className='text-blue-500' /> Read on LinkedIn
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
