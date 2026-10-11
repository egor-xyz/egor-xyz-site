import { SiRaycast } from 'react-icons/si';
import MarketLogo from 'src/assets/fmep-logo.svg?react';
import TailwindPackLogo from 'src/assets/tailwind-pack-logo.svg?react';
import { Card } from 'src/components/Card';
import { EnterAnimation } from 'src/components/EnterAnimation';
import { ProductCard } from 'src/components/ProductCard';
import { RobotIcon } from 'src/components/RobotIcon';

export const Extensions = () => (
  <EnterAnimation>
    <Card title='Extensions'>
      <div className='glass-scroll flex max-h-[calc(100svh-20rem)] min-h-0 w-full flex-col overflow-y-auto pb-4 min-[642px]:max-h-[calc(100svh-8rem)] min-[642px]:pb-0'>
        <ProductCard
          description='An animated robot for Claude Code and the terminal'
          href='https://egor-xyz.github.io/robot/'
          customIcon={<RobotIcon />}
          text='robot'
        />

        <div className='my-2 h-[1px] w-full shrink-0 bg-white/30' />

        <ProductCard
          description='Raycast menu bar controls for music and audio devices'
          href='https://github.com/egor-xyz/raycast-media-flow'
          Icon={SiRaycast}
          text='MediaFlow for Raycast'
        />

        <div className='my-2 h-[1px] w-full shrink-0 bg-white/30' />

        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Front End developer'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.front-end-mega-extension-pack'
          Icon={MarketLogo}
          text='VSCode Frontend Mega Extension Pack'
        />

        <div className='my-2 h-[1px] w-full shrink-0 bg-white/30' />

        <ProductCard
          description='Make your Visual Studio Code the best IDE for the Tailwind framework'
          href='https://marketplace.visualstudio.com/items?itemName=egor-xyz.tailwind-mega-extension-pack'
          Icon={TailwindPackLogo}
          text='VSCode Tailwind Mega Extension Pack'
        />
      </div>
    </Card>
  </EnterAnimation>
);
