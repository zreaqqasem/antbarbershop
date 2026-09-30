import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isPages ? "/antbarbershop" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
