# Ripple change order — GitHub-only tracker contract

Trigger: Major finding 2 of `.code-review/2026-06-12-all-today-review.md` (schema-contract + stale-docs reviewers): governance sidecars still admitted a filesystem tracker backend even though v1 requires GitHub Projects only.

Pipeline: governance
Verdict: GATED
Master Plan Section: n/a — governance sidecar synchronization only
Affected Role/Skill Authority: Tracker adapter dispatch, Sequence tracker admission, Build bookend mechanics
Highest affected layer: WORKFLOW.md §2/§6 tracker contract

Operator gate status: satisfied by operator approval of `/Users/jeremy/.claude/plans/eager-yawning-muffin.md` on 2026-06-12.

## Drift evidence

- PRD R-04 (`docs/prd/prd.md`) requires target `tracker-config.yaml` to declare `backend: github` and forbids filesystem-backend behavior in v1.
- CLAUDE.md and AGENTS.md both state the non-negotiable architecture decision: `backend: github` is required, with no filesystem backend behavior unless a later explicit plan admits it.
- Pre-edit WORKFLOW.md §2 listed `filesystem` as a selectable tracker backend and described a repo-root tracker file option.
- Pre-edit WORKFLOW.md §6.1 admitted both `github` and `filesystem`; §6.2 documented tracker-file create semantics and a cutover op; §6.7 documented lane/bookend mechanics for that backend; §6.8 documented outage cutover behavior.
- Pre-edit `WORKFLOW-config.yaml` and `docs/workflow/tracker-config.yaml` comments advertised `github | filesystem`, contradicting the GitHub-only v1 contract.

## Proposed canonical edit

Narrow WORKFLOW.md §2/§6 and the two tracker sidecar comments to the v1 GitHub-only contract:

- `docs/workflow/tracker-config.yaml::backend` recognizes only `github`.
- The tracker adapter dispatches only to `idc:idc-skill-github-tracker-implementation`.
- Ticket creation, lane pointers, bookend events, and failure posture are described as GitHub-backed only.
- Backend cutover is removed from v1; future backends require an explicit plan plus a Ripple change order.

## Why higher layers do not change

- PRD: no change required. PRD R-04 already mandates GitHub-only tracker behavior for v1.
- Architecture spec: no change required. The spec already treats the GitHub issue template and GitHub tracker contract as required target-repo surfaces.
- Master plan: no scope, sequencing, or implementation phase semantics change. This Ripple synchronizes governance sidecars down to already-approved PRD/spec requirements.

## Downstream sync list

- `WORKFLOW-config.yaml` — same commit; root-sidecar tracker comment narrowed to GitHub-only.
- `docs/workflow/tracker-config.yaml` — same commit; header and backend comment narrowed to GitHub-only.
- No planning-artifact edits required. Historical seed plans remain historical and are not rewritten by this Ripple.

## CLAUDE.md tree impact

none — no agent-instruction file changes.

## Architectural-fitness obligations

- Verify `grep -n "filesystem" WORKFLOW.md WORKFLOW-config.yaml docs/workflow/tracker-config.yaml` reports only the v1 non-admission sentence in WORKFLOW.md.
- Verify `grep -n "flip-to-filesystem\|TRACKER.md" WORKFLOW.md` reports no hits.
- Verify `grep -En "^#{2,3} [0-9]" WORKFLOW.md` preserves the §1–§6.8 anchor set.
- Verify `bun test` passes.

## Operator gates and current gate status

This Ripple is GATED because WORKFLOW.md is the highest affected governance layer and the change removes an admitted tracker backend from the governance contract. The operator gate was satisfied by approval of `/Users/jeremy/.claude/plans/eager-yawning-muffin.md` on 2026-06-12.

## Return path

Return to Build/doctor implementation after the GitHub-only tracker contract is main-reachable.

## Ledger destination

`docs/workflow/ledgers/2026-06-12-ripple-gated-ledger.md` — append/update with the merge SHA for this change order if the repo later formalizes the gated ledger.
