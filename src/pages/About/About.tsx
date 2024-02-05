import { Card } from 'src/components/Card';
import avatar from 'src/assets/egor.jpg';
import { FaLinkedin } from 'react-icons/fa';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';

import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';

const fadeInVariants: Variants = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 1
    },
    y: 0
  },
  initial: {
    opacity: 0,
    scale: 0.4,
    y: 100
  }
};

export const About = () => {
  return (
    <EnterAnimation>
      <Card title='About'>
        <motion.img
          {...a(fadeInVariants)}
          className='h-[200px] rounded-2xl bg-center object-cover shadow-md'
          src={avatar}
        />

        <motion.p
          {...a(fadeInVariants)}
          className='mt-5 text-xl text-center'
        >
          Hi!, My name is Egor <br />
          More about me:
        </motion.p>

        <motion.div
          {...a(fadeInVariants)}
          className='flex flex-col mt-3'
        >
          <a
            className='flex items-center justify-center gap-2 text-blue-500'
            href='https://www.linkedin.com/in/egorxyz/'
            rel='noreferrer'
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
