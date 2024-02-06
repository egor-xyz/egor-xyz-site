/* eslint-disable react/jsx-max-depth */
import { Card } from 'src/components/Card';
import avatar from 'src/assets/egor.jpg';
import { FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { a, A } from 'src/utils/a';
import Cloud from 'src/assets/cloud.svg?react';

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

const cloudAnimation: A = {
  enter: {
    opacity: 1,
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse'
    },
    x: -40,
    y: 80
  },
  exit: {
    opacity: 0
  },
  initial: {
    opacity: 1,
    x: 0
  }
};

export const About = () => (
  <EnterAnimation>
    <div className='relative'>
      <motion.div
        {...a(cloudAnimation)}
        className='absolute bottom-[130%] right-[-10px]'
      >
        <Cloud className='relative h-[60px] w-[120px] md:h-[100px] md:w-[200px]' />
      </motion.div>

      <Card title='About'>
        <motion.img
          {...a(fadeInVariants)}
          className='h-[200px] rounded-2xl bg-center object-cover shadow-md'
          src={avatar}
        />

        <motion.p
          {...a(fadeInVariants)}
          className='mt-5 text-center text-xl'
        >
          Hi!, My name is Egor <br />
          More about me:
        </motion.p>

        <motion.div
          {...a(fadeInVariants)}
          className='mt-3 flex flex-col'
        >
          <a
            className='flex items-center justify-center gap-2 text-blue-500'
            href='https://www.linkedin.com/in/egorxyz/'
            rel='noreferrer'
            target='_blank'
          >
            <FaLinkedin />
            /egorxyz
          </a>
        </motion.div>
      </Card>
    </div>
  </EnterAnimation>
);
