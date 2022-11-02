/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    domains: ["images.unsplash.com", "ipfs.io"],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
