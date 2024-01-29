import { motion } from 'framer-motion';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Link } from 'react-router-dom';

export const Me = () => {
  return (
    <EnterAnimation>
      <motion.div
        className='relative p-2'
        animate={{
          opacity: [0, 1],
          y: [100, 0],
          transition: {
            duration: 0.5
          }
        }}
      >
        <Link
          to='/about'
          className='text-xl '
        >
          To about
        </Link>
      </motion.div>
    </EnterAnimation>
  );
};
