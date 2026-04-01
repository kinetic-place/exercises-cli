<p align="center">
  <a href="https://kinetic.place">
    <img src="https://kinetic.place/images/kinetic-logo-animated.gif" alt="Kinetic.place" width="400" />
  </a>
</p>

# 🏋️ exercises-cli

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/exercises-cli)](https://npmjs.com/package/exercises-cli)

**899+ fitness exercises in your terminal.** Search, filter, and export — completely offline, multilingual (EN/ES).

Also available as: [`exercisedb`](https://npmjs.com/package/exercisedb) · [`exercises-db`](https://npmjs.com/package/exercises-db) · [`fitkit`](https://npmjs.com/package/fitkit)

---

## Quick Start

```bash
# No install needed — just run
npx exercises-cli search "bench press"

# Or install globally
npm install -g exercises-cli
exercises search "squat"
```

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

### `get <id>` — Get exercise details

```bash
exercises get "Barbell Bench Press"
exercises get d586b5aa-c2f4-4cb5-8038-d10b03c3b763
```

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

## Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--locale` | `-l` | Language: `en` or `es` | `en` |
| `--format` | `-f` | Output: `table`, `json`, or `csv` | `table` |
| `--limit` | `-n` | Max results | `20` |
| `--muscle` | `-m` | Filter by muscle group (fuzzy) | — |
| `--equipment` | `-e` | Filter by equipment (fuzzy) | — |
| `--level` | `-d` | Filter by difficulty | — |
| `--category` | `-c` | Filter by category | — |
| `--force` | | Filter by force type | — |
| `--mechanics` | | Filter by mechanics | — |

## Fuzzy Matching

Muscle and equipment filters use **substring matching**, so you don't need to type exact names:

```bash
exercises list --muscle back        # → lower back, middle back, lats
exercises list --equipment bar      # → Barbell, Parallel Bars
exercises list --equipment band     # → Bands, Resistance Band
```

## Dataset

- **899 exercises** with step-by-step instructions
- **17 muscle groups** with primary/secondary/tertiary targeting
- **36 equipment types**
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

## Related

- [`@kinetic-place/exercises-json`](https://npmjs.com/package/@kinetic-place/exercises-json) — Raw JSON dataset
- [`@kinetic-place/exercises-db`](https://npmjs.com/package/@kinetic-place/exercises-db) — Database-ready format
- [`@kinetic-place/exercises-api`](https://github.com/kinetic-place/exercises-api) — Self-hostable REST API

## License

MIT © [Kinetic.place](https://kinetic.place)
