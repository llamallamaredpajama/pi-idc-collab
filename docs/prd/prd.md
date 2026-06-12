# pi-idc-collab — Product Requirements Document (PRD)

Status: v1 canonical draft — authored 2026-06-12 under operator-approved drafting
(Engineer Gate, WORKFLOW.md §4.2); merge/commit is operator-gated.
Evidence base: `docs/plans/2026-06-11-pi-idc-collab-architecture.md` (cited below as
"seed §…") and root `CLAUDE.md §Non-negotiable architecture decisions` (cited as
"CLAUDE.md §NN").

> Section numbers are stable. Downstream docs cite this file by anchor (e.g. "PRD §4
> R-03"). Keep numbering stable when editing.

## 1. Mission

Build `pi-idc-collab`: a standalone, installable, production-grade Pi-based
collaborative IDC runtime with the CLI command `pi-idc`. It runs a flat, real-time
coms-net agent network — continuous and autonomous — while preserving the target
repository's IDC governance (`Think → Plan → Sequence → Build`, with `Ripple` for
drift) (per seed §Goal; CLAUDE.md §Mission).

The defining product tension: **maximum agent autonomy inside hard governance walls.**
The network never stops moving, but planning reaches Build only through GitHub
issues/projects, and Build reaches planning only through Ripple (per seed §Goal,
§Glass wall rules; CLAUDE.md §NN "Hard glass wall").

## 2. Users & problem

The operator is a solo developer (or small team) running one or more IDC-governed
GitHub repositories who wants a persistent, self-reviewing, self-correcting build
network instead of manually shepherding individual agent sessions (per seed §Autonomy
posture). Today that capability exists only as machine-local prototype pieces inside
`pi-harnesses`; it is not installable, not self-contained, and not governed by a
deterministic contract (per seed §Package shape; CLAUDE.md §NN "Standalone package").

## 3. Product shape

- One repo/package, `pi-idc-collab`, installing one CLI, `pi-idc` (per seed §Package
  shape).
- Implementation runtime: Bun/TypeScript, distributable as a compiled binary via
  `bun build --compile` (per seed §Package shape; CLAUDE.md §Development rules).
- A thin Claude Code companion plugin lives in `claude-plugin/` in the same repo and
  shells out to the CLI for all behavior (per seed §Claude plugin companion;
  CLAUDE.md §NN "Plugin is thin").
- All required skills, profiles, and extensions ship inside the repo — no reliance on
  `~/.agents/skills` or `~/.claude/skills` for required behavior (per seed §Package
  shape; CLAUDE.md §NN "Self-contained assets").

## 4. Functional requirements (v1)

