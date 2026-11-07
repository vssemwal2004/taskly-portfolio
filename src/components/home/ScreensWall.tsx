'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, prefersReduced } from '@/lib/gsap';
import { allScreens } from '@/data/projects';

/**
 * A tilted wall of every project screen. Columns travel at different speeds
 * (and directions) as you scroll; the whole wall straightens as it enters.
 */
export function ScreensWall() {
  const root = useRef<HTMLElement>(null);
  const COLS = 5;
  const cols = Array.from({ length: COLS }, (_, c) => allScreens.filter((_, i) => i % COLS === c));
  // pad short columns so every column is tall enough
  cols.forEach((col, c) => { let k = 0; while (col.length < 6) col.push(allScreens[(c * 3 + k++) % allScreens.length]); });

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.utils.toArray<HTMLElement>('[data-wcol]').forEach((col, i) => {
        const dir = i % 2 ? 1 : -1;
        gsap.fromTo(col, { yPercent: dir * -12 }, { yPercent: dir * 12 - 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      });
      gsap.fromTo('[data-wall]', { rotateX: 38, rotateZ: -14, scale: 1.35 }, { rotateX: 16, rotateZ: -8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 } });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-scene="stream" data-chapter="Screens" className="relative h-[150vh] overflow-hidden" aria-labelledby="wall-h">
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,var(--bg)_0%,transparent_22%,transparent_78%,var(--bg)_100%)]" />
      <div className="absolute inset-0 grid place-items-center [perspective:1800px]">
        <div data-wall className="grid w-[140vw] grid-cols-5 gap-5 [transform-style:preserve-3d] will-change-transform">
          {cols.map((col, c) => (
            <div key={c} data-wcol className="flex flex-col gap-5">
              {col.map((s, i) => (
                <Link key={`${s.src}-${i}`} href={`/work/${s.slug}/`} data-cursor="view" className="group relative block overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-[var(--shadow)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] px-2.5 py-1 font-mono text-[10px] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">{s.alt}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-5">
        <div className="text-center">
          <div className="eyebrow mb-4">{allScreens.length} screens · 10 products</div>
          <h2 id="wall-h" className="h-display text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.9] [text-shadow:0_10px_60px_var(--bg)]">
            Real screens.<br /><span className="serif">Real products.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
