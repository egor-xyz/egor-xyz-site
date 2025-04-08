import { motion, useMotionValue } from 'motion/react';
import { type FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'src/useStore';
import { type A } from 'src/utils/a';

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
      delay: i + 0.6,
      duration: 1.3
    },
    y: 0
  }),
  initial: {
    opacity: 0.4,
    y: 1000
  }
};

export const MenuItem: FC<Props> = ({ heading, href, index, subheading }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { loaded } = useStore();
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const onRedirect = (href: string) => {
    console.log('redirecting to', href);
    navigate(href);
  };

  const delay = !loaded ? 1.5 + index * 0.3 : index * 0.3;

  return (
    <motion.div
      animate='enter'
      className='flex max-w-[340px] flex-col items-start justify-center gap-1'
      custom={delay}
      initial='initial'
      onMouseMove={handleMouseMove}
      onPointerDown={() => {
        onRedirect(href);
      }}
      ref={ref}
      style={{
        cursor: 'pointer'
      }}
      variants={fadeInVariants}
      whileHover='whileHover'
    >
      <motion.span
        className='text-4xl font-bold'
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
        {heading.split('').map((l, index) => (
          <motion.span
            className='inline-block drop-shadow-sm'
            key={index}
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

      <div className='text-slate-200 drop-shadow-sm'>{subheading}</div>
    </motion.div>
  );
};
