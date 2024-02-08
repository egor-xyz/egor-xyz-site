/* eslint-disable react/jsx-max-depth */
import { Card } from 'src/components/Card';
import avatar from 'src/assets/egor.jpg';
import { FaLinkedin } from 'react-icons/fa';
import { motion, useAnimate, Variants } from 'framer-motion';
import { a, A } from 'src/utils/a';
import Cloud from 'src/assets/cloud.svg?react';
import { useEffect } from 'react';

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

const cloudAnimation: Variants = {
  enter: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: {
      duration: 0.3
    }
  },
  fly: {
    opacity: 1,
    x: -40,
    y: 80
  },
  initial: {
    opacity: 0,
    scale: 0.2
  }
};

export const About = () => {
  const [scope, animate] = useAnimate();

  const animateCloud = async () => {
    await animate(scope.current, cloudAnimation.initial);
    await animate(scope.current, cloudAnimation.enter, { delay: 1, duration: 2 });
    await animate(scope.current, cloudAnimation.fly, {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse'
    });
  };

  useEffect(() => {
    animateCloud();
  }, []);

  return (
    <EnterAnimation>
      <div className='relative'>
        <motion.div
          className='absolute bottom-[130%] right-[-10px] scale-[.2] opacity-0'
          exit='exit'
          ref={scope}
          variants={cloudAnimation}
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
};
