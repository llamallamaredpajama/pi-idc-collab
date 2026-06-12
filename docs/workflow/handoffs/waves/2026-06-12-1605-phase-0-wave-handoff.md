---
role: sequence
next_role: build
auto_advance_eligible: true
auto_advance_reason: ""
open_questions: 0
blocking_todos: 0
pipeline: codebase
---

# Wave handoff — Phase 0 admission

## Pick up here

Build should begin from GitHub Project #5 after Sequence admission:

- Issue #3 — `default-phase-0-subphase-1-pillar-1-toolchain` — Project `Wave 1`, `Status=Pending`, `ClaimState=Unclaimed`.
- Issue #4 — `default-phase-0-subphase-1-pillar-2-layout` — Project `Wave 1`, `Status=Pending`, `ClaimState=Unclaimed`.
- Issue #5 — `default-phase-0-subphase-1-pillar-3-ci-attribution` — Project `Wave 2`, `Status=Pending`, `ClaimState=Unclaimed`, blocked by #3.

Expected build order: #3 and #4 are parallel-safe; #5 waits for #3.

## What just landed

- Sequence admitted three Phase 0 polished pillars to GitHub Project #5.
- Archived admitted pillar plans under `docs/plans/pillars/archive/`.
- Updated `docs/workflow/pillar-matrices/phase-0-matrix.yaml` plan paths to archive locations.
- Added generated matrix views:
  - `docs/workflow/pillar-matrices/phase-0-dag.mmd`
  - `docs/workflow/pillar-matrices/phase-0-parallel-safety.md`
  - `docs/workflow/pillar-matrices/phase-0-waves.md`
- Run audit: `docs/workflow/audits/2026-06-12-1605-sequence-run-audit.md`

## Verification (drift detection for resume)

- Tracker export: `/tmp/idc-sequence/2026-06-12-1605-phase-0-admit/tracker-state.json`
- Tracker item packet: `/tmp/idc-sequence/2026-06-12-1605-phase-0-admit/tracker-items.json`
- Required readback: `gh project item-list 5 --owner llamallamaredpajama --limit 100 --format json` contains all three pillar trace keys with Status `Pending` and ClaimState `Unclaimed`.
- Dependency readback: `gh issue view 5 --comments` includes `Blocked by #3`.

## Per-pillar /goal recipes

### Issue #3 — default-phase-0-subphase-1-pillar-1-toolchain

Pillar plan: `docs/plans/pillars/archive/default-phase-0-subphase-1-pillar-1-toolchain-plan.md`

Verbatim Exit criteria:

- `bun install && bun test` exits 0 from a fresh clone of the repo root (≥1 passing test; empty-suite caveat per subphase plan D5).
- `git check-ignore -q .claude/worktrees/probe` exits 0 (worktree ignore coverage live).
- `bun pm ls` exits 0 (manifest + lockfile consistent).
- **[CONSTRAINTS]** Don't regress: zero runtime dependencies added (devDependencies only if strictly required, e.g. `@types/bun`); no writes outside this pillar's owned surfaces — especially not `extensions/`, `skills/`, `profiles/`, `config/`, `src/`, `claude-plugin/`, `.github/`, `ATTRIBUTIONS.md`, or any `docs/` / `WORKFLOW*` file; existing `.gitignore` entries preserved (append-only).

Resource Ownership:

- `package.json`, `tsconfig.json`, `bun.lock`, `.gitignore`, `tests/smoke.test.ts` — exclusive.

writer-recipe: `/fullauto-goal issue #3: write tests/smoke.test.ts first, verify expected red if the runner/config is absent, add minimal Bun/TS package scaffold and lockfile, append .claude/worktrees/ to .gitignore, then verify bun install && bun test, bun pm ls, and git check-ignore.`

fixer-recipe: address Blocker/Major review findings within the same surfaces; do not touch layout, CI, attribution, docs, WORKFLOW, or tracker schema; file Ripple if the pillar plan is wrong.

### Issue #4 — default-phase-0-subphase-1-pillar-2-layout

Pillar plan: `docs/plans/pillars/archive/default-phase-0-subphase-1-pillar-2-layout-plan.md`

Verbatim Exit criteria:

