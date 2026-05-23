# @sdkwork/host-tauri-pc-react

## Purpose

Tauri-specific host adapter and plugin wiring.

## Placement

- Architecture: `pc-react`
- Domain: `host`
- Capability: `host-tauri`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-desktop`
- `sdkwork-notes-desktop`
- `sdkwork-drive-desktop`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
