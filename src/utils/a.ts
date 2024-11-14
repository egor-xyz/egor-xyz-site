import { MotionProps, Variant, Variants } from 'motion/react';

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
