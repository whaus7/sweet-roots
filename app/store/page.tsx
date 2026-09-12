"use client";

import Image from "next/image";
import { useState } from "react";
import HeroBanner from "../components/HeroBanner";

const PACK_100_PRICE = 19.95;
const PACK_300_PRICE = 34.95;

interface PackageOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const packageOptions: PackageOption[] = [
  {
    id: "count-100",
    name: "100 count",
    price: PACK_100_PRICE,
    description:
      "A starter herd of European red wigglers for a bin, raised bed, or small compost pile.",
  },
  {
    id: "count-300",
    name: "300 count",
    price: PACK_300_PRICE,
    description:
      "Enough live worms to stock a larger worm bin and start producing vermicast sooner.",
  },
];

export default function WormStorePage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(
    packageOptions[0]
  );

  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <HeroBanner
        title="European Red Wigglers"
        subtitle="Live Eisenia fetida for composting, vermicast, and living soil — shipped from Sweet Roots"
        backgroundImage="/images/brix-banner.png"
        altText="Living soil and red wigglers"
        burnAmount={0.6}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-green-700">
                Live worms
              </p>
              <h2 className="mt-1 text-3xl font-semibold text-gray-900">
                European red wigglers
              </h2>
              <p className="mt-2 text-gray-600">
                Eisenia fetida — the compost worm. They live in the rich top
                layer, eat residue, and leave vermicast that feeds the soil
                microbiome.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pack size
              </label>
              <div className="grid grid-cols-1 gap-4">
                {packageOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPackage(option)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedPackage.id === option.id
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        {option.name}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${option.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Add to Cart - ${selectedPackage.price.toFixed(2)}
            </button>

            <div className="bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Why red wigglers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                These worms stay where the food is — in bedding, compost, and
                the organic-rich surface of garden soil. Their castings carry
                plant-available nutrients and a dense community of bacteria and
                fungi. Add them to a bin or a mulched bed and they turn waste
                into living fertilizer.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative h-96 w-full bg-amber-50">
                <Image
                  src="/images/worms/red-wigglers.webp"
                  alt="European red wiggler earthworms"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Shipped live
            </h3>
            <p className="text-gray-600">
              Packed for transit so your herd arrives ready for a bin or bed
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🪱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compost specialists
            </h3>
            <p className="text-gray-600">
              Eisenia fetida thrive in organic-rich bedding, not deep mineral
              soil
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🌱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vermicast builders
            </h3>
            <p className="text-gray-600">
              Castings inoculate soil with microbes and plant-available
              nutrients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
