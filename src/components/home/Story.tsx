'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReduced } from '@/lib/gsap';
import { stage, story } from '@/lib/story';
import { featured } from '@/data/projects';
import { ArrowRight, ArrowUpRight, Magnetic } from '../kit';
import { scrollToY } from '../SmoothScroll';

const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

/* =====================================================================
   HERO — closed laptop rotates in; scrolling opens the lid and boots it
   ===================================================================== */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = SplitText.create('[data-hero-title]', { type: 'chars,lines', mask: 'lines' });
      gsap.set(title.chars, { yPercent: 115 });
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 });

      const intro = () => {
        const tl = gsap.timeline();
        tl.fromTo(story, { rotY: -2.6, rotX: 0.6, scale: 0.7, y: -0.8 }, { rotY: -0.5, rotX: 0.38, scale: 1, y: -0.12, duration: 2.2, ease: 'expo.out' }, 0)
          .to(title.chars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.022 }, 0.15)
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.5);
      };
      if (prefersReduced()) {
        gsap.set(title.chars, { yPercent: 0 });
        gsap.set('[data-hero-fade]', { autoAlpha: 1, y: 0 });
        Object.assign(story, { rotY: -0.3, rotX: 0.2, scale: 1, y: -0.4, open: 1, power: 1 });
        return;
      }
      window.addEventListener('intro', intro, { once: true });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=150%', pin: true, scrub: 1, anticipatePin: 1 },
      });
      tl.to(title.chars, { yPercent: -115, stagger: 0.006, duration: 0.3 }, 0)
        .to('[data-hero-fade]', { autoAlpha: 0, y: -30, duration: 0.2 }, 0)
        .fromTo(story, { open: 0 }, { open: 1, duration: 0.5, immediateRender: false }, 0.05)
        .fromTo(story, { rotY: -0.5, rotX: 0.38, y: -0.12, scale: 1 }, { rotY: 0, rotX: 0.06, y: -0.66, scale: 1.2, duration: 0.6, immediateRender: false }, 0)
        .fromTo(story, { power: 0 }, { power: 1, duration: 0.25, immediateRender: false }, 0.35)
        .fromTo('[data-hero-caption]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.7)
        .to(story, { scale: 1.3, duration: 0.4 }, 0.6);

      return () => window.removeEventListener('intro', intro);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} data-scene="grid" data-chapter="Idea" className="relative h-svh overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,color-mix(in_oklab,var(--ink)_9%,transparent),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(50%_60%_at_50%_100%,color-mix(in_oklab,var(--brand)_10%,transparent),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-between px-5 pb-8 pt-24 sm:px-8 sm:pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div data-hero-fade className="eyebrow flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-brand" />
            AI &amp; product engineering studio · Dehradun
          </div>
          <div data-hero-fade className="max-w-[330px] text-[15px] leading-relaxed text-ink-2">
            We design, build and maintain AI voice agents, agentic workflows and full-stack platforms — from first call to production.
            <div className="mt-5"><Magnetic><a href="#contact" className="btn btn-brand" data-cursor="hover">Start a project <ArrowRight /></a></Magnetic></div>
          </div>
        </div>

        <div>
          <h1 data-hero-title className="h-display text-[clamp(3.1rem,10.6vw,10.4rem)] leading-[0.88]">
            We build AI products<br />that <span className="serif pr-[0.08em]">actually ship.</span>
          </h1>
          <div data-hero-fade className="mt-6 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
            <span>Scroll to open</span>
            <span className="relative block h-px w-24 overflow-hidden bg-line-strong"><span className="absolute inset-y-0 left-0 w-1/2 animate-[cue_1.6s_ease-in-out_infinite] bg-ink" /></span>
            <span>(01 — 06)</span>
          </div>
        </div>
      </div>

      <div data-hero-caption className="invisible absolute inset-x-0 bottom-[7vh] z-10 text-center">
        <p className="font-serif text-[clamp(1.6rem,3.2vw,2.6rem)] italic">Every product starts as a task.</p>
        <p className="eyebrow mt-2">Here are a few we shipped ↓</p>
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
      gsap.to(story, { rotY: isDesktop() ? -0.38 + (active % 2 ? 0.1 : -0.06) : 0, duration: 1.2, ease: 'power3.out', overwrite: false });
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
        .fromTo(story, { x: 0, y: -0.66, scale: 1.3, rotY: 0, rotX: 0.06 }, { x: d ? 1.42 : 0, y: d ? -0.42 : 0.42, scale: d ? 1.02 : 0.68, rotY: d ? -0.38 : 0, rotX: d ? 0.1 : 0.04, immediateRender: false });

      // pin + pick the active project from progress
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: `+=${n * 95}%`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.9999)));
          gsap.set('[data-work-bar]', { scaleX: self.progress });
        },
        onLeaveBack: () => setActive(-1),
      });

      // big index number drifts
      gsap.to('[data-work-index]', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: `+=${n * 95}%`, scrub: true } });

      // laptop closes and drops away after the last project
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: document.getElementById('after-work'),
          start: 'top bottom',
          end: 'top 15%',
          scrub: 1,
          onLeave: () => stage.set(false),
          onEnterBack: () => stage.set(true),
        },
      })
        .to(story, { open: 0, power: 0, duration: 0.6 }, 0)
        .to(story, { y: d ? -2.6 : -2, rotY: -1.1, rotX: 0.5, scale: 0.8, duration: 1 }, 0)
        .to(story, { visible: 0, duration: 0.15 }, 0.85);
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
      <div aria-hidden="true" data-work-index className="pointer-events-none absolute -left-4 bottom-[-6vh] z-0 select-none text-[34vw] font-semibold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)] md:text-[24vw]">
        {String(Math.max(0, active) + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-5 pb-8 pt-24 sm:px-8 md:justify-center md:pb-0">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          Selected work <span className="text-ink">{String(Math.max(0, active) + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </div>

        <div className="relative min-h-[300px] w-full md:min-h-[420px] md:max-w-[44%]">
          {featured.map((p, i) => (
            <article key={p.slug} data-panel={i} className={`absolute inset-x-0 top-0 ${i === Math.max(0, active) ? 'visible' : 'invisible'}`} aria-hidden={i !== Math.max(0, active)}>
              <div className="overflow-hidden"><div data-line className="mb-3 flex flex-wrap items-center gap-2">
                <span className="eyebrow">{p.category}</span>
                <span className="pill"><span className={`h-1.5 w-1.5 rounded-full ${p.status.startsWith('Live') ? 'bg-[#22c55e]' : 'bg-[var(--violet)]'}`} />{p.status}</span>
              </div></div>
              <div className="overflow-hidden"><h3 data-line className="h-display pb-1 text-[clamp(2.4rem,5.6vw,5rem)]">{p.name.split(' — ')[0]}</h3></div>
              <div className="overflow-hidden"><p data-line className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-2 md:text-[17px]">{p.summary}</p></div>
              {p.ai[0] && (
                <div className="hidden overflow-hidden md:block"><p data-line className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
                  <span className="mr-2 rounded bg-brand px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#0b0b0c]">AI</span>{p.ai[0]}
                </p></div>
              )}
              <div className="hidden overflow-hidden md:block"><ul data-line className="mt-5 flex flex-wrap gap-1.5">{p.stack.slice(0, 6).map((t) => <li key={t} className="pill">{t}</li>)}</ul></div>
              {p.gallery.length > 0 && (
                <div className="hidden overflow-hidden md:block"><div data-line className="mt-5 flex gap-2.5">
                  {p.gallery.slice(0, 3).map((g) => (
                    <Link key={g.src} href={`/work/${p.slug}/`} className="group relative block h-[68px] w-[108px] overflow-hidden rounded-lg border border-line-strong" data-cursor="view">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                    </Link>
                  ))}
                  {p.gallery.length > 3 && <span className="grid h-[68px] w-[68px] place-items-center rounded-lg border border-dashed border-line-strong font-mono text-[12px] text-muted">+{p.gallery.length - 3}</span>}
                </div></div>
              )}
              <div className="overflow-hidden pt-1"><div data-line className="mt-6 flex flex-wrap gap-2.5">
                <Link href={`/work/${p.slug}/`} className="btn btn-primary" data-cursor="view">Case study <ArrowRight /></Link>
                {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor="open">Live site <ArrowUpRight /></a>}
              </div></div>
            </article>
          ))}
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
