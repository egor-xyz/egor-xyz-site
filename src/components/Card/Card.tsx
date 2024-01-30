import { FC } from 'react';
import { BubbleText } from '../BubbleText';

type Props = {
  children?: React.ReactNode;
  title?: string;
};

export const Card: FC<Props> = ({ children, title }) => {
  return (
    <div className='relative flex h-[400px] w-[600px] flex-col items-center justify-center rounded-xl bg-white p-8 text-2xl text-black shadow-xl'>
      {title && (
        <BubbleText
          text={title}
          className='absolute left-4 top-4 text-2xl'
        />
      )}
      {children}
    </div>
  );
};
