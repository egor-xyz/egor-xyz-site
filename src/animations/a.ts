import { MotionProps, Variant, Variants } from 'framer-motion';

export type A = {
  enter?: Variant;
  exit?: Variant;
  initial?: Variant;
};

export const a = (variants: Variants): MotionProps => ({
  animate: 'enter',
  exit: 'exit',
  initial: 'initial',
  variants
});
