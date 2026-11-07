/**
 * The laptop's "script". GSAP ScrollTriggers tween these plain numbers;
 * the 3D scene reads them every frame (no React re-renders involved).
 */
export const story = {
  open: 0, // lid 0 = closed, 1 = open
  rotX: 0.32,
  rotY: -2.4,
  x: 0,
  y: -0.35,
  z: 0,
  scale: 0.82,
  /** screen transition: shows texture `from` blending to `to` by `mix` (0..1) */
  from: 0,
  to: 0,
  mix: 1,
  power: 0, // screen brightness 0..1
  accent: '#C6FF3D',
  visible: 1,
  mouseX: 0,
  mouseY: 0,
  ready: false,
};

/** Listeners so the scene can sleep when the laptop is off-stage. */
type Fn = (active: boolean) => void;
const listeners = new Set<Fn>();
export const stage = {
  active: true,
  set(active: boolean) {
    if (stage.active === active) return;
    stage.active = active;
    listeners.forEach((f) => f(active));
  },
  on(f: Fn) {
    listeners.add(f);
    return () => listeners.delete(f);
  },
};
