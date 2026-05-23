# @sdkwork/assets-pc-react

## Purpose

Asset library and reusable project resources.

## Placement

- Architecture: `pc-react`
- Domain: `content`
- Capability: `assets`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-react-assets`
- `sdkwork-drive`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
