import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  altText?: string;
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  altText = "Hero Banner",
}: HeroBannerProps) {
  return (
    <div className="relative w-full">
      {/* Background Image with Burn Effect */}
      <div className="relative h-32 md:h-44 lg:h-56 overflow-hidden">
        <Image
          src={backgroundImage}
          alt={altText}
          fill
          className="object-cover"
          priority
        />
        {/* Burn Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        {/* Additional burn effect for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
