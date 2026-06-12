# pi-idc-collab

Standalone, package-shaped Pi IDC collaborative runtime.

`pi-idc-collab` provides the `pi-idc` CLI: a cmux-first, coms-net-based network of Pi agents that works inside an existing IDC-governed GitHub repo. It is designed to be autonomous, collaborative, and flat, while preserving IDC governance boundaries.

Status: design seed / pre-implementation.

## Core idea

- Planning agents collaborate in real time: `think`, `plan`, `sequence`, `ripple`.
- Build runs as pooled triplets: `build-impl-N -> build-review-N -> build-finish-N`.
- Planning reaches Build only through existing GitHub Project/issues.
- Build reaches planning only through Ripple.
- The target repo's `WORKFLOW.md` remains the governance source of truth.

## Intended CLI

```bash
pi-idc doctor
pi-idc governance compile
pi-idc governance check

pi-idc all                  # full network, default build pool 3
pi-idc all --build-pool 5
pi-idc planning             # think plan sequence ripple
pi-idc build --pool 3       # build triplets only
pi-idc server               # coms-net hub only
pi-idc run think            # one agent in current terminal
```

## V1 assumptions

- Existing IDC-governed target repo only.
- GitHub tracker backend only (`docs/workflow/tracker-config.yaml: backend: github`).
- cmux required for full-network launch.
- Self-contained agent assets: skills, profiles, extensions, guard/runtime code.
- External prerequisites: `pi`, `cmux`, `git`, `gh`.
- Bun/TypeScript implementation, distributed as a compiled `pi-idc` binary when ready.

## Key docs

- [`docs/plans/2026-06-11-pi-idc-collab-architecture.md`](docs/plans/2026-06-11-pi-idc-collab-architecture.md) — initial architecture and implementation plan.
- [`AGENTS.md`](AGENTS.md) — project instructions for coding agents.
- [`CLAUDE.md`](CLAUDE.md) — same instructions for Claude Code.
