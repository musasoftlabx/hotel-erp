import type { NextConfig } from "next";
import dayjs from "dayjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  generateBuildId: async () => `${dayjs().format("DDMMYYYY-HH")}`,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
        port: "",
        pathname: "/ipfs/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
