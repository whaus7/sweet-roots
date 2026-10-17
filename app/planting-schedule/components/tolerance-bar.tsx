import type { WindowFit } from "@/app/planting-schedule/lib/types";

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

type Props = {
  fit: WindowFit;
  caption?: string;
};

export function ToleranceBar({ fit, caption }: Props) {
  const currentMonth = new Date(`${fit.today}T00:00:00Z`).getUTCMonth();
  const suitableLabels = MONTH_LABELS.filter(
    (_, month) => fit.suitableMonths[month],
  );
  const ariaLabel = [
    caption,
    fit.label,
    suitableLabels.length > 0
      ? `suitable months: ${suitableLabels.join(", ")}`
      : "no suitable months",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-medium text-[var(--ink-muted)]">
          {caption ? (
            <span className="uppercase tracking-[0.14em]">{caption}</span>
          ) : (
            <>
              {fit.daysToHarvest} days seed to harvest
              {fit.canFinishHarvest ? "" : " · tight window"}
            </>
          )}
        </p>
        <p className="text-xs text-[var(--ink)]">{fit.label}</p>
      </div>
      <div
        className="mt-2 grid grid-cols-12 gap-0.5 sm:gap-1"
        role="img"
        aria-label={ariaLabel}
      >
        {MONTH_LABELS.map((label, month) => {
          const suitable = Boolean(fit.suitableMonths[month]);
          const current = month === currentMonth;
          return (
            <span
              key={label}
              className={`flex aspect-square items-center justify-center overflow-hidden whitespace-nowrap rounded-[3px] text-[8px] font-semibold uppercase leading-none tracking-tight sm:text-[9px] ${
                suitable
                  ? "bg-[var(--sage)] text-white"
                  : "border border-[var(--rule)] bg-[var(--bar-track)] text-[var(--ink-faint)]"
              } ${current ? "ring-2 ring-[var(--ink)] ring-offset-1 ring-offset-[var(--paper)]" : ""}`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
