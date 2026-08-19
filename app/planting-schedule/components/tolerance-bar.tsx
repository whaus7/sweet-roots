import type { WindowFit } from "@/app/planting-schedule/lib/types";
import { isWindowActive, barPosition, windowRangeLabel } from "@/app/planting-schedule/lib/windows";

type Props = {
  fit: WindowFit;
  caption: string;
};

export function ToleranceBar({ fit, caption }: Props) {
  const position = barPosition(fit);
  const muted = !isWindowActive(fit);

  return (
    <div className={muted ? "opacity-55" : undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          {caption}
        </p>
        <p className="text-xs text-[var(--ink)]">{fit.label}</p>
      </div>
      <div
        className="relative mt-2 h-2.5 overflow-visible rounded-full bg-[var(--bar-track)]"
        role="img"
        aria-label={`${caption}: ${fit.label}`}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--amber) 0%, var(--sage) 50%, var(--amber) 100%)",
            opacity: muted ? 0.45 : 0.9,
          }}
        />
        <span
          className="absolute top-1/2 size-3.5 rounded-full border-2 border-[var(--paper)] bg-[var(--ink)] shadow-sm"
          style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">
        {windowRangeLabel(fit)}
      </p>
    </div>
  );
}
