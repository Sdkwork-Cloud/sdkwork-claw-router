---
name: clawrouter-backend-sdk-integration
description: Use when sdkwork-claw-router admin/backend frontend code must call /backend/v3/api management APIs through the generated @sdkwork/clawrouter-backend-sdk instead of raw fetch, axios, manual headers, compat facades, or local SDK forks.
---

# ClawRouter Backend SDK Integration

## Contract

Use `@sdkwork/clawrouter-backend-sdk` for every admin and backend management endpoint under `/backend/v3/api`.
The generated package lives at `sdks/clawrouter-backend-sdk` and is produced from `generated/openapi/clawrouter-backend-openapi.json` by `sdkwork-sdk-generator`.

Do not change `apps/sdkwork-claw-router-portal` UI visual design while doing backend SDK integration. Keep admin console layout, styling, copy, and interaction shape intact unless the user explicitly asks for a UI change.

## Hard Rules

- Do not add raw fetch, axios, XMLHttpRequest, manual Authorization headers, or string-built `/backend/v3/api` URLs for remote business calls.
- Do not create backend-local SDK forks, compat repositories, duplicated DTO shims, fake save branches, or generic request helpers that bypass `@sdkwork/clawrouter-backend-sdk`.
- Never hand-edit generated SDK output under `sdks/clawrouter-backend-sdk`.
- If a backend SDK method is missing, close the contract first: update `docs/schema-registry/frontend-field-contracts.yaml`, regenerate `generated/api/api-contract-manifest.json`, regenerate `generated/openapi/clawrouter-backend-openapi.json`, then regenerate the SDK.
- Backend capability gaps must be closed through Rust handler, service, persistence, and OpenAPI contract before adding frontend workarounds.
- Any table, column, index, migration, or embedded database schema change requires explicit user confirmation before editing.

## Workflow

1. Identify the admin service or hook that needs backend management data.
2. Confirm the endpoint belongs to `/backend/v3/api`; app and console endpoints must use `@sdkwork/clawrouter-app-sdk` instead.
3. Import only from the package root:

```ts
import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';
```

4. Route calls through a small backend SDK boundary owned by the portal package, then let admin modules call that boundary.
5. If the generated client lacks the required module or method, fix the OpenAPI source and rerun SDK generation instead of hand-writing a fallback.
6. Run the relevant portal checks and the root quality gate before closing the work.

## Regeneration Commands

Run from `apps/sdkwork-claw-router`:

```powershell
python -B -m tools.api_contract_manifest
python -B -m tools.clawrouter_openapi_generator
node D:\javasource\spring-ai-plus\spring-ai-plus-business\sdk\sdkwork-sdk-generator\bin\sdkgen.js generate -i generated\openapi\clawrouter-backend-openapi.json -o sdks\clawrouter-backend-sdk -n clawrouter-backend-sdk -t backend -l typescript --base-url http://localhost:18081 --api-prefix /backend/v3/api --package-name @sdkwork/clawrouter-backend-sdk --description "SDKWork Claw Router backend API SDK" --fixed-sdk-version 0.1.0 --no-sync-published-version
python -B -m tools.clawrouter_sdk_guardian
```

## Completion Bar

- `/backend/v3/api` remote business calls use `@sdkwork/clawrouter-backend-sdk`.
- No raw fetch or axios path remains in the touched admin/backend business path.
- `generated/openapi/clawrouter-backend-openapi.json` and `sdks/clawrouter-backend-sdk` are regenerated, not manually edited.
- `apps/sdkwork-claw-router-portal` UI visuals are unchanged.
- `python -B -m tools.schema_quality_gate` passes or any failure is reported with evidence.
