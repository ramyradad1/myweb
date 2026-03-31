import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Force consistent URLs (no trailing slash)
  trailingSlash: false,

  // Redirect www to non-www for canonical consistency
  async redirects() {
    return [
      // Redirect www.technify.space to technify.space (all paths)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.technify.space' }],
        destination: 'https://technify.space/:path*',
        permanent: true,
      },
      // Redirect www root explicitly
      {
        source: '/',
        has: [{ type: 'host', value: 'www.technify.space' }],
        destination: 'https://technify.space/',
        permanent: true,
      },
    ];
  },

  // Optimized cache headers for better PageSpeed score
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
