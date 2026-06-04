/* ============================================================
   Envelope.jsx
   Ronak Vaghela Portfolio — Envelope Animation

   An SVG envelope that assembles itself:
   1. Envelope body appears
   2. Flap folds down (rotateX)
   3. Seal dot appears with a pop
   4. "Received." fades in below

   Props:
     onSendAnother  {function}  callback to reset form
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../../utils/gsapConfig';
import styles                from './Envelope.module.css';

export default function Envelope({ onSendAnother }) {
  const wrapRef   = useRef(null);
  const bodyRef   = useRef(null);
  const flapRef   = useRef(null);
  const sealRef   = useRef(null);
  const textRef   = useRef(null);
  const noteRef   = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set([bodyRef.current, flapRef.current, sealRef.current,
                wrapRef.current, textRef.current, noteRef.current],
               { opacity: 1, rotateX: 0, scale: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.1 });

    /* 1. Wrapper fades in */
    tl.fromTo(wrapRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );

    /* 2. Envelope body draws in (scale from center) */
    tl.fromTo(bodyRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' },
      '-=0.2'
    );

    /* 3. Flap folds down — perspective hinge at top of flap */
    tl.fromTo(flapRef.current,
      { rotateX: -90, transformPerspective: 400, transformOrigin: 'top center', opacity: 1 },
      { rotateX: 0,   duration: 0.5, ease: 'power2.out' },
      '-=0.1'
    );

    /* 4. Seal pops in */
    tl.fromTo(sealRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.5)' },
      '-=0.05'
    );

    /* 5. Text fades up */
    tl.fromTo(textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0,  duration: 0.5, ease: 'power3.out' },
      '+=0.1'
    );

    tl.fromTo(noteRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0,  duration: 0.4, ease: 'power3.out' },
      '-=0.25'
    );
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap}>

      {/* SVG Envelope */}
      <div className={styles.envelopeWrap}>

        {/* Envelope body */}
        <svg
          ref={bodyRef}
          className={styles.envBody}
          viewBox="0 0 200 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Main rectangle */}
          <rect
            x="1" y="40" width="198" height="89"
            fill="#EDE8DC"
            stroke="#C4B89A"
            strokeWidth="0.5"
          />
          {/* V-fold lines from bottom corners to center */}
          <line x1="1"   y1="129" x2="100" y2="82" stroke="#C4B89A" strokeWidth="0.5" />
          <line x1="199" y1="129" x2="100" y2="82" stroke="#C4B89A" strokeWidth="0.5" />
          {/* Left and right diagonal fold lines from top corners */}
          <line x1="1"   y1="40" x2="100" y2="82" stroke="#C4B89A" strokeWidth="0.5" />
          <line x1="199" y1="40" x2="100" y2="82" stroke="#C4B89A" strokeWidth="0.5" />
        </svg>

        {/* Flap — separate element so it can hinge independently */}
        <svg
          ref={flapRef}
          className={styles.envFlap}
          viewBox="0 0 200 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Triangle flap */}
          <path
            d="M 1 50 L 100 5 L 199 50 Z"
            fill="#E5DFD0"
            stroke="#C4B89A"
            strokeWidth="0.5"
          />
        </svg>

        {/* Wax seal */}
        <div ref={sealRef} className={styles.seal} aria-hidden="true">
          <div className={styles.sealInner}>RV</div>
        </div>
      </div>

      {/* Text below envelope */}
      <p ref={textRef} className={styles.receivedWord}>Received.</p>
      <p ref={noteRef} className={styles.receivedNote}>
        I'll read it carefully and be in touch.
      </p>

      <button className={styles.sendAnother} onClick={onSendAnother}>
        Send another →
      </button>

    </div>
  );
}