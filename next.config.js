/** @type {import('next').NextConfig} */
const port = parseInt(process.env.SERVER_PORT, 10) || 3001
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${port}/api/:path*`,
      },
    ]
  },
}
