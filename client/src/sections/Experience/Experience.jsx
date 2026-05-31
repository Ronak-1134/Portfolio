/* ============================================================
   Experience.jsx — Full-Bleed Magazine Spread
   Ronak Vaghela Portfolio

   Each company entry is a full-viewport-width block:
     — Giant ghost company name printed behind everything
       at ~18vw, outline-only, sepia stroke
     — On top: a tight content column with role, period,
       description, tags
     — Blueprint registration marks at section corners
     — Horizontal ruled line separates the two entries

   Scroll: company name parallaxes at a different rate to
   the content — creates depth between layers.
   Content column fades + slides up on scroll reveal.
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../../utils/gsapConfig';
import { useReducedMotion }  from '../../hooks/useReducedMotion';
import SectionLabel          from '../../components/ui/SectionLabel';
import Tag                   from '../../components/ui/Tag';
import { experience }        from '../../data/experience';
import styles                from './Experience.module.css';

function ExperienceEntry({ item, index, isLast }) {
  const prefersReduced = useReducedMotion();
  const entryRef       = useRef(null);
  const bgNameRef      = useRef(null);
  const contentRef     = useRef(null);

  /* Content reveal on scroll */
  useEffect(() => {
    const content = contentRef.current;
    if (!content || prefersReduced) return;

    gsap.fromTo(
      content.children,
      { opacity: 0, y: 28 },
      {
        opacity:  1,
        y:        0,
        duration: 0.8,
        ease:     'power3.out',
        stagger:  0.09,
        scrollTrigger: {
          trigger:       entryRef.current,
          start:         'top 78%',
          once:          true,
          toggleActions: 'play none none none',
        },
      }
    );
  }, [prefersReduced]);

  /* Ghost name parallax — moves slower than scroll */
  useEffect(() => {
    const bgName = bgNameRef.current;
    if (!bgName || prefersReduced) return;

    const tween = gsap.fromTo(
      bgName,
      { x: index % 2 === 0 ? '-2%' : '2%' },
      {
        x:    index % 2 === 0 ? '1%' : '-1%',
        ease: 'none',
        scrollTrigger: {
          trigger: entryRef.current,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.2,
        },
      }
    );

    return () => tween.scrollTrigger?.kill();
  }, [prefersReduced, index]);

  return (
    <article
      ref={entryRef}
      className={`${styles.entry} ${index % 2 !== 0 ? styles.entryAlt : ''}`}
      aria-label={`${item.company} — ${item.role}`}
    >
      {/* Blueprint registration marks on entry corners */}
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />

      {/* Giant ghost company name — decorative background */}
      <div
        ref={bgNameRef}
        className={styles.bgName}
        aria-hidden="true"
      >
        {item.company}
      </div>

      {/* Content column — sits on top of ghost name */}
      <div
        ref={contentRef}
        className={styles.content}
      >
        {/* Period — small mono, top */}
        <time className={styles.period} dateTime={item.period}>
          {item.period}
        </time>

        {/* Role — mono all-caps */}
        <p className={styles.role}>{item.role}</p>

        {/* Company — medium Cormorant */}
        <h3 className={styles.company}>{item.company}</h3>

        {/* Divider */}
        <div className={styles.rule} aria-hidden="true" />

        {/* Description */}
        <p className={styles.description}>{item.description}</p>

        {/* Tags */}
        <div className={styles.tags} aria-label="Technologies used">
          {item.tags.map(tag => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* Bottom rule — between entries, not after last */}
      {!isLast && (
        <div className={styles.entryDivider} aria-hidden="true" />
      )}
    </article>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className={styles.experience}
      id="experience"
      aria-label="Work Experience"
    >
      {/* Section label — inside container above the full-bleed entries */}
      <div className={styles.labelWrap}>
        <SectionLabel number="02" label="Experience" />
      </div>

      {/* Full-bleed entries — each spans 100vw */}
      <div className={styles.entries}>
        {experience.map((item, i) => (
          <ExperienceEntry
            key={item.id}
            item={item}
            index={i}
            isLast={i === experience.length - 1}
          />
        ))}
      </div>
    </section>
  );
}