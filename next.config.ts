import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "reloraapp.com",
          },
        ],
        destination: "https://www.reloraapp.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
