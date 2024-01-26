import { motion } from 'framer-motion';
import { Link } from '../Link';

export const Menu = () => {
  return (
    <motion.section
      className='mt-[120px] w-[100%] bg-black p-4 pl-[240px] lg:pl-4'
      initial={{ pointerEvents: 'none' }}
      animate={{
        pointerEvents: 'initial',
        opacity: [0, 1],
        transition: {
          delay: 2,
          duration: 3
        }
      }}
    >
      <div className='mx-auto max-w-5xl'>
        <Link
          heading='About'
          subheading='Learn what we do here'
          imgSrc={'https://placedog.net/640/480?random&1'}
          href='/'
        />
        <Link
          heading='Clients'
          subheading='We work with great people'
          imgSrc={'https://placedog.net/640/480?random&2'}
          href='/'
        />
        <Link
          heading='Portfolio'
          subheading='Our work speaks for itself'
          imgSrc={'https://placedog.net/640/480?random&3'}
          href='/'
        />
        <Link
          heading='Careers'
          subheading='We want cool people'
          imgSrc={'https://placedog.net/640/480?random&4'}
          href='/'
        />
        <Link
          heading='Fun'
          subheading="Incase you're bored"
          imgSrc={'https://placedog.net/640/480?random&5'}
          href='/'
        />
      </div>
    </motion.section>
  );
};
