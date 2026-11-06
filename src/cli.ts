/**
 * Kinetic Exercises CLI — main entry point.
 *
 * 908 fitness exercises with step-by-step guides, searchable from your terminal, offline-ready.
 */

import { Command } from 'commander';
import { join } from 'path';
import type { Locale, Format, FilterOptions } from './types.js';
import {
  getExercises,
  getMuscles,
  getEquipment,
  getGuide,
  getGuideCount,
  getVersion,
} from './data.js';
import { searchExercises, filterExercises } from './filter.js';
import {
  formatExercises,
  formatExerciseDetail,
  formatMuscles,
  formatEquipment,
  formatCategories,
  formatStats,
} from './format.js';

const program = new Command();

program
  .name('exercises')
  .description(
    '🏋️ 908 fitness exercises in your terminal — search, filter, and export. Offline-ready.\n' +
      '   Run `exercises mcp` to give them to an AI assistant.'
  )
  .version(getVersion())
  .option('-l, --locale <locale>', 'Language: en | es', 'en')
  .option('-f, --format <format>', 'Output: table | json | csv', 'table');

// ---------- search ----------

program
  .command('search <query>')
  .description('Search exercises by name or instructions')
  .option('-m, --muscle <muscle>', 'Filter by muscle group')
  .option('-e, --equipment <equipment>', 'Filter by equipment')
  .option('-d, --level <level>', 'Filter by difficulty')
  .option('-c, --category <category>', 'Filter by category')
  .option('--force <force>', 'Filter by force type')
  .option('--mechanics <mechanics>', 'Filter by mechanics')
  .option('-n, --limit <n>', 'Max results', '20')
  .action((query: string, opts) => {
    const { locale, format } = globals();
    const exercises = getExercises(locale);

    let results = searchExercises(exercises, query);
    results = filterExercises(results, extractFilters(opts));

    const limit = parseInt(opts.limit, 10) || 20;
    const limited = results.slice(0, limit);

    console.log(
      `\n  Found ${results.length} results for "${query}"${results.length > limit ? ` (showing ${limit})` : ''}\n`
    );
    process.stdout.write(formatExercises(limited, format));
  });

// ---------- list ----------

program
  .command('list')
  .description('List exercises with filters')
  .option('-m, --muscle <muscle>', 'Filter by muscle group')
  .option('-e, --equipment <equipment>', 'Filter by equipment')
  .option('-d, --level <level>', 'Filter by difficulty')
  .option('-c, --category <category>', 'Filter by category')
  .option('--force <force>', 'Filter by force type')
  .option('--mechanics <mechanics>', 'Filter by mechanics')
  .option('-n, --limit <n>', 'Max results', '20')
  .action((opts) => {
    const { locale, format } = globals();
    let results = getExercises(locale);

    results = filterExercises(results, extractFilters(opts));

    const limit = parseInt(opts.limit, 10) || 20;
    const limited = results.slice(0, limit);

    console.log(
      `\n  ${results.length} exercises${results.length > limit ? ` (showing ${limit})` : ''}\n`
    );
    process.stdout.write(formatExercises(limited, format));
  });

// ---------- get ----------

program
  .command('get <id>')
  .description('Get a single exercise and its guide by ID, slug, or name')
  .action((id: string) => {
    const { locale, format } = globals();
    const exercises = getExercises(locale);
    const ex = exercises.find(
      (e) => e.id === id || e.slug === id || e.name?.toLowerCase() === id.toLowerCase()
    );

    if (!ex) {
      console.error(`\n  Exercise not found: "${id}"\n`);
      process.exit(1);
    }

    process.stdout.write(formatExerciseDetail(ex, getGuide(locale, ex.id), format));
  });

// ---------- muscles ----------

program
  .command('muscles')
  .description('List all muscle groups')
  .action(() => {
    const { locale, format } = globals();
    const muscles = getMuscles(locale);
    process.stdout.write(formatMuscles(muscles, format));
  });

// ---------- equipment ----------

program
  .command('equipment')
  .description('List all equipment types')
  .action(() => {
    const { locale, format } = globals();
    const equipment = getEquipment(locale);
    process.stdout.write(formatEquipment(equipment, format));
  });

// ---------- categories ----------

program
  .command('categories')
  .description('List all exercise categories')
  .action(() => {
    const { locale, format } = globals();
    const exercises = getExercises(locale);
    const cats = [...new Set(exercises.map((e) => e.category).filter(Boolean))] as string[];
    cats.sort();
    process.stdout.write(formatCategories(cats, format));
  });

// ---------- stats ----------

program
  .command('stats')
  .description('Dataset statistics')
  .action(() => {
    const { locale, format } = globals();
    const exercises = getExercises(locale);
    const muscles = getMuscles(locale);
    const equipment = getEquipment(locale);

    const categories = [...new Set(exercises.map((e) => e.category).filter(Boolean))] as string[];
    const levels = [
      ...new Set(exercises.map((e) => e.difficultyLevel).filter(Boolean)),
    ] as string[];
    categories.sort();
    levels.sort();

    process.stdout.write(
      formatStats(
        {
          exercises: exercises.length,
          guides: getGuideCount(locale),
          muscles: muscles.length,
          equipment: equipment.length,
          categories,
          levels,
          locales: ['en', 'es'],
        },
        format
      )
    );
  });

// ---------- export ----------

program
  .command('export')
  .description('Export filtered results (defaults to no limit)')
  .option('-m, --muscle <muscle>', 'Filter by muscle group')
  .option('-e, --equipment <equipment>', 'Filter by equipment')
  .option('-d, --level <level>', 'Filter by difficulty')
  .option('-c, --category <category>', 'Filter by category')
  .option('--force <force>', 'Filter by force type')
  .option('--mechanics <mechanics>', 'Filter by mechanics')
  .option('-n, --limit <n>', 'Max results (default: all)')
  .action((opts) => {
    const { locale } = globals();
    // Default export format to JSON if not specified
    const format = (program.opts().format || 'json') as Format;
    let results = getExercises(locale);

    results = filterExercises(results, extractFilters(opts));

    const limit = opts.limit ? parseInt(opts.limit, 10) : results.length;
    const limited = results.slice(0, limit);

    process.stdout.write(formatExercises(limited, format));
  });

// ---------- mcp ----------

program
  .command('mcp')
  .description('Run the MCP server on stdio, for Claude, Cursor, Codex and other AI assistants')
  .action(() => {
    // Its own bundle next to this one, so the MCP SDK loads only for this command.
    require(join(__dirname, 'mcp.js'));
  });

// ---------- Helpers ----------

function globals(): { locale: Locale; format: Format } {
  const opts = program.opts();
  return {
    locale: (['en', 'es'].includes(opts.locale) ? opts.locale : 'en') as Locale,
    format: (['table', 'json', 'csv'].includes(opts.format) ? opts.format : 'table') as Format,
  };
}

function extractFilters(opts: any): FilterOptions {
  return {
    muscle: opts.muscle,
    equipment: opts.equipment,
    level: opts.level,
    category: opts.category,
    force: opts.force,
    mechanics: opts.mechanics,
  };
}

// ---------- Run ----------

program.parse();
