/* ============================================================
   index.js
   Ronak Vaghela Portfolio — Express Server Entry Point

   Responsibilities (in order):
     1. Load environment variables
     2. Initialise Express with security + parsing middleware
     3. Connect to MongoDB via Mongoose
     4. Mount route handlers
     5. Start listening on PORT

   Environment variables required (set in Railway):
     PORT          — defaults to 4000 in development
     MONGO_URI     — MongoDB Atlas connection string
     CORS_ORIGIN   — the Vercel frontend URL (or * for dev)

   This file is intentionally simple.
   Infrastructure wiring belongs here, not business logic.
   ============================================================ */

import express    from 'express';
import helmet     from 'helmet';
import cors       from 'cors';
import mongoose   from 'mongoose';
import 'dotenv/config';

import contactRouter from './routes/contact.js';

/* ------------------------------------------------------------
   APP INSTANCE
   ------------------------------------------------------------ */
const app = express();

/* ------------------------------------------------------------
   SECURITY — helmet sets sane HTTP headers
   Content-Security-Policy relaxed for API-only server
   (no HTML served from here)
   ------------------------------------------------------------ */
app.use(
  helmet({
    contentSecurityPolicy: false,  /* API only — no HTML responses */
  })
);

/* ------------------------------------------------------------
   CORS
   Allow requests only from the configured frontend origin.
   In development: CORS_ORIGIN=* or http://localhost:5173
   In production:  CORS_ORIGIN=https://your-vercel-url.vercel.app
   ------------------------------------------------------------ */
const allowedOrigins = (process.env.CORS_ORIGIN ?? '*')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      /* Allow requests with no origin (curl, Postman, server-to-server) */
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods:     ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  })
);

/* Respond to preflight OPTIONS on all routes */
app.options('*', cors());

/* ------------------------------------------------------------
   BODY PARSING
   JSON only — this is a JSON API.
   100kb limit is generous for a contact form.
   ------------------------------------------------------------ */
app.use(express.json({ limit: '100kb' }));

/* Trust first proxy hop (Railway / Vercel gateway) */
app.set('trust proxy', 1);

/* ------------------------------------------------------------
   ROUTES
   ------------------------------------------------------------ */

/* Health check — Railway uses this to verify the server is up */
app.get('/health', (req, res) => {
  res.status(200).json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
  });
});

/* Contact form */
app.use('/api/contact', contactRouter);

/* 404 — catch unmatched routes */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

/* Global error handler */
app.use((err, req, res, _next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(err.status ?? 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

/* ------------------------------------------------------------
   MONGODB CONNECTION
   ------------------------------------------------------------ */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      '[server] MONGO_URI is not set.\n' +
      'Add it to your .env file or Railway environment variables.'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,  /* Fail fast if Atlas unreachable */
    });
    console.log('[server] MongoDB connected');
  } catch (err) {
    console.error('[server] MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

/* ------------------------------------------------------------
   GRACEFUL SHUTDOWN
   Close Mongoose connection cleanly on SIGTERM (Railway stop)
   and SIGINT (Ctrl+C in dev).
   ------------------------------------------------------------ */
async function shutdown(signal) {
  console.log(`[server] ${signal} received — shutting down gracefully`);
  await mongoose.connection.close();
  console.log('[server] MongoDB connection closed');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

/* ------------------------------------------------------------
   START
   Connect to DB first, then start listening.
   The server never accepts requests before DB is ready.
   ------------------------------------------------------------ */
const PORT = parseInt(process.env.PORT ?? '4000', 10);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
    console.log(`[server] Environment: ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`[server] CORS origin: ${allowedOrigins.join(', ')}`);
  });
});

export default app;