/* ============================================================
   Loader.jsx
   Ronak Vaghela Portfolio — Opening Canvas Animation

   The first thing anyone sees. It must be perfect.

   Sequence (2.8 seconds total):
     0.00s  — Canvas fills screen. Single point at center.
     0.00s  — Grid lines begin drawing outward from center.
              Horizontal lines first, then vertical.
              Each line extends symmetrically left/right or up/down.
     1.60s  — Grid fully covers screen.
     1.70s  — "RONAK VAGHELA" strokes in left to right.
              SVG text with stroke-dashoffset animation.
     2.40s  — Name fully drawn. Brief pause.
     2.60s  — Canvas fades out, page reveals beneath.
     2.80s  — onComplete() fires. Component unmounts.

   Click anywhere to skip the entire sequence.
   rAF loop only — zero GSAP, zero CSS animation in canvas.
   ============================================================ */

import { useEffect, useRef, useCallback } from 'react';
import styles from './Loader.module.css';

/* ------------------------------------------------------------
   TIMING CONSTANTS (ms)
   Adjust these to tune the feel without touching logic.
   ------------------------------------------------------------ */
const T_GRID_START    =    0;   /* grid lines begin drawing      */
const T_GRID_END      = 1600;   /* grid fully covers screen      */
const T_NAME_START    = 1700;   /* name stroke begins            */
const T_NAME_END      = 2400;   /* name fully drawn              */
const T_PAUSE_END     = 2550;   /* brief hold before exit        */
const T_EXIT_START    = 2550;   /* canvas fade begins            */
const T_TOTAL         = 2800;   /* onComplete fires              */

/* ------------------------------------------------------------
   VISUAL CONSTANTS
   ------------------------------------------------------------ */
const CELL_SIZE       = 24;     /* px — matches GridBackground   */
const LINE_COLOR      = 'rgba(196, 184, 154, 0.55)';   /* --color-stroke */
const MAJOR_COLOR     = 'rgba(196, 184, 154, 0.85)';   /* major lines    */
const BG_COLOR        = '#F5F0E8';  /* --color-bg                */
const NAME_COLOR      = '#2C2416';  /* --color-ink-primary        */
const NAME_FONT       = '"Cormorant Garamond", Georgia, serif';

