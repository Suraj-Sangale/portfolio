/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w7.pngwing.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icon.icepanel.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uxwing.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
