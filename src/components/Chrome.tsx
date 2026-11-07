'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '@/lib/gsap';
import { story } from '@/lib/story';

/* ---------- Cursor: blend-mode dot that grows over interactive things ---------- */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setOn(true);
    const xTo = gsap.quickTo(dot.current, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(dot.current, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]') as HTMLElement | null;
      const v = t?.dataset.cursor ?? (t ? 'hover' : '');
      setLabel(v);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  const big = label && label !== 'hover';
  return (
    <div ref={dot} className={`pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block ${on ? '' : '!hidden'}`} aria-hidden="true">
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[width,height] duration-300 ease-out ${big ? 'grid h-24 w-24 place-items-center' : label === 'hover' ? 'h-12 w-12' : 'h-3 w-3'}`}
      >
        {big && <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black">{label}</span>}
      </div>
    </div>
  );
}

/* ---------- Preloader: counter + curtain, waits for the 3D stage ---------- */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('is-loading');
    const counter = { v: 0 };
    const fast = prefersReduced();
    const paint = () => { if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0'); };
    // creep toward 90 while the 3D bundle downloads
    const creep = gsap.to(counter, { v: 90, duration: fast ? 0.2 : 4, ease: 'power3.out', onUpdate: paint });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      creep.kill();
      // a fresh timeline: tweens appended to a completed timeline never play
      gsap.timeline()
        .to(counter, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: paint })
        .to('[data-pl-line]', { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '<')
        .to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.15')
        .add(() => {
          document.documentElement.classList.remove('is-loading');
          window.dispatchEvent(new Event('intro'));
        }, '-=0.75')
        .add(() => setGone(true));
    };
    if (story.ready) finish();
    window.addEventListener('stage-ready', finish);
    const fallback = setTimeout(finish, 7000);
    return () => { window.removeEventListener('stage-ready', finish); clearTimeout(fallback); };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#09090b] p-6 text-[#ededef] sm:p-10" role="status" aria-label="Loading">
      <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.1em] text-white/50">
        <span>TasklyTech Solutions</span>
        <span>AI · Web · 3D</span>
      </div>
      <div>
        <div className="mb-4 h-px w-full origin-left scale-x-0 bg-[#C6FF3D]" data-pl-line />
        <div className="flex items-end justify-between">
          <span className="font-serif text-[clamp(1.6rem,4vw,3rem)] italic text-white/70">Booting the studio</span>
          <span ref={num} className="text-[clamp(4.5rem,16vw,13rem)] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums">000</span>
        </div>
      </div>
    </div>
  );
}
