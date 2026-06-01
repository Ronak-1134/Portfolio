# Ronak Vaghela — Portfolio

A full-stack portfolio built with surgical precision.
The Architect's Drafting Table meets The Japanese Studio.

**Live:** `https://ronakvaghela.vercel.app`
**Backend:** Railway (Express + MongoDB)

---

## Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite 5                       |
| Styling    | CSS Modules + CSS custom properties     |
| Animation  | GSAP 3 (ScrollTrigger, ScrollToPlugin)  |
| Fonts      | Cormorant Garamond · DM Sans · JetBrains Mono |
| Backend    | Node.js + Express 4                     |
| Database   | MongoDB Atlas (Mongoose 8)              |
| Files      | Firebase Storage (resume PDF)           |
| Analytics  | Firebase Analytics (download tracking)  |
| Deploy     | Vercel (frontend) + Railway (backend)   |

---

## Quick Start

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

**Client** — create `client/.env.local`:

```env
VITE_API_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RESUME_STORAGE_PATH=resumes/ronak-vaghela-resume.pdf

# Optional: skip loader animation on every hot reload
VITE_SKIP_LOADER=true
```

**Server** — create `server/.env` (copy from `server/.env.example`):

```env
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ronak-portfolio
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Run dev servers

```bash
npm run dev
```

This starts both concurrently:
- **Client** → `http://localhost:5173`
- **Server** → `http://localhost:4000`

The Vite dev proxy forwards `/api/*` to the Express server,
so the contact form works without any CORS configuration.

---

## Project Structure

```
ronak-portfolio/
├── client/                    # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg        # RV monogram, cream + sepia
│   └── src/
│       ├── styles/            # globals.css, typography.css, animations.css
│       ├── components/        # GridBackground, Loader, Nav, Cursor, ui/
│       ├── sections/          # Hero, Education, Experience, Projects, Skills, Contact
│       ├── hooks/             # useCursor, useScrollReveal, useReducedMotion
│       ├── utils/             # gsapConfig.js, firebase.js
│       └── data/              # projects.js, experience.js, skills.js, education.js
│
└── server/                    # Express backend
    ├── models/Message.js      # Mongoose schema
    ├── routes/contact.js      # POST /api/contact
    └── index.js               # Server entry
```

---

## Adding Projects

Open `client/src/data/projects.js` and add to the array:

```js
{
  id:          5,
  number:      '05',
  title:       'Your Project Name',
  description: 'One sentence description.',
  tags:        ['React', 'Node'],
  featured:    false,
  links: {
    github: 'https://github.com/ronakvaghela/repo',
    live:   'https://yourproject.com',
  },
},
```

The first 4 projects show by default. Any beyond 4 appear
behind the "See more →" button automatically.

---

## Resume PDF

1. Upload your resume PDF to Firebase Storage
2. Set the path in `client/.env.local`:
   ```
   VITE_RESUME_STORAGE_PATH=resumes/ronak-vaghela-resume.pdf
   ```
3. In Firebase Storage security rules, allow public reads on that path:
   ```
   match /resumes/{file} {
     allow read: if true;
   }
   ```

---

## Deployment

### Frontend → Vercel

1. Connect the `client/` folder to a Vercel project
2. Set build command: `vite build`
3. Set output directory: `dist`
4. Add all `VITE_*` environment variables in Vercel dashboard

### Backend → Railway

1. Connect the `server/` folder to a Railway project
2. Railway auto-detects Node.js and runs `npm run start`
3. Add environment variables: `MONGO_URI`, `CORS_ORIGIN`, `NODE_ENV=production`
4. Railway assigns a public URL — set that as `VITE_API_URL` in Vercel

---

## Design Rules (enforced, never break)

1. Accent `#8B5E3C` used exactly 4× total — nav pulse dot, section label rules, hero rule, contact heading rule
2. No `border-radius` anywhere
3. All borders `0.5px` — never `1px`
4. No `box-shadow` — depth via layering only
5. No gradients (except the grid vignette)
6. Font weights: 300 and 400 only
7. Line heights: 1.1 display, 1.6 body
8. Grid background always visible
9. All animations respect `prefers-reduced-motion`

---

*Crafted with intention.*
