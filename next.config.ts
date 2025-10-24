// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // UPDATED: 'img-src' now allows all external https images
            value: "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; frame-src 'self'; connect-src 'self';",
          },
        ],
      },
    ]
  },
};

export default nextConfig;