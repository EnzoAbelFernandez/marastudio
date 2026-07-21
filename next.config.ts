import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Turbopack: Import GLSL shaders as raw strings ──
  turbopack: {
    rules: {
      '*.vert': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.frag': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.glsl': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  // ── Webpack fallback for production builds if needed ──
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(vert|frag|glsl)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
