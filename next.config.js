/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
