/* ============================================================
   Cursor.jsx
   Ronak Vaghela Portfolio — Custom Crosshair Cursor

   Two-element cursor system:
     Inner dot  — snaps to mouse position instantly
     Outer ring — follows with 0.08 lerp lag (smooth trailing)

   Variants:
     default  — standard crosshair
     link     — ring expands (1.6×), inner collapses to point
     project  — ring expands further (2×), dashed border
     text     — ring becomes a thin I-beam rect

   Implemented with rAF loop for the lerp — no CSS transitions
   on the position (they fight the lerp and feel wrong).
   CSS transitions only on size and opacity changes.

   mix-blend-mode: multiply — the cursor darkens whatever
   it passes over, feeling like pressing a finger to paper.
   ============================================================ */

import { useEffect, useRef } from 'react';
import { useCursor, lerp }   from '../../hooks/useCursor.jsx';
import styles                 from './Cursor.module.css';

/* ------------------------------------------------------------
   VARIANT CONFIG
   All size/style changes live here — not scattered in CSS.
   ------------------------------------------------------------ */
const VARIANTS = {
  default: {
    outerSize:    28,
    innerSize:     3,
    outerOpacity:  0.5,
    innerOpacity:  0.85,
    outerDashed:   false,
    lerpSpeed:     0.08,
  },
  link: {
    outerSize:    44,
    innerSize:     2,
    outerOpacity:  0.35,
    innerOpacity:  0.7,
    outerDashed:   false,
    lerpSpeed:     0.1,
  },
  project: {
    outerSize:    56,
    innerSize:     2,
    outerOpacity:  0.25,
    innerOpacity:  0.6,
    outerDashed:   true,
    lerpSpeed:     0.07,
  },
  text: {
    outerSize:    20,
    innerSize:     2,
    outerOpacity:  0.4,
    innerOpacity:  0.8,
    outerDashed:   false,
    lerpSpeed:     0.12,
  },
};

/* ------------------------------------------------------------
   COMPONENT
   ------------------------------------------------------------ */
export default function Cursor() {
  const { position, variant, isVisible } = useCursor();

  /* Refs for direct DOM manipulation — no re-renders in rAF */
  const outerRef     = useRef(null);
  const innerRef     = useRef(null);
  const rafRef       = useRef(null);

  /* Current lerped position of the outer ring */
  const lerpedPos    = useRef({ x: -100, y: -100 });
  /* Target position (raw mouse) */
  const targetPos    = useRef({ x: -100, y: -100 });
  /* Current variant config ref — updated each render */
  const variantRef   = useRef(VARIANTS.default);
  /* Click state */
  const clickRef     = useRef(false);

  /* Keep targetPos in sync with context position */
  useEffect(() => {
    targetPos.current = position;
  }, [position]);

  /* Keep variantRef in sync */
  useEffect(() => {
    variantRef.current = VARIANTS[variant] || VARIANTS.default;
  }, [variant]);

  /* ----------------------------------------------------------
     rAF LOOP — runs continuously, drives outer ring lerp
     ---------------------------------------------------------- */
  useEffect(() => {
    /* Don't run on touch/mobile devices */
    if (window.matchMedia('(pointer: coarse)').matches) return;
    /* Respect reduced motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function tick() {
      const config = variantRef.current;
      const outer  = outerRef.current;
      const inner  = innerRef.current;
      if (!outer || !inner) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      /* Lerp outer ring toward target */
      lerpedPos.current.x = lerp(
        lerpedPos.current.x,
        targetPos.current.x,
        config.lerpSpeed
      );
      lerpedPos.current.y = lerp(
        lerpedPos.current.y,
        targetPos.current.y,
        config.lerpSpeed
      );

      /* Apply outer ring position — offset by half size to center */
      const outerHalf = config.outerSize / 2;
      outer.style.transform = `translate(${lerpedPos.current.x - outerHalf}px, ${lerpedPos.current.y - outerHalf}px)`;

      /* Inner dot snaps directly to mouse — no lerp */
      const innerHalf = config.innerSize / 2;
      inner.style.transform = `translate(${targetPos.current.x - innerHalf}px, ${targetPos.current.y - innerHalf}px)`;

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ----------------------------------------------------------
     CLICK ANIMATION — compress inner dot on mousedown
     ---------------------------------------------------------- */
  useEffect(() => {
    function onDown() {
      clickRef.current = true;
      const inner = innerRef.current;
      if (inner) inner.classList.add(styles.clicking);
    }
    function onUp() {
      clickRef.current = false;
      const inner = innerRef.current;
      if (inner) inner.classList.remove(styles.clicking);
    }

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  /* ----------------------------------------------------------
     Don't render on touch/coarse pointer devices
     ---------------------------------------------------------- */
  if (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const config = VARIANTS[variant] || VARIANTS.default;

  return (
    <>
      {/* ---- OUTER RING — lerped, large, mix-blend-mode ---- */}
      <div
        ref={outerRef}
        className={`
          ${styles.outer}
          ${config.outerDashed  ? styles.outerDashed  : ''}
          ${variant === 'text'  ? styles.outerText    : ''}
          ${!isVisible          ? styles.hidden        : ''}
        `}
        style={{
          width:   config.outerSize,
          height:  config.outerSize,
          opacity: isVisible ? config.outerOpacity : 0,
        }}
        aria-hidden="true"
      />

      {/* ---- INNER DOT — snaps, small, crisp ---- */}
      <div
        ref={innerRef}
        className={`
          ${styles.inner}
          ${!isVisible ? styles.hidden : ''}
        `}
        style={{
          width:   config.innerSize,
          height:  config.innerSize,
          opacity: isVisible ? config.innerOpacity : 0,
        }}
        aria-hidden="true"
      />

      {/* ---- CROSSHAIR LINES — fixed to outer ring center ---- */}
      {/* These are rendered via CSS on the outer element */}
    </>
  );
}