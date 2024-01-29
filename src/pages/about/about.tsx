import { motion } from 'framer-motion';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';

export const About = () => {
  return (
    <EnterAnimation>
      <motion.div
        className='relative p-2'
        animate={{
          opacity: [0, 1],
          y: [100, 0],
          transition: {
            duration: 2
          }
        }}
      >
        <Link
          to='/me'
          className='text-xl '
        >
          To me
        </Link>
      </motion.div>
    </EnterAnimation>
  );
};
