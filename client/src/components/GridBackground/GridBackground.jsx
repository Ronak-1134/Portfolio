/* ============================================================
   GridBackground.jsx
   Ronak Vaghela Portfolio — Graph Paper Foundation

   A fixed SVG pattern that tiles a 24×24px grid across
   the entire viewport. Sits at z-index 0 behind all content.
   Opacity 0.35 — present but never dominant.

   The grid is the page's skeleton. Every section breathes
   against it. It should never be covered completely.
   ============================================================ */

import { useEffect, useRef } from 'react';
import styles from './GridBackground.module.css';

/* ------------------------------------------------------------
   GRID CONSTANTS
   24px cell size matches an 8px base unit × 3.
   Minor lines at every cell, major lines every 5 cells (120px).
   ------------------------------------------------------------ */
const CELL          = 24;   /* px — minor grid cell size       */
const MAJOR_EVERY   = 5;    /* cells between major grid lines  */
const MAJOR_CELL    = CELL * MAJOR_EVERY;  /* 120px            */

/* SVG stroke values — pencil-weight only */
const MINOR_OPACITY = 0.45;  /* minor grid lines               */
const MAJOR_OPACITY = 0.75;  /* major grid lines — slightly more visible */

export default function GridBackground() {
  const svgRef = useRef(null);

  /* ----------------------------------------------------------
     On mount: measure viewport and set SVG dimensions.
     On resize: recalculate to always fill the full page.
     ---------------------------------------------------------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function fitToPage() {
      /* Use document height so grid covers full scrollable area */
      const w = document.documentElement.scrollWidth;
      const h = document.documentElement.scrollHeight;
      svg.setAttribute('width',  w);
      svg.setAttribute('height', h);
    }

    fitToPage();

    /* ResizeObserver on body catches both viewport and content changes */
    const ro = new ResizeObserver(fitToPage);
    ro.observe(document.body);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      className={styles.gridWrapper}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        ref={svgRef}
        className={styles.gridSvg}
        xmlns="http://www.w3.org/2000/svg"
        /* Initial dimensions — overwritten by ResizeObserver */
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>

          {/* ------------------------------------------------
              MINOR GRID PATTERN — 24×24px
              Pencil-weight lines, subdued opacity.
              The workhorse of the graph paper texture.
              ------------------------------------------------ */}
          <pattern
            id="grid-minor"
            x="0"
            y="0"
            width={CELL}
            height={CELL}
            patternUnits="userSpaceOnUse"
          >
            {/* Vertical minor line — right edge of cell */}
            <line
              x1={CELL}
              y1="0"
              x2={CELL}
              y2={CELL}
              stroke="#D4C9B0"
              strokeWidth="0.5"
              strokeOpacity={MINOR_OPACITY}
            />
            {/* Horizontal minor line — bottom edge of cell */}
            <line
              x1="0"
              y1={CELL}
              x2={CELL}
              y2={CELL}
              stroke="#D4C9B0"
              strokeWidth="0.5"
              strokeOpacity={MINOR_OPACITY}
            />
          </pattern>

          {/* ------------------------------------------------
              MAJOR GRID PATTERN — 120×120px
              Slightly more visible lines every 5 cells.
              Gives the graph paper its structural rhythm.
              ------------------------------------------------ */}
          <pattern
            id="grid-major"
            x="0"
            y="0"
            width={MAJOR_CELL}
            height={MAJOR_CELL}
            patternUnits="userSpaceOnUse"
          >
            {/* Fill with minor grid first */}
            <rect
              width={MAJOR_CELL}
              height={MAJOR_CELL}
              fill="url(#grid-minor)"
            />
            {/* Vertical major line — right edge of major cell */}
            <line
              x1={MAJOR_CELL}
              y1="0"
              x2={MAJOR_CELL}
              y2={MAJOR_CELL}
              stroke="#C4B89A"
              strokeWidth="0.5"
              strokeOpacity={MAJOR_OPACITY}
            />
            {/* Horizontal major line — bottom edge of major cell */}
            <line
              x1="0"
              y1={MAJOR_CELL}
              x2={MAJOR_CELL}
              y2={MAJOR_CELL}
              stroke="#C4B89A"
              strokeWidth="0.5"
              strokeOpacity={MAJOR_OPACITY}
            />
          </pattern>

          {/* ------------------------------------------------
              VIGNETTE GRADIENT
              Very subtle radial fade toward edges so the grid
              doesn't compete with content at the margins.
              The centre breathes, the edges whisper.
              ------------------------------------------------ */}
          <radialGradient
            id="grid-vignette"
            cx="50%"
            cy="50%"
            r="70%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%"   stopColor="#F5F0E8" stopOpacity="0"   />
            <stop offset="75%"  stopColor="#F5F0E8" stopOpacity="0"   />
            <stop offset="100%" stopColor="#F5F0E8" stopOpacity="0.6" />
          </radialGradient>

        </defs>

        {/* ----------------------------------------------------
            GRID FILL — covers the entire SVG surface
            ---------------------------------------------------- */}
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-major)"
        />

        {/* ----------------------------------------------------
            VIGNETTE OVERLAY — softens grid at edges
            ---------------------------------------------------- */}
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-vignette)"
          pointerEvents="none"
        />

      </svg>
    </div>
  );
}