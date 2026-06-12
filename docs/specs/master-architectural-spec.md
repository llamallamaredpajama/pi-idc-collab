# pi-idc-collab — Master Architectural Spec

Status: v1 canonical draft — authored 2026-06-12 under operator-approved drafting
(Engineer Gate, WORKFLOW.md §4.2); merge/commit is operator-gated.
Upstream: `docs/prd/prd.md` (cited as "PRD §…"). Evidence base:
`docs/plans/2026-06-11-pi-idc-collab-architecture.md` (cited as "seed §…") and root
`CLAUDE.md` (cited as "CLAUDE.md §…").

> Section numbers are stable. Downstream docs cite this file by anchor (e.g.
> "spec §7.2"). Keep numbering stable when editing.

## 1. Runtime & distribution

Bun/TypeScript throughout; the CLI distributes as a compiled binary via
`bun build --compile` (per seed §Package shape; PRD §3). Deterministic subsystems
(governance compiler, contract checker) stay dependency-light: stable YAML
serialization and raw-byte SHA-256 hashing are correctness requirements, not styling
preferences (per CLAUDE.md §Development rules; PRD §6).

External prerequisites (system tools only — everything else ships in-repo):
`pi`, `cmux`, `git`, `gh`, and a GitHub repository with Projects V2 (per seed
§Package shape; PRD §6).

## 2. Repository layout

Per seed §Package shape; the repo is self-contained (PRD §4 R-01, R-11):

```text
extensions/
  coms-net.ts                 # adapted from pi-harnesses (attributed)
  pi-idc-collab-harness.ts    # NEW — coms ACLs / glass wall / lane protocol
  idc-role-harness.ts         # adapted — file/path + bash mutation authority
  guard-shell-core.ts         # adapted — guard substrate

skills/
  pi-idc-collab-protocol/     # network protocol skill
  fullauto-goal/              # required by build-impl (PRD §4 R-12)
  think-grill/                # grill-me variant for Think
  idc-workflow/               # role-facing IDC governance skill
  <role-specific IDC skills>  # exact list = open item (PRD §8)

profiles/
  think/  plan/  sequence/  ripple/
  build-impl/  build-review/  build-finish/

config/
  pi-idc-collab.yaml

src/
  cli/         # command surface (seed §Commands)
  governance/  # contract compiler/checker (§4 below)
  launcher/    # process/wrapper generation
  cmux/        # workspace fan-out (§5 below)
  coms-net/    # server + client plumbing

claude-plugin/               # plugin payload ONLY (§11 below)
  .claude-plugin/plugin.json
  commands/
  skills/
```

Copy/adapt working parts from `/Users/jeremy/dev/proj/pi-harnesses` — reference
files enumerated in CLAUDE.md §Source references — with attribution and preserved
license notices; never a runtime dependency (per seed §Package shape; CLAUDE.md §NN).

## 3. Target-repo contract

`pi-idc` operates **inside an existing IDC-governed GitHub repo** and never
initializes one (PRD §4 R-03). Required target files (per seed §Target repo
requirements):

```text
WORKFLOW.md
WORKFLOW-config.yaml
docs/workflow/tracker-config.yaml      # must declare backend: github (PRD §4 R-04)
.github/ISSUE_TEMPLATE/ticket.yml
```

Missing or non-conforming governance → fail-closed:
`BLOCKED: target repo is not IDC-governed. Install IDC workflow first.`

The target's `WORKFLOW-config.yaml` carries the compatibility block (per seed
§Governance contract):

```yaml
workflow:
  schema: idc
  version: 1
  contract_profile: pi-idc-collab/v1
  min_pi_idc_collab_version: "0.1.0"
```

## 4. Governance contract subsystem

Agents do not read all of `WORKFLOW.md` at startup (PRD §4 R-08). Source layering
(per seed §Governance contract):

