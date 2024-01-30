import { Card } from 'src/components/Card';
import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';
import cover from 'src/assets/extensions-cover.jpg';
import { TbBrandVscode } from 'react-icons/tb';

const fadeInVariants: Variants = {
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
export const Extensions = () => {
  return (
    <EnterAnimation>
      <Card title='VSCode extensions'>
        <motion.img
          {...a(fadeInVariants)}
          src={cover}
          className='rounded-xl shadow-xl'
        />

        <motion.div
          className='mt-5 flex w-full flex-col justify-start gap-2'
          {...a(fadeInVariants)}
        >
          <a
            className='flex items-center gap-2'
            target='_blank'
            href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.front-end-mega-extension-pack'
          >
            <TbBrandVscode className='text-blue-500' /> Front-End Mega Extension Pack
          </a>
          <a
            className='flex items-center gap-2'
            target='_blank'
            href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.tailwind-mega-extension-pack'
          >
            <TbBrandVscode className='text-blue-500' /> Tailwind Mega Extension Pack
          </a>
        </motion.div>
      </Card>
    </EnterAnimation>
  );
};
