---
name: clawrouter-app-sdk-integration
description: Use when sdkwork-claw-router app or console frontend code must call /app/v3/api remote business APIs through the generated @sdkwork/clawrouter-app-sdk instead of raw fetch, axios, manual headers, or local DTO/client forks.
---

# ClawRouter App SDK Integration

## Contract

Use `@sdkwork/clawrouter-app-sdk` for every app, public, and console remote business endpoint under `/app/v3/api`.
The generated package lives at `sdks/clawrouter-app-sdk` and is produced from `generated/openapi/clawrouter-app-openapi.json` by `sdkwork-sdk-generator`.

Do not change `apps/sdkwork-claw-router-portal` UI visual design while doing SDK integration. Keep component layout, styling, copy, and interaction shape intact unless the user explicitly asks for a UI change.

## Hard Rules

- Do not add raw fetch, axios, XMLHttpRequest, manual Authorization headers, or string-built `/app/v3/api` URLs for remote business calls.
- Do not create app-local SDK forks, duplicated DTO shims, fake-success branches, or generic request helpers that bypass `@sdkwork/clawrouter-app-sdk`.
- Never hand-edit generated SDK output under `sdks/clawrouter-app-sdk`.
- If an app SDK method is missing, close the contract first: update `docs/schema-registry/frontend-field-contracts.yaml`, regenerate `generated/api/api-contract-manifest.json`, regenerate `generated/openapi/clawrouter-app-openapi.json`, then regenerate the SDK.
- Keep local-only runtime concerns, desktop shell work, build tooling, and UI state outside the SDK.
- Any table, column, index, migration, or embedded database schema change requires explicit user confirmation before editing.

## Workflow

1. Identify the frontend service or hook that needs remote app data.
2. Confirm the endpoint belongs to `/app/v3/api`; admin endpoints must use `@sdkwork/clawrouter-backend-sdk` instead.
3. Import only from the package root:

```ts
import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';
```

4. Route calls through a small app SDK boundary owned by the portal package, then let page modules call that boundary. UI components should not construct raw HTTP clients.
5. If the generated client lacks the required module or method, fix the OpenAPI source and rerun SDK generation instead of hand-writing a fallback.
6. Run the relevant portal checks and the root quality gate before closing the work.

## Regeneration Commands

Run from `apps/sdkwork-claw-router`:

```powershell
python -B -m tools.api_contract_manifest
python -B -m tools.clawrouter_openapi_generator
node D:\javasource\spring-ai-plus\spring-ai-plus-business\sdk\sdkwork-sdk-generator\bin\sdkgen.js generate -i generated\openapi\clawrouter-app-openapi.json -o sdks\clawrouter-app-sdk -n clawrouter-app-sdk -t app -l typescript --base-url http://localhost:18082 --api-prefix /app/v3/api --package-name @sdkwork/clawrouter-app-sdk --description "SDKWork Claw Router app API SDK" --fixed-sdk-version 0.1.0 --no-sync-published-version
python -B -m tools.clawrouter_sdk_guardian
```

## Completion Bar

- `/app/v3/api` remote business calls use `@sdkwork/clawrouter-app-sdk`.
- No raw fetch or axios path remains in the touched app business path.
- `generated/openapi/clawrouter-app-openapi.json` and `sdks/clawrouter-app-sdk` are regenerated, not manually edited.
- `apps/sdkwork-claw-router-portal` UI visuals are unchanged.
- `python -B -m tools.schema_quality_gate` passes or any failure is reported with evidence.