| Layer | File | Role |
|-------|------|------|
| Normative | `WORKFLOW.md` | human/normative governance |
| Compatibility | `WORKFLOW-config.yaml` | repo/workflow compatibility |
| Tracker | `docs/workflow/tracker-config.yaml` | GitHub tracker config |
| Compiled | `docs/workflow/pi-idc-governance-contract.yaml` | machine lockfile |

`pi-idc governance compile` produces the sidecar; `pi-idc governance check`
validates it. `pi-idc all` fails if the contract is missing, stale (source-hash
mismatch), or unsupported (profile/version) — and **never auto-compiles** (per seed
§Governance contract).

Compiled contract shape (schema details are an open item, PRD §8; sketch per seed
§Compiled contract sketch):

```yaml
schema_version: 1
compiler: {name: pi-idc-collab, version: <pkg>}
workflow: {schema: idc, version: 1, contract_profile: pi-idc-collab/v1}
source_hashes:            # raw-byte sha256 of the four §3 source files
tracker:
  backend: github
  required_project_fields: [Status, ClaimState, Wave, Phase, Track, Lane,
                            Pillar trace key, Domain]
glass_wall:
  planning_to_build: github_issues_only
  build_to_planning: ripple_only
build: {default_pool: 3, lane_shape: triplet,
        triplet_flow: build-impl -> build-review -> build-finish}
```

Agents consume the compiled contract plus a per-run packet; they read `WORKFLOW.md`
itself only for targeted gate/Ripple/ambiguity resolution (per seed §Governance
contract).

## 5. Launch topology (cmux)

v1 requires cmux; no terminal fallback (PRD §4 R-05). Adopt the latest working
topology from `pi-harnesses` (per seed §Launch topology):

- one cmux workspace per agent;
- generated wrapper scripts;
- a separate coms workspace only when needed;
- sanitized environment for spawned agents.

Default coms project name: `idc-collab-<repo>`, overridable via
`PI_IDC_COMS_PROJECT` (per seed §Launch topology).

## 6. Agent network topology

Default `pi-idc all` network (per seed §Agent network; PRD §7.3):

```text
think   plan   sequence   ripple          # planning side
build-impl-N  build-review-N  build-finish-N   # N = 1..pool (default 3)
```

`--build-pool N` / `--pool N` scales triplets: N implementers, N reviewers,
N finishers. Each triplet acts externally as ONE logical IDC Build worker (PRD §4
R-07). Convenience invocations (`pi-idc think plan ripple`, `pi-idc build-pool-5`)
launch subsets (per seed §Commands).

## 7. Glass wall enforcement

### 7.1 Two-extension split

| Extension | Authority |
|-----------|-----------|
| `idc-role-harness.ts` (adapted) | file/path authority; bash mutation authority; live-op gate |
| `pi-idc-collab-harness.ts` (new) | coms ACLs; glass-wall routing; build lane protocol; build triplet flow; Ripple-only retrograde bridge |

(per seed §Glass wall rules)

### 7.2 Routing table (hard-enforced ACLs)

```text
think          -> plan, ripple                         only
plan           -> think, sequence, ripple              only
sequence       -> plan, ripple                         only
ripple         -> planning side + build-finish-N       (sole retrograde bridge)
build-impl-N   -> build-review-N                       only
build-review-N -> build-finish-N                       only
build-finish-N -> ripple                               only (upstream drift)
```

Planning cannot message Build directly; Build cannot message Plan/Sequence/Think
directly (per seed §Glass wall rules; PRD §4 R-06). Work flows forward exclusively
through GitHub issues/the project board.

## 8. Planning side

Role flow (per seed §Planning side): Think interrogates (think-grill/grill-me
style) and creates considerations; Plan consumes considerations and cuts
horizontally into domain-specific canonical planning artifacts per the target
repo's `WORKFLOW.md`; Sequence cuts vertically (matrix/wave analysis) and admits
work into the GitHub Project/issues; Ripple is the retrograde-only governance
bridge deciding the highest affected layer for upstream corrections.

