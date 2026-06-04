/* ============================================================
   Skills.jsx — Periodic Table + Connection Lines
   Hover a cell → SVG lines draw to related skills
   ============================================================ */

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap }             from '../../utils/gsapConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import SectionLabel         from '../../components/ui/SectionLabel';
import { skills }           from '../../data/skills';
import styles               from './Skills.module.css';

/* ----------------------------------------------------------
   RELATIONSHIP MAP
   skill name → array of related skill names
   ---------------------------------------------------------- */
const RELATIONS = {
  'JavaScript':  ['React.js', 'Node.js', 'GSAP', 'Express.js'],
  'React.js':    ['JavaScript', 'Redux', 'Node.js', 'Tailwind'],
  'Node.js':     ['JavaScript', 'Express.js', 'MongoDB', 'REST APIs'],
  'Express.js':  ['Node.js', 'MongoDB', 'REST APIs', 'JavaScript'],
  'MongoDB':     ['Node.js', 'Express.js', 'Firebase'],
  'Firebase':    ['MongoDB', 'JavaScript', 'React.js'],
  'PostgreSQL':  ['Node.js', '.NET Core', 'Swagger'],
  'Python':      ['AI Agents', 'IBM Tools'],
  'GSAP':        ['JavaScript', 'React.js'],
  'HTML & CSS':  ['JavaScript', 'React.js', 'Tailwind'],
  'Tailwind':    ['HTML & CSS', 'React.js'],
  'Angular':     ['.NET Core', 'JavaScript'],
  '.NET Core':   ['Angular', 'PostgreSQL', 'C#'],
  'Git & GitHub':['JavaScript', 'Node.js', 'React.js'],
  'REST APIs':   ['Node.js', 'Express.js', 'Swagger'],
  'AWS':         ['Node.js', 'REST APIs'],
  'Swagger':     ['REST APIs', 'Express.js', '.NET Core'],
  'SQL':         ['PostgreSQL', 'MySQL'],
  'MySQL':       ['SQL', 'Node.js'],
  'Java':        ['SQL'],
  'C':           ['Java'],
};

/* ----------------------------------------------------------
   Flatten all skills into a lookup map: name → atomic index
   ---------------------------------------------------------- */
const allSkills = skills.flatMap(cat => cat.items);

/* ----------------------------------------------------------
   SkillCell
   ---------------------------------------------------------- */
function SkillCell({ skill, onHover, onLeave, isHighlighted, isActive }) {
  function profLabel(level) {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Proficient';
    if (level >= 55) return 'Competent';
    return 'Learning';
  }

  return (
    <div
      className={`
        ${styles.cell}
        ${isActive      ? styles.cellActive      : ''}
        ${isHighlighted ? styles.cellHighlighted  : ''}
        ${!isActive && !isHighlighted ? styles.cellDim : ''}
      `}
      style={{ '--prof-width': `${skill.level}%` }}
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={onLeave}
      data-skill={skill.name}
      aria-label={`${skill.name}: ${skill.level}% — ${profLabel(skill.level)}`}
    >
      <span className={styles.atomic}>{skill.atomic}</span>
      <span className={styles.symbol}>{skill.symbol}</span>
      <span className={styles.name}>{skill.name}</span>
      <span className={styles.profLabel}>{profLabel(skill.level)}</span>
      <div className={styles.profBar} aria-hidden="true">
        <div className={styles.profBarFill} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Connection SVG overlay
   Draws lines between active cell and its related cells
   ---------------------------------------------------------- */
function ConnectionLayer({ activeSkill, containerRef }) {
  const svgRef         = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const svg       = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container || !activeSkill || prefersReduced) {
      if (svg) svg.innerHTML = '';
      return;
    }

    const relations = RELATIONS[activeSkill] || [];
    if (!relations.length) return;

    /* Clear previous lines */
    svg.innerHTML = '';

    /* Size SVG to container */
    const cRect = container.getBoundingClientRect();
    svg.setAttribute('width',  cRect.width);
    svg.setAttribute('height', cRect.height);

    /* Find source cell center */
    const srcEl = container.querySelector(`[data-skill="${CSS.escape(activeSkill)}"]`);
    if (!srcEl) return;

    const srcRect = srcEl.getBoundingClientRect();
    const srcX    = srcRect.left - cRect.left + srcRect.width  / 2;
    const srcY    = srcRect.top  - cRect.top  + srcRect.height / 2;

    relations.forEach((relName, i) => {
      const tgtEl = container.querySelector(`[data-skill="${CSS.escape(relName)}"]`);
      if (!tgtEl) return;

      const tgtRect = tgtEl.getBoundingClientRect();
      const tgtX    = tgtRect.left - cRect.left + tgtRect.width  / 2;
      const tgtY    = tgtRect.top  - cRect.top  + tgtRect.height / 2;

      /* Create line */
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', srcX);
      line.setAttribute('y1', srcY);
      line.setAttribute('x2', tgtX);
      line.setAttribute('y2', tgtY);
      line.setAttribute('stroke',        '#8B5E3C');
      line.setAttribute('stroke-width',  '0.5');
      line.setAttribute('stroke-opacity', '0.5');
      line.setAttribute('stroke-linecap', 'round');

      /* Dash animation */
      const len = Math.sqrt((tgtX-srcX)**2 + (tgtY-srcY)**2);
      line.setAttribute('stroke-dasharray',  len);
      line.setAttribute('stroke-dashoffset', len);

      svg.appendChild(line);

      /* Draw in with GSAP */
      gsap.to(line, {
        strokeDashoffset: 0,
        duration:         0.4,
        ease:             'power2.out',
        delay:            i * 0.06,
      });

      /* Dot at target end */
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', tgtX);
      dot.setAttribute('cy', tgtY);
      dot.setAttribute('r',  '3');
      dot.setAttribute('fill',         '#8B5E3C');
      dot.setAttribute('fill-opacity', '0');
      svg.appendChild(dot);

      gsap.to(dot, {
        fillOpacity: 0.6,
        duration:    0.2,
        ease:        'power2.out',
        delay:       i * 0.06 + 0.35,
      });
    });

    /* Fade out on cleanup */
    return () => {
      if (svg) {
        gsap.to(Array.from(svg.children), {
          opacity:  0,
          duration: 0.15,
          ease:     'power1.in',
          onComplete: () => { if (svg) svg.innerHTML = ''; },
        });
      }
    };
  }, [activeSkill, containerRef, prefersReduced]);

  return (
    <svg
      ref={svgRef}
      className={styles.connectionLayer}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  );
}

