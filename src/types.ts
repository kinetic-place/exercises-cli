/**
 * Type definitions for exercise data.
 */

export interface Exercise {
  id: string;
  name: string;
  type: string;
  difficultyLevel: string | null;
  forceType: string | null;
  mechanics: string | null;
  category: string | null;
  instructions: string[];
  muscleGroups: MuscleGroupRef[];
  equipment: EquipmentRef[];
}

export interface MuscleGroupRef {
  id: string;
  slug: string;
  name: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

export interface EquipmentRef {
  id: string;
  name: string;
  type: string;
  usageType: string | null;
  numItems: number | null;
}

export interface MuscleGroup {
  id: string;
  slug: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  usageType: string;
}

export type Locale = 'en' | 'es';
export type Format = 'table' | 'json' | 'csv';

export interface GlobalOptions {
  locale: Locale;
  format: Format;
  limit: number;
}

export interface FilterOptions {
  muscle?: string;
  equipment?: string;
  level?: string;
  category?: string;
  force?: string;
  mechanics?: string;
}
