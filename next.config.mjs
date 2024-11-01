/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "disciplined-marten-363.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
