// From the team's résumés. Add LinkedIn URLs and photos when available:
// photos go in /public/team/<id>.jpg and set `photo` below.

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  phone: string;
  email: string;
  github: string;
  linkedin?: string;
  photo?: string;
  location: string;
  education: string;
  skills: string[];
  highlights: string[];
}

export const team: Member[] = [
  {
    id: 'anubhav',
    name: 'Anubhav Dhyani',
    initials: 'AD',
    role: 'AI & Full-Stack Engineer',
    focus: 'Real-time voice agents, multi-agent workflows and intelligent assessment platforms.',
    phone: '+91 70884 49687',
    email: 'anubhavdhyani2@gmail.com',
    github: 'https://github.com/Anubhav-dhyani',
    location: 'Dehradun, India',
    education: 'B.Tech CSE · Graphic Era Hill University',
    skills: ['Gemini Live', 'LangGraph', 'LangChain', 'RAG', 'MediaPipe', 'TensorFlow.js', 'React', 'Node.js', 'AWS'],
    highlights: [
      'Technical Intern, Cloud & Production Engineering — VS Infotech (2026 —)',
      'Built ANVI, the real-time AI voice interviewer in PeerPrep',
      'Google Summer of Code 2025 contributor',
      'Hackathon finalist — Chandigarh University (top 5%) & ABV-IIITM Gwalior',
      'AWS Cloud Practitioner Essentials',
    ],
  },
  {
    id: 'vivek',
    name: 'Vivek Semwal',
    initials: 'VS',
    role: 'Full-Stack & Product Design Engineer',
    focus: 'Production web platforms, real-time booking systems and interfaces that feel crafted.',
    phone: '+91 75086 69870',
    email: '422semwalvivek@gmail.com',
    github: 'https://github.com/vssemwal2004',
    location: 'Dehradun, India',
    education: 'B.Tech CSE · Graphic Era Hill University',
    skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'Socket.IO', 'Three.js', 'Figma', 'scikit-learn'],
    highlights: [
      'Led end-to-end build and beta launch of SkillSwap Hub',
      'Built StayEase — real-time hotel booking with Razorpay',
      'Joined Google Summer of Code 2025 for open-source contribution',
      'Hackathon finalist — Chandigarh University & ABV-IIITM Gwalior',
      'AWS Solutions Architect Foundations',
    ],
  },
];

export const company = {
  name: 'TasklyTech Solutions',
  short: 'TasklyTech',
  city: 'Dehradun, India',
  primaryEmail: 'anubhavdhyani2@gmail.com',
  emails: team.map((m) => m.email),
  whatsapp: '917088449687',
};
