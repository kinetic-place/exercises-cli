<p align="center">
  <a href="https://kinetic.place">
    <img src="https://kinetic.place/images/kinetic-logo-animated.gif" alt="Kinetic.place" width="400" />
  </a>
</p>

# 🏋️ exercises-cli

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/exercises-cli)](https://npmjs.com/package/exercises-cli)

**908 fitness exercises in your terminal, with step-by-step guides.** Search, filter, and export — completely offline, multilingual (EN/ES).

It's also an MCP server, so Claude, Cursor, Codex and other AI assistants can search the exercises and read their guides.

Also available as: [`exercisedb`](https://npmjs.com/package/exercisedb) · [`exercises-db`](https://npmjs.com/package/exercises-db) · [`fitkit`](https://npmjs.com/package/fitkit) · [`exercises-mcp`](https://npmjs.com/package/exercises-mcp)

---

## Quick Start

```bash
# No install needed — just run
npx exercises-cli search "bench press"

# Or install globally
npm install -g exercises-cli
exercises search "squat"
```

## MCP server

The same data as tools for an AI assistant, over stdio. Everything runs on your machine and needs no account or key.

In Claude Desktop, Cursor, Windsurf or any client that takes a JSON config:

```json
{
  "mcpServers": {
    "exercises": {
      "command": "npx",
      "args": ["-y", "exercises-mcp"]
    }
  }
}
```

In Claude Code:

```bash
claude mcp add exercises -- npx -y exercises-mcp
```

If you installed the CLI globally, `exercises mcp` starts the same server.

| Tool               | What it does                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search_exercises` | Finds exercises by name and by muscle, equipment, level, category, force and mechanics, in English or Spanish. Returns short summaries.                            |
| `get_exercise`     | One exercise by ID, slug or name: muscles, equipment, its YouTube video and its guide, with alternatives and easier and harder variations. Suggests close matches. |
| `list_filters`     | The values each search filter takes.                                                                                                                               |

Try asking your assistant for "a beginner leg day with only dumbbells, with a video for each exercise", or "what can I do instead of barbell squats with a sore back?"

## Commands

### `search <query>` — Search by name or instructions

```bash
exercises search "bench press"
exercises search "curl" --muscle biceps
exercises search "sentadilla" --locale es
```

### `list` — List exercises with filters

```bash
exercises list --muscle chest
exercises list --muscle chest --equipment dumbbell --level beginner
exercises list --category cardio --limit 10
exercises list --force pull --mechanics compound
```

### `get <id|slug|name>` — Get exercise details and its guide

```bash
exercises get "Barbell Bench Press"
exercises get barbell-squat
exercises get d586b5aa-c2f4-4cb5-8038-d10b03c3b763
exercises --locale es get barbell-squat
```

Shows the exercise, a YouTube video of it (906 of the 908 have one) and, for 814, its guide: summary, setup, steps, form cues, breathing, common mistakes, programming and safety notes, and alternatives, easier and harder variations. `--format json` adds the whole guide (FAQ included) as `guide`.

```
  Video:      Best Squat Tutorial Ever Made (Davis Diley)
              https://www.youtube.com/watch?v=MLoZuAkIyZI
  ...

  Steps:
    1. Break at the hips and knees at the same time, keeping the bar over the middle of your foot.
    2. Lower your hips down and back as if sitting into a chair behind you.
    ...

  Alternatives:
    • Dumbbell Squat — Trains the same movement pattern with dumbbells instead of a barbell, useful when a rack isn't available.
    • Leg Press — Loads the quads through a similar range using a machine, a useful option when your back needs a break from spinal loading.
```

Guides are general guidance, not medical advice.

### `muscles` — List all muscle groups

```bash
exercises muscles
exercises muscles --format json
```

### `equipment` — List all equipment

```bash
exercises equipment
exercises equipment --format csv
```

### `categories` — List categories

```bash
exercises categories
```

### `stats` — Dataset statistics

```bash
exercises stats
```

### `export` — Export to JSON or CSV

```bash
# Export all chest exercises to CSV
exercises export --muscle chest --format csv > chest_exercises.csv

# Export everything as JSON
exercises export --format json > all_exercises.json

# Export beginner dumbbell exercises
exercises export --level beginner --equipment dumbbell --format json
```

CSV has one row per exercise with its muscles, equipment and `youtube_url`; JSON has every field.

### `mcp` — Run the MCP server

```bash
exercises mcp
```

Starts the [MCP server](#mcp-server) on stdio. Your AI client runs this command; you don't run it by hand.

## Options

| Flag          | Short | Description                       | Default |
| ------------- | ----- | --------------------------------- | ------- |
| `--locale`    | `-l`  | Language: `en` or `es`            | `en`    |
| `--format`    | `-f`  | Output: `table`, `json`, or `csv` | `table` |
| `--limit`     | `-n`  | Max results                       | `20`    |
| `--muscle`    | `-m`  | Filter by muscle group (fuzzy)    | —       |
| `--equipment` | `-e`  | Filter by equipment (fuzzy)       | —       |
| `--level`     | `-d`  | Filter by difficulty              | —       |
| `--category`  | `-c`  | Filter by category                | —       |
| `--force`     |       | Filter by force type              | —       |
| `--mechanics` |       | Filter by mechanics               | —       |

## Fuzzy Matching

Muscle and equipment filters use **substring matching**, so you don't need to type exact names:

```bash
exercises list --muscle back        # → lower back, middle back, lats
exercises list --equipment bar      # → Barbell, Parallel Bars
exercises list --equipment band     # → Bands, Resistance Band
```

## Dataset

- **908 exercises**, 814 of them with a step-by-step guide and alternatives
- **906 YouTube videos**, with each video's title, channel and thumbnail
- **17 muscle groups** with primary/secondary/tertiary targeting
- **44 equipment types**
- **7 categories**: strength, cardio, stretching, plyometrics, powerlifting, olympicWeightlifting, strongman
- **2 locales**: English (en) and Spanish (es)

All data is **bundled in the package** — no internet connection required.

## Also Available As

This package is published under multiple names for convenience:

```bash
npx exercises-cli search "squat"
npx exercisedb search "squat"
npx exercises-db search "squat"
npx fitkit search "squat"
```

`exercises-mcp` runs the MCP server: `npx exercises-mcp`.

## Related

- [`@kinetic-place/exercises-json`](https://npmjs.com/package/@kinetic-place/exercises-json) — Raw JSON dataset
- [`@kinetic-place/exercises-db`](https://npmjs.com/package/@kinetic-place/exercises-db) — Database-ready format
- [`@kinetic-place/exercises-api`](https://github.com/kinetic-place/exercises-api) — Self-hostable REST API

## 🚀 Building a Fitness App?

This dataset is part of [**Kinetic.place**](https://kinetic.place) — the open platform for developers and fitness creators. Whether you're building a workout tracker, a coaching app, or creating fitness content, Kinetic provides the data, APIs, and tools to ship faster.

👉 **[kinetic.place](https://kinetic.place)** — Exercises, APIs, and content for fitness builders.

## License

MIT © [Kinetic.place](https://kinetic.place)
