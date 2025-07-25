import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  altText?: string;
  burnAmount?: number; // Controls the intensity of burn effect (0-1, default 0.6)
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  altText = "Hero Banner",
  burnAmount = 0.6,
}: HeroBannerProps) {
  // Clamp burnAmount between 0 and 1
  const clampedBurnAmount = Math.max(0, Math.min(1, burnAmount));

  // Apply exponential scaling for more dramatic effect at higher values
  const dramaticBurn = Math.pow(clampedBurnAmount, 0.7); // Makes higher values more pronounced

  return (
    <div className="relative w-full">
      {/* Background Image with Burn Effect */}
      <div className="relative h-20 md:h-30 lg:h-40 overflow-hidden">
        <Image
          src={backgroundImage}
          alt={altText}
          fill
          className="object-cover"
          priority
        />
        {/* Burn Effect Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"
          style={{
            opacity: dramaticBurn * 0.8,
            background: `linear-gradient(to bottom, rgba(0,0,0,${
              dramaticBurn * 0.6
            }) 0%, rgba(0,0,0,${dramaticBurn * 0.5}) 50%, rgba(0,0,0,${
              dramaticBurn * 0.9
            }) 100%)`,
          }}
        ></div>
        {/* Additional burn effect for better text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"
          style={{
            opacity: dramaticBurn * 0.4,
            background: `linear-gradient(to right, rgba(0,0,0,${
              dramaticBurn * 0.4
            }) 0%, transparent 50%, rgba(0,0,0,${dramaticBurn * 0.4}) 100%)`,
          }}
        ></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
