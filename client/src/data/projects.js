/* ============================================================
   projects.js
   Ronak Vaghela Portfolio — Projects Data
   ============================================================ */

export const projects = [
    {
    id:          'govt-doc-vault',
    number:      '01',
    title:       'Govt-Doc-Vault',
    subtitle:    'Secure Document Management System',
    description:
      'A government-grade document vault built with Vanilla JS and Firebase. ' +
      'Implements OTP-based authentication, role-based access control with ' +
      'Firestore security rules, and a complete audit logging system for ' +
      'every document interaction.',
    featured:    true,
    tags:        [
      'Vanilla JS',
      'Firebase',
      'Firestore',
      'OTP Auth',
      'RBAC',
    ],
    links: {
      github: 'https://github.com/Ronak-1134/govt-doc-vault',
      live:   'https://govdoc-prod.web.app/',
    },
    highlight: 'Firestore security rules + audit logging',
  },
  {
    id:          'codesense-ai',
    number:      '02',
    title:       'CodeSense AI',
    subtitle:    'AI-Powered Code Reviewer',
    description:
      'An automated code review platform powered by Claude AI that detects bugs, ' +
      'security vulnerabilities, and bad patterns. Features deep integration with GitHub ' +
      'Pull Requests, Firebase multi-provider authentication, multi-language support, ' +
      'and granular control over review depth and focus areas.',
    featured:    true,
    tags:        [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Claude AI',
      'Firebase Auth',
      'GitHub API',
      'Tailwind CSS',
    ],
    links: {
      github: 'https://github.com/Ronak-1134/CodeSense-AI',
      live:   null,
    },
    highlight: 'Claude AI + GitHub PR Integration + Firebase',
  },
  {
    id:          'orbitops',
    number:      '03',
    title:       'ORBITOPS',
    subtitle:    'Real-Time Space Intelligence Platform',
    description:
      'A mission-critical orbital intelligence dashboard and cinematic command interface. ' +
      'Features live ISS tracking, near-Earth object surveillance, and real-time solar activity ' +
      'monitoring. Built with a highly interactive 3D Earth globe, data visualisations, ' +
      'and offline fallback layers for seamless telemetry rendering.',
    featured:    true,
    tags:        [
      'React',
      'Three.js',
      'React Three Fiber',
      'GSAP',
      'Framer Motion',
      'Tailwind CSS',
      'Zustand',
      'REST API',
    ],
    links: {
      github: 'https://github.com/Ronak-1134/OrbitOps',
      live:   'https://orbitops-kr18.onrender.com/',
    },
    highlight: 'React Three Fiber + GSAP + Live Telemetry',
  },
  {
    id:          'questlog',
    number:      '04',
    title:       'QuestLog',
    subtitle:    'Minimalist Data-Driven Gaming Platform',
    description:
      'A premium, ultra-minimalist gaming dashboard inspired by Apple and Linear aesthetics. ' +
      'Integrates the IGDB and Steam Web APIs to sync libraries, calculate community completion ' +
      'metrics, track mission progress for AAA titles, and push real-time statistics via Socket.io ' +
      'backed by Redis caching.',
    featured:    true,
    tags:        [
      'React',
      'Node.js',
      'MongoDB',
      'Redis',
      'Socket.io',
      'Framer Motion',
      'Tailwind CSS',
      'Firebase Auth',
    ],
    links: {
      github: 'https://github.com/Ronak-1134/QuestLog',
      live:   'https://quest-log-eta.vercel.app/',
    },
    highlight: 'Steam Web API + Socket.io + Redis Cache',
  },
  {
    id:          'gaming-website',
    number:      '05',
    title:       'Gaming Website',
    subtitle:    'Animated Showcase with GSAP',
    description:
      'A high-performance gaming showcase website built with React and GSAP. ' +
      'Features ScrollTrigger-driven animations, 3D tilt effects on game cards, ' +
      'and smooth parallax layers. Demonstrates advanced animation orchestration ' +
      'at production quality.',
    featured:    true,
    tags:        [
      'React',
      'GSAP',
      'ScrollTrigger',
      'Tailwind CSS',
      'Vite',
    ],
    links: {
      github: 'https://github.com/Ronak-1134/Gaming-Website-Clone',
      live:   'https://gaming-website-clone-8q2c.vercel.app/',
    },
    highlight: 'GSAP ScrollTrigger + 3D tilt effects',
  },
  {
  id:          'luminary-blog',
  number:      '06', // Sequential numbering following your previous project
  title:       'Luminary Blog',
  subtitle:    'Premium Vanilla JS Blog Platform',
  description:
    'A production-quality, framework-free blog website featuring a sleek Apple/Medium-inspired ' +
    'design. Showcases advanced vanilla JavaScript architecture, glassmorphism UI, a complete ' +
    'client-side commenting/bookmarking engine, and high-performance intersection observer animations.',
  featured:    true,
  tags:        [
    'HTML5',
    'CSS3',
    'Vanilla JavaScript',
    'localStorage',
    'IntersectionObserver',
  ],
  links: {
    github: 'https://github.com/Ronak-1134/Blog-website',
    live:   'https://blog-website-two-eta.vercel.app/', // Update with your actual live URL when deployed
  },
  highlight: 'Zero-framework architecture + local-storage state engine',
}
];