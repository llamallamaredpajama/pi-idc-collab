# Ripple change order — Domain taxonomy default row

Trigger: Plan handoff `docs/workflow/handoffs/phases/2026-06-12-1153-phase-0-repo-skeleton.md` §Appendix: Ripple proposal — Domain taxonomy; Sequence admission for Phase 0 cannot write the GitHub Project `Domain` field until the selected value matches a master-plan §Domain trace per WORKFLOW.md §6.6.

Pipeline: codebase
Verdict: MINOR_AUTONOMOUS
Master Plan Section: `docs/plans/master-implementation-plan.md` §Domains
Affected Role/Skill Authority: Sequence tracker admission (`Domain` field), Plan handoff resume chain
Highest affected layer: master plan §Domains table

## Drift evidence

- WORKFLOW.md §6.3 defines `Domain` as the tracker single-select field whose value is a master-plan §Domain trace.
- WORKFLOW.md §6.6 assigns `Domain` to Sequence at tracker admit and requires it to match the master-plan §Domain trace.
- The landed Phase 0 planning artifacts use the `default-` trace-key stem and the GitHub Project already has a `default` Domain option, but the master-plan §Domains table did not include `default` before this change.
- Therefore Sequence would have to choose between writing a non-traceable Domain value or refusing admission. The compliant fix is to add a master-plan row for `default` before Sequence writes Project items.

## Proposed canonical edit

Add one row to `docs/plans/master-implementation-plan.md` §Domains:

- `default` — cross-cutting repo-skeleton / toolchain / repo-governance work with no single subsystem owner (spec §1 runtime/toolchain + spec §2 root layout).

No existing domain semantics change.

## Why higher layers do not change

- PRD: no requirement defines or constrains Domain taxonomy labels.
- Architecture spec: no subsystem/interface semantics change; the row only classifies cross-cutting planning/tracker work.
- WORKFLOW.md: no tracker schema or authority change; this change satisfies the existing WORKFLOW.md §6.6 invariant.

## Downstream sync list

- No planning artifact edits required. The landed subphase plan, planning manifest, and Plan handoff already name this gate and self-resolve when the §Domains row lands.
- Sequence may now write `Domain=default` for the three Phase 0 Project items after verifying the row is main-reachable and the Project field option exists.

## CLAUDE.md tree impact

none — no agent-instruction file changes.

## Architectural-fitness obligations

- Verify `rg "`default`" docs/plans/master-implementation-plan.md` finds the new Domains row.
- Verify no tracker schema files or Project fields are changed by this Ripple.
- Verify Sequence admission still uses the canonical eight Project fields only.

## Operator gates and current gate status

No pre-drafting or pre-merge gate is required for this MINOR_AUTONOMOUS additive master-plan table row: it adds one trace value for already-planned Phase 0 work, changes no PRD/spec semantics, and has no source/runtime blast radius. The current `/fullauto-goal` invocation explicitly directs the resume chain to finish autonomously.

## Return path

Return to Sequence admission for Phase 0 after this PR is main-reachable.

## Ledger destination

`docs/workflow/ledgers/2026-06-12-ripple-autonomous-ledger.md` — append/update with the merge SHA for this change order if the repo later formalizes the autonomous ledger.
