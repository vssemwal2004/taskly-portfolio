'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, prefersReduced } from '@/lib/gsap';
import { projects } from '@/data/projects';
import { ArrowUpRight } from '../kit';

/**
 * Project index — every project as a large row. On desktop the project's
 * screen floats beside the cursor (with lag + tilt); on mobile each row
 * shows its screenshot inline.
 */
export function ScreensWall() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(-1);

  useGSAP(
    () => {
      if (prefersReduced() || !window.matchMedia('(pointer: fine)').matches) return;
      const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' });
      const rTo = gsap.quickTo(preview.current, 'rotate', { duration: 0.8, ease: 'power3' });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const r = root.current!.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      root.current!.addEventListener('pointermove', move);
      return () => root.current?.removeEventListener('pointermove', move);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-scene="stream" data-chapter="Index" className="relative mx-auto max-w-[1320px] px-5 pb-10 pt-32 sm:px-8" aria-labelledby="index-h" onPointerLeave={() => setHover(-1)}>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div data-reveal className="eyebrow mb-5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Project index</div>
          <h2 id="index-h" data-split className="h-section text-[clamp(2.3rem,5.6vw,4.6rem)]">Everything we’ve <span className="serif">shipped.</span></h2>
        </div>
        <p data-reveal className="max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">Ten products across AI, education, booking, operations and launch experiences. Hover a row to preview — open it for the full case study.</p>
      </div>

      <ol className="border-t border-line-strong">
        {projects.map((p, i) => (
          <li key={p.slug} data-reveal data-delay={Math.min(i, 5) * 0.04}>
            <Link
              href={`/work/${p.slug}/`}
              onPointerEnter={() => setHover(i)}
              data-cursor="view"
              className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-x-4 gap-y-3 border-b border-line-strong py-6 transition-[padding,background] duration-500 ease-out hover:bg-[color-mix(in_oklab,var(--ink)_3%,transparent)] md:grid-cols-[3rem_1.4fr_1fr_0.6fr_auto] md:py-8 md:hover:px-4"
            >
              <span className="font-mono text-[12px] text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="block truncate text-[clamp(1.5rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-2">
                  {p.name.split(' — ')[0]}
                </span>
                <span className="mt-2 block text-[14px] text-ink-2 md:hidden">{p.category}</span>
              </span>
              <span className="hidden text-[15px] text-ink-2 md:block">{p.category}</span>
              <span className="hidden items-center gap-2 font-mono text-[12px] text-muted md:flex">
                <span className={`h-1.5 w-1.5 rounded-full ${p.status.startsWith('Live') ? 'bg-[#22c55e]' : 'bg-[var(--violet)]'}`} />{p.year}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-bg"><ArrowUpRight /></span>
              {/* mobile: inline screenshot */}
              <span className="col-span-3 block overflow-hidden rounded-xl border border-line md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.screen} alt={`${p.name} screen`} loading="lazy" className="aspect-[16/9] w-full object-cover object-top" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* desktop floating preview */}
      <div ref={preview} className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block" aria-hidden="true">
        <div className={`-translate-x-1/2 -translate-y-[60%] transition-[opacity,transform] duration-500 ease-out ${hover >= 0 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <div className="relative h-[250px] w-[400px] overflow-hidden rounded-[16px] border border-line-strong bg-surface shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]">
            {projects.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.slug}
                src={p.screen}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-500 ease-out"
                style={{ opacity: hover === i ? 1 : 0, transform: hover === i ? 'scale(1)' : 'scale(1.12)' }}
              />
            ))}
            <span className="absolute bottom-3 left-3 rounded-full px-3 py-1 font-mono text-[11px] text-[#0b0b0c]" style={{ background: hover >= 0 ? projects[hover].accent : 'transparent' }}>
              {hover >= 0 ? projects[hover].status : ''}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
