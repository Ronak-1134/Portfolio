/* ============================================================
   useReducedMotion.js
   Ronak Vaghela Portfolio — Reduced Motion Hook

   Returns true if the user has requested reduced motion.
   Consumed by useScrollReveal, Cursor, and Loader before
   starting any animation sequence.

   Listens for changes — if the user toggles the system
   preference while the page is open, animations pause.
   ============================================================ */

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    /* Safe SSR check */
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleChange(e) {
      setPrefersReduced(e.matches);
    }

    /* Modern API */
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    }

    /* Legacy API (Safari < 14) */
    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  return prefersReduced;
}