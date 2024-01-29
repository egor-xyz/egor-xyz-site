import { Variants, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { a } from 'src/animations/a';
import { menuItems } from 'src/utils/menuItems';

const fadeIn: Variants = {
  initial: {
    y: -100,
    opacity: 0
  },
  enter: {
    y: 0,
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

export const TopMenu = () => {
  const { pathname } = useLocation();

  return (
    <motion.nav
      className='fixed top-2 text-white'
      {...a(fadeIn)}
      animate={pathname === '/' ? 'exit' : 'enter'}
    >
      <ul className='flex gap-4'>
        <li key='home'>
          <Link to='/'>Home</Link>
        </li>
        {menuItems.map(({ heading, href }) => (
          <li key={heading}>
            <Link to={href}>{heading}</Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};
