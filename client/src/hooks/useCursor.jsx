/* ============================================================
   useCursor.js
   Ronak Vaghela Portfolio — Cursor State Management

   Tracks:
     - Mouse position (raw, updated every mousemove)
     - Cursor variant: 'default' | 'link' | 'project' | 'text'
     - Whether the cursor is visible (left/entered window)

   Consumed by Cursor.jsx to drive visual states.
   Exposed via CursorContext so any component can trigger
   cursor state changes by calling setCursorVariant().
   ============================================================ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

/* ------------------------------------------------------------
   CONTEXT
   ------------------------------------------------------------ */
export const CursorContext = createContext({
  position:         { x: -100, y: -100 },
  variant:          'default',
  isVisible:        false,
  setCursorVariant: () => {},
});

/* ------------------------------------------------------------
   PROVIDER — wraps the entire app in App.jsx
   ------------------------------------------------------------ */
export function CursorProvider({ children }) {
  const [position,  setPosition]  = useState({ x: -100, y: -100 });
  const [variant,   setVariant]   = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  const setCursorVariant = useCallback((v) => {
    setVariant(v || 'default');
  }, []);

  useEffect(() => {
    function onMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    }

    function onLeave() { setIsVisible(false); }
    function onEnter() { setIsVisible(true);  }

    /* Auto-detect hover targets via event delegation.
       Components don't need to manually call setCursorVariant
       unless they want a specific non-default variant. */
    function onMouseOver(e) {
      const target = e.target.closest(
        'a, button, [role="button"], [data-cursor]'
      );
      if (!target) {
        setVariant('default');
        return;
      }
      const cursorType = target.dataset.cursor;
      if (cursorType) {
        setVariant(cursorType);
      } else {
        setVariant('link');
      }
    }

    function onMouseOut(e) {
      const target = e.target.closest(
        'a, button, [role="button"], [data-cursor]'
      );
      if (target) setVariant('default');
    }

    window.addEventListener('mousemove',  onMove,      { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover',  onMouseOver, { passive: true });
    document.addEventListener('mouseout',   onMouseOut,  { passive: true });

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseout',   onMouseOut);
    };
  }, [isVisible]);

  return (
    <CursorContext.Provider
      value={{ position, variant, isVisible, setCursorVariant }}
    >
      {children}
    </CursorContext.Provider>
  );
}

/* ------------------------------------------------------------
   HOOK — consume cursor context in any component
   ------------------------------------------------------------ */
export function useCursor() {
  return useContext(CursorContext);
}

/* ------------------------------------------------------------
   LERP UTILITY
   Used by Cursor.jsx for the lagging outer ring.
   Exported here so it lives alongside cursor logic.
   ------------------------------------------------------------ */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}