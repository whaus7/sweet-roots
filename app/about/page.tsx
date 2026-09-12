import HeroBanner from "../components/HeroBanner";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <HeroBanner
        title="About Sweet Roots"
        subtitle="Worms, vermicast, and the living soil food web"
        backgroundImage="/images/brix-banner.png"
        altText="Sweet Roots soil and worms"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="bg-white rounded-lg">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Sweet Roots is a knowledge hub for worms, soil health, and the
                microbiome benefits of vermicast. We raise European red wigglers
                and share the same tools we use to read living soil — tests,
                planting windows, and water flow — so you can build fertility
                from the ground up.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Why vermicast
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Worm castings are more than compost. They carry plant-available
                nutrients bound in a stable crumb, plus the bacteria and fungi
                that trade with roots. We focus on:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>European red wigglers (Eisenia fetida) for bins and beds</li>
                <li>Vermicast as a living inoculant, not a salt fertilizer</li>
                <li>Soil structure, water infiltration, and the rhizosphere</li>
                <li>Practical tests you can run at home or in the field</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How we work
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    1. Raise worms
                  </h3>
                  <p className="text-gray-600">
                    We keep red wigglers in organic-rich bedding and ship live
                    herds for composting and soil building.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    2. Teach the food web
                  </h3>
                  <p className="text-gray-600">
                    The home diagram and tools walk through worms, fungi, roots,
                    and why structure matters as much as NPK.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    3. Measure what grows
                  </h3>
                  <p className="text-gray-600">
                    Brix, compaction, PLFA, and planting windows stay available
                    under Tools so you can track living soil over time.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
