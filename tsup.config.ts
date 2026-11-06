import { defineConfig } from 'tsup';

// Two bundles: the CLI, and the MCP server (with the MCP SDK, a dev dependency, bundled in).
// The dataset isn't bundled: scripts/copy-data.mjs puts it in dist/data/ after the build.
export default defineConfig({
  entry: ['src/cli.ts', 'src/mcp.ts'],
  format: ['cjs'],
  outDir: 'dist',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
