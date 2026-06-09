import { motion, type Variants } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useMacbookStore } from 'src/store/macbookStore';
import { a } from 'src/utils/a';
import { menuItems } from 'src/utils/menuItems';
import { useMedia } from 'src/utils/useMedia';

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
  const settledClosed = useMacbookStore((state) => state.settledClosed);

  // On Home the nav hides behind the 3D hero — but once the user has closed the
  // laptop (and the close animation has finished) we surface it, like on every
  // other page. It never shows on first load because the flag only flips after
  // a user-triggered close completes.
  const showMenu = pathname !== '/' || settledClosed;

  return (
    <motion.nav
      className='fixed bottom-5 h-fit text-white sm:top-2'
      {...a(fadeIn)}
      animate={showMenu ? 'enter' : 'exit'}
      custom={isWide}
    >
      <ul className='flex gap-4'>
        <motion.li
          custom={{ i: 0, isWide }}
          key='home'
          variants={itemAnimations}
        >
          <Link to='/'>Home</Link>

          <motion.div
            animate={pathname === '/' ? 'active' : 'initial'}
            className='relative h-[1px] w-0 bg-white'
            variants={lineVariants}
          />
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
