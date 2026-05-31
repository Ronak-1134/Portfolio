/* ============================================================
   Tag.jsx
   Ronak Vaghela Portfolio — Technology Tag

   Inline label for tech stack items.
   JetBrains Mono, all-caps, tracked.
   Thin 0.5px border. No fill at rest — barely-there fill
   on hover via --color-accent-faint.
   Zero border-radius. Always.

   Props:
     label   {string}  — the tag text (e.g. "React.js")
     size    {string}  — "sm" (default) | "xs"
     muted   {bool}    — if true, use ghost ink (lower hierarchy)
   ============================================================ */

import styles from './Tag.module.css';

export default function Tag({
  label = '',
  size  = 'sm',
  muted = false,
}) {
  if (!label) return null;

  return (
    <span
      className={`
        ${styles.tag}
        ${size  === 'xs'   ? styles.tagXs    : ''}
        ${muted            ? styles.tagMuted  : ''}
      `}
    >
      {label}
    </span>
  );
}