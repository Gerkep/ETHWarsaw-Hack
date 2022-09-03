/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'staverse.infura-ipfs.io', 'drive.google.com'],
  },
};

module.exports = nextConfig;
