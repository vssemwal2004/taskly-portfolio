import * as THREE from 'three';

/** The TasklyTech "boot" screen shown when the lid first opens — drawn on a canvas, no download. */
export function createBootTexture() {
  const W = 1600;
  const H = 1000;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;

  const bg = g.createRadialGradient(W * 0.5, H * 0.42, 40, W * 0.5, H * 0.5, W * 0.75);
  bg.addColorStop(0, '#16181d');
  bg.addColorStop(1, '#050506');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // faint grid
  g.strokeStyle = 'rgba(255,255,255,0.035)';
  g.lineWidth = 1;
  for (let x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }

  // logo mark
  const cx = W / 2;
  const cy = H * 0.4;
  const s = 5.2;
  g.save();
  g.translate(cx - 16 * s, cy - 16 * s);
  g.scale(s, s);
  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
  };
  g.fillStyle = '#f2f2f4';
  rr(0, 0, 32, 32, 9);
  g.fillStyle = '#0b0b0c';
  rr(7, 7.5, 18, 5, 2.5);
  rr(13.5, 7.5, 5, 17, 2.5);
  g.strokeStyle = '#C6FF3D';
  g.lineWidth = 2.6;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(10.5, 19.5);
  g.lineTo(14.1, 23.1);
  g.lineTo(21.7, 15);
  g.stroke();
  g.restore();

  g.textAlign = 'center';
  g.fillStyle = '#f2f2f4';
  g.font = '600 64px system-ui, -apple-system, Segoe UI, sans-serif';
  g.fillText('TasklyTech', cx, H * 0.64);
  g.fillStyle = 'rgba(242,242,244,0.5)';
  g.font = '400 28px ui-monospace, Consolas, monospace';
  g.fillText('booting your next product…', cx, H * 0.7);

  // progress bar
  const bw = 420;
  g.fillStyle = 'rgba(255,255,255,0.1)';
  g.beginPath(); g.roundRect(cx - bw / 2, H * 0.76, bw, 6, 3); g.fill();
  g.fillStyle = '#C6FF3D';
  g.beginPath(); g.roundRect(cx - bw / 2, H * 0.76, bw * 0.72, 6, 3); g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
