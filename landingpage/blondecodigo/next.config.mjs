/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
