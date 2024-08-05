import { TbBrandNpm } from 'react-icons/tb';
import FMEPLogo from 'src/assets/fmep-logo.svg?react';
import TailwindPackLogo from 'src/assets/tailwind-pack-logo.svg?react';
import { ProductCard } from 'src/components/ProductCard';
import { Card } from 'src/components/Card';

import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';

export const Extensions = () => {
  return (
    <EnterAnimation>
      <Card title='Extensions'>
        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Front End developer'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.front-end-mega-extension-pack'
          Icon={FMEPLogo}
          text='VSCode Front-End Mega Extension Pack'
        />

        <div className='my-2 h-[1px] w-full bg-white/30' />

        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Tailwind framework'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.tailwind-mega-extension-pack'
          Icon={TailwindPackLogo}
          text='VSCode Tailwind Mega Extension Pack'
        />

        <div className='my-2 h-[1px] w-full bg-white/30' />

        <ProductCard
          description='Ensure your ESLint configurations with the highest coding standards'
          href='https://www.npmjs.com/package/@egor.xyz/eslint-config'
          Icon={TbBrandNpm}
          text='ESLint configuration with hundreds of rules'
        />
      </Card>
    </EnterAnimation>
  );
};
