import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/data/projects';
import SmoothScroll from '@/components/SmoothScroll';
import { AppFrame, ArrowRight, ArrowUpRight, Nav } from '@/components/kit';
import Animations from '@/components/Animations';
import { Cursor } from '@/components/Chrome';
import { Footer } from '@/components/home/Chapters';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.name} — case study`, description: p.summary };
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="grid gap-6 border-t border-line py-14 md:grid-cols-[240px_1fr] md:gap-12">
        <div>
          <div className="font-mono text-[12px] text-muted">{n}</div>
          <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.03em]">{title}</h2>
        </div>
        <div>{children}</div>
      </section>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  let n = 0;
  const num = () => String(++n).padStart(2, '0');

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-60"
          style={{ background: `radial-gradient(60% 50% at 70% 10%, color-mix(in oklab, ${p.accent} 30%, transparent), transparent 70%)` }}
        />
        <div className="mx-auto max-w-[1240px] px-5 pt-28 sm:px-8">
          <Link href="/#work" className="inline-flex items-center gap-2 text-[14px] text-ink-2 hover:text-ink">← All work</Link>

          <header className="mt-10 max-w-[900px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{p.category}</span>
              <span className="pill">{p.status}</span>
              <span className="pill">{p.year}</span>
            </div>
            <h1 data-split className="h-display mt-5 text-[clamp(2.6rem,6.4vw,5.4rem)]">{p.name}</h1>
            <p className="mt-5 max-w-[48ch] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-relaxed text-ink-2">{p.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-brand">Visit live site <ArrowUpRight /></a>}
              {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Source on GitHub <ArrowUpRight /></a>}
            </div>
            {p.liveNote && <p className="mt-3 text-[13px] text-muted">{p.liveNote}</p>}
          </header>

          <div data-clip className="mt-16">
            <AppFrame src={p.screen} srcLight={p.screenLight} alt={`${p.name} screen`} url={p.live} priority />
          </div>

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            <div><dt className="eyebrow">Overview</dt><dd className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.summary}</dd></div>
            <div><dt className="eyebrow">Stack</dt><dd className="mt-2 flex flex-wrap gap-1.5">{p.stack.map((t) => <span key={t} className="pill">{t}</span>)}</dd></div>
            <div><dt className="eyebrow">Delivered by</dt><dd className="mt-2 text-[15px] text-ink-2">TasklyTech Solutions — design, engineering{p.ai.length ? ', AI' : ''} and deployment.</dd></div>
          </dl>

          <div className="mt-16">
            <Block n={num()} title="The problem">
              <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{p.problem}</p>
            </Block>
            <Block n={num()} title="What we built">
              <ul className="grid gap-3 sm:grid-cols-2">
                {p.built.map((b) => (
                  <li key={b} className="card flex gap-3 p-5 text-[15px] leading-relaxed">
                    <svg className="mt-1 shrink-0 text-brand-ink" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    {b}
                  </li>
                ))}
              </ul>
            </Block>
            {p.ai.length > 0 && (
              <Block n={num()} title="AI inside">
                <ol className="grid gap-3">
                  {p.ai.map((a, k) => (
                    <li key={a} className="flex gap-4 border-b border-line pb-3 text-[15.5px] leading-relaxed">
                      <span className="font-mono text-[12px] text-muted">{String(k + 1).padStart(2, '0')}</span>{a}
                    </li>
                  ))}
                </ol>
              </Block>
            )}
            <Block n={num()} title="How it flows">
              <ol className="flex flex-wrap items-center gap-2" aria-label="System flow">
                {p.flow.map((f, k) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 font-mono text-[13px]">{f}</span>
                    {k < p.flow.length - 1 && <span className="text-muted" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
            </Block>
            {p.gallery.length > 0 && (
              <Block n={num()} title="More screens">
                <div className="grid gap-5 sm:grid-cols-2">
                  {p.gallery.map((g) => (
                    <figure key={g.src} className="overflow-hidden rounded-2xl border border-line bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt={g.alt} loading="lazy" className="w-full" />
                      <figcaption className="border-t border-line px-4 py-3 text-[13px] text-muted">{g.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              </Block>
            )}
          </div>

          <Link href={`/work/${next.slug}/`} className="group mt-10 block border-t border-line py-14">
            <span className="eyebrow">Next project</span>
            <span className="h-display mt-3 flex items-center gap-4 text-[clamp(2rem,5vw,4rem)] transition-colors group-hover:text-ink-2">
              {next.name}
              <span className="transition-transform duration-300 group-hover:translate-x-2"><ArrowRight s={36} /></span>
            </span>
          </Link>
        </div>
      </main>
      <Footer />
      <Animations />
    </>
  );
}
