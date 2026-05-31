/* ============================================================
   firebase.js
   Ronak Vaghela Portfolio — Firebase Utilities
   
   Handles two responsibilities only:
     1. Resume PDF download URL from Firebase Storage
     2. Download event logging via Firebase Analytics
   
   Firebase config is read from Vite env vars (VITE_ prefix).
   Never hardcode credentials. Never commit .env.local.
   ============================================================ */

import { initializeApp, getApps }       from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

/* ------------------------------------------------------------
   FIREBASE CONFIGURATION
   All values pulled from environment variables.
   In development: client/.env.local
   In production:  Vercel environment variables panel
   
   Required env vars:
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     VITE_FIREBASE_MEASUREMENT_ID      (optional, for Analytics)
     VITE_RESUME_STORAGE_PATH          (path in Storage bucket)
   ------------------------------------------------------------ */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* ------------------------------------------------------------
   APP INITIALISATION
   Guard against double-init in React strict mode /
   hot module replacement.
   ------------------------------------------------------------ */
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

/* ------------------------------------------------------------
   STORAGE INSTANCE
   ------------------------------------------------------------ */
const storage = getStorage(app);

/* ------------------------------------------------------------
   ANALYTICS — lazy, only if supported in this browser
   Safari ITP and ad-blockers can cause isSupported() → false.
   We degrade gracefully — logging failure is never fatal.
   ------------------------------------------------------------ */
let analyticsInstance = null;

async function getAnalyticsInstance() {
  if (analyticsInstance) return analyticsInstance;

  try {
    const supported = await isSupported();
    if (supported && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
      analyticsInstance = getAnalytics(app);
    }
  } catch {
    /* Analytics not available — silent fail */
  }

  return analyticsInstance;
}

/* ============================================================
   PUBLIC API
   ============================================================ */

/* ------------------------------------------------------------
   getResumeDownloadURL
   Returns a signed download URL for the resume PDF stored
   in Firebase Storage.
   
   The path is set via VITE_RESUME_STORAGE_PATH env var,
   e.g. "resumes/ronak-vaghela-resume.pdf"
   
   @returns {Promise<string>}  download URL
   @throws  {Error}            if storage or path is invalid
   ------------------------------------------------------------ */
export async function getResumeDownloadURL() {
  const storagePath = import.meta.env.VITE_RESUME_STORAGE_PATH;

  if (!storagePath) {
    throw new Error(
      'VITE_RESUME_STORAGE_PATH is not set. ' +
      'Add it to your .env.local file.'
    );
  }

  try {
    const fileRef = ref(storage, storagePath);
    const url     = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    /* Provide a clear error for common Firebase Storage errors */
    if (error.code === 'storage/object-not-found') {
      throw new Error(
        `Resume not found at path: "${storagePath}". ` +
        'Upload the PDF to Firebase Storage first.'
      );
    }
    if (error.code === 'storage/unauthorized') {
      throw new Error(
        'Firebase Storage rules denied access. ' +
        'Check your Storage security rules.'
      );
    }
    throw error;
  }
}

/* ------------------------------------------------------------
   logResumeDownload
   Fires a "resume_download" Analytics event with metadata.
   Called after the download URL is successfully opened.
   
   Fails silently — a broken analytics call must never
   break the download experience.
   
   @param {Object} metadata  — optional event parameters
   ------------------------------------------------------------ */
export async function logResumeDownload(metadata = {}) {
  try {
    const analytics = await getAnalyticsInstance();
    if (!analytics) return;

    logEvent(analytics, 'resume_download', {
      timestamp:   new Date().toISOString(),
      page_path:   window.location.pathname,
      ...metadata,
    });
  } catch {
    /* Silent fail — analytics must never block UX */
  }
}

/* ------------------------------------------------------------
   handleResumeDownload
   The single function called by the Contact section button.
   
   Flow:
     1. Show loading state (caller handles UI)
     2. Fetch signed download URL from Storage
     3. Open URL in new tab
     4. Log the download event
     5. Return success/error to caller
   
   @returns {Promise<{ success: boolean, error?: string }>}
   ------------------------------------------------------------ */
export async function handleResumeDownload() {
  try {
    const url = await getResumeDownloadURL();

    /* Open in new tab — preserves current page scroll position */
    const link    = document.createElement('a');
    link.href     = url;
    link.target   = '_blank';
    link.rel      = 'noopener noreferrer';
    link.download = 'Ronak-Vaghela-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* Log after successful open — non-blocking */
    logResumeDownload({
      file_name: 'Ronak-Vaghela-Resume.pdf',
    });

    return { success: true };
  } catch (error) {
    console.error('[Firebase] Resume download failed:', error.message);
    return {
      success: false,
      error:   error.message,
    };
  }
}

/* ------------------------------------------------------------
   DEVELOPMENT FALLBACK
   In local development without Firebase credentials,
   handleResumeDownload falls back to a console warning
   rather than throwing, so the rest of the UI still works.
   ------------------------------------------------------------ */
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn(
    '[Firebase] No credentials found in .env.local.\n' +
    'Resume download will not work until you add:\n' +
    '  VITE_FIREBASE_API_KEY\n' +
    '  VITE_FIREBASE_AUTH_DOMAIN\n' +
    '  VITE_FIREBASE_PROJECT_ID\n' +
    '  VITE_FIREBASE_STORAGE_BUCKET\n' +
    '  VITE_FIREBASE_MESSAGING_SENDER_ID\n' +
    '  VITE_FIREBASE_APP_ID\n' +
    '  VITE_RESUME_STORAGE_PATH\n' +
    'See Firebase console → Project settings → Your apps.'
  );
}

export { app, storage };