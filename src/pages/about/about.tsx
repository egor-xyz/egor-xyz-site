import { motion } from 'framer-motion';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <EnterAnimation>
      <motion.div
        className='relative p-2'
        animate={{
          opacity: [0, 1],
          y: [100, 0],
          transition: {
            delay: 0,
            duration: 0.5
          }
        }}
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
