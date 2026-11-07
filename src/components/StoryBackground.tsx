'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { story } from '@/lib/story';

/**
 * The page's living backdrop — one WebGL2 fragment shader with four "worlds"
 * that crossfade as the story moves:
 *   0 grid     — a glowing perspective grid to the horizon (Idea / Build)
 *   1 stream   — falling data streams (Systems)
 *   2 network  — circuit traces with travelling pulses (Capabilities / Pipeline)
 *   3 aurora   — an aurora sunrise with rising sparks (Makers / Launch)
 * Sections opt in with data-scene="grid|stream|network|aurora" and data-chapter="Title".
 */
const SCENES = ['grid', 'stream', 'network', 'aurora'] as const;
const ACCENTS: Record<string, string> = { grid: '#C6FF3D', stream: '#8B74FF', network: '#C6FF3D', aurora: '#7EE0B5' };

const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uScroll; uniform float uDark;
uniform vec4 uW; uniform vec3 uAccent; uniform vec2 uMouse;
out vec4 o;

float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h1(i), h1(i+vec2(1,0)), f.x), mix(h1(i+vec2(0,1)), h1(i+vec2(1,1)), f.x), f.y); }

// Premium studio backdrop: graphite, overhead spotlight, glossy floor horizon,
// faint dot matrix and a soft accent aura whose position glides per chapter.
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 q = (uv - 0.5) * vec2(asp, 1.0);

  // aura anchor per chapter (grid=centre-high, stream=left, network=right, aurora=low)
  vec2 a0 = vec2(0.18, 0.12), a1 = vec2(-0.55, 0.05), a2 = vec2(0.6, -0.05), a3 = vec2(0.0, -0.45);
  vec2 anchor = (a0 * uW.x + a1 * uW.y + a2 * uW.z + a3 * uW.w) / max(0.001, uW.x + uW.y + uW.z + uW.w);
  anchor += vec2(sin(uTime * 0.11), cos(uTime * 0.09)) * 0.04 + uMouse * 0.04;
  float warp = n2(q * 1.4 + uTime * 0.05) * 0.18;
  float aura = exp(-pow(length(q - anchor) + warp, 2.0) * 3.2);

  // overhead spotlight cone + floor horizon (studio)
  float spot = exp(-pow(q.x * 1.1, 2.0) * 3.0) * smoothstep(-0.2, 0.55, q.y) * 0.5;
  float hz = -0.18;
  float floorLine = exp(-abs(q.y - hz) * 60.0) * exp(-q.x * q.x * 1.6);
  float floorGlow = smoothstep(hz, hz - 0.5, q.y) * exp(-q.x * q.x * 0.9) * 0.35 * uW.x;

  // faint dot matrix, parallax with scroll
  vec2 g = (gl_FragCoord.xy + vec2(0.0, uScroll * 60.0)) / 22.0;
  float dots = smoothstep(0.16, 0.0, length(fract(g) - 0.5)) * 0.5;
  float dotMask = smoothstep(1.2, 0.2, length(q));

  vec3 darkBase = mix(vec3(0.028, 0.029, 0.034), vec3(0.05, 0.052, 0.06), uv.y);
  vec3 dark = darkBase;
  dark += vec3(0.85, 0.88, 1.0) * spot * 0.06;
  dark += uAccent * aura * 0.16;
  dark += vec3(0.7, 0.75, 0.85) * floorLine * 0.10 * uW.x;
  dark += uAccent * floorGlow * 0.08;
  dark += vec3(1.0) * dots * dotMask * 0.022;

  vec3 lightBase = mix(vec3(0.945, 0.942, 0.925), vec3(0.98, 0.977, 0.965), uv.y);
  vec3 light = lightBase;
  light = mix(light, mix(lightBase, uAccent, 0.5), aura * 0.22);
  light -= vec3(0.06) * floorLine * uW.x;
  light -= vec3(1.0) * dots * dotMask * 0.025;

  vec3 col = mix(light, dark, uDark);
  float vig = smoothstep(1.3, 0.3, length(q * vec2(0.8, 1.0)));
  col *= mix(mix(0.96, 1.0, vig), mix(0.7, 1.0, vig), uDark);
  col += (h1(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.018;
  o = vec4(col, 1.0);
}`;

function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function StoryBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const dark = useRef(1);
  dark.current = resolvedTheme === 'light' ? 0 : 1;
  const [chapter, setChapter] = useState({ i: 1, title: 'Idea', total: 7 });

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { canvas.style.display = 'none'; return; }
    const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(x)); return x; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['uRes', 'uTime', 'uScroll', 'uDark', 'uW', 'uAccent', 'uMouse'].map((n) => [n, gl.getUniformLocation(prog, n)]));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SCALE = window.innerWidth < 820 ? 0.5 : 0.62;
    const w = [1, 0, 0, 0];
    const target = [1, 0, 0, 0];
    const acc = hex('#C6FF3D');
    const mouse = [0, 0];
    const mix = { d: dark.current };
    let lastTitle = '';
    let raf = 0;
    let last = performance.now();

    const sections = () => Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    const pick = () => {
      const list = sections();
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      list.forEach((el, i) => { if (el.getBoundingClientRect().top <= mid) idx = i; });
      const el = list[idx];
      if (!el) return { scene: 'grid', accent: ACCENTS.grid };
      const scene = el.dataset.scene || 'grid';
      const title = el.dataset.chapter || '';
      if (title && title !== lastTitle) {
        lastTitle = title;
        setChapter({ i: idx + 1, title, total: list.length });
      }
      const accent = scene === 'grid' && el.id === 'work' ? story.accent : ACCENTS[scene];
      return { scene, accent };
    };

    const onMove = (e: PointerEvent) => { mouse[0] = e.clientX / window.innerWidth - 0.5; mouse[1] = 0.5 - e.clientY / window.innerHeight; };
    window.addEventListener('pointermove', onMove, { passive: true });

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cw = Math.floor(canvas.clientWidth * SCALE), ch = Math.floor(canvas.clientHeight * SCALE);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; gl.viewport(0, 0, cw, ch); }

      const { scene, accent } = pick();
      const si = SCENES.indexOf(scene as (typeof SCENES)[number]);
      for (let i = 0; i < 4; i++) target[i] = i === si ? 1 : 0;
      const k = 1 - Math.exp(-dt * 2.2);
      for (let i = 0; i < 4; i++) w[i] += (target[i] - w[i]) * k;
      const a = hex(accent);
      for (let i = 0; i < 3; i++) acc[i] += (a[i] - acc[i]) * k;
      mix.d += (dark.current - mix.d) * (1 - Math.exp(-dt * 5));

      gl.uniform2f(U.uRes, cw, ch);
      gl.uniform1f(U.uTime, reduce ? 12 : now / 1000);
      gl.uniform1f(U.uScroll, window.scrollY / 1000);
      gl.uniform1f(U.uDark, mix.d);
      gl.uniform4f(U.uW, w[0], w[1], w[2], w[3]);
      gl.uniform3f(U.uAccent, acc[0], acc[1], acc[2]);
      gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); window.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
      {/* story HUD */}
      <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 [writing-mode:vertical-rl] xl:flex" aria-hidden="true">
        <span className="tabular-nums text-ink">{String(chapter.i).padStart(2, '0')}</span>
        <span className="relative h-16 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 bg-brand transition-[height] duration-700" style={{ height: `${(chapter.i / chapter.total) * 100}%` }} />
        </span>
        <span key={chapter.title} className="animate-[hud-in_.6s_ease-out]">{chapter.title}</span>
      </div>
    </>
  );
}
