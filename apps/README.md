# Applications

## Purpose
`apps/` stores independently runnable application roots and application surfaces. `apps/sdkwork-clawrouter-pc/` is the PC React portal surface for this repository.

## Owner
SDKWork Claw Router maintainers and application surface owners.

## Allowed Content
Application roots with their own `sdkwork.app.config.json`, local `AGENTS.md`, `.sdkwork/`, `specs/`, source packages, public assets, scripts, docs, and tests.

## Forbidden Content
Generated SDK transport output outside SDK family workspaces, runtime user data, local secrets, cache directories, and app surfaces without a local dictionary.

## Related Specs
- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md`
- `../../sdkwork-specs/APP_PC_REACT_UI_SPEC.md`

## Verification
- `python -B tools/architecture_standard_guardian.py`
- `pnpm.cmd --dir apps/sdkwork-clawrouter-pc typecheck`
