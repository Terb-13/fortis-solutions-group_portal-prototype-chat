import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/explorer", destination: "/products-services", permanent: false },
      { source: "/proposal", destination: "/resources/brief", permanent: false },
      { source: "/thank-you", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
