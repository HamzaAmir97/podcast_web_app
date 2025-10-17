// frontend/next.config.js
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/stream/:id", destination: `${BACKEND_ORIGIN}/stream/:id` },
      { source: "/static/:path*", destination: `${BACKEND_ORIGIN}/static/:path*` },
    ];
  },
  images: {
    // ✅ تجاوز التحسين — يخلّي الصورة تُحمّل مباشرة من /static/...
    unoptimized: true,
  },
};

export default nextConfig;
