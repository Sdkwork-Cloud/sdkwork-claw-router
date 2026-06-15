# Crates

## Purpose
`crates/` stores authored Rust crates, including shared libraries, route crates, provider adapters, service hosts, workers, gateways, and test support crates.

## Owner
SDKWork Claw Router Rust maintainers and crate owners.

## Allowed Content
Cargo packages, Rust modules, crate-local tests, component specs, route manifests such as `crates/sdkwork-router-*-open-api/src/manifest.rs`, and crate READMEs.

## Forbidden Content
Top-level generated SDK output, frontend packages, runtime databases, local secrets, build caches, and route crate names outside the `sdkwork-router-<capability>-<surface>` pattern.

## Related Specs
- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/RUST_CODE_SPEC.md`
- `../../sdkwork-specs/NAMING_SPEC.md`

## Verification
- `cargo fmt --all --check`
- `cargo check --workspace`
- `python -B -m unittest tests.test_sdkwork_router_api_package_standard`
