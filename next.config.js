/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  },
  // Suppress hydration warnings in development for known browser extension issues
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: false, // Helps with hydration issues in dev mode
  }),
}

module.exports = nextConfig