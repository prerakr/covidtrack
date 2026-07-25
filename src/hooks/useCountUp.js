import { useEffect, useRef, useState } from 'react';

/**
 * Animate a numeric value from its previous value to `target` using
 * requestAnimationFrame with an ease-out curve. Respects the user's
 * "reduce motion" preference by jumping straight to the target.
 *
 * @param {number} target - The value to count toward.
 * @param {number} [duration=1200] - Animation length in milliseconds.
 * @returns {number} The current (animating) value.
 */
export function useCountUp(target = 0, duration = 1200) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const from = fromRef.current;
    const to = Number(target) || 0;

    if (prefersReducedMotion || from === to) {
      setValue(to);
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(from + (to - from) * easeOut(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}
