/**
 * Filtering engine — fuzzy search and field filters.
 */

import type { Exercise, FilterOptions } from './types.js';

/**
 * Fuzzy search — every word of the query in the name or slug, in any order ("squat barbell"
 * finds Barbell Squat), or the whole query in the instructions. Name matches come first, the
 * shortest names first, so "squat" puts Squat ahead of One Leg Barbell Squat.
 */
export function searchExercises(exercises: Exercise[], query: string): Exercise[] {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);
  const ranked: { ex: Exercise; rank: number }[] = [];
  for (const ex of exercises) {
    const title = `${ex.name ?? ''} ${ex.slug ?? ''}`.toLowerCase();
    if (words.every((word) => title.includes(word))) {
      ranked.push({ ex, rank: ex.name?.length ?? 0 });
    } else if (ex.instructions?.some((i) => i.toLowerCase().includes(q))) {
      ranked.push({ ex, rank: 1000 });
    }
  }
  return ranked.sort((a, b) => a.rank - b.rank).map(({ ex }) => ex);
}

/**
 * Apply all active filters. Muscle and equipment use fuzzy substring matching (equipment on its
 * name or family, so "bench" finds every kind of bench).
 * Level, category, force, mechanics use exact match.
 */
export function filterExercises(exercises: Exercise[], filters: FilterOptions): Exercise[] {
  let result = exercises;

  if (filters.muscle) {
    const q = filters.muscle.toLowerCase();
    result = result.filter((ex) =>
      ex.muscleGroups.some(
        (mg) => mg.slug.toLowerCase().includes(q) || mg.name.toLowerCase().includes(q)
      )
    );
  }

  if (filters.equipment) {
    const q = filters.equipment.toLowerCase();
    result = result.filter((ex) =>
      ex.equipment.some(
        (eq) => eq.name.toLowerCase().includes(q) || eq.family?.toLowerCase().includes(q)
      )
    );
  }

  if (filters.level) {
    const q = filters.level.toLowerCase();
    result = result.filter((ex) => ex.difficultyLevel?.toLowerCase() === q);
  }

  if (filters.category) {
    const q = filters.category.toLowerCase();
    result = result.filter((ex) => ex.category?.toLowerCase() === q);
  }

  if (filters.force) {
    const q = filters.force.toLowerCase();
    result = result.filter((ex) => ex.forceType?.toLowerCase() === q);
  }

  if (filters.mechanics) {
    const q = filters.mechanics.toLowerCase();
    result = result.filter((ex) => ex.mechanics?.toLowerCase() === q);
  }

  return result;
}
