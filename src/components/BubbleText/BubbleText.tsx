import { FC } from 'react';
import styles from './BubbleText.module.css';
import { cn } from 'src/utils/cn';

export const BubbleText: FC<{ text: string; className?: string }> = ({ text, className }) => (
  <h2 className={cn('cursor-default text-center text-5xl font-thin text-black', className)}>
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
