import { FC, SVGProps } from 'react';
import { Variants, motion } from 'framer-motion';
import { a } from 'src/utils/a';

const fadeInVariants: Variants = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 1
    },
    y: 0
  },
  initial: {
    opacity: 0,
    scale: 0.4,
    y: 100
  }
};

type Props = {
  Icon: FC<
    SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  description: string;
  href: string;
  text: string;
};

export const ProductCard: FC<Props> = ({ Icon, text, href, description }) => {
  return (
    <motion.a
      className='md:text-l relative flex w-full max-w-[90svw] items-center justify-items-start overflow-hidden rounded-xl bg-white text-base text-black shadow-xl'
      href={href}
      rel='noreferrer'
      target='_blank'
      {...a(fadeInVariants)}
    >
      <div className='bg-black bg-gradient-to-t from-blue-600 to-red-500 p-2'>
        <Icon className='h-[80px] w-[80px]' />
      </div>

      <div
        className='flex-col px-2'
        rel='noreferrer'
      >
        <div className='text-[#0099FF]'>{text}</div>
        <div className='max-w-[370px] pt-1 text-sm md:pt-2 md:text-base'>{description}</div>
      </div>
    </motion.a>
  );
};
