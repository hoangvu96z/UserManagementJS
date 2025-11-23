
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://vunph.id.vn/api/:path*', // Proxy to external API
      },
    ];
  },
};

export default nextConfig;
