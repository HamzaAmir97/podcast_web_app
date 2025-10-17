import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/static/**" },
      // أضف دومين الإنتاج لاحقًا
    ],
  },
    async rewrites() {
    return [{ source: "/stream/:id", destination: "http://localhost:5000/stream/:id" }];
  },
};

export default nextConfig;
