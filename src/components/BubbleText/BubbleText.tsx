import { FC } from 'react';
import { cn } from 'src/utils/cn';

import styles from './BubbleText.module.css';

export const BubbleText: FC<{ className?: string; text: string }> = ({ text, className }) => (
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
