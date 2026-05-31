/* ============================================================
   Projects.jsx
   Ronak Vaghela Portfolio — Horizontal Scroll Strip

   Projects live in a draggable horizontal strip.
   Cards are portrait orientation. Featured card is 2× wide.
   Mousewheel on the section scrolls horizontally.
   Drag with inertia via GSAP Draggable + InertiaPlugin.

   Fallback: on mobile / reduced-motion, renders as a
   standard vertical stack with no drag.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger }         from '../../utils/gsapConfig';
import { useReducedMotion }            from '../../hooks/useReducedMotion';
import SectionLabel                    from '../../components/ui/SectionLabel';
import ProjectCard                     from './ProjectCard';
import { projects }                    from '../../data/projects';
import styles                          from './Projects.module.css';

export default function Projects() {
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef(null);
  const trackRef       = useRef(null);
  const wrapRef        = useRef(null);
  const draggableRef   = useRef(null);
  const cardRefs       = useRef([]);
  const [isDragging, setIsDragging]   = useState(false);
  const [canDragLeft,  setCanDragLeft]  = useState(false);
  const [canDragRight, setCanDragRight] = useState(true);

  /* ----------------------------------------------------------
     GSAP DRAGGABLE — horizontal strip with inertia
     ---------------------------------------------------------- */
  useEffect(() => {
    if (prefersReduced) return;

    /* Dynamic import — Draggable + InertiaPlugin are optional */
    async function initDraggable() {
      const { Draggable }     = await import('gsap/Draggable');
      const { InertiaPlugin } = await import('gsap/InertiaPlugin');
      gsap.registerPlugin(Draggable, InertiaPlugin);

      const track   = trackRef.current;
      const wrap    = wrapRef.current;
      if (!track || !wrap) return;

      /* Max drag distance (negative = drag left) */
      function getMaxX() {
        return Math.min(0, wrap.offsetWidth - track.scrollWidth);
      }

      draggableRef.current = Draggable.create(track, {
        type:       'x',
        inertia:    true,
        bounds:     { minX: getMaxX(), maxX: 0 },
        edgeResistance: 0.65,
        cursor:     'none',
        onDragStart() { setIsDragging(true); },
        onDragEnd()   { setIsDragging(false); updateEdge(); },
        onDrag()      { updateEdge(); },
        onThrowComplete() { updateEdge(); },
      })[0];

      function updateEdge() {
        const x = gsap.getProperty(track, 'x');
        setCanDragLeft(x < -4);
        setCanDragRight(x > getMaxX() + 4);
      }

      /* Recalculate bounds on resize */
      const ro = new ResizeObserver(() => {
        if (draggableRef.current) {
          draggableRef.current.applyBounds({ minX: getMaxX(), maxX: 0 });
        }
      });
      ro.observe(wrap);

      return () => ro.disconnect();
    }

    initDraggable();

    return () => {
      if (draggableRef.current) draggableRef.current.kill();
    };
  }, [prefersReduced]);

  /* ----------------------------------------------------------
     WHEEL → HORIZONTAL SCROLL
     Map vertical wheel delta to horizontal drag on the strip.
     ---------------------------------------------------------- */
  useEffect(() => {
    if (prefersReduced) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    function onWheel(e) {
      const track  = trackRef.current;
      if (!track) return;

      /* Only intercept when mouse is over the strip */
      const rect = wrap.getBoundingClientRect();
      const inX  = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY  = e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inX || !inY) return;

      e.preventDefault();

      const currentX = gsap.getProperty(track, 'x');
      const maxX     = Math.min(0, wrap.offsetWidth - track.scrollWidth);
      const delta    = e.deltaY * 1.2;
      const newX     = Math.max(maxX, Math.min(0, currentX - delta));

      gsap.to(track, {
        x:        newX,
        duration: 0.55,
        ease:     'power2.out',
        overwrite: 'auto',
      });

      if (draggableRef.current) {
        draggableRef.current.update();
      }
    }

    wrap.addEventListener('wheel', onWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', onWheel);
  }, [prefersReduced]);

  /* ----------------------------------------------------------
     CARD ENTRANCE — fade up on section scroll into view
     ---------------------------------------------------------- */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length || prefersReduced) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity:  1,
        y:        0,
        duration: 0.9,
        ease:     'power3.out',
        stagger:  0.08,
        scrollTrigger: {
          trigger:       sectionRef.current,
          start:         'top 80%',
          once:          true,
          toggleActions: 'play none none none',
        },
      }
    );
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className={styles.projects}
      id="projects"
      aria-label="Projects"
    >
      {/* Section label sits above the full-bleed strip */}
      <div className={styles.header}>
        <SectionLabel number="03" label="Projects" />

        {/* Drag hint */}
        <div className={styles.dragHint} aria-hidden="true">
          {canDragLeft  && <span className={styles.dragArrow}>←</span>}
          <span className={styles.dragLabel}>drag to explore</span>
          {canDragRight && <span className={styles.dragArrow}>→</span>}
        </div>
      </div>

      {/* Full-bleed horizontal strip wrapper */}
      <div
        ref={wrapRef}
        className={`${styles.stripWrap} ${isDragging ? styles.dragging : ''}`}
        aria-label="Projects — scroll or drag horizontally"
      >
        {/* The moving track */}
        <div ref={trackRef} className={styles.track}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`
                ${styles.cardSlot}
                ${project.featured ? styles.cardSlotFeatured : ''}
              `}
            >
              <ProjectCard
                project={project}
                featured={project.featured}
                cardRef={el => cardRefs.current[i] = el}
              />
            </div>
          ))}

          {/* End cap — visual breathing room after last card */}
          <div className={styles.endCap} aria-hidden="true">
            <span className={styles.endCapText}>— end —</span>
          </div>
        </div>

        {/* Edge fade indicators */}
        {canDragLeft && (
          <div className={`${styles.edgeFade} ${styles.edgeFadeLeft}`} aria-hidden="true" />
        )}
        {canDragRight && (
          <div className={`${styles.edgeFade} ${styles.edgeFadeRight}`} aria-hidden="true" />
        )}
      </div>

      {/* Project count annotation below strip */}
      <div className={styles.footer}>
        <span className={styles.footerLabel}>
          {projects.length} projects — {projects.filter(p => p.featured).length} featured
        </span>
      </div>

    </section>
  );
}