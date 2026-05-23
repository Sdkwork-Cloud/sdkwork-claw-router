# SDKWORK Checkout PC React Design

## Goal

Build `@sdkwork/checkout-pc-react` as the canonical reusable checkout orchestration package for `sdkwork-appbase`.
This package standardizes how PC React applications turn commercial intent into a ready-to-pay transaction session across subscription, prepaid recharge, and commercial bundle purchase flows.

## Problem

The current commerce stack already provides the major domain pieces:

- `wallet` for balance and recharge posture
- `coupon` for promotional assets and discount normalization
- `subscription` for membership package selection and mutation
- `order` for order lifecycle
- `payment` for payment method and QR-backed execution
- `invoice` for invoice lifecycle
- `pricing` for commercial package discovery
- `billing` for spend posture

What is still missing is the shared transaction layer that turns those independent capabilities into one reusable commercial flow:

- how a selected pricing or subscription package becomes a normalized checkout session
- how coupon, discount, payable amount, payment method, and invoice readiness stay synchronized
- how recharge, subscription, and hybrid commercial transactions share one summary model
- how apps reuse a consistent Claw-grade checkout surface instead of rebuilding sidebar summaries and payment rails package by package

Without a dedicated checkout package, each app must manually compose pricing, coupon, payment, order, and invoice state, which causes duplication and inconsistent behavior.

## Package Boundary

`@sdkwork/checkout-pc-react` owns:

- checkout workspace manifest and route intent
- normalized checkout source kinds:
  - `subscription`
  - `wallet-recharge`
  - `points-recharge`
  - `offer-bundle`
- checkout session contracts
- amount breakdown helpers
- payment-method normalization for checkout
- reusable checkout summary rail and payment-method picker UI
- checkout service that composes pricing, coupon, wallet, subscription, payment, order, and invoice packages
- checkout controller and routeable checkout page
- mutation orchestration that creates order intent and payment intent through existing services

`@sdkwork/checkout-pc-react` does not own:

- payment transport implementation
- order persistence or domain modeling
- subscription plan source modeling itself
- coupon inventory lifecycle
- invoice document editing forms
- billing analytics or entitlement gating

## Architecture

The package follows the established `sdkwork-appbase` commerce pattern:

1. `checkout.ts`
   Defines manifests, route intents, checkout source types, session contracts, payable breakdown helpers, and package metadata.
2. `checkout-service.ts`
   Composes pricing, wallet, coupon, subscription, order, payment, and invoice packages to produce a normalized `SdkworkCheckoutSession`.
   Also exposes mutation entrypoints for creating the transaction and hydrating the initial payment detail.
3. `checkout-controller.ts`
   Manages bootstrapping, source selection, coupon selection, payment-method selection, invoice toggles, submit state, and derived summary state.
4. `components/*`
   Reusable Claw-style checkout UI primitives:
   - payment method picker
   - checkout summary rail
5. `pages/CheckoutPage.tsx`
   Routeable commercial checkout page with a premium hero, locked package details, payment-method section, and operator-grade order summary.

## Data Model

### Checkout source

Every checkout session is normalized around a single source payload with:

- identity: `id`, `title`, `description`
- source kind: `subscription`, `wallet-recharge`, `points-recharge`, `offer-bundle`
- transaction posture: `quantity`, `unitLabel`, `billingLabel`
- pricing posture: `originalAmountCny`, `discountAmountCny`, `payableAmountCny`
- commercial context: `tags`, `recommended`, `invoiceEligible`
- route execution: source route, success route, fallback route

### Checkout session

The composed session includes:

- `source`
- `availableCoupons`
- `selectedCouponId`
- `paymentMethods`
- `selectedPaymentMethodId`
- `invoicePreference`
- `summary`
- `orderDraft`
- `paymentPreview`

### Amount summary

The summary stays generic and reusable:

- original amount
- discount amount
- payable amount
- balance coverage hint
- invoice readiness
- coupon label
- payment method label

This keeps the package useful across subscription, wallet, and curated commercial bundles.

## Source Strategy

The checkout service should normalize multiple entry points:

- `pricing` plan selections can route into checkout if the app wants a single unified purchase shell
- `subscription` plans resolve into a `subscription` checkout source
- `wallet` recommended recharge packs resolve into `wallet-recharge`
- `points` recharge plans resolve into `points-recharge`
- `offer` enterprise or curated bundles resolve into `offer-bundle`

Output rules:

- subscription flows keep coupon and payment method editable until submit
- recharge flows can disable coupon usage if the composed source does not support it
- invoice readiness must be visible at session level even when invoice editing stays delegated elsewhere
- the service should always produce a safe empty session so the page can render before remote hydration

## Mutation Strategy

The checkout package should orchestrate but not replace existing services:

- create or resolve an order draft through `order`
- create payment intent through `payment`
- route recharge flows back through `wallet` context
- route subscription purchases through `subscription` context
- surface invoice readiness through `invoice`

The package should return a normalized submit result that includes:

- order id
- payment id
- payment qr code or url if available
- final payable amount
- next recommended route

## UX Direction

The visual target is Claw Studio quality, especially the locked commercial payment views:

- dense premium surfaces with zinc-based neutral panels
- dark radial hero that frames checkout as an operator-grade payment console
- a locked transaction card that keeps package details stable during payment selection
- strong summary hierarchy for original price, discount, and payable amount
- payment method cards that feel tactile and platform-aware
- explicit invoice and balance posture hints without bloating the flow

The checkout page should feel like the final decision surface of the commerce system, not a generic form page.

## Integration Points

This package must be registered in:

- `packages/pc-react/commerce/sdkwork-commerce-pc-react`
- `packages/pc-react/foundation/sdkwork-appbase-pc-react`
- `packages/pc-react/commerce/README.md`
- `scripts/package-catalog.mjs`

## Testing Strategy

Use TDD across:

- headless checkout contracts and amount helpers
- service composition and session normalization
- controller behavior for coupon and payment selection
- payment-method picker rendering
- summary rail rendering
- page bootstrapping, selection, and submit behavior
- commerce registration and package catalog updates

## Review Outcome

This package closes the remaining shared commercialization gap between pricing discovery and payment execution.
After it lands, the commerce domain will have a reusable transaction session layer instead of scattering checkout logic across subscription, wallet, payment, and page-local components.
