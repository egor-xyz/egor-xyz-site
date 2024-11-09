import { motion, useMotionValue } from 'framer-motion';
import { FC, useRef } from 'react';
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

export const MenuItem: FC<Props> = ({ heading, subheading, href, index }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const { loaded } = useStore();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  const delay = !loaded ? 1.5 + index * 0.3 : index * 0.3;

  return (
    <MLink
      animate='enter'
      className='group relative flex max-w-[340px] items-center justify-between py-4 transition-colors duration-500 md:py-8'
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
              className='inline-block drop-shadow'
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

        <span className='text-white-500 relative z-10 mt-2 block text-base drop-shadow transition-colors duration-500 group-hover:text-neutral-50'>
          {subheading}
        </span>
      </div>
    </MLink>
  );
};
