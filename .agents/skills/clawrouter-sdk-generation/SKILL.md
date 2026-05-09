---
name: clawrouter-sdk-generation
description: Use when regenerating sdkwork-claw-router OpenAPI specs and the generated TypeScript packages @sdkwork/clawrouter-app-sdk and @sdkwork/clawrouter-backend-sdk from the project API contract manifest.
---

# ClawRouter SDK Generation

## Contract

Generate SDKs from the project contract chain only:

1. `docs/schema-registry/frontend-field-contracts.yaml`
2. `generated/api/api-contract-manifest.json`
3. `generated/openapi/clawrouter-app-openapi.json`
4. `generated/openapi/clawrouter-backend-openapi.json`
5. `sdks/clawrouter-app-sdk`
6. `sdks/clawrouter-backend-sdk`

The generated packages are `@sdkwork/clawrouter-app-sdk` for `/app/v3/api` and `@sdkwork/clawrouter-backend-sdk` for `/backend/v3/api`.

Never hand-edit generated SDK output. Fix the manifest, OpenAPI generator, or `sdkwork-sdk-generator` inputs and rerun generation.

## Commands

Run from `apps/sdkwork-claw-router`:

```powershell
python -B -m tools.api_contract_manifest
python -B -m tools.clawrouter_openapi_generator
node D:\javasource\spring-ai-plus\spring-ai-plus-business\sdk\sdkwork-sdk-generator\bin\sdkgen.js generate -i generated\openapi\clawrouter-app-openapi.json -o sdks\clawrouter-app-sdk -n clawrouter-app-sdk -t app -l typescript --base-url http://localhost:18082 --api-prefix /app/v3/api --package-name @sdkwork/clawrouter-app-sdk --description "SDKWork Claw Router app API SDK" --fixed-sdk-version 0.1.0 --no-sync-published-version
node D:\javasource\spring-ai-plus\spring-ai-plus-business\sdk\sdkwork-sdk-generator\bin\sdkgen.js generate -i generated\openapi\clawrouter-backend-openapi.json -o sdks\clawrouter-backend-sdk -n clawrouter-backend-sdk -t backend -l typescript --base-url http://localhost:18081 --api-prefix /backend/v3/api --package-name @sdkwork/clawrouter-backend-sdk --description "SDKWork Claw Router backend API SDK" --fixed-sdk-version 0.1.0 --no-sync-published-version
python -B -m tools.clawrouter_sdk_guardian
python -B -m tools.clawrouter_skill_guardian
python -B -m tools.schema_quality_gate
```

## Checks

- `generated/api/api-contract-manifest.json` must expose app operations through `SdkworkAppClient` and backend operations through `SdkworkBackendClient`.
- `generated/openapi/clawrouter-app-openapi.json` must contain only `/app/v3/api` paths.
- `generated/openapi/clawrouter-backend-openapi.json` must contain only `/backend/v3/api` paths.
- `sdks/clawrouter-app-sdk/package.json` must be named `@sdkwork/clawrouter-app-sdk`.
- `sdks/clawrouter-backend-sdk/package.json` must be named `@sdkwork/clawrouter-backend-sdk`.
- `sdks/*/custom/` is the only safe place for hand-written SDK extensions.
- Any required database contract change must be confirmed by the user before implementation.

## Failure Handling

- If SDK generation fails on OpenAPI validation, fix `tools.clawrouter_openapi_generator` or the manifest source.
- If a generated method name is wrong, fix the operation contract instead of editing `sdks/`.
- If the portal needs a method that does not exist, add the endpoint to `docs/schema-registry/frontend-field-contracts.yaml`, regenerate, and use the generated SDK.
- If package verification fails because dependencies are not installed, report the exact missing dependency and keep static quality gates passing.
