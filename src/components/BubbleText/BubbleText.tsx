import { forwardRef } from 'react';
import { cn } from 'src/utils/cn';

import styles from './BubbleText.module.css';

type Props = { className?: string; text: string };

export const BubbleText = forwardRef<HTMLDivElement, Props>(({ text, className }, ref) => (
  <h2
    className={cn('cursor-default text-center text-5xl font-thin text-gray-700', className)}
    ref={ref}
  >
    {text.split('').map((child, idx) => (
      <span
        className={styles.hoverText}
        key={idx}
      >
        {child}
      </span>
    ))}
  </h2>
));
