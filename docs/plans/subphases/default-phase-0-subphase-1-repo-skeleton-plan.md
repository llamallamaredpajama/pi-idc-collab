# Subphase plan — Phase 0 / Subphase 1 — Repo skeleton & toolchain

Upstream Master Plan Domain/Phase: Phase 0 — Repo skeleton & toolchain
Subphase trace key: default-phase-0-subphase-1-repo-skeleton
Domain: default
Status: drafted
Planning run: idc-plan / autorun 2026-06-12-1059-phase-0-repo-skeleton (group 1)
Governance trace: ADMITTED (master plan §Phase 0, merged e95845d, main-reachable; audit packet 2026-06-12)

## Scope

### Owns (per master plan §Phase 0, lines 30–36)

- The Bun/TypeScript package scaffold: `package.json`, `tsconfig.json`, Bun lockfile, test-runner wiring.
- The repository directory tree per spec §2 — verbatim owns-item: "directory tree per spec §2" (master plan §Phase 0, lines 32–33). Shells only; named files inside the tree land with their owning phases (per-file disposition in D4).
- CI seed: a GitHub Actions workflow exercising the master-plan exit command.
- License/attribution scaffolding for adapted code (conventions documented before Phase 1 lands code).
- `.gitignore` coverage for `.claude/worktrees/` — a subphase-layer hygiene addition folded under the package-scaffold owns item (subphase plans operationalize the owns-list; admitted here as D3; nothing upstream names this line, so the addition is flagged in the Plan handoff for audit).

### Out of scope (per master plan §Phase 0)

- Any runtime behavior (no CLI commands, no governance compile/check, no launcher).
- Any copied or adapted `pi-harnesses` code — that is Phase 1.
- Tracker-schema-fidelity fixtures (master plan §Cross-phase rules starts these "from Phase 2 onward").
- Resolving any PRD §8 / spec §14 open item — none is Phase 0-owned; this subphase must not pre-resolve them.
- `docs/workflow/pi-idc-governance-contract.yaml` — reserved path (docs/workflow/README.md §Reserved paths); must NOT be created.
- Linter/formatter adoption — spec §1 names no lint tool; adding one is speculative scope Phase 0 does not own.

## Exit criteria (verbatim from master plan §Phase 0)

"`bun install && bun test` runs green on an empty test suite; repo layout matches spec §2; attribution conventions documented."

Operationalized per pillar (each pillar plan carries runnable TDD-shaped exit criteria):
- `bun install && bun test` → exit 0 (pillar `toolchain`).
- Every spec §2 directory present on fresh checkout (pillar `layout`).
  - Operationalization note: at Phase 0, "repo layout matches spec §2" is satisfied by the DIRECTORY tree. Basis: the owns-item is verbatim "directory tree per spec §2" (tree, not files), and the named files inside the tree are later-phase content under the same section's out-of-scope clauses — spec §2 itself annotates three of the four extension `.ts` files as "adapted from pi-harnesses" (Phase 0 excludes copied/adapted code), and the fourth (`pi-idc-collab-harness.ts`, annotated "NEW") is master plan §Phase 6 scope, excluded via the "any runtime behavior" arm. Per-file disposition in D4. A non-blocking Ripple note in the Plan handoff offers to tighten the master-plan exit wording to say this explicitly.
- CI workflow green + `ATTRIBUTIONS.md` present with the documented conventions (pillar `ci-attribution`).

## Upstream anchors

- PRD §4 R-01 ("Standalone") — Phase 0 bite: attribution-conventions scaffold; copying itself is Phase 1.
- PRD §4 R-02 ("CLI core") — Phase 0 bite: `src/cli/` exists as an empty shell only; commands are Phase 2.
- PRD §6 Operating constraints — fail-closed over warnings (constrains CI-seed design); no hardcoded machine-specific paths.
- spec §1 Runtime & distribution — Bun/TS throughout; deterministic subsystems dependency-light. Spec §1 pins NO versions and names NO lint/test tools — toolchain pin choices are this plan's to define (kept minimal; see D2).
- spec §2 Repository layout — the mandated tree (spec lines 28–60); Phase 0 creates shells, contents belong to later phases.
- Master plan §Cross-phase rules (lines 141–152) — tests land with each phase (runner wired even when empty); attribution conventions documented BEFORE Phase 1; fail-closed posture.
- Project CLAUDE.md §Development rules — Bun/TS, tests with each phase, attribution + license notices for adapted code.

## Planning decisions (trace + rationale)

