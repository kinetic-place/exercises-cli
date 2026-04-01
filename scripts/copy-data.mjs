/**
 * Copy exercise data from sibling packages into src/data/ for bundling.
 */
import { cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dbPkg = resolve(root, '..', 'exercises-db');

for (const locale of ['en', 'es']) {
  const dest = resolve(root, 'src', 'data', locale);
  mkdirSync(dest, { recursive: true });

  for (const file of ['exercises.json', 'muscle_groups.json', 'equipment.json']) {
    cpSync(resolve(dbPkg, locale, file), resolve(dest, file));
  }
}

console.log('✅ Data copied from exercises-db into src/data/');
