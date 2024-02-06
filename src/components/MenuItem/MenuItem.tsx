import { Variants, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FC, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { A } from 'src/utils/a';
import { useStore } from 'src/useStore';

const MLink = motion(Link);

type Props = {
  heading: string;
  href: string;
  imgSrc: string;
  index: number;
  subheading: string;
};

const fadeInVariants: A = {
  enter: (i) => ({
    opacity: 1,
    transition: {
      delay: i,
      duration: 1
    },
    y: 0
  }),
  initial: {
    opacity: 0,
    y: 500
  }
};

const lineVariants: Variants = {
  initial: {
    transition: {
      duration: 2
    },
    width: '0%'
  },
  whileHover: {
    left: 0,
    transition: {
      duration: 1.3,
      type: 'spring'
    },
    width: '100%'
  }
};

export const MenuItem: FC<Props> = ({ heading, imgSrc, subheading, href, index }) => {
  const ref = useRef<HTMLElement | SVGElement>(null);
  const { loaded } = useStore();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%']);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '70%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const { width } = rect;
    const { height } = rect;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const delay = !loaded ? 2 + index * 0.3 : index * 0.3;

  return (
    <MLink
      animate='enter'
      className='group relative flex items-center justify-between py-4 transition-colors duration-500 md:py-8'
      custom={delay}
      initial='initial'
      ref={ref}
      to={href}
      variants={fadeInVariants}
      whileHover='whileHover'
      onMouseMove={handleMouseMove}
    >
      <div>
        <motion.span
          className='text-white-500 relative z-10 block text-4xl font-bold transition-colors duration-500 group-hover:text-neutral-50 md:text-6xl'
          transition={{
            delayChildren: 0.25,
            staggerChildren: 0.075,
            type: 'spring'
          }}
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 }
          }}
        >
          {heading.split('').map((l, i) => (
            <motion.span
              className='inline-block'
              key={i}
              transition={{ type: 'spring' }}
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 }
              }}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className='text-white-500 relative z-10 mt-2 block text-base transition-colors duration-500 group-hover:text-neutral-50'>
          {subheading}
        </span>
      </div>

      <div className='-z-1 absolute left-0 top-[100%] h-[2px] w-full bg-neutral-700' />
      <motion.div
        className='-z-1 absolute left-1/2 top-[100%] h-[2px] bg-white'
        variants={lineVariants}
      />

      <motion.img
        className='absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64'
        src={imgSrc}
        style={{
          left,
          top,
          translateX: '-50%',
          translateY: '-50%'
        }}
        transition={{ duration: 0.5, type: 'spring' }}
        variants={{
          initial: { rotate: '-12.5deg', scale: 0 },
          whileHover: { rotate: '12.5deg', scale: 1 }
        }}
      />

      <motion.div
        className='relative z-10 p-4'
        transition={{ type: 'spring' }}
        variants={{
          initial: {
            opacity: 0,
            x: '25%'
          },
          whileHover: {
            opacity: 1,
            x: '0%'
          }
        }}
      >
        <FiArrowRight className='text-5xl text-neutral-50' />
      </motion.div>
    </MLink>
  );
};
