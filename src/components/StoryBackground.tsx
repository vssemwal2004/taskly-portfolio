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
vec2 h2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h1(i), h1(i+vec2(1,0)), f.x), mix(h1(i+vec2(0,1)), h1(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n2(p); p *= 2.03; a *= 0.5; } return v; }

// ---------- world 0: perspective grid + starfield ----------
vec3 gridWorld(vec2 uv, float asp){
  vec3 c = vec3(0.0);
  float hz = 0.38 + uMouse.y * 0.015;
  // stars above the horizon
  vec2 sp = uv * vec2(asp, 1.0) * 70.0;
  vec2 si = floor(sp);
  float s = h1(si);
  float star = step(0.985, s) * smoothstep(0.5, 0.0, length(fract(sp) - 0.5)) * (0.5 + 0.5 * sin(uTime * 2.0 + s * 50.0));
  c += vec3(star) * smoothstep(hz, hz + 0.25, uv.y) * 0.8;
  // horizon glow
  c += uAccent * exp(-abs(uv.y - hz) * 26.0) * 0.55;
  c += uAccent * exp(-abs(uv.y - hz) * 5.0) * 0.08;
  if (uv.y < hz) {
    float y = hz - uv.y;
    float z = 0.42 / y;
    vec2 g = vec2((uv.x - 0.5 - uMouse.x * 0.02) * asp * z * 1.6, z + uScroll * 1.6 + uTime * 0.35);
    vec2 gd = abs(fract(g - 0.5) - 0.5) / fwidth(g);
    float line = 1.0 - min(min(gd.x, gd.y), 1.0);
    float fade = smoothstep(0.0, 0.18, y);
    c += vec3(0.55, 0.6, 0.7) * line * fade * 0.35;
    // light pulses running along the depth lines
    float lane = floor(g.x);
    float pr = h1(vec2(lane, 3.0));
    float head = fract(g.y * 0.08 - uTime * (0.25 + pr * 0.4) - pr * 9.0);
    float onLine = 1.0 - min(gd.x, 1.0);
    c += uAccent * onLine * smoothstep(0.86, 1.0, head) * step(0.55, pr) * fade * 2.2;
  }
  return c;
}

// ---------- world 1: data streams ----------
vec3 streamWorld(vec2 uv, float asp){
  vec3 c = vec3(0.0);
  float cols = 70.0;
  float x = uv.x * cols * asp / 1.6;
  float col = floor(x);
  float r = h1(vec2(col, 1.0));
  float speed = 0.15 + r * 0.5;
  float y = uv.y * (1.4 + r) + uTime * speed + uScroll * (0.6 + r) + r * 10.0;
  float seg = fract(y);
  float trail = smoothstep(0.0, 0.85, seg) * step(seg, 0.97);
  float glyph = step(0.35, h1(vec2(col, floor(y * 22.0))));
  float lane = smoothstep(0.5, 0.15, abs(fract(x) - 0.5));
  float on = step(0.45, r);
  vec3 tint = mix(uAccent, vec3(0.55, 0.45, 1.0), h1(vec2(col, 7.0)));
  c += tint * trail * trail * glyph * lane * on * 0.55;
  c += vec3(1.0) * smoothstep(0.95, 0.99, seg) * lane * on * 0.6; // bright head
  return c * (0.35 + 0.65 * smoothstep(0.0, 0.6, uv.y));
}

// ---------- world 2: circuit network ----------
vec3 networkWorld(vec2 uv, float asp){
  vec2 p = uv * vec2(asp, 1.0) * 6.0 + vec2(0.0, uScroll * 0.8);
  vec2 ip = floor(p), fp = fract(p);
  float d1 = 9.0, d2 = 9.0; vec2 nearest = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 b = vec2(float(i), float(j));
    vec2 pt = b + 0.5 + 0.38 * sin(uTime * 0.25 + 6.2831 * h2(ip + b));
    float d = length(pt - fp);
    if (d < d1) { d2 = d1; d1 = d; nearest = ip + b; } else if (d < d2) d2 = d;
  }
  float edge = 1.0 - smoothstep(0.0, 0.035, d2 - d1);
  float node = smoothstep(0.07, 0.0, d1);
  float pulse = smoothstep(0.85, 1.0, fract(h1(nearest) * 7.0 - uTime * 0.35));
  vec3 c = vec3(0.45, 0.5, 0.62) * edge * 0.22;
  c += uAccent * edge * pulse * 0.9;
  c += uAccent * node * (0.6 + 0.4 * sin(uTime * 2.0 + h1(nearest) * 20.0));
  return c;
}

// ---------- world 3: aurora sunrise ----------
vec3 auroraWorld(vec2 uv, float asp){
  vec2 p = vec2(uv.x * asp * 1.4, uv.y);
  float a = fbm(vec2(p.x * 1.2 + uTime * 0.04, p.y * 2.2 - uTime * 0.03 - uScroll * 0.15));
  float band = smoothstep(0.42, 0.85, a) * smoothstep(0.0, 0.55, uv.y) * smoothstep(1.1, 0.45, uv.y);
  vec3 c1 = vec3(0.49, 0.88, 0.71), c2 = vec3(0.55, 0.45, 1.0), c3 = uAccent;
  vec3 c = mix(c1, c2, smoothstep(0.3, 0.8, n2(p * 1.5 + uTime * 0.05))) * band * 0.75;
  c = mix(c, c3 * band, 0.25);
  // sunrise glow at the bottom
  c += mix(c3, vec3(1.0, 0.65, 0.35), 0.35) * exp(-uv.y * 5.0) * 0.35;
  // rising sparks
  vec2 sp = vec2(uv.x * asp * 40.0, uv.y * 40.0 - uTime * 1.5 - uScroll * 4.0);
  vec2 si = floor(sp);
  float s = h1(si);
  c += vec3(1.0, 0.95, 0.8) * step(0.975, s) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5)) * (1.0 - uv.y) * 0.9;
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec3 g = vec3(0.0);
  if (uW.x > 0.002) g += gridWorld(uv, asp) * uW.x;
  if (uW.y > 0.002) g += streamWorld(uv, asp) * uW.y;
  if (uW.z > 0.002) g += networkWorld(uv, asp) * uW.z;
  if (uW.w > 0.002) g += auroraWorld(uv, asp) * uW.w;

  vec3 darkBase = mix(vec3(0.025, 0.027, 0.035), vec3(0.045, 0.048, 0.065), uv.y);
  vec3 lightBase = mix(vec3(0.95, 0.948, 0.93), vec3(0.975, 0.972, 0.96), uv.y);
  vec3 dark = darkBase + g;
  // light mode: the same worlds drawn as ink/tint on paper
  float lum = clamp(dot(g, vec3(0.33)), 0.0, 1.0);
  vec3 light = mix(lightBase, mix(vec3(0.12, 0.13, 0.17), uAccent * 0.55, 0.45), lum * 0.65);
  vec3 col = mix(light, dark, uDark);

  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(asp * 0.75, 1.0)));
  col *= mix(mix(0.93, 1.0, vig), mix(0.55, 1.0, vig), uDark);
  col += (h1(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.03;
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
      <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden items-center gap-4 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-2 lg:flex" aria-hidden="true">
        <span className="tabular-nums text-ink">{String(chapter.i).padStart(2, '0')}</span>
        <span className="relative h-px w-16 overflow-hidden bg-line-strong">
          <span className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-700" style={{ width: `${(chapter.i / chapter.total) * 100}%` }} />
        </span>
        <span key={chapter.title} className="animate-[hud-in_.6s_ease-out]">{chapter.title}</span>
      </div>
    </>
  );
}
