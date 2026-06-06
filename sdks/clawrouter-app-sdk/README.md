# clawrouter-app-sdk

SDKWork Claw Router app API SDK.

This directory is the SDK family workspace for one OpenAPI surface. Language SDKs live under this family root instead of directly under `sdks/`.

## Workspace Layout

- Authority contract: `openapi/clawrouter-app-sdk.openapi.json`
- Derived sdkgen contract: `openapi/clawrouter-app-sdk.sdkgen.json` (synchronized artifact, not a generation source)
- SDK generation input: `openapi/clawrouter-app-sdk.openapi.json`
- Assembly snapshot: `.sdkwork-assembly.json`
- TypeScript workspace: `clawrouter-app-sdk-typescript`
- TypeScript generated output: `clawrouter-app-sdk-typescript/generated/server-openapi`
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

The materialized TypeScript package is `@sdkwork/clawrouter-app-sdk` and lives under `clawrouter-app-sdk-typescript/generated/server-openapi`. The `clawrouter-app-sdk-typescript` directory is the language workspace boundary.

TypeScript is the workspace dependency consumed by the portal. Other languages are generated under their own language workspace and use `generated/server-openapi` as the generator-owned transport boundary.

## SDK Dependency Contract

This SDK family is owner-only. Dependency-owned routes are consumed through declared
`sdkDependencies` and must not be regenerated into this transport SDK.

| Workspace | Role | Mode | API prefix | Generated transport policy |
| --- | --- | --- | --- | --- |
| `sdkwork-appbase-app-sdk` | `appbase-app-capability` | `consumer-sdk` | `/app/v3/api` | `generatedTransportImportPolicy: forbidden` |

Package names:

- `sdkwork-appbase-app-sdk`
- `typescript`: `@sdkwork/appbase-app-sdk`
- `flutter`: `sdkwork_appbase_app_sdk`
- `rust`: `sdkwork-appbase-app-sdk`
- `java`: `com.sdkwork:sdkwork-appbase-app-sdk`
- `csharp`: `SDKWork.Appbase.AppSdk`
- `swift`: `sdkwork-appbase-app-sdk`
- `kotlin`: `com.sdkwork:sdkwork-appbase-app-sdk`
- `go`: `github.com/sdkwork/sdkwork-appbase-app-sdk`
- `python`: `sdkwork-appbase-app-sdk`

Regenerate this SDK family from the project root:

```bash
node ./sdks/clawrouter-app-sdk/bin/generate-sdk.mjs
```

Regenerate selected languages:

```bash
node ./sdks/clawrouter-app-sdk/bin/generate-sdk.mjs --language typescript --language flutter
```

Verify this SDK family from the project root:

```bash
node ./sdks/clawrouter-app-sdk/bin/verify-sdk.mjs
```

## SDKWork Documentation Contract

Domain: platform
Capability: router
Package type: sdk-family
Status: standardizing

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- `SdkworkAppClient`

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
