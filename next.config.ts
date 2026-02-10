/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 👈 LA SOLUCIÓN MAESTRA: Acepta cualquier dominio
      },
    ],
  },
};

export default nextConfig;