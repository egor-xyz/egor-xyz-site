import { FC } from 'react';
import { BubbleText } from '../BubbleText';

type Props = {
  children?: React.ReactNode;
  title?: string;
};

export const Card: FC<Props> = ({ children, title }) => {
  return (
    <div className='relative flex h-[400px] w-[600px] max-w-[90vw] flex-col items-center justify-center rounded-xl bg-white p-4 text-base text-black shadow-xl md:p-8 md:text-2xl'>
      {title && (
        <BubbleText
          text={title}
          className='absolute left-4 top-4 text-base md:text-2xl'
        />
      )}
      {children}
    </div>
  );
};
