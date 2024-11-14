import { Variants, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useMedia } from 'react-use';
import { a } from 'src/utils/a';
import { menuItems } from 'src/utils/menuItems';

const fadeIn: Variants = {
  enter: {
    opacity: 1,
    transition: {
      duration: 1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1
    }
  },
  initial: {
    opacity: 0
  }
};

const itemAnimations: Variants = {
  enter: ({ i }) => ({
    borderBottom: '1px solid transparent',
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 1
    },
    y: 0
  }),
  exit: ({ i, isWide }) => ({
    opacity: 0,
    transition: {
      delay: i * 0.1,
      duration: 1
    },
    y: isWide ? -100 : 100
  }),
  initial: ({ isWide }) => ({
    opacity: 0,
    y: isWide ? -100 : 100
  })
};

const lineVariants: Variants = {
  active: {
    left: '0',
    width: '100%'
  },
  initial: {
    left: '50%',
    width: '0'
  }
};

export const TopMenu = () => {
  const { pathname } = useLocation();
  const isWide = useMedia('(min-width: 642px)');

  return (
    <motion.nav
      className='fixed bottom-5 h-fit text-white sm:top-2'
      {...a(fadeIn)}
      animate={pathname === '/' ? 'exit' : 'enter'}
      custom={isWide}
    >
      <ul className='flex gap-4'>
        <motion.li
          custom={{ i: 0, isWide }}
          key='home'
          variants={itemAnimations}
        >
          <Link to='/'>Home</Link>
        </motion.li>
        {menuItems.map(({ heading, href }, index) => (
          <motion.li
            custom={{ i: index + 1, isWide }}
            key={heading}
            variants={itemAnimations}
          >
            <Link to={href}>{heading}</Link>
            <motion.div
              animate={pathname === href ? 'active' : 'initial'}
              className='relative h-[1px] w-0 bg-white'
              variants={lineVariants}
            />
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};