- **D1 — Domain string `default` in plan-file stems; board Domain write is GATED on a Ripple-landed master-plan §Domains row.** Master plan §Domains has no toolchain/skeleton entry and Phase 0 creates the directory shells of every domain, so no single §Domains value fits truthfully. WORKFLOW.md is explicit on both sides of the tension: §6.3 defines `Domain | single-select | Master-plan §Domain trace.` and §6.6 requires the Sequence-written Domain value to match the master-plan §Domain trace; §6.3's enum-extension SOP equally anticipates NEW domains coming online via option pre-seed. Therefore: (a) plan-file stems use `default` (stems are plan-chain identifiers; §6.6 governs the board field write, not filenames); (b) **Sequence-admit precondition (single compliant path)** — a master-plan §Domains row covering this work MUST land via Ripple, with the matching board option pre-seeded per §6.3, BEFORE Sequence writes the board Domain field. The staged proposal (durable copy embedded in this run's Plan handoff at `docs/workflow/handoffs/phases/2026-06-12-1153-phase-0-repo-skeleton.md` §Appendix: Ripple proposal — Domain taxonomy) recommends the minimal-churn fix: add a `default` row for cross-cutting repo-skeleton/toolchain work. The operator may direct a DIFFERENT row through the same Ripple mechanism (entails the stem-rename sweep named in the proposal). An out-of-band blessing without a master-plan row is NOT a §6.6-compliant trace and is not an accepted path. Until the row lands, Sequence must not write the Domain field. Mirrored in the planning manifest's tracker_admission_preconditions and the Plan handoff.
- **D2 — Minimal toolchain pins.** Upstream pins nothing (spec §1). The scaffold pins only what the exit criterion needs: Bun's native test runner (`bun test`), `"type": "module"`, a strict `tsconfig.json`. No linter, no formatter, no extra devDependencies — fail-closed simplicity; later phases admit tools when a phase owns the need. Reference point: `pi-harnesses` runs bare-Bun with no tsconfig/lint at root; this repo's master plan explicitly requires a `tsconfig`, so one is added here despite the reference lacking prior art.
- **D3 — `.gitignore` gains `.claude/worktrees/` (targeted pattern, not blanket `.claude/`).** A blanket `.claude/` ignore would swallow `.claude/settings.json`, which the repo intentionally carries. Targeted line keeps agent worktrees out of `git status` without hiding tracked config.
- **D4 — "Layout matches spec §2" means directory shells; per-named-file disposition.** Basis: the master-plan owns-item is verbatim "directory tree per spec §2", and the same §Phase 0 out-of-scope clause excludes copied/adapted `pi-harnesses` code. Disposition of every named file spec §2 lists inside the tree: the 3 adapted extension `.ts` files (`coms-net.ts`, `idc-role-harness.ts`, `guard-shell-core.ts`) — spec §2 annotates them "adapted from pi-harnesses", i.e. Phase 1 vendoring content; `pi-idc-collab-harness.ts` — annotated "NEW" in spec §2 and owned by master plan §Phase 6 (lines 91–93), excluded at Phase 0 via the "any runtime behavior" out-of-scope arm; `config/pi-idc-collab.yaml` — its schema/content belongs to the phase that owns `config/` consumption; `claude-plugin/.claude-plugin/plugin.json` — plugin-phase content (spec §11); skill/profile entries — their owning phases. Creating empty named files in Phase 0 would imply content that does not exist, pre-resolve later-phase decisions, and invite drift. Directories land with `.gitkeep` placeholders.
- **D5 — Placeholder smoke test allowed.** If `bun test` exits non-zero on a zero-test-file suite, a single trivial `tests/smoke.test.ts` satisfies the green-command exit criterion while honoring the "empty suite" spirit. Build verifies actual Bun behavior at implementation time.

## Operator gates

None for this run (no PRD/spec/master edits drafted). The one operator-facing decision flag is D1's Domain-taxonomy deferral — materialized in the staged Ripple proposal and the Plan handoff §Notes for resume, not as an in-run gate.

## Wave-Orchestrator Handoff (downstream pointers for Sequence)

> Pointer form only — the legacy six-sub-section ceremony is retired per idc-plan anti-patterns; TRACKER placement recommendations live in the Plan handoff §Pick up here / §Notes for resume.

- Pillar matrix (canonical landing): `docs/workflow/pillar-matrices/phase-0-matrix.yaml` — dependency DAG, parallel-safety, and wave-ordering views. Authorized wave mapping (fixed, deterministic): matrix tag `wave-<n>` ↔ board option `Wave <n>`.
- Phase-wide planning manifest: `docs/workflow/phase-planning/phase-0-planning-manifest.yaml` — includes tracker_admission_preconditions (Domain gate per D1; Wave option pre-seed + authorized mapping per WORKFLOW §6.3).
- Pillar plans: `docs/plans/pillars/default-phase-0-subphase-1-pillar-1-toolchain-plan.md`, `…-pillar-2-layout-plan.md`, `…-pillar-3-ci-attribution-plan.md`.

## §Rough Pillars

> Recursive Fractal Distillation handoff — Deconflict polishes each subsection into a canonical pillar plan at `docs/plans/pillars/<subphase_id>-pillar-<n>-<pillar_slug>-plan.md`. Rough pillars live INLINE in this subphase plan; never as separate files. Per the folded `idc-develop` orchestrator (now `idc:idc-plan`) anti-pattern line 252, omitting this section makes the subphase plan non-canonical.

