# clawrouter-backend-sdk

SDKWork Claw Router backend API SDK.

This directory is the SDK family workspace for one OpenAPI surface. Language SDKs live under this family root instead of directly under `sdks/`.

## Workspace Layout

- Authority contract: `openapi/clawrouter-backend-sdk.openapi.json`
- Derived sdkgen contract: `openapi/clawrouter-backend-sdk.sdkgen.json` (synchronized artifact, not a generation source)
- SDK generation input: `openapi/clawrouter-backend-sdk.openapi.json`
- Assembly snapshot: `.sdkwork-assembly.json`
- TypeScript workspace: `clawrouter-backend-sdk-typescript`
- Other language workspaces: `<family>-<language>/generated/server-openapi`
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

The materialized TypeScript package is `@sdkwork/clawrouter-backend-sdk` and lives under `clawrouter-backend-sdk-typescript`. Hand-written extensions stay inside `clawrouter-backend-sdk-typescript/custom`.

TypeScript is the workspace dependency consumed by the portal. Other languages are generated under their own language workspace and use `generated/server-openapi` as the generator-owned transport boundary.

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
