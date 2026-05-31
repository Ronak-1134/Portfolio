/* ============================================================
   Button.jsx
   Ronak Vaghela Portfolio — Button Component

   Three variants:
     primary  — filled with --color-surface, 0.5px solid border
                Hover: background deepens to --color-surface-hover
     ghost    — transparent fill, 0.5px border
                Hover: accent-faint fill, border darkens
     text     — no border, no fill, just the label + arrow
                Hover: label shifts right 3px, arrow extends

   Renders <a> when href is provided, <button> otherwise.
   Zero border-radius. 0.5px borders only.
   No icons library — arrow is a plain text glyph "→".

   Props:
     variant   {string}   — "primary" | "ghost" | "text"
     href      {string}   — renders as <a> if provided
     onClick   {function} — click handler
     children  {node}     — button label
     external  {bool}     — adds target="_blank" rel="noopener"
     disabled  {bool}     — disabled state
     className {string}   — additional class from parent
     arrow     {bool}     — append "→" arrow (default: true for text variant)
   ============================================================ */

import styles from './Button.module.css';

export default function Button({
  variant   = 'ghost',
  href,
  onClick,
  children,
  external  = false,
  disabled  = false,
  className = '',
  arrow,
}) {
  /* Default arrow: true for text variant, false for others */
  const showArrow = arrow !== undefined
    ? arrow
    : variant === 'text';

  const variantClass = {
    primary: styles.primary,
    ghost:   styles.ghost,
    text:    styles.text,
  }[variant] || styles.ghost;

  const commonProps = {
    className: `
      ${styles.btn}
      ${variantClass}
      ${disabled  ? styles.disabled : ''}
      ${className}
    `.trim().replace(/\s+/g, ' '),
    onClick:  disabled ? undefined : onClick,
    disabled: disabled || undefined,
  };

  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {showArrow && (
        <span className={styles.arrow} aria-hidden="true">→</span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        {...commonProps}
        href={href}
        target={external ? '_blank'       : undefined}
        rel={   external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <button {...commonProps} type="button">
      {inner}
    </button>
  );
}