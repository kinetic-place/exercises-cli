/**
 * Filtering engine — fuzzy search and field filters.
 */

import type { Exercise, FilterOptions } from './types.js';

/**
 * Fuzzy search — case-insensitive substring match on name and instructions.
 */
export function searchExercises(exercises: Exercise[], query: string): Exercise[] {
  const q = query.toLowerCase();
  return exercises.filter((ex) => {
    if (ex.name?.toLowerCase().includes(q)) return true;
    if (ex.instructions?.some((i) => i.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Apply all active filters. Muscle and equipment use fuzzy substring matching.
 * Level, category, force, mechanics use exact match.
 */
export function filterExercises(exercises: Exercise[], filters: FilterOptions): Exercise[] {
  let result = exercises;

  if (filters.muscle) {
    const q = filters.muscle.toLowerCase();
    result = result.filter((ex) =>
      ex.muscleGroups.some(
        (mg) =>
          mg.slug.toLowerCase().includes(q) ||
          mg.name.toLowerCase().includes(q)
      )
    );
  }

  if (filters.equipment) {
    const q = filters.equipment.toLowerCase();
    result = result.filter((ex) =>
      ex.equipment.some((eq) => eq.name.toLowerCase().includes(q))
    );
  }

  if (filters.level) {
    const q = filters.level.toLowerCase();
    result = result.filter(
      (ex) => ex.difficultyLevel?.toLowerCase() === q
    );
  }

  if (filters.category) {
    const q = filters.category.toLowerCase();
    result = result.filter(
      (ex) => ex.category?.toLowerCase() === q
    );
  }

  if (filters.force) {
    const q = filters.force.toLowerCase();
    result = result.filter(
      (ex) => ex.forceType?.toLowerCase() === q
    );
  }

  if (filters.mechanics) {
    const q = filters.mechanics.toLowerCase();
    result = result.filter(
      (ex) => ex.mechanics?.toLowerCase() === q
    );
  }

  return result;
}
