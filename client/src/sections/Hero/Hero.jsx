/* ============================================================
   Hero.jsx — Ronak Vaghela Portfolio (rebuilt for density)
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { gsap }              from '../../utils/gsapConfig';
import { useReducedMotion }  from '../../hooks/useReducedMotion';
import Button                from '../../components/ui/Button';
import CountUp               from '../../components/CountUp/CountUp';
import Clock                 from '../../components/Clock/Clock';
import SignatureLoop          from '../../components/SignatureLoop/SignatureLoop';
import styles                from './Hero.module.css';

const BIO = 'Computer Engineering student at LDCE, specializing in high-performance, full-stack systems with clean architecture. Ex-Intern at IBM & TatvaSoft. Passionate about AI, systems design, and tackling complex, high-value problems. Open to freelance opportunities and technical collaborations.';
const EDUCATION_SUMMARY = 'B.E Computer Engineering · LDCE, Ahmedabad (GTU) · 2022–26';

const STATS = [
  { target: 8.00,  decimals: 2, suffix: '',   label: 'CGPA',             duration: 1600 },
  { target: 3,     decimals: 0, suffix: '',   label: 'Internships',       duration: 900  },
  { target: 350,   decimals: 0, suffix: '+',  label: 'Problems solved',   duration: 1800 },
];

const CURRENTLY = [
  { label: 'Building',  value: 'QuestLog'                    },
  { label: 'Reading',   value: 'Animal Farm'      },
  { label: 'Learning',  value: 'AI Agents & Multiagent Systems'     },
];

const GITHUB_USER = 'Ronak';

function useLastCommit() {
  const [data, setData] = useState({ time: null, repo: null, loading: true });

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=10`)
      .then(r => r.json())
      .then(events => {
        const push = events.find(e => e.type === 'PushEvent');
        if (!push) return setData({ time: null, repo: null, loading: false });

        const ago  = getTimeAgo(new Date(push.created_at));
        const repo = push.repo.name.replace(`${GITHUB_USER}/`, '');
        setData({ time: ago, repo, loading: false });
      })
      .catch(() => setData({ time: null, repo: null, loading: false }));
  }, []);

  return data;
}

function getTimeAgo(date) {
  const mins = Math.floor((Date.now() - date) / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}


export default function Hero() {
  const prefersReduced = useReducedMotion();
  const commit = useLastCommit();

  const sectionRef      = useRef(null);
  const nameRef         = useRef(null);
  const nameOutlineRef  = useRef(null);
  const ruleRef         = useRef(null);
  const leftColRef      = useRef(null);
  const photoWrapRef    = useRef(null);
  const annoRefs        = useRef([]);

  /* Entrance animation */
  useEffect(() => {
    if (prefersReduced) return;
    const tl = gsap.timeline({ delay: 0.15 });

    /* Outline fades in first — ghost behind the solid name */
    tl.fromTo(nameOutlineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' }
    );
    /* Solid name rises through it */
    tl.fromTo(nameRef.current,
      { opacity: 0, y: 56 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      '-=0.4'
    );
    tl.fromTo(ruleRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center' },
      '-=0.45'
    );
    if (leftColRef.current?.children) {
      tl.fromTo(Array.from(leftColRef.current.children),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 },
        '-=0.55'
      );
    }
    tl.fromTo(photoWrapRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' },
      '-=0.7'
    );
    const annos = annoRefs.current.filter(Boolean);
    if (annos.length) {
      tl.fromTo(annos,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
        '-=0.5'
      );
    }
    return () => tl.kill();
  }, [prefersReduced]);

  /* Scroll parallax on photo */
  useEffect(() => {
    if (prefersReduced || !photoWrapRef.current) return;
    const tween = gsap.to(photoWrapRef.current, {
      y: '-7%', ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top', end: 'bottom top', scrub: 1.5,
      },
    });
    return () => tween.scrollTrigger?.kill();
  }, [prefersReduced]);

  /* Check if photo exists */
  const [hasPhoto, setHasPhoto] = useRef(false) && [false, () => {}];

  return (
    <section ref={sectionRef} className={styles.hero} id="hero" aria-label="Introduction">
      <div className={styles.heroInner}>

        {/* TOP META ROW */}
        <div className={styles.topMeta}>
          <div className={styles.topMetaLeft}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Available for roles
            </span>
            <span className={styles.metaDivider} />
            <span className={styles.metaItem}>Ahmedabad, Gujarat</span>
          </div>
          <div className={styles.topMetaRight}>
            <span className={styles.metaItem}>Full-Stack · AI · Systems</span>
            <span className={styles.metaDivider} />
            <Clock />
          </div>
        </div>

        {/* NAME */}
        <div className={styles.nameBlock}>
          {/* Outline ghost — sits behind, offset */}
          <h1
            ref={nameOutlineRef}
            className={styles.heroNameOutline}
            aria-hidden="true"
          >
            Ronak Vaghela
          </h1>
          {/* Solid name — the primary layer */}
          <h1 ref={nameRef} className={styles.heroName} data-hero-name>
            Ronak Vaghela
          </h1>
        </div>

        {/* SEPIA RULE — accent #3 of 4 */}
        <div ref={ruleRef} className={styles.heroRule} aria-hidden="true" />

        {/* TWO COLUMN BODY */}
        <div className={styles.heroBody}>

          {/* LEFT */}
          <div ref={leftColRef} className={styles.leftCol}>

            <p className={styles.role}>Full-Stack Developer &amp; AI Enthusiast</p>

            <p className={styles.bio}>{BIO}</p>

            <p className={styles.eduSummary}>{EDUCATION_SUMMARY}</p>

            {/* Currently block */}
            <div className={styles.currently}>
              {CURRENTLY.map(item => (
                <div key={item.label} className={styles.currentlyRow}>
                  <span className={styles.currentlyLabel}>{item.label}</span>
                  <span className={styles.currentlyDash} aria-hidden="true" />
                  <span className={styles.currentlyValue}>{item.value}</span>
                </div>
              ))}
              {/* Live GitHub commit */}
              <div className={styles.currentlyRow}>
                <span className={styles.currentlyLabel}>Last commit</span>
                <span className={styles.currentlyDash} aria-hidden="true" />
                {commit.loading ? (
                  <span className={styles.currentlyValue} style={{ opacity: 0.4 }}>
                    fetching…
                  </span>
                ) : commit.time ? (
                  <a
                    href={`https://github.com/${GITHUB_USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.currentlyValue} ${styles.currentlyLink}`}
                  >
                    {commit.time}
                    {commit.repo && (
                      <span className={styles.currentlyRepo}> · {commit.repo}</span>
                    )}
                    <span className={styles.currentlyArrow}>↗</span>
                  </a>
                ) : (
                  <span className={styles.currentlyValue} style={{ opacity: 0.4 }}>
                    —
                  </span>
                )}
              </div>
            </div>
            <div className={styles.statsRow}>
              {STATS.map(s => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statValue}>
                    <CountUp
                      target={s.target}
                      decimals={s.decimals}
                      suffix={s.suffix}
                      duration={s.duration}
                    />
                  </span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className={styles.ctaRow}>
              <Button variant="primary" onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }>
                Draw up a brief →
              </Button>
              <Button variant="text" onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }>
                View work
              </Button>
            </div>

            {/* Socials */}
            <div className={styles.socialRow}>
              <a href="https://github.com/Ronak-1134" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
              <span className={styles.socialDot} aria-hidden="true" />
              <a href="https://www.linkedin.com/in/ronak-vaghela11/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Linkdin</a>
              <span className={styles.socialDot} aria-hidden="true" />
              <a href="https://www.instagram.com/_ronak11__/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
              <span className={styles.socialDot} aria-hidden="true" />
              <a href="https://in.pinterest.com/vaghelaronak1134/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Pintrest</a>
              <span className={styles.socialDot} aria-hidden="true" />
              <a href="https://github.com/Ronak-1134" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Letterbox</a>
              <span className={styles.socialDot} aria-hidden="true" />
              <a href="mailto:vaghelaronak1134@gmail.com" className={styles.socialLink}>Email</a>
            </div>
          </div>

          {/* RIGHT — Signature */}
          <div className={styles.rightCol}>
            <div ref={photoWrapRef} className={styles.photoWrap}>
              <SignatureLoop />
              <span className={`${styles.cornerMark} ${styles.cornerTL}`} aria-hidden="true" />
              <span className={`${styles.cornerMark} ${styles.cornerTR}`} aria-hidden="true" />
              <span className={`${styles.cornerMark} ${styles.cornerBL}`} aria-hidden="true" />
              <span className={`${styles.cornerMark} ${styles.cornerBR}`} aria-hidden="true" />
            </div>
          </div>

        </div>

        {/* SCROLL NUDGE */}
        <div className={styles.scrollNudge} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>

      </div>
    </section>
  );
}