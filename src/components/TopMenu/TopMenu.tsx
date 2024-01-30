import { Variants, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { a } from 'src/animations/a';
import { menuItems } from 'src/utils/menuItems';

const fadeIn: Variants = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 1
    }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 1
    }
  }
};

const itemAnimations: Variants = {
  initial: {
    y: -100,
    opacity: 0
  },
  enter: (i) => ({
    y: 0,
    opacity: 1,
    borderBottom: '1px solid transparent',
    transition: {
      duration: 1,
      delay: i * 0.1
    }
  }),
  exit: (i) => ({
    y: -100,
    opacity: 0,
    transition: {
      duration: 1,
      delay: i * 0.1
    }
  })
};

const lineVariants: Variants = {
  initial: {
    width: '0',
    left: '50%'
  },
  active: {
    width: '100%',
    left: '0'
  }
};

export const TopMenu = () => {
  const { pathname } = useLocation();

  return (
    <motion.nav
      className='fixed top-2 text-white'
      {...a(fadeIn)}
      animate={pathname === '/' ? 'exit' : 'enter'}
    >
      <ul className='flex gap-4'>
        <motion.li
          key='home'
          variants={itemAnimations}
        >
          <Link to='/'>Home</Link>
        </motion.li>
        {menuItems.map(({ heading, href }, index) => (
          <motion.li
            key={heading}
            variants={itemAnimations}
            custom={index + 1}
          >
            <Link to={href}>{heading}</Link>
            <motion.div
              className='relative h-[1px] w-0 bg-white'
              variants={lineVariants}
              animate={pathname === href ? 'active' : 'initial'}
            />
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};
