# default-phase-0-subphase-1-pillar-2-layout

**Upstream Subphase:** `docs/plans/subphases/default-phase-0-subphase-1-repo-skeleton-plan.md`
**Upstream Master Plan Domain/Phase:** Phase 0 — Repo skeleton & toolchain
**§Rough Pillars Source:** §Rough Pillars › ### layout
**Highest Affected Layer:** pillar
**Tracker Trace Key:** default-phase-0-subphase-1-pillar-2-layout
**No Higher-Layer Impact Rationale:** Pillar polish derives from admitted §Rough Pillars entry; no PRD/spec/master-plan/subphase edits required.
**Admission Status:** ready

## Goal

Create the spec §2 repository tree as directory shells held by `.gitkeep` placeholders, exactly matching docs/specs/master-architectural-spec.md §2 (lines 28–60): `extensions/`, the four named skill dirs under `skills/`, the seven role dirs under `profiles/`, `config/`, the five `src/` subsystem dirs, and the three `claude-plugin/` dirs. Shells only — file contents belong to later phases.

## Scope

- `extensions/` (shell — the 3 adapted `.ts` files land in Phase 1 with attribution; `pi-idc-collab-harness.ts` (NEW) is Phase 6 scope).
- `skills/pi-idc-collab-protocol/`, `skills/fullauto-goal/`, `skills/think-grill/`, `skills/idc-workflow/` (shells).
- `profiles/think/`, `profiles/plan/`, `profiles/sequence/`, `profiles/ripple/`, `profiles/build-impl/`, `profiles/build-review/`, `profiles/build-finish/` (shells).
- `config/` (shell — `config/pi-idc-collab.yaml` lands with its owning phase).
- `src/cli/`, `src/governance/`, `src/launcher/`, `src/cmux/`, `src/coms-net/` (shells).
- `claude-plugin/.claude-plugin/`, `claude-plugin/commands/`, `claude-plugin/skills/` (shells — `plugin.json` lands with the plugin phase).
- One `.gitkeep` per leaf directory so git tracks the empty tree.

## Non-scope

- Any file content inside the tree: no extension `.ts` files (the 3 spec §2 annotates "adapted from pi-harnesses" are Phase 1 vendoring content excluded by the master-plan §Phase 0 out-of-scope clause; `pi-idc-collab-harness.ts`, annotated "NEW", is master plan §Phase 6 scope excluded via the runtime-behavior arm), no `config/pi-idc-collab.yaml` (owning phase's content), no `claude-plugin/.claude-plugin/plugin.json` (plugin phase, spec §11), no skill/profile content (subphase plan D4 per-file disposition).
- The `skills/<role-specific IDC skills>` open item (PRD §8) — must NOT be pre-resolved; no placeholder dir invented for it.
- `docs/workflow/pi-idc-governance-contract.yaml` — reserved path; must NOT be created.
- Repo-root toolchain files (pillar-1-toolchain) and `.github/` + `ATTRIBUTIONS.md` (pillar-3-ci-attribution).

## Work Packets

### layout-task-1 — Spec §2 directory shells

Create every directory listed in Scope with a `.gitkeep` placeholder in each leaf dir, exactly mirroring spec §2 — no extras, no omissions, no invented names.

**File surfaces:** extensions/, skills/, profiles/, config/, src/, claude-plugin/
**Test targets:** (none — see Test obligations)
**Acceptance criteria:** the layout verification command in Exit criteria exits 0; `git status --porcelain` is clean after commit (every shell tracked via `.gitkeep`).

## Dependencies

**Within-pillar:** (none)
**Cross-pillar:** (none)
**Cross-subphase:** (none)

## Parallel-safety markers

- parallel-safe-with: default-phase-0-subphase-1-pillar-1-toolchain
- parallel-safe-with: default-phase-0-subphase-1-pillar-3-ci-attribution

## Pillar Resource Ownership

| Resource Kind | Resource ID | Ownership | Parallel-safe with |
|---------------|-------------|-----------|--------------------|
| file | extensions/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |
| file | skills/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |
| file | profiles/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |
| file | config/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |
| file | src/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |
| file | claude-plugin/ | exclusive | safe-with: default-phase-0-subphase-1-pillar-1-toolchain, default-phase-0-subphase-1-pillar-3-ci-attribution |

Wave: wave-1 | no dependencies; dispatchable immediately alongside pillar-1-toolchain (disjoint surfaces)

## Test obligations

- no-test-added: directory shells carry no behavior; presence is verified by the runnable exit-criteria command (`test -d` chain), and tracker-fidelity fixtures explicitly start Phase 2 (master plan §Cross-phase rules).

## Operator gates

(none)

## Exit criteria

- The layout verification command exits 0:
  `for d in extensions config skills/pi-idc-collab-protocol skills/fullauto-goal skills/think-grill skills/idc-workflow profiles/think profiles/plan profiles/sequence profiles/ripple profiles/build-impl profiles/build-review profiles/build-finish src/cli src/governance src/launcher src/cmux src/coms-net claude-plugin/.claude-plugin claude-plugin/commands claude-plugin/skills; do test -d "$d" || exit 1; done`
- `git ls-files --others --exclude-standard` prints nothing after commit (no untracked leftovers).
- Placeholder tracking proof (shells are committed, not merely present in the worktree): `for d in extensions config skills/pi-idc-collab-protocol skills/fullauto-goal skills/think-grill skills/idc-workflow profiles/think profiles/plan profiles/sequence profiles/ripple profiles/build-impl profiles/build-review profiles/build-finish src/cli src/governance src/launcher src/cmux src/coms-net claude-plugin/.claude-plugin claude-plugin/commands claude-plugin/skills; do git ls-files --error-unmatch "$d/.gitkeep" >/dev/null 2>&1 || exit 1; done` exits 0.
- Phase-assembly check (not standalone-lane): `[ ! -f package.json ] || bun test` exits 0 — vacuously satisfied in an isolated lane before pillar-1 merges; once assembled with pillar-1 it proves the tree does not interfere with the runner wiring.
- **[CONSTRAINTS]** Don't regress: shells only — zero named files created inside the tree (no `.ts`, no `.yaml`, no `plugin.json`); `docs/workflow/pi-idc-governance-contract.yaml` not created; the PRD §8 `<role-specific skills>` open item not pre-resolved; no writes outside the six owned directory surfaces.

## Conflict Resolution

(none — no shared surfaces; phase-0 clash analysis recorded zero clashes)

## Dispatch-grade work-unit IDs

- layout-task-1