| ID | Requirement | Evidence |
|----|-------------|----------|
| R-01 | **Standalone:** no runtime dependency on `pi-harnesses`; needed code is copied/adapted with attribution. | seed §Package shape; CLAUDE.md §NN |
| R-02 | **CLI core:** `pi-idc` owns `all`, `planning`, `build` (with `--pool N` / `--build-pool N`), `server`, `run <role>`, `doctor`, `governance compile`, `governance check`. | seed §Commands |
| R-03 | **Existing IDC repo required:** v1 never initializes IDC. Missing governance files produce the fail-closed message `BLOCKED: target repo is not IDC-governed. Install IDC workflow first.` | seed §Target repo requirements; CLAUDE.md §NN |
| R-04 | **GitHub tracker only:** target `tracker-config.yaml` must declare `backend: github`; no filesystem-backend behavior in v1. | seed §Target repo requirements; CLAUDE.md §NN |
| R-05 | **cmux only:** launch topology requires cmux; no iTerm2/Apple Terminal fallback in v1. | seed §Launch topology; CLAUDE.md §NN |
| R-06 | **Hard glass wall:** planning→Build via GitHub issues/project only; Build→planning via Ripple only; enforced in the runtime, not by convention. | seed §Glass wall rules; CLAUDE.md §NN |
| R-07 | **Build triplets:** each build lane is `build-impl-N → build-review-N → build-finish-N`, externally acting as one logical IDC Build worker; default pool is 3 triplets. | seed §Build triplets, §Agent network; CLAUDE.md §NN |
| R-08 | **Deterministic governance contract:** agents consume a compiled sidecar (`docs/workflow/pi-idc-governance-contract.yaml`), not repeated full `WORKFLOW.md` reads; `pi-idc all` fails if the contract is missing/stale/unsupported and never auto-compiles. | seed §Governance contract; CLAUDE.md §NN |
| R-09 | **No forced model:** `pi-idc` passes `--model` only on explicit user configuration (flag or `PI_IDC_*_MODEL` env); no warning when unset. | seed §Model behavior; CLAUDE.md §NN |
| R-10 | **Thin plugin with version lockstep:** plugin.json version == CLI package version == slash-command compatibility constant; slash commands fail closed on major-version mismatch. | seed §Claude plugin companion |
| R-11 | **Tracker schema fidelity:** no new issue labels/states/schema; all tracker writes route through the existing/adapted tracker adapter contract — never direct `gh project item-edit` from agents. | seed §Tracker compatibility; CLAUDE.md §NN "Build triplets" external contract |
| R-12 | **`fullauto-goal` required:** build implementers use the package-local `fullauto-goal` skill for issue-to-completion work. | seed §Build triplets; CLAUDE.md §NN |

## 5. Non-goals (v1)

- IDC workflow initialization in target repos (R-03 inverse) (per seed §Target repo
  requirements).
- Filesystem tracker backend (per seed §Target repo requirements).
- Terminal/iTerm2 launch fallback (per seed §Launch topology).
- Default model forcing or model-selection warnings (per seed §Model behavior).
- Hardcoded gate philosophy: future gating is controlled by the target repo's
  `WORKFLOW.md` (recompiled into the contract), never baked into `pi-idc` (per seed
  §Autonomy posture).

## 6. Operating constraints

- External system prerequisites only: `pi`, `cmux`, `git`, `gh`, and a GitHub repo
  with Projects V2 (per seed §Package shape).
- Deterministic code stays dependency-light; stable YAML output and raw-byte hashes
  are required for the governance contract lockfile (per CLAUDE.md §Development
  rules).
- Fail-closed over warnings whenever governance, tracker, cmux, or plugin/CLI
  versions are incompatible (per CLAUDE.md §Development rules).
- No hardcoded machine-specific paths in runtime code (per CLAUDE.md §Development
  rules).

## 7. Success criteria (v1 acceptance)

1. `pi-idc doctor` passes against a compliant IDC-governed repo and fail-closes with
   actionable messages against a non-compliant one (per seed §Commands, §Target repo
   requirements).
2. `pi-idc governance compile` + `check` produce/validate a deterministic contract
   whose source hashes detect any drift in the four governance source files (per seed
   §Governance contract).
3. `pi-idc all` launches the full default network (4 planning roles + 3 build
   triplets = 13 agents) in cmux, with glass-wall routing enforced (per seed §Agent
   network, §Launch topology).
4. A build triplet drives at least one GitHub tracker issue end-to-end —
   claim/bookend-open through the adapter, `fullauto-goal` implementation, review,
   finish, merge, bookend-close — with the tracker seeing only normal IDC Build
   lifecycle (per seed §Build triplets, §Tracker compatibility).
5. The Claude companion plugin's slash commands shell out to the CLI and fail closed
   on major-version mismatch (per seed §Claude plugin companion).

## 8. Open product questions

Carried from seed §Open design items; resolution routes through the IDC chain
(considerations → Plan), not ad-hoc edits here:

- Exact planning-side worktree/merge/deconflict policy.
- Exact deterministic governance contract schema (compiler implementation detail
  lives in the architectural spec).
- Exact triplet claim protocol between `build-impl-N`, `build-review-N`,
  `build-finish-N`.
- Exact vendored skill list per role.
- Package/install/Homebrew release story.
