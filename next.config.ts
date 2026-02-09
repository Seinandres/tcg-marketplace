import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pokemontcg.io", // 👈 Damos permiso al servidor de cartas
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;