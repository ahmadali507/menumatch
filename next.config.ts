import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        // match all images from a specific domain
        protocol: "https",
        hostname: "images.unsplash.com",
        // the path in the URL that the image is located under
      }
    ]
  }
};

export default nextConfig;