Because the network is continuous and concurrent, planning writers are expected to
use worktrees (one worktree/branch per planning writer role, PR/automerge where the
target `WORKFLOW.md` allows, Ripple mediating canonical conflicts). The exact
worktree/merge/deconflict policy is an open item (per seed §Planning side; PRD §8).

## 9. Build triplet architecture

Flow: `build-impl-N → build-review-N → build-finish-N` (per seed §Build triplets).

- **build-impl-N (engine):** polls/queries the GitHub tracker; selects the next
  eligible issue; runs matrix dispatch-check; bookend-opens/claims through the
  tracker adapter; creates the issue worktree/branch; invokes `/fullauto-goal`
  (TDD inside the loop); prepares PR artifacts; sends evidence to its paired
  reviewer. Requires the package-local `fullauto-goal` skill (PRD §4 R-12).
- **build-review-N (read-only reviewer):** reviews PR/diff/tests; runs allowed
  non-mutating checks; produces structured findings; sends them to its paired
  finisher.
- **build-finish-N (caboose/finalizer):** applies accepted fixes; runs final
  verification; merges/cleans up; bookend-closes/releases the claim through the
  tracker adapter; sends a Ripple request on upstream drift.

Externally the tracker sees only the normal IDC Build lifecycle — no new tracker
states (per seed §Build triplets; PRD §4 R-11). The intra-triplet claim protocol is
an open item (PRD §8).

## 10. Tracker compatibility

Use the existing IDC GitHub tracker contract unmodified (per seed §Tracker
compatibility; PRD §4 R-11):

- Project fields: `Status`, `ClaimState`, `Wave`, `Phase`, `Track`, `Lane`,
  `Pillar trace key`, `Domain`.
- Issue template fields: `Trace`, `Surfaces`, `Dependencies`, `Exit Gate`.
- ALL tracker writes go through the existing/adapted tracker adapter contract; no
  direct `gh project item-edit` from agents outside the approved adapter/runtime.
- Tests preserve fixtures proving no new tracker schema/labels/states are invented
  (per CLAUDE.md §Development rules).

## 11. Claude plugin companion

Thin by contract (PRD §4 R-10; per seed §Claude plugin companion):

- Lives at `claude-plugin/` — the plugin source root is the subdirectory, NOT the
  repo root, so installs don't pull the CLI source tree as payload.
- Shells out for all behavior: `pi-idc doctor`, `pi-idc governance compile`,
  `pi-idc governance check`, `pi-idc all`. No duplicated runtime logic.
- Version lockstep: `plugin.json` version == CLI package version == slash-command
  compatibility constant; slash commands fail closed when CLI/plugin major
  versions differ.

## 12. Model behavior

`pi-idc` never passes `--model` unless explicitly configured (PRD §4 R-09).
Explicit override surfaces: `pi-idc all --model …`, `PI_IDC_MODEL`, and per-role
variables (e.g. `PI_IDC_BUILD_IMPL_MODEL`). No warning when unset — Pi's normal
default-model behavior applies (per seed §Model behavior).

## 13. Autonomy & gate philosophy

Default posture: autonomous, self-reviewing, self-correcting continuous build
machine — that nonetheless obeys the target repo's `WORKFLOW.md`. Gate philosophy is
data (recompiled governance contract), not code: if the target workflow changes
which artifacts are operator-gated, `pi-idc` follows after recompile (per seed
§Autonomy posture; PRD §5).

## 14. Open architectural items

Mirrors PRD §8 at the technical layer (per seed §Open design items):

1. Planning-side worktree/merge/deconflict policy (§8).
2. Deterministic governance contract schema + compiler implementation (§4).
3. Intra-triplet claim protocol (§9).
4. Vendored skill list per role (§2 `skills/`).
5. Package/install/Homebrew release story (§1).
