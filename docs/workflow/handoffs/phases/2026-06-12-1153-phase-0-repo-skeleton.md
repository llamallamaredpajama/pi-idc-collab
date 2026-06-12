---
role: plan
next_role: sequence
auto_advance_eligible: true
auto_advance_reason: ""
open_questions: 1
blocking_todos: 0
pipeline: codebase
---

# Plan handoff — Phase 0 (Repo skeleton & toolchain) planning run

Run: idc-plan group 1 of autorun `2026-06-12-1059-phase-0-repo-skeleton` · gate_mode: skip (CONTRACT-1) · slug `phase-0-repo-skeleton-g1`

## Pick up here

1. **Land the Domain-taxonomy Ripple FIRST (or in parallel with Sequence's ordering work).** The §Appendix below carries the staged change-order proposal: add a `default` row to master plan §Domains covering cross-cutting repo-skeleton/toolchain work (minimal churn — blesses the board's existing `default` option, zero renames). Route via `idc-ripple` / the autorun parent's ripple surface. Until the row lands, Sequence MUST NOT write the board Domain field (WORKFLOW.md §6.6; subphase plan D1; manifest `tracker_admission_preconditions.domain`).
2. **Sequence: admit the three polished pillars to TRACKER** per the dependency map in `docs/workflow/pillar-matrices/phase-0-matrix.yaml` — wave-1: `default-phase-0-subphase-1-pillar-1-toolchain` + `default-phase-0-subphase-1-pillar-2-layout` (parallel-safe, disjoint surfaces); wave-2: `default-phase-0-subphase-1-pillar-3-ci-attribution` (Blocks on pillar-1).
3. **Tracker preconditions before admit** (manifest `tracker_admission_preconditions`): pre-seed board Wave options `Wave 1` and `Wave 2` (authorized fixed mapping: matrix `wave-<n>` ↔ board `Wave <n>`); `Phase 0` option already exists; labels gate is fail-closed — verify on-demand label creation or pre-create the §6.3 namespace labels.

## What just landed

- **Plan PR:** #1 — https://github.com/llamallamaredpajama/pi-idc-collab/pull/1 (squash-merged to main; this handoff landed in that PR).
- **Subphase plan:** `docs/plans/subphases/default-phase-0-subphase-1-repo-skeleton-plan.md` (inline §Rough Pillars, decisions D1–D5, Wave-Orchestrator Handoff pointer section).
- **Pillar plans (3):** `docs/plans/pillars/default-phase-0-subphase-1-pillar-1-toolchain-plan.md`, `…-pillar-2-layout-plan.md`, `…-pillar-3-ci-attribution-plan.md` — all `Admission Status: ready`, trace triples complete, TDD-shaped exit criteria with `[CONSTRAINTS]` lines.
- **Matrix:** `docs/workflow/pillar-matrices/phase-0-matrix.yaml` (dependency DAG / parallel-safety / wave-ordering views; first synthesis — active and completed empty; `clash_evidence: []`).
- **Planning manifest:** `docs/workflow/phase-planning/phase-0-planning-manifest.yaml` (`planning_scope: phase-wide`; 1 subphase row, status `drafted`, zero deferred rows; `tracker_admission_preconditions` block).
- **Clash evidence:** none — formal clash analysis returned clean (0 clashes, 0 ripple-required pairs) across all 3 pillar pairs.
- **Canonical docs edited:** none (no PRD/spec/master diffs; hence no planning-admission audit artifact).
- **Considerations absorbed/archived:** none (input was the admitted master-plan §Phase 0 section, not a consideration file).
- **Review trail:** 3 dual-lens loops (custom + codex-adversarial) at `/tmp/idc-plan/phase-0-repo-skeleton-g1/{custom,codex}-plan-review*.md` — loop 1: 2 Blockers/2 Majors found; loop 3: 0 Blocker / 0 Major both lenses; all Minor∪Nit folded in the final patch pass.

## Open questions / operator decisions pending

