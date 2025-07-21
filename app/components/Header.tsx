import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-[1100] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Sweet Roots Farm
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/brix-logs"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Brix Logs
            </Link>
            <Link
              href="/microgreen-store"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Microgreen Store
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
