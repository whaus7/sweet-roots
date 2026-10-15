import Image from "next/image";

const STEPS = [
  {
    n: "01",
    title: "Prep",
    kicker: "New beds, or start over",
    image: "/images/soil-prep-empty.jpg",
    alt: "An empty concrete raised bed with a cedar cap, ready to be filled from scratch",
    lead: "New beds start empty. Existing beds: we take every inch of old soil out and begin again.",
    body: "Leftover salts, compacted fill, and dead potting mix cannot host a food web. A clean start can. Whether the frame is new or already in the yard, the living-soil system needs a bare interior — not a top-dress over chemistry.",
    benefit:
      "No leftover salts. No compacted dead fill. A clean start for the organisms that do the work.",
  },
  {
    n: "02",
    title: "Hugelkultur",
    kicker: "The engine under the mix",
    image: "/images/soil-hugel-layers-v2.jpg",
    alt: "Chopped logs, sticks, and leaf litter layered as hugelkultur fill",
    lead: "Chopped logs, sticks, and leaf litter go in first. The wood is the engine under the growing mix.",
    body: "As the wood breaks down it holds water, feeds fungi, and slowly collapses into structure. The bed is not a bag of potting dirt sitting on plywood. It is a reservoir and a fungal pantry that keeps working after we leave.",
    benefit:
      "Water stays in the bed. Fungi have food. The fill does not sit lifeless under the plants.",
  },
  {
    n: "03",
    title: "Red wigglers",
    kicker: "About a thousand compost worms",
    image: "/images/worms/red-wigglers.webp",
    alt: "European red wiggler composting worms on dark soil",
    lead: "We stock the bed with about a thousand European red wigglers — compost worms, not nightcrawlers.",
    body: "They live where the residue is rich. They eat decaying scraps and microbes, leave vermicast in place, and open air channels as they travel. From this point the raised bed is its own worm bin.",
    benefit:
      "Continuous amendment. Aeration tunnels. Vermicast made where the roots will be.",
  },
  {
    n: "04",
    title: "The cap",
    kicker: "Vermicast and compost",
    image: "/images/services-diagram/soil-amend-hero.jpg",
    alt: "Dark living soil with a red wiggler and vermicast tea poured onto the surface",
    lead: "Fresh vermicast and compost close the bed — the layer the plants go into.",
    body: "Castings carry plant-available minerals, bacteria, and fungal spores in a crumb that will not burn roots. Compost adds bulk and food. The first season has biology to stand on, not leftover salts.",
    benefit:
      "Immediate crumb, microbes, and a moisture blanket over the wood and the herd.",
  },
  {
    n: "05",
    title: "Feed the system",
    kicker: "Rotating corners",
    image: "/images/soil-feed-corner.jpg",
    alt: "Kitchen scraps tucked into one corner of a raised bed so worms can migrate to the food",
    lead: "Kitchen scraps go into rotating corners of the bed. The herd migrates to the fresh food.",
    body: "As they move they amend, aerate, and leave castings behind. You are not fertilizing on a calendar. You are feeding a living system that keeps the soil in motion.",
    benefit:
      "Worms travel the bed. Structure opens. Fertility is made in place, not dumped on top.",
  },
] as const;

export function SoilSteps() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <p className="catalog-display text-2xl leading-snug text-[var(--catalog-ink)] sm:text-3xl">
          A garden fails from the soil out. We start there.
        </p>
        <div className="mt-12 columns-1 gap-12 text-[17px] leading-[1.75] text-[var(--catalog-muted)] sm:columns-2">
          <p className="mb-6">
            The bed is not a box of dirt. It is a living system: wood that holds
            water, worms that move and amend, a food web the plants can trade
            with.
          </p>
          <p className="mb-6">
            After years of synthetics the web is quiet. Repair is slower than a
            bag of NPK. We put the organisms back, give them a structure that
            feeds them, then keep feeding the system.
          </p>
          <p className="mb-6">
            New frames get this build from the first day. Existing beds get the
            same treatment — soil out, hugelkultur in — so leftover chemistry
            does not sit under a fresh top-dress.
          </p>
          <p>
            We build the system once. You feed it, or we come feed it. The
            plants follow.
          </p>
        </div>
      </section>

      {STEPS.map((step, index) => {
        const imageFirst = index % 2 === 0;
        return (
          <section
            key={step.n}
            className="border-t border-[var(--catalog-ink)]/10"
            aria-labelledby={`step-${step.n}`}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
              <figure
                className={`relative isolate aspect-[16/10] overflow-hidden bg-[#1a120c] ${
                  imageFirst ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>

              <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--catalog-muted)]">
                  {step.n} — {step.kicker}
                </p>
                <h2
                  id={`step-${step.n}`}
                  className="catalog-display mt-3 text-4xl font-medium tracking-tight text-[var(--catalog-ink)] sm:text-5xl"
                >
                  {step.title}
                </h2>
                <p className="mt-5 text-[17px] leading-[1.75] text-[var(--catalog-ink)]">
                  {step.lead}
                </p>
                <p className="mt-4 text-[17px] leading-[1.75] text-[var(--catalog-muted)]">
                  {step.body}
                </p>
                <p className="mt-6 border-l-2 border-[var(--catalog-ink)]/20 pl-4 text-sm leading-relaxed text-[var(--catalog-muted)]">
                  {step.benefit}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      <section
        className="border-t border-[var(--catalog-ink)]/10"
        aria-labelledby="feeding-paths"
      >
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--catalog-muted)]">
            After we leave
          </p>
          <h2
            id="feeding-paths"
            className="catalog-display mt-3 text-4xl font-medium tracking-tight sm:text-5xl"
          >
            You feed it, or we do
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-[var(--catalog-muted)]">
            The rotation is simple: scraps in one corner this week, the next
            corner the next time. Worms follow the food. Two ways to keep it
            going.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="border border-[var(--catalog-ink)]/20 bg-white p-6 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--catalog-ink)]">
                DIY
              </h3>
              <p className="mt-4 text-[17px] leading-[1.75] text-[var(--catalog-muted)]">
                We show you the corner rotation before we leave. Kitchen scraps
                in, a light cover of compost, move to the next corner next time.
                The herd does the rest.
              </p>
            </div>
            <div className="border border-[var(--catalog-ink)]/20 bg-white p-6 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--catalog-ink)]">
                We feed
              </h3>
              <p className="mt-4 text-[17px] leading-[1.75] text-[var(--catalog-muted)]">
                Monthly feeding and a health check — same rotation, same cover,
                no calendar of synthetic fertilizer. Ask when you get in touch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
