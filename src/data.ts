/**
 * Data loader — reads bundled JSON data based on locale.
 */

import type { Exercise, MuscleGroup, Equipment, Locale } from './types.js';

// English
import exercisesEn from './data/en/exercises.json';
import musclesEn from './data/en/muscle_groups.json';
import equipmentEn from './data/en/equipment.json';

// Spanish
import exercisesEs from './data/es/exercises.json';
import musclesEs from './data/es/muscle_groups.json';
import equipmentEs from './data/es/equipment.json';

const datasets = {
  en: {
    exercises: exercisesEn as Exercise[],
    muscles: musclesEn as MuscleGroup[],
    equipment: equipmentEn as Equipment[],
  },
  es: {
    exercises: exercisesEs as Exercise[],
    muscles: musclesEs as MuscleGroup[],
    equipment: equipmentEs as Equipment[],
  },
};

export function getExercises(locale: Locale): Exercise[] {
  return datasets[locale].exercises;
}

export function getMuscles(locale: Locale): MuscleGroup[] {
  return datasets[locale].muscles;
}

export function getEquipment(locale: Locale): Equipment[] {
  return datasets[locale].equipment;
}
