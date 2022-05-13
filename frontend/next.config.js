/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withTM = require("next-transpile-modules")([
  "hashconnect",
  "@hashgraph/sdk",
]);

module.exports = nextConfig;

// module.exports = withTM({});
module.exports = withTM({
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      // tls: false,
      // net: false,
      // dns: false,
      // framer: false,
    };

    return config;
  },
});
