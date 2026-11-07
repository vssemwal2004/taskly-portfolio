// Copies real project screenshots from D:\CP into /public/projects as optimized WebP,
// and renders mock UI screens (SVG -> WebP) for internal systems without public screenshots.
// Usage: npm run assets   (re-run whenever source screenshots change)
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const SRC = process.env.CP_ROOT || 'D:/CP';
const OUT = path.resolve('public/projects');

/** [slug, sourcePathRelativeToCP, outName, maxWidth] */
const copies = [
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/dashboard-dark.webp', 'screen-dark', 1600],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/dashboard-light.webp', 'screen-light', 1600],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/anvi-dark.webp', 'anvi-dark', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/anvi-light.webp', 'anvi-light', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/interview-dark.webp', 'interview-dark', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/coding-dark.webp', 'coding-dark', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/analytics-dark.webp', 'analytics-dark', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/screens/assessment-light.webp', 'assessment-light', 1400],
  ['peerprep', 'peerprep/frontend/public/landing-page/assets/mark-dark.png', 'logo', 256],

  ['skillswaphub', 'skillswaphub/skillswaphubb/Skill-Swap/frontend/public/quizmnet_hero.png', 'screen-dark', 1600],
  ['skillswaphub', 'skillswaphub/skillswaphubb/Skill-Swap/frontend/public/campus-assesments.png', 'campus', 1400],

  ['gyaan-vidhya', 'NS-EDU/frontend/public/brand/gyaan-vidhya-logo.png', 'logo', 800],
  ['gyaan-vidhya', 'NS-EDU/frontend/public/brand/gyaan-vidhya-mark.png', 'mark', 256],

  ['nira', 'bodywash/preview/laptop-1-hero.png', 'screen-dark', 1600],
  ['nira', 'bodywash/preview/laptop-3-spin.png', 'spin', 1400],
  ['nira', 'bodywash/preview/laptop-4-scent-aloe.png', 'aloe', 1400],
  ['nira', 'bodywash/preview/laptop-5-scent-rose.png', 'rose', 1400],
  ['nira', 'bodywash/preview/mobile-1-hero.png', 'mobile', 700],

  // NOTE: never use AH Wheeler/quotation/* — it contains client pricing.
  ['ah-wheeler', 'AH Wheeler/public/images/hero-01.jpg', 'screen-dark', 1600],
  ['ah-wheeler', 'AH Wheeler/public/images/hero-01.jpg', 'hero', 1400],
  ['ah-wheeler', 'AH Wheeler/public/images/portal-01.jpg', 'portal', 1400],
  ['ah-wheeler', 'AH Wheeler/public/images/map-1893.jpg', 'map', 1400],

  ['evalora', 'evalora/evalora/client/public/assets/elvora-hero-sequence/frame-001.jpg', 'screen-dark', 1600, 'west'],
  ['evalora', 'evalora/evalora/client/public/login-img.webp', 'login', 1200],
  ['evalora', 'evalora/evalora/client/public/assets/elvora-ecosystem/elvora-intelligence-active.webp', 'intelligence', 1000],
  ['evalora', 'evalora/evalora/client/public/logo.webp', 'logo', 400],

  ['tatkal', 'Tatkal/client/public/login.webp', 'login', 1400],
  ['tatkal', 'Tatkal/client/public/frame.webp', 'frame', 1400],
  ['tatkal', 'Tatkal/client/public/logo.png', 'logo', 400],

  ['assetdesk', 'assetdesk/frontend/public/logo.webp', 'logo', 400],
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function convert(slug, rel, name, width, position = 'attention') {
  const src = path.join(SRC, rel);
  if (!(await exists(src))) { console.warn(`  skip (missing): ${rel}`); return; }
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, `${name}.webp`);
  // Device screens are exactly 16:10 so they map 1:1 onto the 3D laptop display.
  const resize = name === 'screen-dark'
    ? { width: 1600, height: 1000, fit: 'cover', position }
    : { width, withoutEnlargement: true };
  await sharp(src).resize(resize).webp({ quality: 78, effort: 5 }).toFile(dest);
  console.log(`  ok  ${slug}/${name}.webp`);
}

