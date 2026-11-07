'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReduced } from '@/lib/gsap';
import { stage, story } from '@/lib/story';
import { featured } from '@/data/projects';
import { ArrowRight, ArrowUpRight, Magnetic } from '../kit';
import { scrollToY } from '../SmoothScroll';

const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

/* Laptop poses — text and laptop never share space:
   desktop: copy in the left column, laptop on the right;  mobile: copy on top, laptop below. */
export const POSE = {
  desktop: {
    start: { x: 1.45, y: -0.22, rotY: -0.66, rotX: 0.36, scale: 0.9 },
    open: { x: 1.5, y: -0.42, rotY: -0.36, rotX: 0.1, scale: 0.9 },
    work: { x: 1.5, y: -0.42, rotY: -0.36, rotX: 0.1, scale: 0.9 },
  },
  mobile: {
    start: { x: 0, y: -1.1, rotY: -0.32, rotX: 0.38, scale: 0.68 },
    open: { x: 0, y: -1.2, rotY: 0, rotX: 0.08, scale: 0.68 },
    work: { x: 0, y: 0.42, rotY: 0, rotX: 0.04, scale: 0.68 },
  },
};
export const pose = () => (isDesktop() ? POSE.desktop : POSE.mobile);

/* =====================================================================
   HERO — closed laptop beside the headline; scrolling opens and boots it
   ===================================================================== */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const P = pose();
      const title = SplitText.create('[data-hero-title]', { type: 'words,lines', mask: 'lines' });
      gsap.set(title.lines, { yPercent: 110 });
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 18 });
      Object.assign(story, { ...P.start, rotY: -2.6, scale: 0.6, y: P.start.y - 0.6 });

      const intro = () => {
        gsap.timeline()
          .to(story, { ...P.start, duration: 2.4, ease: 'expo.out' }, 0)
          .to(title.lines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.1)
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.07 }, 0.45);
      };
      if (prefersReduced()) {
        gsap.set(title.lines, { yPercent: 0 });
        gsap.set('[data-hero-fade]', { autoAlpha: 1, y: 0 });
        Object.assign(story, { ...P.open, open: 1, power: 1 });
        return;
      }
      window.addEventListener('intro', intro, { once: true });

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', pin: true, scrub: 1, anticipatePin: 1 },
      })
        .to('[data-hero-copy]', { autoAlpha: 0, y: -40, duration: 0.3, ease: 'power2.in' }, 0)
        .fromTo(story, { ...P.start }, { ...P.open, duration: 0.6, immediateRender: false }, 0)
        .fromTo(story, { open: 0 }, { open: 1, duration: 0.5, immediateRender: false }, 0.05)
        .fromTo(story, { power: 0 }, { power: 1, duration: 0.25, immediateRender: false }, 0.35)
        .fromTo('[data-hero-caption]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.5);

      return () => window.removeEventListener('intro', intro);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} data-scene="grid" data-chapter="Idea" className="relative h-svh overflow-hidden">
      <div className="relative z-10 mx-auto grid h-full max-w-[1320px] px-5 pb-8 pt-24 sm:px-8 md:items-center md:pb-10">
        {/* left column (desktop) / top block (mobile) */}
        <div className="relative w-full md:max-w-[50%]">
          <div data-hero-copy>
            <div data-hero-fade className="eyebrow mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-brand" />
              AI &amp; product engineering studio
            </div>
            <h1 data-hero-title className="h-display text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.95]">
              We build AI products that <span className="serif pr-[0.06em]">actually ship.</span>
            </h1>
            <p data-hero-fade className="mt-6 hidden max-w-[44ch] text-[16.5px] leading-relaxed text-ink-2 sm:block">
              TasklyTech Solutions designs, builds and maintains AI voice agents, agentic workflows and full-stack platforms — from first call to production.
            </p>
            <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic><a href="#contact" className="btn btn-brand h-12 px-6" data-cursor="hover">Start a project <ArrowRight /></a></Magnetic>
              <Magnetic><a href="#work" className="btn btn-ghost h-12 px-6" data-cursor="hover">See our work</a></Magnetic>
            </div>
            <dl data-hero-fade className="mt-10 hidden gap-8 border-t border-line pt-6 sm:flex">
              {[['10', 'Products shipped'], ['6', 'Service lines'], ['2', 'Engineers, one studio']].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em]">{n}</dt>
                  <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-hero-caption className="invisible absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2">
            <div className="eyebrow mb-4 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Chapter 01 — Idea</div>
            <p className="h-display text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1]">
              Every product <br className="hidden md:block" />starts as a <span className="serif">task.</span>
            </p>
            <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed text-ink-2">We turn yours into software people use every day. Keep scrolling — here are a few we shipped.</p>
          </div>
        </div>
      </div>

      <div data-hero-fade className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:flex">
        <span className="relative block h-8 w-px overflow-hidden bg-line-strong"><span className="absolute inset-x-0 top-0 h-1/2 animate-[scrolldot_1.6s_ease-in-out_infinite] bg-ink" /></span>
        Scroll to open
      </div>
    </section>
  );
}

