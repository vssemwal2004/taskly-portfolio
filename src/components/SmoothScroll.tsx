'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReduced } from '@/lib/gsap';

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays perfectly in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href')!;
      if (href.startsWith('/#') && window.location.pathname !== '/') return;
      const target = document.querySelector(href.replace(/^\//, '')) as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6 });
    };
    document.addEventListener('click', onClick);
    return () => {
      gsap.ticker.remove(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function scrollToY(y: number) {
  const l = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (l) l.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}