- The layout verification command exits 0: `for d in extensions config skills/pi-idc-collab-protocol skills/fullauto-goal skills/think-grill skills/idc-workflow profiles/think profiles/plan profiles/sequence profiles/ripple profiles/build-impl profiles/build-review profiles/build-finish src/cli src/governance src/launcher src/cmux src/coms-net claude-plugin/.claude-plugin claude-plugin/commands claude-plugin/skills; do test -d "$d" || exit 1; done`
- `git ls-files --others --exclude-standard` prints nothing after commit (no untracked leftovers).
- Placeholder tracking proof: `for d in extensions config skills/pi-idc-collab-protocol skills/fullauto-goal skills/think-grill skills/idc-workflow profiles/think profiles/plan profiles/sequence profiles/ripple profiles/build-impl profiles/build-review profiles/build-finish src/cli src/governance src/launcher src/cmux src/coms-net claude-plugin/.claude-plugin claude-plugin/commands claude-plugin/skills; do git ls-files --error-unmatch "$d/.gitkeep" >/dev/null 2>&1 || exit 1; done` exits 0.
- Phase-assembly check (not standalone-lane): `[ ! -f package.json ] || bun test` exits 0.
- **[CONSTRAINTS]** Don't regress: shells only — zero named files created inside the tree (no `.ts`, no `.yaml`, no `plugin.json`); `docs/workflow/pi-idc-governance-contract.yaml` not created; the PRD §8 `<role-specific skills>` open item not pre-resolved; no writes outside the six owned directory surfaces.

Resource Ownership:

- `extensions/`, `skills/`, `profiles/`, `config/`, `src/`, `claude-plugin/` — exclusive shell directories only.

writer-recipe: `/fullauto-goal issue #4: create exactly the spec §2 directory shells with .gitkeep placeholders, no named runtime/config/plugin files, then verify the directory and git tracking commands.`

fixer-recipe: address Blocker/Major review findings within the same shell-directory surfaces only; do not touch package/toolchain, CI/attribution, docs, WORKFLOW, or tracker schema; file Ripple if the pillar plan is wrong.

### Issue #5 — default-phase-0-subphase-1-pillar-3-ci-attribution

Pillar plan: `docs/plans/pillars/archive/default-phase-0-subphase-1-pillar-3-ci-attribution-plan.md`

Verbatim Exit criteria:

- `gh pr checks <pr-number>` reports the `ci` workflow green on this pillar's PR (workflow executed `bun install && bun test` successfully).
- `grep -q "^## Attribution header convention" ATTRIBUTIONS.md && grep -q "^## License notice preservation" ATTRIBUTIONS.md && grep -q "^## Adapted files" ATTRIBUTIONS.md && grep -q "preserved verbatim" ATTRIBUTIONS.md && grep -qF "| File | Source (pi-harnesses path) | Adaptation note | License |" ATTRIBUTIONS.md` exits 0.
- `grep -E "continue-on-error|\|\| true" .github/workflows/ci.yml` exits non-zero.
- `bun install && bun test` still exits 0 locally.
- **[CONSTRAINTS]** Don't regress: existing suite stays green; no new dependencies; no writes outside `.github/workflows/ci.yml` and `ATTRIBUTIONS.md`; no branch-protection or repo-settings mutation; the workflow must not weaken to warn-only.

Resource Ownership:

- `.github/workflows/ci.yml`, `ATTRIBUTIONS.md` — exclusive.

writer-recipe: `/fullauto-goal issue #5 after #3 completes: add a fail-closed GitHub Actions workflow running bun install && bun test and add ATTRIBUTIONS.md with the required headings/table; verify grep checks, local Bun tests, and PR checks.`

fixer-recipe: address Blocker/Major review findings within `.github/workflows/ci.yml` and `ATTRIBUTIONS.md` only; do not touch package/toolchain except to consume it, layout shells, docs, WORKFLOW, or tracker schema; file Ripple if the pillar plan is wrong.

## Open questions / operator decisions pending

None.

## Notes for resume

- No Track field was mutated; Track remains operator/Ripple-governed.
- Build should use the tracker adapter for any Status promotion, ClaimState/Lane bookend writes, and bookend-close.
- Project #5 issue numbers from this admission are #3, #4, and #5.
