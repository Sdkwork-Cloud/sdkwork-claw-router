# @sdkwork/host-pc-react

## Purpose

Host capability contracts shared by all PC React applications.

## Placement

- Architecture: `pc-react`
- Domain: `host`
- Capability: `host`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-studio`
- `sdkwork-desktop-settings`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
