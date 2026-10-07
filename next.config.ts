import type { NextConfig } from 'next';

const BUILD_TIME = new Date().toISOString();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BUILD_TIME: BUILD_TIME,
    NEXT_PUBLIC_BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 768, 1024, 1440, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
