import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // Static export for Netlify/Vercel static hosting
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
