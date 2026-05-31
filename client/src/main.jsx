/* ============================================================
   main.jsx
   Ronak Vaghela Portfolio — React Entry Point

   Mounts the React application into #root.
   StrictMode is on in development — this intentionally
   double-invokes effects to surface side-effect bugs.
   GSAP handles double-invoke gracefully via its own guards.
   ============================================================ */

import { StrictMode }   from 'react';
import { createRoot }   from 'react-dom/client';
import App              from './App.jsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error(
    '[main.jsx] Could not find #root element. ' +
    'Check that index.html has <div id="root"></div>.'
  );
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);