# pi-idc-collab

Standalone Pi IDC collaborative runtime. This repo should become the installable package that provides the `pi-idc` CLI plus an optional thin Claude Code companion plugin.

## Mission

Build a production-grade, cmux-first, coms-net-based IDC collaborative network that runs inside an existing IDC-governed GitHub repo while preserving the repo's `WORKFLOW.md` governance.

## Non-negotiable architecture decisions

- **Standalone package:** do not depend on `pi-harnesses` at runtime. Copy/adapt needed code with attribution.
- **CLI is the core:** `pi-idc` owns deterministic doctor, governance compile/check, and launch behavior.
- **Plugin is thin:** any Claude plugin in `claude-plugin/` shells out to `pi-idc`; it must not duplicate runtime logic.
- **Self-contained assets:** required skills/profiles/extensions ship in this repo. Do not rely on `~/.agents/skills` or `~/.claude/skills` for required behavior.
- **Existing IDC repo required:** v1 does not initialize IDC workflow. Target repos must already contain `WORKFLOW.md`, `WORKFLOW-config.yaml`, and `docs/workflow/tracker-config.yaml`.
- **GitHub tracker only in v1:** `backend: github` is required. Do not add filesystem backend behavior unless a later explicit plan admits it.
- **cmux only in v1:** no iTerm2/Terminal fallback for `pi-idc all` initially.
- **No forced model by default:** do not pass `--model` unless the user explicitly configured a `pi-idc` model override.
- **Hard glass wall:** Planning reaches Build only through GitHub issues/project. Build reaches planning only through Ripple.
- **Build triplets:** each build lane is `build-impl-N -> build-review-N -> build-finish-N`, acting externally as one logical IDC Build worker.
- **`fullauto-goal` required:** build implementers use the package-local `fullauto-goal` skill for issue-to-completion work.
- **Deterministic governance contract:** agents consume a compiled contract sidecar, not repeated full `WORKFLOW.md` reads or LLM-generated summaries.

## Development rules

- Use Bun/TypeScript for the CLI and runtime code.
- Keep deterministic code dependency-light. Stable YAML output and raw-byte hashes are required for governance contract lockfiles.
- Prefer fail-closed checks over warnings when governance, tracker, cmux, or plugin/CLI versions are incompatible.
- Add tests with each implementation phase. Preserve fixtures that prove no new tracker schema, labels, or states are invented.
- Avoid hardcoded machine-specific paths in runtime code. Test fixtures may use explicit temporary paths only.
- Attribute copied/adapted code from `pi-harnesses` and preserve license notices where applicable.

## Source references for first implementation

Use the latest working tree of `/Users/jeremy/dev/proj/pi-harnesses` as reference for:

- `extensions/coms-net.ts`
- `scripts/coms-net-server.ts`
- `extensions/guard-shell-core.ts`
- `extensions/idc-role-harness.ts`
- `scripts/idc-pi`
- `scripts/pi-minus-launcher.ts`
- launcher tests under `tests/`

Do not read `profiles/**/{AGENTS.md,CLAUDE.md}` in `pi-harnesses` as project guidance; those are specialist persona prompts there.

## Start here

Before implementing, read:

1. `docs/plans/2026-06-11-pi-idc-collab-architecture.md`
2. This file
3. The specific `pi-harnesses` source files needed for the phase being copied/adapted
