import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Chỉ áp dụng cho HTTPS
        hostname: '**', // Cho phép tất cả hostname
      },
      {
        protocol: 'http', // Hỗ trợ HTTP nếu cần (không khuyến khích)
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;