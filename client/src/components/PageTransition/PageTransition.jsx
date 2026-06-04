/* ============================================================
   PageTransition.jsx
   Ronak Vaghela Portfolio

   Two responsibilities:

   1. LOADER EXIT TRANSITION
      When the loader completes, a cream panel sweeps upward
      to reveal the page — like lifting a sheet of paper off
      a drawing beneath it.

   2. SECTION WIPE REVEAL
      Each section has a cream overlay panel that sweeps
      away (scaleY 1→0 from top) when the section enters
      the viewport, revealing the content beneath.
      Feels like turning a page.

   Usage:
     Wrap any section content with <SectionReveal>:
       <SectionReveal>
         <YourSection />
       </SectionReveal>
   ============================================================ */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../utils/gsapConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './PageTransition.module.css';

/* ============================================================
   LOADER EXIT CURTAIN
   Full-screen cream panel that sweeps upward after loader done.
   Rendered once in App.jsx after loaderDone becomes true.
   ============================================================ */
export function LoaderCurtain({ onComplete }) {
  const prefersReduced = useReducedMotion();

  const variants = {
    initial: { scaleY: 1, transformOrigin: 'top' },
    exit: {
      scaleY: 0,
      transformOrigin: 'top',
      transition: {
        duration: prefersReduced ? 0 : 0.75,
        ease:     [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        key="loader-curtain"
        className={styles.curtain}
        variants={variants}
        initial="initial"
        exit="exit"
      />
    </AnimatePresence>
  );
}

/* ============================================================
   SECTION REVEAL
   Wraps a section. A cream panel sits over the content and
   sweeps upward when the section enters the viewport.
   ============================================================ */
export function SectionReveal({ children, delay = 0 }) {
  const wrapRef    = useRef(null);
  const panelRef   = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const panel = panelRef.current;
    const wrap  = wrapRef.current;

    /* Reduced motion or no panel — show content immediately */
    if (!panel || !wrap || prefersReduced) {
      if (panel) gsap.set(panel, { scaleY: 0 });
      return;
    }

    gsap.set(panel, { scaleY: 1, transformOrigin: 'top' });

    const tween = gsap.to(panel, {
      scaleY:   0,
      duration: 0.85,
      ease:     'power3.inOut',
      delay,
      scrollTrigger: {
        trigger:       wrap,
        start:         'top 82%',
        once:          true,
        toggleActions: 'play none none none',
        /* Safety: if trigger never fires, reveal content anyway */
        onEnter: () => {},
      },
    });

    /* Failsafe: after 3s, always reveal regardless of scroll */
    const fallback = setTimeout(() => {
      gsap.set(panel, { scaleY: 0 });
    }, 3000);

    return () => {
      tween.scrollTrigger?.kill();
      clearTimeout(fallback);
    };
  }, [delay, prefersReduced]);

  return (
    <div ref={wrapRef} className={styles.sectionRevealWrap}>
      {children}
      <div
        ref={panelRef}
        className={styles.revealPanel}
        aria-hidden="true"
      />
    </div>
  );
}