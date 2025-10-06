/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for Cloudflare Pages deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features not supported in static export
  experimental: {
    // Enable if needed for your use case
  }
}

module.exports = nextConfig