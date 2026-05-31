/* ============================================================
   Message.js
   Ronak Vaghela Portfolio — Mongoose Contact Form Schema

   Every message submitted through the contact form is
   persisted here. Schema is intentionally minimal —
   only what's needed, nothing speculative.

   Fields:
     name       — sender's name, required, trimmed
     email      — sender's email, required, validated by regex
     message    — the body, required, trimmed
     createdAt  — auto-set to now on insert
     read       — false by default; flip to true in admin
     ip         — optional, stored for spam/abuse reference
   ============================================================ */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    /* ---- REQUIRED FIELDS ---- */
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [100, 'Name must be 100 characters or fewer'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      trim:      true,
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer'],
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message:   props => `${props.value} is not a valid email address`,
      },
    },

    message: {
      type:      String,
      required:  [true, 'Message is required'],
      trim:      true,
      maxlength: [2000, 'Message must be 2000 characters or fewer'],
    },

    /* ---- OPTIONAL / AUTO FIELDS ---- */

    /* Flip to true once reviewed in MongoDB Atlas or admin panel */
    read: {
      type:    Boolean,
      default: false,
    },

    /* Stored for spam reference — never exposed in API responses */
    ip: {
      type:    String,
      default: null,
      select:  false,  /* excluded from query results by default */
    },
  },
  {
    /* Adds createdAt and updatedAt automatically */
    timestamps: true,

    /* Clean up __v from responses */
    versionKey: false,

    /* Transform output — strip internal fields from toJSON */
    toJSON: {
      transform(doc, ret) {
        delete ret.ip;
        return ret;
      },
    },
  }
);

/* ------------------------------------------------------------
   INDEXES
   — email: not unique (same person can contact multiple times)
   — createdAt: descending for recent-first admin queries
   — read: for filtering unread messages quickly
   ------------------------------------------------------------ */
messageSchema.index({ createdAt: -1 });
messageSchema.index({ read: 1 });

/* ------------------------------------------------------------
   STATIC METHODS
   ------------------------------------------------------------ */

/* Get all unread messages, most recent first */
messageSchema.statics.getUnread = function () {
  return this.find({ read: false }).sort({ createdAt: -1 });
};

/* Mark a single message as read by id */
messageSchema.statics.markRead = function (id) {
  return this.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
};

/* ============================================================
   EXPORT
   Guard against model re-registration in hot-reload envs.
   ============================================================ */
const Message = mongoose.models.Message || model('Message', messageSchema);

export default Message;