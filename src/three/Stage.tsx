'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { story } from '@/lib/story';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

function webgl() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

/** Loads the 3D scene as a separate chunk; falls back silently without WebGL. */
export default function Stage() {
  const [on, setOn] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 820px)').matches);
    if (webgl()) setOn(true);
    else { story.ready = true; window.dispatchEvent(new Event('stage-ready')); document.documentElement.classList.add('no-webgl'); }
  }, []);
  return on ? <Scene mobile={mobile} /> : null;
}
