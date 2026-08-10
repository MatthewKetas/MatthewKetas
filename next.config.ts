import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages: repo is deployed as the user's root
  // <username>.github.io site, so no basePath/assetPrefix is needed.
  output: "export",
};

export default nextConfig;
