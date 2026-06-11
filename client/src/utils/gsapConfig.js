/* ============================================================
   gsapConfig.js
   Ronak Vaghela Portfolio — GSAP Configuration
   ============================================================ */

import { gsap }           from 'gsap';
import { ScrollTrigger }  from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase }     from 'gsap/CustomEase';

// ✅ Register at module level — before any function calls
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

export function registerGSAP() {
  CustomEase.create('unfold',  'M0,0 C0.16,1 0.3,1 1,1');
  CustomEase.create('ink',     'M0,0 C0.4,0 0.2,1 1,1');
  CustomEase.create('measure', 'M0,0 C0.25,0 0.1,1 1,1');

  gsap.defaults({
    ease:     'power3.out',
    duration: 0.9,
  });

  ScrollTrigger.config({
    limitCallbacks:     true,
    ignoreMobileResize: true,
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
}

export function createScrollReveal(targets, options = {}) {
  const {
    trigger,
    start       = 'top 85%',
    once        = true,
    stagger     = 0.12,
    duration    = 0.9,
    ease        = 'power3.out',
    y           = 30,
    rotate      = false,
    onComplete,
  } = options;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(targets, { opacity: 1, y: 0, rotateX: 0, clearProps: 'all' });
    return null;
  }

  const fromVars = {
    opacity: 0,
    y,
    ...(rotate ? { rotateX: 8, transformPerspective: 800 } : {}),
  };

  const toVars = {
    opacity:  1,
    y:        0,
    duration,
    ease,
    stagger,
    onComplete,
    ...(rotate ? { rotateX: 0 } : {}),
    scrollTrigger: {
      trigger: trigger || (Array.isArray(targets) ? targets[0] : targets),
      start,
      once,
      toggleActions: 'play none none none',
    },
  };

  return gsap.fromTo(targets, fromVars, toVars);
}

export function createLineDraw(el, length, options = {}) {
  const {
    trigger,
    start    = 'top 88%',
    duration = 1.2,
    ease     = 'ink',
    delay    = 0,
  } = options;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(el, { strokeDashoffset: 0, opacity: 1 });
    return null;
  }

  gsap.set(el, {
    strokeDasharray:  length,
    strokeDashoffset: length,
    opacity:          1,
  });

  return gsap.to(el, {
    strokeDashoffset: 0,
    duration,
    ease,
    delay,
    scrollTrigger: {
      trigger: trigger || el,
      start,
      once: true,
      toggleActions: 'play none none none',
    },
  });
}

export function createSkillBar(barEl, targetWidth, options = {}) {
  const {
    trigger,
    start  = 'top 80%',
    delay  = 0,
  } = options;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(barEl, { width: `${targetWidth}%` });
    return null;
  }

  gsap.set(barEl, { width: '0%' });

  return gsap.to(barEl, {
    width:    `${targetWidth}%`,
    duration: 1.4,
    ease:     'measure',
    delay,
    scrollTrigger: {
      trigger: trigger || barEl,
      start,
      once: true,
      toggleActions: 'play none none none',
    },
  });
}

export function killScrollTriggers(triggers = []) {
  triggers.forEach(trigger => {
    if (trigger && typeof trigger.kill === 'function') trigger.kill();
  });
}

export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const navHeight = 56;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;

  window.scrollTo({ top, behavior: 'smooth' });
}

export { gsap, ScrollTrigger };