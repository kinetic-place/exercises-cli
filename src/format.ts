/**
 * Output formatting — table, JSON, and CSV.
 */

import Table from 'cli-table3';
import type { Exercise, MuscleGroup, Equipment, Format } from './types.js';

// ---------- Exercises ----------

export function formatExercises(exercises: Exercise[], format: Format): string {
  if (format === 'json') return JSON.stringify(exercises, null, 2);
  if (format === 'csv') return exercisesToCsv(exercises);
  return exercisesToTable(exercises);
}

function exercisesToTable(exercises: Exercise[]): string {
  if (exercises.length === 0) return '  No exercises found.\n';

  const table = new Table({
    head: ['Name', 'Level', 'Category', 'Force', 'Muscles', 'Equipment'],
    colWidths: [30, 14, 16, 8, 24, 18],
    wordWrap: true,
    style: { head: ['cyan'], border: ['gray'] },
  });

  for (const ex of exercises) {
    table.push([
      ex.name || '—',
      ex.difficultyLevel || '—',
      ex.category || '—',
      ex.forceType || '—',
      ex.muscleGroups.map((m) => `${m.name} (${m.type[0]})`).join(', ') || '—',
      ex.equipment.map((e) => e.name).join(', ') || '—',
    ]);
  }

  return table.toString() + '\n';
}

function exercisesToCsv(exercises: Exercise[]): string {
  const header = 'id,name,type,level,force,mechanics,category,muscles_primary,muscles_secondary,equipment';
  const rows = exercises.map((ex) => {
    const primary = ex.muscleGroups
      .filter((m) => m.type === 'primary')
      .map((m) => m.name)
      .join(';');
    const secondary = ex.muscleGroups
      .filter((m) => m.type !== 'primary')
      .map((m) => m.name)
      .join(';');
    const equip = ex.equipment.map((e) => e.name).join(';');

    return [
      ex.id,
      csvEscape(ex.name),
      ex.type,
      ex.difficultyLevel || '',
      ex.forceType || '',
      ex.mechanics || '',
      ex.category || '',
      csvEscape(primary),
      csvEscape(secondary),
      csvEscape(equip),
    ].join(',');
  });

  return [header, ...rows].join('\n') + '\n';
}

// ---------- Exercise detail ----------

export function formatExerciseDetail(ex: Exercise, format: Format): string {
  if (format === 'json') return JSON.stringify(ex, null, 2);

  const lines = [
    '',
    `  \x1b[1m${ex.name}\x1b[0m`,
    `  ID: ${ex.id}`,
    '',
    `  Level:      ${ex.difficultyLevel || '—'}`,
    `  Category:   ${ex.category || '—'}`,
    `  Force:      ${ex.forceType || '—'}`,
    `  Mechanics:  ${ex.mechanics || '—'}`,
    `  Type:       ${ex.type}`,
    '',
    `  \x1b[36mMuscle Groups:\x1b[0m`,
    ...ex.muscleGroups.map((m) => `    • ${m.name} (${m.type})`),
    '',
    `  \x1b[36mEquipment:\x1b[0m`,
    ...ex.equipment.map((e) => `    • ${e.name} [${e.type}]`),
    '',
  ];

  if (ex.instructions?.length) {
    lines.push(`  \x1b[36mInstructions:\x1b[0m`);
    ex.instructions.forEach((instr, i) => {
      lines.push(`    ${i + 1}. ${instr}`);
    });
    lines.push('');
  }

  return lines.join('\n') + '\n';
}

// ---------- Muscles ----------

export function formatMuscles(muscles: MuscleGroup[], format: Format): string {
  if (format === 'json') return JSON.stringify(muscles, null, 2);
  if (format === 'csv') {
    return ['id,slug,name', ...muscles.map((m) => `${m.id},${m.slug},${csvEscape(m.name)}`)].join('\n') + '\n';
  }

  const table = new Table({
    head: ['Slug', 'Name'],
    style: { head: ['cyan'], border: ['gray'] },
  });

  for (const m of muscles) {
    table.push([m.slug, m.name]);
  }

  return table.toString() + '\n';
}

// ---------- Equipment ----------

export function formatEquipment(equipment: Equipment[], format: Format): string {
  if (format === 'json') return JSON.stringify(equipment, null, 2);
  if (format === 'csv') {
    return [
      'id,name,type,usageType',
      ...equipment.map((e) => `${e.id},${csvEscape(e.name)},${e.type},${e.usageType || ''}`),
    ].join('\n') + '\n';
  }

  const table = new Table({
    head: ['Name', 'Type', 'Usage'],
    style: { head: ['cyan'], border: ['gray'] },
  });

  for (const e of equipment) {
    table.push([e.name, e.type, e.usageType || '—']);
  }

  return table.toString() + '\n';
}

// ---------- Stats ----------

export function formatStats(data: {
  exercises: number;
  muscles: number;
  equipment: number;
  categories: string[];
  levels: string[];
  locales: string[];
}, format: Format): string {
  if (format === 'json') return JSON.stringify(data, null, 2);

  return [
    '',
    '  \x1b[1m🏋️ Kinetic Exercises Dataset\x1b[0m',
    '',
    `  Exercises:      \x1b[36m${data.exercises}\x1b[0m`,
    `  Muscle Groups:  \x1b[36m${data.muscles}\x1b[0m`,
    `  Equipment:      \x1b[36m${data.equipment}\x1b[0m`,
    `  Categories:     \x1b[36m${data.categories.join(', ')}\x1b[0m`,
    `  Levels:         \x1b[36m${data.levels.join(', ')}\x1b[0m`,
    `  Locales:        \x1b[36m${data.locales.join(', ')}\x1b[0m`,
    '',
    '  \x1b[2mhttps://kinetic.place\x1b[0m',
    '',
  ].join('\n') + '\n';
}

// ---------- Helpers ----------

export function formatCategories(categories: string[], format: Format): string {
  if (format === 'json') return JSON.stringify(categories, null, 2);
  if (format === 'csv') return categories.join('\n') + '\n';
  return categories.map((c) => `  • ${c}`).join('\n') + '\n';
}

function csvEscape(value: string): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
