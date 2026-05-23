# @sdkwork/desktop-pc-react

## Purpose

Desktop feature composition for windows, updater, files, and process launch.

## Placement

- Architecture: `pc-react`
- Domain: `host`
- Capability: `desktop`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-desktop`
- `codebox`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