/* ----------------------------------------------------------
   Main component
   ---------------------------------------------------------- */
export default function Skills() {
  const prefersReduced  = useReducedMotion();
  const sectionRef      = useRef(null);
  const tableRef        = useRef(null);
  const rowRefs         = useRef([]);
  const [activeSkill, setActiveSkill]   = useState(null);
  const [anyHovered,  setAnyHovered]    = useState(false);

  const handleHover = useCallback((name) => {
    setActiveSkill(name);
    setAnyHovered(true);
  }, []);

  const handleLeave = useCallback(() => {
    setActiveSkill(null);
    setAnyHovered(false);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (!rows.length || prefersReduced) return;

    rows.forEach((row, i) => {
      const cells = row.querySelectorAll('[class*="cell"]');
      gsap.fromTo(cells,
        { opacity: 0, y: 24, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: i * 0.08,
          scrollTrigger: {
            trigger: sectionRef.current, start: 'top 75%',
            once: true, toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [prefersReduced]);

  const relations = activeSkill ? (RELATIONS[activeSkill] || []) : [];

  return (
    <section ref={sectionRef} className={styles.skills} id="skills" aria-label="Skills">
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
          <div className={styles.legendItem}>
            <span className={styles.legendHint}>
              Hover a cell to see connections
            </span>
          </div>
        </div>

        {/* Table — position relative so SVG overlay can cover it */}
        <div ref={tableRef} className={styles.tableWrap}>
          <div className={styles.table}>
            {skills.map((cat, ci) => (
              <div key={cat.category} ref={el => rowRefs.current[ci] = el} className={styles.row}>
                <div className={styles.rowLabel}>
                  <span className={styles.rowCode}>{cat.categoryCode}</span>
                  <span className={styles.rowName}>{cat.category}</span>
                </div>
                <div className={styles.cells}>
                  {cat.items.map(skill => {
                    const isActive      = skill.name === activeSkill;
                    const isHighlighted = relations.includes(skill.name);
                    const isDimmed      = anyHovered && !isActive && !isHighlighted;
                    return (
                      <SkillCell
                        key={skill.name}
                        skill={skill}
                        onHover={handleHover}
                        onLeave={handleLeave}
                        isActive={isActive}
                        isHighlighted={isHighlighted}
                        isDimmed={isDimmed}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* SVG connection lines overlay */}
          <ConnectionLayer
            activeSkill={activeSkill}
            containerRef={tableRef}
          />
        </div>

        <div className={styles.footnote}>
          <span className={styles.footnoteText}>
            {allSkills.length} elements identified · proficiency self-assessed
          </span>
        </div>
      </div>
    </section>
  );
}