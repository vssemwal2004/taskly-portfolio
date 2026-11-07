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

const screenVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const screenFrag = /* glsl */ `
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform float uMix;
  uniform float uPower;
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    // diagonal wipe with a soft glowing edge
    float edge = uv.x * 0.78 + (1.0 - uv.y) * 0.22;
    float p = uMix * 1.25 - 0.12;
    float m = smoothstep(p - 0.06, p, edge);
    vec3 a = texture2D(tA, uv).rgb;
    vec3 b = texture2D(tB, uv).rgb;
    vec3 col = mix(b, a, m);
    float line = (1.0 - smoothstep(0.0, 0.012, abs(edge - p + 0.03))) * step(0.001, uMix) * step(uMix, 0.999);
    col += uAccent * line * 1.6;
    // subtle display texture: scanlines + vignette + glass sheen
    col *= 0.96 + 0.04 * sin(uv.y * 900.0);
    float vig = smoothstep(1.1, 0.35, length(uv - 0.5));
    col *= mix(0.82, 1.0, vig);
    float sheen = smoothstep(0.0, 1.0, 1.0 - (uv.x * 0.7 + uv.y * 0.6)) * 0.07;
    col += sheen;
    col *= uPower;
    col += (hash(uv * 800.0 + uTime) - 0.5) * 0.012 * uPower;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

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

  const lid = useRef<THREE.Group>(null);
  const logo = useRef<THREE.MeshStandardMaterial>(null);
  const uniforms = useMemo(
    () => ({
      tA: { value: textures[0] },
      tB: { value: textures[0] },
      uMix: { value: 1 },
      uPower: { value: 0 },
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color('#C6FF3D') },
    }),
    [textures],
  );
  const accent = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }, dt) => {
    const k = 1 - Math.exp(-dt * 7);
    if (lid.current) {
      // closed = lid folded flat over the keyboard; open = tilted back ~105°
      const target = THREE.MathUtils.lerp(Math.PI / 2 - 0.018, -0.3, story.open);
      lid.current.rotation.x += (target - lid.current.rotation.x) * k;
    }
    uniforms.tA.value = textures[story.from] ?? textures[0];
    uniforms.tB.value = textures[story.to] ?? textures[0];
    uniforms.uMix.value = story.mix;
    uniforms.uPower.value = story.power;
    uniforms.uTime.value = clock.elapsedTime;
    accent.set(story.accent);
    uniforms.uAccent.value.lerp(accent, k);
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
          {/* display */}
          <mesh position={[0, -0.02, 0.003]}>
            <planeGeometry args={[W - 0.2, (W - 0.2) * 0.625]} />
            <shaderMaterial vertexShader={screenVert} fragmentShader={screenFrag} uniforms={uniforms} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
