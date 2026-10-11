import { motion, type Variants } from 'motion/react';
import type { FC, ReactNode, SVGProps } from 'react';
import { useThemeStore } from 'src/store/themeStore';
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
  description: string;
  href: string;
  text: string;
  Icon?: FC<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  customIcon?: ReactNode;
};

export const ProductCard: FC<Props> = ({ description, href, Icon, customIcon, text }) => {
  const { theme } = useThemeStore();
  return (
    <motion.a
      className={`relative flex w-full max-w-[90svw] shrink-0 items-center text-base md:text-l ${theme === 'dark' ? 'text-stone-200' : 'text-black'} opacity-0`}
      href={href}
      rel='noopener noreferrer'
      target='_blank'
      {...a(fadeInVariants)}
    >
      <div className='flex h-24 w-24 shrink-0 items-center justify-center p-2'>
        {customIcon ??
          (Icon && (
            <Icon
              aria-hidden='true'
              className='h-[80px] w-[80px]'
            />
          ))}
      </div>

      <div className='min-w-0 flex-1 px-2'>
        <div className='font-bold drop-shadow-sm'>{text}</div>
        <div className='max-w-[370px] pt-1 text-sm md:pt-2 md:text-base'>{description}</div>
      </div>
    </motion.a>
  );
};
