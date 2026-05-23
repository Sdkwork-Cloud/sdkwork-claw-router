# SDKWORK Appbase Billing PC React Design

## Context

The SDKWORK appbase commerce domain already covers the operational building blocks of commercialization:

- `@sdkwork/wallet-pc-react` for balances, recharge packs, and membership wallet overview
- `@sdkwork/points-pc-react` for points history and recharge surfaces
- `@sdkwork/vip-pc-react` for membership tiers and upgrade-ready plans
- `@sdkwork/subscription-pc-react` for premium checkout flows
- `@sdkwork/order-pc-react` for billing orders
- `@sdkwork/payment-pc-react` for payment attempts and provider rails
- `@sdkwork/invoice-pc-react` for invoice lifecycle
- `@sdkwork/offer-pc-react` for commercial recommendations
- `@sdkwork/entitlement-pc-react` for commercial access decisions and paywall routing
- `@sdkwork/commerce-pc-react` for high-level business composition

This means the current stack can already answer:

- how a user upgrades
- how a user pays
- how a user recharges
- how invoices and orders move
- whether a feature is commercially blocked

But it still cannot answer one of the most important product questions for AI-native desktop software:

- what is the current billing posture
- where is spend concentrated
- which providers, models, or capabilities are driving cost
- whether the current account is close to budget or needs payment attention
- what billing action should the operator take next

That missing layer is bigger than a settings tab. Every AI-era product that sells model usage, automation runs, realtime rooms, storage, media rendering, or premium workspaces will need the same reusable billing-center package.

## Goal

Create `@sdkwork/billing-pc-react` as the reusable billing and metered consumption center for PC React applications.

The package should standardize:

- billing overview and digest models
- metered usage records and breakdowns
- budget policy and spend-alert evaluation
- composed billing posture from wallet, points, orders, payments, invoices, subscriptions, and offers
- reusable billing summary cards
- a routeable Claw-style billing center page

## Source Of Truth

The package should align to these local references:

- `claw-studio/packages/sdkwork-claw-settings/src/BillingSettings.tsx` for billing information density, premium settings-card rhythm, tabbed overview and invoice framing, and metric hierarchy
- `claw-studio/packages/sdkwork-claw-dashboard/src/services/dashboardService.ts` for how usage, revenue, and business posture are composed into one operator-facing service layer
- existing appbase commerce packages for service/controller/page boundaries and starter-manifest conventions
- `@sdkwork/ui-pc-react` for cards, badges, buttons, loading, and empty-state composition
- `@sdkwork/core-pc-react` for session-aware generated SDK client access where remote data is needed

This package should not directly transplant Claw implementation details. It should extract the reusable billing-center concepts behind that experience.

## Problem Statement

`commerce` gives a broad commercial snapshot, but it is still a general aggregation package.

`payment`, `invoice`, `order`, `wallet`, and `subscription` each solve an execution slice, but none of them own the cross-surface billing posture.

There is no reusable package that can normalize:

- usage records
- spend totals
- projected monthly cost
- budget thresholds
- payment or invoice friction
- provider / model / capability cost concentration

Into one operator-facing output:

- healthy or risky billing state
- current spend posture
- top cost drivers
- budget warning level
- next recommended action

Without this package, every future AI desktop app will reimplement:

- usage tables
- spend cards
- budget warning banners
- invoice-and-payment attention logic
- model cost rankings
- billing settings overview pages

## Approaches Considered

### Option A: Keep extending `@sdkwork/commerce-pc-react`

Pros:

- no new package to create
- simple because the commerce hub already aggregates many services

Cons:

- turns `commerce` into a catch-all shell instead of a reusable boundary
- makes billing impossible to consume without importing the whole business hub
- repeats the same over-aggregation problem that dedicated packages were introduced to avoid

### Option B: Put billing logic inside `@sdkwork/invoice-pc-react`

Pros:

- invoice is already associated with billing language
- gives one obvious route for “billing documents”

Cons:

- invoices are documents, not spend posture
- model usage, budget, provider mix, and payment attention do not belong inside invoice lifecycle code
- collapses analytics into a document-management package

