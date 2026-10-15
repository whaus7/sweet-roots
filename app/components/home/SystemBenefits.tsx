import Link from "next/link";

export function SystemBenefits() {
  return (
    <section className="bg-[#fcfcfc]" aria-labelledby="system-benefits-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gray-500">
          The yard
        </p>
        <h2
          id="system-benefits-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-[#00340c] sm:text-4xl"
        >
          A bed that stays. Soil that works.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
          Structure and biology are two jobs. Concrete holds the line for
          decades. Living soil — wood, worms, and vermicast — feeds the plants
          after we leave.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00340c]">
              Concrete beds
            </h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-gray-700">
              <li>
                Cast panels, built on site. Cedar cap or a clean concrete rim —
                not a kit that racks and rots.
              </li>
              <li>
                Install is included. We set the frame level in the yard. We do
                not ship panels.
              </li>
              <li>
                Heavy enough to stay. A drip run can go in with the frame if you
                want water at the bed.
              </li>
            </ul>
            <Link
              href="/beds"
              className="mt-6 inline-block text-sm font-semibold text-[#00340c] underline decoration-[#00340c]/30 underline-offset-4 hover:decoration-[#d4a017]"
            >
              Raised beds
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00340c]">
              Living soil system
            </h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-gray-700">
              <li>
                Hugelkultur and a vermicast-and-compost cap — the engine under
                the plants, not a bag of potting dirt.
              </li>
              <li>
                A worm start of about a thousand red wigglers. From then on the
                bed is its own bin.
              </li>
              <li>
                Kitchen scraps in rotating corners, or we come monthly to feed
                and check the bed. Biology, not salt, does the work.
              </li>
            </ul>
            <Link
              href="/soil"
              className="mt-6 inline-block text-sm font-semibold text-[#00340c] underline decoration-[#00340c]/30 underline-offset-4 hover:decoration-[#d4a017]"
            >
              Living soil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
