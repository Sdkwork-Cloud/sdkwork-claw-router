# SDKWORK Commerce Analytics PC React Design

## Why this is the right next step

The current commerce domain in `sdkwork-appbase` already covers the transaction chain well:

- offers
- pricing
- subscription
- checkout
- wallet
- points
- payment
- order
- invoice
- billing

Compared with `claw-studio`, the missing shared layer is not checkout anymore.
It is the business-operations analytics layer above those transaction packages.

`sdkwork-commerce-pc-react` currently gives:

- top-level commercial counters
- featured offers
- recent activity lists

It does not yet give:

- revenue trend analytics
- product revenue distribution
- product performance leaderboard
- operator-grade commercial alerts

That is the strongest reusable delta still missing between `sdkwork-appbase` and `claw-studio`.

## Reference inputs

The extraction target is primarily:

- `claw-studio/packages/sdkwork-claw-core/src/services/dashboardCommerceService.ts`
- `claw-studio/packages/sdkwork-claw-dashboard/src/pages/Dashboard.tsx`
- `claw-studio/packages/sdkwork-claw-dashboard/src/components/RevenueTrendChart.tsx`
- `claw-studio/packages/sdkwork-claw-dashboard/src/components/DistributionRingChart.tsx`

The reusable package shape should stay aligned with current appbase commerce patterns:

- `sdkwork-commerce-pc-react`
- `sdkwork-billing-pc-react`
- `sdkwork-checkout-pc-react`

## Goal

Upgrade `@sdkwork/commerce-pc-react` so it becomes both:

- the high-level commercial hub
- the shared business analytics console for AI-era applications

This should let apps reuse one operator-grade commerce page for:

- wallet and subscription operations
- order and payment monitoring
- revenue visibility
- product mix analysis
- actionable commercial alerts

## Ownership boundary

`@sdkwork/commerce-pc-react` will own:

- revenue analytics contracts
- recent revenue record normalization
- product performance and revenue share summaries
- commerce alert digests
- reusable analytics components and charts
- composition of analytics over order, payment, invoice, wallet, offer, coupon, and VIP packages

It will not own:

- backend order query APIs
- product catalog CRUD
- payment provider reconciliation
- invoice issuance workflows
- checkout execution itself

## Data model additions

The snapshot should be extended with:

- `analyticsSummary`
  - total revenue
  - average order value
  - conversion-style posture
  - active alerts
- `revenueTrend`
  - ordered points with revenue, orders, average order value, and label
- `productPerformance`
  - product id
  - product title
  - order count
  - revenue
  - share
  - trend delta
- `recentRevenueRecords`
  - order id
  - timestamp
  - product name
  - channel
  - status
  - revenue amount
- `alerts`
  - id
  - title
  - description
  - severity
  - metric

The service must derive these from already-composed package data rather than introducing direct app-specific transport.

## Service approach

The service should continue to compose lower packages, then derive analytics from:

- orders
- payments
- invoices
- wallet overview
- offers
- coupons
- VIP state

Because `sdkwork-order-pc-react` and related packages already normalize transaction data, the analytics layer can stay package-composed instead of reaching into app-local DTOs.

The first version should focus on deterministic, reusable calculations:

- revenue trend buckets from recent orders
- product revenue share from order subjects and totals
- recent revenue records from recent successful and pending orders
- alerts from actionable invoice count, pending payment count, low payment-method coverage, and inactive authentication posture

## UI composition

The commerce page should remain a premium dashboard rather than a dense admin table.

Add three new reusable surfaces below the hero:

1. `CommerceAnalyticsSummary`
   High-value KPIs for revenue, AOV, order throughput, and alert posture.
2. `CommerceRevenuePanel`
   Revenue trend chart plus product distribution ring.
3. `CommerceAnalyticsWorkbench`
   Tabs or panel sections for recent revenue records, product performance, and alert list.

The visual language should stay aligned with Claw:

- editorial dark hero
- soft zinc panels
- clear metric hierarchy
- charts that still work without external chart dependencies

## Testing scope

Tests should cover:

- analytics derivation in the service
- summary component metrics
- revenue panel rendering
- analytics workbench rendering
- commerce page integration with the expanded snapshot

## Deliverable

After this lands, `@sdkwork/commerce-pc-react` will no longer be only a transaction hub.
It will become the reusable business-operations dashboard for subscription, wallet, and AI-product monetization surfaces.
