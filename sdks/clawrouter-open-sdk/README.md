# clawrouter-open-sdk

SDKWork Claw Router OpenAI-compatible gateway SDK.

This directory is the SDK family workspace for one OpenAPI surface. Language SDKs live under this family root instead of directly under `sdks/`.

## Workspace Layout

- Authority contract: `openapi/clawrouter-open-sdk.openapi.json`
- Derived sdkgen contract: `openapi/clawrouter-open-sdk.sdkgen.json` (generator input for recursive OpenAI-compatible schemas)
- SDK generation input: `openapi/clawrouter-open-sdk.sdkgen.json` derived from the authority contract
- Assembly snapshot: `.sdkwork-assembly.json`
- TypeScript workspace: `clawrouter-open-sdk-typescript`
- TypeScript generated output: `clawrouter-open-sdk-typescript/generated/server-openapi`
- Other generated outputs: `<family>-<language>/generated/server-openapi`
- Family generator: `bin/generate-sdk.mjs`
- Family verifier: `bin/verify-sdk.mjs`

## Official Languages

- `typescript`
- `flutter`
- `rust`
- `java`
- `csharp`
- `swift`
- `kotlin`
- `go`
- `python`

## TypeScript

The materialized TypeScript package is `@sdkwork/clawrouter-open-sdk` and lives under `clawrouter-open-sdk-typescript/generated/server-openapi`. The `clawrouter-open-sdk-typescript` directory is the language workspace boundary.

TypeScript is the workspace dependency consumed by the portal. Other languages are generated under their own language workspace and use `generated/server-openapi` as the generator-owned transport boundary.

Regenerate this SDK family from the project root:

```bash
node ./sdks/clawrouter-open-sdk/bin/generate-sdk.mjs
```

Regenerate selected languages:

```bash
node ./sdks/clawrouter-open-sdk/bin/generate-sdk.mjs --language typescript --language flutter
```

Verify this SDK family from the project root:

```bash
node ./sdks/clawrouter-open-sdk/bin/verify-sdk.mjs
```

## SDKWork Documentation Contract

Domain: platform
Capability: router
Package type: sdk-family
Status: standardizing

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- `SdkworkAiClient`

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `node apps/scripts/validate-component-specs.mjs --apps-root apps --json`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
