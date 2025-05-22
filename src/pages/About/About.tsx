import { motion, useAnimate, usePresence, type Variants } from 'motion/react';
import { useEffect } from 'react';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import Cloud from 'src/assets/cloud.svg?react';
import avatar from 'src/assets/egor.jpg';
import { Card } from 'src/components/Card';
import { useThemeStore } from 'src/store/themeStore';
import { type A, a } from 'src/utils/a';
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
    scale: 0,
    transition: {
      duration: 0.3
    }
  },
  fly: {
    x: -40,
    y: 180
  },
  initial: {
    opacity: 0,
    scale: 0
  }
};

export const About = () => {
  const [scope, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();
  const { theme } = useThemeStore();

  const links = [
    {
      className: theme === 'dark' ? 'text-white' : 'text-black',
      href: 'https://www.linkedin.com/in/egorxyz/',
      Icon: FaLinkedin,
      text: 'LinkedIn'
    },
    {
      className: theme === 'dark' ? 'text-white' : 'text-black',
      href: 'https://github.com/egor-xyz',
      Icon: FaGithub,
      text: 'GitHub'
    },
    {
      className: theme === 'dark' ? 'text-white' : 'text-black',
      href: 'https://egor-xyz.medium.com/',
      Icon: FaMedium,
      text: 'Medium'
    }
  ];

  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await animate(scope.current, cloudAnimation.initial);
        await animate(scope.current, cloudAnimation.enter, {
          duration: 2
        });
        await animate(scope.current, cloudAnimation.fly, {
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse'
        });
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        await animate(scope.current, cloudAnimation.exit, {
          duration: 1
        });
        safeToRemove();
      };

      exitAnimation();
    }
  }, [animate, isPresent, safeToRemove, scope]);

  return (
    <EnterAnimation>
      <div
        aria-hidden='true'
        className='absolute right-[-10px] bottom-[130%] opacity-10'
        ref={scope}
      >
        <Cloud className='h-[60px] w-[120px] md:h-[100px] md:w-[200px]' />
      </div>

      <Card title='About'>
        <motion.img
          {...a(fadeInVariants)}
          alt="Egor's portrait"
          className='h-[200px] rounded-2xl bg-center object-cover shadow-md'
          src={avatar}
        />

        <motion.p
          {...a(fadeInVariants)}
          // add text shadow
          className='text-center text-xl drop-shadow-sm'
        >
          Hi!, My name is Egor
        </motion.p>

        <motion.div
          {...a(fadeInVariants)}
          className='flex flex-row flex-wrap items-center justify-center gap-2 text-sm md:gap-5 md:text-xl'
        >
          {links.map(({ className, href, Icon, text }, index) => (
            <a
              className={cn('flex items-center justify-center gap-2 drop-shadow-sm', className)}
              href={href}
              key={index}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Icon aria-hidden='true' />
              {text}
            </a>
          ))}
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
