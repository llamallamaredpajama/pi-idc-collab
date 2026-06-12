# pi-idc-collab Architecture Plan

Date: 2026-06-11
Status: initial architecture seed

## Goal

Build `pi-idc-collab`: a standalone, installable Pi-based collaborative IDC runtime with CLI command `pi-idc`.

The system runs a flat, real-time coms-net agent network while preserving IDC governance:

```text
Think / Plan / Sequence / Ripple / Build triplets
```

The network is continuous and autonomous, but the IDC glass wall remains hard-enforced:

```text
Planning -> Build: GitHub issues/project only
Build -> Planning: Ripple only
```

## Package shape

Repo/package:

```text
pi-idc-collab
```

Installed CLI:

```bash
pi-idc
```

Implementation runtime:

```text
Bun/TypeScript
compiled binary via bun build --compile
```

The repo should be self-contained except for external system tools.

External prerequisites:

```text
pi
cmux
git
gh
GitHub repo + GitHub Projects V2
```

Self-contained assets in repo:

```text
extensions/
  coms-net.ts
  pi-idc-collab-harness.ts
  idc-role-harness.ts
  guard-shell-core.ts

skills/
  pi-idc-collab-protocol/
  fullauto-goal/
  think-grill/ or grill-me variant
  idc-workflow/
  role-specific IDC skills needed by profiles

profiles/
  think/
  plan/
  sequence/
  ripple/
  build-impl/
  build-review/
  build-finish/

config/
  pi-idc-collab.yaml

src/
  cli/
  governance/
  launcher/
  cmux/
  coms-net/
```

Copy/adapt working parts from `pi-harnesses`; do not depend on `pi-harnesses` at runtime.

## Claude plugin companion

Same repo, but plugin payload in a subdirectory:

```text
claude-plugin/
  .claude-plugin/plugin.json
  commands/
  skills/
```

The plugin is thin. It does not own runtime logic.

It shells out to the CLI:

```bash
pi-idc doctor
pi-idc governance compile
pi-idc governance check
pi-idc all
```

Version lockstep is required:

```text
plugin.json version == CLI package version == slash-command compatibility constant
```

Slash commands fail closed if CLI/plugin major versions differ.

Do not point the Claude plugin at the repo root. Use `claude-plugin/` as the plugin source so plugin installs do not pull the whole CLI source tree as plugin payload.

## Target repo requirements

`pi-idc-collab` v1 requires an existing IDC-governed GitHub repo.

Required target files:

```text
WORKFLOW.md
WORKFLOW-config.yaml
docs/workflow/tracker-config.yaml
.github/ISSUE_TEMPLATE/ticket.yml
```

Required tracker backend:

```yaml
backend: github
```

No filesystem backend in v1.

`pi-idc` does not initialize IDC workflow. If missing:

```text
BLOCKED: target repo is not IDC-governed.
Install IDC workflow first.
```

## Governance contract

Agents should not read all of `WORKFLOW.md` at every startup.

Use deterministic compiled sidecar:

```text
docs/workflow/pi-idc-governance-contract.yaml
```

Source layering:

```text
WORKFLOW.md                               human/normative governance
WORKFLOW-config.yaml                      repo/workflow compatibility
docs/workflow/tracker-config.yaml         GitHub tracker config
docs/workflow/pi-idc-governance-contract.yaml compiled machine lockfile
```

`WORKFLOW-config.yaml` should include:

```yaml
workflow:
  schema: idc
  version: 1
  contract_profile: pi-idc-collab/v1
  min_pi_idc_collab_version: "0.1.0"
```

Commands:

```bash
pi-idc governance compile
pi-idc governance check
```

`pi-idc all` should fail if the contract is missing/stale/unsupported. Do not auto-compile.

Agents consume:

- compiled governance contract
- per-run packet

Agents read `WORKFLOW.md` only for targeted gate/Ripple/ambiguity resolution.

### Compiled contract sketch

```yaml
schema_version: 1
compiler:
  name: pi-idc-collab
  version: 0.1.0
workflow:
  schema: idc
  version: 1
  contract_profile: pi-idc-collab/v1
source_hashes:
  WORKFLOW.md: sha256:<hash>
  WORKFLOW-config.yaml: sha256:<hash>
  docs/workflow/tracker-config.yaml: sha256:<hash>
  .github/ISSUE_TEMPLATE/ticket.yml: sha256:<hash>
tracker:
  backend: github
  required_project_fields:
    - Status
    - ClaimState
    - Wave
    - Phase
    - Track
    - Lane
    - Pillar trace key
    - Domain
glass_wall:
  planning_to_build: github_issues_only
  build_to_planning: ripple_only
build:
  default_pool: 3
  lane_shape: triplet
  triplet_flow: build-impl -> build-review -> build-finish
```

## Launch topology

v1 requires cmux.

No iTerm2 or Apple Terminal fallback in v1.

Use the latest working topology from `pi-harnesses`:

```text
one cmux workspace per agent
generated wrapper scripts
separate coms workspace only when needed
sanitized env
```

Default coms project:

```text
idc-collab-<repo>
```

Override allowed:

```bash
PI_IDC_COMS_PROJECT=...
```

## Commands

Primary commands:

```bash
pi-idc all
pi-idc all --build-pool 5

pi-idc planning
pi-idc build
pi-idc build --pool 5

pi-idc server
pi-idc run think

pi-idc doctor
pi-idc governance compile
pi-idc governance check
```

