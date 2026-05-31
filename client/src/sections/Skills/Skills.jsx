/* ============================================================
   Skills.jsx — Periodic Table Grid
   Ronak Vaghela Portfolio

   Each skill is a cell:
     — Atomic number (top-left, JetBrains Mono tiny)
     — Symbol (centre, Cormorant large)
     — Full name (bottom-centre, DM Sans small)
     — Proficiency bar (very thin, bottom edge of cell)

   Cells are grouped into category rows.
   Category label floats above each row as a column header.

   Hover: cell lifts, symbol enlarges slightly, proficiency
   number appears in the top-right corner.

   Scroll reveal: cells stagger in row by row.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { gsap }                        from '../../utils/gsapConfig';
import { useReducedMotion }            from '../../hooks/useReducedMotion';
import SectionLabel                    from '../../components/ui/SectionLabel';
import { skills }                      from '../../data/skills';
import styles                          from './Skills.module.css';

/* ----------------------------------------------------------
   Single skill cell
   ---------------------------------------------------------- */
function SkillCell({ skill, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const cellRef = useRef(null);

  /* Map level 0–100 to a proficiency label */
  function profLabel(level) {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Proficient';
    if (level >= 55) return 'Competent';
    return 'Learning';
  }

  return (
    <div
      ref={cellRef}
      className={styles.cell}
      style={{ '--prof-width': `${skill.level}%`, '--cell-delay': `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${skill.name}: ${skill.level}% proficiency — ${profLabel(skill.level)}`}
      data-cursor="link"
    >
      {/* Atomic number — top left */}
      <span className={styles.atomic}>{skill.atomic}</span>

      {/* Proficiency level — top right, appears on hover */}
      <span className={`${styles.profLevel} ${hovered ? styles.profLevelVisible : ''}`}>
        {skill.level}
      </span>

      {/* Symbol — the centrepiece */}
      <span className={styles.symbol}>{skill.symbol}</span>

      {/* Full name */}
      <span className={styles.name}>{skill.name}</span>

      {/* Proficiency label */}
      <span className={styles.profLabel}>{profLabel(skill.level)}</span>

      {/* Thin proficiency bar at the bottom */}
      <div className={styles.profBar} aria-hidden="true">
        <div className={styles.profBarFill} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Main component
   ---------------------------------------------------------- */
export default function Skills() {
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef(null);
  const rowRefs        = useRef([]);

  /* Stagger each category row on scroll */
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (!rows.length || prefersReduced) return;

    rows.forEach((row, i) => {
      const cells = row.querySelectorAll('[class*="cell"]');
      gsap.fromTo(
        cells,
        { opacity: 0, y: 24, scale: 0.94 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 0.6,
          ease:     'power3.out',
          stagger:  0.05,
          delay:    i * 0.08,
          scrollTrigger: {
            trigger:       sectionRef.current,
            start:         'top 75%',
            once:          true,
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [prefersReduced]);

  /* Build flat atomic index offset per category */
  let atomicOffset = 0;

  return (
    <section
      ref={sectionRef}
      className={styles.skills}
      id="skills"
      aria-label="Skills"
    >
      <div className={styles.inner}>

        <SectionLabel number="04" label="Skills" />

        {/* Legend */}
        <div className={styles.legend} aria-hidden="true">
          <div className={styles.legendItem}>
            <span className={styles.legendAtomic}>n</span>
            <span className={styles.legendText}>Index</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSymbol}>Sy</span>
            <span className={styles.legendText}>Symbol</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendBar} />
            <span className={styles.legendText}>Proficiency</span>
          </div>
        </div>

        {/* Category rows */}
        <div className={styles.table}>
          {skills.map((cat, ci) => {
            const rowStart = atomicOffset;
            atomicOffset += cat.items.length;

            return (
              <div
                key={cat.category}
                ref={el => rowRefs.current[ci] = el}
                className={styles.row}
              >
                {/* Category label — left of the row */}
                <div className={styles.rowLabel}>
                  <span className={styles.rowCode}>{cat.categoryCode}</span>
                  <span className={styles.rowName}>{cat.category}</span>
                </div>

                {/* Skill cells */}
                <div className={styles.cells}>
                  {cat.items.map((skill, si) => (
                    <SkillCell
                      key={skill.name}
                      skill={skill}
                      delay={si * 0.04}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom annotation */}
        <div className={styles.footnote} aria-hidden="true">
          <span className={styles.footnoteText}>
            {skills.reduce((acc, cat) => acc + cat.items.length, 0)} elements identified ·
            proficiency self-assessed
          </span>
        </div>

      </div>
    </section>
  );
}