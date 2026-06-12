# pi-idc-collab — Master Implementation Plan

Status: v1 canonical draft — authored 2026-06-12 under operator-approved drafting
(Engineer Gate, WORKFLOW.md §4.2); merge/commit is operator-gated.
Upstream: `docs/prd/prd.md` (PRD) and `docs/specs/master-architectural-spec.md`
(spec). Evidence base: `docs/plans/2026-06-11-pi-idc-collab-architecture.md`
§Implementation phases (cited as "seed §Phases item N").

> **RFD discipline.** This plan stops at the §Phase boundary. Subphase plans and
> pillar plans are Plan-role artifacts derived later (`docs/plans/subphases/`,
> `docs/plans/pillars/`); naming candidate pillars here is a governance violation.
> Each §Phase below is a module sketch: what it owns, what is intentionally out of
> scope, and its exit criteria.

## Domains

Master-plan §Domain traces (tracker `Domain` field values derive from these):

| Domain | Spec anchor |
|--------|-------------|
| `cli` | spec §1, §6 commands surface |
| `governance` | spec §4 |
| `launcher-cmux` | spec §5 |
| `coms-net` | spec §2 `src/coms-net/` |
| `harness` | spec §7 (both extensions) |
| `build-lane` | spec §9 |
| `assets` | spec §2 `skills/`, `profiles/`, `config/` |
| `plugin` | spec §11 |

## Phase 0 — Repo skeleton & toolchain

Owns: the Bun/TypeScript package scaffold — `package.json`, `tsconfig`, directory
tree per spec §2, test runner wiring, CI seed, license/attribution scaffolding for
adapted code (per seed §Phases item 1). Out of scope: any runtime behavior; any
copied `pi-harnesses` code. Exit: `bun install && bun test` runs green on an empty
test suite; repo layout matches spec §2; attribution conventions documented.

## Phase 1 — Vendor adapted core

Owns: copying/adapting the four working parts from `pi-harnesses` with attribution —
`coms-net.ts` (+ its server), the cmux launcher topology, `guard-shell-core.ts`, and
`idc-role-harness.ts` — compiling under this repo's toolchain with their existing
behavior preserved (per seed §Phases item 2; spec §2). Out of scope: the new
`pi-idc-collab-harness` extension (Phase 6); any `pi-idc`-specific behavior changes
beyond what compilation requires. Exit: adapted modules build and their adapted
launcher tests pass in-repo; zero runtime imports from `pi-harnesses`
(PRD §4 R-01).

## Phase 2 — CLI skeleton

Owns: the `pi-idc` command surface — `doctor`, `governance compile`, `governance
check`, `server`, `run <role>`, `all` — as parse/dispatch/help scaffolding with
fail-closed stubs where subsystems don't exist yet (per seed §Phases item 3; spec
§1, PRD §4 R-02). `doctor` lands here in working form: target-repo contract checks
per spec §3, including the `BLOCKED: target repo is not IDC-governed` refusal
(PRD §4 R-03). Out of scope: real contract compilation (Phase 3), real launches
(Phases 5–7). Exit: every command exists, `doctor` verifies a fixture IDC repo and
fail-closes on a non-IDC fixture; tests cover both.

## Phase 3 — Governance contract compiler/checker

Owns: the deterministic `src/governance/` subsystem — stable-YAML emit, raw-byte
SHA-256 source hashing, the compiled sidecar at
`docs/workflow/pi-idc-governance-contract.yaml`, `compile`/`check` semantics, and
the `pi-idc all` staleness fail-close with no auto-compile (per seed §Phases item 4;
spec §4; PRD §4 R-08). The exact contract schema is finalized inside this phase
(spec §14 item 2). Out of scope: agent-side consumption (Phases 5–7). Exit:
compile→check round-trips byte-identically; mutating any source file flips `check`
and `all` to fail-closed; fixtures prove hash stability.

## Phase 4 — Profile/catalog system

Owns: the role profile and asset catalog — `profiles/` for the seven roles
(think/plan/sequence/ripple/build-impl/build-review/build-finish), `config/
pi-idc-collab.yaml`, and the resolution logic mapping role → profile → skills →
extensions, all package-local (per seed §Phases item 5; spec §2; PRD §4 R-01
self-containment). Out of scope: the contents of vendored skills (Phase 8); process
launch (Phase 5). Exit: catalog resolution is fully unit-tested; a missing required
asset is a fail-closed error, not a warning.

