/* ============================================================
   contact.js
   Ronak Vaghela Portfolio — Contact Form Route

   POST /api/contact
     — Validates all three required fields server-side
     — Sanitises input (trim, length caps)
     — Saves a new Message document to MongoDB
     — Responds 201 on success, 400 on validation fail,
       500 on unexpected error
     — Stores requester IP on the document (never in response)
     — Rate-limited to 5 requests per IP per 15 minutes
       to prevent form spam without a CAPTCHA

   This is the only route in this file.
   One responsibility. Nothing else.
   ============================================================ */

import express        from 'express';
import rateLimit      from 'express-rate-limit';
import Message        from '../models/Message.js';

const router = express.Router();

/* ------------------------------------------------------------
   RATE LIMITER
   5 submissions per IP per 15 minutes.
   Strict but fair for a personal contact form.
   Responds with JSON (not HTML) on limit exceeded.
   ------------------------------------------------------------ */
const contactLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,   /* 15 minutes            */
  max:              5,                 /* max 5 per window      */
  standardHeaders:  true,              /* RateLimit-* headers   */
  legacyHeaders:    false,
  keyGenerator:     (req) => {
    /* Trust proxy header set by Railway / Vercel */
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many messages sent. Please wait 15 minutes and try again.',
    });
  },
});

/* ------------------------------------------------------------
   VALIDATION HELPERS
   Server-side re-validation — never trust the client.
   ------------------------------------------------------------ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactPayload(body) {
  const errors = [];
  const { name, email, message } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required.');
  } else if (name.trim().length > 100) {
    errors.push('Name must be 100 characters or fewer.');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required.');
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.push('A valid email address is required.');
  } else if (email.trim().length > 254) {
    errors.push('Email must be 254 characters or fewer.');
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push('Message is required.');
  } else if (message.trim().length > 2000) {
    errors.push('Message must be 2000 characters or fewer.');
  }

  return errors;
}

/* ------------------------------------------------------------
   POST /api/contact
   ------------------------------------------------------------ */
router.post('/', contactLimiter, async (req, res) => {
  try {
    /* ---- 1. VALIDATE ---- */
    const errors = validateContactPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],   /* Send first error only — clean UX */
        errors,               /* Full list for debugging           */
      });
    }

    const { name, email, message } = req.body;

    /* ---- 2. SAVE TO MONGODB ---- */
    const doc = await Message.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
      ip:      req.ip || req.headers['x-forwarded-for'] || null,
    });

    /* ---- 3. RESPOND ---- */
    return res.status(201).json({
      success: true,
      message: 'Message received. Thank you.',
      id:      doc._id,        /* Useful for debugging; safe to expose */
    });

  } catch (err) {
    /* Mongoose validation errors (schema-level) */
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
        errors:  messages,
      });
    }

    /* Unexpected server error */
    console.error('[contact route] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try emailing directly.',
    });
  }
});

export default router;