/* ============================================================
   Contact.jsx — Telegram / Letter Form
   Ronak Vaghela Portfolio

   Layout:
     — SectionLabel + heading "Draw up a brief."
     — Left column: annotated links + resume button
     — Right column: the letter form
         Header: "To: Ronak Vaghela  ·  From: [name]"
         Date stamp (auto-filled, today's date)
         One large textarea — the letter body
         Inline name + email fields at the top
         Send button bottom-right: "Send →"

   On submit:
     — The paper "folds" — CSS perspective fold animation
     — After fold completes: "Received." appears
     — Unfolds if there's an error

   POST → /api/contact
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap }                   from '../../utils/gsapConfig';
import { useReducedMotion }       from '../../hooks/useReducedMotion';
import SectionLabel               from '../../components/ui/SectionLabel';
import Button                     from '../../components/ui/Button';
import styles                     from './Contact.module.css';

/* ---- Links ---- */
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

/* ---- Today's date for the letter stamp ---- */
function getTodayStamp() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef(null);
  const headingRef     = useRef(null);
  const linksRef       = useRef(null);
  const paperRef       = useRef(null);

  const [form,          setForm]          = useState(EMPTY);
  const [status,        setStatus]        = useState('idle');
  const [errorMsg,      setErrorMsg]      = useState('');
  const [isFolded,      setIsFolded]      = useState(false);

  /* ---- Scroll reveal ---- */
  useEffect(() => {
    if (prefersReduced) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top 78%',
        once:    true,
      },
    });
    tl.fromTo(headingRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );
    if (linksRef.current?.children) {
      tl.fromTo(Array.from(linksRef.current.children),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09 },
        '-=0.5'
      );
    }
    tl.fromTo(paperRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
    return () => tl.kill();
  }, [prefersReduced]);

  /* ---- Paper fold animation ---- */
  const foldPaper = useCallback(() => {
    if (prefersReduced) return Promise.resolve();
    return new Promise(resolve => {
      const paper = paperRef.current;
      if (!paper) return resolve();
      gsap.timeline({ onComplete: resolve })
        .to(paper, {
          rotateX:             -8,
          scaleY:              0.96,
          transformPerspective: 900,
          transformOrigin:     'top center',
          opacity:             0.7,
          duration:            0.35,
          ease:                'power2.in',
        })
        .to(paper, {
          rotateX:  0,
          scaleY:   1,
          opacity:  1,
          duration: 0.25,
          ease:     'power2.out',
        });
    });
  }, [prefersReduced]);

  const unfoldPaper = useCallback(() => {
    if (prefersReduced) return;
    gsap.fromTo(paperRef.current,
      { rotateX: -6, scaleY: 0.97, opacity: 0.8 },
      { rotateX: 0, scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, [prefersReduced]);

  /* ---- Handlers ---- */
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Name, email, and message are all required.');
      unfoldPaper();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('A valid email address is required.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    /* Fold paper while sending */
    await foldPaper();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/contact`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Something went wrong.');
      }
      setStatus('success');
      setIsFolded(true);
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send. Please email directly.');
      unfoldPaper();
    }
  }

  const disabled = status === 'sending' || status === 'success';

  return (
    <section
      ref={sectionRef}
      className={styles.contact}
      id="contact"
      aria-label="Contact"
    >
      <div className={styles.inner}>

        <SectionLabel number="05" label="Contact" />

        {/* ---- HEADING ---- */}
        <div ref={headingRef} className={styles.headingBlock}>
          <h2 className={styles.heading}>Draw up a brief.</h2>
          {/* Sepia rule — accent #4 of 4 */}
          <div className={styles.headingRule} aria-hidden="true" />
          <p className={styles.subline}>
            Open to full-time roles and interesting problems.
          </p>
        </div>

        {/* ---- BODY ---- */}
        <div className={styles.body}>

          {/* LEFT — Links */}
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

            {/* Resume */}
            <div className={styles.resumeBlock}>
              <Button
                variant="ghost"
                href="/ronak-vaghela-resume.pdf"
                target="_blank"
                download
              >
                Download Resume ↓
              </Button>
              <p className={styles.resumeError} style={{ opacity: 0.6 }}>
                Place your PDF at: client/public/ronak-vaghela-resume.pdf
              </p>
            </div>
          </div>

          {/* RIGHT — The Letter */}
          <div
            ref={paperRef}
            className={`${styles.paper} ${isFolded ? styles.paperSent : ''}`}
            style={{ opacity: 0 }} /* GSAP reveals */
          >
            {status === 'success' ? (
              /* ---- RECEIVED STATE ---- */
              <div className={styles.receivedState}>
                <p className={styles.receivedWord}>Received.</p>
                <p className={styles.receivedNote}>
                  I'll read it carefully and be in touch.
                </p>
                <button
                  className={styles.sendAnother}
                  onClick={() => {
                    setStatus('idle');
                    setIsFolded(false);
                    unfoldPaper();
                  }}
                >
                  Send another →
                </button>
              </div>
            ) : (
              /* ---- LETTER FORM ---- */
              <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form — write a letter"
              >
                {/* Letter header */}
                <div className={styles.letterHeader}>
                  <div className={styles.letterTo}>
                    <span className={styles.letterHeaderLabel}>To</span>
                    <span className={styles.letterHeaderValue}>
                      Ronak Vaghela
                    </span>
                  </div>
                  <div className={styles.letterFrom}>
                    <span className={styles.letterHeaderLabel}>From</span>
                    <input
                      className={styles.letterInput}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={disabled}
                      aria-label="Your name"
                    />
                  </div>
                  <div className={styles.letterEmail}>
                    <span className={styles.letterHeaderLabel}>Email</span>
                    <input
                      className={styles.letterInput}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      autoComplete="email"
                      disabled={disabled}
                      aria-label="Your email"
                    />
                  </div>
                  <div className={styles.letterDate}>
                    <span className={styles.letterHeaderLabel}>Date</span>
                    <span className={styles.letterDateValue}>
                      {getTodayStamp()}
                    </span>
                  </div>
                </div>

                {/* Divider rule */}
                <div className={styles.letterRule} aria-hidden="true" />

                {/* The letter body — one large textarea */}
                <textarea
                  className={styles.letterBody}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={
                    "Dear Ronak,\n\nI'd like to discuss…"
                  }
                  rows={8}
                  disabled={disabled}
                  aria-label="Your message"
                />

                {/* Footer: error + send button */}
                <div className={styles.letterFooter}>
                  {status === 'error' && errorMsg && (
                    <p className={styles.errorMsg} role="alert">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={disabled}
                    aria-label="Send message"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send →'}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

      {/* ---- FOOTER ---- */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <div className={styles.footerRule} />
          <div className={styles.footerRow}>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} Ronak Vaghela
            </p>
            <p className={styles.footerCraft}>
              Crafted with intention
            </p>
          </div>
        </div>
      </footer>

    </section>
  );
}