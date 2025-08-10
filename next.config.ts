import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // 프로덕션 빌드에서는 ESLint 경고를 무시합니다.
    ignoreDuringBuilds: true,
  },
  // Keep only essential optimizations
  experimental: {
    optimizePackageImports: ['highlight.js'],
  },
  // Simple webpack optimization (removed over-engineering)
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      // Only essential optimization - no excessive bundle splitting
      config.optimization = {
        ...config.optimization,
        // Keep default Next.js splitting, just optimize highlight.js
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Simple highlight.js separation
            highlight: {
              name: 'highlight',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]highlight\.js/,
              priority: 30,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
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
