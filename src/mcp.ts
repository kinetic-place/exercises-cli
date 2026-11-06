/**
 * Kinetic Exercises MCP server: the dataset as tools an AI assistant can call, over stdio.
 * Started by `npx exercises-mcp` or `exercises mcp`. Everything is read from the files in
 * dist/data, offline; nothing writes to stdout but the protocol.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getEquipment, getExercises, getGuide, getMuscles, getVersion } from './data.js';
import { filterExercises, searchExercises } from './filter.js';
import type { Exercise, Locale } from './types.js';

const server = new McpServer(
  { name: 'kinetic-exercises', title: 'Kinetic Exercises', version: getVersion() },
  {
    instructions:
      "Kinetic's open exercise dataset: 908 exercises in English and Spanish, 814 of them with a " +
      'step-by-step guide that links to alternatives and to easier and harder variations, and most ' +
      'with a YouTube video. Use list_filters for the values search_exercises accepts, ' +
      'search_exercises to find exercises, and get_exercise for one exercise in full. Guides are ' +
      'general guidance, not medical advice.',
  }
);

const language = z
  .enum(['en', 'es'])
  .default('en')
  .describe('Language of the names and guides: en or es');

const readOnly = { readOnlyHint: true, openWorldHint: false };

const json = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

/** What a search result shows: enough to pick one, without the guide. */
function summary(ex: Exercise, locale: Locale) {
  return {
    id: ex.id,
    slug: ex.slug,
    name: ex.name,
    level: ex.difficultyLevel,
    category: ex.category,
    force: ex.forceType,
    mechanics: ex.mechanics,
    primaryMuscles: ex.muscleGroups.filter((m) => m.type === 'primary').map((m) => m.name),
    otherMuscles: ex.muscleGroups.filter((m) => m.type !== 'primary').map((m) => m.name),
    equipment: ex.equipment.map((e) => e.name),
    hasGuide: getGuide(locale, ex.id) !== undefined,
    hasVideo: ex.youtube !== null,
  };
}

server.registerTool(
  'search_exercises',
  {
    title: 'Search exercises',
    description:
      'Find exercises by name and filters. Every filter is optional and list_filters gives the ' +
      'values each one takes. Returns short summaries; get_exercise has the full exercise and guide.',
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe('Words in the exercise name, in any order, e.g. "squat" or "incline press"'),
      muscle: z
        .string()
        .optional()
        .describe('Muscle group slug or name, e.g. "chest", "quadriceps", "lower-back"'),
      equipment: z
        .string()
        .optional()
        .describe('Equipment name or family, e.g. "dumbbell", "bench", "bands", "bodyweight"'),
      level: z.string().optional().describe('Difficulty, e.g. "beginner" or "intermediate"'),
      category: z.string().optional().describe('Category, e.g. "strength" or "stretching"'),
      force: z.string().optional().describe('Force type, e.g. "push", "pull" or "static"'),
      mechanics: z.string().optional().describe('"compound" or "isolation"'),
      withGuide: z.boolean().optional().describe('Only exercises that have a guide'),
      limit: z.number().int().min(1).max(100).default(20).describe('Most results to return'),
      language,
    },
    annotations: readOnly,
  },
  async ({ query, withGuide, limit, language, ...filters }) => {
    let results = getExercises(language);
    if (query?.trim()) results = searchExercises(results, query);
    results = filterExercises(results, filters);
    if (withGuide) results = results.filter((ex) => getGuide(language, ex.id) !== undefined);
    return json({
      total: results.length,
      exercises: results.slice(0, limit).map((ex) => summary(ex, language)),
    });
  }
);

server.registerTool(
  'get_exercise',
  {
    title: 'Get an exercise',
    description:
      'One exercise in full: muscles, equipment, a YouTube video when it has one, and its guide ' +
      '(summary, setup, steps, form cues, breathing, common mistakes, programming and safety ' +
      'notes, FAQ, and alternatives, easier and harder variations, each with its ID and why it fits).',
    inputSchema: {
      exercise: z.string().describe('The exercise ID, slug (e.g. "barbell-squat") or exact name'),
      language,
    },
    annotations: readOnly,
  },
  async ({ exercise, language }) => {
    const exercises = getExercises(language);
    const wanted = exercise.trim();
    const lower = wanted.toLowerCase();
    const ex = exercises.find(
      (e) => e.id === wanted || e.slug === lower || e.name?.toLowerCase() === lower
    );
    if (!ex) {
      const close = searchExercises(exercises, wanted)
        .slice(0, 5)
        .map((e) => ({ id: e.id, slug: e.slug, name: e.name }));
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text: close.length
              ? `No exercise "${wanted}". Close matches: ${JSON.stringify(close)}`
              : `No exercise "${wanted}". Try search_exercises.`,
          },
        ],
      };
    }
    const guide = getGuide(language, ex.id) ?? null;
    // The older instructions only when there's no guide: the guide's steps replace them.
    const { instructions, ...rest } = ex;
    return json(guide ? { ...rest, guide } : { ...rest, instructions, guide });
  }
);

server.registerTool(
  'list_filters',
  {
    title: 'List filter values',
    description:
      'The values search_exercises filters take: muscle groups, equipment (with its family), ' +
      'categories, difficulty levels, force types and mechanics.',
    inputSchema: { language },
    annotations: readOnly,
  },
  async ({ language }) => {
    const exercises = getExercises(language);
    const distinct = (pick: (ex: Exercise) => string | null) =>
      [...new Set(exercises.map(pick).filter((v): v is string => !!v))].sort();
    return json({
      muscles: getMuscles(language).map(({ slug, name }) => ({ slug, name })),
      equipment: getEquipment(language).map(({ name, family }) => ({ name, family })),
      categories: distinct((ex) => ex.category),
      levels: distinct((ex) => ex.difficultyLevel),
      forces: distinct((ex) => ex.forceType),
      mechanics: distinct((ex) => ex.mechanics),
    });
  }
);

server.connect(new StdioServerTransport()).catch((error) => {
  console.error(error);
  process.exit(1);
});
