import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/microgreen-store",
        destination: "/store/microgreens",
        permanent: true,
      },
      {
        source: "/store/continuous-flow-beds",
        destination: "/store/continuous-flow-through-worm-bins",
        permanent: true,
      },
      {
        source: "/store/continuous-flow-bins",
        destination: "/store/continuous-flow-through-worm-bins",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
