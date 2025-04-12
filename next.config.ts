import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://rerollcdn.com/items/**')],
  },
};

export default nextConfig;
