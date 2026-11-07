export interface Service {
  id: string;
  index: string;
  title: string;
  line: string;
  points: string[];
  proof: string;
}

export const services: Service[] = [
  {
    id: 'ai-automation',
    index: '01',
    title: 'AI automation & agents',
    line: 'Agents that read, decide and act inside your workflow — not chatbots bolted on the side.',
    points: ['LangGraph / LangChain multi-agent flows', 'RAG over your documents', 'Tool-calling into your APIs', 'Human-in-the-loop review'],
    proof: 'NexusBook AI',
  },
  {
    id: 'voice',
    index: '02',
    title: 'AI voice & chat agents',
    line: 'Real-time voice that listens, interrupts gracefully and remembers the session.',
    points: ['Gemini Live / realtime speech', 'Interruption & turn handling', 'Multilingual STT / TTS', 'Rubric-based evaluation'],
    proof: 'ANVI in PeerPrep',
  },
  {
    id: 'platforms',
    index: '03',
    title: 'Web & SaaS platforms',
    line: 'Full products from idea to launch — auth, payments, dashboards, real-time.',
    points: ['React / Next.js front-ends', 'Node.js APIs, MongoDB & PostgreSQL', 'Socket.IO real-time', 'Razorpay payments'],
    proof: 'SkillSwap Hub · Gyaan Vidhya',
  },
  {
    id: 'erp',
    index: '04',
    title: 'ERP, HRMS & campus systems',
    line: 'Replace spreadsheets and registers with systems your staff actually like using.',
    points: ['Admissions, payroll & inventory', 'Role-based access & audit trails', 'Excel / PDF round-trips', 'Multi-tenant setups'],
    proof: 'Taskly Payroll · AssetDesk',
  },
  {
    id: 'immersive',
    index: '05',
    title: '3D & immersive web',
    line: 'Launch pages people scroll twice — real-time 3D that still loads fast.',
    points: ['Three.js / React Three Fiber', 'Scroll storytelling', 'Product configurators', 'Performance budgets'],
    proof: 'NIRA · Between Stations',
  },
  {
    id: 'care',
    index: '06',
    title: 'Deploy, maintain & support',
    line: 'We stay after launch: cloud deploys, monitoring, fixes and upgrades on a plan.',
    points: ['AWS / VPS / IIS deployments', 'Logs, uptime & incident fixes', 'Monthly or annual care plans', 'Feature iterations'],
    proof: 'Production ops experience',
  },
];

export const process = [
  { id: 'discover', title: 'Discover', line: 'We map the real problem, users and success metric before any code.' },
  { id: 'design', title: 'Design', line: 'Flows, wireframes and a clickable prototype you can react to.' },
  { id: 'build', title: 'Build', line: 'Weekly demos on a live staging link — no black box.' },
  { id: 'test', title: 'Test', line: 'Edge cases, load, devices and AI-output evaluation.' },
  { id: 'ship', title: 'Ship', line: 'Production deploy, domain, analytics and handover docs.' },
  { id: 'maintain', title: 'Maintain', line: 'Monitoring, fixes and new features on a care plan.' },
];

export const techMarquee = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Socket.IO', 'Gemini Live', 'LangGraph',
  'LangChain', 'RAG', 'MediaPipe', 'TensorFlow.js', 'Three.js', 'R3F', 'Redis', 'AWS', 'Docker', 'Razorpay', 'Tailwind',
];
