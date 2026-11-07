/* Small theme-aware illustrations for the service cards (pure SVG/CSS). */

export function AgentGraph() {
  const nodes = [
    { x: 40, y: 70, l: 'Intent' }, { x: 150, y: 70, l: 'Router' }, { x: 270, y: 24, l: 'Search' },
    { x: 270, y: 70, l: 'Booking' }, { x: 270, y: 116, l: 'Recovery' }, { x: 380, y: 70, l: 'Tools/API' },
  ];
  const edges = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5]];
  return (
    <svg viewBox="0 0 420 140" className="h-full w-full" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <path key={i} d={`M${nodes[a].x} ${nodes[a].y} C ${(nodes[a].x + nodes[b].x) / 2} ${nodes[a].y}, ${(nodes[a].x + nodes[b].x) / 2} ${nodes[b].y}, ${nodes[b].x} ${nodes[b].y}`} fill="none" stroke="var(--line-strong)" strokeWidth="1.4" strokeDasharray="4 6" style={{ animation: `dash ${1.2 + i * 0.15}s linear infinite` }} />
      ))}
      {nodes.map((n, i) => (
        <g key={n.l} transform={`translate(${n.x},${n.y})`}>
          <rect x="-34" y="-13" width="68" height="26" rx="13" fill="var(--surface-2)" stroke={i === 1 ? 'var(--brand-ink)' : 'var(--line-strong)'} />
          <text textAnchor="middle" dy="4" fontSize="10.5" fontFamily="var(--font-mono)" fill="var(--ink-2)">{n.l}</text>
        </g>
      ))}
    </svg>
  );
}

export function VoiceBars() {
  return (
    <div className="flex h-full flex-col justify-center gap-4" aria-hidden="true">
      <div className="flex h-20 items-center justify-center gap-[5px]">
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} className="w-[5px] origin-center rounded-full bg-ink" style={{ height: `${30 + ((i * 37) % 70)}%`, animation: `eq ${0.7 + ((i * 13) % 9) / 10}s ease-in-out ${i * 0.05}s infinite`, opacity: 0.35 + ((i * 7) % 6) / 10 }} />
        ))}
      </div>
      <div className="mx-auto flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
        <span className="h-1.5 w-1.5 animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#ef4444]" /> listening · adaptive follow-up
      </div>
    </div>
  );
}

export function BrowserSkeleton() {
  return (
    <div className="h-full rounded-lg border border-line bg-surface-2 p-4" aria-hidden="true">
      <div className="mb-4 flex gap-1.5"><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /></div>
      <div className="mb-2 h-3.5 w-2/3 rounded bg-ink/80" />
      <div className="mb-5 h-2 w-1/2 rounded bg-line-strong" />
      <div className="grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className={`h-14 rounded-md ${i === 0 ? 'bg-brand' : 'bg-line'}`} />)}</div>
    </div>
  );
}

export function ErpRows() {
  const rows = [['Payroll · Oct', 'Approved'], ['Attendance upload', 'Review'], ['Asset #A-214', 'Returned'], ['Admissions batch', 'Processing']];
  return (
    <div className="grid h-full content-center gap-2" aria-hidden="true">
      {rows.map(([a, b], i) => (
        <div key={a} className="flex items-center justify-between rounded-md border border-line bg-surface-2 px-3 py-2.5 font-mono text-[11.5px]">
          <span className="text-ink-2">{a}</span>
          <span className={`rounded px-1.5 py-0.5 ${i === 0 || i === 2 ? 'bg-brand text-[#0b0b0c]' : 'bg-line text-muted'}`}>{b}</span>
        </div>
      ))}
    </div>
  );
}

export function Layers() {
  return (
    <div className="grid h-full place-items-center [perspective:700px]" aria-hidden="true">
      <div className="relative h-28 w-28 animate-[spin-slow_14s_linear_infinite] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-40deg)]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute inset-0 rounded-xl border border-line-strong" style={{ transform: `translateZ(${i * 26}px)`, background: i === 2 ? 'linear-gradient(135deg, var(--brand), color-mix(in oklab, var(--violet) 70%, transparent))' : 'color-mix(in oklab, var(--surface-2) 85%, transparent)' }} />
        ))}
      </div>
    </div>
  );
}

export function Uptime() {
  return (
    <div className="flex h-full flex-col justify-center gap-3" aria-hidden="true">
      <div className="flex h-12 items-end gap-[3px]">
        {Array.from({ length: 60 }, (_, i) => <span key={i} className={`flex-1 rounded-[2px] ${i === 41 ? 'h-1/2 bg-[#f59e0b]' : 'h-full bg-[#22c55e]'}`} style={{ opacity: 0.55 + ((i * 7) % 5) / 10 }} />)}
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted"><span>deploys · monitoring · fixes</span><span>60 days</span></div>
    </div>
  );
}

export const VISUALS: Record<string, () => React.ReactElement> = {
  'ai-automation': AgentGraph,
  voice: VoiceBars,
  platforms: BrowserSkeleton,
  erp: ErpRows,
  immersive: Layers,
  care: Uptime,
};
