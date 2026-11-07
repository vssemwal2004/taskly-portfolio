import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic'], variable: '--font-instrument', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'TasklyTech Solutions — AI & product engineering studio', template: '%s · TasklyTech' },
  description:
    'TasklyTech Solutions designs, builds and maintains AI voice agents, agentic workflows, full-stack platforms, ERP systems and immersive web experiences.',
  keywords: ['TasklyTech', 'AI development', 'web development agency', 'AI voice agent', 'LangGraph', 'Next.js', 'Dehradun'],
  openGraph: {
    title: 'TasklyTech Solutions',
    description: 'We build AI products that ship — and keep them running.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf7' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
