"use client";

import Image from "next/image";
import { useState } from "react";
import HeroBanner from "../components/HeroBanner";

interface MicrogreenProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  image2?: string; // Placeholder for second image
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const microgreenProducts: MicrogreenProduct[] = [
  {
    id: "arugula",
    name: "Arugula Microgreens",
    description:
      "Peppery and flavorful arugula microgreens with a distinctive taste. Perfect for adding a spicy kick to salads and sandwiches.",
    image: "/images/microgreens/arugula-microgreens.webp",
  },
  {
    id: "wasabi",
    name: "Wasabi Microgreens",
    description:
      "Spicy wasabi microgreens with a unique heat that builds gradually. Excellent for sushi, Asian dishes, and as a garnish.",
    image: "/images/microgreens/wasabi-microgreens-1.webp",
  },
  {
    id: "cilantro",
    name: "Cilantro Microgreens",
    description:
      "Fresh cilantro microgreens with the classic herbaceous flavor. Ideal for Mexican cuisine, salsas, and fresh garnishes.",
    image: "/images/microgreens/cilantro-microgreen-1.webp",
  },
  {
    id: "radish",
    name: "Radish Microgreens",
    description:
      "Spicy and vibrant radish microgreens with a peppery kick. Excellent for adding bold flavor to dishes and salads.",
    image: "/images/microgreens/radish-microgreens.webp",
  },
  {
    id: "salad-mix",
    name: "Salad Mix Microgreens",
    description:
      "A delightful blend of various microgreens creating a perfect mix of flavors and textures for any salad or dish.",
    image: "/images/microgreens/salad-mix-microgreens.webp",
  },
];

const packageOptions: PackageOption[] = [
  {
    id: "packaged",
    name: "16oz Packaged",
    price: 6.0,
    description: "Fresh microgreens packaged in a 16oz container, ready to use",
  },
  {
    id: "living-tray",
    name: "Living Tray",
    price: 35.0,
    description:
      "Full living tray of microgreens, still growing and at peak freshness",
  },
];

export default function MicrogreenStore() {
  const [selectedMicrogreen, setSelectedMicrogreen] =
    useState<MicrogreenProduct>(microgreenProducts[0]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(
    packageOptions[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      {/* Full Width Banner */}
      <HeroBanner
        title="Fresh Microgreens"
        subtitle="Locally grown, nutrient-rich microgreens delivered fresh to your door"
        backgroundImage="/images/microgreens/microgreen-banner.jpg"
        altText="Fresh Microgreens Banner"
        burnAmount={0.6}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Dropdown and Package Selection */}
          <div className="space-y-8">
            {/* Microgreen Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Microgreen
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-left shadow-sm hover:border-green-300 focus:border-green-500 focus:outline-none transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-sm">🌱</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {selectedMicrogreen.name}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                    {microgreenProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedMicrogreen(product);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-150 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 text-sm">🌱</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Package Type
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
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Add to Cart - ${selectedPackage.price.toFixed(2)}
            </button>

            {/* Product Description */}
            <div className="bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {selectedMicrogreen.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {selectedMicrogreen.description}
              </p>
            </div>
          </div>

          {/* Right Column - Image Gallery */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Main Image */}
              <div className="relative h-140 w-full">
                <Image
                  src={selectedMicrogreen.image}
                  alt={selectedMicrogreen.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Image Gallery Navigation */}
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2">
                  <div className="w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center border-2 border-green-400">
                    <Image
                      src={selectedMicrogreen.image}
                      alt={selectedMicrogreen.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                    <span className="text-gray-500 text-xs text-center">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🚚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Local Delivery
            </h3>
            <p className="text-gray-600">
              Fresh microgreens delivered to your door within 24 hours
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🌿</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Organic Certified
            </h3>
            <p className="text-gray-600">
              All our microgreens are grown using organic methods
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">💚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nutrient Rich
            </h3>
            <p className="text-gray-600">
              Packed with vitamins, minerals, and antioxidants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