Convenience:

```bash
pi-idc think plan ripple
pi-idc build-pool-5
```

`pi-idc all` launches full network by default.

Default build pool:

```text
3 build triplets
```

## Agent network

Default `pi-idc all`:

```text
think
plan
sequence
ripple

build-impl-1
build-review-1
build-finish-1

build-impl-2
build-review-2
build-finish-2

build-impl-3
build-review-3
build-finish-3
```

Build pool N means:

```text
N implementers
N reviewers
N finishers
```

Each triplet acts as one logical IDC Build worker.

## Glass wall rules

Hard-enforced by a new extension:

```text
pi-idc-collab-harness.ts
```

Existing/adapted guard:

```text
idc-role-harness.ts
```

Responsibilities:

```text
idc-role-harness:
  file/path authority
  bash mutation authority
  live-op gate

pi-idc-collab-harness:
  coms ACLs
  glass wall routing
  build lane protocol
  build triplet flow
  Ripple-only retrograde bridge
```

Routing:

```text
think -> plan/ripple only
plan -> think/sequence/ripple only
sequence -> plan/ripple only
ripple -> planning side + build-finish only as allowed retrograde bridge
build-impl-N -> build-review-N only
build-review-N -> build-finish-N only
build-finish-N -> ripple only for upstream drift
```

Planning cannot message Build directly.

Build cannot message Plan/Sequence/Think directly.

## Planning side

Conceptual flow:

```text
Think:
  uses think-grill / grill-me style interrogation
  creates considerations

Plan:
  consumes considerations
  horizontally cuts into domain-specific technical plans
  creates canonical planning artifacts per WORKFLOW.md

Sequence:
  vertically cuts plans
  performs matrix/wave analysis
  admits work into GitHub Project/issues

Ripple:
  retrograde-only governance bridge
  decides highest affected layer for upstream corrections
```

Think/Plan/Sequence/Ripple should likely use worktrees in v1 because the network is continuous and concurrent.

Recommended but still needs exact design:

```text
one worktree/branch per planning writer role
PR/automerge when WORKFLOW.md allows
Ripple mediates canonical conflicts
```

## Build triplets

Each triplet is one logical IDC Build actor.

Flow:

```text
build-impl-N -> build-review-N -> build-finish-N
```

### build-impl-N

Acts as the engine.

Responsibilities:

```text
poll/query GitHub tracker
select next eligible issue
run matrix dispatch-check
bookend-open / claim through tracker adapter
create issue worktree/branch
invoke /fullauto-goal on issue
implement with TDD inside fullauto-goal loop
open/prepare PR artifacts
send evidence to paired reviewer
```

Required local skill:

```text
fullauto-goal
```

### build-review-N

Read-only reviewer.

Responsibilities:

```text
review PR/diff/tests
run allowed non-mutating checks
produce structured findings
send findings downstream to build-finish-N
```

### build-finish-N

Caboose/radio/finalizer.

Responsibilities:

```text
receive review findings
apply accepted fixes if needed
run final verification
merge/cleanup
bookend-close / release claim through tracker adapter
send Ripple request if upstream drift discovered
```

Externally, the tracker sees normal IDC Build lifecycle only. No new tracker states.

## Tracker compatibility

Do not invent new issue labels/schema.

Use existing IDC GitHub tracker contract.

Project fields:

```text
Status
ClaimState
Wave
Phase
Track
Lane
Pillar trace key
Domain
```

Issue template fields:

```text
Trace
Surfaces
Dependencies
Exit Gate
```

All tracker writes go through the existing/adapted tracker adapter contract.

No direct `gh project item-edit` from agents except through approved adapter/runtime.

## Model behavior

`pi-idc` should not force a model by default.

Do not pass `--model` unless user explicitly configures it.

This lets Pi use the user's normal/default model behavior.

Explicit overrides still allowed:

```bash
pi-idc all --model ...
PI_IDC_MODEL=... pi-idc all
PI_IDC_BUILD_IMPL_MODEL=... pi-idc build
```

No warning if no explicit model is set.

## Autonomy posture

Default goal:

```text
autonomous, self-reviewing, self-correcting continuous build machine
```

But it obeys the target repo's `WORKFLOW.md`.

Future gate philosophy is controlled by `WORKFLOW.md`, not hardcoded into `pi-idc`.

If tomorrow the workflow says only PRD is operator-gated, `pi-idc` follows that after governance contract recompile.

## Implementation phases

1. Create standalone repo skeleton.
2. Copy/adapt:
   - coms-net
   - cmux launcher topology
   - guard-shell-core
   - idc-role-harness
3. Build CLI skeleton:
   - `doctor`
   - `governance compile/check`
   - `server`
   - `run`
   - `all`
4. Implement governance contract compiler/checker.
5. Implement profile/catalog system.
6. Implement cmux fan-out.
7. Implement `pi-idc-collab-harness` coms ACL/glass wall.
8. Add build triplet lane protocol.
9. Vendor/package skills.
10. Add Claude companion plugin.
11. End-to-end test in an IDC GitHub repo.

## Open design items

- Exact planning-side worktree/merge/deconflict policy.
- Exact deterministic governance contract schema and compiler implementation.
- Exact triplet claim protocol between `build-impl-N`, `build-review-N`, and `build-finish-N`.
- Exact skill list per role after vendoring.
- Exact package/install/Homebrew release story.
