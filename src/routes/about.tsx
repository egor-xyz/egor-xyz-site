import { Link, createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { EnterAnimation } from '../components/EnterAnimation/EnterAnimation';

export const Route = createFileRoute('/about')({
  component: About
});

function About() {
  return (
    <EnterAnimation>
      <motion.div
        className='p-2'
        animate={{
          opacity: [0, 1],
          transition: {
            duration: 1
          }
        }}
      >
        <Link
          to='/me'
          className='text-xl'
        >
          To me
        </Link>
      </motion.div>
    </EnterAnimation>
  );
}
