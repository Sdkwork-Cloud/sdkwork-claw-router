# Docs

## Purpose
`docs/` stores repository documentation, architecture decisions, runbooks, design notes, changelogs, installation guides, and product delivery evidence.

## Owner
SDKWork Claw Router maintainers and documentation owners.

## Allowed Content
Architecture documentation, installation guides, release notes, runbooks, schema registry documentation, design evidence, and documentation assets.

## Forbidden Content
Generated SDK transport output, live credentials, private customer data, runtime databases, local logs, caches, and copied root standards.

## Related Specs
- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/DOCUMENTATION_SPEC.md`
- `../../sdkwork-specs/ARCHITECTURE_DECISION_SPEC.md`

## Verification
- `python -B tools/architecture_standard_guardian.py`
