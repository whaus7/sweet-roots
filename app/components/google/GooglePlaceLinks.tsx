import { site } from "@/app/lib/site";

export function GooglePlaceLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <p className={className}>
      <a
        href={site.mapsUrl}
        className="font-semibold text-[#00340c] underline decoration-[#00340c]/30 underline-offset-4 hover:decoration-[#00340c]"
        rel="noreferrer"
        target="_blank"
      >
        Find us on Google
      </a>
      <span className="mx-2 text-[#5c5348]" aria-hidden>
        ·
      </span>
      <a
        href={site.mapsUrl}
        className="font-semibold text-[#00340c] underline decoration-[#00340c]/30 underline-offset-4 hover:decoration-[#00340c]"
        rel="noreferrer"
        target="_blank"
      >
        Write a Google review
      </a>
    </p>
  );
}
