import Link from "next/link";
import Mountains from "@/app/components/footer/Mountains";

export function Footer() {
  return (
    <footer>
      <div className="flex justify-center overflow-x-hidden" id="hero">
        <div>
          <Mountains />
        </div>
      </div>

      <div style={{ background: "#fcfcfc" }}>
        <div className="max-w-[1100px] mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-500">
                Location
              </h3>
              <div className="space-y-2 text-gray-800">
                <p>Bellevue, WA</p>
                <p>Phone: 312-415-1093</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-500">
                About Us
              </h3>
              <p className="text-gray-800 leading-relaxed">
                Sweet Roots is a knowledge hub for worms, soil health, and the
                microbiome benefits of vermicast. We raise European red wigglers
                and share the tools we use to read living soil.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-500">
                Menu
              </h3>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/store"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Store
                </Link>
                <Link
                  href="/soil-tests"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Soil Tests
                </Link>
                <Link
                  href="/brix-logs"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Brix Logs
                </Link>
                <Link
                  href="/land-survey"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Water Flow
                </Link>
                <Link
                  href="/planting-schedule"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  Planting
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-800 hover:text-green-500 transition-colors duration-200"
                >
                  About Us
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Sweet Roots Farm. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
