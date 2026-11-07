'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '@/lib/gsap';
import { moreBuilds } from '@/data/projects';
import { services, process } from '@/data/services';
import { team, company, type Member } from '@/data/team';
import { ArrowRight, ArrowUpRight, Magnetic, SectionHead } from '../kit';
import { LogoMark } from '../Logo';
import { VISUALS } from './visuals';

const tel = (p: string) => `tel:${p.replace(/\s/g, '')}`;

/* =====================================================================
   VELOCITY MARQUEE — speed and skew follow how fast you scroll
   ===================================================================== */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]');
      if (prefersReduced()) return;
      const state = { v: 0 };
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { state.v = gsap.utils.clamp(-2500, 2500, s.getVelocity()); } });
      const pos = rows.map(() => 0);
      const tick = () => {
        state.v *= 0.92;
        rows.forEach((r, i) => {
          const dir = i % 2 ? 1 : -1;
          pos[i] += dir * (0.04 + Math.abs(state.v) * 0.00012);
          pos[i] = ((pos[i] % 50) - 50) % 50;
          gsap.set(r, { xPercent: pos[i], skewX: -state.v * 0.0025 * dir });
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );
  const words = ['AI agents', 'Voice AI', 'Platforms', 'ERP systems', '3D web', 'Maintenance'];
  return (
    <div id="after-work" ref={root} data-scene="stream" data-chapter="Systems" className="relative overflow-hidden border-y border-line py-10" aria-label="What we do">
      {[0, 1].map((r) => (
        <div key={r} data-row className="flex w-max whitespace-nowrap py-1 will-change-transform" aria-hidden={r === 1}>
          {[...words, ...words, ...words, ...words].map((w, i) => (
            <span key={i} className={`mr-10 flex items-center gap-10 text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-none tracking-[-0.05em] ${(i + r) % 2 ? 'text-transparent [-webkit-text-stroke:1.2px_var(--ink)]' : ''}`}>
              {i % 3 === 1 ? <span className="serif font-normal">{w}</span> : w}
              <span className="inline-block h-[0.35em] w-[0.35em] rounded-full bg-brand" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* =====================================================================
   HORIZONTAL GALLERY — pinned sideways scroll of the other builds
   ===================================================================== */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const dist = () => track.current!.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(track.current, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray<HTMLElement>('[data-gimg]').forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-gcard]').forEach((card) => {
          gsap.fromTo(card, { rotateY: -14, z: -120 }, { rotateY: 0, z: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 45%', scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="relative overflow-hidden py-24 md:flex md:h-svh md:items-center md:py-0" aria-labelledby="builds-h">
      <div ref={track} className="flex flex-col gap-6 px-5 sm:px-8 md:w-max md:flex-row md:items-stretch md:gap-8 md:pl-[8vw] md:[perspective:1400px]">
        <div className="flex shrink-0 flex-col justify-center md:w-[34vw]">
          <div className="eyebrow mb-5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Behind the scenes</div>
          <h2 id="builds-h" className="h-section text-[clamp(2.2rem,4.4vw,4rem)]">Systems that quietly <span className="serif">run things.</span></h2>
          <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed text-ink-2">Internal platforms for universities and operators. Mock screens shown — real data stays private.</p>
          <p className="eyebrow mt-8 hidden md:block">Keep scrolling →</p>
        </div>
        {moreBuilds.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}/`} data-gcard data-cursor="view" className="group block shrink-0 md:w-[44vw] lg:w-[38vw]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-line-strong bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-gimg src={p.screen} alt={`${p.name} interface`} loading="lazy" className="absolute inset-0 h-full w-[116%] max-w-none object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.04]" style={{ left: '-8%' }} />
              <span className="absolute left-4 top-4 rounded-full bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] px-3 py-1 font-mono text-[11px] backdrop-blur-md">{String(i + 1).padStart(2, '0')} / {String(moreBuilds.length).padStart(2, '0')}</span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-6">
              <div>
                <div className="eyebrow">{p.category} · {p.status}</div>
                <h3 className="mt-2 text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold tracking-[-0.035em]">{p.name}</h3>
                <p className="mt-1 text-[15px] text-ink-2">{p.tagline}</p>
              </div>
              <span className="mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-[-45deg] group-hover:bg-ink group-hover:text-bg"><ArrowRight /></span>
            </div>
          </Link>
        ))}
        <div className="hidden w-[8vw] shrink-0 md:block" />
      </div>
    </section>
  );
}

/* =====================================================================
   SERVICES — sticky cards that stack and recede as you scroll
   ===================================================================== */
export function Services() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-scard]');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.firstElementChild, {
          scale: 0.9 + i * 0.012,
          filter: 'brightness(0.55) blur(1px)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 14%', scrub: true },
        });
      });
    },
    { scope: root },
  );
  return (
    <section id="services" ref={root} data-scene="network" data-chapter="Capabilities" className="relative mx-auto max-w-[1320px] scroll-mt-10 px-5 pt-36 sm:px-8">
      <SectionHead eyebrow="Services" title={<>Six things we do <span className="serif">really</span> well.</>} sub="Design, engineering, AI and operations under one roof — the people who scope your project are the people who ship it." />
      <div className="mt-16 pb-[10vh]">
        {services.map((s, i) => {
          const V = VISUALS[s.id];
          return (
            <div key={s.id} data-scard className="sticky h-[78vh] min-h-[520px] pb-6" style={{ top: `calc(12vh + ${i * 18}px)` }}>
              <article className="grid h-full origin-top gap-8 overflow-hidden rounded-[28px] border border-line-strong bg-surface p-7 shadow-[var(--shadow)] will-change-transform sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:p-14">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] text-muted">({s.index})</span>
                    <span className="font-mono text-[12px] text-muted">{s.proof}</span>
                  </div>
                  <h3 className="mt-auto text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">{s.title}</h3>
                  <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ink-2">{s.line}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">{s.points.map((pt) => <li key={pt} className="pill">{pt}</li>)}</ul>
                </div>
                <div className="hidden rounded-2xl border border-line bg-bg p-6 sm:block">
                  <V />
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================================
   PROCESS — a line draws itself; steps light up as it passes
   ===================================================================== */
export function Process() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo('[data-pline]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-psteps]', start: 'top 60%', end: 'bottom 60%', scrub: true } });
      gsap.utils.toArray<HTMLElement>('[data-pstep]').forEach((el) => {
        gsap.fromTo(el.querySelector('[data-pdot]'), { scale: 0.4, backgroundColor: 'var(--surface-2)' }, { scale: 1, backgroundColor: 'var(--brand)', scrollTrigger: { trigger: el, start: 'top 60%', toggleActions: 'play none none reverse' }, duration: 0.4 });
        gsap.from(el.querySelectorAll('[data-pcontent]'), { autoAlpha: 0, x: (i) => (i === 0 ? -40 : 40), duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      });
    },
    { scope: root },
  );
  const models = [
    { t: 'Fixed-scope build', d: 'A defined MVP or feature set with milestone delivery and weekly demos.' },
    { t: 'Dedicated sprint team', d: 'Both engineers on your roadmap month to month — design, build, AI, deploys.' },
    { t: 'Care plan', d: 'Hosting, monitoring, fixes and small improvements for live products.' },
  ];
  return (
    <section id="process" ref={root} data-scene="network" data-chapter="Pipeline" className="relative mx-auto max-w-[1320px] scroll-mt-10 px-5 pt-36 sm:px-8">
      <SectionHead center eyebrow="Process" title={<>From first call to <span className="serif">production.</span></>} sub="A predictable path, with something you can click every single week." />
      <ol data-psteps className="relative mx-auto mt-20 max-w-[980px]">
        <div aria-hidden="true" className="absolute bottom-0 left-[15px] top-0 w-px bg-line md:left-1/2" />
        <div aria-hidden="true" data-pline className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-ink md:left-1/2" />
        {process.map((p, i) => (
          <li key={p.id} data-pstep className="relative grid grid-cols-[32px_1fr] gap-6 pb-16 md:grid-cols-[1fr_32px_1fr] md:gap-10">
            <div data-pcontent className={`hidden md:block ${i % 2 ? 'md:invisible' : 'text-right'}`}>
              <span className="font-mono text-[12px] text-muted">STEP {String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.04em]">{p.title}</h3>
              <p className="ml-auto mt-2 max-w-[36ch] text-[15.5px] leading-relaxed text-ink-2">{p.line}</p>
            </div>
            <span data-pdot className="relative z-10 mt-1 grid h-8 w-8 place-items-center rounded-full border border-line-strong font-mono text-[11px] text-[#0b0b0c]">{i + 1}</span>
            <div data-pcontent className={i % 2 ? '' : 'md:invisible'}>
              <span className="font-mono text-[12px] text-muted">STEP {String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.04em]">{p.title}</h3>
              <p className="mt-2 max-w-[36ch] text-[15.5px] leading-relaxed text-ink-2">{p.line}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {models.map((x, i) => (
          <div key={x.t} data-reveal data-delay={i * 0.08} className="rounded-[22px] border border-dashed border-line-strong p-7">
            <div className="eyebrow">Engagement {String(i + 1).padStart(2, '0')}</div>
            <h3 className="mt-3 text-[1.25rem] font-semibold tracking-[-0.02em]">{x.t}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   TEAM — portraits wipe open, cards tilt toward the cursor
   ===================================================================== */
function Profile({ mem, i }: { mem: Member; i: number }) {
  const card = useRef<HTMLElement>(null);
  return (
    <article
      ref={card}
      data-reveal
      data-delay={i * 0.1}
      className="group relative overflow-hidden rounded-[28px] border border-line-strong bg-surface transition-transform duration-500 ease-out [transform-style:preserve-3d]"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !card.current) return;
        const r = card.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.current.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }}
      onPointerLeave={() => { if (card.current) card.current.style.transform = ''; }}
    >
      <div data-clip className="relative aspect-[5/4] overflow-hidden border-b border-line">
        {mem.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mem.photo} alt={mem.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--brand)_40%,transparent),transparent_55%),radial-gradient(circle_at_80%_85%,color-mix(in_oklab,var(--violet)_45%,transparent),transparent_55%)]">
            <span className="text-[clamp(5rem,12vw,9rem)] font-semibold tracking-[-0.07em] text-ink/90 transition-transform duration-700 group-hover:scale-110">{mem.initials}</span>
          </div>
        )}
        <span className="absolute left-5 top-5 rounded-full bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] px-3 py-1 font-mono text-[11px] backdrop-blur-md">0{i + 1} — {mem.location}</span>
      </div>
      <div className="p-7 sm:p-9">
        <h3 className="text-[clamp(1.8rem,3vw,2.5rem)] font-semibold tracking-[-0.04em]">{mem.name}</h3>
        <p className="mt-1 text-[16px] text-ink-2">{mem.role} · <span className="text-muted">{mem.education}</span></p>
        <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{mem.focus}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">{mem.skills.map((s) => <li key={s} className="pill">{s}</li>)}</ul>
        <ul className="mt-6 grid gap-2">
          {mem.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[14.5px] leading-snug text-ink-2">
              <svg className="mt-[3px] shrink-0 text-brand-ink" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>{h}
            </li>
          ))}
        </ul>
        <div className="mt-7 grid gap-0">
          {[
            ['Phone', mem.phone, tel(mem.phone), false],
            ['Email', mem.email, `mailto:${mem.email}`, false],
            ['GitHub', mem.github.replace('https://', ''), mem.github, true],
            ...(mem.linkedin ? [['LinkedIn', 'Profile', mem.linkedin, true] as const] : []),
          ].map(([label, value, href, ext]) => (
            <a key={label as string} href={href as string} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group/row flex items-center justify-between gap-4 border-t border-line py-3.5 text-[14.5px]" data-cursor="hover">
              <span className="eyebrow">{label as string}</span>
              <span className="flex min-w-0 items-center gap-2 truncate text-ink-2 group-hover/row:text-ink"><span className="truncate">{value as string}</span><ArrowUpRight s={12} /></span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Team() {
  return (
    <section id="team" data-scene="aurora" data-chapter="Makers" className="mx-auto max-w-[1320px] scroll-mt-10 px-5 pt-40 sm:px-8">
      <SectionHead eyebrow="Team" title={<>Talk directly to the <span className="serif">engineers.</span></>} sub="No account managers in between. The two people who scope your project build, deploy and support it." />
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {team.map((mem, i) => <Profile key={mem.id} mem={mem} i={i} />)}
      </div>
    </section>
  );
}

/* =====================================================================
   CONTACT — giant headline scales in; form + direct lines
   ===================================================================== */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', service: services[0].title, message: '' });
  const [sent, setSent] = useState(false);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo('[data-big]', { scale: 0.55, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '[data-big]', start: 'top bottom', end: 'center 55%', scrub: true } });
    },
    { scope: root },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Project enquiry — ${form.service} — ${form.name}`;
    const body = `Hi TasklyTech,\n\n${form.message}\n\nService: ${form.service}\nName: ${form.name}\nReply to: ${form.email}`;
    window.location.href = `mailto:${company.emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hi TasklyTech, I have a project in mind:')}`;
  const input = 'h-12 w-full border-b border-line-strong bg-transparent text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink';

  return (
    <section id="contact" ref={root} data-scene="aurora" data-chapter="Launch" className="mx-auto max-w-[1320px] scroll-mt-10 overflow-hidden px-5 pb-32 pt-40 sm:px-8">
      <div className="eyebrow mb-6 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Contact</div>
      <h2 data-big className="h-display origin-left text-[clamp(3.4rem,13vw,12.5rem)] leading-[0.85]">
        Let’s <span className="serif">ship</span><br />your task.
      </h2>
      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p data-reveal className="max-w-[40ch] text-[17px] leading-relaxed text-ink-2">Tell us what you’re building. We’ll come back with questions, a rough approach and clear next steps.</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Magnetic><a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-brand h-12 px-6" data-cursor="hover">WhatsApp us <ArrowUpRight /></a></Magnetic>
            <Magnetic><a href={`mailto:${company.emails.join(',')}`} className="btn btn-ghost h-12 px-6" data-cursor="hover">Email</a></Magnetic>
            <Magnetic><a href={tel(team[0].phone)} className="btn btn-ghost h-12 px-6" data-cursor="hover">Call</a></Magnetic>
          </div>
          <dl className="mt-12 grid gap-6 sm:grid-cols-2">
            {team.map((mem) => (
              <div key={mem.id} data-reveal className="text-[15px]">
                <dt className="font-medium">{mem.name}</dt>
                <dd className="mt-1.5 grid gap-1 text-ink-2">
                  <a href={tel(mem.phone)} className="w-fit hover:text-ink">{mem.phone}</a>
                  <a href={`mailto:${mem.email}`} className="w-fit break-all hover:text-ink">{mem.email}</a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <form data-reveal onSubmit={submit} className="grid gap-7" aria-label="Project enquiry">
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="grid gap-1 text-[13px] text-muted">Your name<input required className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" placeholder="Jane Doe" /></label>
            <label className="grid gap-1 text-[13px] text-muted">Email<input required type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" placeholder="jane@company.com" /></label>
          </div>
          <fieldset>
            <legend className="mb-3 text-[13px] text-muted">I need help with</legend>
            <div className="flex flex-wrap gap-2">
              {[...services.map((s) => s.title), 'Something else'].map((t) => (
                <label key={t} className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] transition-colors ${form.service === t ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink-2 hover:border-ink-2'}`} data-cursor="hover">
                  <input type="radio" name="service" value={t} checked={form.service === t} onChange={() => setForm({ ...form, service: t })} className="sr-only" />{t}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="grid gap-1 text-[13px] text-muted">Project details<textarea required rows={3} className={`${input} h-auto resize-none py-3`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What should we build? Timeline, links, anything useful." /></label>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[12.5px] text-muted">Opens your email app with the details filled in — nothing is stored on this site.</p>
            <button type="submit" className="btn btn-primary h-14 px-8 text-[16px]" data-cursor="hover">{sent ? 'Opening your email…' : <>Send enquiry <ArrowRight /></>}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* =====================================================================
   FOOTER — revealed from underneath the page (curtain)
   ===================================================================== */
export function Footer({ curtain = false }: { curtain?: boolean }) {
  return (
    <footer className={curtain ? 'sticky bottom-0 z-0' : 'relative'}>
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-6 pt-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5"><LogoMark /><span className="text-[15.5px] font-semibold tracking-[-0.02em]">TasklyTech Solutions</span></div>
          <p className="mt-4 max-w-[36ch] text-[14.5px] leading-relaxed text-ink-2">AI &amp; product engineering studio based in {company.city}.</p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2 text-[14.5px]">
          <span className="eyebrow mb-1">Explore</span>
          {[['Work', '/#work'], ['Services', '/#services'], ['Process', '/#process'], ['Team', '/#team'], ['Contact', '/#contact']].map(([l, h]) => <a key={h} href={h} className="w-fit text-ink-2 hover:text-ink">{l}</a>)}
        </nav>
        <div className="grid content-start gap-2 text-[14.5px]">
          <span className="eyebrow mb-1">Contact</span>
          {team.map((mem) => (
            <div key={mem.id} className="mb-2 grid gap-0.5">
              <span className="font-medium">{mem.name}</span>
              <a href={tel(mem.phone)} className="w-fit text-ink-2 hover:text-ink">{mem.phone}</a>
              <a href={`mailto:${mem.email}`} className="w-fit break-all text-ink-2 hover:text-ink">{mem.email}</a>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden px-3" aria-hidden="true">
        <div className="whitespace-nowrap text-center text-[17.5vw] font-semibold leading-[0.78] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)]">TasklyTech</div>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-2 border-t border-line px-5 py-5 text-[13px] text-muted sm:px-8">
        <span>© {new Date().getFullYear()} TasklyTech Solutions</span>
        <span>Designed &amp; engineered in-house</span>
      </div>
    </footer>
  );
}
