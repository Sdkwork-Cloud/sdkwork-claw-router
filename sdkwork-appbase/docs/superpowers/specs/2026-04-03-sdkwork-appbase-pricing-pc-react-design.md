# SDKWORK Pricing PC React Design

## Goal

Build `@sdkwork/pricing-pc-react` as the canonical reusable pricing-center package for `sdkwork-appbase`.
This package standardizes how plans, bundles, billing models, comparison tables, and recommendation routes are presented across PC React applications.

## Problem

The current commerce stack already covers wallet, points, VIP, coupon, offer, subscription, order, payment, invoice, entitlement, and billing.
What is still missing is the shared layer that defines and presents commercial packaging itself:

- how plans are normalized across subscription, prepaid, usage, and hybrid models
- how package tiers are compared in one Claw-grade pricing center
- how a desktop app routes from plan discovery into recharge, subscription, offer, or billing workspaces
- how different apps reuse a single price-book abstraction instead of rebuilding product cards and plan tables

## Package Boundary

`@sdkwork/pricing-pc-react` owns:

- pricing workspace manifest and route intent
- normalized price-book contracts
- billing-model normalization:
  - `subscription`
  - `prepaid`
  - `usage`
  - `hybrid`
- plan sorting and pricing digest helpers
- reusable plan-card and comparison-table components
- pricing service that composes wallet, subscription, offer, and billing packages
- pricing controller and routeable pricing page

`@sdkwork/pricing-pc-react` does not own:

- payment execution
- subscription mutation execution
- invoice creation lifecycle
- wallet recharge mutation execution
- billing posture analytics itself
- entitlement gating itself

## Architecture

The package follows the established `sdkwork-appbase` commerce package pattern:

1. `pricing.ts`
   Defines route intents, manifests, headless pricing contracts, sorting helpers, and digest helpers.
2. `pricing-service.ts`
   Composes data from `wallet`, `subscription`, `offer`, and `billing`.
   Produces a reusable `SdkworkPricingCatalogData`.
3. `pricing-controller.ts`
   Manages bootstrapping, filtering by billing model, selected plan state, and derived visible plans.
4. `components/*`
   Reusable Claw-style pricing UI primitives:
   - plan cards
   - comparison table
5. `pages/PricingPage.tsx`
   Routeable pricing center with a dark premium hero, plan filter rail, selected-plan summary, and comparison matrix.

## Data Model

### Core plan contract

Each pricing plan is normalized into a reusable contract with:

- identity: `id`, `title`, `description`
- commercial posture: `billingModel`, `cadence`, `serviceTier`
- pricing display: `priceCny`, `priceLabel`
- package value: `includedPoints`, `includedUsage`, `seatLimit`
- recommendation state: `recommended`, `current`, `bestFitFor`
- route execution: `ctaLabel`, `ctaRoute`
- comparison data: `featureValues`
- editorial framing: `tags`

### Pricing digest

The catalog digest summarizes:

- plan count
- current plan title
- recommended plan id
- highest savings signal from offer composition
- counts per billing model

### Feature matrix

The comparison table stays generic and reusable by standardizing these rows:

- billing model
- cadence
- included points
- usage posture
- seat limit
- budget guard
- invoice-ready

This keeps the package broadly reusable without hardcoding a single product’s private feature vocabulary.

## Service Composition Strategy

The pricing service composes existing commerce packages instead of duplicating transport logic:

- `wallet` provides balance, available points, and recharge packs
- `subscription` provides purchasable plans and current membership posture
- `offer` provides savings signals and upgrade paths
- `billing` provides budget posture and usage-awareness

Output rules:

- always create a usage-based entry plan as the baseline commercial posture
- create a prepaid plan from the recommended recharge pack when available
- normalize subscription plans from the shared subscription package
- create a hybrid enterprise plan that routes into the shared offer path
- keep route targets delegated to existing packages:
  - billing center
  - wallet recharge
  - subscription checkout
  - offer center

## UX Direction

The visual target is Claw Studio quality:

- dark premium hero section with compact operator metrics
- neutral zinc surfaces with rose/amber accents
- dense but readable information hierarchy
- plan cards that feel editorial and commercial, not template-generated
- comparison table optimized for desktop product selection

The pricing page should feel like an application-grade pricing center, not a marketing landing page.

## Integration Points

This package must be registered in:

- `packages/pc-react/commerce/sdkwork-commerce-pc-react`
- `packages/pc-react/foundation/sdkwork-appbase-pc-react`
- `packages/pc-react/commerce/README.md`
- `scripts/package-catalog.mjs`

## Testing Strategy

Use TDD across:

- headless pricing contracts and helpers
- service composition and synthesized plan generation
- controller filtering and selected-plan behavior
- plan-card rendering
- comparison-table rendering
- page bootstrapping and navigation routing

## Review Outcome

This package fills the remaining shared commercialization gap between offer discovery, subscription purchase, and billing review.
After this lands, the commerce domain will have a first-class reusable pricing layer instead of relying on package-local product presentation.
