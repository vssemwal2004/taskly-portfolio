/** TasklyTech mark: a T built from two bars with a "task done" check through the stem. */
export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <rect x="7" y="7.5" width="18" height="5" rx="2.5" fill="var(--bg)" />
      <rect x="13.5" y="7.5" width="5" height="17" rx="2.5" fill="var(--bg)" />
      <path d="M10.5 19.5l3.6 3.6 7.6-8.1" stroke="#C6FF3D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[15.5px] font-semibold tracking-[-0.02em]">
        TasklyTech
        <span className="ml-1 hidden font-normal text-muted sm:inline">Solutions</span>
      </span>
    </span>
  );
}
