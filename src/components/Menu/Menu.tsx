import { Variants, motion } from 'framer-motion';
import { Link } from '../Link';

const menuItems = [
  {
    heading: 'About',
    subheading: 'Learn what we do here',
    imgSrc: 'https://placedog.net/640/480?random&1',
    href: '/'
  },
  {
    heading: 'Clients',
    subheading: 'We work with great people',
    imgSrc: 'https://placedog.net/640/480?random&2',
    href: '/'
  },
  {
    heading: 'Portfolio',
    subheading: 'Our work speaks for itself',
    imgSrc: 'https://placedog.net/640/480?random&3',
    href: '/'
  },
  {
    heading: 'Careers',
    subheading: 'We want cool people',
    imgSrc: 'https://placedog.net/640/480?random&4',
    href: '/'
  },
  {
    heading: 'Fun',
    subheading: "Incase you're bored",
    imgSrc: 'https://placedog.net/640/480?random&5',
    href: '/'
  }
];

const menuVariants: Variants = {
  initial: {
    pointerEvents: 'none'
  },
  enter: {
    pointerEvents: 'initial',
    opacity: [0, 1],
    transition: {
      delay: 2,
      when: 'beforeChildren',
      duration: 3
    }
  }
};

export const Menu = () => {
  return (
    <motion.section
      className='mx-auto mt-[120px]  w-[100%] max-w-5xl p-4 pl-[240px] lg:pl-4'
      initial='initial'
      animate='enter'
      variants={menuVariants}
    >
      {menuItems.map(({ heading, href, imgSrc, subheading }, key) => (
        <Link
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
