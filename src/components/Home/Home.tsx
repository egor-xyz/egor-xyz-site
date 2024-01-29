import { Variants, motion } from 'framer-motion';
import { MenuItem } from '../MenuItem';

const menuItems = [
  {
    heading: 'About',
    subheading: 'Links and contacts',
    imgSrc: 'https://placedog.net/640/480?random&1',
    href: '/about'
  },
  {
    heading: 'Digest',
    subheading: 'Your weekly dose of front-end news',
    imgSrc: 'https://placedog.net/640/480?random&4',
    href: '/'
  },
  {
    heading: 'Extensions',
    subheading: 'My extension packs',
    imgSrc: 'https://placedog.net/640/480?random&3',
    href: '/'
  },
  {
    heading: 'Devkitty',
    subheading: 'Swiss army knife for developers',
    imgSrc: 'https://placedog.net/640/480?random&2',
    href: '/'
  }

  // {
  //   heading: 'Fun',
  //   subheading: "Incase you're bored",
  //   imgSrc: 'https://placedog.net/640/480?random&5',
  //   href: '/'
  // }
];

const menuVariants: Variants = {
  initial: {
    pointerEvents: 'none',
    opacity: 0,
    transition: {
      staggerChildren: 0.3
    }
  },
  enter: {
    pointerEvents: 'initial',
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export const Home = () => {
  return (
    <motion.section
      className='relative mx-auto  mt-[80px] w-[100%] max-w-5xl overflow-hidden p-14 pl-[240px] lg:pl-4'
      initial='initial'
      animate='enter'
      variants={menuVariants}
    >
      {menuItems.map(({ heading, href, imgSrc, subheading }, key) => (
        <MenuItem
          index={key}
          key={key}
          heading={heading}
          subheading={subheading}
          imgSrc={imgSrc}
          href={href}
        />
      ))}
    </motion.section>
  );
};
