import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin tracing to the reference app root. Without this, Next.js picks the
  // monorepo root (where the root lockfile lives) and emits a "multiple
  // lockfiles" warning. Our reference app is self-contained at this level.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
