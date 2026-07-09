import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  dts: false,
  bundle: true,
  // Bundle all dependencies into a single JS file for zero-dependency startup
  noExternal: ['mri', '@clack/prompts', '@clack/core', 'picocolors'],
  // Add shebang for CLI
  banner: {
    js: '#!/usr/bin/env node',
  },
});
