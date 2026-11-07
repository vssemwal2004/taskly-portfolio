'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { story } from '@/lib/story';
import { createBootTexture } from './bootScreen';

const W = 3.1; // width
const D = 2.12; // depth
const T = 0.1; // base thickness
const LT = 0.055; // lid thickness
const SH = W * 0.64; // lid height

/** Diagonal glass glare for the display — a canvas gradient, no download. */
function createGlare() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 160;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 256, 160);
  grd.addColorStop(0, 'rgba(255,255,255,0.10)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.03)');
  grd.addColorStop(0.36, 'rgba(255,255,255,0)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 160);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Keyboard() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cols = 14;
  const rows = 5;
  useEffect(() => {
    const im = ref.current!;
    const d = new THREE.Object3D();
    let k = 0;
    const kw = 0.168;
    const gap = 0.024;
    const totalW = cols * kw + (cols - 1) * gap;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        d.position.set(-totalW / 2 + kw / 2 + c * (kw + gap), 0, -0.62 + r * (0.15 + gap));
        d.scale.set(1, 1, 1);
        if (r === rows - 1 && c >= 4 && c <= 9) {
          // spacebar: stretch the middle key, hide the rest
          if (c === 4) { d.position.x += (kw + gap) * 2.5; d.scale.set(6 + 5 * (gap / kw), 1, 1); }
          else d.scale.set(0.0001, 0.0001, 0.0001);
        }
        d.updateMatrix();
        im.setMatrixAt(k++, d.matrix);
      }
    }
    im.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cols * rows]} position={[0, T / 2 + 0.012, -0.02]}>
      <boxGeometry args={[0.168, 0.018, 0.15]} />
      <meshStandardMaterial color="#141518" roughness={0.55} metalness={0.1} />
    </instancedMesh>
  );
}

