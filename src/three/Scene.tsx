'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { stage, story } from '@/lib/story';
import { featured } from '@/data/projects';
import Laptop from './Laptop';

const SCREENS = featured.map((p) => p.screen);

/** Damped follow of the story values + idle float + mouse parallax. */
function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const first = useRef(true);
  useFrame(({ clock }, dt) => {
    const o = g.current;
    if (!o) return;
    const t = clock.elapsedTime;
    const k = first.current ? 1 : 1 - Math.exp(-dt * 5);
    first.current = false;
    const px = story.x + story.mouseX * 0.06;
    const py = story.y + Math.sin(t * 0.9) * 0.035;
    o.position.x += (px - o.position.x) * k;
    o.position.y += (py - o.position.y) * k;
    o.position.z += (story.z - o.position.z) * k;
    o.rotation.x += (story.rotX - story.mouseY * 0.06 + Math.sin(t * 0.6) * 0.012 - o.rotation.x) * k;
    o.rotation.y += (story.rotY + story.mouseX * 0.12 - o.rotation.y) * k;
    const s = story.scale;
    o.scale.setScalar(o.scale.x + (s - o.scale.x) * k);
    o.visible = story.visible > 0.01;
  });
  return <group ref={g}>{children}</group>;
}

/** Coloured rim light that takes the active project's accent. */
function AccentLight() {
  const l = useRef<THREE.PointLight>(null);
  const c = useRef(new THREE.Color());
  useFrame((_, dt) => {
    if (!l.current) return;
    c.current.set(story.accent);
    l.current.color.lerp(c.current, 1 - Math.exp(-dt * 3));
    l.current.intensity = 12 + story.power * 18;
  });
  return <pointLight ref={l} position={[-3.5, 2.2, -2.5]} distance={14} decay={1.5} />;
}

function Ready() {
  const n = useRef(0);
  useFrame(() => {
    if (++n.current === 4) {
      story.ready = true;
      window.dispatchEvent(new Event('stage-ready'));
    }
  });
  return null;
}

export default function Scene({ mobile }: { mobile: boolean }) {
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === 'light';
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.75);
  const [active, setActive] = useState(stage.active);
  useEffect(() => stage.on(setActive) as unknown as () => void, []);
  useEffect(() => {
    const on = (e: PointerEvent) => {
      story.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      story.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      shadows={false}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: light ? 1.05 : 1 }}
      camera={{ fov: 26, position: [0, 1.1, 9.4], near: 0.1, far: 60 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.05, 0)}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={light ? 0.6 : 0.15} />
      <directionalLight position={[3, 6, 4]} intensity={light ? 2.2 : 1.4} color={light ? '#fff6ea' : '#e8ecff'} />
      <AccentLight />

      {/* studio softboxes — reflections on the aluminium come from these */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={light ? 3 : 2.4} position={[0, 5, -3]} rotation-x={Math.PI / 2.3} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={light ? 2.4 : 1.6} position={[-6, 1.5, 1]} rotation-y={Math.PI / 2} scale={[6, 2.2, 1]} />
        <Lightformer form="rect" intensity={light ? 2 : 1.2} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 1.6, 1]} />
        <Lightformer form="ring" intensity={1.4} position={[0, 1, 7]} scale={3} />
        <Lightformer form="rect" intensity={light ? 1.2 : 0.3} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color={light ? '#f5f1e8' : '#111216'} />
      </Environment>

      <Suspense fallback={null}>
        <Rig>
          <Laptop screens={SCREENS} finish={light ? 'silver' : 'space'} />
          {!mobile && (
            <ContactShadows position={[0, -0.06, 0]} scale={7} blur={2.6} far={2.2} opacity={light ? 0.55 : 0.85} resolution={512} color={light ? '#3b3226' : '#000000'} />
          )}
        </Rig>
        <Ready />
      </Suspense>
    </Canvas>
  );
}
