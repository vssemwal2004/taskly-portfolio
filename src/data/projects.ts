// Single source of truth for all project content.
// Facts come from each repo's README/package.json in D:\CP and the team résumés.
// Do NOT add usage numbers here unless the team can back them up.

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  status: string;
  live?: string;
  liveNote?: string;
  repo?: string;
  accent: string;
  featured: boolean;
  screen: string;
  screenLight?: string;
  gallery: { src: string; alt: string }[];
  summary: string;
  problem: string;
  built: string[];
  ai: string[];
  stack: string[];
  flow: string[];
}

export const projects: Project[] = [
  {
    slug: 'peerprep',
    name: 'PeerPrep',
    tagline: 'Placement prep with ANVI, a real-time AI voice interviewer.',
    category: 'AI · EdTech platform',
    year: '2025 —',
    status: 'Live',
    live: 'https://peerprep.co.in',
    repo: 'https://github.com/vssemwal2004/peerprep',
    accent: '#C6FF3D',
    featured: true,
    screen: '/projects/peerprep/screen-dark.webp',
    screenLight: '/projects/peerprep/screen-light.webp',
    gallery: [
      { src: '/projects/peerprep/anvi-dark.webp', alt: 'ANVI voice interview screen' },
      { src: '/projects/peerprep/coding-dark.webp', alt: 'Coding practice with Monaco editor' },
      { src: '/projects/peerprep/analytics-dark.webp', alt: 'Performance analytics' },
      { src: '/projects/peerprep/interview-dark.webp', alt: 'Interview scheduling' },
    ],
    summary:
      'A placement-preparation platform for students, coordinators and admins: learning modules, coding practice, timed assessments, proctoring, interview scheduling and recruiter-ready reports.',
    problem:
      'Students preparing for placements juggle separate tools for learning, coding, mock interviews and tests — and rarely get honest, structured feedback on how they speak in an interview.',
    built: [
      'Role-based workspaces for students, coordinators and admins',
      'Coding practice with an in-browser editor and queued code execution',
      'Timed assessments with browser-side proctoring',
      'Peer interview pairing, scheduling and resumable sessions',
      'Analytics dashboards and resume management',
    ],
    ai: [
      'ANVI — a real-time voice interviewer on the Gemini Live API with adaptive follow-up questions',
      'Turn orchestration, interruption handling, session resumption and multilingual speech',
      'AI-assisted transcription with rubric-based evaluation and detailed performance reports',
      'On-device proctoring signals with MediaPipe and TensorFlow.js',
    ],
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'BullMQ', 'Redis', 'Gemini Live', 'MediaPipe', 'TensorFlow.js', 'Judge0', 'AWS'],
    flow: ['React client', 'Express API', 'Socket.IO', 'Gemini Live', 'MongoDB'],
  },
  {
    slug: 'skillswaphub',
    name: 'SkillSwap Hub',
    tagline: 'Teach what you know, learn what you don’t.',
    category: 'Peer-learning marketplace',
    year: '2025',
    status: 'Live',
    live: 'https://www.skillswaphub.in',
    accent: '#5CC8FF',
    featured: true,
    screen: '/projects/skillswaphub/screen-dark.webp',
    gallery: [{ src: '/projects/skillswaphub/campus.webp', alt: 'Campus assessments' }],
    summary:
      'A peer-to-peer micro-tutoring platform where students learn, teach and earn through 1:1 sessions, expert-led classes, quizzes and real skill exchange.',
    problem:
      'Students have skills to share and gaps to fill, but no trusted, rewarding place to swap them with peers on their own campus.',
    built: [
      '1:1 sessions, expert-led classes and interview requests',
      'Quizzes and campus assessments',
      'Coins, rewards, certificates and a campus ambassador programme',
      'Careers board with job applications',
      'Real-time chat, blogs and Google / LinkedIn sign-in',
    ],
    ai: [],
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Firebase', 'Supabase', 'Passport OAuth', 'Cloudinary', 'Puppeteer'],
    flow: ['React client', 'Express API', 'Socket.IO', 'OAuth', 'MongoDB'],
  },
  {
    slug: 'gyaan-vidhya',
    name: 'Gyaan Vidhya',
    tagline: 'Discover, compare and apply to universities in one place.',
    category: 'EdTech · Admissions',
    year: '2026',
    status: 'Live',
    live: 'https://taskly.online',
    liveNote: 'Hosted for NS-EDU',
    accent: '#F5B82E',
    featured: true,
    screen: '/projects/gyaan-vidhya/screen-dark.webp',
    gallery: [{ src: '/projects/gyaan-vidhya/logo.webp', alt: 'Gyaan Vidhya brand' }],
    summary:
      'A university discovery and admissions platform: a large searchable directory, side-by-side comparison, quick apply and an admin CMS with a bulk importer.',
    problem:
      'University information is scattered across thousands of sites, so students cannot compare options or apply quickly, and the operator cannot keep the catalogue current by hand.',
    built: [
      'University directory with search, filters and comparison',
      'Email-OTP login and quick apply flow',
      'Admin CMS with bulk importer and data scraper',
      'PDF and Excel exports, Cloudinary media pipeline',
      'Dockerised deployment with CI',
    ],
    ai: [],
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Playwright', 'PDFKit', 'ExcelJS', 'Sharp', 'Docker'],
    flow: ['Next.js', 'Express API', 'Importer', 'MongoDB', 'Cloudinary'],
  },
  {
    slug: 'nira',
    name: 'NIRA',
    tagline: 'A botanical body wash, launched as a scroll-driven 3D story.',
    category: '3D product landing',
    year: '2026',
    status: 'Live',
    live: 'https://vssemwal2004.github.io/bodywash/',
    repo: 'https://github.com/vssemwal2004/bodywash',
    accent: '#7EE0B5',
    featured: true,
    screen: '/projects/nira/screen-dark.webp',
    gallery: [
      { src: '/projects/nira/spin.webp', alt: 'Rotating bottle section' },
      { src: '/projects/nira/aloe.webp', alt: 'Aloe scent section' },
      { src: '/projects/nira/rose.webp', alt: 'Rose scent section' },
    ],
    summary:
      'A product launch page where a real-time 3D bottle rotates, travels and changes colour across six scroll chapters — formula, spin, three scents, ritual and shop.',
    problem:
      'A new personal-care brand needed a launch page that feels premium and tactile without a heavy app or video files.',
    built: [
      'Real-time Three.js bottle that morphs colour per scent',
      'Six scroll chapters with smooth Lenis scrolling',
      'Responsive desktop, laptop and mobile layouts',
      'Zero-build static site — instant hosting',
    ],
    ai: [],
    stack: ['Three.js', 'Lenis', 'HTML', 'CSS', 'JavaScript'],
    flow: ['Scroll', 'Lenis', 'Three.js scene', 'Bottle shader'],
  },
  {
    slug: 'ah-wheeler',
    name: 'A.H. Wheeler — Between Stations',
    tagline: 'India’s railway bookstall legacy, told as one train journey.',
    category: 'Heritage storytelling',
    year: '2026',
    status: 'Pitch build',
    live: 'https://vssemwal2004.github.io/AH-Wheeler/',
    repo: 'https://github.com/vssemwal2004/AH-Wheeler',
    accent: '#D9A55B',
    featured: true,
    screen: '/projects/ah-wheeler/screen-dark.webp',
    gallery: [
      { src: '/projects/ah-wheeler/portal.webp', alt: 'Archive portal' },
      { src: '/projects/ah-wheeler/map.webp', alt: '1893 railway map' },
    ],
    summary:
      'An editorial, scroll-choreographed website that walks visitors through the history of India’s iconic railway bookstalls using archival photographs and maps.',
    problem:
      'A heritage brand’s story lived in archives and memory; it needed a crafted digital experience that feels like the journey itself.',
    built: [
      'Station-by-station narrative structure',
      'Split-text and scroll-triggered reveals',
      'Archival image treatment and an 1893 railway map',
      'Lightweight Vite build for static hosting',
    ],
    ai: [],
    stack: ['Vite', 'JavaScript', 'GSAP', 'ScrollTrigger', 'SplitText', 'Lenis'],
    flow: ['Scroll', 'Lenis', 'GSAP timeline', 'Chapters'],
  },
  {
    slug: 'evalora',
    name: 'Evalora',
    tagline: 'Online exams with on-device AI proctoring.',
    category: 'AI · Assessment',
    year: '2026 —',
    status: 'In development',
    repo: 'https://github.com/vssemwal2004/evalora',
    accent: '#FF8A3D',
    featured: true,
    screen: '/projects/evalora/screen-dark.webp',
    gallery: [
      { src: '/projects/evalora/intelligence.webp', alt: 'Evalora intelligence module' },
      { src: '/projects/evalora/login.webp', alt: 'Evalora login' },
    ],
    summary:
      'An end-to-end examination platform with role-based administration, question libraries, scheduling, live monitoring and auditable proctoring signals.',
    problem:
      'Online exams need integrity without a human watching every screen for the whole duration.',
    built: [
      'Super Admin, Admin, Student and Proctor roles',
      'Question library, assignments and scheduling',
      'Real-time monitoring over Socket.IO with audit logs',
      'Proctor capacity planning',
    ],
    ai: [
      'On-device computer vision for face presence and multiple-person detection',
      'Prohibited-object detection producing auditable risk signals',
      'Runs in the browser with MediaPipe and TensorFlow.js — video never leaves the device',
    ],
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Redis', 'MediaPipe', 'TensorFlow.js'],
    flow: ['Browser CV', 'Risk signals', 'Socket.IO', 'Proctor console', 'Audit log'],
  },
  {
    slug: 'nexusbook',
    name: 'NexusBook AI',
    tagline: 'Specialised AI agents that book, re-route and recover.',
    category: 'Agentic AI',
    year: '2026 —',
    status: 'In development',
    repo: 'https://github.com/Anubhav-dhyani/demo_booking_portol',
    accent: '#FF7A59',
    featured: false,
    screen: '/projects/nexusbook/screen-dark.webp',
    gallery: [],
    summary:
      'A multi-domain booking system where specialised AI agents coordinate discovery, availability, disruption handling and booking across service categories.',
    problem:
      'When a trip breaks — a cancellation, a delay — travellers have to re-do discovery and booking by hand across several services.',
    built: [
      'Authenticated booking, inventory, notification and recovery APIs',
      'Admin UI and demo trip generation',
      'External search and geolocation integrations',
    ],
    ai: [
      'LangGraph agent hand-offs between discovery, availability and booking agents',
      'Tool-driven transaction flows',
      'Disruption-recovery workflow with notifications',
    ],
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'LangChain', 'LangGraph', 'Google Places', 'Geoapify'],
    flow: ['User intent', 'Router agent', 'Specialist agents', 'Tools / APIs', 'Booking'],
  },
  {
    slug: 'taskly-payroll',
    name: 'Taskly Payroll',
    tagline: 'Multi-university HRMS and payroll.',
    category: 'ERP · HRMS',
    year: '2026',
    status: 'Private deployment',
    accent: '#7B5CFF',
    featured: false,
    screen: '/projects/taskly-payroll/screen-dark.webp',
    gallery: [],
    summary:
      'A multi-tenant HR and payroll portal serving several universities, from attendance upload to statutory deductions and PDF payslips.',
    problem:
      'Payroll for many institutions ran on spreadsheets and email, with error-prone manual review and statutory calculations.',
    built: [
      'Roles for Super Admin, HR, reviewer, sender and employee',
      'Attendance upload and payroll runs',
      'Excel review round-trip',
      'PF / ESI / PT / TDS calculations and PDF payslips',
      'Background jobs with pg-boss, deployed on Windows Server (IIS)',
    ],
    ai: [],
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind v4', 'TanStack', 'Express 5', 'Kysely', 'PostgreSQL', 'pg-boss'],
    flow: ['Attendance', 'Payroll run', 'Review', 'Payslips'],
  },
  {
    slug: 'assetdesk',
    name: 'AssetDesk',
    tagline: 'From handwritten registers to a tracked inventory desk.',
    category: 'University operations',
    year: '2026',
    status: 'Live (internal)',
    live: 'https://ccinventory.geu.ac.in',
    liveNote: 'Internal — sign-in required',
    accent: '#22C3A6',
    featured: false,
    screen: '/projects/assetdesk/screen-dark.webp',
    gallery: [],
    summary:
      'A mobile-first tool that tracks material issues and returns for a university server room, replacing handwritten records.',
    problem:
      'Issued equipment was tracked on paper, so overdue items and accountability were hard to follow up.',
    built: [
      'Issue and return records',
      'Overdue follow-up with email notifications',
      'Audit trail and reports',
      'TypeScript monorepo with shared API contracts',
    ],
    ai: [],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'TanStack Query', 'Express', 'MongoDB'],
    flow: ['Issue', 'Track', 'Remind', 'Return', 'Audit'],
  },
  {
    slug: 'tatkal',
    name: 'Tatkal',
    tagline: 'White-label bus ticketing with seat locking.',
    category: 'Booking platform',
    year: '2026',
    status: 'Built',
    accent: '#9B6BFF',
    featured: false,
    screen: '/projects/tatkal/screen-dark.webp',
    gallery: [{ src: '/projects/tatkal/login.webp', alt: 'Tatkal login' }],
    summary:
      'A bus-ticket booking system with an admin panel and a client builder for customising the booking screens.',
    problem:
      'Operators wanted their own branded booking flow without double-booked seats during rush hours.',
    built: [
      'Admin panel and customisable client screens',
      'Seat locking with Redis to prevent double booking',
      'Razorpay payments and email confirmations',
    ],
    ai: [],
    stack: ['React', 'Vite', 'Tailwind', 'Express', 'MongoDB', 'Redis', 'Razorpay', 'JWT'],
    flow: ['Select seat', 'Lock (Redis)', 'Pay (Razorpay)', 'Confirm'],
  },
];

export const featured = projects.filter((p) => p.featured);
export const moreBuilds = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Every project image we have — used by the screens wall. */
export const allScreens: { src: string; alt: string; slug: string }[] = [
  ...projects.flatMap((p) => [{ src: p.screen, alt: `${p.name}`, slug: p.slug }, ...p.gallery.map((g) => ({ ...g, slug: p.slug }))]),
  { src: '/projects/peerprep/screen-light.webp', alt: 'PeerPrep dashboard (light)', slug: 'peerprep' },
  { src: '/projects/peerprep/assessment-light.webp', alt: 'PeerPrep assessments', slug: 'peerprep' },
  { src: '/projects/nira/mobile.webp', alt: 'NIRA on mobile', slug: 'nira' },
  { src: '/projects/ah-wheeler/hero.webp', alt: 'A.H. Wheeler archive', slug: 'ah-wheeler' },
  { src: '/projects/tatkal/frame.webp', alt: 'Tatkal booking', slug: 'tatkal' },
].filter((s, i, arr) => arr.findIndex((x) => x.src === s.src) === i && !s.src.endsWith('logo.webp'));
