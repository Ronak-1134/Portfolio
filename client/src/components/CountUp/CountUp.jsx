/* ============================================================
   CountUp.jsx
   Ronak Vaghela Portfolio — Animated Number Counter

   Counts from 0 to `target` when the element scrolls
   into view. Uses requestAnimationFrame — no GSAP dependency.
   Easing: easeOutQuart — fast start, decelerates at the end
   so it feels like a number "landing" on its value.

   Props:
     target    {number}   The final value (e.g. 7.92)
     decimals  {number}   Decimal places to show (default 0)
     suffix    {string}   Text after the number (e.g. "+", "%")
     prefix    {string}   Text before the number
     duration  {number}   Animation duration ms (default 1400)
     className {string}   Extra class for the span
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion }            from '../../hooks/useReducedMotion';

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function CountUp({
  target,
  decimals  = 0,
  suffix    = '',
  prefix    = '',
  duration  = 1400,
  className = '',
}) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(
    prefersReduced
      ? `${prefix}${target.toFixed(decimals)}${suffix}`
      : `${prefix}${(0).toFixed(decimals)}${suffix}`
  );
  const elRef      = useRef(null);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`);
      return;
    }

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();

          function tick(timestamp) {
            if (!startRef.current) startRef.current = timestamp;
            const elapsed  = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = easeOutQuart(progress);
            const current  = eased * target;

            setDisplay(
              `${prefix}${current.toFixed(decimals)}${suffix}`
            );

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            } else {
              /* Snap to exact final value — no floating point drift */
              setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`);
            }
          }

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, decimals, suffix, prefix, duration, prefersReduced]);

  return (
    <span ref={elRef} className={className} aria-label={`${prefix}${target}${suffix}`}>
      {display}
    </span>
  );
}