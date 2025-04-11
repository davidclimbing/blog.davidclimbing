/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // 프로덕션 빌드에서는 ESLint 경고를 무시합니다.
    ignoreDuringBuilds: true,
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
