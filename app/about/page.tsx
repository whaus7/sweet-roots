import Link from "next/link";
import HeroBanner from "../components/HeroBanner";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      {/* Hero Banner */}
      <HeroBanner
        title="About Sweet Roots Farm"
        subtitle="Growing exceptional microgreens through nutrition testing excellence"
        backgroundImage="/images/microgreens/microgreen-banner.jpg"
        altText="Sweet Roots Farm About Banner"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-white rounded-lg">
          <div className="space-y-8">
            {/* Mission Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At Sweet Roots Farm, we are passionate about delivering the
                highest quality microgreens while maintaining the highest
                standards of nutrition and safety. Our commitment to nutrition
                testing sets us apart in the industry, ensuring that every batch
                of microgreens we produce meets our rigorous quality standards.
              </p>
            </section>

            {/* Nutrition Testing Focus */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Nutrition Testing Excellence
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that exceptional microgreens start with exceptional
                soil health. Our comprehensive nutrition testing program
                includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Soil health analysis and monitoring</li>
                <li>Nutrient content verification</li>
                <li>Microbial activity assessment</li>
                <li>Quality control testing at every stage</li>
                <li>Regular nutritional profile analysis</li>
              </ul>
            </section>

            {/* Our Process */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    1. Soil Analysis
                  </h3>
                  <p className="text-gray-600">
                    We begin with comprehensive soil health testing to ensure
                    optimal growing conditions.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    2. Controlled Growth
                  </h3>
                  <p className="text-gray-600">
                    Our microgreens are grown in carefully controlled
                    environments with continuous monitoring.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    3. Quality Assurance
                  </h3>
                  <p className="text-gray-600">
                    Every batch undergoes rigorous testing before reaching our
                    customers.
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
