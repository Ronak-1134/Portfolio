/* ============================================================
   Clock.jsx
   Ronak Vaghela Portfolio — Live IST Clock

   Displays the current time in IST (UTC+5:30), updating
   every second via setInterval. Renders in JetBrains Mono.

   Two pieces of information:
     — Current IST time  HH:MM:SS  (updates every second)
     — Timezone label    IST        (static)

   Placed in the hero's top-right meta bar.
   Ghost ink — present, never demanding.
   ============================================================ */

import { useState, useEffect } from 'react';
import styles from './Clock.module.css';

/* ------------------------------------------------------------
   Get current IST time string — HH:MM:SS
   IST = UTC + 5h 30min
   ------------------------------------------------------------ */
function getISTTime() {
  const now    = new Date();
  const utc    = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist    = new Date(utc + 5.5 * 3600000);

  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

export default function Clock() {
  const [time, setTime] = useState(getISTTime);

  useEffect(() => {
    /* Align to the next whole second to avoid drift */
    const msToNextSecond = 1000 - (Date.now() % 1000);

    let interval;
    const timeout = setTimeout(() => {
      setTime(getISTTime());
      interval = setInterval(() => {
        setTime(getISTTime());
      }, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <time
      className={styles.clock}
      dateTime={new Date().toISOString()}
      aria-label={`Current time in India: ${time} IST`}
      title="Current time in India (IST)"
    >
      <span className={styles.label}>IST</span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.time}>{time}</span>
    </time>
  );
}