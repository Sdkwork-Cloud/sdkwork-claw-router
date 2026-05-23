# @sdkwork/community-pc-react

## Purpose

Community posts, public discussions, and recommendations.

## Placement

- Architecture: `pc-react`
- Domain: `communication`
- Capability: `community`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-community`
- `sdkwork-cloud-portal`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
