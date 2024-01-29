import { Variants, motion } from 'framer-motion';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Link } from 'react-router-dom';

const pageFadeIn: Variants = {
  initial: {
    opacity: 0,
    y: 100
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const About = () => {
  return (
    <EnterAnimation>
      <motion.div
        className='relative p-2'
        variants={pageFadeIn}
      >
        <Link
          to='/me'
          className='text-xl '
        >
          double card rabbit closely about sense dance fourth from rays baby stomach lose slightly foreign poem tail
          family why moving duck compass rising such
        </Link>
      </motion.div>
    </EnterAnimation>
  );
};
