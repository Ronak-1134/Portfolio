/* ============================================================
   experience.js
   Ronak Vaghela Portfolio — Experience Data

   Two internship entries rendered as blueprint cards
   in the Experience section.

   Fields:
     id          {string}    — unique key for React
     company     {string}    — company name (Cormorant display)
     role        {string}    — job title (JetBrains Mono all-caps)
     type        {string}    — "Internship" | "Full-time" etc.
     period      {string}    — date range displayed right-aligned
     duration    {string}    — human-readable duration
     description {string[]}  — array of bullet-point descriptions
                               (rendered as a list, weight 300)
     tags        {string[]}  — tech stack tags
     location    {string}    — city / remote
   ============================================================ */

export const experience = [
  {
    id:       'tatvasoft',
    company:  'TatvaSoft',
    role:     'Full-Stack Developer Intern',
    type:     'Internship',
    period:   'July 2025',
    duration: '1 Month',
    location: 'Ahmedabad',
    description: [
      'Built a role-based authentication system with granular access control across multiple user tiers.',
      'Developed a complete CRUD application using the Code First approach with Entity Framework and PostgreSQL.',
      'Designed and integrated RESTful APIs documented via Swagger, deployed on AWS infrastructure.',
      'Worked within an Agile team environment, contributing to sprint planning and daily standups.',
    ],
    tags: [
      'Angular',
      '.NET Core',
      'C#',
      'PostgreSQL',
      'Entity Framework',
      'AWS',
      'Swagger',
    ],
  },
  {
    id:       'ibm',
    company:  'IBM',
    role:     'AI Intern',
    type:     'Internship',
    period:   'July 2025',
    duration: '1 Month',
    location: 'Remote',
    description: [
      'Researched and implemented decision-making algorithms for AI agent systems in complex environments.',
      'Built multiagent systems capable of coordinating on cybersecurity threat detection workflows.',
      'Applied AI agent frameworks to supply chain optimisation, reducing simulated decision latency.',
      'Explored IBM\'s AI toolchain and contributed to internal documentation on agent architecture patterns.',
    ],
    tags: [
      'Python',
      'AI Agents',
      'Multiagent Systems',
      'IBM Tools',
      'Decision Algorithms',
    ],
  },
];