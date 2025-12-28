import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep only essential optimizations
  experimental: {
    optimizePackageImports: ['highlight.js'],
  },
  // Next.js 16: Turbopack 설정 추가 (webpack 대신 사용)
  turbopack: {},
  // Ensure static assets are correctly handled
  async rewrites() {
    return [
      {
        source: '/_next/static/css/:path*',
        destination: '/_next/static/css/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
