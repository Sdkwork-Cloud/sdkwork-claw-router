# SDKWork Claw Router Component Specs

This directory is the local standards index for `sdkwork-claw-router`.

Root SDKWork standards remain authoritative. Local component specs can narrow or document this component, but they must not contradict [the root standards](../../sdkwork-specs/README.md).

## Component

| Field | Value |
| --- | --- |
| Name | `sdkwork-claw-router` |
| Type | `app` |
| Root | `sdkwork-claw-router` |
| Domain | `platform` |
| Capability | `router` |
| Languages | `javascript, rust` |
| Status | `ACTIVE` |

## Contract Manifest

- [component.spec.json](./component.spec.json) is the machine-readable component contract.
- [dependency-api-surfaces.json](./dependency-api-surfaces.json) records dependency SDK runtime API
  surface imports, Rust backend route-contract exports, same-origin mount coverage, and explicit
  external-service base URL requirements.
- Shared foundation API composition targets `sdkwork-api-gateway` through the existing
  `PORTAL_PUBLIC_SDK_BASE_URL` common SDK root and Cargo workspace/feature evidence. Do not add a
  standalone gateway catalog for Claw Router dependency API facts.
- Product-local app/admin routers keep Claw Router-owned API contract fallbacks only; Commerce
  dependency app/backend routes default to `404` locally and are consumed through the shared
  gateway or explicit split-deployment base URLs.
- Consumers should integrate through public exports, runtime entrypoints, SDK clients, or adapters declared in the manifest.
- Generated SDK language outputs are represented at their SDK family root instead of duplicating local specs in generated folders.

## Canonical Specs

| Spec | Applies Because |
| --- | --- |
| [APP_MANIFEST_SPEC.md](../../sdkwork-specs/APP_MANIFEST_SPEC.md) | sdkwork.app.config.json application registration rules. |
| [APPLICATION_SPEC.md](../../sdkwork-specs/APPLICATION_SPEC.md) | Application shell and module composition. |
| [COMPONENT_SPEC.md](../../sdkwork-specs/COMPONENT_SPEC.md) | Local component specs directory and manifest rules. |
| [CONFIG_SPEC.md](../../sdkwork-specs/CONFIG_SPEC.md) | Runtime configuration, environment, SDK bootstrap, and feature flag rules. |
| [DEPENDENCY_MANAGEMENT_SPEC.md](../../sdkwork-specs/DEPENDENCY_MANAGEMENT_SPEC.md) | Source/build dependency paths, local dev materialization, release Git dependency checkout, and cross-platform path rules. |
| [DEPLOYMENT_SPEC.md](../../sdkwork-specs/DEPLOYMENT_SPEC.md) | SaaS/private/local runtime parity and deployment rules. |
| [DOCUMENTATION_SPEC.md](../../sdkwork-specs/DOCUMENTATION_SPEC.md) | Module README, examples, ADR, changelog, and runbook rules. |
| [DOMAIN_SPEC.md](../../sdkwork-specs/DOMAIN_SPEC.md) | Canonical domain ownership and naming. |
| [FRONTEND_SPEC.md](../../sdkwork-specs/FRONTEND_SPEC.md) | UI, service, SDK, accessibility, and frontend runtime rules. |
| [GOVERNANCE_SPEC.md](../../sdkwork-specs/GOVERNANCE_SPEC.md) | Standard ownership, exception, compatibility, and migration rules. |
| [I18N_SPEC.md](../../sdkwork-specs/I18N_SPEC.md) | User-facing language, locale, message catalog, and fallback rules. |
| [MODULE_SPEC.md](../../sdkwork-specs/MODULE_SPEC.md) | Reusable package contract and dependency direction. |
| [README.md](../../sdkwork-specs/README.md) | SDKWork root standards entrypoint. |
| [SDK_SPEC.md](../../sdkwork-specs/SDK_SPEC.md) | SDK generation and SDK integration rules. |
| [TEST_SPEC.md](../../sdkwork-specs/TEST_SPEC.md) | Contract, frontend, SDK, security, parity, and documentation verification rules. |

## Public Exports

- Public exports are not declared in the package manifest.

## SDK Clients

- No generated SDK client class is declared at this component boundary.

## Local Extension Specs

- [API_SPEC.md](./API_SPEC.md)
- [DATABASE_SPEC.md](./DATABASE_SPEC.md)
- [dependency-api-surfaces.json](./dependency-api-surfaces.json)

## Verification

- `cargo test --workspace`
- `pnpm --filter sdkwork-claw-router-workspace test`
