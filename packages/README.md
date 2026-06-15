# Shared Packages

## Purpose
`packages/` stores governed shared TypeScript and React package families that are not owned by a single application surface.

## Owner
SDKWork Claw Router frontend and package maintainers.

## Allowed Content
Shared TypeScript or React package families, package-local README files, package manifests, source, tests, and component specs.

## Forbidden Content
Rust route crates, API implementation crates, generated SDK transport output, runtime user data, local secrets, logs, caches, and packages named `sdkwork-router-*`.

## Related Specs
- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/NAMING_SPEC.md`
- `../../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md`

## Verification
- `python -B -m unittest tests.test_sdkwork_router_api_package_standard`
- `python -B tools/architecture_standard_guardian.py`
