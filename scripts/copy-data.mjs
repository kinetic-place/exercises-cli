/**
 * Copy the dataset from exercises-db next to the code that reads it: dist/data/ after tsup
 * (--dist), or src/data/ for `yarn dev`. The CLI and the MCP server read these files at runtime,
 * so both bundles stay small and share one copy.
 */
import { cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dbPkg = resolve(root, '..', 'exercises-db');

const dist = process.argv.includes('--dist');
const files = ['exercises.json', 'muscle_groups.json', 'equipment.json', 'guides.json'];

for (const locale of ['en', 'es']) {
  const dest = resolve(root, dist ? 'dist' : 'src', 'data', locale);
  mkdirSync(dest, { recursive: true });

  for (const file of files) {
    cpSync(resolve(dbPkg, locale, file), resolve(dest, file));
  }
}

console.log(`✅ Data copied from exercises-db into ${dist ? 'dist' : 'src'}/data/`);
