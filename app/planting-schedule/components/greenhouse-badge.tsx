export function GreenhouseBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--sage)]">
      <GreenhouseIcon />
      Prefers Greenhouse
    </span>
  );
}

function GreenhouseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M2 13.5V7.2L8 2.5l6 4.7v6.3H2Z" />
      <path d="M8 2.5v11M2 7.2h12" />
    </svg>
  );
}
