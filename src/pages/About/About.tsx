/* eslint-disable react/jsx-max-depth */
import { Variants, motion, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import Cloud from 'src/assets/cloud.svg?react';
import avatar from 'src/assets/egor.jpg';
import { Card } from 'src/components/Card';
import { A, a } from 'src/utils/a';
import { cn } from 'src/utils/cn';

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

const links = [
  {
    className: 'text-[#0967c3]',
    href: 'https://www.linkedin.com/in/egorxyz/',
    Icon: FaLinkedin,
    text: 'LinkedIn'
  },
  {
    className: 'text-black',
    href: 'https://github.com/egor-xyz',
    Icon: FaGithub,
    text: 'GitHub'
  },
  {
    className: 'text-black',
    href: 'https://egor-xyz.medium.com/',
    Icon: FaMedium,
    text: 'Medium'
  }
];

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
            className='text-center text-xl '
          >
            Hi!, My name is Egor
          </motion.p>

          <motion.div
            {...a(fadeInVariants)}
            className='flex flex-row flex-wrap items-center justify-center gap-2 text-sm md:gap-5 md:text-xl'
          >
            {links.map(({ Icon, className, href, text }, key) => (
              <a
                className={cn('flex items-center justify-center gap-2', className)}
                href={href}
                key={key}
                rel='noreferrer'
                target='_blank'
              >
                <Icon />
                {text}
              </a>
            ))}
          </motion.div>
        </Card>
      </div>
    </EnterAnimation>
  );
};
