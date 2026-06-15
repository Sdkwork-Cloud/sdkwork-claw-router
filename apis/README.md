# APIs

## Purpose
`apis/` stores author-owned API contracts and API review inputs for open-api, app-api, backend-api, RPC, async, examples, changelogs, and validation fixtures.

## Owner
SDKWork Claw Router maintainers and API surface owners.

## Allowed Content
OpenAPI source inputs, route authority manifests, schema fragments, API examples, changelogs, and contract validation fixtures.

## Forbidden Content
Generated SDK transport output, generated SDK control-plane `.sdkwork/` files, server implementation code, runtime state, logs, caches, secrets, and live credentials.

## Related Specs
- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/API_SPEC.md`
- `../../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`

## Verification
- `python -B tools/architecture_standard_guardian.py`
- `python -B -m unittest tests.test_sdkwork_router_api_package_standard`
