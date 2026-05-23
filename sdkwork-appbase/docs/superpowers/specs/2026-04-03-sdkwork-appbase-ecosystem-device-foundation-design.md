# SDKWork Appbase Ecosystem + Device Foundation Design

## Scope

This design covers the next foundational hardening batch for `sdkwork-appbase` under `pc-react`:

- `@sdkwork/market-pc-react`
- `@sdkwork/plugin-pc-react`
- `@sdkwork/install-pc-react`
- `@sdkwork/distribution-pc-react`

The goal is to upgrade these packages from scaffold metadata to real reusable capability modules that match the package quality bar already established by the stronger commerce and IAM packages.

## Design Principles

- Keep package boundaries strict: one package owns one capability center.
- Prefer deterministic headless domain logic, then add thin controllers and premium UI shells on top.
- Reuse the same package shape used by mature appbase packages: domain model, service, controller, components, page, tests, README.
- Use `@sdkwork/ui-pc-react` and `@sdkwork/core-pc-react` as the shared baseline.
- Keep visual direction aligned with Claw Studio: zinc-led premium dark panels, dense signal cards, clear operator actions.
- Extract concepts from Claw Studio and sibling apps, but normalize them into generic appbase capabilities instead of product-specific flows.

## Package Design

### `@sdkwork/market-pc-react`

Purpose:
- Provide a generic marketplace center for apps, plugins, skills, models, templates, and bundles.

Core abstractions:
- marketplace item model
- market category and filter model
- featured and recommended item digest
- install / open / preview route intents
- market service that normalizes item catalogs, filters, ranking, and spotlight sections
- market controller that owns query state, active category, selected item, and bootstrap state

UI:
- hero header with catalog posture
- filter bar for search, category, item kind, and sort mode
- reusable listing cards
- selection detail rail

### `@sdkwork/plugin-pc-react`

Purpose:
- Provide a generic extension lifecycle center for bundled, local, market, or private plugins.

Core abstractions:
- plugin manifest and source model
- plugin compatibility and permission readiness
- health / risk / install-state digests
- plugin service for registry normalization and health summarization
- plugin controller for source filter, status filter, search, active plugin, and bootstrap lifecycle

UI:
- overview cards for installed / risky / updates / disabled
- plugin list with status badges
- detail rail for compatibility, permissions, and actions

### `@sdkwork/install-pc-react`

Purpose:
- Provide a generic install center for runtime, app, or toolchain installation workflows.

Core abstractions:
- install target, variant, dependency, readiness, and step models
- recommended install path resolution
- progress and action summaries
- install service for variant selection, readiness evaluation, and overview generation
- install controller for bootstrap, selected target, selected variant, and execution posture

UI:
- hero section for installation posture
- readiness cards
- variant chooser
- guided step timeline

### `@sdkwork/distribution-pc-react`

Purpose:
- Provide a reusable release and rollout center for packaged desktop distribution.

Core abstractions:
- release channel, rollout, artifact, and platform coverage models
- risk and approval posture
- distribution service for channel summaries, artifact matrices, and release digests
- distribution controller for channel focus, selected release, and bootstrap lifecycle

UI:
- release overview hero
- channel cards
- artifact matrix / list
- rollout summary rail

## Shared Decisions

- All four packages should expose workspace manifests and route intents.
- All services must expose an empty state generator and a live data getter.
- Controllers must follow the same bootstrap / refresh / selection pattern used by mature commerce packages.
- Tests must cover headless domain logic first, then service and controller behavior, then page rendering.

## Integration

After package implementation:

- register `market`, `plugin`, `install`, and `distribution` in the shared appbase capability registry
- extend registry tests so device and ecosystem domains are part of the public package selection surface
- keep package catalog script in sync with status changes

## Success Criteria

- Each target package has a real `src` surface beyond scaffold metadata.
- Each package has focused tests that prove reusable capability behavior.
- `catalog.ts` can surface these packages as first-class capabilities.
- UI quality is consistent with the Claw-aligned appbase style already used by pricing, billing, checkout, auth, and user.
