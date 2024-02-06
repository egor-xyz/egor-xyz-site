import { Variants, motion } from 'framer-motion';
import { a } from 'src/animations/a';
import Jet from 'src/assets/jet.svg?react';
import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

const fly: Variants = {
  enter: {
    bottom: '100%',
    left: '100%',
    opacity: 1,
    transition: {
      delay: 1,
      duration: 5
    }
  },
  initial: {
    bottom: 0,
    left: 0,
    opacity: 0
  }
};

export const Home = () => {
  return (
    <section className='relative mx-auto mt-[60px] w-[100%] max-w-5xl overflow-hidden p-14 pl-[20px] md:ml-[300px] md:mt-[80px] md:pl-[4px] '>
      <motion.div
        className='fixed h-20'
        {...a(fly)}
      >
        <Jet className='fixed h-20' />
      </motion.div>

      {menuItems.map(({ heading, href, imgSrc, subheading }, key) => (
        <MenuItem
          heading={heading}
          href={href}
          imgSrc={imgSrc}
          index={key}
          key={key}
          subheading={subheading}
        />
      ))}
    </section>
  );
};
