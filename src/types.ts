/**
 * Type definitions for exercise data.
 */

export interface Exercise {
  id: string;
  name: string;
  slug: string | null;
  type: string;
  difficultyLevel: string | null;
  forceType: string | null;
  mechanics: string | null;
  category: string | null;
  instructions: string[];
  muscleGroups: MuscleGroupRef[];
  equipment: EquipmentRef[];
  youtube: YouTubeVideo | null;
}

/** A YouTube video of the exercise, with the title, channel and thumbnail YouTube gives for it. */
export interface YouTubeVideo {
  url: string;
  videoId: string;
  title: string;
  channel: string;
  channelUrl: string;
  thumbnailUrl: string;
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
  family: string | null;
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
  family: string | null;
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

/** Another exercise a guide points to, and why it fits. */
export interface ExerciseLink {
  exerciseId: string;
  name: string | null;
  reason: string;
}

/** How to do one exercise (`<locale>/guides.json`). */
export interface ExerciseGuide {
  exerciseId: string;
  summary: string;
  whyItWorks: string;
  setup: string[];
  execution: string[];
  formCues: string[];
  breathing: string | null;
  commonMistakes: { mistake: string; correction: string }[];
  programmingNotes: string[];
  safetyNotes: string[];
  faq: { question: string; answer: string }[];
  alternatives: ExerciseLink[];
  easierVariations: ExerciseLink[];
  harderVariations: ExerciseLink[];
}
