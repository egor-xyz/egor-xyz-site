import { FC, SVGProps } from 'react';
import { Variants, motion } from 'motion/react';
import { a } from 'src/utils/a';

const fadeInVariants: Variants = {
  enter: {
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 1.4,
      type: 'spring'
    },
    x: 0
  },
  initial: {
    opacity: 0,
    x: -500
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
      className='md:text-l relative flex w-full max-w-[90svw] items-center justify-items-start text-base text-black opacity-0'
      href={href}
      rel='noreferrer'
      target='_blank'
      {...a(fadeInVariants)}
    >
      <div className='p-2'>
        <Icon className='h-[80px] w-[80px]' />
      </div>

      <div
        className='flex-col px-2'
        rel='noreferrer'
      >
        <div className='font-bold drop-shadow'>{text}</div>

        <div className='max-w-[370px] pt-1 text-sm md:pt-2 md:text-base'>{description}</div>
      </div>
    </motion.a>
  );
};
