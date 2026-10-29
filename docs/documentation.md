# Documentation ownership

Use [the documentation index](index.md) for guides and [the skill index](skills.md)
for task selection. Keep one maintained owner for each topic.

| Material                                           | Owner                                |
| -------------------------------------------------- | ------------------------------------ |
| Introduction and quick start                       | Root `README.md`                     |
| Project-wide constraints and verification          | `AGENTS.md`                          |
| Skill discovery                                    | `docs/skills.md`                     |
| Human setup, architecture and operations           | Focused guides in `docs/`            |
| Agent workflow or component contract               | Its `.agents/skills/<name>/SKILL.md` |
| Substantial detail needed only for a specific task | That skill's own `references/`       |

## Independent skills

Apply SOLID as practical authoring rules:

| Principle             | Rule                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Single responsibility | Give each skill one task or component family.                                                     |
| Open/closed           | Extend the owning skill for a new supported mode; add a skill only for a distinct responsibility. |
| Substitution          | Keep instructions consistent with project rules and the common iOS/Android public contract.       |
| Interface segregation | Use a short, specific description; include only constraints needed for that task.                 |
| Dependency inversion  | Depend on public contracts and source, not another skill's workflow.                              |

A skill must work without loading another skill. Do not link to another skill,
include a skill-selection table or require a router skill. Discovery belongs in
`docs/skills.md`. Source links, official documentation and a skill's own references
are appropriate when they clarify its work.

Keep entry points concise. Preserve non-obvious behavior and limitations; remove
generic advice, repeated project rules, exhaustive examples and historical logs.
Do not duplicate component contracts in human guides or source-folder READMEs.
Keep references only when they contain useful detail that does not belong in the
entry point.

Direct upstream exports share the native layout skill; do not create a separate
skill for each alias. Keep distinct skills for controls with project-owned
behavior or platform adaptations. Maintain current guidance rather than dated
audit reports: move unresolved work and useful regression scenarios into the
owning guide before removing a superseded document. Git retains the history.

## Verification

Validate skill metadata and local links after edits or moves. Format edited files
and run lint/typecheck as required by `AGENTS.md`. Report native observations
separately; registered stories and documentation do not prove device behavior.
Historical reports do not override current source or maintained guidance.
