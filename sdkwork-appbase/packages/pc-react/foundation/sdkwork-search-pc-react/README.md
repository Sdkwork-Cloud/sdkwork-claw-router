# @sdkwork/search-pc-react

## Purpose

Global search orchestration and cross-capability result routing.

## Placement

- Architecture: `pc-react`
- Domain: `foundation`
- Capability: `search`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-chat-pc-react`
- `sdkwork-cloud-portal`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
