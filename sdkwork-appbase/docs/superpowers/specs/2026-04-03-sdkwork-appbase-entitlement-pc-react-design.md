# SDKWORK Appbase Entitlement PC React Design

## Context

The SDKWORK commerce stack now covers the core monetization surfaces:

- `@sdkwork/wallet-pc-react` for account and balance aggregation
- `@sdkwork/vip-pc-react` for membership state and benefits
- `@sdkwork/points-pc-react` for credits, recharge, and upgrade flows
- `@sdkwork/subscription-pc-react` for purchase, renew, and upgrade checkout
- `@sdkwork/coupon-pc-react` for discount inventory and coupon actions
- `@sdkwork/offfer-pc-react` for shared commercial recommendations
- `@sdkwork/commerce-pc-react` for cross-package commercial snapshots

This means the product can already answer:

- what plans and offers exist
- how to recharge or upgrade
- how to pay and inspect orders or invoices

But it still cannot answer one foundational product question in a reusable way:

- can this user use this capability right now
- what commercial condition is blocking access
- how close is the user to a quota or commercial limit
- which upgrade or recharge path should a paywall or gate route to

For an AI-era application platform, this missing layer matters more than another checkout page. Every app that wants premium chat, media generation, RTC rooms, automation runs, storage quotas, or advanced model access will need the same commercial access decision model.

## Goal

Create `@sdkwork/entitlement-pc-react` as the reusable commercial access and paywall package for PC React applications. It should standardize:

- commercial capability descriptors
- entitlement evaluation rules
- quota and limit summaries
- upgrade or recharge recommendations
- embeddable paywall gates
- a routeable entitlement center page

## Source Of Truth

The package should align to these local references:

- `claw-studio/packages/sdkwork-claw-settings/src/BillingSettings.tsx` for billing and usage information density, metric framing, and premium settings-card rhythm
- `claw-studio/packages/sdkwork-claw-points/src/components/PointsUpgradeDialog.tsx` for premium commercial CTA presentation and upgrade-card composition
- `claw-studio/packages/sdkwork-claw-dashboard/src/services/dashboardService.ts` for how usage and commerce signals are composed into one product-facing status layer
- current appbase commerce packages for service/controller/page boundaries and `sdkwork-ui-pc-react` usage

This package should not transplant Claw implementation details directly. It should productize the reusable commercial-access concepts that Claw-style products need.

## Problem Statement

`vip` already describes benefits, levels, and upgrade flows, but it is still a membership package, not a general entitlement engine.

`permission` already describes OS and platform access gates, but it is a system capability gate, not a commercial paywall.

There is no package that can normalize inputs like:

- minimum membership level
- required point balance
- required commercial quota
- near-limit warning thresholds
- feature-level commercial categories

Into outputs like:

- ready
- limited
- locked
- upgrade required
- recharge required
- recommended route and action label

That gap causes every future app to rewrite its own:

- paywall cards
- upgrade banners
- quota-warning logic
- feature-access rules
- routing decisions to subscription, offers, or recharge

## Approaches Considered

### Option A: Extend `@sdkwork/vip-pc-react` to evaluate all commercial access

Pros:

- avoids a new package
- keeps membership and entitlements close

Cons:

- collapses membership data and feature-access policy into one boundary
- forces non-membership commercial rules like point balance or quota depletion into `vip`
- makes it harder for apps to reuse paywalls without importing the full membership center

### Option B: Put entitlement logic into `@sdkwork/commerce-pc-react`

Pros:

- one existing orchestration package
- easy to compose other commerce services

Cons:

- repeats the same anti-pattern that `offer` just fixed
- traps reusable commercial-access logic inside a hub package
- blocks lightweight consumers that only need a gate or paywall card

### Option C: Create `@sdkwork/entitlement-pc-react` as a focused headless-plus-UI package

Pros:

- keeps commercial access policy separate from membership and billing execution
- provides a reusable headless gate layer for any app feature
- provides a consistent Claw-style paywall and entitlement center
- composes existing commerce packages instead of duplicating them

Cons:

- adds one new package boundary to maintain

### Recommendation

Choose Option C.

The architecture already proves that reusable commercial concerns deserve dedicated packages. `coupon`, `invoice`, `payment`, and `offer` all became stronger once they stopped hiding inside broader commerce shells. Entitlement decisions are even more cross-cutting and should be modeled explicitly.

## Package Boundary

`@sdkwork/entitlement-pc-react` owns:

- entitlement descriptors for feature-level commercial requirements
- entitlement evaluation helpers and digests
- starter entitlement catalogs for common AI desktop capabilities
- dashboard composition from wallet, VIP, points, and offer services
- embeddable paywall gate UI
- a routeable entitlement center page
- workspace manifest and route intents

`@sdkwork/entitlement-pc-react` does not own:

- raw payment execution
- order creation
- invoice lifecycle
- VIP mutations
- points recharge mutations
- platform permissions or OS-level access checks

Those stay inside their existing packages. Entitlement only decides commercial availability and upgrade guidance.

## Core Model

### Descriptor

Each commercial capability is described by a stable UI-facing descriptor:

- `id`
- `title`
- `description`
- `category`
- `tags`
- `minimumLevelValue`
- `minimumPointsBalance`
- `quotaLimit`
- `quotaUsed`
- `warningThreshold`

The descriptor is app-owned input. The package must not hardcode one product's feature list into its internal logic. It can ship starter descriptors, but hosts can provide their own catalog.

