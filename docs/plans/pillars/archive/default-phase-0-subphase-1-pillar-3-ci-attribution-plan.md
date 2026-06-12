# default-phase-0-subphase-1-pillar-3-ci-attribution

**Upstream Subphase:** `docs/plans/subphases/default-phase-0-subphase-1-repo-skeleton-plan.md`
**Upstream Master Plan Domain/Phase:** Phase 0 — Repo skeleton & toolchain
**§Rough Pillars Source:** §Rough Pillars › ### ci-attribution
**Highest Affected Layer:** pillar
**Tracker Trace Key:** default-phase-0-subphase-1-pillar-3-ci-attribution
**No Higher-Layer Impact Rationale:** Pillar polish derives from admitted §Rough Pillars entry; no PRD/spec/master-plan/subphase edits required.
**Admission Status:** ready

## Goal

Seed CI and the attribution conventions: a fail-closed GitHub Actions workflow running `bun install && bun test` on push and pull_request, plus `ATTRIBUTIONS.md` documenting the attribution and license-notice conventions that adapted `pi-harnesses` code must carry from the moment it lands (Phase 1) — satisfying the master-plan exit criterion "attribution conventions documented" and PRD §4 R-01.

## Scope

- `.github/workflows/ci.yml` — checkout, Bun setup, `bun install`, `bun test`; triggers on `push` and `pull_request`; fails closed at job level (no `continue-on-error`, no error suppression — PRD §6 posture). Merge-blocking branch protection is an operator-console setting outside repo files and outside this pillar's verifiable surface (see Non-scope).
- `ATTRIBUTIONS.md` — fixed section template with exactly these H2 headings and required content per section: `## Attribution header convention` (the per-file header format for adapted `pi-harnesses` code, naming source repo + source path + adaptation note), `## License notice preservation` (must state original MIT notices are "preserved verbatim"), `## Adapted files` (a table with exactly the header `| File | Source (pi-harnesses path) | Adaptation note | License |`, populated as adapted files land from Phase 1 onward; zero data rows at Phase 0 close).

## Non-scope

- Any actual code attribution entries — no code is copied in Phase 0; the table starts empty.
- CI steps beyond the exit-criterion command (no lint step, no build step, no release/publish automation).
- Branch-protection configuration (operator/console surface, not a repo file).
- Repo-root toolchain files (pillar-1-toolchain) and the spec §2 tree (pillar-2-layout).

## Work Packets

### ci-attribution-task-1 — CI seed workflow

Author `.github/workflows/ci.yml`: trigger on `push` and `pull_request`; steps — checkout, official Bun setup action, `bun install`, `bun test`. Fail-closed: no `continue-on-error`, no error suppression. Keep to one job; no matrix.

**File surfaces:** .github/workflows/ci.yml
**Test targets:** (none — see Test obligations)
**Acceptance criteria:** the workflow run for the pillar's PR completes green (`gh pr checks` passes); the YAML contains no `continue-on-error` and no `|| true`.

### ci-attribution-task-2 — Attribution conventions document

Author `ATTRIBUTIONS.md` per the Scope template (the three exact H2 headings), plus a pointer to project CLAUDE.md §Non-negotiable architecture decisions ("Copy/adapt needed code with attribution"). This packet has NO dependency on pillar-1 — it may be drafted and reviewed before toolchain finishes; only ci-attribution-task-1's CI-green check requires pillar-1 merged.

**File surfaces:** ATTRIBUTIONS.md
**Test targets:** (none — see Test obligations)
**Acceptance criteria:** `grep -q "^## Attribution header convention" ATTRIBUTIONS.md && grep -q "^## License notice preservation" ATTRIBUTIONS.md && grep -q "^## Adapted files" ATTRIBUTIONS.md && grep -q "preserved verbatim" ATTRIBUTIONS.md && grep -qF "| File | Source (pi-harnesses path) | Adaptation note | License |" ATTRIBUTIONS.md` exits 0.

## Dependencies

**Within-pillar:** (none)
**Cross-pillar:**
- default-phase-0-subphase-1-pillar-1-toolchain (CI executes `bun install && bun test`, which requires the package scaffold and runner wiring)
- Accepted tradeoff (explicit): the attribution packet (ci-attribution-task-2) is independent of pillar-1, yet the pillar as a whole serializes behind it in wave-2. Deliberate low-cost serialization — one small doc; a fourth dispatch unit would add issue/PR ceremony for no wall-clock gain at phase scale.
**Cross-subphase:** (none)

## Parallel-safety markers

- serial-after: default-phase-0-subphase-1-pillar-1-toolchain
- parallel-safe-with: default-phase-0-subphase-1-pillar-2-layout

## Pillar Resource Ownership

| Resource Kind | Resource ID | Ownership | Parallel-safe with |
|---------------|-------------|-----------|--------------------|
| file | .github/workflows/ci.yml | exclusive | safe-with: default-phase-0-subphase-1-pillar-2-layout |
| file | ATTRIBUTIONS.md | exclusive | safe-with: default-phase-0-subphase-1-pillar-2-layout |

Blocks on: default-phase-0-subphase-1-pillar-1-toolchain | CI workflow executes `bun install && bun test`, which requires the package scaffold and runner wiring owned by pillar-1
Wave: wave-2 | serializes after wave-1 on the pillar-1 dependency edge; no file-surface overlap with any sibling

## Test obligations

- no-test-added: the CI workflow is itself the verification surface (it runs `bun install && bun test`); `ATTRIBUTIONS.md` is documentation with no testable behavior in Phase 0.

## Operator gates

(none)

## Exit criteria

- `gh pr checks <pr-number>` reports the `ci` workflow green on this pillar's PR (workflow executed `bun install && bun test` successfully).
- `grep -q "^## Attribution header convention" ATTRIBUTIONS.md && grep -q "^## License notice preservation" ATTRIBUTIONS.md && grep -q "^## Adapted files" ATTRIBUTIONS.md && grep -q "preserved verbatim" ATTRIBUTIONS.md && grep -qF "| File | Source (pi-harnesses path) | Adaptation note | License |" ATTRIBUTIONS.md` exits 0 (fixed template present: all three required conventions, the verbatim-preservation rule, and the adapted-files table header).
- `grep -E "continue-on-error|\|\| true" .github/workflows/ci.yml` exits non-zero (fail-closed posture intact).
- `bun install && bun test` still exits 0 locally.
- **[CONSTRAINTS]** Don't regress: existing suite stays green; no new dependencies; no writes outside `.github/workflows/ci.yml` and `ATTRIBUTIONS.md`; no branch-protection or repo-settings mutation; the workflow must not weaken to warn-only.

## Conflict Resolution

(none — no shared surfaces; phase-0 clash analysis recorded zero clashes)

## Dispatch-grade work-unit IDs

- ci-attribution-task-1
- ci-attribution-task-2
