import { FC } from 'react';
import styles from './BubbleText.module.css';

export const BubbleText: FC<{ text: string }> = ({ text }) => (
  <h2 className='text-center text-5xl font-thin text-indigo-300'>
    {text.split('').map((child, idx) => (
      <span
        className={styles.hoverText}
        key={idx}
      >
        {child}
      </span>
    ))}
  </h2>
);
