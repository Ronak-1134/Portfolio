/* ============================================================
   Button.jsx
   Ronak Vaghela Portfolio — Magnetic Button Component

   Variants: primary | ghost | text
   Magnetic pull on primary + ghost variants.
   Renders <a> when href provided, <button> otherwise.
   ============================================================ */

import { useMagnet } from '../../hooks/useMagnet';
import styles        from './Button.module.css';

export default function Button({
  variant   = 'ghost',
  href,
  target,
  onClick,
  children,
  disabled  = false,
  className = '',
  download  = false,
  type      = 'button',
  /* Magnet config — override per instance if needed */
  magnetStrength = 0.35,
  magnetRadius   = 90,
  ...rest
}) {
  /* Only magnetise primary and ghost — text buttons are inline */
  const isMagnetic = variant === 'primary' || variant === 'ghost';

  const magnetRef = useMagnet({
    strength: magnetStrength,
    radius:   magnetRadius,
    disabled: !isMagnetic || disabled,
  });

  const classNames = [
    styles.btn,
    styles[`btn--${variant}`],
    isMagnetic ? styles['btn--magnetic'] : '',
    disabled ? styles['btn--disabled'] : '',
    className,
  ].filter(Boolean).join(' ');

  const sharedProps = {
    className,
    onClick,
    ...rest,
  };

  if (href) {
    return (
      <a
        ref={magnetRef}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classNames}
        download={download || undefined}
        aria-disabled={disabled}
        {...sharedProps}
      >
        <span className={styles.btnInner}>{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={magnetRef}
      type={type}
      className={classNames}
      disabled={disabled}
      {...sharedProps}
    >
      <span className={styles.btnInner}>{children}</span>
    </button>
  );
}