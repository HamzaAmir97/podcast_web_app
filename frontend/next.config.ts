import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/static/**" },
      // أضف دومين الإنتاج لاحقًا
    ],
  },
};

export default nextConfig;
