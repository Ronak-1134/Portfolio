/* ============================================================
   Contact.jsx — Telegram / Letter Form
   No backend. Uses EmailJS to send directly from the browser.
   Resume links to a public PDF you host anywhere (Google Drive,
   Notion, Vercel public folder, etc.)

   Setup (free):
     1. Create account at emailjs.com
     2. Add an Email Service (Gmail works)
     3. Create a Template with variables:
          {{from_name}}, {{from_email}}, {{message}}
     4. Add to client/.env.local:
          VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
          VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
          VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
          VITE_RESUME_URL=https://your-resume-link.pdf
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap }             from '../../utils/gsapConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import SectionLabel         from '../../components/ui/SectionLabel';
import Button               from '../../components/ui/Button';
import Envelope             from '../../components/Envelope/Envelope';
import styles               from './Contact.module.css';

const LINKS = [
  {
    label: 'Email', value: 'ronakvaghela3355@gmail.com',
    href: 'mailto:ronakvaghela3355@gmail.com', external: false,
    annotation: 'primary contact',
  },
  {
    label: 'GitHub', value: 'github.com/ronakvaghela',
    href: 'https://github.com/ronakvaghela', external: true,
    annotation: 'source code',
  },
  {
    label: 'LinkedIn', value: 'linkedin.com/in/ronak-vaghela',
    href: 'https://linkedin.com/in/ronak-vaghela', external: true,
    annotation: 'professional',
  },
];

function getTodayStamp() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

const EMPTY = { name: '', email: '', message: '' };

/* ---- Send via EmailJS (loaded from CDN, no npm needed) ---- */
async function sendViaEmailJS(form) {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  /* Fallback: if EmailJS not configured, open native mailto */
  if (!serviceId || !templateId || !publicKey) {
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body    = encodeURIComponent(form.message);
    window.location.href =
      `mailto:ronakvaghela3355@gmail.com?subject=${subject}&body=${body}`;
    return { success: true, fallback: true };
  }

  /* Lazy-load EmailJS SDK */
  if (!window.emailjs) {
    await new Promise((resolve, reject) => {
      const script  = document.createElement('script');
      script.src    = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.emailjs.init({ publicKey });
  }

  const result = await window.emailjs.send(serviceId, templateId, {
    from_name:  form.name,
    from_email: form.email,
    message:    form.message,
    reply_to:   form.email,
  });

  if (result.status !== 200) throw new Error('EmailJS returned non-200');
  return { success: true };
}

export default function Contact() {
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef(null);
  const headingRef     = useRef(null);
  const linksRef       = useRef(null);
  const paperRef       = useRef(null);

  const [form,     setForm]     = useState(EMPTY);
  const [status,   setStatus]   = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFolded, setIsFolded] = useState(false);

  /* Scroll reveal */
  useEffect(() => {
    if (prefersReduced) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
    });
    tl.fromTo(headingRef.current,
      { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );
    if (linksRef.current?.children) {
      tl.fromTo(Array.from(linksRef.current.children),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09 },
        '-=0.5'
      );
    }
    tl.fromTo(paperRef.current,
      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
    return () => tl.kill();
  }, [prefersReduced]);

  /* Paper fold */
  const foldPaper = useCallback(() => {
    if (prefersReduced) return Promise.resolve();
    return new Promise(resolve => {
      const paper = paperRef.current;
      if (!paper) return resolve();
      gsap.timeline({ onComplete: resolve })
        .to(paper, {
          rotateX: -8, scaleY: 0.96,
          transformPerspective: 900, transformOrigin: 'top center',
          opacity: 0.7, duration: 0.35, ease: 'power2.in',
        })
        .to(paper, { rotateX: 0, scaleY: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
    });
  }, [prefersReduced]);

  const unfoldPaper = useCallback(() => {
    if (prefersReduced) return;
    gsap.fromTo(paperRef.current,
      { rotateX: -6, scaleY: 0.97, opacity: 0.8 },
      { rotateX: 0, scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, [prefersReduced]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Name, email, and message are all required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('A valid email address is required.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    await foldPaper();

    try {
      await sendViaEmailJS(form);
      setStatus('success');
      setIsFolded(true);
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to send. Click to email directly instead.');
      unfoldPaper();
    }
  }

  /* Resume URL — set VITE_RESUME_URL in .env.local */
  const resumeUrl = import.meta.env.VITE_RESUME_URL || '/ronak-vaghela-resume.pdf';
  const disabled  = status === 'sending' || status === 'success';

  return (
    <section ref={sectionRef} className={styles.contact} id="contact" aria-label="Contact">
      <div className={styles.inner}>

        <SectionLabel number="05" label="Contact" />

        {/* Heading */}
        <div ref={headingRef} className={styles.headingBlock}>
          <h2 className={styles.heading}>Draw up a brief.</h2>
          <div className={styles.headingRule} aria-hidden="true" />
          <p className={styles.subline}>Open to full-time roles and interesting problems.</p>
        </div>

        <div className={styles.body}>

          {/* LEFT */}
          <div ref={linksRef} className={styles.leftCol}>
            {LINKS.map(link => (
              <div key={link.label} className={styles.linkItem}>
                <div className={styles.linkMeta}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  <span className={styles.linkAnnotation}>{link.annotation}</span>
                </div>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={styles.linkValue}
                >
                  <span className={styles.linkArrow} aria-hidden="true" />
                  {link.value}
                </a>
              </div>
            ))}

            {/* Resume download — just a link */}
            <div className={styles.resumeBlock}>
              <Button
                variant="ghost"
                href={resumeUrl}
                target="_blank"
                download="ronak-vaghela-resume.pdf"
              >
                Download Resume ↓
              </Button>
              <p className={styles.resumeHint}>
                Set VITE_RESUME_URL in .env.local to any public PDF link
              </p>
            </div>
          </div>

          {/* RIGHT — Letter form */}
          <div
            ref={paperRef}
            className={`${styles.paper} ${isFolded ? styles.paperSent : ''}`}
            style={{ opacity: 0 }}
          >
            {status === 'success' ? (
              <Envelope
                onSendAnother={() => {
                  setStatus('idle');
                  setIsFolded(false);
                  unfoldPaper();
                }}
              />
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.letterHeader}>
                  <div className={styles.letterTo}>
                    <span className={styles.letterHeaderLabel}>To</span>
                    <span className={styles.letterHeaderValue}>Ronak Vaghela</span>
                  </div>
                  <div className={styles.letterFrom}>
                    <span className={styles.letterHeaderLabel}>From</span>
                    <input className={styles.letterInput} type="text" name="name"
                      value={form.name} onChange={handleChange}
                      placeholder="Your name" autoComplete="name" disabled={disabled} />
                  </div>
                  <div className={styles.letterEmail}>
                    <span className={styles.letterHeaderLabel}>Email</span>
                    <input className={styles.letterInput} type="email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="your@email.com" autoComplete="email" disabled={disabled} />
                  </div>
                  <div className={styles.letterDate}>
                    <span className={styles.letterHeaderLabel}>Date</span>
                    <span className={styles.letterDateValue}>{getTodayStamp()}</span>
                  </div>
                </div>

                <div className={styles.letterRule} aria-hidden="true" />

                <textarea
                  className={styles.letterBody}
                  name="message" value={form.message} onChange={handleChange}
                  placeholder={"Dear Ronak,\n\nI'd like to discuss…"}
                  rows={8} disabled={disabled}
                />

                <div className={styles.letterFooter}>
                  {status === 'error' && errorMsg && (
                    <p className={styles.errorMsg} role="alert">{errorMsg}</p>
                  )}
                  <button type="submit" className={styles.sendBtn} disabled={disabled}>
                    {status === 'sending' ? 'Sending…' : 'Send →'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <div className={styles.footerRule} />
          <div className={styles.footerRow}>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} Ronak Vaghela</p>
            <p className={styles.footerCraft}>Crafted with intention</p>
          </div>
        </div>
      </footer>
    </section>
  );
}