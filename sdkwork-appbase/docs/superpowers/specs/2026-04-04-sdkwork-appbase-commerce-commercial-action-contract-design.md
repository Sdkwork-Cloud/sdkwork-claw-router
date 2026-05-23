# SDKWORK Commerce Commercial Action Contract Design

## Context

The commerce package family already covers the right product surfaces, but the core "what should the user do next?" contract is still fragmented:

- `sdkwork-pricing-pc-react` uses `ctaLabel` and `ctaRoute`
- `sdkwork-checkout-pc-react` uses `actionLabel` and top-level `route`
- `sdkwork-billing-pc-react` uses billing-local action objects
- `sdkwork-entitlement-pc-react` uses entitlement-local action objects
- `sdkwork-offer-pc-react` already has an `action` object, but it is too offer-specific to serve as the shared commerce contract

This prevents clean composition across pricing, entitlement, checkout, billing, featured offers, and future commerce shells. It also makes Claw-style premium action treatment harder to standardize, because each package carries a slightly different view of capability, intent, label, and route.

## Design Goals

- Create one shared headless commerce action contract for reusable navigation and CTA composition.
- Place that contract in an upstream package that does not create dependency cycles.
- Normalize pricing, checkout, billing, entitlement, and offer actions onto that shared model.
- Prefer structured action metadata over loose string pairs so future shells can render richer quick actions and activity rails.
- Keep the design compatible with staged Claw-style interaction patterns: explicit primary action, clear target capability, and readable intent semantics.

## Placement Decision

The shared contract will live in `packages/pc-react/commerce/sdkwork-offer-pc-react/src/commercial-action.ts`.

Why this location:

- `offer` is already upstream of `pricing`, `billing`, `entitlement`, `checkout`, and `commerce`
- moving the contract into `commerce` would invert the dependency graph
- moving it into `pricing` or `checkout` would introduce higher cycle risk
- moving it into `billing` would make billing the conceptual owner of non-billing actions

This keeps the current dependency DAG stable while still anchoring the contract inside the commerce domain.

## Contract Design

The shared contract becomes:

- `SdkworkCommercialActionCapability`
- `SdkworkCommercialActionIntent`
- `SdkworkCommercialAction`
- `createSdkworkCommercialAction(...)`

The base action shape carries:

- `capability`
- `intent`
- `label`
- `route`

The action is intentionally small. It describes user direction, not execution state.

Intent values are limited to the real commerce cases already present in the appbase stack:

- `claim`
- `exchange`
- `open`
- `purchase`
- `recharge`
- `renew`
- `resolve`
- `review`
- `upgrade`

## Package Adoption

`sdkwork-offer-pc-react`

- becomes the source of truth for the shared commercial action contract
- `SdkworkOfferAction` becomes a typed specialization of `SdkworkCommercialAction`

`sdkwork-billing-pc-react`

- billing alert actions and recommended actions extend the shared contract
- billing-specific metadata such as `reason` remains local
- the old `target` naming is replaced by shared `capability`

`sdkwork-entitlement-pc-react`

- entitlement actions extend the shared contract
- access logic still decides which action to show, but the output is now consistent with other commerce packages

`sdkwork-pricing-pc-react`

- plans expose a nested `action` instead of separate `ctaLabel` and `ctaRoute`
- service code becomes responsible for assigning capability and intent explicitly
- pricing UI reads `plan.action.label` and `plan.action.route`

`sdkwork-checkout-pc-react`

- checkout sources expose a nested `action` instead of separate `actionLabel` and top-level `route`
- checkout session and summary UI render source actions from the shared model
- submit and navigation flows still use the action route as the canonical continuation target

`sdkwork-commerce-pc-react`

- consumes already-normalized commercial actions from upstream packages
- can later build quick-action rails and hero CTAs without additional action adapters

## Data Flow

1. Upstream package services generate domain data plus a shared commercial action.
2. Pages and components no longer assemble CTA strings manually.
3. Cross-commerce composition reads actions without caring whether the source package is pricing, billing, entitlement, checkout, or offer.
4. New surfaces can inspect `capability` and `intent` to render consistent button copy, icons, emphasis, and routing.

## UI / Interaction Notes

- Claw-style UX depends on strong CTA hierarchy. A shared action model should tell the shell exactly what the user is about to do.
- Button labels should remain editorial and outcome-oriented, not generic.
- Target capability should not be inferred from route strings in the view layer.
- Route parsing should remain an adapter concern, not a UI concern.

## Verification

- Write failing tests first for the shared action contract and each adopting package.
- Run focused package tests while migrating action fields.
- Run commerce-wide tests after the refactor stabilizes.
- Run typecheck for affected packages.
- Run structure review to ensure package boundaries remain valid.

## Implementation Outcome

- `sdkwork-offer-pc-react` now owns `SdkworkCommercialAction`, `SdkworkCommercialActionCapability`, `SdkworkCommercialActionIntent`, and `createSdkworkCommercialAction(...)`
- `sdkwork-pricing-pc-react` now exposes `plan.action` instead of loose CTA string pairs
- `sdkwork-checkout-pc-react` now exposes `source.action` instead of loose action labels and top-level business routes
- `sdkwork-checkout-pc-react` now requires an explicit payment method for paid submissions, preserves `failed` submit states, and rejects subscription actions that do not expose a valid `packId`
- `sdkwork-billing-pc-react` and `sdkwork-entitlement-pc-react` now emit explicit `capability` and `intent` values through the shared action contract

## Verification Evidence

- `pnpm test -- packages/pc-react/commerce/sdkwork-offer-pc-react/tests`
- `pnpm test -- packages/pc-react/commerce/sdkwork-pricing-pc-react/tests`
- `pnpm test -- packages/pc-react/commerce/sdkwork-checkout-pc-react/tests`
- `pnpm test -- packages/pc-react/commerce/sdkwork-billing-pc-react/tests`
- `pnpm test -- packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests`
- `pnpm --dir packages/pc-react/commerce/sdkwork-checkout-pc-react exec tsc --noEmit`
- `pnpm test -- packages/pc-react/commerce`
- `pnpm run review:structure`
