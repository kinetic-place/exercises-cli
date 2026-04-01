import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  outDir: 'dist',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
