import { FC } from 'react';

export const Card: FC<{ children?: JSX.Element | string }> = ({ children = '' }) => {
  return <div className='h-[400px] w-[600px] rounded-xl bg-white p-2 text-black shadow-xl'>{children}</div>;
};
