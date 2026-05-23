# @sdkwork/drive-pc-react

## Purpose

Cloud drive, file browsing, and storage workspaces.

## Placement

- Architecture: `pc-react`
- Domain: `content`
- Capability: `drive`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-drive`
- `sdkwork-chat-pc-drive`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
