import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
		return [
			{
				source: '/api/create',
				destination: 'http://46.137.193.141:50000/employee',
			},
		]
	},
};

export default nextConfig;
