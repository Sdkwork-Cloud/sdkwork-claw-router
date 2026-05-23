# @sdkwork/router-mobile-react

## Purpose

Canonical mobile route catalogs, deep-link-safe path resolution, and route intents.

## Placement

- Architecture: `mobile-react`
- Domain: `foundation`
- Capability: `router`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-chat-mobile-react`
- `sdkwork-chat-mobile-react-regional`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
