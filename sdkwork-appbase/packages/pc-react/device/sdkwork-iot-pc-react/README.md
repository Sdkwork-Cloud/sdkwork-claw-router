# @sdkwork/iot-pc-react

## Purpose

IoT device management, edge endpoints, and hardware monitoring.

## Placement

- Architecture: `pc-react`
- Domain: `device`
- Capability: `iot`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-pc-portal-iot`
- `sdkwork-react-backend-iot`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
