// frontend/next.config.js
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

let remotePatterns = [
  // للتطوير المحلي
  { protocol: "http", hostname: "localhost", port: "5000", pathname: "/static/**" },
];


try {
  const u = new URL(BACKEND_ORIGIN);
  
  remotePatterns.push({
    protocol: u.protocol.replace(":", ""), // "https" أو "http"
    hostname: u.hostname,                  // "podcast-web-app.onrender.com"
    port: u.port,
    pathname: "/static/**",
  });
} catch {  }

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  linting: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      { source: "/stream/:id", destination: `${BACKEND_ORIGIN}/stream/:id` },
    ];
  },
  images: {
    remotePatterns,
   
  },
};

export default nextConfig;
