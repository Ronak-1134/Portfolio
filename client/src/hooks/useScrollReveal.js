/* ============================================================
   useScrollReveal.js
   Ronak Vaghela Portfolio — Scroll Reveal Hook

   Wraps createScrollReveal() from gsapConfig.js into a
   React hook that handles mount/unmount lifecycle cleanly.

   Usage:
     const ref = useScrollReveal();
     <div ref={ref}>Content</div>

     // Multiple children with stagger:
     const ref = useScrollReveal({ stagger: 0.12, selector: '> *' });
     <section ref={ref}>
       <div>Item 1</div>
       <div>Item 2</div>
     </section>

     // Blueprint unfold (rotateX):
     const ref = useScrollReveal({ rotate: true });
   ============================================================ */

import { useEffect, useRef } from 'react';
import { createScrollReveal, killScrollTriggers } from '../utils/gsapConfig';
import { useReducedMotion } from './useReducedMotion';

export function useScrollReveal(options = {}) {
  const ref            = useRef(null);
  const prefersReduced = useReducedMotion();
  const tweenRef       = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    /* If a CSS selector is provided, animate the matching children */
    const targets = options.selector
      ? Array.from(el.querySelectorAll(options.selector))
      : el;

    if (!targets || (Array.isArray(targets) && targets.length === 0)) return;

    tweenRef.current = createScrollReveal(targets, {
      trigger: el,
      ...options,
    });

    return () => {
      if (tweenRef.current) {
        /* Kill the tween and its ScrollTrigger */
        const st = tweenRef.current.scrollTrigger;
        if (st) st.kill();
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [prefersReduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}