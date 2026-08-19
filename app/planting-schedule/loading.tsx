export default function Loading() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 pb-20 pt-10 sm:px-8">
      <div className="border-b border-[var(--rule)] pb-8">
        <div className="h-3 w-40 rounded bg-[var(--rule)]" />
        <div className="mt-4 h-10 w-72 rounded bg-[var(--rule)]" />
        <div className="mt-6 h-16 max-w-xl rounded-2xl bg-[var(--rule)]" />
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-2xl bg-[var(--sage-wash)]"
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-[var(--ink-muted)]">
        Reading the climate record for this place…
      </p>
    </div>
  );
}
