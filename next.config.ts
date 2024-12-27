import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites(){
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://46.137.193.141:50000/:path*",
      },
    ]
  }
};

export default nextConfig;
