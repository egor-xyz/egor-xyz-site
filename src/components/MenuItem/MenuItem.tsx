import { Variants, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FC, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MLink = motion(Link);

type Props = {
  heading: string;
  imgSrc: string;
  subheading: string;
  index: number;
  href: string;
};

const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
    y: 500
  },
  enter: (i) => ({
    opacity: [0, 0.3, 1],
    y: [500, 500, 0],
    transition: {
      delay: 1.3 + i * 0.3,
      duration: 1
    }
  })
};

const lineVariants: Variants = {
  initial: {
    width: '0%',
    transition: {
      duration: 2
    }
  },
  whileHover: {
    left: 0,
    width: '100%',
    transition: {
      duration: 1.3,
      type: 'spring'
    }
  }
};

export const MenuItem: FC<Props> = ({ heading, imgSrc, subheading, href, index }) => {
  const ref = useRef<HTMLElement | SVGElement>(null);
  // is referer same domain

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%']);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '70%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <MLink
      to={href}
      custom={index}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial='initial'
      exit='initial'
      whileHover='whileHover'
      className='group relative flex items-center justify-between py-4 transition-colors duration-500 md:py-8'
      variants={fadeInVariants}
      animate='enter'
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 }
          }}
          transition={{
            type: 'spring',
            staggerChildren: 0.075,
            delayChildren: 0.25
          }}
          className='text-white-500 relative z-10 block text-4xl font-bold transition-colors duration-500 group-hover:text-neutral-50 md:text-6xl'
        >
          {heading.split('').map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 }
              }}
              transition={{ type: 'spring' }}
              className='inline-block'
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className='text-white-500 relative z-10 mt-2 block text-base transition-colors duration-500 group-hover:text-neutral-50'>
          {subheading}
        </span>
      </div>

      <div className='-z-1 absolute left-0 top-[100%] h-[2px] w-full bg-neutral-700'></div>
      <motion.div
        variants={lineVariants}
        className='-z-1 absolute left-1/2 top-[100%] h-[2px] bg-white'
      ></motion.div>

      <motion.img
        style={{
          top,
          left,
          translateX: '-50%',
          translateY: '-50%'
        }}
        variants={{
          initial: { scale: 0, rotate: '-12.5deg' },
          whileHover: { scale: 1, rotate: '12.5deg' }
        }}
        transition={{ duration: 0.5, type: 'spring' }}
        src={imgSrc}
        className='absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64'
      />

      <motion.div
        variants={{
          initial: {
            x: '25%',
            opacity: 0
          },
          whileHover: {
            x: '0%',
            opacity: 1
          }
        }}
        transition={{ type: 'spring' }}
        className='relative z-10 p-4'
      >
        <FiArrowRight className='text-5xl text-neutral-50' />
      </motion.div>
    </MLink>
  );
};