### Decision

Each evaluated capability returns a normalized decision:

- `status`
- `reasonCodes`
- `isAvailable`
- `isNearLimit`
- `remainingQuota`
- `usageRatio`
- `recommendedAction`

`status` should be one of:

- `ready`
- `limited`
- `locked`
- `upgrade-required`
- `recharge-required`

### Summary

The dashboard digest should summarize:

- total capabilities
- ready capabilities
- limited capabilities
- locked capabilities
- upgrade-required capabilities
- recharge-required capabilities
- attention capabilities

### Recommended Action

Each non-ready or near-limit capability should carry one normalized action:

- `capability`
- `label`
- `route`

Action routing should prefer:

- subscription routes for membership problems
- points routes for balance shortages
- offer routes for general upgrade exploration

## Evaluation Rules

The evaluator should follow deterministic rules:

1. If the wallet session is anonymous, the capability is `locked`.
2. If the descriptor requires a higher membership level than the current level, it is `upgrade-required`.
3. If the descriptor requires more points than are currently available, it is `recharge-required`.
4. If a quota exists and `quotaUsed >= quotaLimit`, it is `upgrade-required`.
5. If a quota exists and usage crosses the warning threshold but is not exhausted, it is `limited`.
6. If no blockers exist, it is `ready`.

The evaluator should never guess hidden backend state. It should only use explicit descriptor requirements plus the composed commerce dashboards.

## Architecture

### Headless layer

`src/entitlement.ts`

This file should define:

- descriptor and decision contracts
- digest helpers
- starter catalog helpers
- manifest helpers
- route-intent helpers
- pure evaluation logic

### Service layer

`src/entitlement-service.ts`

This file should compose:

- `@sdkwork/wallet-pc-react`
- `@sdkwork/vip-pc-react`
- `@sdkwork/points-pc-react`
- `@sdkwork/offer-pc-react`
- `@sdkwork/subscription-pc-react`

The service should produce one dashboard containing:

- evaluated capability decisions
- entitlement digest
- inventory summary
- top recommended commercial action

### State layer

`src/entitlement-controller.ts`

The controller should own:

- bootstrap and refresh
- filter state
- selected capability state
- visible decision derivation

### UI layer

`src/components/EntitlementGate.tsx`

- embeddable gate for wrapping premium surfaces
- renders children when access is ready
- renders a Claw-style commercial fallback when blocked or near-limit

`src/pages/EntitlementPage.tsx`

- routeable entitlement center
- dark hero with capability health and commercial inventory
- filter pills
- feature decision grid
- selected capability detail with upgrade CTA

## UI Direction

The visual language should blend two Claw references:

- `BillingSettings` for metric hierarchy, usage framing, and premium neutral cards
- `PointsUpgradeDialog` for high-intent commercial CTA blocks and premium upgrade emphasis

The entitlement center should feel like:

- a business-quality control room for premium access
- not a plain settings table
- not a one-off paywall modal

The page should emphasize:

- current premium posture
- blocked or near-limit features
- immediate upgrade or recharge actions
- quota and usage visibility where descriptors include limits

## Relationship To Existing Packages

### `@sdkwork/permission-pc-react`

This package is about OS, host, and platform permissions.

`@sdkwork/entitlement-pc-react` is about commercial access.

These must stay separate so hosts can independently answer:

- do I have permission to use the camera
- do I have a paid plan that unlocks this AI feature

### `@sdkwork/vip-pc-react`

VIP remains the source of membership state, plans, levels, and benefits.
Entitlement consumes VIP state, but does not replace it.

### `@sdkwork/offer-pc-react`

Offer remains the source of cross-package commercial recommendations.
Entitlement consumes offer routing so gates know where to send the user next.

## Public API

The package should expose:

- `createSdkworkEntitlementCatalog`
- `createSdkworkStarterEntitlementCatalog`
- `evaluateSdkworkEntitlementDecision`
- `summarizeSdkworkEntitlementDecisions`
- `createEntitlementWorkspaceManifest`
- `createEntitlementRouteIntent`
- `createSdkworkEntitlementService`
- `createSdkworkEntitlementController`
- `useSdkworkEntitlementController`
- `useSdkworkEntitlementControllerState`
- `SdkworkEntitlementGate`
- `SdkworkEntitlementPage`

## Integration

After the package lands:

- register it in `scripts/package-catalog.mjs`
- register it in `sdkwork-appbase-pc-react` starter catalogs
- add it to the commerce domain README
- include it in the `@sdkwork/commerce-pc-react` manifest package graph so hosts know it is part of the commercial capability stack

## Testing Strategy

This package should be locked with TDD in four layers:

- headless tests for evaluation rules, digests, manifests, and route intents
- service tests for composed dashboard and action routing
- controller tests for bootstrap, filtering, selection, and refresh
- React tests for gate fallback rendering and entitlement page interactions

## Acceptance Bar

The package is complete only when:

- commercial capability descriptors can be evaluated without app-local billing logic
- paywall and near-limit states route into shared subscription, points, or offer flows
- the gate component is reusable without a page dependency
- the entitlement page is visually aligned to the Claw commercial style
- the package is registered in appbase catalogs
- targeted tests, `pnpm typecheck`, `pnpm test`, and `pnpm run review:structure` all pass

## Approval Note

The user explicitly asked for autonomous decision-making and instructed me not to pause for approval or questions in this session. This design is therefore treated as approved for implementation.