> Stem convention for this subphase (load-bearing for later runs): polished pillar stems use the ordinal prefix `default-phase-0-subphase-1` — NOT the full subphase trace key `default-phase-0-subphase-1-repo-skeleton` — matching the pillar-plan-shape trace-key gate (`<domain>-phase-<n>-subphase-<n>-pillar-<n>-<slug>`). Matrix `pillar_id`, pillar `Tracker Trace Key`, and plan paths are all in lockstep on this stem.

### toolchain

**Rough scope:** Establish the Bun/TypeScript package scaffold: `package.json` (`"type": "module"`, a `test` script), `tsconfig.json`, the Bun lockfile produced by `bun install`, and `tests/` runner wiring so that `bun install && bun test` exits 0 on an effectively empty suite (one placeholder smoke test is acceptable if `bun test` errors on zero test files — the master-plan exit criterion is the green command, not zero files). Also extends `.gitignore` with `.claude/worktrees/` coverage so worktree-based agent runs never show as untracked noise. Acceptance: `bun install && bun test` runs green from a fresh clone.

**File surfaces (write paths):**

| Path | Role | Co-owners |
|------|------|-----------|
| package.json | exclusive | (n/a) |
| tsconfig.json | exclusive | (n/a) |
| bun.lock | exclusive | (n/a) |
| .gitignore | exclusive | (n/a) |
| tests/smoke.test.ts | exclusive | (n/a) |

**Dependencies:**

- Within-subphase: (none)
- Cross-subphase: (none)

**Parallel-safety hints:** Safe alongside `layout` because the surfaces are disjoint — repo-root toolchain files (`package.json`, `tsconfig.json`, `bun.lock`, `.gitignore`, `tests/`) vs. spec §2 directory shells. `ci-attribution` consumes this pillar's `package.json` scripts in its CI workflow, which is an ordering dependency on `ci-attribution`'s side, not a shared surface.

> *Note for polish: verify current Bun behavior on a zero-test-file suite during Build — if `bun test` exits non-zero with "no tests found", the placeholder smoke test is mandatory, not optional. Upstream pins nothing (spec §1 names no Bun/TS versions and no lint tool) — version pins and any lint choice are deliberately minimal here; adding a linter is NOT Phase 0 scope.*

### layout

**Rough scope:** Create the spec §2 repository tree shells as directories held by `.gitkeep` placeholders: `extensions/`, `skills/`, `profiles/` (7 role dirs), `config/`, `src/{cli,governance,launcher,cmux,coms-net}/`, and `claude-plugin/{.claude-plugin/,commands/,skills/}`. Named files inside the tree (the extension `.ts` files — 3 adapted → Phase 1, `pi-idc-collab-harness.ts` (NEW) → Phase 6 —, `config/pi-idc-collab.yaml`, `claude-plugin/.claude-plugin/plugin.json`, skill entries) land with their owning phases, not Phase 0 — Phase 0 owns shells only. Acceptance: every spec §2 directory exists on a fresh checkout and `git status` is clean after clone.

**File surfaces (write paths):**

| Path | Role | Co-owners |
|------|------|-----------|
| extensions/ | exclusive | (n/a) |
| skills/ | exclusive | (n/a) |
| profiles/ | exclusive | (n/a) |
| config/ | exclusive | (n/a) |
| src/ | exclusive | (n/a) |
| claude-plugin/ | exclusive | (n/a) |

**Dependencies:**

- Within-subphase: (none)
- Cross-subphase: (none)

**Parallel-safety hints:** Safe alongside both siblings: owns only the spec §2 directory shells (`extensions/`, `skills/`, `profiles/`, `config/`, `src/`, `claude-plugin/`), which no sibling pillar writes; repo-root toolchain files and `.github/` are outside its surfaces.

> *Note for polish: do NOT create `docs/workflow/pi-idc-governance-contract.yaml` (reserved path, docs/workflow/README.md §Reserved paths) and do not pre-resolve the `skills/<role-specific>` open item — shells only.*

### ci-attribution

**Rough scope:** Seed CI and the attribution conventions: a GitHub Actions workflow that runs `bun install && bun test` on push and pull_request, failing closed at job level (no `continue-on-error`, no error suppression; merge-blocking branch protection is an operator-console setting outside repo files), plus `ATTRIBUTIONS.md` documenting the attribution and license-notice conventions that adapted `pi-harnesses` code must carry from the moment it lands (Phase 1). Acceptance: the workflow passes on the assembled Phase 0 skeleton; attribution conventions are documented before any Phase 1 code lands.

**File surfaces (write paths):**

| Path | Role | Co-owners |
|------|------|-----------|
| .github/workflows/ci.yml | exclusive | (n/a) |
| ATTRIBUTIONS.md | exclusive | (n/a) |

**Dependencies:**

- Within-subphase: toolchain
- Cross-subphase: (none)

**Parallel-safety hints:** Serializes after `toolchain` because its CI workflow executes `bun install && bun test`, which requires `package.json` and runner wiring that `toolchain` owns; no file-surface overlap with either sibling (owns only `.github/workflows/ci.yml` and `ATTRIBUTIONS.md`), so the ordering edge is a dependency, not a clash.