## Phase 5 — cmux fan-out

Owns: `src/cmux/` + `src/launcher/` — one workspace per agent, generated wrapper
scripts, sanitized env, optional separate coms workspace, coms project naming
`idc-collab-<repo>` with `PI_IDC_COMS_PROJECT` override, and model-flag pass-through
rules (only when explicitly configured; PRD §4 R-09) (per seed §Phases item 6; spec
§5, §12). Out of scope: coms ACLs (Phase 6). Exit: `pi-idc all` fans out the
13-agent default network in cmux against a test repo; absence of cmux fail-closes
(PRD §4 R-05).

## Phase 6 — Glass-wall harness

Owns: the new `extensions/pi-idc-collab-harness.ts` — coms ACLs implementing the
spec §7.2 routing table verbatim, glass-wall routing (planning→Build via issues
only; Build→planning via Ripple only), and the Ripple retrograde bridge to
build-finish lanes (per seed §Phases item 7; spec §7; PRD §4 R-06). Out of scope:
intra-triplet lane protocol details (Phase 7). Exit: routing tests prove every
forbidden edge is refused and every allowed edge passes; a planning agent cannot
reach a build agent in a live fixture network.

## Phase 7 — Build triplet lane protocol

Owns: the lane protocol making `build-impl-N → build-review-N → build-finish-N`
behave externally as one logical IDC Build worker — issue selection/claim through
the tracker adapter, bookend-open/close, evidence handoff impl→review→finish, fix
application and final verification at finish, and the Ripple-request path on
upstream drift (per seed §Phases item 8; spec §9, §10; PRD §4 R-07, R-11). The
intra-triplet claim protocol design (spec §14 item 3) is finalized inside this
phase. Out of scope: the `fullauto-goal` skill content (Phase 8). Exit: a triplet
drives a fixture issue through the full lifecycle with the tracker seeing only
standard IDC Build states; fixtures prove no schema/label invention.

## Phase 8 — Vendor/package skills

Owns: the package-local `skills/` tree — `fullauto-goal` (PRD §4 R-12),
`pi-idc-collab-protocol`, the think-grill variant, `idc-workflow`, and the
role-specific IDC skills the profiles reference; finalizing the per-role skill list
(spec §14 item 4) (per seed §Phases item 9; spec §2). Out of scope: Claude-plugin
packaging (Phase 9). Exit: every profile's skill references resolve in-repo with no
reads of `~/.agents/skills` or `~/.claude/skills`; catalog tests from Phase 4 pass
against the real tree.

## Phase 9 — Claude companion plugin

Owns: `claude-plugin/` — `plugin.json`, slash commands shelling out to `pi-idc
doctor` / `governance compile` / `governance check` / `all`, the version-lockstep
constant, and the major-version fail-close (per seed §Phases item 10; spec §11;
PRD §4 R-10). Out of scope: any runtime logic in the plugin. Exit: plugin installs
from `claude-plugin/` (not repo root); each command shells out correctly; a
deliberate version skew fails closed in tests.

## Phase 10 — End-to-end validation

Owns: the v1 acceptance run — `pi-idc all` against a real IDC-governed GitHub repo,
exercising PRD §7 criteria 1–5 end to end, plus the package/install story decision
(Homebrew or otherwise; spec §14 item 5) (per seed §Phases item 11). Out of scope:
new features — this phase only hardens and evidences. Exit: all five PRD §7
acceptance criteria demonstrated and recorded; install path documented and tested
from a clean machine profile.

## Cross-phase rules

- Tests land with each phase, never bulked at the end (per CLAUDE.md §Development
  rules); fixtures proving tracker-schema fidelity (PRD §4 R-11) accumulate from
  Phase 2 onward.
- Fail-closed beats warnings at every compatibility seam — governance, tracker,
  cmux, plugin/CLI versions (per CLAUDE.md §Development rules; PRD §6).
- Adapted `pi-harnesses` code carries attribution and license notices from the
  moment it lands (Phase 1; per CLAUDE.md §Development rules).
- Open items (PRD §8 / spec §14) resolve inside their owning phase via the IDC
  chain; if resolution changes the PRD or this spec/plan, it routes through Ripple,
  not direct edits.
