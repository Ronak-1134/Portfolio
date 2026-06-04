/* ============================================================
   Loader.jsx — RV Signature Animation
   Ronak Vaghela Portfolio

   A single SVG path traces the "RV" monogram stroke by stroke
   like watching someone sign their name in real time.
   Then the full name fades in beneath it.
   Then the overlay dissolves to reveal the page.

   Sequence:
     0.00s  Cream screen. Silence.
     0.20s  R stroke begins drawing (stroke-dashoffset)
     1.00s  R complete. Brief pause.
     1.20s  V stroke begins drawing
     1.90s  V complete. Full "RV" visible.
     2.10s  "RONAK VAGHELA" fades in below
     2.50s  Everything held for a moment
     2.70s  Overlay fades out → page reveals
     2.90s  onComplete fires, component unmounts

   Click anywhere to skip.
   ============================================================ */

import { useEffect, useRef, useCallback } from 'react';
import { gsap }    from '../../utils/gsapConfig';
import styles      from './Loader.module.css';

/* ---- SVG path data for the RV monogram ----
   Hand-crafted paths that feel like a signature stroke.
   R: a single continuous path — vertical stem + bowl + leg
   V: two diagonal strokes meeting at a point
   ViewBox: 0 0 200 120
   ------------------------------------------ */
const RV_PATHS = {
  /* R — stem down, loop right, diagonal leg */
  R: 'M 20,15 L 20,95 M 20,15 C 20,15 60,15 60,42 C 60,68 20,68 20,68 M 20,68 L 58,95',
  /* V — left diagonal down to point, right diagonal back up */
  V: 'M 82,15 L 116,95 L 150,15',
};

/* Total path lengths (approximate — GSAP measures exactly at runtime) */
const PATH_LENGTH = { R: 220, V: 130 };

/* Timing (ms) */
const T = {
  R_START:    200,
  R_END:     1000,
  V_START:   1150,
  V_END:     1900,
  NAME_IN:   2050,
  HOLD_END:  2550,
  EXIT:      2650,
  COMPLETE:  2900,
};

export default function Loader({ onComplete }) {
  const wrapperRef  = useRef(null);
  const rPathRef    = useRef(null);
  const vPathRef    = useRef(null);
  const nameRef     = useRef(null);
  const dotRef      = useRef(null);
  const exitedRef   = useRef(false);
  const tlRef       = useRef(null);

  /* ---- Exit: fade wrapper out, fire onComplete ---- */
  const handleExit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;

    if (tlRef.current) tlRef.current.kill();

    const wrapper = wrapperRef.current;
    if (!wrapper) return onComplete?.();

    gsap.to(wrapper, {
      opacity:  0,
      duration: 0.45,
      ease:     'power2.inOut',
      onComplete: () => onComplete?.(),
    });
  }, [onComplete]);

  /* ---- Main animation ---- */
  useEffect(() => {
    const rPath = rPathRef.current;
    const vPath = vPathRef.current;
    if (!rPath || !vPath) return;

    /* Measure actual path lengths for perfect dashoffset */
    const rLen = rPath.getTotalLength();
    const vLen = vPath.getTotalLength();

    /* Set initial state — paths invisible */
    gsap.set([rPath, vPath], { opacity: 1 });
    gsap.set(rPath, { strokeDasharray: rLen, strokeDashoffset: rLen });
    gsap.set(vPath, { strokeDasharray: vLen, strokeDashoffset: vLen });
    gsap.set(nameRef.current, { opacity: 0, y: 8 });
    gsap.set(dotRef.current,  { scale: 0, opacity: 0, transformOrigin: 'center' });

    const tl = gsap.timeline({ delay: T.R_START / 1000 });
    tlRef.current = tl;

    /* 1. Draw R */
    tl.to(rPath, {
      strokeDashoffset: 0,
      duration: (T.R_END - T.R_START) / 1000,
      ease:     'power2.inOut',
    });

    /* 2. Dot appears (the period after RV) */
    tl.to(dotRef.current, {
      scale:    1,
      opacity:  1,
      duration: 0.18,
      ease:     'back.out(2)',
    }, `-=${(T.R_END - T.V_START + 150) / 1000 * -1}`);

    /* 3. Draw V */
    tl.to(vPath, {
      strokeDashoffset: 0,
      duration: (T.V_END - T.V_START) / 1000,
      ease:     'power2.inOut',
    }, `+=${(T.V_START - T.R_END) / 1000}`);

    /* 4. Name fades in */
    tl.to(nameRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.5,
      ease:     'power3.out',
    }, `+=${(T.NAME_IN - T.V_END) / 1000}`);

    /* 5. Hold, then exit */
    tl.call(handleExit, null, `+=${(T.EXIT - T.NAME_IN) / 1000 + 0.5}`);

    return () => tl.kill();
  }, [handleExit]);

  return (
    <div
      ref={wrapperRef}
      className={styles.loaderWrapper}
      onClick={handleExit}
      onKeyDown={e => ['Enter', ' ', 'Escape'].includes(e.key) && handleExit()}
      role="button"
      tabIndex={0}
      aria-label="Loading. Click to skip."
    >
      {/* Centre stage */}
      <div className={styles.stage}>

        {/* RV SVG monogram */}
        <svg
          className={styles.monogram}
          viewBox="0 0 170 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* R stroke */}
          <path
            ref={rPathRef}
            d={RV_PATHS.R}
            stroke="#2C2416"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* V stroke */}
          <path
            ref={vPathRef}
            d={RV_PATHS.V}
            stroke="#2C2416"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Period dot — appears after R is drawn */}
          <circle
            ref={dotRef}
            cx="160"
            cy="95"
            r="2.5"
            fill="#8B5E3C"
          />
        </svg>

        {/* Full name — fades in below the monogram */}
        <div ref={nameRef} className={styles.nameReveal}>
          <span className={styles.nameText}>Ronak Vaghela</span>
          <span className={styles.nameRole}>Full-Stack Developer</span>
        </div>

      </div>

      {/* Skip hint */}
      <div className={styles.skipHint} aria-hidden="true">
        <span className={styles.skipText}>click to skip</span>
      </div>
    </div>
  );
}