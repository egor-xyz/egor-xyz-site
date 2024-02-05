/* eslint-disable @typescript-eslint/ban-ts-comment */
// Safari defaults to passive: true for the touchstart event, so we need  to explicitly specify false
// See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
const options = { passive: false };

const touchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    const [touch] = e.touches;
    if (touch.clientX < window.innerWidth * 0.1 || touch.clientX > window.innerWidth * 0.9) {
      e.preventDefault();
    }
  }
};

export const preventSwipe = () => {
  window.addEventListener('touchstart', touchStart, options);

  // @ts-ignore
  return () => window.removeEventListener('touchstart', touchStart, options);
};
