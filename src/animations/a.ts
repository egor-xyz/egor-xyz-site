import { MotionProps, Variants } from 'framer-motion';

export const a = (variants: Variants): MotionProps => ({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants
});