1. **Domain-taxonomy Ripple decision** — the §Appendix proposal recommends adding a `default` row to master plan §Domains. The operator (via the ripple's own gate, per its verdict class) may instead direct a named row (e.g. `toolchain`), which entails a stem-rename sweep across every phase-0 plan artifact (named in the proposal). The board Domain write is fail-closed-gated until the row lands; nothing else in the Sequence leg is blocked by this.

## Verification (drift detection for resume)

- main HEAD at run start: `d17b7ff`; Plan PR merge advances main (squash).
- Last PR merged by this run: #1 (`plan: phase-0 subphase + 3 pillars`).
- Alive teammates expected after close: `bootstrap-researcher` (autorun-durable; shut down by the autorun parent at run close), `plan-g1` (this teammate — stays alive until SEQUENCE_CLOSED per brief lifecycle).
- Plan paths: see §What just landed; scratch run dir `/tmp/idc-plan/phase-0-repo-skeleton-g1/` (gitignored harness scratch; deletable after SEQUENCE_CLOSED).
- Tracker: GitHub Projects board #5, empty at Plan close — no TRACKER writes made by Plan (Sequence authority).

## Notes for resume

- **Ripple obligations:** (1) REQUIRED before board Domain writes — the §Appendix Domain-taxonomy proposal. (2) OPTIONAL, Nit-severity — tighten master plan §Phase 0 exit wording from "repo layout matches spec §2" to name the directory-tree reading explicitly (the subphase plan's D4 operationalization already governs Build; see Appendix §Optional companion).
- **Scope addition flagged for audit:** `.gitignore` line `.claude/worktrees/` is a subphase-layer hygiene addition (subphase plan D3) — folded under the package-scaffold owns item; nothing upstream names it.
- **Sibling-pillar coupling for Sequence:** pillar-3 serializes behind pillar-1 (CI executes the toolchain's `bun install && bun test`); explicitly accepted tradeoff that its attribution packet (independent) rides the same wave-2 pillar.
- **Build inheritance:** no `tests/test_arch_*.py` fences exist in this repo yet and none are triggered by these artifacts ("no fence trigger" declared in the PR body). Pillar exit criteria are the verification surface; pillar-1 carries the D5 empty-suite caveat (Build verifies actual `bun test` zero-file behavior).
- **Stem convention (load-bearing):** pillar stems use the ordinal prefix `default-phase-0-subphase-1`, NOT the full subphase trace key — stated in the subphase §Rough Pillars preamble; keep matrix/tracker keys in lockstep.

## Appendix: Ripple proposal — Domain taxonomy

> Embedded verbatim from the Plan run scratch (`draft-ripple-domain-taxonomy.md`) as its durable home; the manifest Domain gate and subphase D1 reference THIS section.

### Drift evidence

- WORKFLOW.md §6.3 defines the tracker field `Domain | single-select | Master-plan §Domain trace.` and §6.6 requires the Sequence-written Domain value to match the master-plan §Domain trace.
- Master plan §Domains (lines 15–28) enumerates 8 domains (`cli`, `governance`, `launcher-cmux`, `coms-net`, `harness`, `build-lane`, `assets`, `plugin`) — none covers Phase 0's repo-skeleton/toolchain work, and the master plan does not assign Phase 0 to any domain (Phase 0 creates the directory shells of EVERY domain plus root toolchain files belonging to none).
- The tracker board's Domain field has exactly one option: `default` (init placeholder, not in §Domains).
- Net: Sequence cannot write ANY §6.6-compliant Domain value for phase-0 items today. Adversarial review (codex, 2026-06-12) rated this a Blocker against the Plan draft set.

### Proposed edit (highest affected layer: master plan — §Domains table only)

Add one additive row to master plan §Domains:

| Domain | Spec anchor |
|---|---|
| `default` | cross-cutting repo-skeleton / toolchain / repo-governance work with no single subsystem owner (spec §1 runtime/toolchain + spec §2 root layout) |

### Why this resolution (minimal churn)

- Blesses the board's EXISTING `default` option — zero field pre-seed, zero renaming of the phase-0 plan stems / matrix pillar_ids / manifest paths already landed with the `default-` prefix.
- Alternative considered and not recommended: adding a `toolchain` domain row — truthful but forces a board option pre-seed AND a rename sweep across every phase-0 artifact (stems are load-bearing trace keys), for no governance gain over a blessed catch-all row.
- Verdict-shape note for the ripple run: single additive table row, no semantic change to any existing §Domains row, no PRD/spec impact, downstream sync = none → candidate for `MINOR_AUTONOMOUS` under the four-condition gate; the master-plan surface may force `GATED` per the ripple rubric — ripple decides, not Plan.
- NOTE (loop-2 review): an operator blessing WITHOUT a master-plan §Domains row is not a WORKFLOW §6.6-compliant trace — landing a §Domains row via this Ripple is the only compliant path to the board Domain write.

### Why higher layers do NOT change

- PRD: no requirement touches domain taxonomy.
- Arch spec: §Domains is a master-plan organizational table; spec sections are anchored per-subsystem and unaffected.

### Downstream docs to synchronize in the same PR

- None required: `docs/plans/subphases/default-phase-0-subphase-1-repo-skeleton-plan.md` (D1) and `docs/workflow/phase-planning/phase-0-planning-manifest.yaml` (tracker_admission_preconditions.domain) already describe this gate and need no edit when the row lands — the gate self-resolves.

### Optional companion (separate, Nit-severity — may be bundled or dropped)

Tighten master plan §Phase 0 exit-criterion wording from "repo layout matches spec §2" to "directory tree per spec §2 exists (named files land with their owning phases)" — codifying the harmonized interpretation the subphase plan documents in D4. Non-blocking; the subphase-level operationalization already governs Build.