/* ------------------------------------------------------------
   EASING FUNCTIONS
   Pure math — no library dependency.
   ------------------------------------------------------------ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function Loader({ onComplete }) {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);
  const exitedRef  = useRef(false);
  const wrapperRef = useRef(null);

  /* ----------------------------------------------------------
     SKIP — called on click or when T_TOTAL is reached.
     Triggers the CSS fade-out class, then fires onComplete.
     ---------------------------------------------------------- */
  const handleExit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;

    /* Cancel the rAF loop */
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    /* Trigger CSS exit animation */
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.classList.add(styles.exiting);
      /* Wait for CSS transition to finish before unmounting */
      wrapper.addEventListener(
        'animationend',
        () => { onComplete?.(); },
        { once: true }
      );
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  /* ----------------------------------------------------------
     MAIN ANIMATION LOOP
     ---------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    /* --------------------------------------------------------
       SIZE CANVAS to physical pixel ratio for crisp rendering
       -------------------------------------------------------- */
    function sizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const w   = window.innerWidth;
      const h   = window.innerHeight;

      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    sizeCanvas();

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;   /* center x */
    const cy = H / 2;   /* center y */

    /* --------------------------------------------------------
       PRECOMPUTE GRID LINE POSITIONS
       Lines are stored as { pos, isMajor } arrays for
       horizontal (y positions) and vertical (x positions).
       -------------------------------------------------------- */

    /* Horizontal lines — y positions from center outward */
    const hLines = [];
    /* Lines going UP from center */
    for (let y = cy; y >= -CELL_SIZE; y -= CELL_SIZE) {
      const idx = Math.round((cy - y) / CELL_SIZE);
      hLines.push({ y, isMajor: idx % 5 === 0, distFromCenter: cy - y });
    }
    /* Lines going DOWN from center (skip center — already added) */
    for (let y = cy + CELL_SIZE; y <= H + CELL_SIZE; y += CELL_SIZE) {
      const idx = Math.round((y - cy) / CELL_SIZE);
      hLines.push({ y, isMajor: idx % 5 === 0, distFromCenter: y - cy });
    }

    /* Vertical lines — x positions from center outward */
    const vLines = [];
    /* Lines going LEFT from center */
    for (let x = cx; x >= -CELL_SIZE; x -= CELL_SIZE) {
      const idx = Math.round((cx - x) / CELL_SIZE);
      vLines.push({ x, isMajor: idx % 5 === 0, distFromCenter: cx - x });
    }
    /* Lines going RIGHT from center */
    for (let x = cx + CELL_SIZE; x <= W + CELL_SIZE; x += CELL_SIZE) {
      const idx = Math.round((x - cx) / CELL_SIZE);
      vLines.push({ x, isMajor: idx % 5 === 0, distFromCenter: x - cx });
    }

    /* Maximum distance from center to any corner */
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    /* --------------------------------------------------------
       DRAW FRAME
       Called every rAF tick with elapsed time in ms.
       -------------------------------------------------------- */
    function drawFrame(elapsed) {
      /* Clear to background color */
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);

      /* ---- PHASE 1: GRID DRAW ---- */
      if (elapsed >= T_GRID_START) {
        const gridProgress = Math.min(
          1,
          (elapsed - T_GRID_START) / (T_GRID_END - T_GRID_START)
        );
        const easedGrid = easeOutQuart(gridProgress);

        /* How far from center lines have drawn (in px) */
        const drawRadius = easedGrid * (maxDist + CELL_SIZE);

        /* Draw horizontal lines */
        hLines.forEach(({ y, isMajor, distFromCenter }) => {
          if (distFromCenter > drawRadius) return;

          /* How much of this line has extended (0→1) */
          /* Lines further from center start later */
          const lineStart = distFromCenter / (maxDist + CELL_SIZE);
          const lineProgress = Math.min(
            1,
            (easedGrid - lineStart) / (1 - lineStart + 0.001)
          );

          if (lineProgress <= 0) return;

          ctx.beginPath();
          ctx.strokeStyle = isMajor ? MAJOR_COLOR : LINE_COLOR;
          ctx.lineWidth   = 0.5;
          ctx.globalAlpha = isMajor ? 0.85 : 0.55;
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        });

        /* Draw vertical lines */
        vLines.forEach(({ x, isMajor, distFromCenter }) => {
          if (distFromCenter > drawRadius) return;

          const lineStart = distFromCenter / (maxDist + CELL_SIZE);
          const lineProgress = Math.min(
            1,
            (easedGrid - lineStart) / (1 - lineStart + 0.001)
          );

          if (lineProgress <= 0) return;

          ctx.beginPath();
          ctx.strokeStyle = isMajor ? MAJOR_COLOR : LINE_COLOR;
          ctx.lineWidth   = 0.5;
          ctx.globalAlpha = isMajor ? 0.85 : 0.55;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
          ctx.globalAlpha = 1;
        });

        /* Center crosshair dot — appears at t=0 */
        const dotOpacity = Math.min(1, elapsed / 200);
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 94, 60, ${dotOpacity * 0.6})`;
        ctx.fill();
      }

      /* ---- PHASE 2: NAME STROKE ---- */
      if (elapsed >= T_NAME_START) {
        const nameProgress = Math.min(
          1,
          (elapsed - T_NAME_START) / (T_NAME_END - T_NAME_START)
        );
        const easedName = easeOutCubic(nameProgress);

        drawName(ctx, W, H, easedName);
      }

      /* ---- PHASE 3: EXIT ---- */
      if (elapsed >= T_EXIT_START) {
        const exitProgress = Math.min(
          1,
          (elapsed - T_EXIT_START) / (T_TOTAL - T_EXIT_START)
        );
        /* Fade the entire canvas — handled by CSS class, not canvas */
        /* Canvas just holds its final state */
      }

      /* Trigger CSS exit */
      if (elapsed >= T_EXIT_START && !exitedRef.current) {
        const wrapper = wrapperRef.current;
        if (wrapper && !wrapper.classList.contains(styles.exiting)) {
          wrapper.classList.add(styles.exiting);
        }
      }

      if (elapsed >= T_TOTAL) {
        handleExit();
      }
    }

    /* --------------------------------------------------------
       DRAW NAME
       Simulates SVG stroke-dashoffset via canvas clipping.
       Clips a reveal rectangle that grows left→right over time.
       -------------------------------------------------------- */
    function drawName(ctx, W, H, progress) {
      const fontSize = Math.min(
        Math.max(W * 0.065, 32),
        96
      );

      ctx.save();

      /* Set font to measure text */
      ctx.font          = `300 ${fontSize}px ${NAME_FONT}`;
      ctx.textBaseline  = 'middle';
      ctx.textAlign     = 'center';

      const name      = 'RONAK VAGHELA';
      const metrics   = ctx.measureText(name);
      const textWidth = metrics.width;
      const textX     = W / 2;
      const textY     = H / 2;

      /* Clip to a rectangle that grows from left to right */
      const revealWidth = textWidth * progress + fontSize * 0.1;
      const clipX       = textX - textWidth / 2 - fontSize * 0.05;

      ctx.beginPath();
      ctx.rect(clipX, textY - fontSize, revealWidth, fontSize * 2);
      ctx.clip();

      /* Draw name fill */
      ctx.fillStyle   = NAME_COLOR;
      ctx.globalAlpha = 0.9;
      ctx.fillText(name, textX, textY);

      ctx.restore();

      /* Sub-label — role title, fades in after name is drawn */
      if (progress > 0.8) {
        const labelProgress = (progress - 0.8) / 0.2;
        const labelSize     = Math.max(fontSize * 0.16, 11);
        const labelY        = textY + fontSize * 0.75;

        ctx.save();
        ctx.font          = `400 ${labelSize}px "JetBrains Mono", monospace`;
        ctx.textBaseline  = 'middle';
        ctx.textAlign     = 'center';
        ctx.fillStyle     = 'rgba(122, 110, 95, 1)';
        ctx.globalAlpha   = labelProgress * 0.7;
        ctx.letterSpacing = '0.2em';

        /* Track label spacing manually for canvas */
        const label     = 'FULL STACK DEVELOPER';
        ctx.fillText(label, W / 2, labelY);
        ctx.restore();
      }
    }

    /* --------------------------------------------------------
       RAF LOOP
       -------------------------------------------------------- */
    function tick(timestamp) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      drawFrame(elapsed);

      if (!exitedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    /* Cleanup on unmount */
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleExit]);

  /* ----------------------------------------------------------
     SKIP on click or keydown
     ---------------------------------------------------------- */
  function handleSkip() {
    handleExit();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      handleExit();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.loaderWrapper}
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Loading portfolio. Click or press any key to skip."
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />

      {/* Skip hint — appears after 800ms via CSS animation-delay */}
      <div className={styles.skipHint} aria-hidden="true">
        <span className={styles.skipText}>click to skip</span>
      </div>
    </div>
  );
}