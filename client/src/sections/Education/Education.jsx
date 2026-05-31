/* ============================================================
   Education.jsx
   Ronak Vaghela Portfolio — Education Section

   Layout:
     SectionLabel "01 — Education"
     SVG ruler graphic spanning full table width
     Table with three rows: SSC, HSC, B.E
     Columns: Examination · Board · Institution · Year · Result

   Aesthetic: a filled-in academic form.
   Borders 0.5px. Institution names in Cormorant italic.
   Scores and years in JetBrains Mono.
   Each row reveals on scroll with 150ms stagger.
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../../utils/gsapConfig';
import SectionLabel          from '../../components/ui/SectionLabel';
import CountUp               from '../../components/CountUp/CountUp';
import { education }         from '../../data/education';
import styles                from './Education.module.css';

/* ------------------------------------------------------------
   RULER SVG
   A horizontal measurement ruler above the table.
   Tick marks at every 10px, longer marks every 5th.
   Rendered inline so it scales with the table.
   ------------------------------------------------------------ */
function RulerSVG({ width = 800 }) {
  const TICK_INTERVAL  = 10;   /* px between minor ticks  */
  const MINOR_H        =  6;   /* minor tick height        */
  const MAJOR_H        = 12;   /* major tick height (×5)   */
  const LABEL_EVERY    =  5;   /* label every 5th major    */
  const TOTAL_TICKS    = Math.floor(width / TICK_INTERVAL);

  const ticks = [];
  for (let i = 0; i <= TOTAL_TICKS; i++) {
    const x       = i * TICK_INTERVAL;
    const isMajor = i % 5 === 0;
    const hasLabel = isMajor && i % (5 * LABEL_EVERY) === 0 && i > 0;
    ticks.push({ x, isMajor, hasLabel, value: i * TICK_INTERVAL });
  }

  return (
    <svg
      className={styles.ruler}
      viewBox={`0 0 ${width} 28`}
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Base line */}
      <line
        x1="0"   y1="0"
        x2={width} y2="0"
        stroke="#C4B89A"
        strokeWidth="0.5"
      />

      {/* Ticks */}
      {ticks.map(({ x, isMajor, hasLabel, value }) => (
        <g key={x}>
          <line
            x1={x}
            y1="0"
            x2={x}
            y2={isMajor ? MAJOR_H : MINOR_H}
            stroke={isMajor ? '#B5AA96' : '#C4B89A'}
            strokeWidth="0.5"
          />
          {hasLabel && (
            <text
              x={x}
              y={MAJOR_H + 10}
              fontSize="6"
              fontFamily="'JetBrains Mono', monospace"
              fill="#B5AA96"
              textAnchor="middle"
              letterSpacing="0.05em"
            >
              {value}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------
   COMPONENT
   ------------------------------------------------------------ */
export default function Education() {
  const sectionRef = useRef(null);
  const tableRef   = useRef(null);
  const rulerRef   = useRef(null);
  const rowRefs    = useRef([]);

  /* ----------------------------------------------------------
     SCROLL REVEAL
     Ruler draws from left (scaleX 0→1).
     Table rows stagger in with 150ms delay between each.
     ---------------------------------------------------------- */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      gsap.set([rulerRef.current, ...rowRefs.current], {
        opacity: 1, y: 0, scaleX: 1, clearProps: 'all',
      });
      return;
    }

    /* Ruler scaleX reveal */
    gsap.fromTo(
      rulerRef.current,
      { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.0, ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 80%',
          once:    true,
        },
      }
    );

    /* Table header reveal */
    gsap.fromTo(
      tableRef.current?.querySelector('thead'),
      { opacity: 0, y: 12 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 78%',
          once:    true,
        },
        delay: 0.2,
      }
    );

    /* Rows stagger — 150ms between each */
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          ease:     'power3.out',
          delay:    0.4 + i * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 75%',
            once:    true,
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className={`${styles.section} section-base`}
      aria-labelledby="education-heading"
    >
      <div className="section-wrapper">

        {/* ---- SECTION LABEL ---- */}
        <div className={styles.labelRow} data-reveal>
          <SectionLabel number="01" label="Education" />
        </div>

        {/* ---- HEADING ---- */}
        <h2
          id="education-heading"
          className={styles.heading}
          data-reveal
        >
          Academic Record
        </h2>

        {/* ---- RULER ---- */}
        <div ref={rulerRef} className={styles.rulerWrapper}>
          <RulerSVG />
        </div>

        {/* ---- TABLE ---- */}
        <div className={styles.tableWrapper}>
          <table
            ref={tableRef}
            className={styles.table}
            aria-label="Education history"
          >
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.th} scope="col">Examination</th>
                <th className={styles.th} scope="col">Board</th>
                <th className={styles.th} scope="col">Institution</th>
                <th className={`${styles.th} ${styles.thCenter}`} scope="col">Year</th>
                <th className={`${styles.th} ${styles.thRight}`}  scope="col">Result</th>
              </tr>
            </thead>

            <tbody>
              {education.map((row, i) => (
                <tr
                  key={row.id}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className={`${styles.row} ${row.id === 'be' ? styles.rowFeatured : ''}`}
                >
                  {/* Examination */}
                  <td className={styles.td}>
                    <span className={styles.examinationName}>
                      {row.examination}
                    </span>
                  </td>

                  {/* Board */}
                  <td className={styles.td}>
                    <span className={styles.boardName}>
                      {row.board}
                    </span>
                  </td>

                  {/* Institution */}
                  <td className={styles.td}>
                    <span className={styles.institutionName}>
                      {row.institution}
                    </span>
                    <span className={styles.institutionLocation}>
                      {row.location}
                    </span>
                  </td>

                  {/* Year */}
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <span className={styles.yearValue}>
                      {row.year}
                    </span>
                  </td>

                  {/* Result */}
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    <span className={styles.resultValue}>
                      <CountUp
                        target={parseFloat(row.result)}
                        decimals={row.result.includes('.') ? row.result.split('.')[1].length : 0}
                        suffix=""
                        duration={1600}
                      />
                      <span className={styles.resultType}>
                        {row.resultType}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---- FOOTNOTE ---- */}
        <div className={styles.footnote} data-reveal>
          <span className={styles.footnoteText}>
            ↳ Currently enrolled · Expected graduation 2026
          </span>
        </div>

      </div>
    </section>
  );
}