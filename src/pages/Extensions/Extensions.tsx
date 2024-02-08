import { Variants, motion } from 'framer-motion';
import { TbBrandNpm } from 'react-icons/tb';
import FMEPLogo from 'src/assets/fmep-logo.svg?react';
import TailwindPackLogo from 'src/assets/tailwind-pack-logo.svg?react';
import { ProductCard } from 'src/components/ProductCard';
import { a } from 'src/utils/a';

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
      <motion.div
        className='relative mt-5 flex w-full flex-col justify-start gap-8 text-lg'
        {...a(fadeInVariants)}
      >
        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Front End developer'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.front-end-mega-extension-pack'
          Icon={FMEPLogo}
          text='VSCode Front-End Mega Extension Pack'
        />

        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Tailwind framework'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.tailwind-mega-extension-pack'
          Icon={TailwindPackLogo}
          text='VSCode Tailwind Mega Extension Pack'
        />

        <ProductCard
          description='Ensure your ESLint configurations with the highest coding standards'
          href='https://www.npmjs.com/package/@egor.xyz/eslint-config'
          Icon={TbBrandNpm}
          text='ESLint configuration with hundreds of rules'
        />
      </motion.div>
    </EnterAnimation>
  );
};
