# OhMyDashboard

Agent monitoring dashboard for [OpenCode](https://opencode.ai) and [OhMyOpenCode](https://github.com/ohmyopencode).

See which agents are running, how many tokens you've burned, and what your sessions look like — all in one place.

![OhMyDashboard](screenshot.png)

## Quick Start

```bash
bunx @radenadri/ohmydashboard@latest
```

Opens at [http://127.0.0.1:51234](http://127.0.0.1:51234). That's it.

### Options

```bash
bunx @radenadri/ohmydashboard --port 8080       # custom port
bunx @radenadri/ohmydashboard --host 0.0.0.0    # expose to network
```

## Features

- **5 Summary Cards** — Total sessions, messages, tokens, cost, and active agents at a glance
- **Active Agents** — Live view of running agents with model, directory, message count, and elapsed time
- **Agent Leaderboard** — Who's doing all the work (ranked by message count)
- **Cost History** — 14-day area chart of estimated costs
- **Model Distribution** — Donut chart showing which models get the most use
- **Activity Heatmap** — GitHub-style 7-day heatmap (hour x day-of-week)
- **Session Table** — Full session list with TanStack Table: sorting, search, agent filter, pagination, expandable rows
- **Session Archive** — Archive/unarchive sessions to declutter your view. Syncs with OpenCode's native archive status (`time_archived`). Archived sessions are hidden by default with a toggle to show them, and displayed with a dimmed style
- **Session Management** — Delete sessions with confirmation dialog
- **Enhanced Search** — Search sessions by title, project path, or agent name
- **Dynamic Versions** — Footer displays actual OpenCode and OhMyOpenCode versions
- **Date Filtering** — Today / Week / Month / All toggle
- **Auto-refresh** — Dashboard updates every 15 seconds
- **Dark Mode** — Because obviously

## How It Works

OhMyDashboard reads OpenCode's SQLite database directly:

```
~/.local/share/opencode/opencode.db
```

The database contains tables for sessions, messages, parts, and projects. Using Bun's built-in `bun:sqlite` module for fast, zero-dependency data access.

> **Note:** Older versions of OpenCode used JSON file storage. This dashboard now exclusively supports the SQLite format used by current OpenCode versions.

## Development

```bash
git clone <repo>
cd ohmydashboard
npm install
npm run dev
```

This starts two processes:
- **Vite** dev server on `:5174` (frontend with HMR)
- **Hono** API server on `:3456` (backend)

### Build

```bash
npm run build    # TypeScript check + Vite build
```

### Production (local)

```bash
bun bin/cli.ts   # Single server on :51234
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Tailwind CSS v4, Recharts, TanStack Table, Lucide Icons |
| Backend | Hono (serves API + static SPA) |
| Runtime | Bun (CLI + server) |
| Build | Vite 7, TypeScript 5.9 |

## Project Structure

```
ohmydashboard/
├── bin/cli.ts                  # CLI entry (bunx ohmydashboard)
├── server/
│   ├── index.ts                # Hono app + dev server
│   ├── opencode-reader.ts      # Reads OpenCode SQLite database
│   └── cache.ts                # TTL cache (30s)
├── src/
│   ├── App.tsx                 # Dashboard layout
│   ├── components/
│   │   ├── Logo.tsx            # SVG logo
│   │   └── dashboard/          # All dashboard panels
│   ├── hooks/
│   │   └── useDashboardData.ts # Data fetching + auto-refresh
│   └── types/opencode.ts       # TypeScript interfaces
├── public/favicon.svg
└── package.json
```

## Requirements

- **Bun** >= 1.1.0
- **OpenCode** installed and used (needs `~/.local/share/opencode/opencode.db` to exist)

## Quick Diagnostics (if `bunx` fails)

If you see module resolution errors (example: `Cannot find module '@hono/node-server'`), run:

```bash
# inspect what would be published
npm pack --dry-run

# verify runtime dependency classification
npm run verify:runtime-imports

# verify packed artifacts contain CLI + runtime server files
npm run verify:pack

# full end-to-end local tarball smoke test
npm run verify:smoke
```

Expected smoke-test behavior:
- Local tarball installs to temp directory
- CLI boots successfully
- `GET /api/stats` returns `200`
- `/` (dashboard UI) returns `200`

## Safe Release Checklist

Before `npm publish`, run:

```bash
npm run release:verify
```

This executes, in order:
1. Runtime import audit (`verify:runtime-imports`)
2. Full build (`npm run build`)
3. Pack integrity check (`verify:pack`)
4. Local tarball smoke test (`verify:smoke`)

If any step fails, publish is blocked by `prepublishOnly`.

## What's Changed

### SQLite Migration

- **Replaced JSON file storage with SQLite database support** — OpenCode now uses `opencode.db` instead of JSON files. The dashboard uses Bun's built-in `bun:sqlite` module for fast, zero-dependency access.
- Updated `server/opencode-reader.ts` to query SQLite tables directly.

### New Features

- **Session Archive** — Archive and unarchive sessions directly from the session table. Reads/writes OpenCode's native `time_archived` field, so archive status stays in sync across OpenCode and the dashboard. Archived sessions are hidden by default with a "Show archived" toggle.
- **Session Deletion** — Delete sessions with a confirmation dialog. Includes cascade delete (parts → messages → session) to ensure data integrity.
- **Enhanced Search** — Global search now includes project path/directory, allowing you to find sessions by project name or location.
- **Dynamic Version Display** — Footer shows actual OpenCode and OhMyOpenCode versions fetched from CLI commands.

### Bug Fixes

- Fixed delete confirmation modal placement — modal was incorrectly triggered by agent filter interactions instead of direct delete button clicks.

## License

MIT
