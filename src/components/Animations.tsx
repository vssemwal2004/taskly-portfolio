'use client';

import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReduced } from '@/lib/gsap';

/**
 * Declarative scroll animations, applied to any element on the page:
 *   data-split          → lines rise out of a mask
 *   data-reveal         → fade + rise
 *   data-parallax="0.2" → moves at a different speed while scrolling
 *   data-clip           → image wipes open from the bottom
 *   data-zoom           → scales from 0.85 to 1 while entering (scrubbed)
 */
export default function Animations() {
  useGSAP(() => {
    if (prefersReduced()) return;

    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines,words',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            rotate: 2,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 36,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        delay: Number(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax || 0.2);
      gsap.fromTo(el, { yPercent: -speed * 50 }, { yPercent: speed * 50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
      gsap.fromTo(el, { scale: 0.86, borderRadius: 48 }, { scale: 1, borderRadius: 24, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true } });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });
  return null;
}
