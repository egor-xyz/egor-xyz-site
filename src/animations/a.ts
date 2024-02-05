import { MotionProps, Variants } from 'framer-motion';

export const a = (variants: Variants): MotionProps => ({
  animate: 'enter',
  exit: 'exit',
  initial: 'initial',
  variants
});
