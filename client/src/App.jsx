/* ============================================================
   App.jsx — Ronak Vaghela Portfolio
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';
import { registerGSAP }   from './utils/gsapConfig';
import { CursorProvider } from './hooks/useCursor.jsx';

import GridBackground from './components/GridBackground/GridBackground';
import Loader         from './components/Loader/Loader';
import Cursor         from './components/Cursor/Cursor';
import Nav            from './components/Nav/Nav';
import Marquee        from './components/Marquee/Marquee';

import Hero       from './sections/Hero/Hero';
import Education  from './sections/Education/Education';
import Experience from './sections/Experience/Experience';
import Projects   from './sections/Projects/Projects';
import Skills     from './sections/Skills/Skills';
import Contact    from './sections/Contact/Contact';

import './styles/globals.css';
import './styles/typography.css';
import './styles/animations.css';

registerGSAP();

const SKIP_LOADER =
  import.meta.env.DEV &&
  import.meta.env.VITE_SKIP_LOADER === 'true';

/* Inter-section ruled divider with a large ghost number */
function SectionDivider({ index }) {
  return (
    <div className="app-divider" aria-hidden="true">
      <div className="app-divider__rule" />
      <span className="app-divider__index">
        {String(index).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function App() {
  const [loaderDone, setLoaderDone] = useState(SKIP_LOADER);

  useEffect(() => {
    document.body.style.overflow = loaderDone ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [loaderDone]);

  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  return (
    <CursorProvider>
      <GridBackground />
      <Cursor />

      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      <div
        style={{
          opacity:       loaderDone ? 1 : 0,
          transition:    loaderDone ? 'opacity 0.4s ease' : 'none',
          pointerEvents: loaderDone ? 'auto' : 'none',
        }}
      >
        <Nav />

        <main id="main-content" role="main">
          <Hero />
          <Marquee speed={36} />
          <SectionDivider index={1} />
          <Education />
          <SectionDivider index={2} />
          <Experience />
          <SectionDivider index={3} />
          <Projects />
          <Marquee
            speed={28}
            size="md"
            items={[
              'Govt-Doc-Vault',
              'Task Manager',
              'Gaming Website',
              'Portfolio',
              'React',
              'Node.js',
              'GSAP',
              'Firebase',
              'MongoDB',
              'PostgreSQL',
            ]}
            separator="—"
          />
          <SectionDivider index={4} />
          <Skills />
          <SectionDivider index={5} />
          <Contact />
        </main>
      </div>

    </CursorProvider>
  );
}