/**
 * Data loader — reads the dataset's JSON files next to the bundle (dist/data/<locale>/, or
 * src/data/ in dev), each the first time a command needs it.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Exercise, ExerciseGuide, MuscleGroup, Equipment, Locale } from './types.js';

const files = new Map<string, unknown>();

function read<T>(locale: Locale, file: string): T {
  const key = `${locale}/${file}`;
  if (!files.has(key)) {
    files.set(key, JSON.parse(readFileSync(join(__dirname, 'data', locale, file), 'utf8')));
  }
  return files.get(key) as T;
}

export function getExercises(locale: Locale): Exercise[] {
  return read<Exercise[]>(locale, 'exercises.json');
}

export function getMuscles(locale: Locale): MuscleGroup[] {
  return read<MuscleGroup[]>(locale, 'muscle_groups.json');
}

export function getEquipment(locale: Locale): Equipment[] {
  return read<Equipment[]>(locale, 'equipment.json');
}

// Guides are 5 MB a language: only the commands that show them read them.
const guides = new Map<Locale, Map<string, ExerciseGuide>>();

function getGuides(locale: Locale): Map<string, ExerciseGuide> {
  let byId = guides.get(locale);
  if (!byId) {
    const list = read<ExerciseGuide[]>(locale, 'guides.json');
    byId = new Map(list.map((guide) => [guide.exerciseId, guide]));
    guides.set(locale, byId);
  }
  return byId;
}

export function getGuide(locale: Locale, exerciseId: string): ExerciseGuide | undefined {
  return getGuides(locale).get(exerciseId);
}

export function getGuideCount(locale: Locale): number {
  return getGuides(locale).size;
}

/** The CLI's version, from package.json next to dist/ (or src/ in dev). */
export function getVersion(): string {
  return JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')).version;
}