export default function Laptop({ screens, finish }: { screens: string[]; finish: 'space' | 'silver' }) {
  const loaded = useTexture(screens) as THREE.Texture[];
  const textures = useMemo(() => {
    const boot = createBootTexture();
    loaded.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
    return [boot, ...loaded];
  }, [loaded]);
  const glare = useMemo(createGlare, []);

  const lid = useRef<THREE.Group>(null);
  const logo = useRef<THREE.MeshStandardMaterial>(null);
  const base = useRef<THREE.MeshBasicMaterial>(null); // incoming screen (to)
  const over = useRef<THREE.MeshBasicMaterial>(null); // outgoing screen (from), fades away
  const sweep = useRef<THREE.Mesh>(null);
  const sweepMat = useRef<THREE.MeshBasicMaterial>(null);
  const accent = useMemo(() => new THREE.Color(), []);
  const SW = W - 0.2;

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 7);
    if (lid.current) {
      // closed = lid folded flat over the keyboard; open = tilted back ~105°
      const target = THREE.MathUtils.lerp(Math.PI / 2 - 0.018, -0.3, story.open);
      lid.current.rotation.x += (target - lid.current.rotation.x) * k;
    }
    const p = THREE.MathUtils.clamp(story.power, 0, 1);
    const m = THREE.MathUtils.clamp(story.mix, 0, 1);
    // the sweep reveals the new screen from left to right
    const reveal = THREE.MathUtils.smoothstep(m, 0.05, 0.95);
    if (base.current) {
      const t = textures[story.to] ?? textures[0];
      if (base.current.map !== t) { base.current.map = t; base.current.needsUpdate = true; }
      base.current.color.setScalar(p);
    }
    if (over.current) {
      const t = textures[story.from] ?? textures[0];
      if (over.current.map !== t) { over.current.map = t; over.current.needsUpdate = true; }
      over.current.color.setScalar(p);
      over.current.opacity = 1 - reveal;
      over.current.visible = reveal < 0.999 && story.from !== story.to;
    }
    if (sweep.current && sweepMat.current) {
      sweep.current.position.x = -SW / 2 + SW * reveal;
      sweepMat.current.opacity = Math.sin(Math.PI * reveal) * p * 0.9;
      sweep.current.visible = reveal > 0.001 && reveal < 0.999;
      accent.set(story.accent);
      sweepMat.current.color.lerp(accent, 0.2);
    }
    if (logo.current) logo.current.emissiveIntensity = 0.4 + (1 - story.open) * 1.2;
  });

  const metal = finish === 'space' ? '#5d6067' : '#c4c7cd';

  return (
    <group>
      {/* ---------- base ---------- */}
      <RoundedBox args={[W, T, D]} radius={0.045} smoothness={6} castShadow>
        <meshPhysicalMaterial color={metal} metalness={1} roughness={0.34} clearcoat={0.35} clearcoatRoughness={0.4} envMapIntensity={1.25} />
      </RoundedBox>
      {/* keyboard well */}
      <mesh position={[0, T / 2 + 0.001, -0.18]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[W * 0.88, 1.08]} />
        <meshStandardMaterial color="#0c0d0f" roughness={0.9} />
      </mesh>
      <Keyboard />
      {/* trackpad */}
      <RoundedBox args={[1.15, 0.004, 0.7]} radius={0.002} smoothness={2} position={[0, T / 2 + 0.002, 0.62]}>
        <meshPhysicalMaterial color={metal} metalness={0.9} roughness={0.22} clearcoat={1} envMapIntensity={1.4} />
      </RoundedBox>
      {/* front notch */}
      <mesh position={[0, 0.02, D / 2 + 0.001]}>
        <planeGeometry args={[0.42, 0.03]} />
        <meshStandardMaterial color="#2a2c30" roughness={0.6} />
      </mesh>
      {/* hinge */}
      <mesh position={[0, T / 2 + 0.02, -D / 2 + 0.05]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.035, 0.035, W * 0.84, 24]} />
        <meshStandardMaterial color="#1b1c20" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* ---------- lid (pivots at hinge) ---------- */}
      <group ref={lid} position={[0, T / 2 + 0.02, -D / 2 + 0.05]} rotation-x={Math.PI / 2 - 0.018}>
        <group position={[0, SH / 2, 0]}>
          {/* aluminium back */}
          <RoundedBox args={[W, SH, LT]} radius={0.04} smoothness={6} position={[0, 0, -LT / 2]} castShadow>
            <meshPhysicalMaterial color={metal} metalness={1} roughness={0.3} clearcoat={0.4} clearcoatRoughness={0.35} envMapIntensity={1.25} />
          </RoundedBox>
          {/* back logo */}
          <group position={[0, 0.05, -LT - 0.0015]} rotation-y={Math.PI}>
            <mesh>
              <planeGeometry args={[0.32, 0.08]} />
              <meshStandardMaterial ref={logo} color="#C6FF3D" emissive="#C6FF3D" emissiveIntensity={1} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, -0.09, 0]}>
              <planeGeometry args={[0.08, 0.22]} />
              <meshStandardMaterial color="#C6FF3D" emissive="#C6FF3D" emissiveIntensity={1} transparent opacity={0.9} />
            </mesh>
          </group>
          {/* black glass bezel */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[W - 0.04, SH - 0.04]} />
            <meshPhysicalMaterial color="#050506" roughness={0.08} metalness={0} clearcoat={1} envMapIntensity={0.8} />
          </mesh>
          {/* camera dot */}
          <mesh position={[0, SH / 2 - 0.05, 0.002]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#1d2633" />
          </mesh>
          {/* display: incoming screen, outgoing screen on top fading out, light sweep, glass glare */}
          <mesh position={[0, -0.02, 0.003]}>
            <planeGeometry args={[SW, SW * 0.625]} />
            <meshBasicMaterial ref={base} map={textures[0]} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.02, 0.0035]}>
            <planeGeometry args={[SW, SW * 0.625]} />
            <meshBasicMaterial ref={over} map={textures[0]} toneMapped={false} transparent />
          </mesh>
          <mesh ref={sweep} position={[0, -0.02, 0.004]}>
            <planeGeometry args={[0.05, SW * 0.625]} />
            <meshBasicMaterial ref={sweepMat} color="#C6FF3D" toneMapped={false} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.02, 0.0045]}>
            <planeGeometry args={[SW, SW * 0.625]} />
            <meshBasicMaterial map={glare} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
