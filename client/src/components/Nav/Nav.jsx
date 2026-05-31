/* ============================================================
   Nav.jsx
   Ronak Vaghela Portfolio — Navigation

   Fixed at top. 56px tall. Always present.

   Left:  RV_  — the underscore blinks at 1s intervals.
          Clicking scrolls to top.

   Right: Section anchors in JetBrains Mono all-caps.
          On hover: a 0.5px underline draws left → right.
          On active section: underline is permanently drawn.
          "Available" indicator with slow sepia pulse dot.

   Below the nav: a 1px scroll progress line in sepia.
   This is accent color appearance #1 of 4 on the page.

   On scroll past 80px: cream background + faint backdrop blur.
   ============================================================ */

import { useEffect, useRef, useState, useCallback } from 'react';
import { scrollToSection } from '../../utils/gsapConfig';
import Clock   from '../Clock/Clock';
import styles from './Nav.module.css';

/* ------------------------------------------------------------
   NAV LINKS
   ------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Education',   id: 'education'  },
  { label: 'Experience',  id: 'experience' },
  { label: 'Projects',    id: 'projects'   },
  { label: 'Skills',      id: 'skills'     },
  { label: 'Contact',     id: 'contact'    },
];

export default function Nav() {
  const [scrolled,       setScrolled]       = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection,  setActiveSection]  = useState('');
  const [menuOpen,       setMenuOpen]       = useState(false);
  const observerRef = useRef(null);

  /* ----------------------------------------------------------
     SCROLL PROGRESS + SCROLLED STATE
     ---------------------------------------------------------- */
  useEffect(() => {
    let rafPending = false;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrolled(scrollTop > 80);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      rafPending = false;
    }

    function onScroll() {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ----------------------------------------------------------
     ACTIVE SECTION DETECTION
     ---------------------------------------------------------- */
  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const visibilityMap = new Map(sections.map(s => [s.id, 0]));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });
        let maxRatio = 0;
        let maxId    = '';
        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) { maxRatio = ratio; maxId = id; }
        });
        if (maxRatio > 0.05) setActiveSection(maxId);
      },
      {
        threshold:  [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1.0],
        rootMargin: '-56px 0px 0px 0px',
      }
    );

    sections.forEach(s => observerRef.current.observe(s));
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, []);

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  const handleBrandClick = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navInner}>

          {/* BRAND */}
          <a
            href="#"
            className={styles.brand}
            onClick={handleBrandClick}
            aria-label="Ronak Vaghela — scroll to top"
          >
            <span className={styles.brandRV}>RV</span>
            <span className={styles.brandUnderscore} aria-hidden="true">_</span>
          </a>

          {/* LINKS + AVAILABILITY */}
          <div className={`${styles.linkGroup} ${menuOpen ? styles.linkGroupOpen : ''}`}>

            <div className={styles.availability} aria-label="Available for work">
              <span className={styles.availabilityDot} aria-hidden="true" />
              <span className={styles.availabilityLabel}>Available</span>
              <span className={styles.availabilityDivider} aria-hidden="true" />
              <Clock />
            </div>

            <div className={styles.navDivider} aria-hidden="true" />

            {NAV_LINKS.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`${styles.navLink} ${activeSection === id ? styles.navLinkActive : ''}`}
                onClick={(e) => handleNavClick(e, id)}
                aria-current={activeSection === id ? 'location' : undefined}
              >
                <span className={styles.navLinkText}>{label}</span>
                <span className={styles.navLinkUnderline} aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={styles.hamburgerLine} aria-hidden="true" />
            <span className={styles.hamburgerLine} aria-hidden="true" />
          </button>

        </div>

        {/* SCROLL PROGRESS — sepia accent #1 of 4 */}
        <div className={styles.progressBar} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}