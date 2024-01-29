import { FC } from 'react';

export const Card: FC<{ children?: JSX.Element | string }> = ({ children = '' }) => {
  return (
    <div className='flex h-[400px] w-[600px] items-center justify-center rounded-xl bg-white p-2 text-2xl text-black shadow-xl'>
      {children}
    </div>
  );
};
