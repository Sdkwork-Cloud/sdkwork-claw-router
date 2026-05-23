# @sdkwork/agent-pc-react

## Purpose

Agent catalog, install flow, and agent execution views.

## Placement

- Architecture: `pc-react`
- Domain: `intelligence`
- Capability: `agent`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/core-pc-react` for SDK runtime, env, and session integration
- Lower-level appbase packages only

## Extraction sources

- `sdkwork-agent`
- `sdkwork-chat-pc-agents`

## Next implementation steps

- Define package contracts under `src/contracts`
- Extract shared services under `src/services`
- Add UI composition surfaces under `src/components`
- Register routes or manifest metadata under `src/routes` or `src/manifests`
