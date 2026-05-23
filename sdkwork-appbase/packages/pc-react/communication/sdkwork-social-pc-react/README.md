# @sdkwork/social-pc-react

## Purpose

Moments, feeds, and social discovery.

## Placement

- Architecture: `pc-react`
- Domain: `communication`
- Capability: `social`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-chat-pc-social`
- `sdkwork-chat-mobile-react`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
