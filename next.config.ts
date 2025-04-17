import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    `9003-idx-studio-1744855926801.cluster-rhptpnrfenhe4qarq36djxjqmg.cloudworkstations.dev`,
  ],
};

export default nextConfig;