### Option C: Create `@sdkwork/billing-pc-react` as a focused headless-plus-UI package

Pros:

- gives billing a reusable, portable package boundary
- keeps spend analytics, budget rules, and billing posture separate from payment or invoice execution
- fits Claw Studio's billing settings mental model
- can compose existing commerce packages without duplicating them

Cons:

- adds another package to maintain

### Recommendation

Choose Option C.

The existing architecture is strongest when each cross-app concern gets an explicit boundary. Billing is a first-class domain in AI products and should be modeled directly instead of remaining an incidental tab inside a larger commerce console.

## Package Boundary

`@sdkwork/billing-pc-react` owns:

- billing usage records and breakdown contracts
- billing totals, digest, and health evaluation helpers
- budget policies and spend-alert logic
- billing-center workspace manifest and route intents
- a composed billing dashboard service
- a filter-aware billing controller
- reusable billing summary cards and breakdown sections
- a routeable billing center page

`@sdkwork/billing-pc-react` does not own:

- payment execution
- invoice mutations
- order mutations
- subscription purchase flows
- wallet recharge execution
- entitlement access evaluation

Those remain in their existing packages. Billing consumes them and projects them into one shared operator-facing posture.

## Core Model

### Usage Record

Billing usage should normalize model- and capability-level cost records into one shape:

- `id`
- `title`
- `provider`
- `model`
- `capability`
- `workspace`
- `units`
- `unitLabel`
- `costCny`
- `usageAt`

This shape must work for:

- token-based model usage
- realtime-room minutes
- media-render jobs
- automation runs
- storage or bandwidth style consumption

### Billing Totals

The billing digest should summarize:

- `todaySpendCny`
- `monthSpendCny`
- `projectedMonthSpendCny`
- `budgetAmountCny`
- `budgetRemainingCny`
- `outstandingAmountCny`
- `savingsOpportunityCny`

### Breakdown

The dashboard should expose ranked breakdowns by:

- provider
- model
- capability
- workspace

Each breakdown row should include:

- `id`
- `label`
- `costCny`
- `share`
- `units`
- `changeRate`

### Health And Alerts

Billing posture should normalize to one of:

- `healthy`
- `watch`
- `over-budget`
- `payment-attention`

The alert system should derive concrete records from budget, outstanding payment, and invoice friction:

- `id`
- `severity`
- `title`
- `description`
- `value`
- `action`

### Recommended Action

The billing center should emit one normalized top action:

- `label`
- `route`
- `reason`
- `target`

Preferred routing should be:

- payment center when there are outstanding actionable payments
- invoice center when invoice action blocks commercial settlement
- subscription center when spend or budget posture suggests plan optimization
- commerce or offer center when the operator should review bundled savings

## Evaluation Rules

The billing evaluator should follow deterministic rules:

1. If actionable payment attempts exist with meaningful outstanding amount, posture becomes `payment-attention`.
2. If projected monthly spend exceeds the configured budget, posture becomes `over-budget`.
3. If month spend reaches the budget warning threshold but has not exceeded budget, posture becomes `watch`.
4. If invoice action is required and no payment issue is present, posture becomes `watch`.
5. Otherwise posture is `healthy`.

Budget configuration should be explicit and host-configurable. The package must not invent hidden thresholds. It can ship defaults, but they must be overridable.

## Architecture

### Headless layer

`src/billing.ts`

This file should define:

- usage, totals, digest, alert, and breakdown contracts
- manifest helpers
- route-intent helpers
- budget policy helpers
- billing-digest helpers
- billing posture evaluation logic
- usage aggregation helpers

### Service layer

`src/billing-service.ts`

This file should compose:

- `@sdkwork/wallet-pc-react`
- `@sdkwork/points-pc-react`
- `@sdkwork/subscription-pc-react`
- `@sdkwork/order-pc-react`
- `@sdkwork/payment-pc-react`
- `@sdkwork/invoice-pc-react`
- `@sdkwork/offer-pc-react`

The service should produce one dashboard containing:

