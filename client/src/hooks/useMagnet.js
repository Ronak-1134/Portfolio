/* ============================================================
   useMagnet.js
   Ronak Vaghela Portfolio — Magnetic Element Hook

   When the cursor enters a radius around the element,
   the element drifts toward the cursor at a reduced ratio.
   When the cursor leaves, it springs back to origin.

   Uses GSAP quickSetter for 60fps performance —
   no layout recalculation, pure transform.

   Usage:
     const magnetRef = useMagnet({ strength: 0.3, radius: 80 });
     <button ref={magnetRef}>Click me</button>

   Props:
     strength  {number}  How far element moves (0–1). Default 0.3
     radius    {number}  Pixel distance to start attracting. Default 80
     disabled  {boolean} Pass true to disable (e.g. touch devices)
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../utils/gsapConfig';
import { useReducedMotion }  from './useReducedMotion';

export function useMagnet({
  strength = 0.3,
  radius   = 80,
  disabled = false,
} = {}) {
  const ref            = useRef(null);
  const prefersReduced = useReducedMotion();
  const boundRef       = useRef(null);
  const activeRef      = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || prefersReduced) return;

    /* Disable on touch devices */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    /* quickSetter: bypasses the GSAP tween engine for raw speed */
    const setX = gsap.quickSetter(el, 'x', 'px');
    const setY = gsap.quickSetter(el, 'y', 'px');

    function getCenter() {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width  / 2,
        y: r.top  + r.height / 2,
      };
    }

    function onMouseMove(e) {
      const center = getCenter();
      const dx     = e.clientX - center.x;
      const dy     = e.clientY - center.y;
      const dist   = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        /* Inside radius — drift toward cursor */
        if (!activeRef.current) {
          activeRef.current = true;
          el.classList.add('magnet-active');
        }

        /* Strength falls off toward the edge of the radius */
        const pull = (1 - dist / radius) * strength;
        setX(dx * pull);
        setY(dy * pull);
      } else if (activeRef.current) {
        /* Just left the radius — spring back */
        activeRef.current = false;
        el.classList.remove('magnet-active');

        gsap.to(el, {
          x:        0,
          y:        0,
          duration: 0.6,
          ease:     'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      }
    }

    function onMouseLeave() {
      if (!activeRef.current) return;
      activeRef.current = false;
      el.classList.remove('magnet-active');

      gsap.to(el, {
        x:        0,
        y:        0,
        duration: 0.6,
        ease:     'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }

    window.addEventListener('mousemove',  onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      /* Reset position on unmount */
      gsap.set(el, { x: 0, y: 0, clearProps: 'x,y' });
    };
  }, [strength, radius, disabled, prefersReduced]);

  return ref;
}