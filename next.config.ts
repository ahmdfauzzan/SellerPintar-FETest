/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.sellerpintar.com",
      },
      {
        protocol: "https",
        hostname: "gwbdrcbuwabtfbsegmej.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
