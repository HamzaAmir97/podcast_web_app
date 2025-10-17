// frontend/next.config.js
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      // ستريم الصوت عبر نفس الدومين
      { source: "/stream/:id", destination: `${BACKEND_ORIGIN}/stream/:id` },
      // كل الملفات الستاتيك (صور/أوديو/داتا) عبر نفس الدومين
      { source: "/static/:path*", destination: `${BACKEND_ORIGIN}/static/:path*` },
    ];
  },

  // اسمح بـ next/image يجيب صور مطلقة من الباك إند لو مرّت URL مطلقة
  images: {
    domains: ["podcast-web-app.onrender.com", "localhost"],
    // لو حابب تتخطّى محسن الصور نهائيًا (حل سريع):
    // unoptimized: true,
  },
};

export default nextConfig;
