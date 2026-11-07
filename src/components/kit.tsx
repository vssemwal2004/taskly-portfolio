'use client';

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { useTheme } from 'next-themes';
import { Wordmark } from './Logo';

/* ---------- Icons ---------- */
export const ArrowRight = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

/* ---------- Spotlight card ---------- */
export function Spotlight({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'li' }) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <Tag onPointerMove={onMove} className={`spotlight card ${className}`}>{children}</Tag>;
}

/* ---------- Magnetic wrapper (pulls toward the cursor) ---------- */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className="inline-block transition-transform duration-300 ease-out"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
      }}
      onPointerLeave={() => { ref.current!.style.transform = ''; }}
    >
      {children}
    </span>
  );
}

/* ---------- Browser frame for real screenshots ---------- */
export function AppFrame({ src, srcLight, alt, url, className = '', priority = false }: { src: string; srcLight?: string; alt: string; url?: string; className?: string; priority?: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const img = mounted && resolvedTheme === 'light' && srcLight ? srcLight : src;
  return (
    <div className={`overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-[var(--shadow)] ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-line bg-surface-2 px-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {url && (
          <span className="mx-auto flex h-5 min-w-0 max-w-[60%] items-center truncate rounded-md bg-bg px-3 font-mono text-[11px] text-muted">
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} data-inner-parallax className="absolute inset-0 h-full w-full object-cover object-top" loading={priority ? 'eager' : 'lazy'} />
      </div>
    </div>
  );
}

/* ---------- Theme toggle ---------- */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = !mounted || resolvedTheme !== 'light';
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      data-cursor="hover"
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
      )}
    </button>
  );
}

/* ---------- Text scramble on hover ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/';
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const run = () => {
    const el = ref.current;
    if (!el) return;
    let f = 0;
    const total = 14;
    const tick = () => {
      el.textContent = text.split('').map((ch, i) => (i < (f / total) * text.length || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
      if (++f <= total) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    tick();
  };
  return <span ref={ref} onPointerEnter={run} aria-label={text}>{text}</span>;
}

/* ---------- Navigation ---------- */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links: [string, string][] = [['Work', '/#work'], ['Services', '/#services'], ['Process', '/#process'], ['Team', '/#team']];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'border-b border-line bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <a href="/#top" aria-label="TasklyTech Solutions — home" data-cursor="hover"><Wordmark /></a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => (
            <li key={h}><a href={h} className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-2 transition-colors hover:text-ink" data-cursor="hover"><Scramble text={l} /></a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href="/#contact" className="btn btn-primary hidden h-9 px-4 text-[13.5px] sm:inline-flex" data-cursor="hover">Start a project</a>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-line-strong md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="grid gap-1 border-t border-line px-5 py-4 md:hidden">
          {[...links, ['Start a project', '/#contact'] as [string, string]].map(([l, h]) => (
            <li key={h}><a href={h} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 text-[15px]">{l}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}

/* ---------- Section heading (animated by <Animations/> via data-*) ---------- */
export function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-[900px] text-center' : 'max-w-[900px]'}>
      <div data-reveal className="eyebrow mb-5 flex items-center gap-2" style={center ? { justifyContent: 'center' } : undefined}>
        <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {eyebrow}
      </div>
      <h2 data-split className="h-section text-[clamp(2.3rem,5.6vw,4.6rem)]">{title}</h2>
      {sub && <p data-reveal className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-ink-2" style={center ? { marginInline: 'auto' } : undefined}>{sub}</p>}
    </div>
  );
}
