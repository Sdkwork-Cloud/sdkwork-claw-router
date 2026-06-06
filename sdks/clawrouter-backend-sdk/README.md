# clawrouter-backend-sdk

SDKWork Claw Router backend API SDK.

This directory is the SDK family workspace for one OpenAPI surface. Language SDKs live under this family root instead of directly under `sdks/`.

## Workspace Layout

- Authority contract: `openapi/clawrouter-backend-sdk.openapi.json`
- Derived sdkgen contract: `openapi/clawrouter-backend-sdk.sdkgen.json` (synchronized artifact, not a generation source)
- SDK generation input: `openapi/clawrouter-backend-sdk.openapi.json`
- Assembly snapshot: `.sdkwork-assembly.json`
- TypeScript workspace: `clawrouter-backend-sdk-typescript`
- TypeScript generated output: `clawrouter-backend-sdk-typescript/generated/server-openapi`
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

The materialized TypeScript package is `@sdkwork/clawrouter-backend-sdk` and lives under `clawrouter-backend-sdk-typescript/generated/server-openapi`. The `clawrouter-backend-sdk-typescript` directory is the language workspace boundary.

TypeScript is the workspace dependency consumed by the portal. Other languages are generated under their own language workspace and use `generated/server-openapi` as the generator-owned transport boundary.

## SDK Dependency Contract

This SDK family is owner-only. Dependency-owned routes are consumed through declared
`sdkDependencies` and must not be regenerated into this transport SDK.

| Workspace | Role | Mode | API prefix | Generated transport policy |
| --- | --- | --- | --- | --- |
| `sdkwork-appbase-backend-sdk` | `appbase-backend-management-capability` | `consumer-sdk` | `/backend/v3/api` | `generatedTransportImportPolicy: forbidden` |

Package names:

- `sdkwork-appbase-backend-sdk`
- `typescript`: `@sdkwork/appbase-backend-sdk`
- `flutter`: `sdkwork_appbase_backend_sdk`
- `rust`: `sdkwork-appbase-backend-sdk`
- `java`: `com.sdkwork:sdkwork-appbase-backend-sdk`
- `csharp`: `SDKWork.Appbase.BackendSdk`
- `swift`: `sdkwork-appbase-backend-sdk`
- `kotlin`: `com.sdkwork:sdkwork-appbase-backend-sdk`
- `go`: `github.com/sdkwork/sdkwork-appbase-backend-sdk`
- `python`: `sdkwork-appbase-backend-sdk`

Regenerate this SDK family from the project root:

```bash
node ./sdks/clawrouter-backend-sdk/bin/generate-sdk.mjs
```

Regenerate selected languages:

```bash
node ./sdks/clawrouter-backend-sdk/bin/generate-sdk.mjs --language typescript --language flutter
```

Verify this SDK family from the project root:

```bash
node ./sdks/clawrouter-backend-sdk/bin/verify-sdk.mjs
```
