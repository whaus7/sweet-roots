export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <div className="h-48 w-full bg-gray-200 md:h-64 lg:h-80" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="h-4 max-w-xl rounded bg-gray-200" />
        <div className="mt-6 h-16 max-w-xl rounded-2xl bg-gray-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-gray-100" />
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Reading the climate record for this place…
        </p>
      </div>
    </div>
  );
}
