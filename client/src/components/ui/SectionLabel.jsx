/* ============================================================
   SectionLabel.jsx
   Ronak Vaghela Portfolio — Blueprint Section Numbering

   Renders: "01 — SECTION TITLE"
   The number and dash are in --color-ink-ghost.
   The title is in --color-ink-secondary.
   A short sepia rule sits to the left of the number.

   Used at the top of every section to orient the reader
   the way a blueprint uses registration marks and callouts.

   Props:
     number  {string}   — "01", "02", etc.
     label   {string}   — section title text
     align   {string}   — "left" (default) | "right"
   ============================================================ */

import styles from './SectionLabel.module.css';

export default function SectionLabel({
  number = '01',
  label  = '',
  align  = 'left',
}) {
  return (
    <div
      className={`${styles.wrapper} ${align === 'right' ? styles.right : ''}`}
      aria-label={`Section ${number}: ${label}`}
    >
      {/* Short tick rule — a measurement mark */}
      <span className={styles.tick} aria-hidden="true" />

      {/* Number */}
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>

      {/* Em dash separator */}
      <span className={styles.dash} aria-hidden="true">—</span>

      {/* Label */}
      <span className={styles.label}>
        {label}
      </span>
    </div>
  );
}