- billing digest
- spend posture
- alerts
- breakdowns
- usage records
- invoice and payment attention summaries
- recommended next action

### State layer

`src/billing-controller.ts`

The controller should own:

- bootstrap and refresh
- tab selection
- breakdown filter selection
- selected usage record or breakdown focus
- visible usage list derivation

### UI layer

`src/components/BillingSummaryCards.tsx`

- reusable metrics strip for today, month, projected spend, and budget posture

`src/components/BillingBreakdownTable.tsx`

- reusable Claw-style breakdown surface

`src/pages/BillingPage.tsx`

- routeable billing center
- Claw-inspired hero with premium neutral cards
- overview and invoices attention tabs
- spend cards, budget notice, cost breakdown table, recent usage feed, and action rail

## UI Direction

The visual language should anchor on `BillingSettings.tsx` from Claw Studio:

- premium neutral cards with restrained accent usage
- dense but readable information rhythm
- one clear “this month” billing number
- one clear “usage / API cost” metric
- one clear payment-method or billing-action panel
- overview versus invoice-attention tab framing

The appbase implementation should still follow the newer reusable page language already used in `payment`, `invoice`, and `entitlement`:

- `rounded-[2rem]` hero sections
- dark premium gradient hero
- surface panel cards from `sdkwork-ui`
- bold metric typography
- consistent filter-button rhythm

The result should feel like Claw Studio's billing center translated into the appbase package system, not a generic admin table.

## Relationship To Existing Packages

### `@sdkwork/commerce-pc-react`

Commerce remains the broad business hub.
Billing becomes the specialized package for spend posture and metered consumption.

Commerce can later consume billing, but billing must remain independently reusable.

### `@sdkwork/payment-pc-react`

Payment remains the owner of payment methods, QR flows, and status mutations.
Billing consumes payment digest and actionable payment state.

### `@sdkwork/invoice-pc-react`

Invoice remains the owner of billing documents and invoice actions.
Billing consumes invoice digest and invoice attention signals.

### `@sdkwork/subscription-pc-react`

Subscription remains the owner of membership checkout.
Billing can recommend subscription routes when higher plans improve commercial efficiency.

### `@sdkwork/entitlement-pc-react`

Entitlement decides feature availability.
Billing explains spend posture and budget pressure.

These remain separate so apps can independently answer:

- can the user access this feature
- is the account spending efficiently and safely

## Public API

The package should expose:

- `createBillingWorkspaceManifest`
- `createBillingRouteIntent`
- `createSdkworkBillingBudgetPolicy`
- `summarizeSdkworkBillingUsage`
- `evaluateSdkworkBillingPosture`
- `createSdkworkBillingService`
- `createSdkworkBillingController`
- `useSdkworkBillingController`
- `useSdkworkBillingControllerState`
- `SdkworkBillingSummaryCards`
- `SdkworkBillingBreakdownTable`
- `SdkworkBillingPage`

## Integration

After the package lands:

- register it in `scripts/package-catalog.mjs`
- add it to `sdkwork-appbase-pc-react` starter catalogs
- include it in the commerce domain README
- include it in the `@sdkwork/commerce-pc-react` package graph because billing is now part of the shared commercial stack

## Testing Strategy

This package should be locked with TDD in four layers:

- headless tests for manifest, route intents, usage aggregation, budget rules, and posture evaluation
- service tests for composed billing dashboard, alert derivation, and action routing
- controller tests for bootstrap, tab filtering, selection, and refresh
- React tests for summary cards, breakdown table, and billing page tab interactions

## Acceptance Bar

The package is complete only when:

- any desktop AI app can embed a shared billing center without app-local cost logic
- budget and spend posture are derived through reusable helpers
- payment and invoice attention route into existing execution packages
- the page visually aligns to the Claw Studio billing style while following appbase package conventions
- the package is registered in appbase catalogs
- targeted tests, `pnpm typecheck`, `pnpm test`, and `pnpm run review:structure` all pass

## Approval Note

The user explicitly asked for autonomous decision-making and instructed me not to pause for approval or questions in this session. This design is therefore treated as approved for implementation.
