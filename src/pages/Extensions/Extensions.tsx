import { Card } from 'src/components/Card';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';
import cover from 'src/assets/extensions-cover.jpg';
import { TbBrandVscode, TbBrandNpm } from 'react-icons/tb';

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
export const Extensions = () => {
  return (
    <EnterAnimation>
      <Card title='VSCode extensions'>
        <motion.img
          {...a(fadeInVariants)}
          className='mt-10 rounded-xl shadow-xl'
          src={cover}
        />

        <motion.div
          className='mt-5 flex w-full flex-col justify-start gap-2 text-lg'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.front-end-mega-extension-pack'
            rel='noreferrer'
            target='_blank'
          >
            <TbBrandVscode className='text-blue-500' /> Front-End Mega Extension Pack
          </a>
          <a
            className='flex items-center gap-2'
            href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.tailwind-mega-extension-pack'
            rel='noreferrer'
            target='_blank'
          >
            <TbBrandVscode className='text-blue-500' /> Tailwind Mega Extension Pack
          </a>
          <a
            className='flex items-center gap-2'
            href='https://www.npmjs.com/package/@egor.xyz/eslint-config'
            rel='noreferrer'
            target='_blank'
          >
            <TbBrandNpm className='text-red-400' /> ESLint configuration with hundreds of rules
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
