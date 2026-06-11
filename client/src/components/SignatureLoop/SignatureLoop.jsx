import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapConfig';
import styles from './SignatureLoop.module.css';

const R = 'M 20,15 L 20,95 M 20,15 C 20,15 60,15 60,42 C 60,68 20,68 20,68 M 20,68 L 58,95';
const V = 'M 82,15 L 116,95 L 150,15';

export default function SignatureLoop() {
  const rRef   = useRef(null);
  const vRef   = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const r   = rRef.current;
    const v   = vRef.current;
    const dot = dotRef.current;
    if (!r || !v || !dot) return;

    const rLen = r.getTotalLength();
    const vLen = v.getTotalLength();

    function animate() {
      const tl = gsap.timeline({
        onComplete: () => {
          /* Pause, then erase and redraw */
          gsap.delayedCall(1.2, erase);
        }
      });

      gsap.set(r,   { strokeDasharray: rLen, strokeDashoffset: rLen, opacity: 1 });
      gsap.set(v,   { strokeDasharray: vLen, strokeDashoffset: vLen, opacity: 1 });
      gsap.set(dot, { scale: 0, opacity: 0, transformOrigin: 'center' });

      tl.to(r,   { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' })
        .to(dot,  { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' }, '-=0.1')
        .to(v,    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '+=0.1');
    }

    function erase() {
      gsap.to([rRef.current, vRef.current, dotRef.current], {
        opacity:  0,
        duration: 0.5,
        ease:     'power2.in',
        onComplete: () => gsap.delayedCall(0.4, animate),
      });
    }

    const start = gsap.delayedCall(0.3, animate);
    return () => {
      start.kill();
      gsap.killTweensOf([r, v, dot]);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 170 110" fill="none" aria-label="RV signature">
        <path ref={rRef} d={R} stroke="#2C2416" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path ref={vRef} d={V} stroke="#2C2416" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle ref={dotRef} cx="160" cy="95" r="2.5" fill="#8B5E3C" />
      </svg>
      <span className={styles.label}>Ronak Vaghela · Signature</span>
    </div>
  );
}