/** Mock app screen: sidebar + KPI tiles + chart + table, tinted by brand colour. No real data. */
function mockScreen({ title, accent, bg, panel, ink, muted, rows }) {
  const bars = Array.from({ length: 14 }, (_, i) => 40 + ((i * 37) % 120));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="${bg}"/>
  <rect x="0" y="0" width="260" height="1000" fill="${panel}"/>
  <rect x="32" y="36" width="36" height="36" rx="10" fill="${accent}"/>
  <text x="84" y="62" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${ink}">${title}</text>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="32" y="${130 + i * 58}" width="${i === 1 ? 196 : 150}" height="34" rx="9" fill="${i === 1 ? accent : muted}" opacity="${i === 1 ? 0.9 : 0.25}"/>`).join('')}
  <rect x="300" y="36" width="560" height="44" rx="12" fill="${panel}"/>
  <circle cx="1530" cy="58" r="22" fill="${accent}" opacity=".8"/>
  ${[0, 1, 2, 3].map((i) => `<g transform="translate(${300 + i * 322},120)"><rect width="298" height="150" rx="18" fill="${panel}"/><rect x="24" y="28" width="110" height="14" rx="7" fill="${muted}" opacity=".5"/><rect x="24" y="66" width="${120 + i * 22}" height="34" rx="8" fill="${ink}" opacity=".85"/><rect x="24" y="116" width="70" height="10" rx="5" fill="${accent}"/></g>`).join('')}
  <rect x="300" y="300" width="820" height="400" rx="18" fill="${panel}"/>
  ${bars.map((h, i) => `<rect x="${340 + i * 54}" y="${660 - h * 2}" width="30" height="${h * 2}" rx="6" fill="${accent}" opacity="${0.35 + (i % 4) * 0.18}"/>`).join('')}
  <rect x="1150" y="300" width="400" height="400" rx="18" fill="${panel}"/>
  <circle cx="1350" cy="500" r="120" fill="none" stroke="${muted}" stroke-opacity=".25" stroke-width="34"/>
  <circle cx="1350" cy="500" r="120" fill="none" stroke="${accent}" stroke-width="34" stroke-dasharray="520 1000" transform="rotate(-90 1350 500)"/>
  <rect x="300" y="730" width="1250" height="240" rx="18" fill="${panel}"/>
  ${Array.from({ length: rows }, (_, i) => `<g transform="translate(330,${770 + i * 48})"><rect width="220" height="14" rx="7" fill="${ink}" opacity=".7"/><rect x="300" width="180" height="14" rx="7" fill="${muted}" opacity=".4"/><rect x="560" width="260" height="14" rx="7" fill="${muted}" opacity=".4"/><rect x="1060" y="-6" width="110" height="26" rx="13" fill="${accent}" opacity=".85"/></g>`).join('')}
</svg>`;
}

const mocks = [
  ['taskly-payroll', { title: 'Payroll', accent: '#7B5CFF', bg: '#0d0d14', panel: '#161624', ink: '#ECEBFF', muted: '#8A88B0', rows: 4 }],
  ['assetdesk', { title: 'AssetDesk', accent: '#22C3A6', bg: '#0b1211', panel: '#13201e', ink: '#E7FFFA', muted: '#7FA9A1', rows: 4 }],
  ['nexusbook', { title: 'NexusBook', accent: '#FF8A3D', bg: '#120d0a', panel: '#1f1712', ink: '#FFF1E8', muted: '#B39886', rows: 4 }],
  ['gyaan-vidhya', { title: 'Gyaan Vidhya', accent: '#F5B82E', bg: '#0e0c07', panel: '#1b170d', ink: '#FFF7E3', muted: '#B5A57C', rows: 4 }],
  ['tatkal', { title: 'Tatkal', accent: '#9B6BFF', bg: '#0c0a14', panel: '#171326', ink: '#F1ECFF', muted: '#9A90BF', rows: 4 }],
];

console.log('Converting project screenshots…');
for (const [slug, rel, name, w, pos] of copies) await convert(slug, rel, name, w, pos);

console.log('Rendering mock screens…');
for (const [slug, cfg] of mocks) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, 'screen-dark.webp');
  await sharp(Buffer.from(mockScreen(cfg))).webp({ quality: 80 }).toFile(dest);
  console.log(`  mock ${slug}/screen-dark.webp`);
}
console.log('Done.');
