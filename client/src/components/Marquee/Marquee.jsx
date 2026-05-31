/* ============================================================
   Marquee.jsx
   Ronak Vaghela Portfolio — Infinite Scroll Ticker

   A single row of text scrolling infinitely leftward.
   Used between Hero and Education as a visual breath.

   Props:
     items    {string[]}  Words/phrases to repeat
     speed    {number}    Seconds for one full cycle (default 38)
     separator {string}  Character between items (default "·")
     size     {string}   "sm" | "md" (default "sm")
   ============================================================ */

import styles from './Marquee.module.css';

const DEFAULT_ITEMS = [
  'Full-Stack Developer',
  'React · Node · GSAP',
  'Available 2026',
  'Ahmedabad, India',
  'Open to Relocation',
  'AI Systems',
  'Clean Architecture',
  'B.E Computer Engineering',
  'TatvaSoft · IBM',
  '7.92 CGPA',
  '300+ Problems Solved',
  'Open to Full-Time Roles',
];

export default function Marquee({
  items     = DEFAULT_ITEMS,
  speed     = 38,
  separator = '·',
  size      = 'sm',
}) {
  /* Duplicate items so the seam is invisible */
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className={`${styles.marqueeWrapper} ${styles[`size-${size}`]}`}
      aria-hidden="true"
      role="presentation"
    >
      {/* Top rule */}
      <div className={styles.rule} />

      <div className={styles.track}>
        <div
          className={styles.inner}
          style={{ animationDuration: `${speed}s` }}
        >
          {repeated.map((item, i) => (
            <span key={i} className={styles.item}>
              <span className={styles.itemText}>{item}</span>
              <span className={styles.sep}>{separator}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div className={styles.rule} />
    </div>
  );
}