import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  dts: false,
  bundle: true,
  // 将所有依赖内联到单个 JS 文件，实现零依赖启动
  noExternal: ['mri', '@clack/prompts', '@clack/core', 'picocolors'],
  // banner 添加 shebang
  banner: {
    js: '#!/usr/bin/env node',
  },
});