/* =====================================================================
   WORK — pinned; laptop glides right, screen wipes between real projects
   ===================================================================== */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const shown = useRef(0); // texture index currently on screen (0 = boot)
  const n = featured.length;

  // screen + accent transition when the active project changes
  useEffect(() => {
    const target = active < 0 ? 0 : active + 1;
    if (target === shown.current) return;
    story.from = shown.current;
    story.to = target;
    story.mix = 0;
    shown.current = target;
    gsap.to(story, { mix: 1, duration: 1.15, ease: 'power3.inOut', overwrite: 'auto' });
    story.accent = active < 0 ? '#C6FF3D' : featured[active].accent;
    if (active >= 0) {
      gsap.to(story, { rotY: isDesktop() ? -0.42 + (active % 2 ? 0.12 : 0) : 0, duration: 1.4, ease: 'expo.out', overwrite: false });
      const panel = root.current?.querySelector<HTMLElement>(`[data-panel="${active}"]`);
      if (panel) {
        gsap.fromTo(panel.querySelectorAll('[data-line]'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, overwrite: true });
      }
      root.current?.style.setProperty('--accent', featured[active].accent);
    }
  }, [active]);

  useGSAP(
    () => {
      if (prefersReduced()) { setActive(0); return; }
      const d = isDesktop();

      // laptop slides from hero centre to the right half (or top on mobile)
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: 1 } })
        .fromTo(story, { ...pose().open }, { ...pose().work, immediateRender: false });

      // pin + pick the active project from progress
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: `+=${n * 95}%`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const f = self.progress * n * 0.9999;
          setActive(Math.min(n - 1, Math.floor(f)));
          gsap.set('[data-work-bar]', { scaleX: self.progress });
          // inside each project the laptop slowly turns and dollies in — never static
          const lp = f % 1;
          story.turn = (lp - 0.5) * 0.22;
          story.z = Math.sin(lp * Math.PI) * 0.22;
        },
        onLeaveBack: () => { setActive(-1); story.turn = 0; story.z = 0; },
        onLeave: () => { story.turn = 0; story.z = 0; },
      });


      // laptop closes and drops away after the last project
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: document.getElementById('after-work'),
          start: 'top bottom',
          end: 'top 15%',
          scrub: 1,
          // the scene itself goes to sleep once the laptop is fully hidden (see Scene.Rig)
          onEnter: () => stage.set(true),
          onEnterBack: () => stage.set(true),
        },
      })
        // explicit from-values: .to() would record the values from page load
        .fromTo(story, { open: 1, power: 1 }, { open: 0, power: 0, duration: 0.6, immediateRender: false }, 0)
        .fromTo(
          story,
          { ...pose().work },
          { x: d ? 1.9 : 0, y: d ? -2.8 : -2.2, rotY: -1.1, rotX: 0.55, scale: 0.75, duration: 1, immediateRender: false },
          0,
        )
        .fromTo(story, { visible: 1 }, { visible: 0, duration: 0.12, immediateRender: false }, 0.88);
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === root.current && s.pin);
    if (!st) return;
    scrollToY(st.start + ((i + 0.5) / n) * (st.end - st.start));
  };

  return (
    <section id="work" ref={root} data-scene="grid" data-chapter="Build" className="relative h-svh overflow-hidden" style={{ ['--accent' as string]: featured[0].accent }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-1000" style={{ background: 'radial-gradient(45% 55% at 72% 48%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)' }} />

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-5 pb-8 pt-24 sm:px-8 md:justify-center md:pb-0">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          Selected work <span className="text-ink">{String(Math.max(0, active) + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </div>

        <div className="relative min-h-[300px] w-full md:min-h-[560px] md:max-w-[46%]">
          {featured.map((p, i) => {
            const shots = p.gallery.filter((g) => !/logo|mark/.test(g.src));
            return (
              <article key={p.slug} data-panel={i} className={`absolute inset-x-0 bottom-0 md:bottom-auto md:top-0 ${i === Math.max(0, active) ? 'visible' : 'invisible'}`} aria-hidden={i !== Math.max(0, active)}>
                <div className="rounded-[22px] border border-line bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] p-5 backdrop-blur-xl md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                  <div className="overflow-hidden"><div data-line className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="eyebrow" style={{ color: 'color-mix(in oklab, var(--accent) 75%, var(--ink))' }}>{p.category}</span>
                    <span className="pill"><span className={`h-1.5 w-1.5 rounded-full ${p.status.startsWith('Live') ? 'bg-[#22c55e]' : 'bg-[var(--violet)]'}`} />{p.status}</span>
                    <span className="pill hidden sm:inline-flex">{p.year}</span>
                  </div></div>
                  <div className="overflow-hidden"><h3 data-line className="h-display pb-1 text-[clamp(2.1rem,4.8vw,4.4rem)]">{p.name.split(' — ')[0]}</h3></div>
                  <div className="overflow-hidden"><p data-line className="serif mt-1 text-[clamp(1.1rem,1.6vw,1.45rem)] leading-snug text-ink-2">{p.tagline}</p></div>
                  <div className="overflow-hidden"><p data-line className="mt-4 line-clamp-3 max-w-[50ch] text-[15px] leading-relaxed text-ink-2 md:line-clamp-none md:text-[15.5px]">{p.summary}</p></div>
                  <div className="hidden overflow-hidden md:block"><ul data-line className="mt-5 grid gap-2 border-t border-line pt-5">
                    {(p.ai.length ? [p.ai[0], ...p.built.slice(0, 2)] : p.built.slice(0, 3)).map((b, k) => (
                      <li key={b} className="flex gap-3 text-[14.5px] leading-snug">
                        {k === 0 && p.ai.length ? (
                          <span className="mt-[1px] shrink-0 rounded bg-brand px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#0b0b0c]">AI</span>
                        ) : (
                          <svg className="mt-[3px] shrink-0" style={{ color: 'var(--accent)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        )}
                        <span className="text-ink-2">{b}</span>
                      </li>
                    ))}
                  </ul></div>
                  <div className="hidden overflow-hidden md:block"><ul data-line className="mt-5 flex flex-wrap gap-1.5">{p.stack.slice(0, 7).map((t) => <li key={t} className="pill">{t}</li>)}</ul></div>
                  <div className="overflow-hidden pt-1"><div data-line className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link href={`/work/${p.slug}/`} className="btn btn-primary" data-cursor="view">Case study <ArrowRight /></Link>
                    {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor="open">Live site <ArrowUpRight /></a>}
                    {shots.length > 0 && (
                      <span className="ml-1 hidden items-center gap-1.5 lg:flex">
                        {shots.slice(0, 3).map((g) => (
                          <Link key={g.src} href={`/work/${p.slug}/`} className="group block h-11 w-[70px] overflow-hidden rounded-md border border-line-strong" data-cursor="view" aria-label={g.alt}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={g.src} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                          </Link>
                        ))}
                      </span>
                    )}
                  </div></div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 md:absolute md:inset-x-8 md:bottom-8 md:mt-0">
          <div className="relative h-px w-full bg-line-strong"><div data-work-bar className="absolute inset-0 origin-left scale-x-0 bg-ink" /></div>
          <ol className="mt-3 hidden grid-cols-6 gap-4 md:grid">
            {featured.map((p, i) => (
              <li key={p.slug}>
                <button type="button" onClick={() => jump(i)} className={`font-mono text-[11.5px] uppercase tracking-[0.08em] transition-colors ${i === active ? 'text-ink' : 'text-muted hover:text-ink-2'}`} data-cursor="hover">
                  {String(i + 1).padStart(2, '0')} {p.name.split(' — ')[0]}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
