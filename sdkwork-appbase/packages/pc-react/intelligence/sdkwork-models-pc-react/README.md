# @sdkwork/models-pc-react

## Purpose

Model catalogs, provider instances, and purchase states.

## Placement

- Architecture: `pc-react`
- Domain: `intelligence`
- Capability: `models`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-model-purchase`
- `sdkwork-pc-portal-models`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
