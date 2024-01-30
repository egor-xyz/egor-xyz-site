import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Card } from 'src/components/Card';
import avatar from 'src/assets/egor.jpg';
import { FaLinkedin } from 'react-icons/fa';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';

const imageVariants: Variants = {
  initial: {
    y: 100,
    opacity: 0,
    scale: 0.4
  },
  enter: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.5
    }
  }
};

export const About = () => {
  return (
    <EnterAnimation>
      <Card title='About'>
        <motion.img
          {...a(imageVariants)}
          className='h-[200px] rounded-2xl bg-center object-cover shadow-md'
          src={avatar}
        />

        <motion.p
          {...a(imageVariants)}
          className='mt-5 text-center text-xl'
        >
          Hi!, My name is Egor <br />
          More about me:
        </motion.p>

        <motion.div
          {...a(imageVariants)}
          className='mt-3 flex flex-col'
        >
          <a
            className='flex items-center justify-center gap-2 text-blue-500'
            href='https://www.linkedin.com/in/egorxyz/'
            target='_blank'
          >
            <FaLinkedin />
            /egorxyz
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
