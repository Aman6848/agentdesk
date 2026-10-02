# AgentDesk

Desktop mission control for AI coding agents.

AgentDesk is a developer-focused desktop workspace for launching, monitoring, and managing multiple AI coding agents across projects.

## Current milestone

**Milestone 1 — Desktop shell**

- React + TypeScript + Vite frontend
- Tauri 2 desktop shell
- Developer-focused dark UI
- Project sidebar
- Agent cards with status, provider, task, and duration
- Terminal-style session panel
- New-agent interaction stub

The terminal shown in the current UI is a placeholder. Real PTY integration comes next.

## Planned architecture

```text
React UI
   │
   ├── Session Manager
   ├── Project Manager
   └── Agent Dashboard
          │
          ▼
      Tauri / Rust
          │
          ├── PTY processes
          ├── Git worktrees
          └── Local SQLite state
```

AI providers will use a common abstraction so Claude, Codex, Gemini, and future providers can be added without coupling the UI to one CLI.

## Development

Prerequisites:

- Node.js 20+
- Rust toolchain
- Tauri prerequisites for your operating system

Install dependencies:

```bash
npm install
```

Run the web UI:

```bash
npm run dev
```

Run the desktop app:

```bash
npm run tauri dev
```

Build:

```bash
npm run build
```

## Roadmap

1. Desktop shell
2. Real PTY terminal
3. Multiple independent sessions
4. Projects and Git worktrees
5. Claude / Codex / Gemini provider abstraction
6. Agent status dashboard
7. Summaries and notifications
8. Agent orchestration

## Product principle

> Don't organize terminals. Organize work.
