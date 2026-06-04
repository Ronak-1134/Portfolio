/* ============================================================
   useTilt.js
   Ronak Vaghela Portfolio — 3D Card Tilt Hook

   On mousemove within the element, rotates it on X and Y axes
   based on cursor position relative to element center.
   On mouseleave, springs back to flat with elastic easing.

   The tilt makes cards feel like physical objects being
   examined — a holographic card effect.

   Usage:
     const tiltRef = useTilt({ maxX: 8, maxY: 8 });
     <div ref={tiltRef}>Card content</div>

   Props:
     maxX      {number}  Max rotation on X axis (degrees). Default 8
     maxY      {number}  Max rotation on Y axis (degrees). Default 8
     glare     {boolean} Show a light glare highlight. Default true
     scale     {number}  Scale up on hover. Default 1.02
     speed     {number}  Transition speed (ms). Default 400
     disabled  {boolean} Disable the effect. Default false
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../utils/gsapConfig';
import { useReducedMotion }  from './useReducedMotion';

export function useTilt({
  maxX     = 8,
  maxY     = 8,
  glare    = true,
  scale    = 1.02,
  disabled = false,
} = {}) {
  const ref            = useRef(null);
  const glareRef       = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || prefersReduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    /* Set up 3D perspective on the element */
    gsap.set(el, { transformPerspective: 800, transformStyle: 'preserve-3d' });

    /* Create glare element if requested */
    let glareEl = null;
    if (glare) {
      glareEl = document.createElement('div');
      glareEl.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
        border-radius: inherit;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(245, 240, 232, 0.18) 0%,
          transparent 65%
        );
        opacity: 0;
        transition: opacity 0.2s ease;
        mix-blend-mode: overlay;
      `;
      /* Ensure parent has relative positioning for glare */
      const pos = window.getComputedStyle(el).position;
      if (pos === 'static') el.style.position = 'relative';
      el.appendChild(glareEl);
      glareRef.current = glareEl;
    }

    /* quickSetters for zero-overhead per-frame updates */
    const setRotX    = gsap.quickSetter(el, 'rotateX', 'deg');
    const setRotY    = gsap.quickSetter(el, 'rotateY', 'deg');
    const setScale   = gsap.quickSetter(el, 'scale');

    function onMove(e) {
      const rect   = el.getBoundingClientRect();
      /* Normalise cursor position to -1 → +1 within element */
      const normX  = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const normY  = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      /* rotateY: cursor right → tilt right. rotateX: cursor up → tilt back */
      setRotY( normX * maxY);
      setRotX(-normY * maxX);

      /* Update glare position */
      if (glareEl) {
        const glareX = ((e.clientX - rect.left) / rect.width)  * 100;
        const glareY = ((e.clientY - rect.top)  / rect.height) * 100;
        glareEl.style.background = `radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(245, 240, 232, 0.2) 0%,
          transparent 60%
        )`;
        glareEl.style.opacity = '1';
      }
    }

    function onEnter() {
      gsap.to(el, {
        scale:    scale,
        duration: 0.3,
        ease:     'power2.out',
        overwrite: 'auto',
      });
    }

    function onLeave() {
      /* Spring back to flat */
      gsap.to(el, {
        rotateX:  0,
        rotateY:  0,
        scale:    1,
        duration: 0.7,
        ease:     'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
      if (glareEl) glareEl.style.opacity = '0';
    }

    el.addEventListener('mousemove',  onMove,   { passive: true });
    el.addEventListener('mouseenter', onEnter,  { passive: true });
    el.addEventListener('mouseleave', onLeave,  { passive: true });

    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl);
      gsap.set(el, {
        rotateX: 0, rotateY: 0, scale: 1,
        clearProps: 'rotateX,rotateY,scale,transformPerspective,transformStyle',
      });
    };
  }, [maxX, maxY, glare, scale, disabled, prefersReduced]);

  return ref;
}